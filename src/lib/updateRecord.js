import Table from '~/class/Table';
import formateVal from '~/lib/util/formateVal';

function generateWhere(tb, id) {
  if (id === undefined) {
    return '';
  } else {
    return ' WHERE ' + tb + '.id=' + id;
  }
}

function getTuple(obj, type) {
  return Object.keys(obj).filter(k => k !== 'id').map((k) => k + ' = ' + formateVal(obj[k], type)).join(',');
}

function updateRecordInMysql(connection, tb, obj, instance) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE ' + tb + ' SET ' + getTuple(obj, 'double') + generateWhere(tb, obj.id);
    connection.query(sql, (error, results) => {
        if (error) {
          reject(error);
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

function updateRecordInPostgresql(connection, tb, obj, instance) {
  return connection.then((conn) => {
    const sql = 'UPDATE ' + tb + ' SET ' + getTuple(obj, 'single') + generateWhere(tb, obj.id);
    return conn.query(sql).then((res) => {
      if (instance !== undefined) {
        instance.sqls.push(sql);
      }
      return res.rows;
    });
  });
}

export default function updateRecord(type, connection, tb, obj, instance) {
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
  if (typeof obj !== 'object') {
    throw new Error('[Error] The parameter obj should be of object type.');
  }
  if (instance !== undefined) {
    if (!(instance instanceof Table)) {
      throw new Error('[Error] Parameter instance should be for table type.');
    }
  }
  if (type === 'mysql') {
    return updateRecordInMysql(connection, tb, obj, instance);
  } else {
    return updateRecordInPostgresql(connection, tb, obj, instance);
  }
}
