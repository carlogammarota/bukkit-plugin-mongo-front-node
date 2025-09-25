package com.craftar.login.listeners;

import com.craftar.login.LoginPlugin;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.block.*;
import org.bukkit.event.entity.*;
import org.bukkit.event.inventory.*;
import org.bukkit.event.player.*;

public class PlayerRestrictionListener implements Listener {
    
    private final LoginPlugin plugin;
    
    public PlayerRestrictionListener(LoginPlugin plugin) {
        this.plugin = plugin;
    }
    
    // Bloquear movimiento
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerMove(PlayerMoveEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
        }
    }
    
    // Bloquear interacciones
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerInteract(PlayerInteractEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
            player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para interactuar!");
            player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
            player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
        }
    }
    
    // Bloquear romper bloques
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onBlockBreak(BlockBreakEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
            player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para romper bloques!");
            player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
            player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
        }
    }
    
    // Bloquear colocar bloques
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onBlockPlace(BlockPlaceEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
            player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para colocar bloques!");
            player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
            player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
        }
    }
    
    // Bloquear daño recibido
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onEntityDamage(EntityDamageEvent event) {
        if (event.getEntity() instanceof Player) {
            Player player = (Player) event.getEntity();
            
            if (!plugin.getWebAPI().isUserLoggedIn(player)) {
                event.setCancelled(true);
            }
        }
    }
    
    // Bloquear daño causado
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onEntityDamageByEntity(EntityDamageByEntityEvent event) {
        if (event.getDamager() instanceof Player) {
            Player player = (Player) event.getDamager();
            
            if (!plugin.getWebAPI().isUserLoggedIn(player)) {
                event.setCancelled(true);
                player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para atacar!");
                player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
                player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
            }
        }
    }
    
    // Bloquear abrir inventarios
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onInventoryOpen(InventoryOpenEvent event) {
        if (event.getPlayer() instanceof Player) {
            Player player = (Player) event.getPlayer();
            
            if (!plugin.getWebAPI().isUserLoggedIn(player)) {
                event.setCancelled(true);
                player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para abrir inventarios!");
                player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
                player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
            }
        }
    }
    
    // Bloquear usar items
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerItemConsume(PlayerItemConsumeEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
            player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para usar items!");
            player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
            player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
        }
    }
    
    // Bloquear lanzar items
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerDropItem(PlayerDropItemEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
            player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para lanzar items!");
            player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
            player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
        }
    }
    
    // Bloquear recoger items
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerPickupItem(PlayerPickupItemEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            event.setCancelled(true);
        }
    }
    
    // Bloquear chat (excepto comandos de autenticación)
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            String message = event.getMessage().toLowerCase();
            
            // Permitir solo comandos de autenticación
            if (!message.startsWith("/login") && !message.startsWith("/logout") && !message.startsWith("/mycode")) {
                event.setCancelled(true);
                player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para usar el chat!");
                player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
                player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
            }
        }
    }
    
    // Bloquear comandos (excepto comandos de autenticación)
    @EventHandler(priority = EventPriority.HIGHEST)
    public void onPlayerCommandPreprocess(PlayerCommandPreprocessEvent event) {
        Player player = event.getPlayer();
        
        if (!plugin.getWebAPI().isUserLoggedIn(player)) {
            String command = event.getMessage().toLowerCase();
            
            // Permitir solo comandos de autenticación
            if (!command.startsWith("/login") && !command.startsWith("/logout") && !command.startsWith("/mycode")) {
                event.setCancelled(true);
                player.sendMessage(ChatColor.RED + "🔒 Debes iniciar sesión para usar comandos!");
                player.sendMessage(ChatColor.YELLOW + "Usa " + ChatColor.WHITE + "/login <código>" + ChatColor.YELLOW + " para iniciar sesión");
                player.sendMessage(ChatColor.GRAY + "💡 Genera tu código en " + ChatColor.WHITE + "https://craftar.com/dashboard");
            }
        }
    }
}