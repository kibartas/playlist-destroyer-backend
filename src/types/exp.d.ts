import { Express } from "express-serve-static-core";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    username?: string;
  }
}
