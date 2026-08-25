import EventEmitter from 'events';
import net from 'net';
import {
  logUncaughtException,
  getOwnIpAddresses,
  ByteArray,
  getAddress,
  getGTMNowString,
} from 'manner.js/server';
import Table from './Table';

const stringifyBigInt = (key, value) => typeof value === "bigint" ? JSON.rawJSON(value.toString()) : value;
const nonZeroByteArray = new ByteArray({ size: 256n, shift: 1n, });

function getBinBuf(params) {
  if (!Array.isArray(params)) {
    throw new Error('[Error] The params parameter should be an array type.');
  }
  const { length, } = params;
  if (length <= 1) {
    throw new Error('[Error] The length of the parameters should be greater than or equal to two');
  }
  const pbytes = [];
  params.forEach((param) => {
    switch (typeof param) {
      case 'string':
        pbytes.push(Array.from(Buffer.from(param)));
        break;
      case 'number':
        if (!Number.isInteger(param)) {
          throw new Error('[Error] If the param type is a number, it should be an integer.');
        }
        pbytes.push(Array.from(nonZeroByteArray.fromInt(param)));
        break;
    }
    pbytes.push(0);
  });
  const buf = Buffer.from(pbytes.flat());
  return buf;
}

function addBufferFlag(flag, buffer) {
  if (!Number.isInteger(flag)) {
    throw new Error('[Error] The parameter flag should be an integer type');
  }
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('[Error] The parameter buffer should be of type buffer.');
  }
  const fbytes = Buffer.from([flag]);
  return Buffer.concat([fbytes, buffer]);
}

function formatTables(tables) {
  return '[' + tables.join(', ') + ']';
}

const bindedEventKey = Symbol('bindedEvent');

class DistribTable extends Table {
  constructor(tb, options, port, allTables) {
    super(tb, options);
    this.global = null;
    this.dealParams(port, allTables);
    this.eventEmitter = new EventEmitter();
    this.dealReceiveBuffer = this.dealReceiveBuffer.bind(this);
    this.dealReceiveAndSendBuffer = this.dealReceiveAndSendBuffer.bind(this);
    this.count = 0;
    this.bindEvent();
    this.checkMemory();
  }

  bindEvent() {
    const {
      options: {
        logPath,
      },
    } = this;
    if (process[bindedEventKey] !== true) {
      process.once('uncaughtException', async (error, origin) => {
        await this.close();
        logUncaughtException(logPath, error);
        throw error;
      });
      process.once('exit', async (code) => {
        await this.close();
      });
      process[bindedEventKey] = true;
    }
  }

  async close() {
    try {
      const { ip, port, } = this;
      await this.removeTableDistrib([ip, port]);
      this.closeClients();
      delete this.clients;
      this.closeConnections();
      delete this.connections;
      this.closeServer();
      delete this.server;
      this.outputDistribOperate('start');
    } catch (error) {
      this.outputDistribOperateError('close', error);
    }
  }

  async start() {
    try {
      const serverPromise = this.setUpServer();
      const clientsPromise = this.setUpClients();
      await Promise.all([serverPromise, clientsPromise]);
      this.setUpSockets(true);
      const {
        notice,
        global,
      } = this;
      const callback = notice.gain('add>table');
      if (typeof callback === 'function') {
        if (global !== undefined) {
          callback(global, ip, port);
        }
      }
      this.checkMemory();
      this.outputDistribOperate('start');
    } catch (error) {
      this.outputDistribOperateError('start', error);
    }
  }

  static async combine(distribTables) {
    if (!Array.isArray(distribTables)) {
      throw new Error('[Error] The parameter distribTables should be of array type.');
    }
    const startPromises = distribTables.map((distribTable) => {
      return distribTable.start();
    });
    await Promise.all(startPromises);
  }

  static async join(newDistribTables, originDistribTables, allTables) {
    originDistribTables.forEach((originDistribTable) => {
      originDistribTable.setAllTables(allTables);
    });
    distribTables = originDistribTables.concat(newDistribTables);
    distribTables.forEach((distribTable, index) => {
      distribTableindex = index;
    });
    await DistribTable.combine(newDistribTables);
  }

