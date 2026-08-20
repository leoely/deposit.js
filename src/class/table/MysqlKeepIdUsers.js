import Table from '~/class/Table';
import mysqlKeepIdOptions from '~/obj/mysqlKeepIdOptions';

class MysqlUsers extends Table {
  constructor() {
    super('users', mysqlKeepIdOptions);
  }
}

export default MysqlUsers;
