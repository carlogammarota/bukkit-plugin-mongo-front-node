// Suprimir warnings de deprecación
process.removeAllListeners('warning');
process.on('warning', () => {});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');
const CommandSender = require('./command-sender');
const StatsIntegration = require('./stats-integration');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Configurar trust proxy para rate limiting
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "chrome-extension:"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://cdn.tailwindcss.com"],
            scriptSrcElem: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'unsafe-hashes'", "'sha256-kN+ecsMIG0Kn8NdB8FEml9rA7P4cdLUX1U+wEFtE4bI='"],
            connectSrc: ["'self'", "wss:", "ws:", "https:"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"]
        }
    }
}));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos por IP
    message: { error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://craftar.com', /^https:\/\/.*\.ngrok-free\.app$/] 
        : true,
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'front/dist')));

// Apply rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', generalLimiter);

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/minecraft';
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', async () => {
    console.log('Conectado a MongoDB correctamente');
    
    // Crear productos de ejemplo si no existen
    await createSampleProducts();
    
    // Crear usuario admin si no existe
    await createAdminUser();
    
    // Crear cupones de ejemplo si no existen
    await createSampleCoupons();
});

// Función para crear productos de ejemplo
async function createSampleProducts() {
    try {
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            console.log('Productos ya existen, omitiendo creación de ejemplos');
            return;
        }

        const sampleProducts = [
            {
                name: 'Espada de Diamante',
                minecraftItem: 'DIAMOND_SWORD',
                description: 'Una espada de diamante con gran poder de ataque',
                price: 5000,
                category: 'Armas',
                image: 'https://minecraft.wiki/images/8/80/Diamond_Sword_JE3_BE3.png',
                stock: -1,
                defaultQuantity: 1
            },
            {
                name: 'Pico de Diamante',
                minecraftItem: 'DIAMOND_PICKAXE',
                description: 'Pico de diamante para minar más rápido',
                price: 4500,
                category: 'Herramientas',
                image: 'https://minecraft.wiki/images/8/8a/Diamond_Pickaxe_JE3_BE3.png',
                stock: -1,
                defaultQuantity: 1
            },
            {
                name: 'Armadura de Diamante Completa',
                minecraftItem: 'DIAMOND_CHESTPLATE', // Mantener para compatibilidad
                items: [
                    { item: 'DIAMOND_HELMET', quantity: 1 },
                    { item: 'DIAMOND_CHESTPLATE', quantity: 1 },
                    { item: 'DIAMOND_LEGGINGS', quantity: 1 },
                    { item: 'DIAMOND_BOOTS', quantity: 1 }
                ],
                description: 'Armadura de diamante completa para máxima protección',
                price: 15000,
                category: 'Armadura',
                image: 'https://minecraft.wiki/images/5/5f/Diamond_Chestplate_JE3_BE3.png',
                stock: -1,
                defaultQuantity: 1
            },
            {
                name: 'Diamantes (64)',
                minecraftItem: 'DIAMOND',
                description: '64 diamantes para tus proyectos',
                price: 8000,
                category: 'Materiales',
                image: 'https://minecraft.wiki/images/f/fd/Diamond_JE4_BE3.png',
                stock: -1,
                defaultQuantity: 64
            },
            {
                name: 'Elytra',
                minecraftItem: 'ELYTRA',
                description: 'Alas para volar por el mundo',
                price: 25000,
                category: 'Especiales',
                image: 'https://minecraft.wiki/images/0/08/Elytra_JE2_BE2.png',
                stock: 10,
                defaultQuantity: 1
            },
            {
                name: 'Totem de Inmortalidad',
                minecraftItem: 'TOTEM_OF_UNDYING',
                description: 'Te salva de la muerte una vez',
                price: 30000,
                category: 'Especiales',
                image: 'https://minecraft.wiki/images/6/6a/Totem_of_Undying_JE2_BE2.png',
                stock: 5,
                defaultQuantity: 1
            },
            {
                name: 'Libro Encantado - Silk Touch',
                minecraftItem: 'ENCHANTED_BOOK',
                description: 'Libro con encantamiento Silk Touch',
                price: 12000,
                category: 'Encantamientos',
                image: 'https://minecraft.wiki/images/7/7a/Enchanted_Book.gif',
                stock: -1,
                defaultQuantity: 1
            },
            {
                name: 'Perla de Ender (16)',
                minecraftItem: 'ENDER_PEARL',
                description: '16 perlas de ender para teletransportarte',
                price: 3000,
                category: 'Materiales',
                image: 'https://minecraft.wiki/images/8/8a/Ender_Pearl_JE3_BE2.png',
                stock: -1,
                defaultQuantity: 16
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log('Productos de ejemplo creados exitosamente');
    } catch (error) {
        console.error('Error al crear productos de ejemplo:', error);
    }
}

// Función para crear usuario admin
async function createAdminUser() {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Usuario admin ya existe');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            username: 'admin',
            email: 'admin@craftar.com',
            password: hashedPassword,
            minecraftUsername: 'AdminCraftAR',
            role: 'admin',
            balance: 100000
        });

        await adminUser.save();
        console.log('Usuario admin creado: admin / admin123');
    } catch (error) {
        console.error('Error al crear usuario admin:', error);
    }
}

// Función para crear cupones de ejemplo
async function createSampleCoupons() {
    try {
        const existingCoupons = await Coupon.countDocuments();
        if (existingCoupons > 0) {
            console.log('Cupones ya existen, omitiendo creación de ejemplos');
            return;
        }

        const sampleCoupon = new Coupon({
            code: 'XNX321',
            description: 'Cupón de bienvenida - 30,000 monedas gratis',
            coinsReward: 30000,
            maxUses: 5,
            usedCount: 0,
            isActive: true
        });

        await sampleCoupon.save();
        console.log('Cupón de ejemplo creado: XNX321 - 30,000 monedas (5 usos)');
    } catch (error) {
        console.error('Error al crear cupones de ejemplo:', error);
    }
}

// Esquemas de MongoDB
const playerSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastSeen: { type: Number, default: Date.now }
});

const inventorySchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    inventory: { type: String, required: true },
    lastSaved: { type: Number, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    minecraftUsername: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    balance: { type: Number, default: 0 }, // Monedas del usuario
    coins: { type: Number, default: 0 }, // Alias para balance (compatibilidad)
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    lastLoginIP: { type: String },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    minecraftAccessCode: { type: String },
    minecraftCodeExpires: { type: Date },
    trustedDevices: [{ 
        deviceId: String, 
        deviceName: String, 
        lastUsed: Date,
        ipAddress: String
    }]
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    minecraftItem: { type: String, required: true }, // Mantener para compatibilidad
    items: [{ // Nuevo campo para múltiples items
        item: { type: String, required: true },
        quantity: { type: Number, default: 1 }
    }],
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    stock: { type: Number, default: -1 }, // -1 = ilimitado
    defaultQuantity: { type: Number, default: 1 }, // Cantidad por defecto que se entrega
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paying', 'paid', 'delivered', 'cancelled', 'error'], default: 'pending' },
    paymentMethod: { type: String, enum: ['mercadopago', 'wallet', 'coins'], default: 'mercadopago' },
    mercadopagoPreferenceId: { type: String },
    mercadopagoPaymentId: { type: String },
    walletAmountUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    deliveredAt: { type: Date }
});

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ARS' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, enum: ['mercadopago', 'wallet', 'coins'], required: true },
    mercadopagoPreferenceId: { type: String },
    mercadopagoPaymentId: { type: String },
    externalReference: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const walletTransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'payment', 'refund', 'coupon'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    createdAt: { type: Date, default: Date.now }
});

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    coinsReward: { type: Number, required: true },
    maxUses: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

const couponUsageSchema = new mongoose.Schema({
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    usedAt: { type: Date, default: Date.now },
    coinsRewarded: { type: Number, required: true }
});

const pendingItemSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    items: { type: String, required: true },
    lastUpdated: { type: Number, default: Date.now }
});

const Player = mongoose.model('Player', playerSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
// Métodos de seguridad para el esquema de usuario
userSchema.methods.incLoginAttempts = function() {
    // Si tenemos un lockUntil anterior y ya expiró, reiniciar intentos
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Si llegamos a 5 intentos y no hay lockUntil, establecerlo
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
    }
    
    return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.generateEmailVerificationToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = token;
    return token;
};

userSchema.methods.generatePasswordResetToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
    return token;
};

userSchema.methods.generateDeviceId = function() {
    return crypto.randomBytes(16).toString('hex');
};

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
const Coupon = mongoose.model('Coupon', couponSchema);
const CouponUsage = mongoose.model('CouponUsage', couponUsageSchema);
const PendingItem = mongoose.model('PendingItem', pendingItemSchema, 'pendingitems');

// Inicializar sender de comandos
const commandSender = new CommandSender();

// JWT Secret (en producción usar variable de entorno)
const JWT_SECRET = 'craftar_secret_key_2024';

// Configurar MercadoPago
mercadopago.configure({
    sandbox: false, // Modo producción
    access_token: 'APP_USR-3285885949826325-091418-1b2cdcaf944d6e58d48488791eef71c9-1304411976' // Token de producción
});

// Configurar nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'carlo.gammarota@gmail.com',
        pass: 'wv5Xn140CbZDW9HR',
    },
});

// Funciones auxiliares para pagos
async function createMercadoPagoPreference(order, user) {
    try {
        // Obtener información de productos para la preferencia
        const products = await Product.find({
            _id: { $in: order.items.map(item => item.productId) }
        });

        const items = order.items.map(orderItem => {
            const product = products.find(p => p._id.toString() === orderItem.productId.toString());
            return {
                id: product._id.toString(),
                title: product.name,
                description: product.description || `Item de Minecraft: ${product.minecraftItem}`,
                quantity: orderItem.quantity,
                currency_id: 'ARS',
                unit_price: parseFloat(orderItem.price)
            };
        });

        const preference = {
            items: items,
            payer: {
                email: user.email,
                name: user.username
            },
            back_urls: {
                success: `https://96c541aba430.ngrok-free.app/dashboard/orders?payment=success`,
                failure: `https://96c541aba430.ngrok-free.app/shop`,
                pending: `https://96c541aba430.ngrok-free.app/dashboard/orders?payment=pending`
            },
            auto_return: 'approved',
            external_reference: order._id.toString(),
            notification_url: `https://96c541aba430.ngrok-free.app/api/webhooks/mercadopago`
        };

        console.log('Creando preferencia con:', JSON.stringify(preference, null, 2));
        const response = await mercadopago.preferences.create(preference);
        console.log('Respuesta de MercadoPago:', response.body);
        return response.body;
    } catch (error) {
        console.error('Error creando preferencia de MercadoPago:', error);
        throw error;
    }
}


async function deliverItemsToPlayer(user, order) {
    try {
        console.log(`🚀 Iniciando entrega de items para usuario: ${user.minecraftUsername}`);
        console.log(`📦 Orden ID: ${order._id}`);
        console.log(`📋 Items en la orden: ${order.items.length}`);
        
        if (!user.minecraftUsername) {
            console.log('❌ Usuario no tiene minecraftUsername configurado');
            return;
        }

        for (const item of order.items) {
            console.log(`🔍 Procesando item de orden: ${item.productId}`);
            const product = await Product.findById(item.productId);
            
            if (product) {
                console.log(`✅ Producto encontrado: ${product.name}`);
                console.log(`📊 Producto tiene items múltiples: ${product.items ? product.items.length : 0} items`);
                
                // Si el producto tiene múltiples items definidos
                if (product.items && product.items.length > 0) {
                    console.log(`🎁 Entregando ${product.items.length} items múltiples:`);
                    const commands = [];
                    for (const productItem of product.items) {
                        const totalQuantity = item.quantity * productItem.quantity;
                        const command = `giveitem ${user.minecraftUsername} ${productItem.item} ${totalQuantity}`;
                        commands.push(command);
                        console.log(`📤 Preparando comando: ${command} (${item.quantity} x ${productItem.quantity} = ${totalQuantity})`);
                    }
                    // Enviar todos los comandos de una vez
                    const allCommands = commands.join('\n');
                    console.log(`📤 Enviando ${commands.length} comandos:`);
                    commands.forEach(cmd => console.log(`  - ${cmd}`));
                    commandSender.sendCommand(allCommands);
                    console.log(`✅ Comandos enviados exitosamente`);
                } else {
                    // Compatibilidad con el sistema anterior
                    console.log(`🔧 Usando sistema anterior (minecraftItem)`);
                    const totalQuantity = item.quantity * (product.defaultQuantity || 1);
                    const command = `giveitem ${user.minecraftUsername} ${product.minecraftItem} ${totalQuantity}`;
                    console.log(`📤 Enviando comando: ${command}`);
                    commandSender.sendCommand(command);
                    console.log(`✅ Comando enviado: ${command} (${item.quantity} x ${product.defaultQuantity || 1} = ${totalQuantity})`);
                }
            } else {
                console.log(`❌ Producto no encontrado: ${item.productId}`);
            }
        }
        
        console.log(`🎉 Entrega de items completada para ${user.minecraftUsername}`);
    } catch (error) {
        console.error('❌ Error entregando items:', error);
    }
}