  static async release(distribTables) {
    if (!Array.isArray(distribTables)) {
      throw new Error('[Error] The parameter distribTables should be of array type.');
    }
    distribTables.forEach((distribTable) => {
      distribTable.closeClients();
      delete distribTable.clients;
    });
    distribTables.forEach((distribTable) => {
      distribTable.closeConnections();
      delete distribTable.connections;
    });
    for (let i = 0; i < distribTables.length; i += 1) {
      const distribTable = distribTables[i];
      await distribTable.closeServer();
      delete distribTable.server;
    }
  }

  setGlobal(global) {
    this.global = global;
    this.checkMemory();
  }

  setAllTables(allTables) {
    if (Array.isArray(allTables) !== true) {
      throw new Error('[Error] The parameter all tables should be array type.');
    }
    const { port, } = this;
    const ipAddresses = getOwnIpAddresses();
    const locations = [];
    ipAddresses.forEach((ipAddress) => {
      const { ipv4, ipv6, } = ipAddress;
      locations.push(getAddress(ipv4, port));
      locations.push(getAddress(ipv6, port));
    });
    const hash = {};
    allTables = allTables.map((table, index) => {
      const [ip, port] = table;
      return [ip, port, index];
    });
    const tables = allTables.filter((table, index) => {
      const [_, port] = table;
      if (hash[port] === undefined) {
        hash[port] = true;
      } else {
        throw new Error('[Error] A port can only be bound to one table');
      }
      let flag = true;
      for (let i = 0; i< locations.length ; i += 1) {
        const location = locations[i];
        const [ip] = table;
        if (getAddress(ip, port) === location) {
          const [ip] = table;
          this.index = index;
          this.ip = ip;
          flag = false;
          break;
        }
      }
      return flag;
    });
    const { ip, } = this;
    this.address = getAddress(ip, this.port);
    this.tables = tables;
    this.checkMemory();
  }

  dealParams(port, allTables) {
    if (!Number.isInteger(port)) {
      throw new Error('[Error] Parameter port needs to be an integer.');
    }
    if (!(port >= 0)) {
      throw new Error('[Error] Parameter port needs to be a postive integer.');
    }
    this.port = port;
    if (!Array.isArray(allTables)) {
      throw new Error('[Error] Parameter allTables needs to be of array type.');
    }
    const ipAddresses = getOwnIpAddresses();
    const locations = [];
    ipAddresses.forEach((ipAddress) => {
      const { ipv4, ipv6, } = ipAddress;
      locations.push(getAddress(ipv4, port));
      locations.push(getAddress(ipv6, port));
    });
    const hash = {};
    allTables = allTables.map((table, index) => {
      const [ip, port] = table;
      return [ip, port, index];
    });
    const tables = allTables.filter((table, index) => {
      const [_, port] = table;
      if (hash[port] === undefined) {
        hash[port] = true;
      } else {
        throw new Error('[Error] A port can only be bound to one table');
      }
      let flag = true;
      for (let i = 0; i< locations.length ; i += 1) {
        const location = locations[i];
        const [ip] = table;
        if (getAddress(ip, port) === location) {
          const [ip] = table;
          this.index = index;
          this.ip = ip;
          flag = false;
          break;
        }
      }
      return flag;
    });
    const { ip, } = this;
    this.address = getAddress(ip, this.port);
    this.tables = tables;
  }

  getTables() {
    const { tables, } = this;
    if (!Array.isArray(tables)) {
      throw new Error('[Error] The status of the tables is abnormal.');
    }
    return tables;
  }

  outputDistribOperate(operate) {
    if (typeof operate !== 'string') {
      throw new Error('[Error] The parameter operate must be of string type.');
    }
    const {
      tb,
      options: {
        debug,
      },
      constructor: {
        name,
      },
    } = this;
    operate = operate.split(' ').map((word) => {
      return word[0].toUpperCase() + word.substring(1, word.length);
    }).join(' ');
    const tables = this.getTables();
    if (debug === true) {
      const {
        fulmination,
      } = this;
      fulmination.scan(`
        (+) bold: "&"& (+) bold: * Class "[ (+) black; bgWhite: ` + name + `(+) bold: "] Operate "[ (+) black; bgWhite: ` + operate + `(+) bold: "] Successfully executed and completed. 2&
        (+) bold: "[ (+) black; bgWhite: Topology (+) bold: "] ++ * (+) underline: "b` + formatTables(tables) + `" &
        (+) bold: "[ (+) black; bgWhite: Date (+) bold: "] @@ * (+) underline: "b` + getGTMNowString() + `" 2&
      `);
    }
    this.appendToLog('Class:(' + name + ') ████ & ████ ' + 'Operate:(' + operate + ') ████ & ████ ' + 'Topology:' + formatTables(tables));
  }

