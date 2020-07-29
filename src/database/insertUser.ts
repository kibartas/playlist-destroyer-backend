import hashPassword from './utils/hashPassword';
import UserModel from '../models/user';
import { IUser } from '../../types/user';

const insertUser = async (
  user: IUser,
  returnPassword = false,
): Promise<undefined | IUser> => {
  const userHashed: IUser = {
    ...user,
    password: await hashPassword(user.password),
  };
  try {
    await UserModel.create(userHashed);
    let result: IUser | null;
    if (returnPassword) {
      result = await UserModel.findOne({ username: user.username }).select(
        '-_id -__v',
      );
    } else {
      result = await UserModel.findOne({ username: user.username }).select(
        '-_id -__v -password',
      );
    }
    if (result === null) {
      return undefined;
    }
    return result;
  } catch (e) {
    return undefined;
  }
};

export default insertUser;
