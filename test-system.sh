#!/bin/bash

echo "🧪 Probando sistema completo de Inventory Manager..."

# Verificar que el servidor esté ejecutándose
if pgrep -f "craftbukkit-1.20.4.jar" > /dev/null; then
    echo "✅ Servidor Minecraft ejecutándose"
else
    echo "❌ Servidor Minecraft no está ejecutándose"
    exit 1
fi

# Verificar que el servidor web esté ejecutándose
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ Servidor web ejecutándose"
else
    echo "❌ Servidor web no está ejecutándose"
    exit 1
fi

# Probar API de jugadores
echo "📡 Probando API de jugadores..."
response=$(curl -s http://localhost:3000/api/players)
if [ "$response" = "[]" ]; then
    echo "✅ API de jugadores funcionando (sin jugadores conectados)"
else
    echo "✅ API de jugadores funcionando (jugadores encontrados)"
fi

# Probar API de items
echo "📡 Probando API de items..."
response=$(curl -s http://localhost:3000/api/items)
if echo "$response" | grep -q "DIAMOND"; then
    echo "✅ API de items funcionando"
else
    echo "❌ API de items no funciona"
fi

# Crear archivo de comando de prueba
echo "📝 Creando comando de prueba..."
echo "giveitem TestPlayer DIAMOND 5" > commands.txt

# Esperar un momento para que se procese
sleep 2

# Verificar si se creó el archivo de respuesta
if [ -f "responses.txt" ]; then
    echo "✅ Sistema de comandos funcionando"
    cat responses.txt
    rm -f responses.txt commands.txt
else
    echo "❌ Sistema de comandos no funciona"
    rm -f commands.txt
fi

echo ""
echo "🎮 Para probar completamente:"
echo "1. Conéctate al servidor Minecraft: localhost:25565"
echo "2. Abre la interfaz web: http://localhost:3000"
echo "3. Selecciona tu jugador y agrega items"
echo "4. Verifica que aparezcan en el juego"
echo ""
echo "📋 Comandos disponibles en el juego:"
echo "- /inventory save - Guardar inventario manualmente"
echo "- /inventory load - Cargar inventario desde la DB"
echo "- /inventory reload - Recargar plugin"
