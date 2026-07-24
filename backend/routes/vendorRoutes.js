const express = require('express');
const router = express.Router();
const { addVendor, getVendors } = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addVendor);
router.get('/', authMiddleware, getVendors);

module.exports = router;