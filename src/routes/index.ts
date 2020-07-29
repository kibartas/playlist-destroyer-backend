import { Application, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import generateToken from '../authentication/generateToken';
import getUser from '../database/getUser';
import { IUser } from '../../types/user';

export default (app: Application): void => {
  app.post(
    '/auth',
    async (req: Request, res: Response): Promise<void> => {
      const { body } = req;
      if (body?.username && body?.password) {
        const user = await getUser(body.username, true);
        if (user === null) {
          res.sendStatus(422);
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
    '/user',
    async (req: Request, res: Response): Promise<void> => {
      if (req.username === undefined) {
        res.sendStatus(500);
        return;
      }
      const user: IUser | null = await getUser(req.username);
      if (user === null) {
        res.sendStatus(500);
        return;
      }
      res.status(200);
      res.json({ username: user.username, role: user.role });
    },
  );
};
