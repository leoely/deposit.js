import { Pool, } from 'pg';

const client = new Pool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'depositjs',
});

const options = {
  type: 'postgresql',
  connection: client.connect(),
  memorySafeLine: 50,
  logLevel: 1,
};

export default options;
