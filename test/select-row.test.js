import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[class] Users select row test case;', () => {
  test('select first arbitrarliy records;', async () => {
    const users = await global.users.tb.select([0, 2], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"james\",\"age\":21},{\"name\":\"ovlier\",\"age\":22},{\"name\":\"thomas\",\"age\":23}]');
  });
  test('select second arbitrarliy records;', async () => {
    const users = await global.users.tb.select([4 , 5], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"joseph\",\"age\":23},{\"name\":\"william\",\"age\":33}]');
  });
  test('select third arbitrarliy records;', async () => {
    const users = await global.users.tb.select([7 , 10], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"george\",\"age\":23},{\"name\":\"alexander\",\"age\":25},{\"name\":\"john\",\"age\":25},{\"name\":\"taylor\",\"age\":23}]');
  });
  test('select arbitrarliy interspersed records;', async () => {
    const users = await global.users.tb.select([1 , 6], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"ovlier\",\"age\":22},{\"name\":\"thomas\",\"age\":23},{\"name\":\"david\",\"age\":32},{\"name\":\"joseph\",\"age\":23},{\"name\":\"william\",\"age\":33},{\"name\":\"michael\",\"age\":53}]');
  });
  test('select four arbitarliy records;', async () => {
    const users = await global.users.tb.select([6, 12], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"michael\",\"age\":53},{\"name\":\"george\",\"age\":23},{\"name\":\"alexander\",\"age\":25},{\"name\":\"john\",\"age\":25},{\"name\":\"taylor\",\"age\":23},{\"name\":\"emily\",\"age\":23},{\"name\":\"emma\",\"age\":23}]');
  });
  test('select five arbitarliy records;', async () => {
    const users = await global.users.tb.select([4, 7], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"joseph\",\"age\":23},{\"name\":\"william\",\"age\":33},{\"name\":\"michael\",\"age\":53},{\"name\":\"george\",\"age\":23}]');
  });
});
