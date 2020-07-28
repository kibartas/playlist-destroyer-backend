import { Application, Request, Response } from "express";
import generateToken from "../authentication/generateToken";
import jwt from "jsonwebtoken";
import { jwtStruct } from "../types/jwt";

type AuthRequestBody = {
  username: string;
  password: string;
};

export default (app: Application): void => {
  app.post("/auth", (req: Request, res: Response): void => {
    const body: AuthRequestBody = req.body;
    if (body?.username && body?.password) {
      const token = generateToken({ username: body.username });
      res.send({ username: body.username, jwt: token });
    } else {
      res.status(400);
      res.send("Bad request");
    }
  });

  app.get("/user", (req: Request, res: Response): void => {
    let token = req.header("Authorization");
    if (token === undefined) {
      res.sendStatus(400);
    } else {
      token = token.replace("Bearer ", "");
      const payload: jwtStruct = jwt.decode(token as string) as jwtStruct;
      if (!payload?.username) {
        res.sendStatus(400);
        return;
      } else {
        res.json({ username: payload.username });
      }
    }
  });
};
