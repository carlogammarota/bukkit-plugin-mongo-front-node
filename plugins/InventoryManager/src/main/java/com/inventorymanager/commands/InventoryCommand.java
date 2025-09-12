package com.inventorymanager.commands;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class InventoryCommand implements CommandExecutor {
    
    private final InventoryManagerPlugin plugin;
    
    public InventoryCommand(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.hasPermission("inventorymanager.admin")) {
            sender.sendMessage("No tienes permisos para usar este comando.");
            return true;
        }
        
        if (args.length == 0) {
            sender.sendMessage("Uso: /inventory <reload|save|load>");
            return true;
        }
        
        switch (args[0].toLowerCase()) {
            case "reload":
                sender.sendMessage("Recargando plugin...");
                plugin.getServer().getPluginManager().disablePlugin(plugin);
                plugin.getServer().getPluginManager().enablePlugin(plugin);
                sender.sendMessage("Plugin recargado correctamente!");
                break;
                
            case "save":
                if (sender instanceof Player) {
                    plugin.getMongoDBManager().savePlayerInventory((Player) sender);
                    sender.sendMessage("Tu inventario ha sido guardado!");
                } else {
                    plugin.getMongoDBManager().saveAllInventories();
                    sender.sendMessage("Todos los inventarios han sido guardados!");
                }
                break;
                
            case "load":
                if (sender instanceof Player) {
                    plugin.getMongoDBManager().loadPlayerInventory((Player) sender);
                    sender.sendMessage("Tu inventario ha sido cargado!");
                } else {
                    sender.sendMessage("Este comando solo puede ser usado por jugadores.");
                }
                break;
                
            default:
                sender.sendMessage("Comando no reconocido. Usa: /inventory <reload|save|load>");
                break;
        }
        
        return true;
    }
}
