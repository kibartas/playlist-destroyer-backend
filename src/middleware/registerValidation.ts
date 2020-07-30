import express from 'express';
import getUser from '../database/getUser';

export const minUsernameLength = 10;
export const maxUsernameLength = 30;
export const minPasswordLength = 10;
export const maxPasswordLength = 50;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+-^])[A-Za-z\d@$!%*?&+-^]{10,50}$/;

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  if (await getUser(req.body.username)) {
    res.status(409);
    res.send({ message: 'Username taken' });
    return;
  }
  // does username and password exist
  if (!req.body?.username || !req.body?.password) {
    res.status(400);
    if (!req.body?.username && !req.body?.password) res.send({ message: 'Missing username and password' });
    else if (!req.body?.username) res.send({ message: 'Missing username' });
    else if (!req.body?.password) res.send({ message: 'Missing password' });
    return;
  }
  if (
    req.body.username.length < minUsernameLength
    || req.body.username.length > maxUsernameLength
  ) {
    res.status(422);
    if (req.body.username.length < minUsernameLength) res.send({ message: 'Username too short' });
    else if (req.body.username.length > maxUsernameLength) res.send({ message: 'Username too long' });
    return;
  }
  if (
    req.body.password.length < minPasswordLength
    || req.body.password.length > maxPasswordLength
  ) {
    res.status(422);
    if (req.body.password.length < minPasswordLength) res.send({ message: 'Password too short' });
    else if (req.body.password.length > maxPasswordLength) res.send({ message: 'Password too long' });
    return;
  }
  if (!passwordRegex.test(req.body.password)) {
    res.status(422);
    res.send({
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one special symbol and one digit',
    });
    return;
  }
  if (req.body?.role) {
    if (req.body?.role !== 'admin' && req.body?.role !== 'user') {
      res.status(422);
      res.send({ message: 'role can only be "admin" or "user"' });
      return;
    }
  }
  next();
};
