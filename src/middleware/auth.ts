import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const bearerToken = req.header("Authorization");
  let token;
  if (!bearerToken) {
    res.sendStatus(401);
    return;
  } else {
    if (!bearerToken.startsWith("Bearer ")) {
      res.sendStatus(401);
      return;
    } else {
      token = bearerToken.replace("Bearer ", "");
    }
    try {
      jwt.verify(token, process.env.TOKEN_SECRET as string);
      next();
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }
};
