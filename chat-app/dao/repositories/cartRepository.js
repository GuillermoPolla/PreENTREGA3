const Cart = require('../models/Cart');

class CartRepository {
  async getById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async create(cartData) {
    return await Cart.create(cartData);
  }

  async update(id, cartData) {
    return await Cart.findByIdAndUpdate(id, cartData, { new: true });
  }
}

module.exports = new CartRepository();
