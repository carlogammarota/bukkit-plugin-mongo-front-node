# 🚀 Scripts de Inicio - Minecraft Inventory Manager

## 📋 Descripción
Scripts automatizados para iniciar el servidor backend y el cliente frontend del sistema de gestión de inventarios de Minecraft.

## 🛠️ Scripts Disponibles

### 🎮 `start-server-minecraft.sh` - Servidor de Minecraft
- **Puerto**: 25565
- **Función**: Inicia el servidor de Minecraft con CraftBukkit
- **Características**:
  - ✅ Verificación de Java 17+
  - ✅ Verificación de EULA
  - ✅ Configuración automática de memoria JVM
  - ✅ Verificación de plugins
  - ✅ Optimización de rendimiento JVM

### 🖥️ `start-server.sh` - Servidor Backend
- **Puerto**: 3004
- **Función**: Inicia el servidor API de Node.js
- **Características**:
  - ✅ Verificación de Node.js 18+
  - ✅ Instalación automática de dependencias
  - ✅ Creación de archivo `.env` con configuración por defecto
  - ✅ Verificación de puerto disponible
  - ✅ Manejo de procesos existentes

### 🌐 `start-client.sh` - Cliente Frontend
- **Puerto**: 5173 (Vite dev server)
- **Función**: Inicia el servidor de desarrollo de Vue.js
- **Características**:
  - ✅ Verificación de Node.js 18+
  - ✅ Instalación automática de dependencias
  - ✅ Construcción automática del proyecto
  - ✅ Verificación de conexión con backend
  - ✅ Manejo de procesos existentes

## 🚀 Uso

### Inicio del Sistema Completo

```bash
# Terminal 1: Iniciar servidor de Minecraft
./start-server-minecraft.sh

# Terminal 2: Iniciar servidor backend
./start-server.sh

# Terminal 3: Iniciar cliente frontend
./start-client.sh
```

### URLs de Acceso
- **Minecraft Server**: localhost:25565
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3004
- **API Docs**: http://localhost:3004/api

## 🔧 Configuración

### Variables de Entorno (.env)
El script del servidor crea automáticamente un archivo `.env` con configuración por defecto:

```env
PORT=3004
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/minecraft-inventory
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### Requisitos
- Node.js 18 o superior
- npm
- MongoDB (para el backend)

## 🛑 Detener Servicios

```bash
# Detener backend
Ctrl+C en la terminal del servidor

# Detener frontend
Ctrl+C en la terminal del cliente

# O detener todos los procesos Node.js
pkill -f "node"
```

## 🔍 Solución de Problemas

### Puerto en Uso
Los scripts detectan automáticamente si un puerto está en uso y detienen el proceso existente.

### Dependencias Faltantes
Los scripts instalan automáticamente las dependencias si no existen.

### Backend No Detectado
El frontend verificará la conexión con el backend y mostrará advertencias si no está disponible.

## 📁 Estructura de Proyecto

```
minecraft/
├── start-server.sh          # Script del servidor
├── start-client.sh          # Script del cliente
├── web-server/              # Backend Node.js
│   ├── server.js
│   ├── package.json
│   └── front/              # Frontend Vue.js
│       ├── package.json
│       └── src/
└── README-SCRIPTS.md        # Esta documentación
```

## 🎯 Comandos de Desarrollo

```bash
# Desarrollo del backend
cd web-server
npm run dev

# Desarrollo del frontend
cd web-server/front
npm run dev

# Construir frontend para producción
cd web-server/front
npm run build
```
