const { body } = require("express-validator");

const updateSettingsValidator = [

  // Business Name
  body("businessName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Business name cannot be empty"),


  // WhatsApp Number
  body("whatsappNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("WhatsApp number cannot be empty")
    .matches(/^\+?[0-9\s-]{7,20}$/)
    .withMessage("Please provide a valid WhatsApp number"),


  // Email
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email"),


  // Logo (Cloudinary URL)
  body("logo")
    .customSanitizer((value) => (value === "" ? undefined : value))
    .optional()
    .isURL()
    .withMessage("Logo must be a valid URL"),


  // Address
  body("address")
    .optional()
    .trim(),


  // Social Links
  body("facebook")
    .customSanitizer((value) => (value === "" ? undefined : value))
    .optional()
    .isURL()
    .withMessage("Facebook must be a valid URL"),


  body("instagram")
    .customSanitizer((value) => (value === "" ? undefined : value))
    .optional()
    .isURL()
    .withMessage("Instagram must be a valid URL"),


  body("tiktok")
    .customSanitizer((value) => (value === "" ? undefined : value))
    .optional()
    .isURL()
    .withMessage("TikTok must be a valid URL"),


  // Delivery Charges
  body("deliveryCharges")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Delivery charges must be a positive number"),


  // Return Policy
  body("returnPolicy")
    .optional()
    .trim(),

];


module.exports = {
  updateSettingsValidator,
};