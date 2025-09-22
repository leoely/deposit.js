//export { default as Table, } from '~/class/Table';
//export { default as DistribTable, } from '~/class/DistribTable';

import { getOwnIpAddresses, wrapIpv6, } from 'manner.js/server';
import DistribTable from '~/class/DistribTable';
import DistribUsers from '~/class/table/MysqlDistribUsers';
import global from '~/obj/testGlobal';

async function main() {
  const [ipAddress] = getOwnIpAddresses();
  const { ipv4, } = ipAddress;
  const tables = [
    [ipv4, 8000],
    [ipv4, 8001],
  ];
  global.users.tb1 = new DistribUsers(8000, tables);
  global.users.tb2 = new DistribUsers(8001, tables);
  const global_users_tb1 = global.users.tb1;
  const global_users_tb2 = global.users.tb2;
  await DistribTable.combine([global_users_tb1, global_users_tb2]);
  await global_users_tb1.updateDistrib({ id: 'fadsfas', name: 'aron', age: 34, gender: 1, city: 'boston', country: 'america', });
}

main();
