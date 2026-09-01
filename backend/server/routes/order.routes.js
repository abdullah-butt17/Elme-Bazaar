const express = require('express');
const controller = require('../controllers/order.controller');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth.middleware');
const { createOrderValidator, trackOrderValidator, orderIdValidator, updateOrderValidator } = require('../validators/order.validator');

const router = express.Router();
router.post('/', createOrderValidator, validate, controller.createOrder);
router.post('/track', trackOrderValidator, validate, controller.trackOrder);
router.get('/', protect, controller.getOrders);
router.get('/:id', protect, orderIdValidator, validate, controller.getOrderById);
router.put('/:id', protect, updateOrderValidator, validate, controller.updateOrder);
router.delete('/:id', protect, orderIdValidator, validate, controller.deleteOrder);
module.exports = router;
