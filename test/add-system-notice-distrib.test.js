import timersPromises from 'timers/promises';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, } from 'manner.js/server';
import DistribTable from '~/class/DistribTable';
import DistribUsers from '~/class/table/MysqlDistribUsers';
import global from '~/obj/testGlobal';

const first = 47;
const second = 48;

beforeAll(() => {
  const [ipAddress] = getOwnIpAddresses();
  const { ipv4, } = ipAddress;
  const tables = [
    [ipv4, 8003],
    [ipv4, 8004],
  ];
  global.users.tb4 = new DistribUsers(8003, tables);
  global.users.tb5 = new DistribUsers(8004, tables);
});

describe('[Class] Distributed addSystemNotice test cases;', () => {
  test('Test distributed addSystemNotice operations.', async () => {
    await timersPromises.setTimeout(2000);
    const global_users_tb4 = global.users.tb4;
    const global_users_tb5 = global.users.tb5;
    await DistribTable.combine([global_users_tb4, global_users_tb5]);
    const global1 = {
      first: true,
      value1: 10,
      value2: 10,
    };
    global_users_tb4.setGlobal(global1);
    const global2 = {
      first: true,
      value1: 20,
      value2: 20,
    };
    global_users_tb5.setGlobal(global2);
    global_users_tb4.setTemporaryDiskSwitch(true);
    global_users_tb5.setTemporaryDiskSwitch(true);
    await global_users_tb4.addSystemNoticeDistrib('disk>rem', (global) => {
      if (global !== undefined) {
        global.value2 += 1;
      }
    });
    await global_users_tb4.insertDistrib({ id: first, name: 'jerald', age: 24, gender: 1, city: 'schenectady', country: 'america', });
    await global_users_tb5.insertDistrib({ id: second, name: 'percy', age: 35, gender: 0, city: 'holyoke', country: 'america', });
    expect(global1.value2).toBe(11);
    expect(global2.value2).toBe(21);
    global_users_tb4.setTemporaryDiskSwitch(false);
    global_users_tb5.setTemporaryDiskSwitch(false);
    global_users_tb4.setTemporaryMemorySwitch(true);
    global_users_tb5.setTemporaryMemorySwitch(true);
    await global_users_tb4.addSystemNoticeDistrib('mem>chk', (global) => {
      if (global !== undefined && global.first === true) {
        global.value1 += 1;
        global.first = false;
      }
    });
    const users1 = await global_users_tb4.select([first, first]);
    expect(JSON.stringify(users1)).toMatch('[{\"id\":0,\"name\":\"jerald\",\"age\":24,\"gender\":1,\"city\":\"schenectady\",\"country\":\"america\"}]');
    const users2 = await global_users_tb5.select([second, second]);
    expect(JSON.stringify(users2)).toMatch('[{\"id\":0,\"name\":\"percy\",\"age\":35,\"gender\":0,\"city\":\"holyoke\",\"country\":\"america\"}]');
    expect(global1.value1).toBe(11);
    expect(global2.value1).toBe(21);
    global_users_tb4.setTemporaryMemorySwitch(false);
    global_users_tb5.setTemporaryMemorySwitch(false);
    await DistribTable.release([global_users_tb4, global_users_tb5]);
  });
});
