const request = require('supertest');

jest.mock('../../models/Category');
const Category = require('../../models/Category');

const app = require('../../app');

describe('Category routes', () => {
  describe('GET /api/categories', () => {
    it('returns the list of categories sorted by displayOrder', async () => {
      const fakeCategories = [
        { mainCategory: 'Men', subCategory: 'Kurta', displayOrder: 1 },
        { mainCategory: 'Women', subCategory: 'Lawn', displayOrder: 2 },
      ];
      Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeCategories) });

      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toEqual(fakeCategories);
    });
  });

  describe('Write operations require authentication', () => {
    it('POST /api/categories without a token returns 401', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ mainCategory: 'Men', subCategory: 'Kurta' });

      expect(res.status).toBe(401);
      expect(Category.create).not.toHaveBeenCalled();
    });

    it('PUT /api/categories/:id without a token returns 401', async () => {
      const res = await request(app)
        .put('/api/categories/64f1f77bcf86cd7994390112')
        .send({ displayOrder: 5 });

      expect(res.status).toBe(401);
    });

    it('DELETE /api/categories/:id without a token returns 401', async () => {
      const res = await request(app).delete('/api/categories/64f1f77bcf86cd7994390112');
      expect(res.status).toBe(401);
    });
  });
});
