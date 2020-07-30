import request from 'supertest';
import express, {
  Application, Request, Response, NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';
import requests from '../routes';
import { jwtStruct } from '../../types/jwt';
import generateToken from '../authentication/generateToken';
import * as db from '../testUtils/db-handler';
import insertUser from '../database/insertUser';
import { IUser, UserRoles } from '../../types/user';
import tokenValidation from '../middleware/tokenValidation';
import appInit from '../testUtils/appInit';

describe('routing', () => {
  beforeAll(async () => db.connect());
  afterEach(async () => db.clearDatabase());
  afterAll(async () => db.closeDatabase());

  describe('POST /auth', () => {
    const userData: IUser = {
      username: 'JohnLukeThe3rd',
      password: 'Password123',
      role: 'admin',
    };

    let app: Application;
    beforeAll(() => {
      app = express();
      appInit(app);
      requests(app);
    });

    it('should respond with a jwt token and username', async () => {
      await insertUser(userData);
      const response = await request(app)
        .post('/auth')
        .send({ username: userData.username, password: userData.password })
        .set('Accept', 'application/json')
        .expect(200);
      const decoded: jwtStruct = jwt.verify(
        response.body.jwt,
        process.env.TOKEN_SECRET as string,
      ) as jwtStruct;
      expect(decoded.username).toEqual(userData.username);
    });

    it('should respond with a 400 Bad Request', (done) => {
      request(app)
        .post('/auth')
        .send({ ba: 'friga', passord: 'jesus' })
        .set('Accept', 'application/json')
        .expect('Bad request')
        .expect(400, done);
    });

    it('should respond with a 422 because of wrong username', (done) => {
      request(app)
        .post('/auth')
        .send({ username: 'friga', password: 'jesus' })
        .set('Accept', 'application/json')
        .expect(422, done);
    });

    it('should respond with a 422 because of wrong password', async (done) => {
      await insertUser(userData);
      request(app)
        .post('/auth')
        .send({ username: userData.username, password: 'jesus' })
        .set('Accept', 'application/json')
        .expect(422, done);
    });
  });

  const prep = (
    app: Application,
    mockedFunction: jest.Mock = jest.fn(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      },
    ),
  ) => {
    appInit(app);
    app.use(tokenValidation);
    app.use(mockedFunction);
    requests(app);
  };

  describe('GET /user', () => {
    const userData: IUser = {
      username: 'JohnLukeThe3rd',
      password: 'Password123',
      role: 'admin',
    };

    let app: Application;
    beforeEach(() => {
      app = express();
    });

    it('should respond with user information', async () => {
      prep(app);
      await insertUser(userData);
      const response = await request(app)
        .get('/user')
        .set(
          'Authorization',
          `Bearer ${generateToken({
            username: userData.username,
            role: userData.role,
          })}`,
        )
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        username: userData.username,
        role: userData.role,
      });
    });

    it('should respond with 500 because of bad middleware management', (done) => {
      const badMiddleware = jest.fn(
        (req: Request, res: Response, next: NextFunction) => {
          req.username = undefined;
          next();
        },
      );
      prep(app, badMiddleware);
      request(app)
        .get('/user')
        .set(
          'Authorization',
          `Bearer ${generateToken({
            username: userData.username,
            role: userData.role,
          })}`,
        )
        .set('Accept', 'application/json')
        .expect(500, done);
    });

    it('should respond with 500 because of database problems', async (done) => {
      prep(app);
      await db.clearDatabase();
      request(app)
        .get('/user')
        .set(
          'Authorization',
          `Bearer ${generateToken({
            username: userData.username,
            role: userData.role,
          })}`,
        )
        .set('Accept', 'application/json')
        .expect(500, done);
    });
  });

  describe('POST /users', () => {
    const adminData = {
      username: 'JohnLukeThe3rd',
      role: 'admin' as UserRoles,
    };
    const userData = {
      username: 'regularUsername',
      password: 'Password123',
    };
    let app: Application;
    beforeEach(() => {
      app = express();
      prep(app);
    });

    it('should return registered user', (done) => {
      const adminToken = generateToken(adminData);
      request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Accept', 'application/json')
        .send({ username: userData.username, password: userData.password })
        .expect({ username: 'regularUser', role: '' })
        .expect(201, done);
    });
  });
});
