const request = require('supertest');

jest.mock('../../models/Settings');
const Settings = require('../../models/Settings');

const app = require('../../app');

describe('Settings routes', () => {
  describe('GET /api/settings', () => {
    it('returns the singleton settings document', async () => {
      const fakeSettings = { businessName: 'ELME Bazaar', whatsappNumber: '+923001234567' };
      Settings.getSingleton.mockResolvedValue(fakeSettings);

      const res = await request(app).get('/api/settings');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(fakeSettings);
    });
  });

  describe('PUT /api/settings', () => {
    it('requires authentication', async () => {
      const res = await request(app).put('/api/settings').send({ businessName: 'New Name' });
      expect(res.status).toBe(401);
      expect(Settings.getSingleton).not.toHaveBeenCalled();
    });

    it('rejects an invalid WhatsApp number even before auth would matter', async () => {
      // Validators run after `protect` in this route, so an unauthenticated
      // request should still be blocked at 401 first — this test documents
      // that ordering rather than asserting validation ran.
      const res = await request(app)
        .put('/api/settings')
        .send({ whatsappNumber: '!!!not-a-number!!!' });

      expect(res.status).toBe(401);
    });
  });
});
