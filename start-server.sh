#!/bin/bash

# Script para iniciar el servidor de Minecraft con CraftBukkit
echo "Iniciando servidor de Minecraft..."

# Crear directorio plugins si no existe
mkdir -p plugins

# Usar CraftBukkit 1.20.4 que es compatible con Java 20
SERVER_JAR="craftbukkit-1.20.4.jar"

# Descargar CraftBukkit si no existe
if [ ! -f "$SERVER_JAR" ]; then
    echo "Descargando CraftBukkit 1.20.4..."
    curl -o "$SERVER_JAR" https://cdn.getbukkit.org/craftbukkit/craftbukkit-1.20.4.jar
fi

# Iniciar el servidor
java -Xmx2G -Xms1G -jar "$SERVER_JAR" nogui
