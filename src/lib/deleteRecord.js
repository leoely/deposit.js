function deleteRecordInMysql(connection, tb, id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM ' + tb + ' WHERE id=' + id;
    connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function deleteRecordInPostgresql(connection, tb, id) {
  return connection.then((conn) => {
    return conn.query('DELETE FROM ' + tb + ' WHERE id=' + id).then((res) => res.rows);
  });
}

export default function deleteRecord(type, connection, tb, id) {
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
    throw new Error('[Error] The parameter should be of integer type.');
  }
  if (type === 'mysql') {
    return deleteRecordInMysql(connection, tb, id);
  } else {
    return deleteRecordInPostgresql(connection, tb, id);
  }
}
