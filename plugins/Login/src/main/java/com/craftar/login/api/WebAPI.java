package com.craftar.login.api;

import io.socket.client.IO;
import io.socket.client.Socket;
import org.json.JSONObject;
import org.bukkit.entity.Player;
import java.util.logging.Logger;
import java.net.URI;
import java.util.function.Consumer;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

public class WebAPI {

    private Socket socket;
    private boolean isConnected = false;
    private Logger logger;
    private static final String SOCKET_URL = "http://127.0.0.1:3004";
    
    // Gestión de sesiones
    private Map<UUID, String> activeSessions = new HashMap<>();

    public WebAPI() {
        this.logger = Logger.getLogger("LoginPlugin");
        initializeSocket();
    }
    
    private void initializeSocket() {
        try {
            IO.Options options = new IO.Options();
            options.timeout = 3000;
            options.reconnection = true;
            options.reconnectionAttempts = 3;
            options.reconnectionDelay = 1000;
            
            socket = IO.socket(URI.create(SOCKET_URL), options);
            
            socket.on(Socket.EVENT_CONNECT, args -> {
                isConnected = true;
                logger.info("🔌 Conectado al servidor web via Socket.IO");
            });
            
            socket.on(Socket.EVENT_DISCONNECT, args -> {
                isConnected = false;
                logger.warning("🔌 Desconectado del servidor web");
            });
            
            socket.on(Socket.EVENT_CONNECT_ERROR, args -> {
                isConnected = false;
                logger.severe("❌ Error conectando al servidor web: " + args[0]);
            });
            
            socket.connect();
            
        } catch (Exception e) {
            logger.severe("❌ Error inicializando Socket.IO: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public boolean connect() {
        return true; // La conexión es asíncrona
    }
    
    public void disconnect() {
        if (socket != null && socket.connected()) {
            socket.disconnect();
            isConnected = false;
            logger.info("🔌 Desconectado del servidor web");
        }
    }
    
    public boolean isConnected() {
        return isConnected && socket != null && socket.connected();
    }
    
    public void authenticateWithCode(String accessCode, String minecraftUsername, Consumer<JSONObject> callback) {
        if (!isConnected) {
            logger.warning("⚠️ Socket no conectado, intentando reconectar...");
            initializeSocket();
            
            try {
                Thread.sleep(1500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            if (!isConnected) {
                JSONObject errorResponse = new JSONObject();
                errorResponse.put("success", false);
                errorResponse.put("error", "No se pudo conectar al servidor web");
                callback.accept(errorResponse);
                return;
            }
        }
        
        try {
            JSONObject loginData = new JSONObject();
            loginData.put("accessCode", accessCode);
            loginData.put("minecraftUsername", minecraftUsername);
            
            logger.info("🔐 Enviando solicitud de login: " + accessCode);
            
            // Configurar listener para la respuesta
            socket.once("minecraft-authenticate-response", args -> {
                try {
                    JSONObject response = (JSONObject) args[0];
                    logger.info("📨 Respuesta recibida: " + (response.getBoolean("success") ? "ÉXITO" : "ERROR"));
                    callback.accept(response);
                } catch (Exception e) {
                    logger.severe("❌ Error procesando respuesta: " + e.getMessage());
                    JSONObject errorResponse = new JSONObject();
                    errorResponse.put("success", false);
                    errorResponse.put("error", "Error procesando respuesta del servidor");
                    callback.accept(errorResponse);
                }
            });
            
            // Enviar solicitud
            socket.emit("minecraft-authenticate", loginData);
            
        } catch (Exception e) {
            logger.severe("❌ Error enviando solicitud de login: " + e.getMessage());
            e.printStackTrace();
            
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("success", false);
            errorResponse.put("error", "Error enviando solicitud al servidor");
            callback.accept(errorResponse);
        }
    }
    
    // Métodos de gestión de sesiones
    public void createSession(Player player, String username) {
        activeSessions.put(player.getUniqueId(), username);
        logger.info("✅ Sesión creada para: " + player.getName() + " (" + username + ")");
    }
    
    public void endSession(Player player) {
        activeSessions.remove(player.getUniqueId());
        logger.info("👋 Sesión finalizada para: " + player.getName());
    }
    
    public boolean isUserLoggedIn(Player player) {
        return activeSessions.containsKey(player.getUniqueId());
    }
    
    public String getActiveSessionUsername(Player player) {
        return activeSessions.get(player.getUniqueId());
    }
    
    // Validar formato de código (7 caracteres alfanuméricos)
    public boolean isValidCodeFormat(String code) {
        return code != null && code.matches("^[A-Za-z0-9]{7}$");
    }
}