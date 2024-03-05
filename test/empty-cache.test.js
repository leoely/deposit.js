import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[class] Users empty cache test case;', () => {
  test('select first arbitrarliy record;', async () => {
    const users = await global.users.tb.select([4, 6], ['age', 'gender']);
    expect(JSON.stringify(users)).toMatch('[{\"age\":23,\"gender\":1},{\"age\":33,\"gender\":1},{\"age\":53,\"gender\":1}]');
  });
  test('select second arbitrarliy record;', async () => {
    const users = await global.users.tb.select([2, 8], ['age', 'name', 'city']);
    expect(JSON.stringify(users)).toMatch('[{\"age\":23,\"name\":\"thomas\",\"city\":\"florence\"},{\"age\":32,\"name\":\"david\",\"city\":\"walpi\"},{\"age\":23,\"gender\":1,\"name\":\"joseph\",\"city\":\"winslow\"},{\"age\":33,\"gender\":1,\"name\":\"william\",\"city\":\"helena\"},{\"age\":53,\"gender\":1,\"name\":\"michael\",\"city\":\"morrilton\"},{\"age\":23,\"name\":\"george\",\"city\":\"arcadia\"},{\"age\":25,\"name\":\"alexander\",\"city\":\"coronado\"}]');
  });
  test('select third arbitrarliy record;', async () => {
    const users = await global.users.tb.select([6, 9], ['gender', 'city']);
    expect(JSON.stringify(users)).toMatch('[{\"age\":53,\"gender\":1,\"name\":\"michael\",\"city\":\"morrilton\"},{\"age\":23,\"name\":\"george\",\"city\":\"arcadia\",\"gender\":1},{\"age\":25,\"name\":\"alexander\",\"city\":\"coronado\",\"gender\":1},{\"gender\":1,\"city\":\"eureka\"}]');
  });
  test('select fourth arbitrarliy record;', async () => {
    const users = await global.users.tb.select([10, 12], ['id', 'name', 'age'], true);
    expect(JSON.stringify(users)).toMatch('[{\"id\":10,\"name\":\"taylor\",\"age\":23},{\"id\":11,\"name\":\"emily\",\"age\":23},{\"id\":12,\"name\":\"emma\",\"age\":23}]');
  });
  test('select fifth arbitrarliy record;', async () => {
    const users = await global.users.tb.select([7, 13], ['name', 'age'], true);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"george\",\"age\":23},{\"name\":\"alexander\",\"age\":25},{\"name\":\"john\",\"age\":25},{\"name\":\"taylor\",\"age\":23},{\"name\":\"emily\",\"age\":23},{\"name\":\"emma\",\"age\":23},{\"name\":\"particia\",\"age\":24}]');
  });
  test('check empty cache situation;', async () => {
    const global_users_tb = global.users.tb;
    global.users.tb.emptyCache();
    expect(JSON.stringify(global_users_tb.datas)).toMatch('[]');
    expect(JSON.stringify(global_users_tb.hash)).toMatch('{}');
    expect(JSON.stringify(global_users_tb.counts)).toMatch('[]');
  });
});
