import UserModel from '../models/user';
import * as dbHandler from '../testUtils/db-handler';
import { IUser, UserType } from '../../types/user';

const userData: IUser = {
  username: 'JohnLukeThe3rd',
  password: 'Rabarbaras123',
  creationDate: new Date(),
  role: 'admin',
};

beforeAll(async () => dbHandler.connect());

afterEach(async () => dbHandler.clearDatabase());

afterAll(async () => dbHandler.closeDatabase());

describe('User model', () => {
  it('can be created correctly', async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    await UserModel.create(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(1);
  });

  it('can be removed correctly', async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    await UserModel.create(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(1);
    await UserModel.deleteOne(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
  });

  it('can be updated correctly', async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    await UserModel.create(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(1);
    const result: UserType | null = await UserModel.findOneAndUpdate(
      { username: userData.username },
      { username: 'Kirminas' },
      { new: true, useFindAndModify: false },
    );
    if (result === null) fail();
    const { username, password }: UserType = result;
    expect({ username, password }).toEqual({
      username: 'Kirminas',
      password: userData.password,
    });
  });

  it('gets proper defaults', async () => {
    const dateNow = Date.now();
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    const userDataChanged: IUser = { ...userData };
    userDataChanged.role = undefined;
    await UserModel.create(userDataChanged);
    const result: IUser | null = await UserModel.findOne({
      username: userData.username,
    });
    if (result === null) {
      fail();
    }
    if (result.creationDate === undefined) {
      fail();
    }
    expect(result.username).toEqual(userData.username);
    expect(
      Math.floor(result.creationDate.getTime() / 1000),
    ).toBeGreaterThanOrEqual(Math.floor(dateNow / 1000) - 10);
    expect(result.lastLogin).toBeUndefined();
    expect(result.role).toEqual('user');
  });

  it('gets created with admin role', async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    const user: IUser | null = await UserModel.create(userData);
    if (user === null) {
      fail();
    }
    expect(user.role).toEqual('admin');
  });
});
