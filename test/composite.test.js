import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlNoHighIndexUsers';
import global from '~/obj/global';

const first = 41;
const second = 42;
const third = 43;
const fourth = 44;
const fifth = 45;

beforeAll(async () => {
  global.noHighIndexUsers.tb = new Users();
});

describe('[class] Composite test cases;', () => {
  test('Insert arbitrarliy records;', async () => {
    const global_noHighIndexUsers_tb = global.noHighIndexUsers.tb;
    await global_noHighIndexUsers_tb.insert([
      { id: first, name: 'royal', age: 34, gender: 1, city: 'athens', country: 'america', },
      { id: second, name: 'silas', age: 58, gender: 0, city: 'marion', country: 'america', },
      { id: third, name: 'eloise', age: 38, gender: 0, city: 'prichard', country: 'america', },
      { id: fourth, name: 'oscar', age: 59, gender: 0, city: 'sylacauga', country: 'america', },
      { id: fifth, name: 'eleanor', age: 83, gender: 0, city: 'tuscaloosa', country: 'america', },
    ]);
    const users = await global_noHighIndexUsers_tb.select([first, fifth]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":41,\"name\":\"royal\",\"age\":34,\"gender\":1,\"city\":\"athens\",\"country\":\"america\"},{\"id\":42,\"name\":\"silas\",\"age\":58,\"gender\":0,\"city\":\"marion\",\"country\":\"america\"},{\"id\":43,\"name\":\"eloise\",\"age\":38,\"gender\":0,\"city\":\"prichard\",\"country\":\"america\"},{\"id\":44,\"name\":\"oscar\",\"age\":59,\"gender\":0,\"city\":\"sylacauga\",\"country\":\"america\"},{\"id\":45,\"name\":\"eleanor\",\"age\":83,\"gender\":0,\"city\":\"tuscaloosa\",\"country\":\"america\"}]');
  });
  test('Update arbitrarliy record;', async () => {
    const global_noHighIndexUsers_tb = global.noHighIndexUsers.tb;
    await global_noHighIndexUsers_tb.update({ id: second, age: 18, });
    const users = await global_noHighIndexUsers_tb.select([second, second]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":42,\"name\":\"silas\",\"age\":18,\"gender\":0,\"city\":\"marion\",\"country\":\"america\"}]');
  });
  test('Delete arbitrarliy record;', async () => {
    const global_noHighIndexUsers_tb = global.noHighIndexUsers.tb;
    await global_noHighIndexUsers_tb.delete(fifth);
    const users = await global_noHighIndexUsers_tb.select([fifth, fifth]);
    expect(JSON.stringify(users)).toMatch('[null]');
  });
  test('Delete exchange arbitrarliy record;', async () => {
    const global_noHighIndexUsers_tb = global.noHighIndexUsers.tb;
    await global_noHighIndexUsers_tb.deleteExchange(first, fifth);
    const users = await global_noHighIndexUsers_tb.select([fourth, fourth]);
    expect(JSON.stringify(users)).toMatch('[null]');
  });
});

afterAll(async () => {
  const global_noHighIndexUsers_tb = global.noHighIndexUsers.tb;
  await global_noHighIndexUsers_tb.deleteExchange(second, fourth);
  await global_noHighIndexUsers_tb.deleteExchange(third, third);
  await global_noHighIndexUsers_tb.deleteExchange(fourth, second);
});
