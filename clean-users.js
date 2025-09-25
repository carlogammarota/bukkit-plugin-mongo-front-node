const mongoose = require('mongoose');

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/minecraft';

async function cleanUsers() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB correctamente');
        
        // Definir esquemas
        const userSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
            email: { type: String, required: true, unique: true, lowercase: true },
            password: { type: String, required: true },
            minecraftUsername: { type: String, unique: true, sparse: true },
            role: { type: String, enum: ['user', 'admin'], default: 'user' },
            balance: { type: Number, default: 0 },
            coins: { type: Number, default: 0 },
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
        
        const User = mongoose.model('User', userSchema);
        
        // Contar usuarios antes de limpiar
        const userCount = await User.countDocuments();
        console.log(`📊 Usuarios encontrados: ${userCount}`);
        
        if (userCount === 0) {
            console.log('✅ No hay usuarios para limpiar');
            return;
        }
        
        // Mostrar usuarios que serán eliminados
        const users = await User.find({}, 'username email minecraftUsername createdAt');
        console.log('\n📋 Usuarios que serán eliminados:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.email}) - Minecraft: ${user.minecraftUsername || 'No asignado'} - Creado: ${user.createdAt}`);
        });
        
        // Eliminar todos los usuarios
        console.log('\n🗑️ Eliminando todos los usuarios...');
        const result = await User.deleteMany({});
        console.log(`✅ Eliminados ${result.deletedCount} usuarios`);
        
        // Verificar que se eliminaron todos
        const remainingCount = await User.countDocuments();
        console.log(`📊 Usuarios restantes: ${remainingCount}`);
        
        if (remainingCount === 0) {
            console.log('🎉 ¡Limpieza completada exitosamente!');
            console.log('💡 Ahora puedes registrar nuevos usuarios desde cero');
        } else {
            console.log('⚠️ Aún quedan usuarios en la base de datos');
        }
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    } finally {
        // Cerrar conexión
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

// Ejecutar limpieza
cleanUsers();
