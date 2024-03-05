import { Pool, } from 'pg';

const client = new Pool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'recordsjs',
});

const options = {
  type: 'postgresql',
  connection: client.connect(),
  recordUseCount: true,
};

export default options;
