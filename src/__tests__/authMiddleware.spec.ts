import express, {
  Request, Response, NextFunction, Application,
} from 'express';

import request from 'supertest';

import { auth } from '../middleware/auth';
import { appInit } from '../testUtils/appInit';
import generateToken from '../authentication/generateToken';

const userData = {
  username: 'JohnLukeThe3rd',
  role: 'admin',
};

const prep = (app: Application, mockedFunction: jest.Mock) => {
  app.use(mockedFunction);
  app.use(auth);
  app.get('/test', (req: Request, res: Response, next: NextFunction): void => {
    res.json({ username: req.username, role: req.role });
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
        req.headers.authorization = generateToken(userData);
        next();
      },
    );
    prep(app, mockedFunction);
    request(app).get('/test').expect({}).expect(401, done);
  });

  it('should return 401 if token is malformed', (done) => {
    mockedFunction = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => {
        req.headers.authorization = `Bearer ${generateToken(userData)}`.slice(
          0,
          -2,
        );
        next();
      },
    );
    prep(app, mockedFunction);
    request(app).get('/test').expect({}).expect(401, done);
  });

  it("should return 200, username and role if everything's okay", (done) => {
    mockedFunction = jest.fn(
      (req: Request, res: Response, next: NextFunction): void => {
        req.headers.authorization = `Bearer ${generateToken(userData)}`;
        next();
      },
    );
    prep(app, mockedFunction);
    request(app)
      .get('/test')
      .expect(200)
      .expect({ username: 'JohnLukeThe3rd', role: 'admin' }, done);
  });
});
