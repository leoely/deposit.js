import { describe, expect, test, } from '@jest/globals';
import { getOwnIpAddresses, wrapIpv6, } from 'manner.js/server';
import DistribTable from '~/class/DistribTable';
import mysqlNoHighIndexOptions from '~/obj/mysqlNoHighIndexOptions';
import global from '~/obj/global';

const first = 41;
const second = 42;
const third = 43;
const fourth = 44;
const fifth = 45;
const sixth = 46;

beforeAll(() => {
  const [ipAddress] = getOwnIpAddresses();
  const { ipv4, } = ipAddress;
  const tables = [
    [ipv4, 8000],
    [ipv4, 8001],
  ];
  global.users.tb1 = new DistribTable('users', mysqlNoHighIndexOptions, 8000, tables);
  global.users.tb2 = new DistribTable('users', mysqlNoHighIndexOptions, 8001, tables);
});

describe('[Class] Distributed operation test cases;', () => {
  test('Test distributed related operations.', async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1100);
    });
    const global_users_tb1 = global.users.tb1;
    const global_users_tb2 = global.users.tb2;
    await DistribTable.combine([global_users_tb1, global_users_tb2]);
    await global_users_tb1.updateDistrib({ id: 36, name: 'aron', age: 34, gender: 1, city: 'boston', country: 'america', });
    const users1 = await global_users_tb1.select([36, 36]);
    expect(JSON.stringify(users1)).toMatch('[{\"id\":36,\"name\":\"aron\",\"age\":34,\"gender\":1,\"city\":\"boston\",\"country\":\"america\"}]');
    const users2 = await global_users_tb2.select([36, 36]);
    expect(JSON.stringify(users2)).toMatch('[{\"id\":36,\"name\":\"aron\",\"age\":34,\"gender\":1,\"city\":\"boston\",\"country\":\"america\"}]');
    await global_users_tb1.updateDistrib({ id: 36, name: 'lsla', age: 49, gender: 0, city: 'saint paul', country: 'america', });

    const users3 = await global_users_tb1.select([40, 40]);
    expect(JSON.stringify(users3)).toMatch('[{\"id\":40,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    const users4 = await global_users_tb2.select([40, 40]);
    expect(JSON.stringify(users4)).toMatch('[{\"id\":40,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    await global_users_tb1.deleteDistrib(40);
    const users5 = await global_users_tb1.select([40, 40]);
    expect(JSON.stringify(users5)).toMatch('[null]');
    const users6 = await global_users_tb2.select([40, 40]);
    expect(JSON.stringify(users6)).toMatch('[null]');

    await global_users_tb2.insertDistrib({ id: 40, name: 'callum', age: 43, gender: 1, city: 'memphis', country: 'america', });
    const users7 = await global_users_tb1.select([40, 40]);
    expect(JSON.stringify(users7)).toMatch('[{\"id\":40,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    const users8 = await global_users_tb2.select([40, 40]);
    expect(JSON.stringify(users8)).toMatch('[{\"id\":40,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');

    await global_users_tb2.exchangeContentDistrib(36, 40);
    const users9 = await global_users_tb1.select([40, 40]);
    expect(JSON.stringify(users9)).toMatch('[{\"id\":40,\"name\":\"lsla\",\"age\":49,\"gender\":0,\"city\":\"saint paul\",\"country\":\"america\"}]');
    const users10 = await global_users_tb2.select([40, 40]);
    expect(JSON.stringify(users10)).toMatch('[{\"id\":40,\"name\":\"lsla\",\"age\":49,\"gender\":0,\"city\":\"saint paul\",\"country\":\"america\"}]');
    const users11 = await global_users_tb1.select([36, 36]);
    expect(JSON.stringify(users11)).toMatch('[{\"id\":36,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    const users12 = await global_users_tb2.select([36, 36]);
    expect(JSON.stringify(users12)).toMatch('[{\"id\":36,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    await global_users_tb2.exchangeContentDistrib(36, 40);

    await global_users_tb1.deleteExchangeDistrib(36, 41);
    const users13 = await global_users_tb1.select([36, 36]);
    expect(JSON.stringify(users13)).toMatch('[{\"id\":36,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    const users14 = await global_users_tb2.select([36, 36]);
    expect(JSON.stringify(users14)).toMatch('[{\"id\":36,\"name\":\"callum\",\"age\":43,\"gender\":1,\"city\":\"memphis\",\"country\":\"america\"}]');
    const users15 = await global_users_tb1.select([40, 40]);
    expect(JSON.stringify(users15)).toMatch('[null]');
    const users16 = await global_users_tb2.select([40, 40]);
    expect(JSON.stringify(users16)).toMatch('[null]');
    await global_users_tb1.insertDistrib({ id: 40, name: 'callum', age: 43, gender: 1, city: 'memphis', country: 'america', });
    await global_users_tb2.updateDistrib({ id: 36, name: 'lsla', age: 49, gender: 0, city: 'saint paul', country: 'america', });

    const users17 = await global_users_tb1.select([7, 10]);
    expect(JSON.stringify(users17)).toMatch('[{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"}]');
    const users18 = await global_users_tb2.select([7, 10]);
    expect(JSON.stringify(users18)).toMatch('[{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"}]');
    await global_users_tb1.insert([
      { id: first, name: 'royal', age: 34, gender: 1, city: 'athens', country: 'america', },
      { id: second, name: 'silas', age: 58, gender: 0, city: 'marion', country: 'america', },
      { id: third, name: 'eloise', age: 38, gender: 0, city: 'prichard', country: 'america', },
      { id: fourth, name: 'oscar', age: 59, gender: 0, city: 'sylacauga', country: 'america', },
      { id: fifth, name: 'eleanor', age: 83, gender: 0, city: 'tuscaloosa', country: 'america', },
      { id: sixth, name: 'lily', age: 83, gender: 0, city: 'atlanta', country: 'america', },
    ]);
    const users19 = await global_users_tb1.select([46, 46]);
    expect(JSON.stringify(users19)).toMatch('[{\"id\":0,\"name\":\"lily\",\"age\":83,\"gender\":0,\"city\":\"atlanta\",\"country\":\"america\"}]');
    const users20 = await global_users_tb2.select([0, 0]);
    expect(JSON.stringify(users20)).toMatch('[{\"id\":0,\"name\":\"lily\",\"age\":83,\"gender\":0,\"city\":\"atlanta\",\"country\":\"america\"}]');
    const mappings = global_users_tb1.getMappings();
    for (let i = mappings.length - 1; i >= 0; i -= 1) {
      const [highId, lowId] = mappings[i];
      await global_users_tb2.exchangeContentDistrib(highId, lowId);
    }

    const [ipAddress] = getOwnIpAddresses();
    const { ipv4, } = ipAddress;
    const tables = [
      [ipv4, 8000],
      [ipv4, 8001],
        [ipv4, 8002],
    ];
    global.users.tb3 = new DistribTable('users', mysqlNoHighIndexOptions, 8002, tables);
    const global_users_tb3 = global.users.tb3;
    await DistribTable.join([global_users_tb3], [global_users_tb1, global_users_tb2]);
    await global_users_tb3.updateDistrib({ id: 39, name: 'zach', age: 34, gender: 1, city: 'washington', country: 'america', });
    const users21 = await global_users_tb1.select([39, 39]);
    expect(JSON.stringify(users21)).toMatch('[{\"id\":39,\"name\":\"zach\",\"age\":34,\"gender\":1,\"city\":\"washington\",\"country\":\"america\"}]');
    const users22 = await global_users_tb2.select([39, 39]);
    expect(JSON.stringify(users22)).toMatch('[{\"id\":39,\"name\":\"zach\",\"age\":34,\"gender\":1,\"city\":\"washington\",\"country\":\"america\"}]');
    const users23 = await global_users_tb3.select([39, 39]);
    expect(JSON.stringify(users23)).toMatch('[{\"id\":39,\"name\":\"zach\",\"age\":34,\"gender\":1,\"city\":\"washington\",\"country\":\"america\"}]');
    await DistribTable.release([global_users_tb1, global_users_tb2, global_users_tb3]);
  });
});
