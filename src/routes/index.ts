import { Application, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import generateToken from '../authentication/generateToken';
import getUser from '../database/getUser';
import { UserDto } from '../../types/user';
import insertUser from '../database/insertUser';

const routesPrefix = '/api';

export const routes = {
  users: `${routesPrefix}/users`,
  authentication: `${routesPrefix}/login`,
  me: `${routesPrefix}/users/me`,
};

export default (app: Application) => {
  app.post(
    routes.authentication,
    async (req: Request, res: Response): Promise<void> => {
      const { body } = req;
      if (body?.username && body?.password) {
        const user = await getUser(body.username, true);
        if (user === null) {
          res.sendStatus(422);
          return;
        }
        if (user.password === undefined) {
          res.sendStatus(500);
          return;
        }
        if (!(await bcrypt.compare(body.password, user.password))) {
          res.sendStatus(422);
          return;
        }
        const token = generateToken({
          username: user.username,
          role: user.role,
        });
        res.send({ username: body.username, jwt: token });
      } else {
        res.status(400);
        res.send('Bad request');
      }
    },
  );

  app.get(
    routes.me,
    async (req: Request, res: Response): Promise<void> => {
      if (req.username === undefined) {
        res.sendStatus(500);
        return;
      }
      const user: UserDto | null = await getUser(req.username);
      if (user === null) {
        res.sendStatus(500);
        return;
      }
      res.status(200);
      res.json({ username: user.username, role: user.role });
    },
  );

  app.post(
    routes.users,
    async (req: Request, res: Response): Promise<void> => {
      if (
        req.body?.username === undefined
        || req.body?.password === undefined
      ) {
        res.sendStatus(500);
        return;
      }
      const user: UserDto | undefined = await insertUser({
        username: req.body.username,
        password: req.body.password,
        role: req.body?.role,
      });
      if (user === undefined) {
        res.sendStatus(500);
        return;
      }
      res.status(201);
      res.json(user);
    },
  );
};
