package com.craftar.login;

import com.craftar.login.commands.LoginCommand;
import com.craftar.login.commands.LogoutCommand;
import com.craftar.login.commands.MyCodeCommand;
import com.craftar.login.listeners.PlayerJoinListener;
import com.craftar.login.listeners.PlayerRestrictionListener;
import com.craftar.login.api.WebAPI;
import org.bukkit.plugin.java.JavaPlugin;

public class LoginPlugin extends JavaPlugin {
    
    private static LoginPlugin instance;
    private WebAPI webAPI;
    
    @Override
    public void onEnable() {
        instance = this;
        
        // Inicializar conexión Web API
        webAPI = new WebAPI();
        if (!webAPI.connect()) {
            getLogger().severe("❌ No se pudo conectar al servidor web. El plugin se deshabilitará.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }
        
        // Registrar comandos
        registerCommands();
        
        // Registrar listeners
        registerListeners();
        
        getLogger().info("✅ Login plugin v2.0 habilitado correctamente!");
        getLogger().info("🔗 Conectado al servidor web: http://127.0.0.1:3004");
        getLogger().info("🔑 Sistema de códigos de 7 caracteres activado");
    }
    
    @Override
    public void onDisable() {
        if (webAPI != null) {
            webAPI.disconnect();
        }
        getLogger().info("🔌 Login plugin deshabilitado.");
    }
    
    private void registerCommands() {
        getCommand("login").setExecutor(new LoginCommand(this));
        getCommand("logout").setExecutor(new LogoutCommand(this));
        getCommand("mycode").setExecutor(new MyCodeCommand(this));
    }
    
    private void registerListeners() {
        getServer().getPluginManager().registerEvents(new PlayerJoinListener(this), this);
        getServer().getPluginManager().registerEvents(new PlayerRestrictionListener(this), this);
    }
    
    public WebAPI getWebAPI() {
        return webAPI;
    }
    
    public static LoginPlugin getInstance() {
        return instance;
    }
}