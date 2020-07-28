import jwt from 'jsonwebtoken';
import generateToken from '../authentication/generateToken';
import { jwtStruct } from '../../types/jwt';

const payload = { username: 'JohnLukeThe3rd' };

describe('generating a token', () => {
  it('should generate a jwt', () => {
    const token = generateToken(payload);
    const decoded: jwtStruct = jwt.decode(token) as jwtStruct;
    expect(decoded.username).toEqual(payload.username);
  });
});
