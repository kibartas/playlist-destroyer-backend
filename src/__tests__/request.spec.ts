import request from "supertest";
import requests from "../requests";
import express from "express";
import { Application } from "express";
import initialization from "../initialization";
import jwt from "jsonwebtoken";
import { jwtStruct } from "../@types";

const app: Application = express();

const username = "JohnLukeThe3rd";

describe("POST /auth", () => {
  beforeAll(() => {
    initialization(app);
    requests(app);
  });
  it("should respond with a jwt token and username", async () => {
    const response = await request(app)
      .post("/auth")
      .send({ username: "JohnLukeThe3rd", password: "abc" })
      .set("Accept", "application/json")
      .expect(200);
    const decoded: jwtStruct = <jwtStruct>(
      jwt.verify(response.body.jwt, <string>process.env.TOKEN_SECRET)
    );
    expect(decoded.username).toEqual(username);
  });
  it("should respond with a 404 Bad Request", (done) => {
    request(app)
      .post("/auth")
      .send({ ba: "friga", passord: "jesus" })
      .set("Accept", "application/json")
      .expect("Bad request")
      .expect(400, done);
  });

  it("idk", (done) => {
    request(app).get("/hello").expect("Fuck").expect(200, done);
  });
});
