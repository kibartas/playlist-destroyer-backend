import jwt from 'jsonwebtoken';

export default (username: { username: string }): string => jwt.sign(username, process.env.TOKEN_SECRET as string);
