import timersPromises from 'timers/promises';
import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, getAddress, } from 'manner.js/server';
import DistribTable from '~/class/DistribTable';
import DistribUsers from '~/class/table/MysqlDistribUsers';
import global from '~/obj/testGlobal';

beforeAll(() => {
  const [ipAddress] = getOwnIpAddresses();
  const { ipv4, } = ipAddress;
  const tables = [
    [ipv4, 8011],
    [ipv4, 8012],
  ];
  global.users.tb12 = new DistribUsers(8011, tables);
  global.users.tb13 = new DistribUsers(8012, tables);
  global.users.tb14 = new DistribUsers(8013, tables);
});

describe('[Class] Distributed addSystemNotice test cases;', () => {
  test('Test distributed addSystemNotice operations.', async () => {
    await timersPromises.setTimeout(2800);
    const global_users_tb12 = global.users.tb12;
    const global_users_tb13 = global.users.tb13;
    const global_users_tb14 = global.users.tb14;
    const global = { address1: '', address2: '', };
    const newTables = [
      [ipv4, 8011],
      [ipv4, 8012],
      [ipv4, 8013],
    ];
    await DistribTable.combine([global_users_tb12, global_users_tb13]);
    global_users_tb14.setGlobal(global);
    global_users_tb14.addSystemNotice('add>table', (global, ip, port) => {
      global.address1 = getAddress(ip, port);
    });
    await DistribTable.join([global_users_tb14], [global_users_tb12, global_users_tb13], newTables);
    expect(global.address1).toMatch('ifadsfadsfdsa');
    webDistribRouter3.addSystemNotice('rm>router', (global, ip, port) => {
      global.address2 = getAddress(ip, port);
    });
    await webDistribRouter3.close();
    expect(global.address2).toMatch('ifadsfadsfdsa');
    await DistribTable.release([global_users_tb12, global_users_tb13]);
  });
});
