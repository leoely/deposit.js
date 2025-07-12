import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Select arrange test case;', () => {
  test('select first arbitrarliy record;', async () => {
    const users = await global.users.tb.select([5, 7], ['age', 'gender', 'city']);
    expect(JSON.stringify(users)).toMatch('[{\"age\":33,\"gender\":1,\"city\":\"helena\"},{\"age\":53,\"gender\":1,\"city\":\"morrilton\"},{\"age\":23,\"gender\":1,\"city\":\"arcadia\"}]');
  });
  test('select first arrange column record;', async () => {
    const users = await global.users.tb.select([2, 10], ['name', 'age'], true);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"thomas\",\"age\":23},{\"name\":\"david\",\"age\":32},{\"name\":\"joseph\",\"age\":23},{\"name\":\"william\",\"age\":33},{\"name\":\"michael\",\"age\":53},{\"name\":\"george\",\"age\":23},{\"name\":\"alexander\",\"age\":25},{\"name\":\"john\",\"age\":25},{\"name\":\"taylor\",\"age\":23}]');
  });
  test('select second arrange column duplicate record;', async () => {
    const users = await global.users.tb.select([9, 12], ['gender', 'city', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fullerton\",\"country\":\"america\"}]');
  });
  test('select third arrange column duplicate record;', async () => {
    const users = await global.users.tb.select([1, 5], ['age', 'gender'], true);
    expect(JSON.stringify(users)).toMatch('[{\"age\":22,\"gender\":1},{\"age\":23,\"gender\":1},{\"age\":32,\"gender\":1},{\"age\":23,\"gender\":1},{\"age\":33,\"gender\":1}]');
  });
  test('select fourth arrange column duplicate record;', async () => {
    const users = await global.users.tb.select([3, 11], ['city', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"city\":\"walpi\",\"country\":\"america\"},{\"city\":\"winslow\",\"country\":\"america\"},{\"city\":\"helena\",\"country\":\"america\"},{\"city\":\"morrilton\",\"country\":\"america\"},{\"city\":\"arcadia\",\"country\":\"america\"},{\"city\":\"coronado\",\"country\":\"america\"},{\"city\":\"eureka\",\"country\":\"america\"},{\"city\":\"fairfield\",\"country\":\"america\"},{\"city\":\"fremont\",\"country\":\"america\"}]');
  });
  test('select fifth arrange column duplicate record;', async () => {
    const users = await global.users.tb.select([7, 9], ['id', 'name'], true);
    expect(JSON.stringify(users)).toMatch('[{\"id\":7,\"name\":\"george\"},{\"id\":8,\"name\":\"alexander\"},{\"id\":9,\"name\":\"john\"}]');
  });
});
