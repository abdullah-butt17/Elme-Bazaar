const request = require('supertest');

jest.mock('../../models/Product');
jest.mock('../../services/cloudinary.service');

const Product = require('../../models/Product');
const cloudinaryService = require('../../services/cloudinary.service');

const app = require('../../app');

describe('Product routes', () => {
  describe('GET /api/products', () => {
    const mockChain = (resolvedProducts) => ({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(resolvedProducts),
    });

    it('returns paginated products with default page/limit', async () => {
      Product.find.mockReturnValue(mockChain([{ name: 'Silk Kurta' }]));
      Product.countDocuments.mockResolvedValue(1);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.pagination).toEqual(
        expect.objectContaining({ page: 1, limit: 12, totalItems: 1, totalPages: 1 })
      );
    });

    it('applies mainCategory/subCategory filters from query params', async () => {
      Product.find.mockReturnValue(mockChain([]));
      Product.countDocuments.mockResolvedValue(0);

      await request(app).get('/api/products?mainCategory=Men&subCategory=Kurta');

      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({ mainCategory: 'Men', subCategory: 'Kurta' })
      );
    });

    it('applies a $text search filter when ?search= is provided', async () => {
      Product.find.mockReturnValue(mockChain([]));
      Product.countDocuments.mockResolvedValue(0);

      await request(app).get('/api/products?search=silk');

      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({ $text: { $search: 'silk' } })
      );
    });

    it('clamps limit to a maximum of 100', async () => {
      Product.find.mockReturnValue(mockChain([]));
      Product.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/products?limit=9999');

      expect(res.body.pagination.limit).toBe(100);
    });
  });

  describe('GET /api/products/:id', () => {
    it('looks up by slug when the param is not a valid ObjectId', async () => {
      Product.findOne.mockResolvedValue({ name: 'Emerald Silk Kurta', slug: 'emerald-silk-kurta' });

      const res = await request(app).get('/api/products/emerald-silk-kurta');

      expect(res.status).toBe(200);
      expect(Product.findOne).toHaveBeenCalledWith({ slug: 'emerald-silk-kurta' });
    });

    it('looks up by _id when the param is a valid ObjectId', async () => {
      Product.findOne.mockResolvedValue({ name: 'Emerald Silk Kurta' });
      const validId = '64f1f77bcf86cd7994390112';

      await request(app).get(`/api/products/${validId}`);

      expect(Product.findOne).toHaveBeenCalledWith({ _id: validId });
    });

    it('returns 404 when no product matches', async () => {
      Product.findOne.mockResolvedValue(null);

      const res = await request(app).get('/api/products/does-not-exist');

      expect(res.status).toBe(404);
    });
  });

  describe('Write operations require authentication', () => {
    it('POST /api/products without a token returns 401', async () => {
      const res = await request(app).post('/api/products').send({ name: 'Test' });
      expect(res.status).toBe(401);
      expect(Product.create).not.toHaveBeenCalled();
    });

    it('DELETE /api/products/:id without a token returns 401', async () => {
      const res = await request(app).delete('/api/products/64f1f77bcf86cd7994390112');
      expect(res.status).toBe(401);
      expect(cloudinaryService.deleteImage).not.toHaveBeenCalled();
    });
  });
});
