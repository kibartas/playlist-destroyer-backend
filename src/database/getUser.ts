import UserModel from '../models/user';
import { UserDto } from '../../types/user';

const getUser = async (
  username: string,
  returnPassword = false,
): Promise<UserDto | null> => {
  try {
    if (returnPassword) {
      return UserModel.findOne({ username }).select('-_id -__v').exec();
    }
    return UserModel.findOne({ username }).select('-_id -__v -password').exec();
  } catch (e) {
    return null;
  }
};

export default getUser;
