import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Arrange pointer test cases;', () => {
  test('Select first arbitrarliy record;', async () => {
    const users = await global.users.tb.select([1, 6], ['name', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"ovlier\",\"country\":\"america\"},{\"name\":\"thomas\",\"country\":\"america\"},{\"name\":\"david\",\"country\":\"america\"},{\"name\":\"joseph\",\"country\":\"america\"},{\"name\":\"william\",\"country\":\"america\"},{\"name\":\"michael\",\"country\":\"america\"}]');
  });
  test('Select second arbitrarliy record;', async () => {
    const users = await global.users.tb.select([2, 4], ['age', 'city', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"age\":23,\"city\":\"florence\",\"country\":\"america\"},{\"age\":32,\"city\":\"walpi\",\"country\":\"america\"},{\"age\":23,\"city\":\"winslow\",\"country\":\"america\"}]');
  });
  test('Select third arbitrarliy record;', async () => {
    const users = await global.users.tb.select([1, 9], ['age', 'country'], true);
    expect(JSON.stringify(users)).toMatch('[{\"age\":22,\"country\":\"america\"},{\"age\":23,\"country\":\"america\"},{\"age\":32,\"country\":\"america\"},{\"age\":23,\"country\":\"america\"},{\"age\":33,\"country\":\"america\"},{\"age\":53,\"country\":\"america\"},{\"age\":23,\"country\":\"america\"},{\"age\":25,\"country\":\"america\"},{\"age\":25,\"country\":\"america\"}]');
  });
  test('Select fourth arbitrarliy record;', async () => {
    const users = await global.users.tb.select([10, 13], ['age', 'gender'], true);
    expect(JSON.stringify(users)).toMatch('[{\"age\":23,\"gender\":0},{\"age\":23,\"gender\":0},{\"age\":23,\"gender\":0},{\"age\":24,\"gender\":1}]');
  });
  test('Select fifth arbitrarliy record;', async () => {
    const users = await global.users.tb.select([5, 7], ['name', 'age'], true);
    expect(JSON.stringify(users)).toMatch('[{\"name\":\"william\",\"age\":33},{\"name\":\"michael\",\"age\":53},{\"name\":\"george\",\"age\":23}]');
  });
  test('Perpate first record;', async () => {
    const users = await global.users.tb.select([10, 13], ['id'], true);
    expect(JSON.stringify(users)).toMatch('[{\"id\":10},{\"id\":11},{\"id\":12},{\"id\":13}]');
  });
  test('Check arrange pointer situation;', async () => {
    const global_users_tb = global.users.tb;
    global_users_tb.arrangePointers();
    expect(JSON.stringify(global_users_tb.hash['id'])).toMatch('{\"type\":\"p\",\"pointer\":\"gender\"}');
    expect(JSON.stringify(global_users_tb.hash['gender'])).toMatch('{\"type\":\"s\",\"jumps\":[null,null,null,null,null,null,null,null,null,null,[13,0]],\"sections\":[[10,13]],\"chaotic\":false}');
  });
});
