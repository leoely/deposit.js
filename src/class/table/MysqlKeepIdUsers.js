import Table from '~/class/Table';
import mysqlKeepIdOptions from '~/obj/mysqlKeepIdOptions';

class MysqlKeepIdUsers extends Table {
  constructor() {
    super('users', mysqlKeepIdOptions);
  }
}

export default MysqlKeepIdUsers;
