import Table from '~/class/Table';
import mysqlOptions from '~/obj/mysqlOptions';

class MysqlUsers extends Table {
  constructor() {
    super('users', mysqlOptions);
  }
}

export default MysqlUsers;
