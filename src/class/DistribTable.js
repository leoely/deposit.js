import net from 'net';
import {
  getOwnIpAddresses,
  nonZeroByteArray,
} from 'manner.js/server';
import Table from './Table';

function  getBinBuf(params) {
  if (!Array.isArray(params)) {
    throw new Error('[Error] The params parameter should be an array type.');
  }
  const { length, } = params;
  if (length <= 1) {
    throw new Error('[Error] The length of the params parameter should be greater than or equal to two');
  }
  const pbytes = [];
  params.forEach((param) => {
    switch (typeof param) {
      case 'string':
        pbytes.push(Array.from(Buffer.from(param)));
        break;
      case 'number':
        if (!Number.isInteger(param)) {
          throw new Error('[Error] If the param type is a number, ite should be an integer.');
        }
        pbytes.push(Array.from(nonZeroByteArray.fromInt(param)));
        break;
    }
    pbytes.push(0);
  });
  const buf = Buffer.from(pbytes.flat());
  return buf;
}

class DistribTable extends Table {
  constructor(tb, options, port, allTables) {
    super(tb, options);
    this.dealParams(port, allTables);
  }

  static async combine(distribTables) {
    if (!Array.isArray(distribTables)) {
      throw new Error('[Error] The parameter distribTables should be of array type.');
    }
    const serverPromises = distribTables.map((distribTable) => {
      return distribTable.setUpServer();
    });
    const clientsPromises = distribTables.map((distribTable) => {
      return distribTable.setUpClients();
    });
    await Promise.all(serverPromises.concat(clientsPromises));
    distribTables.forEach((distribTable) => {
      return distribTable.setUpConnections();
    });
  }

  static async release(distribTables) {
    if (!Array.isArray(distribTables)) {
      throw new Error('[Error] The parameter distribTables should be of array type.');
    }
    distribTables.forEach((distribTable) => {
      distribTable.closeClients();
      delete distribTable.clients;
    });
    for (let i = 0; i < distribTables.length; i += 1) {
      const distribTable = distribTables[i];
      await distribTable.closeServer();
      delete distribTable.server;
    }
    distribTables.forEach((distribTable) => {
      distribTable.closeConnections();
      delete distribTable.connections;
    });
  }

  dealParams(port, allTables) {
    if (!Number.isInteger(port)) {
      throw new Error('[Error] Parameter id needs to be an integer.');
    }
    if (!(port >= 0)) {
      throw new Error('[Error] Parameter id needs to be a postive integer.');
    }
    this.port = port;
    if (!Array.isArray(allTables)) {
      throw new Error('[Error] Parameter allTables needs to be of array type.');
    }
    this.tables = allTables;
  }

  getAckPromises(callback) {
    if (typeof callback !== 'function') {
      throw new Error('[Error] Parameter callback should be a funciton type.');
    }
    return this.getClients().map((client) => {
      callback(client);
      return new Promise((resolve, reject) => {
        client.on('data', (buf) => {
          const data = buf.toString();
          switch (data) {
            case 'ack':
              resolve();
              break;
          }
        });
      });
    });
  }

  async closeServer() {
    await new Promise((resolve, reject) => {
      this.getServer().close(() => {
        resolve();
      });
    })
  }

  closeClients() {
    this.getClients().forEach((client) => {
      client.destroySoon();
    });
  }

  closeConnections() {
    const { connections, } = this;
    if (!Array.isArray(connections)) {
      throw new Error('[Error] The connections is not an array type or the combine is not complete.');
    }
    if (connections.length === 0) {
      throw new Error('[Error] The length of the connections is zero.Perhaps the combine was not completed;');
    }
    connections.forEach((connection) => {
      connection.destroySoon();
    });
  }

  getServer() {
    const { server, } = this;
    if (server === undefined) {
      throw new Error('[Error] The current distributed cluster is not combined and cannot obtain the server');
    }
    return server;
  }

  getConnections() {
    const { server, connections, } = this;
    if (server === undefined) {
      throw new Error('[Error] The current distributed cluster is not combined and cannot obtain the connections');
    }
    return connections;
  }

  getClients() {
    const { clients, } = this;
    if (clients === undefined) {
      throw new Error('[Error] The current distributed cluster is not combined and cannot obtain the clients');
    }
    return clients;
  }

