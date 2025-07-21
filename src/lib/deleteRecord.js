import Table from '~/class/Table';

function deleteRecordInMysql(connection, tb, id, instance) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM ' + tb + ' WHERE id=' + id;
    connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (instance !== undefined) {
            instance.sqls.push(sql);
          }
          resolve(results);
        }
      }
    );
  });
}

function deleteRecordInPostgresql(connection, tb, id, instance) {
  return connection.then((conn) => {
    const sql = 'DELETE FROM ' + tb + ' WHERE id=' + id;
    return conn.query(sql).then((res) => {
      if (instance !== undefined) {
        instance.sqls.push(sql);
      }
      return res.rows;
    });
  });
}

export default function deleteRecord(type, connection, tb, id, instance) {
  if (typeof type !== 'string') {
    throw new Error('[Error] The parameter type is a string type.');
  }
  const {
    constructor: {
      name,
    },
  } = connection;
  if (!(name === 'Promise' || name === 'Pool')) {
    throw new Error('[Error] The parameter connection should be of Promise type of Pool type.');
  }
  if (typeof tb !== 'string') {
    throw new Error('[Error] The parameter tb is a string type.');
  }
  if (!(Number.isInteger(id) || id instanceof BigInt)) {
    throw new Error('[Error] The parameter id should be of integer type.');
  }
  if (instance !== undefined) {
    if (!(instance instanceof Table)) {
      throw new Error('[Error] Parameter instance should be for table type.');
    }
  }
  if (type === 'mysql') {
    return deleteRecordInMysql(connection, tb, id, instance);
  } else {
    return deleteRecordInPostgresql(connection, tb, id, instance);
  }
}
