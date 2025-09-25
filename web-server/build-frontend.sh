#!/bin/bash

echo "🔨 Compilando frontend con estadísticas integradas..."

# Navegar al directorio del frontend
cd "$(dirname "$0")/front"

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Compilar el frontend
echo "🏗️ Compilando frontend..."
npm run build

# Verificar si la compilación fue exitosa
if [ $? -eq 0 ]; then
    echo "✅ Frontend compilado exitosamente!"
    echo "📁 Archivos generados en: front/dist/"
    echo "📊 Las estadísticas del servidor están integradas en la página principal"
    echo "🌐 Para ver las estadísticas, visita: http://localhost:3004/"
else
    echo "❌ Error en la compilación del frontend"
    exit 1
fi
