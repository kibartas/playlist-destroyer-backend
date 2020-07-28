import express, {
  Request, Response, NextFunction, Application,
} from 'express';

import request from 'supertest';
import jwt from 'jsonwebtoken';

import { auth } from '../middleware/auth';
import { appInit } from '../testUtils/appInit';

const prep = (app: Application, mockedFunction: jest.Mock) => {
  app.use(mockedFunction);
  app.use(auth);
  app.get('/test', (req: Request, res: Response, next: NextFunction): void => {
    res.json({ username: req.username });
    next();
  });
};

describe('authentication middleware function', () => {
  let mockedFunction: jest.Mock;
  let app: Application;
  beforeEach(() => {
    app = express();
    appInit(app);
  });

  it("should return 401 if there's no token", (done) => {
    mockedFunction = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => next(),
    );
    prep(app, mockedFunction);
    request(app).get('/test').expect({}).expect(401, done);
  });

  it('should return 401 if there\'s no "Bearer " in front of token', (done) => {
    mockedFunction = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => {
        req.headers.authorization = jwt.sign(
          { username: 'JohnLukeThe3rd' },
          process.env.TOKEN_SECRET as string,
        );
        next();
      },
    );
    prep(app, mockedFunction);
    request(app).get('/test').expect({}).expect(401, done);
  });

  it('should return 401 if token is malformed', (done) => {
    mockedFunction = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => {
        req.headers.authorization = `Bearer ${jwt
          .sign(
            { username: 'JohnLukeThe3rd' },
            process.env.TOKEN_SECRET as string,
          )
          .slice(0, -2)}`;
        next();
      },
    );
    prep(app, mockedFunction);
    request(app).get('/test').expect({}).expect(401, done);
  });

  it("should return 200 and username if everything's okay", (done) => {
    mockedFunction = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => {
        req.headers.authorization = `Bearer ${jwt.sign(
          { username: 'JohnLukeThe3rd' },
          process.env.TOKEN_SECRET as string,
        )}`;
        next();
      },
    );
    prep(app, mockedFunction);
    request(app)
      .get('/test')
      .expect(200)
      .expect({ username: 'JohnLukeThe3rd' }, done);
  });
});
