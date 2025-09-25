const express = require('express');
const StatsIntegration = require('./stats-integration');

const app = express();
const statsIntegration = new StatsIntegration();

// Inicializar modo demo
statsIntegration.startDemoMode();

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

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`🧪 Servidor de prueba ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 API de estadísticas: http://localhost:${PORT}/api/stats`);
});
