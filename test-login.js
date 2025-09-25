const io = require('socket.io-client');

// Simular conexión desde el plugin de Minecraft
const socket = io('http://127.0.0.1:3004');

socket.on('connect', () => {
    console.log('🔌 Conectado al servidor web');
    
    // Simular autenticación con código
    const testCode = 'A1B2C3D4E5F6';
    const minecraftUsername = 'TestPlayer';
    
    console.log(`🔐 Probando autenticación con código: ${testCode}`);
    console.log(`👤 Nombre de Minecraft: ${minecraftUsername}`);
    
    // Configurar listener para la respuesta
    socket.once('minecraft-authenticate-response', (response) => {
        console.log('📨 Respuesta recibida:', JSON.stringify(response, null, 2));
        
        if (response.success) {
            console.log('✅ Autenticación exitosa!');
            console.log(`👤 Usuario: ${response.user.username}`);
            console.log(`🎮 Minecraft: ${response.user.minecraftUsername}`);
            console.log(`💰 Balance: ${response.user.balance}`);
            
            if (response.warning) {
                console.log(`⚠️ Advertencia: ${response.warning}`);
            }
        } else {
            console.log('❌ Error en autenticación:', response.error);
        }
        
        // Cerrar conexión
        socket.disconnect();
        process.exit(0);
    });
    
    // Enviar solicitud de autenticación
    socket.emit('minecraft-authenticate', {
        accessCode: testCode,
        minecraftUsername: minecraftUsername
    });
});

socket.on('connect_error', (error) => {
    console.error('❌ Error conectando:', error.message);
    process.exit(1);
});

socket.on('disconnect', () => {
    console.log('🔌 Desconectado del servidor web');
});

// Timeout después de 10 segundos
setTimeout(() => {
    console.log('⏰ Timeout - cerrando conexión');
    socket.disconnect();
    process.exit(1);
}, 10000);
