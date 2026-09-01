const request = require('supertest');

jest.mock('../../services/cloudinary.service');
const cloudinaryService = require('../../services/cloudinary.service');

const app = require('../../app');

describe('Upload routes', () => {
  it('POST /api/upload requires authentication', async () => {
    const res = await request(app).post('/api/upload');
    expect(res.status).toBe(401);
    expect(cloudinaryService.uploadImages).not.toHaveBeenCalled();
  });
});
