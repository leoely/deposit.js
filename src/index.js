import Users from '~/class/table/PostgresqlUsers';
import global from '~/obj/global';

global.users.tb = new Users();

async function main() {
  //const global_users_tb = global.users.tb;
  //await global_users_tb.insert([
    //{ id: 15, name: 'bethany', age: 59, gender: 0, city: 'honolulu', country: 'america', },
    //{ id: 16, name: 'samantha', age: 29, gender: 0, city: 'anahemim', country: 'america', },
    //{ id: 17, name: 'patricia', age: 58, gender: 0, city: 'pittsburgh', country: 'america', },
    //{ id: 18, name: 'jacob', age: 38, gender: 1, city: 'baltimore', country: 'america', },
    //{ id: 19, name: 'kyle', age: 43, gender: 1, city: 'milwaukee', country: 'america', },
    //{ id: 20, name: 'liam', age: 49, gender: 1, city: 'albuquerque', country: 'america', },
    //{ id: 21, name: 'noah', age: 29, gender: 1, city: 'tucson', country: 'america', },
    //{ id: 22, name: 'damian', age: 49, gender: 1, city: 'fresno', country: 'america', },
    //{ id: 23, name: 'reece', age: 34, gender: 1, city: 'sacramento', country: 'america', },
    //{ id: 24, name: 'kyle', age: 83, gender: 1, city: 'atlanta', country: 'america', },
    //{ id: 25, name: 'noah', age: 37, gender: 1, city: 'mesa', country: 'america', },
    //{ id: 26, name: 'tracy', age: 59, gender: 0, city: 'ealeigh', country: 'america', },
    //{ id: 27, name: 'amelia', age: 12, gender: 0, city: 'omaha', country: 'america', },
    //{ id: 28, name: 'lsla', age: 49, gender: 0, city: 'long beach', country: 'america', },
    //{ id: 29, name: 'poppy', age: 58, gender: 0, city: 'oakland', country: 'america', },
    //{ id: 30, name: 'susan', age: 39, gender: 0, city: 'minneapolis', country: 'america', },
    //{ id: 31, name: 'abigail', age: 29, gender: 0, city: 'tulsa', country: 'america', },
    //{ id: 32, name: 'elizabeth', age: 58, gender: 0, city: 'bakeersfield', country: 'america', },
    //{ id: 33, name: 'lsabella', age: 39, gender: 0, city: 'new orleans', country: 'america', },
    //{ id: 34, name: 'mia', age: 19, gender: 0, city: 'henderson', country: 'america', },
    //{ id: 35, name: 'barbara', age: 48, gender: 0, city: 'anaheim', country: 'america', },
    //{ id: 36, name: 'lsla', age: 49, gender: 0, city: 'saint paul', country: 'america', },
    //{ id: 37, name: 'wendy', age: 34, gender: 0, city: 'greensboro', country: 'america', },
    //{ id: 38, name: 'charlie', age: 58, gender: 1, city: 'portland', country: 'america', },
    //{ id: 39, name: 'connor', age: 28, gender: 1, city: 'detroit', country: 'america', },
    //{ id: 40, name: 'callum', age: 43, gender: 1, city: 'memphis', country: 'america', },
  //]);
  //let users = await global_users_tb.select([15, 40]);
  //console.log(users);
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
