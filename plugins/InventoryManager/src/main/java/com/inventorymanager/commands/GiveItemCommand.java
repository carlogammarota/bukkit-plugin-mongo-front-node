package com.inventorymanager.commands;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;

public class GiveItemCommand implements CommandExecutor {
    
    private final InventoryManagerPlugin plugin;
    
    public GiveItemCommand(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length < 3) {
            sender.sendMessage("§cUso: /giveitem <jugador> <item> <cantidad>");
            return true;
        }
        
        String playerName = args[0];
        String itemName = args[1];
        int amount;
        
        try {
            amount = Integer.parseInt(args[2]);
        } catch (NumberFormatException e) {
            sender.sendMessage("§cCantidad inválida: " + args[2]);
            return true;
        }
        
        Player targetPlayer = Bukkit.getPlayer(playerName);
        boolean playerOnline = targetPlayer != null && targetPlayer.isOnline();
        
        if (!playerOnline) {
            sender.sendMessage("§eJugador " + playerName + " no está conectado. Se guardará en la base de datos para cuando se conecte.");
        }
        
        try {
            Material material = Material.valueOf(itemName.toUpperCase());
            ItemStack item = new ItemStack(material, amount);
            
            if (playerOnline) {
                // Jugador conectado - agregar directamente al inventario
                java.util.HashMap<Integer, ItemStack> notAdded = targetPlayer.getInventory().addItem(item);
                
                if (notAdded.isEmpty()) {
                    sender.sendMessage("§aSe agregó " + amount + " " + itemName.toLowerCase() + " a " + playerName);
                    targetPlayer.sendMessage("§a[InventoryManager] Se agregó " + amount + " " + itemName.toLowerCase() + " a tu inventario!");
                    
                    // Notificar a todos los jugadores
                    Bukkit.broadcastMessage("§6[InventoryManager] " + playerName + " recibió " + amount + " " + itemName.toLowerCase());
                } else {
                    sender.sendMessage("§eSe agregó parcialmente " + amount + " " + itemName.toLowerCase() + " a " + playerName + " (inventario lleno)");
                    targetPlayer.sendMessage("§e[InventoryManager] Se agregó parcialmente " + amount + " " + itemName.toLowerCase() + " (inventario lleno)");
                }
            } else {
                // Jugador desconectado - buscar UUID en la base de datos
                java.util.List<java.util.Map<String, Object>> players = plugin.getMongoDBManager().getAllPlayers();
                String playerUuid = null;
                
                for (java.util.Map<String, Object> playerData : players) {
                    if (playerData.get("name").equals(playerName)) {
                        playerUuid = (String) playerData.get("uuid");
                        break;
                    }
                }
                
                if (playerUuid != null) {
                    boolean success = plugin.getMongoDBManager().addItemToPlayer(playerUuid, itemName.toUpperCase(), amount);
                    
                    if (success) {
                        sender.sendMessage("§aItem guardado en la base de datos para " + playerName + " (" + amount + " " + itemName.toLowerCase() + ")");
                    } else {
                        sender.sendMessage("§cError al guardar item en la base de datos para " + playerName);
                    }
                } else {
                    sender.sendMessage("§cNo se encontró el UUID del jugador " + playerName + " en la base de datos");
                }
            }
            
        } catch (IllegalArgumentException e) {
            sender.sendMessage("§cItem inválido: " + itemName);
        }
        
        return true;
    }
}
