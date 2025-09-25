const WebSocket = require('ws');

class StatsIntegration {
    constructor(io = null) {
        this.minecraftWebSocket = null;
        this.io = io; // Socket.IO instance
        this.lastStatsData = null;
        this.isConnected = false;
    }

    // Conectar con el plugin de Minecraft
    connectToMinecraft(port = 8081) {
        try {
            this.minecraftWebSocket = new WebSocket(`ws://localhost:${port}`);
            
            this.minecraftWebSocket.on('open', () => {
                console.log('✅ Conectado al plugin StatsPlugin en puerto', port);
                this.isConnected = true;
            });

            this.minecraftWebSocket.on('message', (data) => {
                try {
                    const statsData = JSON.parse(data.toString());
                    this.lastStatsData = statsData;
                    
                    // Enviar datos a todos los clientes conectados via Socket.IO
                    this.broadcastToClients(statsData);
                    
                    console.log(`📊 Estadísticas actualizadas: ${statsData.online_players} jugadores conectados`);
                } catch (error) {
                    console.error('❌ Error procesando datos del plugin:', error);
                }
            });

            this.minecraftWebSocket.on('close', () => {
                console.log('🔌 Conexión con plugin StatsPlugin cerrada');
                this.isConnected = false;
                
                // Intentar reconectar en 5 segundos
                setTimeout(() => {
                    console.log('🔄 Intentando reconectar al plugin...');
                    this.connectToMinecraft(port);
                }, 5000);
            });

            this.minecraftWebSocket.on('error', (error) => {
                console.error('❌ Error en conexión con plugin:', error);
                this.isConnected = false;
                
                // Si no puede conectar al plugin, usar datos demo
                console.log('🎮 Modo demo: Usando datos simulados');
                this.startDemoMode();
            });

        } catch (error) {
            console.error('❌ Error iniciando conexión con plugin:', error);
            // Si hay error, usar datos demo
            console.log('🎮 Modo demo: Usando datos simulados');
            this.startDemoMode();
        }
    }

    // Modo demo con datos simulados
    startDemoMode() {
        this.isConnected = true;
        this.lastStatsData = this.generateDemoData();
        
        // Enviar datos demo a clientes conectados
        this.broadcastToClients(this.lastStatsData);
        
        // Actualizar datos cada 3 segundos
        setInterval(() => {
            this.lastStatsData = this.generateDemoData();
            this.broadcastToClients(this.lastStatsData);
        }, 3000);
    }

    // Generar datos demo
    generateDemoData() {
        const players = ['CraftAR_Admin', 'Minecraft_Pro', 'Builder_Master', 'PvP_Champion', 'Redstone_Expert'];
        const worlds = ['world', 'world_nether', 'world_the_end'];
        const gameModes = ['SURVIVAL', 'CREATIVE', 'ADVENTURE'];
        
        const demoPlayers = {};
        const playerCount = Math.floor(Math.random() * 3) + 1; // 1-3 jugadores
        
        for (let i = 0; i < playerCount; i++) {
            const playerName = players[i];
            const health = Math.random() * 20;
            const ping = Math.floor(Math.random() * 200) + 20;
            const playTime = Math.floor(Math.random() * 1000) + 100;
            
            demoPlayers[playerName] = {
                name: playerName,
                display_name: playerName,
                uuid: `demo-uuid-${i}`,
                health: Math.round(health * 10) / 10,
                max_health: 20,
                food_level: Math.floor(Math.random() * 20),
                saturation: Math.round(Math.random() * 20 * 10) / 10,
                experience: Math.random(),
                level: Math.floor(Math.random() * 50),
                ping: ping,
                world: worlds[Math.floor(Math.random() * worlds.length)],
                x: Math.round((Math.random() * 2000 - 1000) * 10) / 10,
                y: Math.round((Math.random() * 100 + 60) * 10) / 10,
                z: Math.round((Math.random() * 2000 - 1000) * 10) / 10,
                game_mode: gameModes[Math.floor(Math.random() * gameModes.length)],
                is_flying: Math.random() > 0.8,
                is_sneaking: Math.random() > 0.7,
                is_sprinting: Math.random() > 0.6,
                is_op: Math.random() > 0.9,
                play_time_minutes: playTime,
                play_time_hours: Math.round(playTime / 60 * 10) / 10,
                inventory: {
                    held_item: 'DIAMOND_SWORD',
                    armor_helmet: 'DIAMOND_HELMET',
                    armor_chestplate: 'DIAMOND_CHESTPLATE',
                    armor_leggings: 'DIAMOND_LEGGINGS',
                    armor_boots: 'DIAMOND_BOOTS',
                    inventory_size: 36
                }
            };
        }
        
        return {
            timestamp: Date.now(),
            online_players: playerCount,
            max_players: 20,
            server_name: 'CraftAR Server',
            version: '1.20.4',
            players: demoPlayers
        };
    }

    // Enviar datos a todos los clientes via Socket.IO
    broadcastToClients(data) {
        if (this.io) {
            this.io.to('stats-room').emit('stats-update', data);
            console.log(`📊 Estadísticas enviadas a ${this.io.sockets.adapter.rooms.get('stats-room')?.size || 0} clientes`);
        }
    }

    // Obtener estado de conexión
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            clients: this.io ? this.io.sockets.adapter.rooms.get('stats-room')?.size || 0 : 0,
            lastUpdate: this.lastStatsData ? new Date(this.lastStatsData.timestamp) : null
        };
    }

    // Obtener datos de estadísticas
    getStatsData() {
        return this.lastStatsData;
    }
}

module.exports = StatsIntegration;
