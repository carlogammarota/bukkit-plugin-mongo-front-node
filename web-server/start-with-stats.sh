#!/bin/bash

echo "🚀 Iniciando servidor con integración de estadísticas..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Instalar dependencias del frontend si no existen
if [ ! -d "front/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd front
    npm install
    cd ..
fi

# Construir el frontend si no existe
if [ ! -d "front/dist" ]; then
    echo "🔨 Construyendo frontend..."
    cd front
    npm run build
    cd ..
fi

echo "✅ Dependencias instaladas y frontend construido"

# Iniciar el servidor
echo "🌐 Iniciando servidor en puerto 3004..."
echo "📊 Las estadísticas estarán disponibles en tiempo real"
echo "🔗 Frontend disponible en: http://localhost:3004"
echo "📡 Socket.IO disponible en: ws://localhost:3004"
echo ""
echo "Para probar las estadísticas, ejecuta en otra terminal:"
echo "node test-stats-integration.js"
echo ""
echo "Presiona Ctrl+C para detener el servidor"

node server.js
