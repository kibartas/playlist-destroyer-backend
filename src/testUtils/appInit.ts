import { Application } from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";

export const appInit = (app: Application): void => {
  dotenv.config();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.set("port", process.env.PORT || 8080);
};
