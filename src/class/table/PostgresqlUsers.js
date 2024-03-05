import Table from '~/class/Table';
import postgresqlOptions from '~/obj/postgresqlOptions';

class PostgresqlUsers extends Table {
  constructor() {
    super('users', postgresqlOptions);
  }
}

export default PostgresqlUsers;
