const express = require('express');
const router = express.Router();

router.use('/users', require('./users.routes'));
router.use('/groups', require('./groups.routes'));
router.use('/claims', require('./claims.routes'));
router.use('/foods', require('./foods.routes'));

module.exports = router;