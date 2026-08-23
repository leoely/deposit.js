import DistribTable from '~/class/DistribTable';
import mysqlKeepIdOptions from '~/obj/mysqlKeepIdOptions';

class MysqlKeepIdDistribUsers extends DistribTable {
  constructor(port, allTables) {
    super('users', mysqlKeepIdOptions, port, allTables);
  }
}

export default MysqlKeepIdDistribUsers;
