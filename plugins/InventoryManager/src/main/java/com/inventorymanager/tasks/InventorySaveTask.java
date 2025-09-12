package com.inventorymanager.tasks;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;

public class InventorySaveTask extends BukkitRunnable {
    
    private final InventoryManagerPlugin plugin;
    
    public InventorySaveTask(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public void run() {
        int playerCount = Bukkit.getOnlinePlayers().size();
        
        if (playerCount > 0) {
            // Guardar inventarios de todos los jugadores conectados cada minuto
            for (Player player : Bukkit.getOnlinePlayers()) {
                plugin.getMongoDBManager().savePlayerInventory(player);
            }
            
            // Notificar a todos los jugadores
            Bukkit.broadcastMessage("§6[InventoryManager] Inventarios guardados automáticamente para " + playerCount + " jugadores.");
            
            plugin.getLogger().info("Inventarios guardados automáticamente para " + playerCount + " jugadores.");
        } else {
            plugin.getLogger().info("No hay jugadores conectados para guardar inventarios.");
        }
    }
}
