import bcrypt from 'bcrypt';
import getUser from '../database/getUser';
import * as db from '../testUtils/db-handler';
import insertUser from '../database/insertUser';
import { IUser } from '../../types/user';

const userData: IUser = {
  username: 'JohnLukeThe3rd',
  password: 'Password123',
};

describe('getUser function', () => {
  beforeAll(async () => db.connect());

  afterEach(async () => db.clearDatabase());

  afterAll(async () => db.closeDatabase());

  it('should return null', async () => {
    expect(await getUser(userData.username)).toBeNull();
  });

  it('should return user', async () => {
    await insertUser(userData, true);
    const user = await getUser(userData.username, true);
    if (user?.password === undefined) fail();
    expect(await bcrypt.compare(userData.password, user.password)).toBeTruthy();
  });

  it('should fail password check', async () => {
    await insertUser(userData, true);
    const user = await getUser(userData.username, true);
    if (user?.password === undefined) fail();
    expect(
      await bcrypt.compare(userData.password, `${user.password}a`),
    ).toBeFalsy();
  });
});
