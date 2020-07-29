import request from 'supertest';
import express, { Application } from 'express';

import jwt from 'jsonwebtoken';
import initialization from '../initialization';
import requests from '../routes';
import { jwtStruct } from '../../types/jwt';
import generateToken from '../authentication/generateToken';

const app: Application = express();

const username = 'JohnLukeThe3rd';

describe('routing', () => {
  beforeAll(() => {
    initialization(app);
    requests(app);
  });

  describe('POST /auth', () => {
    it('should respond with a jwt token and username', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ username: 'JohnLukeThe3rd', password: 'abc' })
        .set('Accept', 'application/json')
        .expect(200);
      const decoded: jwtStruct = jwt.verify(
        response.body.jwt,
        process.env.TOKEN_SECRET as string,
      ) as jwtStruct;
      expect(decoded.username).toEqual(username);
    });

    it('should respond with a 404 Bad Request', (done) => {
      request(app)
        .post('/auth')
        .send({ ba: 'friga', passord: 'jesus' })
        .set('Accept', 'application/json')
        .expect('Bad request')
        .expect(400, done);
    });
  });

  describe('GET /user', () => {
    it('should respond with user information', (done) => {
      request(app)
        .get('/user')
        .set('Authorization', `Bearer ${generateToken({ username })}`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect({ username }, done);
    });
  });
});