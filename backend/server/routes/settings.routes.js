const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { updateSettingsValidator } = require('../validators/settings.validator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', protect, updateSettingsValidator, validate, settingsController.updateSettings);

module.exports = router;
