import express, {
  Request, Response, NextFunction, Application,
} from 'express';

import request from 'supertest';
import { appInit } from '../testUtils/appInit';
import { unless } from '../middleware/utils/unless';
import { routes } from '../routes';

describe('unless util function', () => {
  let mockMiddleware: jest.Mock<void>;
  let app: Application;
  beforeAll(() => {
    mockMiddleware = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => {
        next();
      },
    );
    app = express();
    app.use(unless(routes.authentication, mockMiddleware));
    app.post(routes.authentication, (req: Request, res: Response) => {
      res.sendStatus(200);
    });
    app.get('/me', (req: Request, res: Response) => {
      res.status(200);
      res.json('You are in');
    });
    appInit(app);
  });

  it('should not call middleware function', async () => {
    await request(app)
      .post(routes.authentication)
      .send({ username: 'Luke', password: 'Edwards' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(mockMiddleware).not.toHaveBeenCalled();
  });

  it('should call middleware function', async () => {
    await request(app)
      .get('/me')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(/You are in/i)
      .expect(200);
    expect(mockMiddleware).toHaveBeenCalledTimes(1);
  });
});
