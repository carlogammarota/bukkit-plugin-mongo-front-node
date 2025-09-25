#!/bin/bash

# Script para iniciar el frontend de CraftAR
echo "🚀 Iniciando Frontend de CraftAR..."

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

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
fi

# Verificar si el backend está ejecutándose
echo "🔍 Verificando conexión con el backend..."
if curl -s http://localhost:3004/api/shop/products > /dev/null 2>&1; then
    echo "✅ Backend detectado en puerto 3004"
else
    echo "⚠️  Backend no detectado en puerto 3004"
    echo "   Asegúrate de que el servidor backend esté ejecutándose"
fi

# Construir el proyecto si no existe la carpeta dist
if [ ! -d "dist" ]; then
    echo "🔨 Construyendo proyecto..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Error al construir el proyecto"
        exit 1
    fi
fi

# Iniciar el servidor SSR
echo "🌐 Iniciando servidor SSR en puerto 3001..."
echo "   Frontend disponible en: http://localhost:3001"
echo "   Backend API en: http://localhost:3004"
echo ""
echo "📱 Para desarrollo, usa: npm run dev"
echo "🏗️  Para construir: npm run build"
echo ""

# Iniciar servidor
npm run serve
