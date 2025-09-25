# 🔧 Configuración de Puertos - Minecraft Inventory Manager

## 📋 Resumen de Puertos

| Servicio | Puerto | URL | Estado |
|----------|--------|-----|--------|
| **Minecraft Server** | 25565 | localhost:25565 | ✅ Configurado |
| **Backend API** | 3004 | http://localhost:3004 | ✅ Configurado |
| **Frontend Web** | 5173 | http://localhost:5173 | ✅ Configurado |

## 🔧 Cambios Realizados

### ✅ **Problema Solucionado: Conexión Socket.IO**

**Problema**: El plugin de Minecraft intentaba conectarse al puerto 3000, pero el servidor web estaba en el puerto 3004.

**Solución**: Actualizado el plugin UserRegistration para usar el puerto correcto.

### 📁 **Archivos Modificados:**

1. **SocketManager.java** - Cambiado puerto de 3000 a 3004
2. **MongoDBManager.java** - Cambiado URL de API de 3000 a 3004
3. **Plugin recompilado** - UserRegistration-1.0.0.jar actualizado

## 🚀 **Scripts de Inicio Actualizados:**

### 🎮 **start-server-minecraft.sh**
```bash
./start-server-minecraft.sh
```
- Puerto: 25565
- Inicia servidor de Minecraft con CraftBukkit

### 🖥️ **start-server.sh** 
```bash
./start-server.sh
```
- Puerto: 3004
- Inicia servidor backend API

### 🌐 **start-client.sh**
```bash
./start-client.sh
```
- Puerto: 5173
- Inicia frontend de desarrollo

## 🔍 **Verificación de Conexión**

### ✅ **Backend API**
```bash
curl http://localhost:3004/api/shop/products
```

### ✅ **Socket.IO**
- El plugin de Minecraft ahora se conecta correctamente a `http://127.0.0.1:3004`
- Los eventos de Socket.IO funcionan correctamente

### ✅ **Frontend**
- Accesible en http://localhost:5173
- Se conecta automáticamente al backend en puerto 3004

## 🛠️ **Configuración del Plugin**

El plugin UserRegistration ahora está configurado para:
- **Socket URL**: `http://127.0.0.1:3004`
- **API URL**: `http://127.0.0.1:3004/api`
- **MongoDB**: Conectado a la base de datos correcta

## 🎯 **Flujo de Conexión Completo**

1. **Minecraft Server** (puerto 25565) → **Backend API** (puerto 3004)
2. **Frontend** (puerto 5173) → **Backend API** (puerto 3004)
3. **Plugin Socket.IO** → **Backend Socket.IO** (puerto 3004)

## 🔧 **Solución de Problemas**

### ❌ **Error: "xhr poll error"**
- **Causa**: Plugin intentando conectar a puerto incorrecto
- **Solución**: Plugin recompilado con puerto correcto (3004)

### ❌ **Error: "Cannot find module"**
- **Causa**: Dependencias no instaladas
- **Solución**: Los scripts instalan dependencias automáticamente

### ❌ **Error: "Port already in use"**
- **Causa**: Puerto ocupado por proceso anterior
- **Solución**: Scripts detienen procesos existentes automáticamente

## 📱 **Comandos de Verificación**

```bash
# Verificar puertos en uso
lsof -i :25565
lsof -i :3004
lsof -i :5173

# Verificar conexión API
curl -s http://localhost:3004/api/shop/products

# Verificar logs del servidor
tail -f logs/latest.log
```

## 🎉 **Estado Actual**

✅ **Todos los puertos configurados correctamente**  
✅ **Plugin recompilado y actualizado**  
✅ **Scripts de inicio funcionando**  
✅ **Conexión Socket.IO establecida**  
✅ **Sistema completo operativo**  

El sistema está ahora completamente funcional con todos los puertos correctamente configurados.
