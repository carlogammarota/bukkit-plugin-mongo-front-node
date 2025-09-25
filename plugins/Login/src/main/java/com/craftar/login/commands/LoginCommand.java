package com.craftar.login.commands;

import com.craftar.login.LoginPlugin;
import org.bukkit.ChatColor;
import org.bukkit.GameMode;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;
import org.json.JSONObject;

public class LoginCommand implements CommandExecutor {
    
    private final LoginPlugin plugin;
    
    public LoginCommand(LoginPlugin plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(ChatColor.RED + "Este comando solo puede ser usado por jugadores.");
            return true;
        }
        
        Player player = (Player) sender;
        
        // Verificar si ya está logueado
        if (plugin.getWebAPI().isUserLoggedIn(player)) {
            player.sendMessage(ChatColor.YELLOW + "ℹ️ Ya estás logueado!");
            player.sendMessage(ChatColor.GRAY + "💡 Usa " + ChatColor.WHITE + "/logout" + ChatColor.GRAY + " para cerrar sesión.");
            return true;
        }
        
        // Verificar argumentos
        if (args.length != 1) {
            player.sendMessage(ChatColor.RED + "❌ Formato incorrecto!");
            player.sendMessage(ChatColor.YELLOW + "📝 Uso: " + ChatColor.WHITE + "/login <código>");
            player.sendMessage(ChatColor.GRAY + "💡 Ejemplo: " + ChatColor.WHITE + "/login A1B2C3D");
            player.sendMessage(ChatColor.GREEN + "ℹ️ Genera tu código en: " + ChatColor.WHITE + "https://craftar.com/dashboard");
            player.sendMessage(ChatColor.AQUA + "🔑 El código tiene 7 caracteres alfanuméricos");
            return true;
        }
        
        String accessCode = args[0].toUpperCase(); // Convertir a mayúsculas
        
        // Validar formato del código
        if (!plugin.getWebAPI().isValidCodeFormat(accessCode)) {
            player.sendMessage(ChatColor.RED + "❌ Código inválido!");
            player.sendMessage(ChatColor.YELLOW + "📝 El código debe tener exactamente 7 caracteres alfanuméricos");
            player.sendMessage(ChatColor.GRAY + "💡 Ejemplo: " + ChatColor.WHITE + "/login A1B2C3D");
            return true;
        }
        
        // Mostrar mensaje de carga
        player.sendMessage(ChatColor.YELLOW + "🔄 Verificando código...");
        
        // Intentar autenticar usuario
        plugin.getWebAPI().authenticateWithCode(accessCode, player.getName(), response -> {
            new BukkitRunnable() {
                @Override
                public void run() {
                    if (response.getBoolean("success")) {
                        // Login exitoso
                        String username = response.getJSONObject("user").getString("username");
                        int balance = response.getJSONObject("user").getInt("balance");
                        
                        // Crear sesión
                        plugin.getWebAPI().createSession(player, username);
                        
                        // Restaurar habilidades del jugador
                        player.setInvulnerable(false);
                        player.setGameMode(GameMode.SURVIVAL);
                        player.setFlying(false);
                        player.setAllowFlight(false);
                        
                        // Enviar mensajes de éxito
                        player.sendMessage(ChatColor.GREEN + "✅ ¡Login exitoso!");
                        player.sendMessage(ChatColor.GREEN + "👋 Bienvenido: " + ChatColor.WHITE + username);
                        player.sendMessage(ChatColor.GOLD + "💰 Monedas: " + ChatColor.WHITE + balance);
                        
                        // Mostrar advertencia si existe (conflicto de nombres)
                        if (response.has("warning") && !response.isNull("warning")) {
                            String warning = response.getString("warning");
                            player.sendMessage("");
                            player.sendMessage(ChatColor.YELLOW + "⚠️ " + ChatColor.BOLD + "CONFLICTO RESUELTO");
                            player.sendMessage(ChatColor.YELLOW + "📝 " + warning);
                            player.sendMessage(ChatColor.GRAY + "💡 Tu progreso se mantiene vinculado a tu cuenta web.");
                        }
                        
                        // Mensaje de bienvenida
                        player.sendMessage("");
                        player.sendMessage(ChatColor.GOLD + "🎉 " + ChatColor.BOLD + "¡Bienvenido a CraftAR!");
                        player.sendMessage(ChatColor.AQUA + "🔑 Tu código actual: " + ChatColor.WHITE + accessCode + ChatColor.AQUA + " (válido por 5 minutos)");
                        player.sendMessage(ChatColor.YELLOW + "🛒 Tienda: " + ChatColor.WHITE + "https://craftar.com/shop");
                        player.sendMessage(ChatColor.GRAY + "💡 Comando: " + ChatColor.WHITE + "/logout" + ChatColor.GRAY + " para cerrar sesión");
                        
                    } else {
                        // Login fallido
                        String error = response.getString("error");
                        player.sendMessage(ChatColor.RED + "❌ Error al iniciar sesión.");
                        player.sendMessage(ChatColor.RED + "⚠️ " + error);
                        player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en: " + ChatColor.WHITE + "https://craftar.com/dashboard");
                        player.sendMessage(ChatColor.GRAY + "💡 Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.GRAY + " con tu código de 7 caracteres");
                    }
                }
            }.runTask(plugin);
        });
        
        return true;
    }
}
