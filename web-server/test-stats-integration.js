const io = require('socket.io-client');

console.log('🧪 Iniciando prueba de integración de estadísticas...');

// Conectar al servidor
const socket = io('http://localhost:3004', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Conectado al servidor');
  
  // Unirse a la sala de estadísticas
  socket.emit('join-stats-room');
  console.log('📊 Unido a la sala de estadísticas');
});

socket.on('stats-update', (data) => {
  console.log('📊 Estadísticas recibidas:', {
    timestamp: new Date(data.timestamp).toLocaleString(),
    online_players: data.online_players,
    max_players: data.max_players,
    server_name: data.server_name,
    version: data.version,
    players_count: Object.keys(data.players || {}).length
  });
  
  if (data.players && Object.keys(data.players).length > 0) {
    console.log('👥 Jugadores conectados:');
    Object.values(data.players).forEach(player => {
      console.log(`  - ${player.name} (${player.display_name}) - Salud: ${player.health}/${player.max_health} - Ping: ${player.ping}ms`);
    });
  }
});

socket.on('disconnect', () => {
  console.log('🔌 Desconectado del servidor');
});

socket.on('connect_error', (error) => {
  console.error('❌ Error de conexión:', error);
});

// Mantener la conexión abierta por 30 segundos
setTimeout(() => {
  console.log('🔚 Cerrando conexión de prueba...');
  socket.disconnect();
  process.exit(0);
}, 30000);

console.log('⏱️  Prueba ejecutándose por 30 segundos...');
