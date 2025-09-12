package com.inventorymanager.listeners;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;

public class PlayerQuitListener implements Listener {
    
    private final InventoryManagerPlugin plugin;
    
    public PlayerQuitListener(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        Player player = event.getPlayer();
        
        // Guardar inventario del jugador antes de que se vaya
        plugin.getMongoDBManager().savePlayerInventory(player);
        plugin.getMongoDBManager().savePlayerData(player);
    }
}
