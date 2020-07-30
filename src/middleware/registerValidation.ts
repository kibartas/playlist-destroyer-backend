import express from 'express';

export const minUsernameLength = 10;
export const maxUsernameLength = 30;
export const minPasswordLength = 15;
export const maxPasswordLength = 50;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,50}$/;

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
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
  }
  next();
};
