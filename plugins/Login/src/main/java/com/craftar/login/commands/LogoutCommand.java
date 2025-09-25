package com.craftar.login.commands;

import com.craftar.login.LoginPlugin;
import org.bukkit.ChatColor;
import org.bukkit.GameMode;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class LogoutCommand implements CommandExecutor {
    
    private final LoginPlugin plugin;
    
    public LogoutCommand(LoginPlugin plugin) {
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
        
        // Finalizar sesión
        plugin.getWebAPI().endSession(player);
        
        // Restringir habilidades del jugador
        player.setInvulnerable(true);
        player.setGameMode(GameMode.ADVENTURE);
        player.setFlying(false);
        player.setAllowFlight(false);
        
        // Enviar mensajes de logout
        player.sendMessage(ChatColor.YELLOW + "👋 ¡Sesión cerrada!");
        player.sendMessage(ChatColor.GRAY + "💡 Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.GRAY + " para iniciar sesión nuevamente");
        player.sendMessage(ChatColor.GRAY + "🌐 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
        
        return true;
    }
}