  outputDistribOperateError(operate, error) {
    if (typeof operate !== 'string') {
      throw new Error('[Error] The parameter operate must be of string type.');
    }
    if (!(error instanceof Error)) {
      throw new Error('[Error] Parameter error should be of error type.');
    }
    const {
      tb,
      options: {
        debug,
      },
      constructor: {
        name,
      },
    } = this;
    operate = operate.split(' ').map((word) => {
      return word[0].toUpperCase() + word.substring(1, word.length);
    }).join(' ');
    const tables = this.getTables();
    if (debug === true) {
      const {
        fulmination,
      } = this;
      fulmination.scan(`
        (+) red; bold: !! (+) bold: * Class "[ (+) black; bgRed: ` + name + `(+) bold: "] Operate "[ (+) black; bgRed: ` + operate + `(+) bold: "] An error occurred during execution. 2&
        (+) bold: "[ (+) black; bgRed: Topology (+) bold: "] ++ * (+) underline: "b` + formatTables(tables) + `" &
        (+) bold: "[ (+) black; bgRed: Date (+) bold: "] @@ * (+) underline: "b` + getGTMNowString() + `" 2&
      `);
    }
    this.appendToLog('Class:(' + name + ') ████ & ████ ' + 'Operate:(' + operate + ') ████ & ████ ' + 'Topology:' + formatTables(tables));
    this.addToLog(error.stack + '\n');
    throw error;
  }

