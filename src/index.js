export { default as Table, } from '~/class/Table';
export { default as DistribTable, } from '~/class/DistribTable';

import DistribTable from '~/class/DistribTable';
import DistribUsers from '~/class/table/MysqlDistribUsers';

async function main() {
  const tables = [
    ['192.168.1.5', 8000],
    ['192.168.1.5', 8001],
  ];
  const distribUsers1  = new DistribUsers(8000, tables);
  const distribUsers2  = new DistribUsers(8001, tables);
  await DistribTable.combine([distribUsers1, distribUsers2]);
  await distribUsers1.insertDistrib({ id: 41, name: 'callum', age: 43, gender: 1, city: 'memphis', country: 'america', })
}

main();
