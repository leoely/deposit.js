import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Select high index test cases;', () => {
  test('select first arbitrarliy records;', async () => {
    const users = await global.users.tb.select([35, 35]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":0,\"name\":\"barbara\",\"age\":48,\"gender\":0,\"city\":\"anaheim\",\"country\":\"america\"}]');
  });
  test('test the current users ground row', async () => {
    const users = await global.users.tb.select([0, 0]);
    expect(JSON.stringify(users)).toMatch('[{\"id\":0,\"name\":\"barbara\",\"age\":48,\"gender\":0,\"city\":\"anaheim\",\"country\":\"america\"}]');
  });
});

afterAll(async () => {
  await global.users.tb.exchangeContent(0, 35);
});