  async setUpServer() {
    const {
      tables: {
        length,
      },
    } = this;
    let count = 0;
    this.connections = [];
    this.server = await new Promise((resolve, reject) => {
      const server = net.createServer((connection) => {
        count += 1;
        this.connections.push(connection);
        if (count === length) {
          resolve(server);
        }
      });
      const { port, } = this;
      server.on('error', (error) => {
        throw error;
      });
      server.listen(port);
    });
    const { server, } = this;
    return server;
  }

  async setUpClients() {
    const { tables, } = this;
    const clientPromises = tables.map((table) => {
      const [ip, port] = table;
      return new Promise((resolve, reject) => {
        const client = net.createConnection(port, ip, () => {
          client.ip = ip;
          client.port = port;
          resolve(client);
        });
        client.on('close', () => {
          const { ip, port, } = client;
          this.removeTable(ip, port);
        });
      });
    });
    this.clients = await Promise.all(clientPromises);
    const { client, } = this;
    return client;
  }

  setUpConnections() {
    this.getConnections().forEach((connection) => {
      connection.on('data', (buf) => {
        this.dealConnectionBuf(buf, connection);
      });
    });
  }

  dealConnectionBuf(buf, connection) {
    const segments = [];
    let s = 0;
    for (let i = 0; i < buf.length; i += 1) {
      if (buf[i] === 0) {
        segments.push(buf.slice(s, i));
        s = i + 1;
      }
    }
    const bigInt1 = nonZeroByteArray.toInt(segments.shift())
    const code = Number(bigInt1);
    const params = segments.map((segment, index) => {
      return nonZeroByteArray.toInt(segment);
    });
    switch (code) {
      case 0: {
        if (params.length !== 2) {
          throw new Error('[Error] The remaining parameter lengths do not match convertion.');
        }
        const [id, total] = params;
        this.deleteExchange(Number(id), Number(total), true);
        connection.write('ack');
        break;
      }
      case 1: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameter lengths do not match convertion.');
        }
        const [id] = params;
        this.deleteDataById(Number(id));
        this.outOfOrder = true;
        this.full = false;
        connection.write('ack');
        break;
      }
      case 2: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters lengths do not match convertion.');
        }
        const [id] = params;
        this.deleteDataById(Number(id));
        this.outOfOrder = true;
        this.full = false;
        connection.write('ack');
        break;
      }
      case 3: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters lengths do not match convertion.');
        }
        const [id1, id2] = params;
        this.deleteDataById(Number(id1));
        this.deleteDataById(Number(id2));
        this.outOfOrder = true;
        this.full = false;
        connection.write('ack');
        break;
      }
      case 4: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters lengths do not match convertion.');
        }
        const [highId] = params;
        this.exchangeHighIndex(Number(highId), true);
        connection.write('ack');
        break;
      }
      default:
        throw new Error('[Error] The code value should be in the range [0, 5]');
    }
  }

  removeTable(ip, port) {
    const { tables, } = this;
    for (let i = 0; i < tables.length; i += 1) {
      const [tableIp, tablePort] = tables[i];
      if (tableIp === ip && tablePort === port) {
        tables.splice(i, 1);
        const { clients, } = this;
        if (Array.isArray(clients)) {
          clients.splice(i, 1);
          clients[i].destroySoon();
        }
        break;
      }
    }
  }

  checkCombine() {
    const { server, clients, } = this;
    if (server === undefined || clients === undefined) {
      throw new Error('[Error] Distributed node integration is not yet complete.');
    }
  }

  async insertDistrib(cnt) {
    this.checkCombine();
    await this.insert(cnt);
  }

  async deleteExchangeDistrib(id, total) {
    this.checkCombine();
    await this.deleteExchange(id, total);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([0, id, total]));
    });
    await Promise.all(ackPromises);
  }

  async deleteAllDistrib(ids) {
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      await deleteDistrib(id);
    }
  }

  async deleteDistrib(id) {
    this.checkCombine();
    await this.delete(id);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([1, id]));
    });
    await Promise.all(ackPromises);
  }

  async updateDistrib(obj) {
    this.checkCombine();
    await this.update(obj);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([2, obj.id]))
    });
    await Promise.all(ackPromises);
  }

  async exchangeContentDistrib(id1, id2) {
    this.checkCombine();
    await this.exchangeContent(id1, id2);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([3, id1, id2]))
    });
    await Promise.all(ackPromises);
  }

  async exchangeHighIndexDistrib(highId) {
    this.checkCombine();
    const mapping = await this.exchangeHighIndex(highId);
    const ackPromises = this.getAckPromises((client) => {
      client.write(getBinBuf([4, highId]))
    });
    await Promise.all(ackPromises);
    return mapping;
  }
}

export default DistribTable;
