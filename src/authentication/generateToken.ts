import jwt from 'jsonwebtoken';
import { UserRoles } from '../../types/user';

export default (userData: { username: string; role: UserRoles }): string => jwt.sign(userData, process.env.TOKEN_SECRET as string);
