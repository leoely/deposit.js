import { describe, expect, test, } from '@jest/globals';
import Users from '~/class/table/MysqlUsers';
import global from '~/obj/global';

beforeAll(() => {
  global.users.tb = new Users();
});

describe('[Class] Select high index test cases;', () => {
  test('Test multiple high index situations;', async () => {
    const global_users_tb = global.users.tb;

    const users1 = await global_users_tb.select([35, 35]);
    expect(JSON.stringify(users1)).toMatch('[{\"id\":0,\"name\":\"barbara\",\"age\":48,\"gender\":0,\"city\":\"anaheim\",\"country\":\"america\"}]');
    const users2 = await global_users_tb.select([0, 0]);
    expect(JSON.stringify(users2)).toMatch('[{\"id\":0,\"name\":\"barbara\",\"age\":48,\"gender\":0,\"city\":\"anaheim\",\"country\":\"america\"}]');
    const [mapping] = global_users_tb.getMappings();
    const [highId, lowId] = mapping;
    await global_users_tb.exchangeContent(highId, lowId);
    global_users_tb.emptyCache();

    const users3 = await global_users_tb.select([8, 14]);
    expect(JSON.stringify(users3)).toMatch('[{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"id\":11,\"name\":\"emily\",\"age\":23,\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"},{\"id\":12,\"name\":\"emma\",\"age\":23,\"gender\":0,\"city\":\"fullerton\",\"country\":\"america\"},{\"id\":13,\"name\":\"particia\",\"age\":24,\"gender\":1,\"city\":\"irvine\",\"country\":\"america\"},{\"id\":14,\"name\":\"elizebeth\",\"age\":52,\"gender\":1,\"city\":\"lompoc\",\"country\":\"america\"}]');
    const users4 = await global_users_tb.select([6, 11]);
    expect(JSON.stringify(users4)).toMatch('[{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"id\":11,\"name\":\"emily\",\"age\":23,\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"}]');
    const users5 = await global_users_tb.select([9, 17]);
    expect(JSON.stringify(users5)).toMatch('[{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"id\":11,\"name\":\"emily\",\"age\":23,\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"},{\"id\":12,\"name\":\"emma\",\"age\":23,\"gender\":0,\"city\":\"fullerton\",\"country\":\"america\"},{\"id\":13,\"name\":\"particia\",\"age\":24,\"gender\":1,\"city\":\"irvine\",\"country\":\"america\"},{\"id\":14,\"name\":\"elizebeth\",\"age\":52,\"gender\":1,\"city\":\"lompoc\",\"country\":\"america\"},{\"id\":15,\"name\":\"bethany\",\"age\":59,\"gender\":0,\"city\":\"honolulu\",\"country\":\"america\"},{\"id\":16,\"name\":\"samantha\",\"age\":29,\"gender\":0,\"city\":\"anahemim\",\"country\":\"america\"},{\"id\":17,\"name\":\"patricia\",\"age\":58,\"gender\":0,\"city\":\"pittsburgh\",\"country\":\"america\"}]');
    const users6 = await global_users_tb.select([5, 6], ['name', 'age', 'country'], true);
    expect(JSON.stringify(users6)).toMatch('[{\"name\":\"william\",\"age\":33,\"country\":\"america\"},{\"name\":\"michael\",\"age\":53,\"country\":\"america\"}]');
    const users7 = await global_users_tb.select([1, 2], ['id', 'gender']);
    expect(JSON.stringify(users7)).toMatch('[{\"id\":1,\"gender\":1},{\"id\":2,\"gender\":1}]');
    const users8 = await global_users_tb.select([28, 32]);
    const mappings1 = global_users_tb.getMappings();
    for (let i = 0; i < mappings1.length; i += 1) {
      const [highId, lowId] = mappings1[i];
      await global_users_tb.exchangeContent(highId, lowId);
    }
    global_users_tb.emptyCache();

    const users9 = await global_users_tb.select([0, 34], ['name']);
    expect(JSON.stringify(users9)).toMatch('[{\"name\":\"james\"},{\"name\":\"ovlier\"},{\"name\":\"thomas\"},{\"name\":\"david\"},{\"name\":\"joseph\"},{\"name\":\"william\"},{\"name\":\"michael\"},{\"name\":\"george\"},{\"name\":\"alexander\"},{\"name\":\"john\"},{\"name\":\"taylor\"},{\"name\":\"emily\"},{\"name\":\"emma\"},{\"name\":\"particia\"},{\"name\":\"elizebeth\"},{\"name\":\"bethany\"},{\"name\":\"samantha\"},{\"name\":\"patricia\"},{\"name\":\"jacob\"},{\"name\":\"kyle\"},{\"name\":\"liam\"},{\"name\":\"noah\"},{\"name\":\"damian\"},{\"name\":\"reece\"},{\"name\":\"kyle\"},{\"name\":\"noah\"},{\"name\":\"tracy\"},{\"name\":\"amelia\"},{\"name\":\"lsla\"},{\"name\":\"poppy\"},{\"name\":\"susan\"},{\"name\":\"abigail\"},{\"name\":\"elizabeth\"},{\"name\":\"lsabella\"},{\"name\":\"mia\"}]');
    const mappings2 = global_users_tb.getMappings();
    for (let i = 0; i < mappings2.length; i += 1) {
      const [highId, lowId] = mappings2[i];
      await global_users_tb.exchangeContent(highId, lowId);
    }
    global_users_tb.emptyCache();

    const users10 = await global_users_tb.select([0, 4]);
    expect(JSON.stringify(users10)).toMatch('[{\"id\":0,\"name\":\"james\",\"age\":21,\"gender\":1,\"city\":\"sitka\",\"country\":\"america\"},{\"id\":1,\"name\":\"ovlier\",\"age\":22,\"gender\":1,\"city\":\"clifton\",\"country\":\"america\"},{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1,\"city\":\"winslow\",\"country\":\"america\"}]');
    const users11 = await global_users_tb.select([24, 33]);
    expect(JSON.stringify(users11)).toMatch('[{\"id\":24,\"name\":\"kyle\",\"age\":83,\"gender\":1,\"city\":\"atlanta\",\"country\":\"america\"},{\"id\":25,\"name\":\"noah\",\"age\":37,\"gender\":1,\"city\":\"mesa\",\"country\":\"america\"},{\"id\":26,\"name\":\"tracy\",\"age\":59,\"gender\":0,\"city\":\"ealeigh\",\"country\":\"america\"},{\"id\":27,\"name\":\"amelia\",\"age\":12,\"gender\":0,\"city\":\"omaha\",\"country\":\"america\"},{\"id\":28,\"name\":\"lsla\",\"age\":49,\"gender\":0,\"city\":\"long beach\",\"country\":\"america\"},{\"id\":29,\"name\":\"poppy\",\"age\":58,\"gender\":0,\"city\":\"oakland\",\"country\":\"america\"},{\"id\":5,\"name\":\"susan\",\"age\":39,\"gender\":0,\"city\":\"minneapolis\",\"country\":\"america\"},{\"id\":6,\"name\":\"abigail\",\"age\":29,\"gender\":0,\"city\":\"tulsa\",\"country\":\"america\"},{\"id\":7,\"name\":\"elizabeth\",\"age\":58,\"gender\":0,\"city\":\"bakeersfield\",\"country\":\"america\"},{\"id\":8,\"name\":\"lsabella\",\"age\":39,\"gender\":0,\"city\":\"new orleans\",\"country\":\"america\"}]');
    const mappings3 = global_users_tb.getMappings();
    for (let i = mappings3.length - 1; i >= 0; i -= 1) {
      const [highId, lowId] = mappings3[i];
      await global_users_tb.exchangeContent(highId, lowId);
    }
    global_users_tb.emptyCache();

    const users12 = await global_users_tb.select([0, 29]);
    expect(JSON.stringify(users12)).toMatch('[{\"id\":0,\"name\":\"james\",\"age\":21,\"gender\":1,\"city\":\"sitka\",\"country\":\"america\"},{\"id\":1,\"name\":\"ovlier\",\"age\":22,\"gender\":1,\"city\":\"clifton\",\"country\":\"america\"},{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1,\"city\":\"winslow\",\"country\":\"america\"},{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1,\"city\":\"helena\",\"country\":\"america\"},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"id\":11,\"name\":\"emily\",\"age\":23,\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"},{\"id\":12,\"name\":\"emma\",\"age\":23,\"gender\":0,\"city\":\"fullerton\",\"country\":\"america\"},{\"id\":13,\"name\":\"particia\",\"age\":24,\"gender\":1,\"city\":\"irvine\",\"country\":\"america\"},{\"id\":14,\"name\":\"elizebeth\",\"age\":52,\"gender\":1,\"city\":\"lompoc\",\"country\":\"america\"},{\"id\":15,\"name\":\"bethany\",\"age\":59,\"gender\":0,\"city\":\"honolulu\",\"country\":\"america\"},{\"id\":16,\"name\":\"samantha\",\"age\":29,\"gender\":0,\"city\":\"anahemim\",\"country\":\"america\"},{\"id\":17,\"name\":\"patricia\",\"age\":58,\"gender\":0,\"city\":\"pittsburgh\",\"country\":\"america\"},{\"id\":18,\"name\":\"jacob\",\"age\":38,\"gender\":1,\"city\":\"baltimore\",\"country\":\"america\"},{\"id\":19,\"name\":\"kyle\",\"age\":43,\"gender\":1,\"city\":\"milwaukee\",\"country\":\"america\"},{\"id\":20,\"name\":\"liam\",\"age\":49,\"gender\":1,\"city\":\"albuquerque\",\"country\":\"america\"},{\"id\":21,\"name\":\"noah\",\"age\":29,\"gender\":1,\"city\":\"tucson\",\"country\":\"america\"},{\"id\":22,\"name\":\"damian\",\"age\":49,\"gender\":1,\"city\":\"fresno\",\"country\":\"america\"},{\"id\":23,\"name\":\"reece\",\"age\":34,\"gender\":1,\"city\":\"sacramento\",\"country\":\"america\"},{\"id\":24,\"name\":\"kyle\",\"age\":83,\"gender\":1,\"city\":\"atlanta\",\"country\":\"america\"},{\"id\":25,\"name\":\"noah\",\"age\":37,\"gender\":1,\"city\":\"mesa\",\"country\":\"america\"},{\"id\":26,\"name\":\"tracy\",\"age\":59,\"gender\":0,\"city\":\"ealeigh\",\"country\":\"america\"},{\"id\":27,\"name\":\"amelia\",\"age\":12,\"gender\":0,\"city\":\"omaha\",\"country\":\"america\"},{\"id\":28,\"name\":\"lsla\",\"age\":49,\"gender\":0,\"city\":\"long beach\",\"country\":\"america\"},{\"id\":29,\"name\":\"poppy\",\"age\":58,\"gender\":0,\"city\":\"oakland\",\"country\":\"america\"}]');
    const users13 = await global_users_tb.select([37, 39]);
    expect(JSON.stringify(users13)).toMatch('[{\"id\":30,\"name\":\"wendy\",\"age\":34,\"gender\":0,\"city\":\"greensboro\",\"country\":\"america\"},{\"id\":31,\"name\":\"charlie\",\"age\":58,\"gender\":1,\"city\":\"portland\",\"country\":\"america\"},{\"id\":32,\"name\":\"connor\",\"age\":28,\"gender\":1,\"city\":\"detroit\",\"country\":\"america\"}]');
    const mappings4 = global_users_tb.getMappings();
    for (let i = 0; i < mappings4.length; i += 1) {
      const [highId, lowId] = mappings4[i];
      await global.users.tb.exchangeContent(highId, lowId);
    }
    global_users_tb.emptyCache();

    const users14 = await global_users_tb.select([0, 29]);
    expect(JSON.stringify(users14)).toMatch('[{\"id\":0,\"name\":\"james\",\"age\":21,\"gender\":1,\"city\":\"sitka\",\"country\":\"america\"},{\"id\":1,\"name\":\"ovlier\",\"age\":22,\"gender\":1,\"city\":\"clifton\",\"country\":\"america\"},{\"id\":2,\"name\":\"thomas\",\"age\":23,\"gender\":1,\"city\":\"florence\",\"country\":\"america\"},{\"id\":3,\"name\":\"david\",\"age\":32,\"gender\":1,\"city\":\"walpi\",\"country\":\"america\"},{\"id\":4,\"name\":\"joseph\",\"age\":23,\"gender\":1,\"city\":\"winslow\",\"country\":\"america\"},{\"id\":5,\"name\":\"william\",\"age\":33,\"gender\":1,\"city\":\"helena\",\"country\":\"america\"},{\"id\":6,\"name\":\"michael\",\"age\":53,\"gender\":1,\"city\":\"morrilton\",\"country\":\"america\"},{\"id\":7,\"name\":\"george\",\"age\":23,\"gender\":1,\"city\":\"arcadia\",\"country\":\"america\"},{\"id\":8,\"name\":\"alexander\",\"age\":25,\"gender\":1,\"city\":\"coronado\",\"country\":\"america\"},{\"id\":9,\"name\":\"john\",\"age\":25,\"gender\":1,\"city\":\"eureka\",\"country\":\"america\"},{\"id\":10,\"name\":\"taylor\",\"age\":23,\"gender\":0,\"city\":\"fairfield\",\"country\":\"america\"},{\"id\":11,\"name\":\"emily\",\"age\":23,\"gender\":0,\"city\":\"fremont\",\"country\":\"america\"},{\"id\":12,\"name\":\"emma\",\"age\":23,\"gender\":0,\"city\":\"fullerton\",\"country\":\"america\"},{\"id\":13,\"name\":\"particia\",\"age\":24,\"gender\":1,\"city\":\"irvine\",\"country\":\"america\"},{\"id\":14,\"name\":\"elizebeth\",\"age\":52,\"gender\":1,\"city\":\"lompoc\",\"country\":\"america\"},{\"id\":15,\"name\":\"bethany\",\"age\":59,\"gender\":0,\"city\":\"honolulu\",\"country\":\"america\"},{\"id\":16,\"name\":\"samantha\",\"age\":29,\"gender\":0,\"city\":\"anahemim\",\"country\":\"america\"},{\"id\":17,\"name\":\"patricia\",\"age\":58,\"gender\":0,\"city\":\"pittsburgh\",\"country\":\"america\"},{\"id\":18,\"name\":\"jacob\",\"age\":38,\"gender\":1,\"city\":\"baltimore\",\"country\":\"america\"},{\"id\":19,\"name\":\"kyle\",\"age\":43,\"gender\":1,\"city\":\"milwaukee\",\"country\":\"america\"},{\"id\":20,\"name\":\"liam\",\"age\":49,\"gender\":1,\"city\":\"albuquerque\",\"country\":\"america\"},{\"id\":21,\"name\":\"noah\",\"age\":29,\"gender\":1,\"city\":\"tucson\",\"country\":\"america\"},{\"id\":22,\"name\":\"damian\",\"age\":49,\"gender\":1,\"city\":\"fresno\",\"country\":\"america\"},{\"id\":23,\"name\":\"reece\",\"age\":34,\"gender\":1,\"city\":\"sacramento\",\"country\":\"america\"},{\"id\":24,\"name\":\"kyle\",\"age\":83,\"gender\":1,\"city\":\"atlanta\",\"country\":\"america\"},{\"id\":25,\"name\":\"noah\",\"age\":37,\"gender\":1,\"city\":\"mesa\",\"country\":\"america\"},{\"id\":26,\"name\":\"tracy\",\"age\":59,\"gender\":0,\"city\":\"ealeigh\",\"country\":\"america\"},{\"id\":27,\"name\":\"amelia\",\"age\":12,\"gender\":0,\"city\":\"omaha\",\"country\":\"america\"},{\"id\":28,\"name\":\"lsla\",\"age\":49,\"gender\":0,\"city\":\"long beach\",\"country\":\"america\"},{\"id\":29,\"name\":\"poppy\",\"age\":58,\"gender\":0,\"city\":\"oakland\",\"country\":\"america\"}]');
    global_users_tb.temporaryMemorySwitch = true;
    const users15 = await global_users_tb.select([37, 39]);
    delete global_users_tb.temporaryMemorySwitch;
    expect(JSON.stringify(users15)).toMatch('[{\"id\":0,\"name\":\"wendy\",\"age\":34,\"gender\":0,\"city\":\"greensboro\",\"country\":\"america\"},{\"id\":1,\"name\":\"charlie\",\"age\":58,\"gender\":1,\"city\":\"portland\",\"country\":\"america\"},{\"id\":2,\"name\":\"connor\",\"age\":28,\"gender\":1,\"city\":\"detroit\",\"country\":\"america\"}]');
    const mappings5 = global_users_tb.getMappings();
    for (let i = 0; i < mappings4.length; i += 1) {
      const [highId, lowId] = mappings4[i];
      await global.users.tb.exchangeContent(highId, lowId);
    }
    global_users_tb.emptyCache();
  });
});
