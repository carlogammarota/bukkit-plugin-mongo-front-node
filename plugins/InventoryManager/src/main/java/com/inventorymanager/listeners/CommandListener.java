package com.inventorymanager.listeners;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.server.ServerCommandEvent;

public class CommandListener implements Listener {
    
    private final InventoryManagerPlugin plugin;
    
    public CommandListener(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler
    public void onServerCommand(ServerCommandEvent event) {
        String command = event.getCommand();
        
        // Interceptar comandos de agregar items desde la web
        if (command.startsWith("giveitem ")) {
            event.setCancelled(true);
            
            String[] args = command.split(" ");
            if (args.length >= 4) {
                String playerName = args[1];
                String itemName = args[2];
                int amount;
                
                try {
                    amount = Integer.parseInt(args[3]);
                } catch (NumberFormatException e) {
                    event.getSender().sendMessage("§c[InventoryManager] Cantidad inválida: " + args[3]);
                    return;
                }
                
                Player targetPlayer = Bukkit.getPlayer(playerName);
                if (targetPlayer != null && targetPlayer.isOnline()) {
                    boolean success = plugin.getMongoDBManager().addItemToPlayer(
                        targetPlayer.getUniqueId().toString(), 
                        itemName, 
                        amount
                    );
                    
                    if (success) {
                        event.getSender().sendMessage("§a[InventoryManager] Item agregado exitosamente a " + playerName);
                        Bukkit.broadcastMessage("§6[InventoryManager] " + playerName + " recibió " + amount + " " + itemName.replace("_", " ").toLowerCase());
                    } else {
                        event.getSender().sendMessage("§c[InventoryManager] Error al agregar item a " + playerName);
                    }
                } else {
                    event.getSender().sendMessage("§c[InventoryManager] Jugador " + playerName + " no está conectado.");
                }
            } else {
                event.getSender().sendMessage("§c[InventoryManager] Uso: giveitem <jugador> <item> <cantidad>");
            }
        }
    }
}
