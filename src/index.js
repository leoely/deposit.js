import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

global.users.tb = new Users();

async function main() {
  const global_users_tb = global.users.tb;
  await global_users_tb.insert([
    { id: 15, name: 'royal', age: 34, gender: 1, city: 'athens', country: 'america', },
    { id: 16, name: 'silas', age: 58, gender: 0, city: 'marion', country: 'america', },
    { id: 17, name: 'eloise', age: 38, gender: 0, city: 'prichard', country: 'america', },
    { id: 18, name: 'oscar', age: 59, gender: 0, city: 'sylacauga', country: 'america', },
    { id: 19, name: 'eleanor', age: 83, gender: 0, city: 'tuscaloosa', country: 'america', },
  ]);
  let users = await global_users_tb.select([15, 19]);
  console.log(users);
  //await global_users_tb.update({ id: 16, age: 18, });
  //users = await global_users_tb.select([16, 16]);
  //await global_users_tb.delete(19);
  //users = await global_users_tb.select([19, 19]);
  //await global_users_tb.deleteExchange(15, 19);
  //users = await global_users_tb.select([18, 18]);
  //await global_users_tb.deleteExchange(16, 18);
  //await global_users_tb.deleteExchange(17, 17);
  //await global_users_tb.deleteExchange(18, 16);
}

main();
