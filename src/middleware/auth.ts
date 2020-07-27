import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const body = req.body;
  if (!body?.token) {
    res.sendStatus(401);
  } else {
    try {
      jwt.verify(body.token, process.env.TOKEN_SECRET as string);
      next();
    } catch (e) {
      res.sendStatus(401);
    }
  }
};
