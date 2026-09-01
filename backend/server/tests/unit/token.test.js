const { setTokenCookie } = require('../../utils/token');

describe('setTokenCookie', () => {
  it('sets a 24-hour max age cookie for the admin session', () => {
    const res = {
      cookie: jest.fn(),
    };

    setTokenCookie(res, 'demo-token');

    expect(res.cookie).toHaveBeenCalledWith(
      expect.any(String),
      'demo-token',
      expect.objectContaining({
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
    );
  });
});
