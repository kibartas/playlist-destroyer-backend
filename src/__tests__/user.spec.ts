import UserModel, { IUser } from "../models/user";
import * as dbHandler from "../testUtils/db-handler";

const userData = {
  username: "JohnLukeThe3rd",
  password: "Rabarbaras123",
  creationDate: new Date(),
};

beforeAll(async () => await dbHandler.connect());

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => dbHandler.closeDatabase());

describe("User model", () => {
  it("can be created correctly", async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    await UserModel.create(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(1);
  });

  it("can be removed correctly", async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    await UserModel.create(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(1);
    await UserModel.deleteOne(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
  });

  it("can be updated correctly", async () => {
    expect(await UserModel.estimatedDocumentCount()).toEqual(0);
    await UserModel.create(userData);
    expect(await UserModel.estimatedDocumentCount()).toEqual(1);
    const result: IUser = (await UserModel.findOneAndUpdate(
      { username: userData.username },
      { username: "Kirminas" },
      { new: true, useFindAndModify: false }
    )) as IUser;
    const { username, password }: IUser = result;
    expect({ username, password }).toEqual({
      username: "Kirminas",
      password: userData.password,
    });
  });
});
