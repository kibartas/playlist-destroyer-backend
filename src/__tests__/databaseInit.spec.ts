import init from '../database/utils/init';

describe('database init', () => {
  it('should connect without errors', async () => {
    const ready = await init.connect();
    expect(ready).toEqual(1);
  });

  afterAll(async () => init.closeDatabase());
});
