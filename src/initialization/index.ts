import { Application } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { auth } from '../middleware/auth';
import { unless } from '../middleware/utils/unless';
import requests from '../routes';
import init from '../database/utils/init';

export default async (app: Application): Promise<void> => {
  dotenv.config();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(unless('/auth', auth));

  app.set('port', process.env.PORT || 8080);

  await init.connect();

  requests(app);
};
