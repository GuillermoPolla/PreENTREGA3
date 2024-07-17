const ProductRepository = require('../dao/repositories/productRepository');

class ProductController {
  async getProducts(req, res) {
    const products = await ProductRepository.getAll();
    res.render('products', { user: req.user, products, title: 'Lista de Productos' });
  }

  async createProduct(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access Denied');
    }
    const newProduct = await ProductRepository.create(req.body);
    res.json(newProduct);
  }

  async updateProduct(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access Denied');
    }
    const updatedProduct = await ProductRepository.update(req.params.id, req.body);
    res.json(updatedProduct);
  }

  async deleteProduct(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access Denied');
    }
    await ProductRepository.delete(req.params.id);
    res.sendStatus(204);
  }
}

module.exports = new ProductController();
