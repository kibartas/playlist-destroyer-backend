import { Application } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { tokenValidation } from '../middleware/tokenValidation';
import { unless } from '../middleware/utils/unless';
import requests, { routes } from '../routes';
import init from '../database/utils/init';
import registerValidation from '../middleware/registerValidation';

export default async (app: Application): Promise<void> => {
  dotenv.config();

  app.use(cors());

  app.use(helmet());
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(unless(routes.authentication, tokenValidation));

  app.post(routes.users, registerValidation);

  app.set('port', process.env.PORT || 8080);

  await init.connect();

  requests(app);
};