  getAckPromises(callback) {
    if (typeof callback !== 'function') {
      throw new Error('[Error] Parameter callback should be a funciton type.');
    }
    const { eventEmitter, } = this;
    return this.getSockets().map((socket) => {
      callback(socket);
      return new Promise((resolve, reject) => {
        eventEmitter.once('data:receive', (buffer) => {
          const data = buffer.toString();
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
    try {
      await new Promise((resolve, reject) => {
        this.getServer().close(() => {
          resolve();
        });
      })
      this.outputDistribOperate('close server');
    } catch (error) {
      this.outputDistribOperateError('close server', error);
    }
  }

  closeClients() {
    try {
      this.getClients().forEach((client) => {
        client.destroySoon();
      });
      this.outputDistribOperate('close client');
    } catch (error) {
      this.outputDistribOperateError('close server', error);
    }
  }

  closeConnections() {
    try {
      const { connections, } = this;
      if (!Array.isArray(connections)) {
        throw new Error('[Error] The connections is not an array type or the combine is not complete.');
      }
      connections.forEach((connection) => {
        connection.destroySoon();
      });
      this.outputDistribOperate('close connection');
    } catch (error) {
      this.outputDistribOperateError('close connection', error);
    }
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

  getSockets() {
    this.checkCombine();
    return this.sockets;
  }

  dealReceiveAndSendBuffer(buffer, socket) {
    const flag = buffer[0];
    const {
      length,
    } = buffer;
    buffer = buffer.subarray(1, length);
    switch (flag) {
      case 0: {
        const {
          eventEmitter,
        } = this;
        eventEmitter.emit('data:receive', buffer);
        break;
      }
      case 1: {
        console.log(buffer);
        this.dealReceiveBuffer(buffer, socket);
        break;
      }
    }
  }

  async setUpServer() {
    try {
      const {
        tables: {
          length,
        },
      } = this;
      this.connections = [];
      const { index, } = this;
      if (length - index === 0) {
        this.server = net.createServer((connection) => {
          this.count += 1;
          this.connections.push(connection);
          connection.on('close', () => {
            this.removeConnection(connection);
          });
          connection.on('data', (buffer) => {
            this.dealReceiveAndSendBuffer(buffer, connection);
          });
          this.setUpSockets(false);
        });
        const { server, } = this;
        server.on('error', (error) => {
          throw error;
        });
        const { port, } = this;
        server.listen(port);
      } else {
        this.server = await new Promise((resolve, reject) => {
          const server = net.createServer((connection) => {
            this.count += 1;
            this.connections.push(connection);
            connection.on('close', () => {
              this.removeConnection(connection);
            });
            const { count, } = this;
            if (count === length - index) {
              resolve(server);
            } else if (count > length - index) {
              connection.on('data', (buffer) => {
                this.dealReceiveAndSendBuffer(buffer, connection);
              });
              this.setUpSockets(false);
            }
          });
          const { port, } = this;
          server.on('error', (error) => {
            throw error;
          });
          server.listen(port);
        });
      }
      this.checkMemory();
      this.outputDistribOperate('setUp server');
    } catch (error) {
      this.outputDistribOperateError('setUp server', error);
    }
  }

  async setUpClients() {
    try {
      const { tables, index, } = this;
      const clientPromises = [];
      tables.map((table) => {
        const [_1, _2, i] = table;
        if (index > i && i >= 0) {
          const [ip, port] = table;
          const clientPromise = new Promise((resolve, reject) => {
            const client = net.createConnection(port, ip, () => {
              client.ip = ip;
              client.port = port;
              resolve(client);
            });
            client.on('close', () => {
              const { ip, port, } = client;
              this.removeClient(client);
            });
          });
          clientPromises.push(clientPromise);
        }
      });
      this.clients = await Promise.all(clientPromises);
      this.checkMemory();
      this.outputDistribOperate('setUp client');
    } catch (error) {
      this.outputDistribOperateError('setUp client', error);
    }
  }

  setUpSockets(bind) {
    if (typeof bind !== 'boolean') {
      throw new Error('[Error] The parameter bind should be boolean type.');
    }
    try {
      const { clients, connections, } = this;
      this.sockets = clients.concat(connections);
      const { sockets, } = this;
      if (bind === true) {
        sockets.forEach((socket) => {
          socket.on('data', (buffer) => {
            this.dealReceiveAndSendBuffer(buffer, socket);
          });
        })
      }
      this.checkMemory();
      this.outputDistribOperate('setUp socket');
    } catch (error) {
      this.outputDistribOperateError('setUp socket', error);
    }
  }

  dealReceiveBuffer(buf, socket) {
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
    let params;
    switch (code) {
      case 11:
        params = segments.map((segment, index) => {
          switch (index) {
            case 0:
              return JSON.parse(segment.toString());
          }
        });
        break;
      case 10:
        params = segments.map((segment) => {
          const bigInt = nonZeroByteArray.toInt(segment);
          switch (bigInt) {
            case 0n:
              return false;
            case 1n:
              return true;
          }
        });
        break;
      case 4:
        params = segments.map((segment, index) => {
          switch (index) {
            case 0:
              return segment.toString();
            case 1:
              return new Function('return ' + segment.toString())();
          }
        });
        break;
      case 5:
        params = segments.map((segment, index) => {
          switch (index) {
            case 0:
              return segment.toString();
            case 1:
              return nonZeroByteArray.toInt(segment);
          }
        });
        break;
      default:
        params = segments.map((segment) => {
          return nonZeroByteArray.toInt(segment);
        });
    }
    switch (code) {
      case 0: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const [id, total] = params;
        this.deleteExchange(Number(id), Number(total), true);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 1: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameter length should be equal to one.');
        }
        const [id] = params;
        this.deleteDataById(Number(id));
        this.outOfOrder = true;
        this.full = false;
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 2: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const [id1, id2] = params;
        this.deleteDataById(Number(id1));
        this.deleteDataById(Number(id2));
        this.outOfOrder = true;
        this.full = false;
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 3: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameter length should be equal to one.');
        }
        const [highId] = params;
        const mapping = this.exchangeHighIndex(Number(highId), true);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        return mapping;
      }
      case 4: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const [phrase, callback] = params;
        this.addSystemNotice(phrase, callback);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 5: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const table = params;
        this.removeTable(table);
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 6: {
        if (params.length !== 3) {
          throw new Error('[Error] The parameters length should be equal to three.');
        }
        const [key, id, count] = params;
        const {
          replace: {
            positive,
          },
        } = this;
        positive.attach(Number(key), { id: Number(id), count, });
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 7: {
        if (params.length !== 2) {
          throw new Error('[Error] The parameters length should be equal to two.');
        }
        const [key, id] = params;
        const {
          replace: {
            reverse,
          },
        } = this;
        reverse.attach(Number(key), Number(id));
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 8: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters length should be equal to one.');
        }
        const [key] = params;
        const {
          replace: {
            positive,
          },
        } = this;
        positive.ruin(Number(key));
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 9: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters length should be equal to one.');
        }
        const [key] = params;
        const {
          replace: {
            reverse,
          },
        } = this;
        reverse.ruin(Number(key));
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 10: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters length should be equal to one.');
        }
        const [outOfOrder] = params;
        const {
          replace,
        } = this;
        replace.outOfOrder = outOfOrder;
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 11: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters length should be equal to one.');
        }
        const [orders] = params;
        const {
          replace,
        } = this;
        replace.orders = orders;
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      case 12: {
        if (params.length !== 1) {
          throw new Error('[Error] The parameters length should be equal to one.');
        }
        const [id] = params;
        this.deleteDataById(id);
        if (this.outOfOrder !== false) {
          this.outOfOrder = false;
        }
        if (this.full !== true) {
          this.full = true;
        }
        socket.write(addBufferFlag(0, Buffer.from('ack')));
        break;
      }
      default:
        throw new Error('[Error] The code value should be in the range [0, 11].');
    }
  }

  removeClient(client) {
    try {
      const { clients, } = this;
      if (clients !== undefined) {
        for (let i = 0; i < clients.length; i += 1) {
          const currentClient = clients[i];
          if (client === currentClient) {
            clients.splice(i, 1);
            currentClient.destroySoon();
            this.setUpSockets(false);
            break;
          }
        }
        this.outputDistribOperate('remove client');
      }
    } catch (error) {
      this.outputDistribOperateError('remove client', error);
    }
  }

  removeConnection(connection) {
    try {
      const { connections, } = this;
      if (connections !== undefined) {
        for (let i = 0; i < connections.length; i += 1) {
          const currentConnection = connections[i];
          if (connection === connections[i]) {
            connections.splice(i, 1);
            currentConnection.destroySoon();
            this.setUpSockets(false);
            break;
          }
        }
        this.outputDistribOperate('remove connection');
      }
    } catch (error) {
      this.outputDistribOperateError('remove connection', error);
    }
  }

  removeTable([ip, port]) {
    const { tables, } = this;
    this.tables = tables.filter(([rIp, rPort]) => {
      if (rIp === ip && rPort === port) {
        return false;
      } else {
        return true;
      }
    });
  }

  checkCombine() {
    const { server, clients, } = this;
    if (server === undefined || clients === undefined) {
      throw new Error('[Error] Distributed node integration is not yet complete.');
    }
  }

  async insertDistrib(cnt) {
    try {
      this.checkCombine();
      await this.insert(cnt);
      this.outputDistribOperate('insert distrib');
    } catch (error) {
      this.outputDistribOperateError('insert distrib', error);
    }
  }

  async deleteExchangeDistrib(id, total) {
    try {
      this.checkCombine();
      await this.deleteExchange(id, total);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([0, id, total])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('deleteExchange distrib');
    } catch (error) {
      this.outputDistribOperateError('deleteExchange distrib', error);
    }
  }

  async deleteAllDistrib(ids) {
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      await deleteDistrib(id);
    }
    this.outputDistribOperate('deleteAll distrib');
  }

  async deleteDistrib(id) {
    try {
      this.checkCombine();
      await this.delete(id);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([1, id])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('delete distrib');
    } catch (error) {
      this.outputDistribOperateError('delete distrib', error);
    }
  }

  async updateDistrib(obj) {
    try {
      this.checkCombine();
      await this.update(obj);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([1, obj.id])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('update distrib');
    } catch (error) {
      this.outputDistribOperateError('update distrib', error);
    }
  }

  async exchangeContentDistrib(id1, id2) {
    try {
      this.checkCombine();
      await this.exchangeContent(id1, id2);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([2, id1, id2])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('exchangeContent distrib');
    } catch (error) {
      this.outputDistribOperateError('exchangeContent distrib', error);
    }
  }

  async exchangeHighIndexDistrib(highId) {
    try {
      this.checkCombine();
      const mapping = await this.exchangeHighIndex(highId);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([3, highId])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('exchangeHighIndex distrib');
      return mapping;
    } catch (error) {
      this.outputDistribOperateError('exchangeHighIndex distrib');
    }
  }

  async addSystemNoticeDistrib(phrase, callback) {
    try {
      this.checkCombine();
      this.addSystemNotice(phrase, callback);
      const ackPromises = this.getAckPromises((client) => {
        client.write(addBufferFlag(1, getBinBuf([4, phrase, callback.toString()])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('addSystemNotice distrib');
    } catch (error) {
      this.outputDistribOperateError('addSystemNotice distrib', error);
    }
  }

  async removeTableDistrib(table) {
    try {
      this.checkCombine();
      this.removeTable(table);
      const [ip, port] = table;
      const {
        notice,
        global,
      } = this;
      const callback = notice.gain('rm>table');
      if (typeof callback === 'function') {
        if (global !== undefined) {
          callback(global, ip, port);
        }
      }
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([5, ip, port])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('removeTable distrib');
    } catch (error) {
      this.outputDistribOperateError('removeTable distrib', error);
    }
  }

  async attachPositiveDistrib(key, complex) {
    try {
      this.checkCombine();
      const {
        replace: {
          positive,
        },
      } = this;
      positive.attach(key, complex);
      const {
        id,
        count,
      } = complex;
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([6, key, id, count])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('attachPositivee distrib');
    } catch (error) {
      this.outputDistribOperateError('attachPositive distrib', error);
    }
  }

  async attachReverseDistrib(key, id) {
    try {
      this.checkCombine();
      const {
        replace: {
          reverse,
        },
      } = this;
      reverse.attach(key, id);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([7, key, id])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('attachReverse distrib');
    } catch (error) {
      this.outputDistribOperateError('attachReverse distrib', error);
    }
  }

  async ruinPositiveDistrib(key) {
    try {
      this.checkCombine();
      const {
        replace: {
          positive,
        },
      } = this;
      positive.ruin(key);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([8, key])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('ruinPositive distrib');
    } catch (error) {
      this.outputDistribOperateError('ruinPositive distrib', error);
    }
  }

  async ruinReverseDistrib(key) {
    try {
      this.checkCombine();
      const {
        replace: {
          reverse,
        },
      } = this;
      reverse.ruin(key);
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([9, key])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('ruinReverse distrib');
    } catch (error) {
      this.outputDistribOperateError('ruinReverse distrib', error);
    }
  }

  async setReplaceOutOfOrderDistrib(outOfOrder) {
    try {
      this.checkCombine();
      const {
        replace,
      } = this;
      replace.outOfOrder = outOfOrder;
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([10, outOfOrder])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('setReplaceOutOfOrder distrib');
    } catch (error) {
      this.outputDistribOperateError('setReplaceOutOfOrder distrib', error);
    }
  }

  async setReplaceOrdersDistrib(orders) {
    try {
      this.checkCombine();
      const {
        replace,
      } = this;
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([11, JSON.stringify(orders, stringifyBigInt)])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('setReplaceOrders distrib');
    } catch (error) {
      this.outputDistribOperateError('setReplaceOrders distrib', error);
    }
  }

  async deleteDataByIdDistrib(id) {
    try {
      this.checkCombine();
      this.deleteDataById(id);
      if (this.outOfOrder !== false) {
        this.outOfOrder = false;
      }
      if (this.full !== true) {
        this.full = true;
      }
      const ackPromises = this.getAckPromises((socket) => {
        socket.write(addBufferFlag(1, getBinBuf([12, id])));
      });
      await Promise.all(ackPromises);
      this.outputDistribOperate('deleteDataById distrib');
    } catch (error) {
      this.outputDistribOperateError('deleteDataById distrib', error);
    }
  }
}

export default DistribTable;
