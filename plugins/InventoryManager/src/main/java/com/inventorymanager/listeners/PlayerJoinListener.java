package com.inventorymanager.listeners;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public class PlayerJoinListener implements Listener {
    
    private final InventoryManagerPlugin plugin;
    
    public PlayerJoinListener(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        
        // Guardar datos del jugador
        plugin.getMongoDBManager().savePlayerData(player);
        
        // Cargar inventario del jugador
        plugin.getMongoDBManager().loadPlayerInventory(player);
        
        player.sendMessage("¡Bienvenido! Tu inventario ha sido cargado desde la base de datos.");
    }
}
