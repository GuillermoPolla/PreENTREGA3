const Cart = require('../dao/models/Cart');
const Product = require('../dao/models/Product');
const Ticket = require('../dao/models/Ticket');
const { v4: uuidv4 } = require('uuid');

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { pid } = req.params;
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const productInCart = cart.products.find(product => product.productId.toString() === pid);
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ productId: pid, quantity: 1 });
            }
            await cart.save();
        } else {
            cart = await Cart.create({
                userId,
                products: [{ productId: pid, quantity: 1 }]
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.json({ success: false, error: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        let totalAmount = 0;
        let products = [];

        if (cart && cart.products.length > 0) {
            products = cart.products;
            totalAmount = cart.products.reduce((total, item) => {
                return total + item.productId.price * item.quantity;
            }, 0);
        }

        res.render('cart', { user: req.user, cart: cart ? { products, _id: cart._id } : null, totalAmount, isEmpty: !cart || cart.products.length === 0 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.json({ success: false, error: error.message });
    }
};

const purchaseCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        let amount = 0;
        const purchasedProducts = [];
        const failedProducts = [];

        for (const item of cart.products) {
            const product = item.productId;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                amount += product.price * item.quantity;
                purchasedProducts.push(product._id);
            } else {
                failedProducts.push(product._id);
            }
        }

        const ticket = await Ticket.create({
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount,
            purchaser: req.user.email
        });

        cart.products = cart.products.filter(item => failedProducts.includes(item.productId.toString()));
        if (cart.products.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
        } else {
            await cart.save();
        }

        res.redirect('/api/products');
    } catch (error) {
        console.error('Error purchasing cart:', error);
        res.json({ success: false, error: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    purchaseCart
};
