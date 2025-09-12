const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const CommandSender = require('./command-sender');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/pico-ia';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB correctamente');
});

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

const Player = mongoose.model('Player', playerSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);

// Inicializar sender de comandos
const commandSender = new CommandSender();

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
    'DRAGON_HEAD', 'PLAYER_HEAD', 'ZOMBIE_HEAD', 'CREEPER_HEAD'
];

// Rutas API
app.get('/api/players', async (req, res) => {
    try {
        const players = await Player.find().sort({ lastSeen: -1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores' });
    }
});

app.get('/api/items', (req, res) => {
    res.json(MINECRAFT_ITEMS);
});

app.get('/api/inventory/:uuid', async (req, res) => {
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

app.post('/api/add-item', async (req, res) => {
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

// Socket.IO para comunicación en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
    
    socket.on('request-update', async () => {
        try {
            const players = await Player.find().sort({ lastSeen: -1 });
            socket.emit('players-update', players);
        } catch (error) {
            socket.emit('error', 'Error al obtener jugadores');
        }
    });
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor web ejecutándose en http://localhost:${PORT}`);
});
