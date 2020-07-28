import { Application, Request, Response } from 'express';
import generateToken from '../authentication/generateToken';

export default (app: Application): void => {
  app.post(
    '/auth',
    async (req: Request, res: Response): Promise<void> => {
      const { body } = req;
      if (body?.username && body?.password) {
        const token = generateToken({ username: body.username });
        res.send({ username: body.username, jwt: token });
      } else {
        res.status(400);
        res.send('Bad request');
      }
    },
  );

  app.get('/user', (req: Request, res: Response): void => {
    res.json({ username: req.username });
  });
};
