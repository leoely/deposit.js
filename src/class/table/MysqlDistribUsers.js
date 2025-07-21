import DistribTable from '~/class/DistribTable';
import mysqlNoHighIndexOptions from '~/obj/mysqlNoHighIndexOptions';

class MysqlDistribUsers extends DistribTable {
  constructor(port, allTables) {
    super('users', mysqlNoHighIndexOptions, port, allTables);
  }
}

export default MysqlDistribUsers;
