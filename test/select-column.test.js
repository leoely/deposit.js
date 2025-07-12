import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Select column test case;', () => {
  test('select first arbitrarliy record;', async () => {
    const users = await global.users.tb.select([3, 9], ['id', 'name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"id\":3,\"name\":\"david\",\"age\":32},{\"id\":4,\"name\":\"joseph\",\"age\":23},{\"id\":5,\"name\":\"william\",\"age\":33},{\"id\":6,\"name\":\"michael\",\"age\":53},{\"id\":7,\"name\":\"george\",\"age\":23},{\"id\":8,\"name\":\"alexander\",\"age\":25},{\"id\":9,\"name\":\"john\",\"age\":25}]');
  });
  test('select first column duplicate record;', async () => {
    const users = await global.users.tb.select([2, 7], ['name', 'age', 'gender']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"thomas\",\"age\":23,\"gender\":1},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1},{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1}]');
  });
  test('select second column duplicate record;', async () => {
    const users = await global.users.tb.select([10, 13], ['gender', 'city', 'country']);
    expect(JSON.stringify(users)).toMatch('[{\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fullerton\",\"country\":\"america\"},{\"gender\":1,\"city\":\"irvine\",\"country\":\"america\"}]');
  });
  test('select third column duplicate record;', async () => {
    const users = await global.users.tb.select([5, 9], ['id', 'name']);
    expect(JSON.stringify(users)).toMatch('[{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1},{\"id\":8,\"name\":\"alexander\",\"age\":25},{\"id\":9,\"name\":\"john\",\"age\":25}]');
  });
  test('select fourth column duplicate record;', async () => {
    const users = await global.users.tb.select([7, 10], ['gender', 'city']);
    expect(JSON.stringify(users)).toMatch('[{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\"},{\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"}]');
  });
  test('select fifth column duplicate record;', async () => {
    const users = await global.users.tb.select([5, 11], ['city', 'country']);
    expect(JSON.stringify(users)).toMatch('[{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1,\"city\":\"helena\",\"country\":\"america\"},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"}]');
  });
  test('select fifth column duplicate record;', async () => {
    const users = await global.users.tb.select([2, 9], ['name', 'age']);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"thomas\",\"age\":23,\"gender\":1},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1},{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1,\"city\":\"helena\",\"country\":\"america\"},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"}]');
  });
});
