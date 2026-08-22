import timersPromises from 'timers/promises';
import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlKeepIdUsers';
import global from '~/obj/testGlobal';

const first = 50;
const second = 51;
const third = 52;

const stringifyBigInt = (key, value) => typeof value === "bigint" ? JSON.rawJSON(value.toString()) : value;

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] keep id test cases;', () => {
  test('Test keep id situations;', async () => {
    await timersPromises.setTimeout(2300);

    const global_users_tb = global.users.tb;

    await global_users_tb.insert({ id: first, name: 'sharon', age: 34, gender: 0, city: 'seattle', country: 'america', });
    const users1 = await global_users_tb.select([first, first]);
    expect(JSON.stringify(users1)).toMatch('[{\"id\":50,\"name\":\"sharon\",\"age\":34,\"gender\":0,\"city\":\"seattle\",\"country\":\"america\"}]');
    expect(JSON.stringify(global_users_tb.replace.positive.gain(first), stringifyBigInt)).toMatch('{\"id\":0,\"count\":1}');
    expect(JSON.stringify(global_users_tb.replace.positive.gain(0), stringifyBigInt)).toMatch('{\"id\":50,\"count\":1}');
    expect(global_users_tb.replace.reverse.gain(first)).toBe(0);
    expect(global_users_tb.replace.reverse.gain(0)).toBe(first);
    const users2 = await global_users_tb.select([first, first]);
    expect(JSON.stringify(users2)).toMatch('[{\"id\":50,\"name\":\"sharon\",\"age\":34,\"gender\":0,\"city\":\"seattle\",\"country\":\"america\"}]');
    const users3 = await global_users_tb.select([first, first]);
    expect(JSON.stringify(users3)).toMatch('[{\"id\":50,\"name\":\"sharon\",\"age\":34,\"gender\":0,\"city\":\"seattle\",\"country\":\"america\"}]');
    expect(JSON.stringify(global_users_tb.replace.positive.gain(first), stringifyBigInt)).toMatch('{\"id\":0,\"count\":3}');
    global_users_tb.setTemporaryMemorySwitch(true);
    const users4 = await global_users_tb.select([first, first]);
    expect(JSON.stringify(users4)).toMatch('[{\"id\":50,\"name\":\"sharon\",\"age\":34,\"gender\":0,\"city\":\"seattle\",\"country\":\"america\"}]');
    global_users_tb.setTemporaryMemorySwitch(false);
    await global_users_tb.insert({ id: second, name: 'jerald', age: 41, gender: 1, city: 'dallas', country: 'america', });
    await global_users_tb.insert({ id: third, name: 'percy', age: 28, gender: 0, city: 'denver', country: 'america', });
    const users5 = await global_users_tb.select([second, second]);
    expect(JSON.stringify(users5)).toMatch('[{\"id\":51,\"name\":\"jerald\",\"age\":41,\"gender\":1,\"city\":\"dallas\",\"country\":\"america\"}]');
    const users6 = await global_users_tb.select([third, third]);
    expect(JSON.stringify(users6)).toMatch('[{\"id\":52,\"name\":\"percy\",\"age\":28,\"gender\":0,\"city\":\"denver\",\"country\":\"america\"}]');
    const users7 = await global_users_tb.select([second, second]);
    expect(JSON.stringify(users7)).toMatch('[{\"id\":51,\"name\":\"jerald\",\"age\":41,\"gender\":1,\"city\":\"dallas\",\"country\":\"america\"}]');
    const users8 = await global_users_tb.select([second, second]);
    expect(JSON.stringify(users8)).toMatch('[{\"id\":51,\"name\":\"jerald\",\"age\":41,\"gender\":1,\"city\":\"dallas\",\"country\":\"america\"}]');
    const users9 = await global_users_tb.select([third, third]);
    expect(JSON.stringify(users9)).toMatch('[{\"id\":52,\"name\":\"percy\",\"age\":28,\"gender\":0,\"city\":\"denver\",\"country\":\"america\"}]');
    const users10 = await global_users_tb.select([first, first]);
    expect(JSON.stringify(users10)).toMatch('[{\"id\":50,\"name\":\"sharon\",\"age\":34,\"gender\":0,\"city\":\"seattle\",\"country\":\"america\"}]');
    const users11 = await global_users_tb.select([first, first]);
    expect(JSON.stringify(users11)).toMatch('[{\"id\":50,\"name\":\"sharon\",\"age\":34,\"gender\":0,\"city\":\"seattle\",\"country\":\"america\"}]');
  });
});
