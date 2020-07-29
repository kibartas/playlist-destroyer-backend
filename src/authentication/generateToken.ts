import jwt from 'jsonwebtoken';

export default (userData: { username: string; role: string }): string => jwt.sign(userData, process.env.TOKEN_SECRET as string);
