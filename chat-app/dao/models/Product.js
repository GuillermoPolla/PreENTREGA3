const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: { type: String, unique: true },
  price: Number,
  status: { type: Boolean, default: true },
  stock: Number,
  category: String,
  thumbnails: [String],
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
