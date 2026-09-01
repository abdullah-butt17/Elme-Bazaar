const mongoose = require('mongoose');

/**
 * Business-wide settings shown across the storefront (footer, contact
 * page, WhatsApp order links) and editable from the Admin Settings UI.
 *
 * This collection is a singleton — there is only ever one Settings
 * document. `getSingleton()` below is the only way the rest of the
 * app should read/create it, so callers never need to worry about
 * missing-document edge cases.
 */
const settingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      default: 'ELME Bazaar',
    },
    logo: {
      url: { type: String },
      publicId: { type: String },
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator(value) {
          return !value || /^\S+@\S+\.\S+$/.test(value);
        },
    message: 'Please provide a valid email',
  },
},
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    deliveryCharges: {
      type: Number,
      default: 0,
      min: [0, 'Delivery charges cannot be negative'],
    },
    returnPolicy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();

  if (!settings) {
    // Bootstraps a default document on first-ever read so GET /api/settings
    // never 404s — the admin simply fills it in via PUT afterward.
    settings = await this.create({
      businessName: 'ELME Bazaar',
      whatsappNumber: '+920000000000',
      address: '',
      email: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      deliveryCharges: 0,
      returnPolicy: '',
    });
  }

  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
