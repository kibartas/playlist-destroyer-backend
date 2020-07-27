import jwt from "jsonwebtoken";

export default (username: { username: string }): string => {
  return jwt.sign(username, <string>process.env.TOKEN_SECRET);
};
