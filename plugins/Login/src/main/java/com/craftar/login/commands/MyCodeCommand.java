package com.craftar.login.commands;

import com.craftar.login.LoginPlugin;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class MyCodeCommand implements CommandExecutor {
    
    private final LoginPlugin plugin;
    
    public MyCodeCommand(LoginPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(ChatColor.RED + "Este comando solo puede ser usado por jugadores.");
            return true;
        }
        
        Player player = (Player) sender;
        
        // Verificar si está logueado
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            player.sendMessage(ChatColor.RED + "❌ No estás logueado.");
            player.sendMessage(ChatColor.YELLOW + "💡 Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
            return true;
        }
        
        // Obtener información de la sesión
        String username = plugin.getWebAPI().getActiveSessionUsername(player);
        
        if (username != null) {
            player.sendMessage(ChatColor.GREEN + "✅ Estás logueado como: " + ChatColor.WHITE + username);
            player.sendMessage("");
            player.sendMessage(ChatColor.AQUA + "🔑 Tu código de acceso permanente:");
            player.sendMessage(ChatColor.YELLOW + "📱 Ve al dashboard web para ver tu código:");
            player.sendMessage(ChatColor.WHITE + "https://craftar.com/dashboard");
            player.sendMessage("");
            player.sendMessage(ChatColor.GRAY + "💡 El código es de 7 caracteres alfanuméricos");
            player.sendMessage(ChatColor.GRAY + "💡 Es permanente y lo necesitarás cada vez que entres");
            player.sendMessage(ChatColor.GRAY + "💡 Guárdalo en un lugar seguro");
        } else {
            player.sendMessage(ChatColor.RED + "❌ No se pudo obtener la información de tu sesión.");
        }
        
        return true;
    }
}