import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtStruct } from '../../types/jwt';

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const bearerToken = req.header('Authorization');
  let token;
  if (!bearerToken) {
    res.sendStatus(401);
  } else {
    if (!bearerToken.startsWith('Bearer ')) {
      res.sendStatus(401);
      return;
    }
    token = bearerToken.replace('Bearer ', '');

    try {
      const payload: jwtStruct = jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
      ) as jwtStruct;
      req.username = payload.username;
      req.role = payload.role;
      return next();
    } catch {
      res.sendStatus(401);
    }
  }
};

export default tokenValidation;
