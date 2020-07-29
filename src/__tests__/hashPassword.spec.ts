import hashPassword from '../database/utils/hashPassword';

describe('hashPassword function', () => {
  it('should return a hashed password', async () => {
    expect(await hashPassword('password')).not.toEqual('password');
  });
});
