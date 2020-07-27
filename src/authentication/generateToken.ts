import jwt from "jsonwebtoken";

export default (username: { username: string }): string => {
  return jwt.sign(username, process.env.TOKEN_SECRET as string);
};
