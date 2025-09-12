package com.inventorymanager.tasks;

import com.inventorymanager.InventoryManagerPlugin;
import org.bukkit.Bukkit;
import org.bukkit.scheduler.BukkitRunnable;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class CommandMonitorTask extends BukkitRunnable {
    
    private final InventoryManagerPlugin plugin;
    private final File commandFile;
    private final File responseFile;
    private long lastModified = 0;
    
    public CommandMonitorTask(InventoryManagerPlugin plugin) {
        this.plugin = plugin;
        this.commandFile = new File(plugin.getDataFolder().getParentFile().getParentFile(), "commands.txt");
        this.responseFile = new File(plugin.getDataFolder().getParentFile().getParentFile(), "responses.txt");
        
        // Crear archivos si no existen
        try {
            if (!commandFile.exists()) {
                commandFile.createNewFile();
            }
            if (!responseFile.exists()) {
                responseFile.createNewFile();
            }
        } catch (IOException e) {
            plugin.getLogger().severe("Error al crear archivos de comandos: " + e.getMessage());
        }
    }
    
    @Override
    public void run() {
        try {
            if (commandFile.exists() && commandFile.lastModified() > lastModified) {
                lastModified = commandFile.lastModified();
                
                // Leer comando del archivo
                String command = new String(Files.readAllBytes(Paths.get(commandFile.getAbsolutePath()))).trim();
                
                if (!command.isEmpty()) {
                    plugin.getLogger().info("Comando recibido desde web: " + command);
                    
                    // Ejecutar comando
                    boolean success = Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
                    
                    // Escribir respuesta
                    String response = success ? "Comando ejecutado exitosamente" : "Error al ejecutar comando";
                    Files.write(Paths.get(responseFile.getAbsolutePath()), response.getBytes());
                    
                    // Limpiar archivo de comando
                    Files.write(Paths.get(commandFile.getAbsolutePath()), "".getBytes());
                    
                    plugin.getLogger().info("Respuesta enviada: " + response);
                }
            }
        } catch (IOException e) {
            plugin.getLogger().severe("Error al procesar comando: " + e.getMessage());
        }
    }
}