package com.inventorymanager;

import com.inventorymanager.database.MongoDBManager;
import com.inventorymanager.listeners.PlayerJoinListener;
import com.inventorymanager.listeners.PlayerQuitListener;
import com.inventorymanager.listeners.CommandListener;
import com.inventorymanager.tasks.InventorySaveTask;
import com.inventorymanager.tasks.CommandMonitorTask;
import com.inventorymanager.commands.InventoryCommand;
import com.inventorymanager.commands.GiveItemCommand;
import org.bukkit.plugin.java.JavaPlugin;

public class InventoryManagerPlugin extends JavaPlugin {
    
    private MongoDBManager mongoDBManager;
    private InventorySaveTask saveTask;
    private CommandMonitorTask commandMonitorTask;
    
    @Override
    public void onEnable() {
        // Inicializar MongoDB
        mongoDBManager = new MongoDBManager();
        if (!mongoDBManager.connect()) {
            getLogger().severe("No se pudo conectar a MongoDB. El plugin se deshabilitará.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }
        
        // Registrar listeners
        getServer().getPluginManager().registerEvents(new PlayerJoinListener(this), this);
        getServer().getPluginManager().registerEvents(new PlayerQuitListener(this), this);
        getServer().getPluginManager().registerEvents(new CommandListener(this), this);
        
        // Registrar comandos
        getCommand("inventory").setExecutor(new InventoryCommand(this));
        getCommand("giveitem").setExecutor(new GiveItemCommand(this));
        
        // Iniciar tarea de guardado automático cada minuto
        saveTask = new InventorySaveTask(this);
        saveTask.runTaskTimer(this, 1200L, 1200L); // 1200 ticks = 1 minuto
        
        // Iniciar monitor de comandos desde web cada segundo
        commandMonitorTask = new CommandMonitorTask(this);
        commandMonitorTask.runTaskTimer(this, 20L, 20L); // 20 ticks = 1 segundo
        
        getLogger().info("InventoryManager habilitado correctamente!");
    }
    
    @Override
    public void onDisable() {
        // Cancelar tareas
        if (saveTask != null) {
            saveTask.cancel();
        }
        if (commandMonitorTask != null) {
            commandMonitorTask.cancel();
        }
        
        // Guardar todos los inventarios antes de cerrar
        if (mongoDBManager != null) {
            mongoDBManager.saveAllInventories();
            mongoDBManager.disconnect();
        }
        
        getLogger().info("InventoryManager deshabilitado!");
    }
    
    public MongoDBManager getMongoDBManager() {
        return mongoDBManager;
    }
}
