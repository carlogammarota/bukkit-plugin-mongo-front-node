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
                
                // Leer comandos del archivo
                String content = new String(Files.readAllBytes(Paths.get(commandFile.getAbsolutePath()))).trim();
                
                if (!content.isEmpty()) {
                    // Dividir por líneas y procesar cada comando
                    String[] commands = content.split("\n");
                    boolean allSuccess = true;
                    StringBuilder responses = new StringBuilder();
                    
                    for (String command : commands) {
                        command = command.trim();
                        if (!command.isEmpty()) {
                            plugin.getLogger().info("Comando recibido desde web: " + command);
                            
                            // Ejecutar comando
                            boolean success = Bukkit.dispatchCommand(Bukkit.getConsoleSender(), command);
                            
                            if (success) {
                                responses.append("Comando ejecutado exitosamente: ").append(command).append("\n");
                                plugin.getLogger().info("Comando ejecutado exitosamente: " + command);
                            } else {
                                responses.append("Error al ejecutar comando: ").append(command).append("\n");
                                plugin.getLogger().warning("Error al ejecutar comando: " + command);
                                allSuccess = false;
                            }
                        }
                    }
                    
                    // Escribir respuesta
                    String response = allSuccess ? "Todos los comandos ejecutados exitosamente" : "Algunos comandos fallaron";
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