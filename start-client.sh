#!/bin/bash

# Script para iniciar el cliente frontend de Minecraft Inventory Manager
echo "🚀 Iniciando Cliente Frontend de Minecraft Inventory Manager..."

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

# Cambiar al directorio del frontend
cd "$(dirname "$0")/web-server/front"

# Verificar si el archivo package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json en el directorio web-server/front"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias del frontend"
        exit 1
    fi
fi

# Verificar si el puerto 5173 (Vite dev server) está disponible
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 5173 ya está en uso"
    echo "   Deteniendo proceso existente..."
    pkill -f "vite" 2>/dev/null || true
    sleep 2
fi

# Verificar si el backend está ejecutándose
echo "🔍 Verificando conexión con el backend..."
if curl -s http://localhost:3004/api/shop/products > /dev/null 2>&1; then
    echo "✅ Backend detectado en puerto 3004"
else
    echo "⚠️  Backend no detectado en puerto 3004"
    echo "   Asegúrate de que el servidor backend esté ejecutándose con: ./start-server.sh"
    echo "   Continuando con el inicio del frontend..."
fi

# Construir el proyecto si no existe la carpeta dist
if [ ! -d "dist" ]; then
    echo "🔨 Construyendo proyecto frontend..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Error al construir el proyecto frontend"
        exit 1
    fi
fi

echo "🌐 Iniciando servidor de desarrollo en puerto 5173..."
echo "   Frontend disponible en: http://localhost:5173"
echo "   Backend API en: http://localhost:3004"
echo ""
echo "📱 Para desarrollo, usa: npm run dev"
echo "🏗️  Para construir: npm run build"
echo "🛑 Para detener: Ctrl+C"
echo ""

# Iniciar servidor de desarrollo
echo "🚀 Iniciando servidor de desarrollo..."
npm run dev
