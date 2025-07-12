import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Select row test case;', () => {
  test('select first arbitrarliy records;', async () => {
    const users = await global.users.tb.select([2, 9]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1,\"city\":\"winslow\",\"country\":\"america\"},{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1,\"city\":\"helena\",\"country\":\"america\"},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"}]');
  });
  test('select second arbitrarliy records;', async () => {
    const users = await global.users.tb.select([1, 4]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":1,\"name\":\"ovlier\",\"age\":22,\"gender\":1,\"city\":\"clifton\",\"country\":\"america\"},{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1,\"city\":\"winslow\",\"country\":\"america\"}]');
  });
  test('select third arbitrarliy records;', async () => {
    const users = await global.users.tb.select([5 , 8]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1,\"city\":\"helena\",\"country\":\"america\"},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"}]');
  });
  test('select arbitrarliy interspersed records;', async () => {
    const users = await global.users.tb.select([6 , 9]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"}]');
  });
  test('select four arbitarliy records;', async () => {
    const users = await global.users.tb.select([2, 4]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1,\"city\":\"winslow\",\"country\":\"america\"}]');
  });
  test('select five arbitarliy records;', async () => {
    const users = await global.users.tb.select([1, 3]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":1,\"name\":\"ovlier\",\"age\":22,\"gender\":1,\"city\":\"clifton\",\"country\":\"america\"},{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"}]');
  });
});
