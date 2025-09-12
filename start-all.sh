#!/bin/bash

# Script para iniciar todo el sistema
echo "🚀 Iniciando Minecraft Inventory Manager..."

# Verificar que Java esté instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java no está instalado. Por favor instala Java 17 o superior."
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 16 o superior."
    exit 1
fi

# Verificar que Maven esté instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven no está instalado. Por favor instala Maven."
    exit 1
fi

echo "✅ Todas las dependencias están instaladas"

# Compilar el plugin si no existe
if [ ! -f "plugins/InventoryManager-1.0.0.jar" ]; then
    echo "🔨 Compilando plugin..."
    cd plugins/InventoryManager
    mvn clean package -q
    if [ $? -eq 0 ]; then
        cp target/InventoryManager-1.0.0.jar ../../
        echo "✅ Plugin compilado correctamente"
    else
        echo "❌ Error al compilar el plugin"
        exit 1
    fi
    cd ../..
fi

# Instalar dependencias del servidor web si no están instaladas
if [ ! -d "web-server/node_modules" ]; then
    echo "📦 Instalando dependencias del servidor web..."
    cd web-server
    npm install --silent
    if [ $? -eq 0 ]; then
        echo "✅ Dependencias instaladas correctamente"
    else
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
    cd ..
fi

echo ""
echo "🎮 Iniciando servidor web en segundo plano..."
cd web-server
npm start &
WEB_PID=$!
cd ..

echo "⏳ Esperando 3 segundos para que el servidor web inicie..."
sleep 3

echo ""
echo "🎯 Iniciando servidor de Minecraft..."
echo "📝 El servidor web estará disponible en: http://localhost:3000"
echo "🎮 El servidor de Minecraft estará disponible en: localhost:25565"
echo ""
echo "💡 Para detener todo el sistema, presiona Ctrl+C"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $WEB_PID 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar servidor de Minecraft
./start-server.sh

# Si el servidor de Minecraft se cierra, también cerrar el servidor web
kill $WEB_PID 2>/dev/null
