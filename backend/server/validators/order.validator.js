const { body, param } = require('express-validator');

const createOrderValidator = [
  body('customer.name').trim().notEmpty().withMessage('Full name is required'),
  body('customer.email').trim().isEmail().withMessage('A valid email is required'),
  body('customer.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('customer.address').trim().notEmpty().withMessage('Delivery address is required'),
  body('customer.city').trim().notEmpty().withMessage('City is required'),
  body('customer.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('items').isArray({ min: 1 }).withMessage('Cart cannot be empty'),
  body('items.*.productId').isMongoId().withMessage('Invalid product'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.selectedSize').optional().trim(),
  body('items.*.selectedColor').optional().trim(),
];
const trackOrderValidator = [
  body('orderId').trim().custom((value) => {
    if (/^[A-Z0-9]{10,12}$/i.test(value) || /^[a-f0-9]{24}$/i.test(value)) return true;
    throw new Error('Invalid order reference');
  }),
  body('email').trim().isEmail().withMessage('A valid email is required'),
];
const orderIdValidator = [param('id').isMongoId().withMessage('Invalid order id')];
const updateOrderValidator = [
  ...orderIdValidator,
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status'),
  body('trackingCode').optional({ values: 'falsy' }).trim().isLength({ max: 100 }).withMessage('Tracking code is too long'),
  body('courierName').optional({ values: 'falsy' }).trim().isLength({ max: 100 }).withMessage('Courier name is too long'),
];
module.exports = { createOrderValidator, trackOrderValidator, orderIdValidator, updateOrderValidator };
