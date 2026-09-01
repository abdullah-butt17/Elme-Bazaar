const mongoose = require('mongoose');

const orderReferenceSchema = {
  orderReference: { type: String, unique: true, index: true, sparse: true, uppercase: true, trim: true },
};

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  productName: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, trim: true },
  selectedColor: { type: String, trim: true },
  subtotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  ...orderReferenceSchema,
  customer: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryCharges: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  trackingCode: { type: String, trim: true, default: '' },
  courierName: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
module.exports = mongoose.model('Order', orderSchema);
