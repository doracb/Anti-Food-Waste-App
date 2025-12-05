const express = require('express');
const router = express.Router();

const claimsController = require('../controllers/claims.controller');

router.post('/', claimsController.createClaim);
router.get('/user/:userId', claimsController.getUserClaims);
router.get('/owner/:ownerId', claimsController.getClaimsForMyFoods);
router.put('/:id', claimsController.updateClaimStatus);

module.exports = router;