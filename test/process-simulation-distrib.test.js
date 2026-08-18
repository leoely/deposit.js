import timersPromises from 'timers/promises';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, } from 'manner.js/server';
import DistribTable from '~/class/DistribTable';
import DistribUsers from '~/class/table/MysqlDistribUsers';
import global from '~/obj/testGlobal';

const first = 49;

beforeAll(() => {
  const [ipAddress] = getOwnIpAddresses();
  const { ipv4, } = ipAddress;
  const tables = [
    [ipv4, 8005],
    [ipv4, 8006],
    [ipv4, 8007],
  ];
  global.users.tb5 = new DistribUsers(8005, tables);
  global.users.tb6 = new DistribUsers(8006, tables);
  global.users.tb7 = new DistribUsers(8007, tables);
});

describe('[Class] Distributed proceesSimulation test cases;', () => {
  test('Test distributed addSystemNotice operations.', async () => {
    await timersPromises.setTimeout(2050);
    const global_users_tb5 = global.users.tb5;
    const global_users_tb6 = global.users.tb6;
    const global_users_tb7 = global.users.tb7;
    await DistribTable.combine([global_users_tb5, global_users_tb6, global_users_tb7]);
    await global_users_tb6.close();
    await global_users_tb5.insertDistrib({ id: first, name: 'donna', age: 29, gender: 0, city: 'delaware', country: 'america', });
    const users1 = await global_users_tb5.select([first, first]);
    expect(JSON.stringify(users1)).toMatch('[{\"id\":0,\"name\":\"donna\",\"age\":29,\"gender\":0,\"city\":\"delaware\",\"country\":\"america\"}]');
    const users2 = await global_users_tb5.select([0, 0]);
    expect(JSON.stringify(users2)).toMatch('[{\"id\":0,\"name\":\"donna\",\"age\":29,\"gender\":0,\"city\":\"delaware\",\"country\":\"america\"}]');
  });
});
