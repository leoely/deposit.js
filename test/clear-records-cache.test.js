import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Clear records cache test case;', () => {
  test('select first arbitrarliy record;', async () => {
    const users = await global.users.tb.select([2, 8], ['age', 'city', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"age\":23,\"city\":\"florence\",\"country\":\"america\"},{\"age\":32,\"city\":\"walpi\",\"country\":\"america\"},{\"age\":23,\"city\":\"winslow\",\"country\":\"america\"},{\"age\":33,\"city\":\"helena\",\"country\":\"america\"},{\"age\":53,\"city\":\"morrilton\",\"country\":\"america\"},{\"age\":23,\"city\":\"arcadia\",\"country\":\"america\"},{\"age\":25,\"city\":\"coronado\",\"country\":\"america\"}]');
  });
  test('select second arbitrarliy record;', async () => {
    const users = await global.users.tb.select([4, 9], ['id', 'age'], true);
    expect(JSON.stringify(users)).toMatch('[{\"id\":4,\"age\":23},{\"id\":5,\"age\":33},{\"id\":6,\"age\":53},{\"id\":7,\"age\":23},{\"id\":8,\"age\":25},{\"id\":9,\"age\":25}]');
  });
  test('select third arbitrarliy record;', async () => {
    const users = await global.users.tb.select([6, 8], ['gender', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"gender\":1,\"country\":\"america\"},{\"gender\":1,\"country\":\"america\"},{\"gender\":1,\"country\":\"america\"}]');
  });
  test('select fourth arbitrarliy record;', async () => {
    const users = await global.users.tb.select([4, 12], ['name', 'city'], true);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"joseph\",\"city\":\"winslow\"},{\"name\":\"william\",\"city\":\"helena\"},{\"name\":\"michael\",\"city\":\"morrilton\"},{\"name\":\"george\",\"city\":\"arcadia\"},{\"name\":\"alexander\",\"city\":\"coronado\"},{\"name\":\"john\",\"city\":\"eureka\"},{\"name\":\"taylor\",\"city\":\"fairfield\"},{\"name\":\"emily\",\"city\":\"fremont\"},{\"name\":\"emma\",\"city\":\"fullerton\"}]');
  });
  test('select fifth arbitrarliy record;', async () => {
    const users = await global.users.tb.select([7, 9], ['id', 'gender', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"id\":7,\"gender\":1,\"country\":\"america\"},{\"id\":8,\"gender\":1,\"country\":\"america\"},{\"id\":9,\"gender\":1,\"country\":\"america\"}]');
  });
  test('check clear records cache situation;', async () => {
    const global_users_tb = global.users.tb;
    expect(JSON.stringify(global_users_tb.datas)).toMatch('[null,null,{\"age\":23,\"city\":\"florence\",\"country\":\"america\"},{\"age\":32,\"city\":\"walpi\",\"country\":\"america\"},{\"age\":23,\"city\":\"winslow\",\"country\":\"america\",\"id\":4,\"name\":\"joseph\"},{\"age\":33,\"city\":\"helena\",\"country\":\"america\",\"id\":5,\"name\":\"william\"},{\"age\":53,\"city\":\"morrilton\",\"country\":\"america\",\"id\":6,\"gender\":1,\"name\":\"michael\"},{\"age\":23,\"city\":\"arcadia\",\"country\":\"america\",\"id\":7,\"gender\":1,\"name\":\"george\"},{\"age\":25,\"city\":\"coronado\",\"country\":\"america\",\"id\":8,\"gender\":1,\"name\":\"alexander\"},{\"id\":9,\"age\":25,\"name\":\"john\",\"city\":\"eureka\",\"gender\":1,\"country\":\"america\"},{\"name\":\"taylor\",\"city\":\"fairfield\"},{\"name\":\"emily\",\"city\":\"fremont\"},{\"name\":\"emma\",\"city\":\"fullerton\"}]');
    global_users_tb.reduceRecordsCache(4);
    expect(global_users_tb.datas[2]).toBe(undefined);
    expect(global_users_tb.datas[3]).toBe(undefined);
    expect(global_users_tb.datas[10]).toBe(undefined);
    expect(global_users_tb.datas[11]).toBe(undefined);
  });
});
