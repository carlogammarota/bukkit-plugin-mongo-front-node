#!/bin/bash

# Script para iniciar el servidor backend de Minecraft Inventory Manager
echo "🚀 Iniciando Servidor Backend de Minecraft Inventory Manager..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Cambiar al directorio del servidor web
cd "$(dirname "$0")/web-server"

# Verificar si el archivo server.js existe
if [ ! -f "server.js" ]; then
    echo "❌ No se encontró server.js en el directorio web-server"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del servidor..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias del servidor"
        exit 1
    fi
fi

# Verificar si el puerto 3004 está disponible
if lsof -Pi :3004 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3004 ya está en uso"
    echo "   Deteniendo proceso existente..."
    pkill -f "node.*server.js" 2>/dev/null || true
    sleep 2
fi

# Verificar variables de entorno necesarias
echo "🔍 Verificando configuración..."

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env con configuración por defecto..."
    cat > .env << EOF
# Configuración del servidor
PORT=3004
NODE_ENV=production

# Base de datos MongoDB (ajusta según tu configuración)
MONGODB_URI=mongodb://localhost:27017/minecraft-inventory

# JWT Secret (cambia por una clave segura)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Configuración de MercadoPago (opcional)
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago

# Configuración de email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
EOF
    echo "⚠️  Archivo .env creado con valores por defecto"
    echo "   Por favor configura las variables de entorno según tu setup"
fi

echo "🌐 Iniciando servidor backend en puerto 3004..."
echo "   API disponible en: http://localhost:3004"
echo "   Documentación API en: http://localhost:3004/api"
echo ""
echo "📱 Para desarrollo, usa: npm run dev"
echo "🛑 Para detener: Ctrl+C"
echo ""

# Iniciar servidor
npm start