// Middleware de autenticación mejorado
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar que el usuario existe y está activo
        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(403).json({ error: 'Usuario no válido o inactivo' });
        }

        // Verificar si la cuenta está bloqueada
        if (user.isLocked) {
            return res.status(423).json({ 
                error: 'Cuenta temporalmente bloqueada por múltiples intentos fallidos',
                lockUntil: user.lockUntil
            });
        }

        // Agregar información del usuario a la request
        req.user = {
            userId: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            minecraftUsername: user.minecraftUsername
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        console.error('Error en autenticación:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Middleware para verificar admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};

// Lista de items de Minecraft más comunes
const MINECRAFT_ITEMS = [
    'DIAMOND', 'GOLD_INGOT', 'IRON_INGOT', 'EMERALD', 'COAL', 'REDSTONE',
    'LAPIS_LAZULI', 'QUARTZ', 'NETHERITE_INGOT', 'DIAMOND_SWORD',
    'DIAMOND_PICKAXE', 'DIAMOND_AXE', 'DIAMOND_SHOVEL', 'DIAMOND_HOE',
    'IRON_SWORD', 'IRON_PICKAXE', 'IRON_AXE', 'IRON_SHOVEL', 'IRON_HOE',
    'GOLDEN_SWORD', 'GOLDEN_PICKAXE', 'GOLDEN_AXE', 'GOLDEN_SHOVEL', 'GOLDEN_HOE',
    'NETHERITE_SWORD', 'NETHERITE_PICKAXE', 'NETHERITE_AXE', 'NETHERITE_SHOVEL', 'NETHERITE_HOE',
    'DIAMOND_HELMET', 'DIAMOND_CHESTPLATE', 'DIAMOND_LEGGINGS', 'DIAMOND_BOOTS',
    'IRON_HELMET', 'IRON_CHESTPLATE', 'IRON_LEGGINGS', 'IRON_BOOTS',
    'GOLDEN_HELMET', 'GOLDEN_CHESTPLATE', 'GOLDEN_LEGGINGS', 'GOLDEN_BOOTS',
    'NETHERITE_HELMET', 'NETHERITE_CHESTPLATE', 'NETHERITE_LEGGINGS', 'NETHERITE_BOOTS',
    'BOW', 'ARROW', 'CROSSBOW', 'SHIELD', 'ELYTRA', 'TOTEM_OF_UNDYING',
    'ENCHANTED_BOOK', 'EXPERIENCE_BOTTLE', 'ENDER_PEARL', 'ENDER_EYE',
    'BLAZE_ROD', 'GHAST_TEAR', 'MAGMA_CREAM', 'FERMENTED_SPIDER_EYE',
    'GUNPOWDER', 'SUGAR', 'SPIDER_EYE', 'ROTTEN_FLESH', 'BONE',
    'STRING', 'FEATHER', 'LEATHER', 'RABBIT_HIDE', 'WOOL',
    'OAK_LOG', 'BIRCH_LOG', 'SPRUCE_LOG', 'JUNGLE_LOG', 'ACACIA_LOG', 'DARK_OAK_LOG',
    'OAK_PLANKS', 'BIRCH_PLANKS', 'SPRUCE_PLANKS', 'JUNGLE_PLANKS', 'ACACIA_PLANKS', 'DARK_OAK_PLANKS',
    'STONE', 'COBBLESTONE', 'SAND', 'GRAVEL', 'CLAY', 'DIRT', 'GRASS_BLOCK',
    'WATER_BUCKET', 'LAVA_BUCKET', 'MILK_BUCKET', 'BUCKET',
    'BREAD', 'APPLE', 'GOLDEN_APPLE', 'ENCHANTED_GOLDEN_APPLE', 'CARROT', 'POTATO',
    'WHEAT', 'SEEDS', 'BEETROOT_SEEDS', 'MELON_SEEDS', 'PUMPKIN_SEEDS',
    'COOKED_BEEF', 'COOKED_PORKCHOP', 'COOKED_CHICKEN', 'COOKED_MUTTON',
    'RAW_BEEF', 'RAW_PORKCHOP', 'RAW_CHICKEN', 'RAW_MUTTON',
    'FISH', 'SALMON', 'TROPICAL_FISH', 'PUFFERFISH', 'COOKED_FISH', 'COOKED_SALMON',
    'CAKE', 'COOKIE', 'PUMPKIN_PIE', 'MUSHROOM_STEW', 'RABBIT_STEW',
    'POTION', 'SPLASH_POTION', 'LINGERING_POTION', 'TIPPED_ARROW',
    'TORCH', 'LANTERN', 'SOUL_LANTERN', 'CAMPFIRE', 'SOUL_CAMPFIRE',
    'FURNACE', 'BLAST_FURNACE', 'SMOKER', 'CRAFTING_TABLE', 'ANVIL',
    'CHEST', 'ENDER_CHEST', 'SHULKER_BOX', 'BARREL', 'DISPENSER',
    'HOPPER', 'DROPPER', 'OBSERVER', 'REDSTONE_TORCH', 'REDSTONE_BLOCK',
    'REPEATER', 'COMPARATOR', 'PISTON', 'STICKY_PISTON', 'SLIME_BLOCK',
    'TNT', 'CREEPER_HEAD', 'SKELETON_SKULL', 'WITHER_SKELETON_SKULL',
    'DRAGON_HEAD', 'PLAYER_HEAD', 'ZOMBIE_SKULL', 'CREEPER_HEAD'
];

// ==================== RUTAS DE AUTENTICACIÓN ====================

// Generar código de acceso temporal para Minecraft (cambia cada 5 minutos)
app.post('/api/auth/minecraft-code', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Siempre generar un nuevo código temporal de 5 minutos
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let accessCode = '';
        for (let i = 0; i < 7; i++) {
            accessCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

        // Guardar código temporal en el usuario
        user.minecraftAccessCode = accessCode;
        user.minecraftCodeExpires = expiresAt;
        await user.save();

        res.json({
            success: true,
            accessCode,
            expiresAt,
            isTemporary: true,
            validFor: 5, // minutos
            instructions: [
                '1. Conecta al servidor Minecraft',
                '2. Usa el comando: /login ' + accessCode,
                '3. ¡Tu cuenta web estará conectada!',
                '4. Este código expira en 5 minutos'
            ]
        });

    } catch (error) {
        console.error('Error generando código de acceso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Auto-renovar código de acceso cada 5 minutos para usuarios conectados
setInterval(async () => {
    try {
        // Buscar usuarios que tengan minecraftUsername (cuentas conectadas)
        const connectedUsers = await User.find({ 
            minecraftUsername: { $exists: true, $ne: null },
            minecraftCodeExpires: { $lt: new Date() } // Códigos expirados
        });

        for (const user of connectedUsers) {
            // Generar nuevo código para usuarios conectados
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let accessCode = '';
            for (let i = 0; i < 7; i++) {
                accessCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

            user.minecraftAccessCode = accessCode;
            user.minecraftCodeExpires = expiresAt;
            await user.save();

            console.log(`🔄 Código auto-renovado para usuario: ${user.username} (${user.minecraftUsername})`);
        }
    } catch (error) {
        console.error('Error en auto-renovación de códigos:', error);
    }
}, 5 * 60 * 1000); // Cada 5 minutos

// Verificar código de acceso de Minecraft (llamado desde el plugin)
app.post('/api/auth/verify-minecraft-code', async (req, res) => {
    try {
        const { accessCode, minecraftUsername } = req.body;

        if (!accessCode || !minecraftUsername) {
            return res.status(400).json({ error: 'Código de acceso y nombre de Minecraft requeridos' });
        }

        // Buscar usuario con el código válido
        const user = await User.findOne({
            minecraftAccessCode: accessCode,
            minecraftCodeExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Código de acceso inválido o expirado' });
        }

        // Si el usuario ya tiene un minecraftUsername asignado, permitir re-autenticación
        if (user.minecraftUsername && user.minecraftUsername === minecraftUsername) {
            return res.json({
                success: true,
                message: 'Re-autenticación exitosa',
                user: {
                    id: user._id,
                    username: user.username,
                    minecraftUsername: user.minecraftUsername,
                    balance: user.balance
                }
            });
        }

        // Verificar si el nombre de Minecraft ya está en uso por otro usuario
        const existingUser = await User.findOne({ 
            minecraftUsername: minecraftUsername,
            _id: { $ne: user._id }
        });

        if (existingUser) {
            // Si el nombre ya está en uso, usar el nombre original sin modificar
            // El usuario debe elegir un nombre diferente
            return res.status(400).json({ 
                error: `El nombre '${minecraftUsername}' ya está en uso por otro usuario. Por favor, elige un nombre diferente.` 
            });
        }

        // Conectar cuenta web con Minecraft
        user.minecraftUsername = minecraftUsername;
        // NO eliminar el código - es permanente
        await user.save();

        res.json({
            success: true,
            message: 'Cuenta conectada exitosamente',
            user: {
                id: user._id,
                username: user.username,
                minecraftUsername: user.minecraftUsername,
                balance: user.balance
            }
        });

    } catch (error) {
        console.error('Error verificando código de acceso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener jugadores registrados para login web
app.get('/api/auth/registered-players', async (req, res) => {
    try {
        // Buscar usuarios que tengan minecraftUsername (jugadores registrados en el juego)
        const players = await User.find({ 
            minecraftUsername: { $exists: true, $ne: null } 
        }).select('username minecraftUsername').sort({ username: 1 });
        
        res.json(players);
    } catch (error) {
        console.error('Error al obtener jugadores registrados:', error);
        res.status(500).json({ error: 'Error al obtener jugadores registrados' });
    }
});

// Vincular cuenta de Minecraft con cuenta web
app.post('/api/auth/link-minecraft', async (req, res) => {
    try {
        const { username, minecraftUsername } = req.body;

        if (!username || !minecraftUsername) {
            return res.status(400).json({ error: 'Usuario y nombre de Minecraft son requeridos' });
        }

        // Buscar usuario por username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el nombre de Minecraft ya está en uso por otro usuario
        const existingUser = await User.findOne({ 
            minecraftUsername: minecraftUsername,
            _id: { $ne: user._id }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Este nombre de Minecraft ya está en uso por otro usuario' });
        }

        // Vincular la cuenta
        user.minecraftUsername = minecraftUsername;
        await user.save();

        res.json({
            success: true,
            message: 'Cuenta vinculada exitosamente',
            user: {
                id: user._id,
                username: user.username,
                minecraftUsername: user.minecraftUsername
            }
        });

    } catch (error) {
        console.error('Error al vincular cuenta de Minecraft:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Login web con jugador registrado
app.post('/api/auth/login-player', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        // Buscar usuario por username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Verificar que tenga minecraftUsername (esté registrado en el juego)
        if (!user.minecraftUsername) {
            return res.status(400).json({ error: 'Este usuario no está registrado en el juego' });
        }

        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();

        // Generar token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                minecraftUsername: user.minecraftUsername,
                role: user.role,
                balance: user.balance,
                coins: user.balance
            }
        });

    } catch (error) {
        console.error('Error en login de jugador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener perfil de usuario
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Agregar información de monedas
        const userProfile = {
            ...user.toObject(),
            coins: user.balance,
            balance: user.balance
        };
        
        res.json({ user: userProfile });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener código de acceso del usuario
app.get('/api/auth/my-code', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.minecraftAccessCode || !user.minecraftCodeExpires || user.minecraftCodeExpires <= new Date()) {
            return res.status(404).json({ error: 'No tienes un código de acceso válido. Genera uno nuevo en el dashboard.' });
        }

        // Calcular tiempo restante
        const timeRemaining = Math.max(0, Math.floor((user.minecraftCodeExpires - new Date()) / 1000));
        const minutesRemaining = Math.floor(timeRemaining / 60);
        const secondsRemaining = timeRemaining % 60;

        res.json({
            success: true,
            accessCode: user.minecraftAccessCode,
            expiresAt: user.minecraftCodeExpires,
            isTemporary: true,
            validFor: 5, // minutos
            timeRemaining: timeRemaining,
            minutesRemaining: minutesRemaining,
            secondsRemaining: secondsRemaining,
            instructions: [
                '1. Conecta al servidor Minecraft',
                '2. Usa el comando: /login ' + user.minecraftAccessCode,
                '3. ¡Tu cuenta web estará conectada!',
                '4. Este código expira en ' + minutesRemaining + ':' + secondsRemaining.toString().padStart(2, '0')
            ]
        });

    } catch (error) {
        console.error('Error al obtener código de acceso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar perfil de usuario
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { username, email, minecraftUsername, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar contraseña actual si se proporciona
        if (currentPassword) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Contraseña actual incorrecta' });
            }
        }

        // Actualizar campos
        if (username) user.username = username;
        if (email) user.email = email;
        if (minecraftUsername) user.minecraftUsername = minecraftUsername;
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                minecraftUsername: user.minecraftUsername,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Registro
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, minecraftUsername } = req.body;

        // Validaciones
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario o email ya existe' });
        }

        // Verificar si el nombre de Minecraft ya está en uso
        if (minecraftUsername) {
            const existingMinecraftUser = await User.findOne({ minecraftUsername });
            if (existingMinecraftUser) {
                return res.status(400).json({ error: 'El nombre de Minecraft ya está en uso' });
            }
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = new User({
            username,
            email,
            password: hashedPassword,
            minecraftUsername: minecraftUsername || null
        });

        await user.save();

        // Generar tokens (access y refresh) como en el login
        const accessToken = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role,
                deviceId: 'registration_' + Date.now()
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token más corto para mayor seguridad
        );

        const refreshToken = jwt.sign(
            { userId: user._id, deviceId: 'registration_' + Date.now() },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                minecraftUsername: user.minecraftUsername,
                role: user.role,
                balance: user.balance,
                coins: user.balance,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Login seguro
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password, deviceId, deviceName } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;

        // Validaciones básicas
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Contraseña debe tener al menos 6 caracteres' });
        }

        // Buscar usuario por username o email
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si la cuenta está bloqueada
        if (user.isLocked) {
            const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
            return res.status(423).json({ 
                error: `Cuenta bloqueada por múltiples intentos fallidos. Intenta de nuevo en ${lockTimeRemaining} minutos.`,
                lockUntil: user.lockUntil
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            // Incrementar intentos fallidos
            await user.incLoginAttempts();
            
            // Log del intento fallido
            console.log(`Intento de login fallido para ${username} desde IP ${clientIP}`);
            
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Login exitoso - resetear intentos fallidos
        await user.resetLoginAttempts();

        // Generar device ID si no se proporciona
        const finalDeviceId = deviceId || user.generateDeviceId();

        // Actualizar información de login
        user.lastLogin = new Date();
        user.lastLoginIP = clientIP;
        
        // Agregar dispositivo confiable si es nuevo
        if (deviceName && !user.trustedDevices.some(d => d.deviceId === finalDeviceId)) {
            user.trustedDevices.push({
                deviceId: finalDeviceId,
                deviceName: deviceName,
                lastUsed: new Date(),
                ipAddress: clientIP
            });
        } else if (deviceName) {
            // Actualizar último uso del dispositivo existente
            const device = user.trustedDevices.find(d => d.deviceId === finalDeviceId);
            if (device) {
                device.lastUsed = new Date();
                device.ipAddress = clientIP;
            }
        }

        await user.save();

        // Generar tokens (access y refresh)
        const accessToken = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role,
                deviceId: finalDeviceId
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token más corto para mayor seguridad
        );

        const refreshToken = jwt.sign(
            { userId: user._id, deviceId: finalDeviceId },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log del login exitoso
        console.log(`Login exitoso para ${username} desde IP ${clientIP}`);

        res.json({
            success: true,
            message: 'Login exitoso',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                minecraftUsername: user.minecraftUsername,
                role: user.role,
                balance: user.balance,
                coins: user.balance,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token requerido' });
        }

        // Verificar refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(403).json({ error: 'Usuario no válido' });
        }

        // Generar nuevo access token
        const accessToken = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role,
                deviceId: decoded.deviceId
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            accessToken
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Refresh token inválido' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token expirado' });
        }
        console.error('Error en refresh token:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Logout seguro
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        // En un sistema más avanzado, aquí podrías invalidar el token en una blacklist
        // Por ahora, el cliente simplemente elimina el token
        
        console.log(`Logout exitoso para usuario ${req.user.username}`);
        
        res.json({
            success: true,
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para autenticación desde Minecraft
app.post('/api/auth/minecraft-login', async (req, res) => {
    try {
        const { minecraftUsername, accessToken } = req.body;

        if (!minecraftUsername || !accessToken) {
            return res.status(400).json({ error: 'Nombre de Minecraft y token requeridos' });
        }

        // Verificar token
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(403).json({ error: 'Usuario no válido' });
        }

        // Verificar que el usuario tenga el minecraftUsername correcto
        if (user.minecraftUsername !== minecraftUsername) {
            return res.status(403).json({ error: 'Nombre de Minecraft no coincide con la cuenta' });
        }

        // Generar token específico para Minecraft (más corto)
        const minecraftToken = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                minecraftUsername: user.minecraftUsername,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Autenticación exitosa',
            minecraftToken,
            user: {
                id: user._id,
                username: user.username,
                minecraftUsername: user.minecraftUsername,
                role: user.role,
                balance: user.balance
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        console.error('Error en autenticación Minecraft:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ==================== RUTAS DE TIENDA ====================

// Obtener productos
app.get('/api/shop/products', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        let query = { isActive: true };
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total,
                hasNext: skip + products.length < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener categorías
app.get('/api/shop/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category', { isActive: true });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// ==================== RUTAS DE ORDENES ====================

// Obtener órdenes del usuario
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .populate('items.productId', 'name minecraftItem price')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// Obtener todas las órdenes (admin)
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'username email minecraftUsername')
            .populate('items.productId', 'name minecraftItem price')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// Crear orden
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'La orden debe contener al menos un item' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validar y calcular total
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.isActive) {
                return res.status(400).json({ error: `Producto ${item.productId} no encontrado o inactivo` });
            }

            if (product.stock !== -1 && product.stock < item.quantity) {
                return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Crear orden
        const order = new Order({
            userId: req.user.userId,
            items: orderItems,
            totalAmount
        });

        await order.save();

        res.status(201).json({
            success: true,
            order: {
                id: order._id,
                totalAmount,
                status: order.status,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// Procesar pago
app.post('/api/orders/:orderId/pay', authenticateToken, async (req, res) => {
    try {
        const { paymentMethod, walletAmount } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        if (order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'No tienes permisos para esta orden' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'La orden ya fue procesada' });
        }

        const user = await User.findById(req.user.userId);

        if (paymentMethod === 'wallet' || paymentMethod === 'coins') {
            // Procesar pago con monedas/saldo de cartera
            const coinsAmountToUse = walletAmount || order.totalAmount;
            
            if (user.balance < coinsAmountToUse) {
                return res.status(400).json({ error: 'Monedas insuficientes. Tienes ' + user.balance + ' monedas disponibles.' });
            }

            // Crear registro de pago
            const payment = new Payment({
                userId: user._id,
                orderId: order._id,
                amount: coinsAmountToUse,
                paymentMethod: paymentMethod === 'coins' ? 'coins' : 'wallet',
                status: 'approved'
            });
            await payment.save();

            // Actualizar monedas del usuario
            user.balance -= coinsAmountToUse;
            await user.save();

            // Crear transacción de cartera
            const walletTransaction = new WalletTransaction({
                userId: user._id,
                type: 'payment',
                amount: -coinsAmountToUse,
                description: `Compra con monedas - Orden #${order._id}`,
                orderId: order._id,
                paymentId: payment._id
            });
            await walletTransaction.save();

            // Actualizar orden
            order.status = 'paid';
            order.paymentMethod = paymentMethod === 'coins' ? 'coins' : 'wallet';
            order.walletAmountUsed = coinsAmountToUse;
            order.paidAt = new Date();
            await order.save();

            // Verificar si ya fue procesado para evitar duplicados
            if (order.status === 'delivered') {
                console.log('Orden ya entregada, saltando entrega de items:', order._id);
                return res.status(200).json({ success: true, message: 'Orden ya entregada' });
            }

            // Entregar items
            await deliverItemsToPlayer(user, order);

            // Marcar como entregado
            order.status = 'delivered';
            order.deliveredAt = new Date();
            await order.save();


            // Emitir eventos de actualización
            io.to(`user_${user._id}`).emit('coins-updated', {
                userId: user._id,
                newBalance: user.balance,
                newCoins: user.balance,
                transaction: walletTransaction
            });

            io.to(`user_${user._id}`).emit('wallet-updated', {
                userId: user._id,
                newBalance: user.balance,
                transaction: walletTransaction
            });

            // Emitir evento de actualización de orden
            io.to(`user_${user._id}`).emit('order-updated', {
                orderId: order._id,
                status: order.status,
                userId: user._id
            });

            res.json({
                success: true,
                message: 'Compra realizada con monedas exitosamente',
                order: {
                    id: order._id,
                    status: order.status,
                    deliveredAt: order.deliveredAt
                },
                remainingCoins: user.balance
            });

        } else {
            // Procesar pago con MercadoPago
            order.status = 'paying';
            order.paymentMethod = 'mercadopago';
            await order.save();

            // Crear preferencia de MercadoPago
            const preference = await createMercadoPagoPreference(order, user);
            
            // Crear registro de pago
            const payment = new Payment({
                userId: user._id,
                orderId: order._id,
                amount: order.totalAmount,
                paymentMethod: 'mercadopago',
                mercadopagoPreferenceId: preference.id,
                externalReference: order._id.toString(),
                status: 'pending'
            });
            await payment.save();

            // Actualizar orden con preference ID
            order.mercadopagoPreferenceId = preference.id;
            await order.save();

            res.json({
                success: true,
                message: 'Preferencia de pago creada',
                paymentUrl: preference.init_point,
                preferenceId: preference.id
            });
        }

    } catch (error) {
        console.error('Error al procesar pago:', error);
        res.status(500).json({ error: 'Error al procesar pago' });
    }
});

// ==================== UTILIDADES DE ADMINISTRACIÓN ====================

// Endpoint para limpiar items pendientes duplicados
app.post('/api/admin/clean-pending-items', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log('🧹 Iniciando limpieza de items pendientes duplicados...');
        
        // Obtener todos los documentos de items pendientes
        const pendingItems = await PendingItem.find({});
        console.log(`📦 Encontrados ${pendingItems.length} documentos de items pendientes`);
        
        let fixedCount = 0;
        let deletedCount = 0;
        
        for (const doc of pendingItems) {
            try {
                const items = JSON.parse(doc.items);
                let hasValidItems = false;
                let hasZeroItems = false;
                
                // Verificar si hay items con cantidad > 0
                for (const item of items) {
                    if (item.amount > 0) {
                        hasValidItems = true;
                    } else {
                        hasZeroItems = true;
                    }
                }
                
                if (!hasValidItems) {
                    // Si no hay items válidos, eliminar el documento
                    await PendingItem.deleteOne({ _id: doc._id });
                    deletedCount++;
                    console.log(`🗑️ Eliminado documento vacío para UUID: ${doc.uuid}`);
                } else if (hasZeroItems) {
                    // Si hay items con cantidad 0, limpiarlos
                    const cleanedItems = items.filter(item => item.amount > 0);
                    
                    if (cleanedItems.length === 0) {
                        // Si no quedan items válidos, eliminar el documento
                        await PendingItem.deleteOne({ _id: doc._id });
                        deletedCount++;
                        console.log(`🗑️ Eliminado documento sin items válidos para UUID: ${doc.uuid}`);
                    } else {
                        // Actualizar con solo los items válidos
                        await PendingItem.updateOne(
                            { _id: doc._id },
                            { 
                                items: JSON.stringify(cleanedItems),
                                lastUpdated: Date.now()
                            }
                        );
                        fixedCount++;
                        console.log(`🔧 Limpiado documento para UUID: ${doc.uuid} - ${cleanedItems.length} items válidos`);
                    }
                }
            } catch (error) {
                console.error(`❌ Error procesando documento ${doc._id}:`, error.message);
            }
        }
        
        const finalCount = await PendingItem.countDocuments();
        
        console.log('\n📊 Resumen de la limpieza:');
        console.log(`🔧 Documentos corregidos: ${fixedCount}`);
        console.log(`🗑️ Documentos eliminados: ${deletedCount}`);
        console.log(`✅ Total procesados: ${fixedCount + deletedCount}`);
        console.log(`📦 Documentos restantes: ${finalCount}`);
        
        res.json({
            success: true,
            message: 'Limpieza de items pendientes completada',
            stats: {
                fixed: fixedCount,
                deleted: deletedCount,
                total: fixedCount + deletedCount,
                remaining: finalCount
            }
        });
        
    } catch (error) {
        console.error('❌ Error en limpieza de items pendientes:', error);
        res.status(500).json({ error: 'Error al limpiar items pendientes' });
    }
});

// ==================== WEBHOOKS ====================

// Webhook de MercadoPago
app.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
        console.log('Webhook MercadoPago recibido:', req.query);
        
        if (req.query.topic === 'merchant_order') {
            const merchantOrder = await mercadopago.merchant_orders.get(req.query.id);
            console.log('Merchant Order:', merchantOrder.body);
            
            const externalReference = merchantOrder.body.external_reference;
            const order = await Order.findById(externalReference);
            
            if (!order) {
                console.log('Orden no encontrada:', externalReference);
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
            
            const payments = merchantOrder.body.payments;
            
            for (const payment of payments) {
                if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                    console.log('Pago aprobado:', payment.id);
                    
                    // Verificar si ya fue procesado para evitar duplicados
                    if (order.status === 'delivered' || order.status === 'paid') {
                        console.log('Orden ya procesada, saltando entrega de items:', order._id);
                        continue;
                    }
                    
                    // Actualizar orden
                    order.status = 'paid';
                    order.mercadopagoPaymentId = payment.id;
                    order.paidAt = new Date();
                    await order.save();
                    
                    // Actualizar pago
                    const paymentRecord = await Payment.findOne({ 
                        orderId: order._id,
                        paymentMethod: 'mercadopago'
                    });
                    
                    if (paymentRecord) {
                        paymentRecord.status = 'approved';
                        paymentRecord.mercadopagoPaymentId = payment.id;
                        paymentRecord.updatedAt = new Date();
                        await paymentRecord.save();
                    }
                    
                    // Entregar items
                    const user = await User.findById(order.userId);
                    await deliverItemsToPlayer(user, order);
                    
                    // Marcar como entregado
                    order.status = 'delivered';
                    order.deliveredAt = new Date();
                    await order.save();
                    
                    
                    // Emitir evento de actualización
                    io.to(`user_${order.userId}`).emit('order-updated', {
                        orderId: order._id,
                        status: order.status,
                        userId: order.userId
                    });
                    
                } else if (payment.status === 'rejected') {
                    console.log('Pago rechazado:', payment.id);
                    
                    order.status = 'error';
                    await order.save();
                    
                    const paymentRecord = await Payment.findOne({ 
                        orderId: order._id,
                        paymentMethod: 'mercadopago'
                    });
                    
                    if (paymentRecord) {
                        paymentRecord.status = 'rejected';
                        paymentRecord.updatedAt = new Date();
                        await paymentRecord.save();
                    }
                    
                    // Emitir evento de actualización
                    io.to(`user_${order.userId}`).emit('order-updated', {
                        orderId: order._id,
                        status: order.status,
                        userId: order.userId
                    });
                }
            }
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error en webhook MercadoPago:', error);
        res.status(500).json({ error: 'Error procesando webhook' });
    }
});

// ==================== RUTAS DE MONEDAS/CARTERA ====================

// Obtener monedas del usuario
app.get('/api/coins/balance', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json({ 
            coins: user.balance,
            balance: user.balance // Compatibilidad con sistema anterior
        });
    } catch (error) {
        console.error('Error al obtener monedas:', error);
        res.status(500).json({ error: 'Error al obtener monedas' });
    }
});

// Obtener saldo de cartera (compatibilidad)
app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json({ balance: user.balance });
    } catch (error) {
        console.error('Error al obtener saldo:', error);
        res.status(500).json({ error: 'Error al obtener saldo' });
    }
});

// Cargar monedas al usuario
app.post('/api/coins/deposit', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Cantidad recibida en backend:', amount);
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
        }
        
        const user = await User.findById(req.user.userId);
        
        // Crear preferencia de MercadoPago para cargar monedas
        const preference = {
            items: [{
                id: 'coins-deposit',
                title: 'Carga de Monedas - CraftAR',
                description: `Recarga de monedas por $${amount} ARS`,
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(amount)
            }],
            payer: {
                email: user.email,
                name: user.username
            },
            back_urls: {
                success: `https://96c541aba430.ngrok-free.app/dashboard/coins?payment=success`,
                failure: `https://96c541aba430.ngrok-free.app/dashboard/coins`,
                pending: `https://96c541aba430.ngrok-free.app/dashboard/coins?payment=pending`
            },
            auto_return: 'approved',
            external_reference: `coins_deposit_${user._id}_${Date.now()}`,
            notification_url: `https://96c541aba430.ngrok-free.app/api/webhooks/coins-deposit`
        };
        
        const response = await mercadopago.preferences.create(preference);
        
        res.json({
            success: true,
            message: 'Preferencia de pago para cargar monedas creada',
            paymentUrl: response.body.init_point,
            preferenceId: response.body.id
        });
        
    } catch (error) {
        console.error('Error al crear carga de monedas:', error);
        res.status(500).json({ error: 'Error al crear carga de monedas' });
    }
});

// Cargar saldo a la cartera (compatibilidad)
app.post('/api/wallet/deposit', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
        }
        
        const user = await User.findById(req.user.userId);
        
        // Crear preferencia de MercadoPago para cargar saldo
        const preference = {
            items: [{
                id: 'wallet-deposit',
                title: 'Carga de Saldo - CraftAR',
                description: `Recarga de saldo en cartera por $${amount} ARS`,
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(amount)
            }],
            payer: {
                email: user.email,
                name: user.username
            },
            back_urls: {
                success: `https://96c541aba430.ngrok-free.app/dashboard/wallet?payment=success`,
                failure: `https://96c541aba430.ngrok-free.app/dashboard/wallet`,
                pending: `https://96c541aba430.ngrok-free.app/dashboard/wallet?payment=pending`
            },
            auto_return: 'approved',
            external_reference: `deposit_${user._id}_${Date.now()}`,
            notification_url: `https://96c541aba430.ngrok-free.app/api/webhooks/wallet-deposit`
        };
        
        const response = await mercadopago.preferences.create(preference);
        
        res.json({
            success: true,
            paymentUrl: response.body.init_point,
            preferenceId: response.body.id
        });
        
    } catch (error) {
        console.error('Error al crear carga de saldo:', error);
        res.status(500).json({ error: 'Error al crear carga de saldo' });
    }
});

// Obtener historial de transacciones de monedas
app.get('/api/coins/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await WalletTransaction.find({ userId: req.user.userId })
            .populate('orderId', 'totalAmount status')
            .sort({ createdAt: -1 });
        
        res.json(transactions);
    } catch (error) {
        console.error('Error al obtener transacciones de monedas:', error);
        res.status(500).json({ error: 'Error al obtener transacciones de monedas' });
    }
});

// Obtener historial de transacciones de cartera (compatibilidad)
app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await WalletTransaction.find({ userId: req.user.userId })
            .populate('orderId', 'totalAmount status')
            .sort({ createdAt: -1 });
        
        res.json(transactions);
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ error: 'Error al obtener transacciones' });
    }
});

