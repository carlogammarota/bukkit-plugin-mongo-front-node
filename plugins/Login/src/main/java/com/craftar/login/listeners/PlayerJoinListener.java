package com.craftar.login.listeners;

import com.craftar.login.LoginPlugin;
import org.bukkit.ChatColor;
import org.bukkit.GameMode;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public class PlayerJoinListener implements Listener {
    
    private final LoginPlugin plugin;
    
    public PlayerJoinListener(LoginPlugin plugin) {
        this.plugin = plugin;
    }
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        
        // Esperar un momento para que el jugador se conecte completamente
        plugin.getServer().getScheduler().runTaskLater(plugin, () -> {
            // Verificar si tiene una sesión existente
            if (plugin.getWebAPI().isUserLoggedIn(player)) {
                // Jugador ya está logueado
                String username = plugin.getWebAPI().getActiveSessionUsername(player);
                player.setInvulnerable(false);
                player.sendMessage(ChatColor.GREEN + "✅ ¡Bienvenido de vuelta, " + ChatColor.WHITE + username + ChatColor.GREEN + "!");
                player.sendMessage(ChatColor.GRAY + "💡 Tu sesión sigue activa. Usa " + ChatColor.WHITE + "/logout" + ChatColor.GRAY + " para cerrar sesión.");
            } else {
                // Jugador no está logueado - restringir habilidades
                player.setInvulnerable(true);
                player.setGameMode(GameMode.ADVENTURE);
                player.setFlying(false);
                player.setAllowFlight(false);
                
                player.sendMessage(ChatColor.GOLD + "🎉 ¡Bienvenido a CraftAR!");
                player.sendMessage(ChatColor.YELLOW + "📝 Para acceder a todas las funciones:");
                player.sendMessage(ChatColor.GREEN + "💡 Regístrate en " + ChatColor.WHITE + "https://craftar.com/register");
                player.sendMessage(ChatColor.BLUE + "🔑 Genera un código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
                player.sendMessage(ChatColor.BLUE + "🔑 Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.BLUE + " (7 caracteres)");
                player.sendMessage(ChatColor.GRAY + "🛒 Con tu cuenta podrás acceder a la tienda web");
                player.sendMessage(ChatColor.RED + "🔒 Estás bloqueado hasta que te registres o inicies sesión");
            }
            
            // Enviar información del servidor
            player.sendMessage("");
            player.sendMessage(ChatColor.DARK_AQUA + "🌐 Web: " + ChatColor.WHITE + "https://craftar.com");
            player.sendMessage(ChatColor.DARK_AQUA + "💬 Discord: " + ChatColor.WHITE + "https://discord.gg/craftar");
            
        }, 20L); // 1 segundo de delay
    }
}