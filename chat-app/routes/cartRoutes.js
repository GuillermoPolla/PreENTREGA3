const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', ensureAuthenticated, CartController.getCart);
router.post('/add/:pid', ensureAuthenticated, CartController.addToCart);
router.post('/purchase', ensureAuthenticated, CartController.purchaseCart);

module.exports = router;
