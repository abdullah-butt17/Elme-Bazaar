const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendAdminNewOrderEmail,
} = require('../services/email.service');
const crypto = require('crypto');

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const createOrderReference = () => Array.from(
  crypto.randomBytes(10),
  (byte) => REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]
).join('');

const allowedTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const createOrder = asyncHandler(async (req, res) => {
  const { customer, items } = req.body;

  const products = await Product.find({
    _id: { $in: items.map((item) => item.productId) },
  });

  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new ApiError(
        404,
        'One or more products are no longer available.'
      );
    }

    if (product.stockStatus === 'out_of_stock') {
      throw new ApiError(
        409,
        `${product.name} is out of stock.`
      );
    }

    if (
      item.selectedSize &&
      !product.availableSizes.includes(item.selectedSize)
    ) {
      throw new ApiError(
        400,
        `Invalid size for ${product.name}.`
      );
    }

    if (
      item.selectedColor &&
      !product.availableColors.includes(item.selectedColor)
    ) {
      throw new ApiError(
        400,
        `Invalid color for ${product.name}.`
      );
    }

    const price = product.salePrice ?? product.price;

    return {
      productId: product._id,
      productName: product.name,
      image: product.images?.[0]?.url || '',
      price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      subtotal: price * item.quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const settings = await Settings.getSingleton();
  const deliveryCharges = settings.deliveryCharges || 0;

  let order;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      order = await Order.create({
        orderReference: createOrderReference(),
        customer,
        items: orderItems,
        subtotal,
        deliveryCharges,
        total: subtotal + deliveryCharges,
      });

      break;
    } catch (error) {
      if (error.code !== 11000 || attempt === 2) {
        throw error;
      }
    }
  }

  // Customer receives order confirmation
  await sendOrderConfirmationEmail(order);

  // Owner/Admin receives new order notification
  await sendAdminNewOrderEmail(order);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

const trackOrder = asyncHandler(async (req, res) => {
  const reference = req.body.orderId.trim().toUpperCase();

  const referenceQuery = mongoose.Types.ObjectId.isValid(reference)
    ? [{ _id: reference }, { orderReference: reference }]
    : [{ orderReference: reference }];

  const order = await Order.findOne({
    $or: referenceQuery,
    'customer.email': req.body.email.toLowerCase(),
  });

  if (!order) {
    throw new ApiError(
      404,
      'We could not find an order with those details.'
    );
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

const updateOrder = asyncHandler(async (req, res) => {
  const currentOrder = await Order.findById(req.params.id);

  if (!currentOrder) {
    throw new ApiError(404, 'Order not found');
  }

  const previousStatus = currentOrder.status;
  const previousTrackingCode = currentOrder.trackingCode;
  const previousCourierName = currentOrder.courierName;

  if (
    previousStatus !== req.body.status &&
    !allowedTransitions[previousStatus].includes(req.body.status)
  ) {
    throw new ApiError(
      409,
      `Cannot change an order from ${previousStatus} to ${req.body.status}.`
    );
  }

  const requestedTrackingCode =
    req.body.trackingCode ?? previousTrackingCode;

  const requestedCourierName =
    req.body.courierName ?? previousCourierName;

  const isUnchanged =
    previousStatus === req.body.status &&
    previousTrackingCode === requestedTrackingCode &&
    previousCourierName === requestedCourierName;

  const isShipmentDetailsChanged =
    previousTrackingCode !== requestedTrackingCode ||
    previousCourierName !== requestedCourierName;

  const isLockedStatus =
    ['delivered', 'cancelled'].includes(previousStatus);

  if (
    (isLockedStatus && !isUnchanged) ||
    (previousStatus === 'shipped' && isShipmentDetailsChanged)
  ) {
    throw new ApiError(
      409,
      `Orders marked ${previousStatus} cannot be edited.`
    );
  }

  currentOrder.status = req.body.status;

  if (req.body.trackingCode !== undefined) {
    currentOrder.trackingCode = req.body.trackingCode;
  }

  if (req.body.courierName !== undefined) {
    currentOrder.courierName = req.body.courierName;
  }

  if (
    currentOrder.status === 'shipped' &&
    (!currentOrder.trackingCode || !currentOrder.courierName)
  ) {
    throw new ApiError(
      400,
      'Courier name and tracking code are required before shipping an order.'
    );
  }

  const order = await currentOrder.save();

  const trackingDetailsChanged =
    previousTrackingCode !== order.trackingCode ||
    previousCourierName !== order.courierName;

  if (
    previousStatus !== order.status ||
    (order.status === 'shipped' && trackingDetailsChanged)
  ) {
    await sendOrderStatusEmail(order, previousStatus);
  }

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order,
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (!['cancelled', 'delivered'].includes(order.status)) {
    throw new ApiError(
      409,
      'Only cancelled or delivered orders can be deleted.'
    );
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Order deleted',
    data: {},
  });
});

module.exports = {
  createOrder,
  getOrders,
  trackOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};