// Webhook para carga de monedas
app.post('/api/webhooks/coins-deposit', async (req, res) => {
    try {
        console.log('Webhook carga de monedas recibido:', req.query);
        
        if (req.query.topic === 'merchant_order') {
            const merchantOrder = await mercadopago.merchant_orders.get(req.query.id);
            const externalReference = merchantOrder.body.external_reference;
            
            if (externalReference.startsWith('coins_deposit_')) {
                const [, , userId] = externalReference.split('_');
                const user = await User.findById(userId);
                
                if (!user) {
                    console.log('Usuario no encontrado:', userId);
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
                
                const payments = merchantOrder.body.payments;
                
                for (const payment of payments) {
                    if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                        console.log('Carga de monedas aprobada:', payment.id);
                        
                        // Obtener el monto del pago
                        const amount = payment.transaction_amount;
                        
                        // Actualizar monedas del usuario
                        user.balance += amount;
                        await user.save();
                        
                        // Crear transacción de cartera
                        const walletTransaction = new WalletTransaction({
                            userId: user._id,
                            type: 'deposit',
                            amount: amount,
                            description: `Carga de monedas - Pago ${payment.id}`
                            // No incluir paymentId ya que no es un ObjectId válido
                        });
                        await walletTransaction.save();
                        
                        // Emitir evento de actualización
                        io.to(`user_${user._id}`).emit('coins-updated', {
                            userId: user._id,
                            newBalance: user.balance,
                            newCoins: user.balance,
                            transaction: walletTransaction
                        });
                        
                        // También emitir evento de wallet para compatibilidad
                        io.to(`user_${user._id}`).emit('wallet-updated', {
                            userId: user._id,
                            newBalance: user.balance,
                            transaction: walletTransaction
                        });
                    }
                }
            }
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error en webhook carga de monedas:', error);
        res.status(500).json({ error: 'Error procesando webhook' });
    }
});

// Webhook para carga de saldo (compatibilidad)
app.post('/api/webhooks/wallet-deposit', async (req, res) => {
    try {
        console.log('Webhook carga de saldo recibido:', req.query);
        
        if (req.query.topic === 'merchant_order') {
            const merchantOrder = await mercadopago.merchant_orders.get(req.query.id);
            const externalReference = merchantOrder.body.external_reference;
            
            if (externalReference.startsWith('deposit_')) {
                const [, userId] = externalReference.split('_');
                const user = await User.findById(userId);
                
                if (!user) {
                    console.log('Usuario no encontrado:', userId);
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
                
                const payments = merchantOrder.body.payments;
                
                for (const payment of payments) {
                    if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                        console.log('Carga de saldo aprobada:', payment.id);
                        
                        // Obtener el monto del pago
                        const amount = payment.transaction_amount;
                        
                        // Actualizar saldo del usuario
                        user.balance += amount;
                        await user.save();
                        
                        // Crear transacción de cartera
                        const walletTransaction = new WalletTransaction({
                            userId: user._id,
                            type: 'deposit',
                            amount: amount,
                            description: `Carga de saldo - Pago ${payment.id}`,
                            paymentId: payment.id
                        });
                        await walletTransaction.save();
                        
                        // Emitir evento de actualización
                        io.to(`user_${user._id}`).emit('wallet-updated', {
                            userId: user._id,
                            newBalance: user.balance,
                            transaction: walletTransaction
                        });
                    }
                }
            }
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error en webhook carga de saldo:', error);
        res.status(500).json({ error: 'Error procesando webhook' });
    }
});

// ==================== RUTAS DE ADMIN ====================

// Gestión de productos (admin)
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, minecraftItem, description, price, category, image, stock, defaultQuantity } = req.body;
        
        const product = new Product({
            name,
            minecraftItem,
            description,
            price,
            category,
            image,
            stock: stock || -1,
            defaultQuantity: defaultQuantity || 1
        });
        
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { defaultQuantity, ...updateData } = req.body;
        
        // Si no se especifica defaultQuantity, mantener el valor actual o usar 1 por defecto
        if (defaultQuantity !== undefined) {
            updateData.defaultQuantity = defaultQuantity;
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ success: true, message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// Rutas API para admin (mantener compatibilidad)
app.get('/api/players', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const players = await Player.find().sort({ lastSeen: -1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores' });
    }
});

app.get('/api/items', authenticateToken, requireAdmin, (req, res) => {
    res.json(MINECRAFT_ITEMS);
});

app.get('/api/inventory/:uuid', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const inventory = await Inventory.findOne({ uuid: req.params.uuid });
        if (inventory) {
            res.json(inventory);
        } else {
            res.status(404).json({ error: 'Inventario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
});

app.post('/api/add-item', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { uuid, item, amount } = req.body;
        
        if (!uuid || !item || !amount) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }
        
        // Buscar el jugador por UUID para obtener su nombre
        const player = await Player.findOne({ uuid: uuid });
        if (!player) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        
        // Crear comando real para enviar al servidor
        const command = `giveitem ${player.name} ${item} ${amount}`;
        
        // Enviar comando al servidor de Minecraft usando el CommandSender
        const success = commandSender.sendCommand(command);
        
        if (success) {
            // Emitir evento de item agregado
            io.emit('item-added', { 
                uuid, 
                playerName: player.name,
                item, 
                amount, 
                timestamp: Date.now(),
                command: command
            });
            
            res.json({ 
                success: true, 
                message: `Item enviado al servidor: ${command}`,
                command: command,
                note: "El item se agregará al inventario del jugador en el juego"
            });
        } else {
            res.status(500).json({ error: 'Error al enviar comando al servidor' });
        }
        
    } catch (error) {
        console.error('Error al agregar item:', error);
        res.status(500).json({ error: 'Error al agregar item' });
    }
});


// Inicializar integración de estadísticas
const statsIntegration = new StatsIntegration(io);

// Inicializar conexión con plugin de estadísticas
statsIntegration.connectToMinecraft(8081);

// Socket.IO para comunicación en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
    
    // Unirse a sala de estadísticas
    socket.on('join-stats-room', () => {
        socket.join('stats-room');
        console.log('Cliente se unió a la sala de estadísticas');
        
        // Enviar datos actuales si están disponibles
        const currentStats = statsIntegration.getStatsData();
        if (currentStats) {
            socket.emit('stats-update', currentStats);
        }
    });
    
    // Salir de sala de estadísticas
    socket.on('leave-stats-room', () => {
        socket.leave('stats-room');
        console.log('Cliente salió de la sala de estadísticas');
    });
    
    socket.on('request-update', async () => {
        try {
            const players = await Player.find().sort({ lastSeen: -1 });
            socket.emit('players-update', players);
        } catch (error) {
            socket.emit('error', 'Error al obtener jugadores');
        }
    });
    
    // Unirse a sala de usuario para recibir actualizaciones específicas
    socket.on('join-user-room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`Usuario ${userId} se unió a su sala`);
    });
    
    // Salir de sala de usuario
    socket.on('leave-user-room', (userId) => {
        socket.leave(`user_${userId}`);
        console.log(`Usuario ${userId} salió de su sala`);
    });
    
    // Autenticación con código de Minecraft via Socket.IO
    socket.on('minecraft-authenticate', async (data) => {
        try {
            console.log('🔐 Socket.IO: Autenticación con código:', data.accessCode);
            
            const { accessCode, minecraftUsername } = data;
            
            if (!accessCode || !minecraftUsername) {
                socket.emit('minecraft-authenticate-response', {
                    success: false,
                    error: 'Código de acceso y nombre de usuario requeridos'
                });
                return;
            }
            
            // Buscar usuario con el código de acceso
            const user = await User.findOne({
                minecraftAccessCode: accessCode,
                minecraftCodeExpires: { $gt: new Date() }
            });
            
            if (!user) {
                socket.emit('minecraft-authenticate-response', {
                    success: false,
                    error: 'Código de acceso inválido o expirado'
                });
                return;
            }
            
            // Si el usuario ya tiene un nombre de Minecraft asignado, permitir re-autenticación
            if (user.minecraftUsername && user.minecraftUsername === minecraftUsername) {
                console.log('✅ Socket.IO: Re-autenticación exitosa para usuario existente:', user.username);
                
                socket.emit('minecraft-authenticate-response', {
                    success: true,
                    user: {
                        username: user.username,
                        minecraftUsername: user.minecraftUsername,
                        balance: user.balance
                    },
                    message: 'Re-autenticación exitosa'
                });
                return;
            }
            
            // Verificar si el nombre de Minecraft ya está en uso
            const existingUser = await User.findOne({
                minecraftUsername: minecraftUsername,
                _id: { $ne: user._id }
            });
            
            if (existingUser) {
                // Si el nombre ya está en uso, rechazar la conexión
                console.log(`⚠️ Socket.IO: Conflicto de nombre: ${minecraftUsername} ya está en uso`);
                socket.emit('minecraft-authenticate-response', {
                    success: false,
                    error: `El nombre '${minecraftUsername}' ya está en uso por otro usuario. Por favor, elige un nombre diferente.`
                });
                return;
            }
            
            // Actualizar usuario con el nombre de Minecraft
            user.minecraftUsername = minecraftUsername;
            // NO eliminar el código - es permanente
            await user.save();
            
            console.log('✅ Socket.IO: Usuario autenticado exitosamente:', user.username);
            
            socket.emit('minecraft-authenticate-response', {
                success: true,
                user: {
                    username: user.username,
                    minecraftUsername: user.minecraftUsername,
                    balance: user.balance
                }
            });
            
        } catch (error) {
            console.error('❌ Socket.IO: Error en autenticación:', error);
            socket.emit('minecraft-authenticate-response', {
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });

    // Endpoint específico para autenticación de Minecraft
    socket.on('minecraft-login', async (data) => {
        try {
            console.log('🔐 Solicitud de login desde Minecraft:', data);
            
            const { accessCode, minecraftUsername } = data;
            
            if (!accessCode || !minecraftUsername) {
                socket.emit('minecraft-login-response', {
                    success: false,
                    error: 'Código de acceso y nombre de Minecraft requeridos'
                });
                return;
            }

            // Buscar usuario con el código válido
            const user = await User.findOne({
                minecraftAccessCode: accessCode,
                minecraftCodeExpires: { $gt: new Date() }
            });

            if (!user) {
                socket.emit('minecraft-login-response', {
                    success: false,
                    error: 'Código de acceso inválido o expirado'
                });
                return;
            }
            
            // Si el usuario ya tiene un nombre de Minecraft asignado, permitir re-autenticación
            if (user.minecraftUsername && user.minecraftUsername === minecraftUsername) {
                console.log('✅ Socket.IO: Re-autenticación exitosa para usuario existente:', user.username);
                
                socket.emit('minecraft-login-response', {
                    success: true,
                    message: 'Re-autenticación exitosa',
                    user: {
                        id: user._id,
                        username: user.username,
                        minecraftUsername: user.minecraftUsername,
                        balance: user.balance
                    }
                });
                return;
            }

            // Verificar si el nombre de Minecraft ya está en uso
            const existingUser = await User.findOne({ 
                minecraftUsername: minecraftUsername,
                _id: { $ne: user._id }
            });

            if (existingUser) {
                // Si el nombre ya está en uso, rechazar la conexión
                console.log(`⚠️ Socket.IO: Conflicto de nombre: ${minecraftUsername} ya está en uso`);
                socket.emit('minecraft-login-response', {
                    success: false,
                    error: `El nombre '${minecraftUsername}' ya está en uso por otro usuario. Por favor, elige un nombre diferente.`
                });
                return;
            }

            // Conectar cuenta web con Minecraft
            user.minecraftUsername = minecraftUsername;
            // NO eliminar el código - es permanente
            await user.save();

            console.log('✅ Login exitoso desde Minecraft:', {
                username: user.username,
                minecraftUsername: user.minecraftUsername,
                balance: user.balance
            });

            socket.emit('minecraft-login-response', {
                success: true,
                message: 'Cuenta conectada exitosamente',
                user: {
                    id: user._id,
                    username: user.username,
                    minecraftUsername: user.minecraftUsername,
                    balance: user.balance
                }
            });

        } catch (error) {
            console.error('❌ Error en login desde Minecraft:', error);
            socket.emit('minecraft-login-response', {
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });
});

// ==================== ENDPOINTS DE CUPONES ====================

// Canjear cupón
app.post('/api/coupons/redeem', authenticateToken, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.userId;

        if (!code) {
            return res.status(400).json({ error: 'Código de cupón requerido' });
        }

        // Buscar el cupón
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ error: 'Cupón no encontrado' });
        }

        // Verificar si el cupón está activo
        if (!coupon.isActive) {
            return res.status(400).json({ error: 'Este cupón no está activo' });
        }

        // Verificar si el cupón ha expirado
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(400).json({ error: 'Este cupón ha expirado' });
        }

        // Verificar si el cupón ha alcanzado el máximo de usos
        if (coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ error: 'Este cupón ya no tiene usos disponibles' });
        }

        // Verificar si el usuario ya usó este cupón
        const existingUsage = await CouponUsage.findOne({ 
            couponId: coupon._id, 
            userId: userId 
        });
        if (existingUsage) {
            return res.status(400).json({ error: 'Ya has usado este cupón anteriormente' });
        }

        // Obtener el usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Aplicar la recompensa
        user.balance += coupon.coinsReward;
        await user.save();

        // Actualizar el cupón
        coupon.usedCount += 1;
        await coupon.save();

        // Crear registro de uso del cupón
        const couponUsage = new CouponUsage({
            couponId: coupon._id,
            userId: userId,
            coinsRewarded: coupon.coinsReward
        });
        await couponUsage.save();

        // Crear transacción de cartera
        const walletTransaction = new WalletTransaction({
            userId: userId,
            type: 'coupon',
            amount: coupon.coinsReward,
            description: `Cupón canjeado: ${coupon.code} - ${coupon.description}`,
            couponId: coupon._id
        });
        await walletTransaction.save();

        // Emitir eventos de actualización
        io.to(`user_${userId}`).emit('coins-updated', {
            userId: userId,
            newBalance: user.balance,
            newCoins: user.balance,
            transaction: walletTransaction
        });

        io.to(`user_${userId}`).emit('wallet-updated', {
            userId: userId,
            newBalance: user.balance,
            transaction: walletTransaction
        });

        res.json({
            success: true,
            message: `¡Cupón canjeado exitosamente! Has recibido ${coupon.coinsReward} monedas.`,
            coinsRewarded: coupon.coinsReward,
            newBalance: user.balance,
            coupon: {
                code: coupon.code,
                description: coupon.description
            }
        });

    } catch (error) {
        console.error('Error al canjear cupón:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener historial de cupones canjeados por el usuario
app.get('/api/coupons/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const couponHistory = await CouponUsage.find({ userId: userId })
            .sort({ usedAt: -1 });

        // Obtener información de los cupones por separado
        const historyWithCouponInfo = await Promise.all(
            couponHistory.map(async (usage) => {
                const coupon = await Coupon.findById(usage.couponId);
                return {
                    code: coupon?.code || 'N/A',
                    description: coupon?.description || 'Cupón no encontrado',
                    coinsRewarded: usage.coinsRewarded,
                    usedAt: usage.usedAt
                };
            })
        );

        res.json(historyWithCouponInfo);

    } catch (error) {
        console.error('Error al obtener historial de cupones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener información de un cupón (sin canjear)
app.get('/api/coupons/:code', authenticateToken, async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user.userId;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ error: 'Cupón no encontrado' });
        }

        // Verificar si el usuario ya usó este cupón
        const existingUsage = await CouponUsage.findOne({ 
            couponId: coupon._id, 
            userId: userId 
        });

        const canUse = coupon.isActive && 
                      (!coupon.expiresAt || new Date() <= coupon.expiresAt) &&
                      coupon.usedCount < coupon.maxUses &&
                      !existingUsage;

        res.json({
            code: coupon.code,
            description: coupon.description,
            coinsReward: coupon.coinsReward,
            maxUses: coupon.maxUses,
            usedCount: coupon.usedCount,
            remainingUses: coupon.maxUses - coupon.usedCount,
            isActive: coupon.isActive,
            expiresAt: coupon.expiresAt,
            canUse: canUse,
            alreadyUsed: !!existingUsage
        });

    } catch (error) {
        console.error('Error al obtener información del cupón:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Esta ruta debe ir al final, después de todas las rutas de la API

// La integración de estadísticas ya está inicializada arriba

// WebSocket para estadísticas en tiempo real
const statsWebSocket = new WebSocket.Server({ 
    port: 8082,
    path: '/stats-ws'
});

statsWebSocket.on('connection', (ws) => {
    console.log('📊 Cliente conectado a estadísticas en tiempo real');
    statsIntegration.addClient(ws);
});

// Rutas de estadísticas
app.get('/api/stats', (req, res) => {
    const statsData = statsIntegration.getStatsData();
    const connectionStatus = statsIntegration.getConnectionStatus();
    
    res.json({
        success: true,
        data: statsData,
        connection: connectionStatus
    });
});

app.get('/api/stats/status', (req, res) => {
    const connectionStatus = statsIntegration.getConnectionStatus();
    res.json({
        success: true,
        ...connectionStatus
    });
});

// Configuración para SPA (Single Page Application) - DEBE IR AL FINAL
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/dist/index.html'));
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
    console.log(`Servidor web ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Estadísticas disponibles en: http://localhost:${PORT}/api/stats`);
    console.log(`🔌 WebSocket de estadísticas en: ws://localhost:8082/stats-ws`);
});