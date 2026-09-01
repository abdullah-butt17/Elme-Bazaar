const request = require('supertest');

jest.mock('../../models/User');
const User = require('../../models/User');

const app = require('../../app');

describe('Auth routes', () => {
  describe('POST /api/auth/login', () => {
    it('rejects a malformed request body before touching the database', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(User.findOne).not.toHaveBeenCalled();
    });

    it('returns 401 for an email that does not exist', async () => {
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'owner@mzthreads.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('returns 401 when the password does not match', async () => {
      const fakeUser = {
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'owner@mzthreads.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('logs in successfully with correct credentials and sets a cookie', async () => {
      const fakeUser = {
        _id: 'abc123',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ _id: 'abc123', email: 'owner@mzthreads.com' }),
      };
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'owner@mzthreads.com', password: 'correctpassword' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  describe('Protected routes without a token', () => {
    it('GET /api/auth/me returns 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('POST /api/auth/logout returns 401', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(401);
    });
  });
});
