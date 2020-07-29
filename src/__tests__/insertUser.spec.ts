import insertUser from '../database/insertUser';
import * as db from '../testUtils/db-handler';
import { IUser } from '../../types/user';

const userData: IUser = {
  username: 'JohnLukeThe3rd',
  password: 'Password123',
};

describe('insertUser function', () => {
  beforeAll(async () => db.connect());
  afterAll(async () => db.closeDatabase());
  afterEach(async () => db.clearDatabase());

  it('should return inserted user', async () => {
    const user = await insertUser(userData, true);
    if (user === undefined) fail();
    expect(user.username).toEqual(userData.username);
    expect(user.password).not.toEqual(userData.password);
  });

  it('should return ');
});
