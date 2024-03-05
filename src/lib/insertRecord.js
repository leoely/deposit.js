import formateVal from '~/lib/util/formateVal';

function getCols(obj) {
  return formateBracket(Object.keys(obj));
}

function getVals(obj, type) {
  return formateBracket(
    Object.keys(obj).map((k) => {
      const val = obj[k];
      if (typeof val === 'string') {
        return formateVal(val, type);
      } else {
        return val;
      }
  }));
}

function formateBracket(list) {
  return '(' + list.join(',') + ')';
}

function insertRecordInMysql(connection, tb, objs) {
  return new Promise((resolve, reject) => {
    const values = objs.map((o) => getVals(o, 'double')).join(',');
    const sql = 'INSERT INTO ' + tb + getCols(objs[0]) + ' VALUES ' + values;
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

function insertRecordInPostgresql(connection, tb, objs) {
  return connection.then((conn) => {
    const values = objs.map((o) => getVals(o, 'single')).join(',');
    const sql = 'INSERT INTO ' + tb + getCols(objs[0]) + ' VALUES ' + values;
    return conn.query(sql).then((res) => res.rows);
  });
}

export default function insertRecord(type, connection, tb, objs) {
  if (type === 'mysql') {
    return insertRecordInMysql(connection, tb, objs);
  } else {
    return insertRecordInPostgresql(connection, tb, objs);
  }
}
