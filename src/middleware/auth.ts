import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtStruct } from "../types/jwt";

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
      const payload: jwtStruct = jwt.verify(
        token,
        process.env.TOKEN_SECRET as string
      ) as jwtStruct;
      req.username = payload.username;
      next();
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }
};
