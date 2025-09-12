# Minecraft Inventory Manager

Un sistema completo para gestionar inventarios de jugadores de Minecraft en tiempo real usando Bukkit/Spigot y una interfaz web moderna.

## 🚀 Características

- **Servidor Minecraft**: CraftBukkit 1.21.8
- **Plugin personalizado**: Gestión de inventarios con MongoDB
- **Interfaz web**: HTML con TailwindCSS y JavaScript
- **Base de datos**: MongoDB Atlas
- **Sincronización automática**: Inventarios guardados cada minuto
- **Tiempo real**: Agregar items a jugadores desde la web

## 📋 Requisitos

- Java 17 o superior
- Node.js 16 o superior
- MongoDB Atlas (ya configurado)
- Minecraft Java Edition

## 🛠️ Instalación

### 1. Configurar el servidor de Minecraft

```bash
# Hacer ejecutable el script de inicio
chmod +x start-server.sh

# Iniciar el servidor (esto descargará CraftBukkit automáticamente)
./start-server.sh
```

### 2. Compilar el plugin

```bash
cd plugins/InventoryManager
mvn clean package
```

El plugin compilado estará en `target/InventoryManager-1.0.0.jar`

### 3. Instalar el plugin

```bash
# Copiar el plugin compilado al directorio plugins del servidor
cp target/InventoryManager-1.0.0.jar ../../plugins/
```

### 4. Configurar el servidor web

```bash
cd web-server
npm install
npm start
```

## 🎮 Uso

### Servidor de Minecraft

1. Inicia el servidor con `./start-server.sh`
2. El plugin se conectará automáticamente a MongoDB
3. Los inventarios se guardan automáticamente cada minuto
4. Al entrar al servidor, los jugadores cargan su inventario desde la DB

### Interfaz Web

1. Abre http://localhost:3000 en tu navegador
2. Selecciona un jugador de la lista
3. Elige un item y la cantidad
4. Haz clic en "Agregar al Inventario"
5. El item se agregará en tiempo real al jugador

## 🔧 Comandos del Plugin

- `/inventory reload` - Recarga el plugin
- `/inventory save` - Guarda tu inventario manualmente
- `/inventory load` - Carga tu inventario desde la DB

## 📊 Base de Datos

### Colecciones MongoDB

- **players**: Información de jugadores (UUID, nombre, última conexión)
- **inventories**: Inventarios de jugadores (UUID, items serializados)

### Estructura de datos

```json
{
  "uuid": "player-uuid",
  "name": "PlayerName",
  "inventory": "[{\"slot\":0,\"material\":\"DIAMOND\",\"amount\":64}]",
  "lastSaved": 1234567890
}
```

## 🔌 API Endpoints

- `GET /api/players` - Lista de jugadores
- `GET /api/items` - Lista de items disponibles
- `GET /api/inventory/:uuid` - Inventario de un jugador
- `POST /api/add-item` - Agregar item a un jugador

## 🎨 Interfaz Web

- **Diseño responsive** con TailwindCSS
- **Tema Minecraft** con colores personalizados
- **Actualizaciones en tiempo real** con Socket.IO
- **Gestión visual de inventarios** con grid 9x4
- **Log de actividad** en tiempo real

## 🔒 Seguridad

- Conexión segura a MongoDB Atlas
- Validación de datos en el servidor
- Manejo de errores robusto
- Permisos de administrador para comandos

## 📝 Notas Técnicas

- El plugin usa Maven para gestión de dependencias
- MongoDB Driver incluido en el plugin
- Socket.IO para comunicación en tiempo real
- Inventarios serializados en JSON
- Soporte para encantamientos y metadatos

## 🐛 Solución de Problemas

### El plugin no se carga
- Verifica que Java 17+ esté instalado
- Revisa los logs del servidor
- Asegúrate de que MongoDB esté accesible

### La web no se conecta
- Verifica que el servidor Node.js esté ejecutándose
- Revisa la consola del navegador
- Asegúrate de que el puerto 3000 esté libre

### Items no se agregan
- Verifica que el jugador esté conectado
- Revisa los logs del plugin
- Comprueba la conexión a MongoDB

## 📞 Soporte

Para problemas o preguntas, revisa los logs del servidor y la consola del navegador.
# bukkit-plugin-mongo-front-node
