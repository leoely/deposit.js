import Table from '~/class/Table';
import postgresqlNoHighIndexOptions from '~/obj/postgresqlNoHighIndexOptions';

class PostgresqlNoHighIndexUsers extends Table {
  constructor() {
    super('users', postgresqlNoHighIndexOptions);
  }
}

export default PostgresqlNoHighIndexUsers;
