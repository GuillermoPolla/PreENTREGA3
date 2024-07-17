require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const passport = require('./chat-app/config/passport-config');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const connectDB = require('./chat-app/config/config'); 

const authRoutes = require('./chat-app/routes/authRoutes');
const productRoutes = require('./chat-app/routes/productRoutes');
const cartRoutes = require('./chat-app/routes/cartRoutes');
const { ensureAuthenticated } = require('./chat-app/middlewares/authMiddleware');
const Cart = require('./chat-app/dao/models/Cart');
const ProductManager = require('./chat-app/dao/models/ProductManager');

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8080;

// Conectar a la base de datos
connectDB();

// Configuración de la sesión
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de flash messages
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Configuración del motor de plantillas con opciones para controlar el acceso a prototipos y helpers
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'chat-app/views'),
    partialsDir: path.join(__dirname, 'chat-app/views/partials'), // Si tienes parciales
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        calculateTotal: (quantity, price) => quantity * price
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'chat-app/views'));

// Middleware para parsear el body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/auth', authRoutes);
app.use('/api/products', ensureAuthenticated, productRoutes);
app.use('/api/carts', ensureAuthenticated, cartRoutes);

// Ruta para la página de inicio
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/api/products');
    } else {
        res.redirect('/auth/login');
    }
});

// Ruta para ver el carrito
app.get('/cart', ensureAuthenticated, (req, res) => {
    const userId = req.user._id;
    Cart.findOne({ userId }).populate('products.productId').then(cart => {
        let totalAmount = 0;
        let products = [];

        if (cart) {
            products = cart.products;
            totalAmount = cart.products.reduce((total, item) => {
                return total + item.productId.price * item.quantity;
            }, 0);
        }

        res.render('cart', { user: req.user, cart: cart ? { products, _id: cart._id } : { products: [] }, totalAmount, isEmpty: !cart || cart.products.length === 0 });
    }).catch(error => {
        console.error('Error fetching cart:', error);
        res.json({ success: false, error: error.message });
    });
});

// Inicializar ProductManager y cargar productos
const productManager = new ProductManager();

// Manejo de websockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('productList', productManager.getProducts()); 

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
