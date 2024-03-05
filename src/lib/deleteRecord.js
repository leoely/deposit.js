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
  if (type === 'mysql') {
    return deleteRecordInMysql(connection, tb, id);
  } else {
    return deleteRecordInPostgresql(connection, tb, id);
  }
}
