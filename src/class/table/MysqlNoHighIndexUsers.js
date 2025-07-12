import Table from '~/class/Table';
import mysqlNoHighIndexOptions from '~/obj/mysqlNoHighIndexOptions';

class MysqlNoHighIndexUsers extends Table {
  constructor() {
    super('users', mysqlNoHighIndexOptions);
  }
}

export default MysqlNoHighIndexUsers;
