# 📊 Integración de Estadísticas en Tiempo Real

Las estadísticas del servidor de Minecraft ahora están integradas directamente en el frontend de CraftAR, mostrándose en la página principal (`/`) con datos en tiempo real.

## 🚀 Características

- **Estadísticas en Tiempo Real**: Datos actualizados cada 2 segundos
- **Integración WebSocket**: Comunicación bidireccional con el plugin
- **Panel Interactivo**: Lista expandible de jugadores conectados
- **Información Completa**: Salud, ping, ubicación, tiempo de juego, inventario
- **Diseño Responsivo**: Funciona en móviles y escritorio
- **Reconexión Automática**: Se reconecta automáticamente si se pierde la conexión

## 🛠️ Instalación y Configuración

### 1. Compilar el Plugin
```bash
cd plugins/StatsPlugin
./build.sh
```

### 2. Instalar Dependencias del Servidor Web
```bash
cd web-server
npm install ws
```

### 3. Compilar el Frontend
```bash
cd web-server
./build-frontend.sh
```

### 4. Iniciar el Servidor
```bash
cd web-server
npm start
```

## 📱 Cómo Usar

### Acceso a las Estadísticas
1. **Página Principal**: Visita `http://localhost:3004/`
2. **Estadísticas del Servidor**: Se muestran automáticamente en la sección hero
3. **Lista de Jugadores**: Haz clic en "Jugadores Conectados" para expandir

### Funcionalidades del Panel

#### Estadísticas del Servidor
- **Jugadores Online**: Número actual de jugadores conectados
- **Máximo**: Capacidad máxima del servidor
- **Versión**: Versión de Minecraft del servidor
- **Estado**: Indicador de conexión en tiempo real

#### Información de Jugadores
- **Información Básica**: Nombre, salud, ping
- **Ubicación**: Mundo y coordenadas (X, Y, Z)
- **Estado**: Modo de juego, volando, agachado, corriendo
- **Tiempo de Juego**: Horas jugadas
- **Inventario**: Item en mano y armadura equipada
- **Barras de Salud**: Indicadores visuales de salud

## 🔧 Configuración

### Plugin (config.yml)
```yaml
websocket:
  port: 8081  # Puerto del WebSocket del plugin

update:
  interval: 2  # Intervalo en segundos

logging:
  verbose: true  # Logs detallados
```

### Servidor Web
- **Puerto WebSocket**: 8082 (para clientes)
- **API REST**: `/api/stats` y `/api/stats/status`
- **Integración**: Automática con el plugin

## 📊 Datos Incluidos

### Información del Servidor
- Jugadores online/máximo
- Nombre del servidor
- Versión de Minecraft
- Timestamp de última actualización

### Información de Jugadores
- **Identificación**: Nombre, UUID, nombre de pantalla
- **Salud**: Salud actual, máxima, nivel de comida, saturación
- **Experiencia**: Nivel y experiencia actual
- **Conexión**: Ping de conexión
- **Ubicación**: Mundo, coordenadas X, Y, Z
- **Estado**: Modo de juego, volando, agachado, corriendo, OP
- **Tiempo**: Tiempo de juego en horas
- **Inventario**: Item en mano, armadura (casco, pechera, pantalones, botas)

## 🎨 Diseño y UX

### Características Visuales
- **Gradientes**: Colores que cambian según la salud del jugador
- **Indicadores de Ping**: Verde (bueno), amarillo (regular), rojo (malo)
- **Animaciones**: Transiciones suaves y efectos de hover
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Interactividad
- **Lista Expandible**: Click para mostrar/ocultar jugadores
- **Actualización Automática**: Sin necesidad de refrescar la página
- **Estado de Conexión**: Indicador visual del estado de conexión
- **Reconexión Automática**: Se reconecta si se pierde la conexión

## 🔌 API y WebSocket

### Endpoints REST
- `GET /api/stats` - Obtener estadísticas actuales
- `GET /api/stats/status` - Estado de conexión

### WebSocket
- `ws://localhost:8082/stats-ws` - Estadísticas en tiempo real
- Envía datos JSON con toda la información del servidor

### Formato de Datos
```json
{
  "timestamp": 1234567890,
  "online_players": 5,
  "max_players": 100,
  "server_name": "CraftAR",
  "version": "1.20.4",
  "players": {
    "PlayerName": {
      "name": "PlayerName",
      "health": 20.0,
      "ping": 45,
      "world": "world",
      "x": 100.5,
      "y": 64.0,
      "z": 200.3,
      "game_mode": "SURVIVAL",
      "play_time_hours": 150.5,
      "inventory": {
        "held_item": "DIAMOND_SWORD",
        "armor_helmet": "DIAMOND_HELMET"
      }
    }
  }
}
```

## 🐛 Solución de Problemas

### Estadísticas no se cargan
1. Verifica que el plugin StatsPlugin esté habilitado
2. Comprueba que el puerto 8081 no esté en uso
3. Revisa los logs del servidor de Minecraft

### WebSocket no conecta
1. Asegúrate de que el servidor web esté ejecutándose
2. Verifica que el puerto 8082 esté disponible
3. Comprueba la consola del navegador para errores

### Frontend no muestra datos
1. Compila el frontend: `./build-frontend.sh`
2. Verifica que el servidor web esté sirviendo los archivos correctos
3. Comprueba que las rutas de la API estén funcionando

## 📝 Logs y Debugging

### Plugin
- Logs de conexiones WebSocket
- Actualizaciones de estadísticas
- Errores de conexión

### Servidor Web
- Conexiones con el plugin
- Clientes WebSocket conectados
- Errores de API

### Frontend
- Conexión WebSocket
- Errores de datos
- Estado de reconexión

## 🚀 Próximas Mejoras

- [ ] Gráficos de estadísticas históricas
- [ ] Filtros por mundo o tipo de jugador
- [ ] Notificaciones de eventos del servidor
- [ ] Exportación de datos
- [ ] Panel de administración avanzado

## 🤝 Contribuir

Para contribuir a las estadísticas:
1. Modifica el componente `StatsWidget.vue`
2. Actualiza la lógica del plugin si es necesario
3. Prueba la integración con el servidor
4. Documenta los cambios

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.
