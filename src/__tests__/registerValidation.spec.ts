import request from 'supertest';
import express from 'express';
import appInit from '../testUtils/appInit';
import registerValidation from '../middleware/registerValidation';
import * as db from '../testUtils/db-handler';

const validUsername = 'regularUser';
const shortUsername = 'regular';
const longUsername = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const validPassword = 'Password1234567890*';
const shortPassword = 'Pard123*&';
const longPassword = 'Passwoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooord123*';
const regexPassword = 'password1234567890';

describe('register info validation middleware', () => {
  let app: express.Application;
  let requestMade: request.Test;
  beforeEach(() => {
    app = express();
    appInit(app);
    app.use(registerValidation);
    app.post('/test', (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    });
    requestMade = request(app).post('/test').set('Accept', 'application/json');
  });

  beforeAll(async () => db.connect());
  afterEach(async () => db.clearDatabase());
  afterAll(async () => db.closeDatabase());

  it("should respond with 400 if there's no username", (done) => {
    requestMade
      .send({ password: validPassword })
      .expect({ message: 'Missing username' })
      .expect(400, done);
  });

  it("should respond with 400 if there's no password", (done) => {
    requestMade
      .send({ username: validUsername })
      .expect({ message: 'Missing password' })
      .expect(400, done);
  });

  it("should respond with 400 if there's no username and password", (done) => {
    requestMade
      .send({})
      .expect({ message: 'Missing username and password' })
      .expect(400, done);
  });

  it('should respond with 422 if username is too short', (done) => {
    requestMade
      .send({ username: shortUsername, password: validPassword })
      .expect({ message: 'Username too short' })
      .expect(422, done);
  });

  it('should respond with 422 if username is too long', (done) => {
    requestMade
      .send({ username: longUsername, password: validPassword })
      .expect({ message: 'Username too long' })
      .expect(422, done);
  });

  it('should respond with 422 if password is too short', (done) => {
    requestMade
      .send({ username: validUsername, password: shortPassword })
      .expect({ message: 'Password too short' })
      .expect(422, done);
  });

  it('should respond with 422 if password is too long', (done) => {
    requestMade
      .send({ username: validUsername, password: longPassword })
      .expect({ message: 'Password too long' })
      .expect(422, done);
  });

  it("should respond with 422 if password doesn't match regex", (done) => {
    requestMade
      .send({ username: validUsername, password: regexPassword })
      .expect({
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one special symbol and one digit',
      })
      .expect(422, done);
  });

  it('should respond with 200 if info is valid', (done) => {
    requestMade
      .send({ username: validUsername, password: validPassword })
      .expect(200, done);
  });
});
