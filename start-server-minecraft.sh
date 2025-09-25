#!/bin/bash

# Script para iniciar el servidor de Minecraft con CraftBukkit
echo "🎮 Iniciando Servidor de Minecraft con CraftBukkit..."

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java no está instalado. Por favor instala Java 17+ primero."
    echo "   En macOS: brew install openjdk@17"
    echo "   En Ubuntu: sudo apt install openjdk-17-jdk"
    exit 1
fi

# Verificar versión de Java
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Se requiere Java 17 o superior. Versión actual: $(java -version 2>&1 | head -n 1)"
    echo "   Por favor actualiza Java a la versión 17 o superior"
    exit 1
fi

echo "✅ Java $(java -version 2>&1 | head -n 1) detectado"

# Verificar si el archivo JAR existe
JAR_FILE="craftbukkit-1.21.8.jar"
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ No se encontró $JAR_FILE"
    echo "   Asegúrate de que el archivo JAR del servidor esté en el directorio actual"
    exit 1
fi

# Verificar si el puerto 25565 está disponible
if lsof -Pi :25565 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 25565 ya está en uso"
    echo "   Deteniendo proceso existente..."
    pkill -f "java.*craftbukkit" 2>/dev/null || true
    pkill -f "java.*minecraft" 2>/dev/null || true
    sleep 3
fi

# Verificar EULA
if [ ! -f "eula.txt" ]; then
    echo "📝 Creando archivo eula.txt..."
    echo "eula=false" > eula.txt
fi

# Verificar si EULA está aceptada
if ! grep -q "eula=true" eula.txt; then
    echo "⚠️  EULA no aceptada"
    echo "   Por favor acepta el EULA editando eula.txt y cambiando eula=false a eula=true"
    echo "   O ejecuta: echo 'eula=true' > eula.txt"
    exit 1
fi

# Configurar memoria JVM
MEMORY="2G"
if [ -n "$1" ]; then
    MEMORY="$1"
fi

echo "🧠 Configurando memoria JVM: $MEMORY"

# Verificar plugins
echo "🔌 Verificando plugins..."
PLUGIN_COUNT=$(find plugins -name "*.jar" 2>/dev/null | wc -l)
if [ "$PLUGIN_COUNT" -gt 0 ]; then
    echo "✅ $PLUGIN_COUNT plugins detectados"
    echo "   Plugins instalados:"
    find plugins -name "*.jar" -exec basename {} \; | sed 's/^/   - /'
else
    echo "⚠️  No se encontraron plugins"
fi

# Mostrar configuración del servidor
echo "⚙️  Configuración del servidor:"
echo "   Puerto: 25565"
echo "   Mundo: world"
echo "   Modo: survival"
echo "   Dificultad: easy"
echo "   Máximo jugadores: 20"
echo "   Whitelist: deshabilitada"
echo ""

# Crear directorio de logs si no existe
mkdir -p logs

# Mostrar información de inicio
echo "🚀 Iniciando servidor de Minecraft..."
echo "   Servidor disponible en: localhost:25565"
echo "   Logs en: logs/latest.log"
echo "   Para detener: Ctrl+C"
echo "   Para comandos: conecta al servidor y usa /help"
echo ""

# Configurar argumentos JVM
JVM_ARGS="-Xms$MEMORY -Xmx$MEMORY -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1"

# Iniciar servidor
echo "🎯 Ejecutando: java $JVM_ARGS -jar $JAR_FILE nogui"
echo ""

java $JVM_ARGS -jar "$JAR_FILE" nogui
