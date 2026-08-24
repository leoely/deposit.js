import timersPromises from 'timers/promises';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, } from 'manner.js/server';
import DistribTable from '~/class/DistribTable';
import DistribUsers from '~/class/table/MysqlKeepIdDistribUsers';
import global from '~/obj/testGlobal';

const first = 53;
const second = 54;
const third = 55;

const stringifyBigInt = (key, value) => typeof value === "bigint" ? JSON.rawJSON(value.toString()) : value;

beforeAll(() => {
  const [ipAddress] = getOwnIpAddresses();
  const { ipv4, } = ipAddress;
  const tables = [
    [ipv4, 8008],
    [ipv4, 8009],
    [ipv4, 8010],
  ];
  global.users.tb9 = new DistribUsers(8008, tables);
  global.users.tb10 = new DistribUsers(8009, tables);
  global.users.tb11 = new DistribUsers(8010, tables);
});

describe('[Class] keep id distributed test cases;', () => {
  test('Test keep id distributed situations;', async () => {
    await timersPromises.setTimeout(2600);

    const global_users_tb9 = global.users.tb9;
    const global_users_tb10 = global.users.tb10;
    const global_users_tb11 = global.users.tb11;

    await DistribTable.combine([global_users_tb9, global_users_tb10, global_users_tb11]);

    await global_users_tb10.insertDistrib({ id: first, name: 'warren', age: 25, gender: 1, city: 'auburn', country: 'america', });
    //const users1 = await global_users_tb9.select([first, first]);
    //expect(JSON.stringify(users1, stringifyBigInt)).toMatch('fasdfasdf');
    console.log('--------------');
    const users2 = await global_users_tb10.select([first, first]);
    //expect(JSON.stringify(users2, stringifyBigInt)).toMatch('fasdfasdf');
    //const users3 = await global_users_tb11.select([first, first]);
    //expect(JSON.stringify(users3, stringifyBigInt)).toMatch('fasdfasdf');

    await DistribTable.release([global_users_tb9, global_users_tb10, global_users_tb11]);
  });
});
