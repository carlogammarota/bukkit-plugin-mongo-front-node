package com.inventorymanager.database;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import org.bson.Document;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class MongoDBManager {
    
    private MongoClient mongoClient;
    private MongoDatabase database;
    private MongoCollection<Document> playersCollection;
    private MongoCollection<Document> inventoriesCollection;
    private MongoCollection<Document> pendingItemsCollection;
    private Gson gson;
    
    private static final String CONNECTION_STRING = "mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/minecraft";
    
    public MongoDBManager() {
        this.gson = new Gson();
    }
    
    public boolean connect() {
        try {
            mongoClient = MongoClients.create(CONNECTION_STRING);
            database = mongoClient.getDatabase("pico-ia");
            playersCollection = database.getCollection("players");
            inventoriesCollection = database.getCollection("inventories");
            pendingItemsCollection = database.getCollection("pending_items");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public void disconnect() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
    
    public void savePlayerData(Player player) {
        try {
            Document playerDoc = new Document("uuid", player.getUniqueId().toString())
                    .append("name", player.getName())
                    .append("lastSeen", System.currentTimeMillis());
            
            playersCollection.replaceOne(
                Filters.eq("uuid", player.getUniqueId().toString()),
                playerDoc,
                new ReplaceOptions().upsert(true)
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void savePlayerInventory(Player player) {
        try {
            JsonArray inventoryJson = new JsonArray();
            ItemStack[] contents = player.getInventory().getContents();
            
            int itemsSaved = 0;
            
            for (int i = 0; i < contents.length; i++) {
                ItemStack item = contents[i];
                if (item != null && item.getType() != Material.AIR) {
                    JsonObject itemJson = new JsonObject();
                    itemJson.addProperty("slot", i);
                    itemJson.addProperty("material", item.getType().name());
                    itemJson.addProperty("amount", item.getAmount());
                    itemJson.addProperty("durability", item.getDurability());
                    
                    // Guardar encantamientos si los hay
                    if (item.hasItemMeta() && item.getItemMeta().hasEnchants()) {
                        JsonObject enchants = new JsonObject();
                        item.getItemMeta().getEnchants().forEach((enchant, level) -> {
                            enchants.addProperty(enchant.getName(), level);
                        });
                        itemJson.add("enchants", enchants);
                    }
                    
                    inventoryJson.add(itemJson);
                    itemsSaved++;
                }
            }
            
            Document inventoryDoc = new Document("uuid", player.getUniqueId().toString())
                    .append("name", player.getName())
                    .append("inventory", inventoryJson.toString())
                    .append("lastSaved", System.currentTimeMillis());
            
            inventoriesCollection.replaceOne(
                Filters.eq("uuid", player.getUniqueId().toString()),
                inventoryDoc,
                new ReplaceOptions().upsert(true)
            );
            
            // Notificar al jugador
            player.sendMessage("§a[InventoryManager] Inventario guardado (" + itemsSaved + " items) en la base de datos.");
            
        } catch (Exception e) {
            e.printStackTrace();
            player.sendMessage("§c[InventoryManager] Error al guardar inventario en la base de datos.");
        }
    }
    
    public void loadPlayerInventory(Player player) {
        try {
            Document inventoryDoc = inventoriesCollection.find(
                Filters.eq("uuid", player.getUniqueId().toString())
            ).first();
            
            if (inventoryDoc != null) {
                String inventoryJson = inventoryDoc.getString("inventory");
                JsonArray inventoryArray = gson.fromJson(inventoryJson, JsonArray.class);
                
                // Limpiar inventario actual
                player.getInventory().clear();
                
                int itemsLoaded = 0;
                
                // Cargar items
                for (int i = 0; i < inventoryArray.size(); i++) {
                    JsonObject itemJson = inventoryArray.get(i).getAsJsonObject();
                    int slot = itemJson.get("slot").getAsInt();
                    String materialName = itemJson.get("material").getAsString();
                    int amount = itemJson.get("amount").getAsInt();
                    
                    try {
                        Material material = Material.valueOf(materialName);
                        ItemStack item = new ItemStack(material, amount);
                        
                        // Aplicar encantamientos si los hay
                        if (itemJson.has("enchants")) {
                            JsonObject enchants = itemJson.getAsJsonObject("enchants");
                            enchants.entrySet().forEach(entry -> {
                                try {
                                    org.bukkit.enchantments.Enchantment enchant = 
                                        org.bukkit.enchantments.Enchantment.getByName(entry.getKey());
                                    if (enchant != null) {
                                        item.addUnsafeEnchantment(enchant, entry.getValue().getAsInt());
                                    }
                                } catch (Exception e) {
                                    // Ignorar encantamientos inválidos
                                }
                            });
                        }
                        
                        player.getInventory().setItem(slot, item);
                        itemsLoaded++;
                    } catch (Exception e) {
                        // Ignorar items inválidos
                    }
                }
                
                if (itemsLoaded > 0) {
                    player.sendMessage("§a[InventoryManager] Se cargaron " + itemsLoaded + " items desde la base de datos.");
                } else {
                    player.sendMessage("§e[InventoryManager] No se encontraron items guardados.");
                }
            } else {
                player.sendMessage("§e[InventoryManager] No se encontró inventario guardado. Se creará uno nuevo.");
            }
            
            // Procesar items pendientes después de cargar el inventario
            processPendingItems(player);
        } catch (Exception e) {
            e.printStackTrace();
            player.sendMessage("§c[InventoryManager] Error al cargar inventario desde la base de datos.");
        }
    }
    
    public void saveAllInventories() {
        for (Player player : Bukkit.getOnlinePlayers()) {
            savePlayerInventory(player);
        }
    }
    
    public List<Map<String, Object>> getAllPlayers() {
        List<Map<String, Object>> players = new ArrayList<>();
        try {
            for (Document doc : playersCollection.find()) {
                Map<String, Object> playerData = new HashMap<>();
                playerData.put("uuid", doc.getString("uuid"));
                playerData.put("name", doc.getString("name"));
                playerData.put("lastSeen", doc.getLong("lastSeen"));
                players.add(playerData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return players;
    }
    
    public Map<String, Object> getPlayerInventory(String uuid) {
        try {
            Document inventoryDoc = inventoriesCollection.find(
                Filters.eq("uuid", uuid)
            ).first();
            
            if (inventoryDoc != null) {
                Map<String, Object> inventoryData = new HashMap<>();
                inventoryData.put("uuid", inventoryDoc.getString("uuid"));
                inventoryData.put("name", inventoryDoc.getString("name"));
                inventoryData.put("inventory", inventoryDoc.getString("inventory"));
                inventoryData.put("lastSaved", inventoryDoc.getLong("lastSaved"));
                return inventoryData;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public boolean addItemToPlayer(String uuid, String materialName, int amount) {
        try {
            Player player = Bukkit.getPlayer(UUID.fromString(uuid));
            if (player != null && player.isOnline()) {
                // Jugador online - agregar directamente al inventario
                Material material = Material.valueOf(materialName);
                ItemStack item = new ItemStack(material, amount);
                
                // Intentar agregar el item
                java.util.HashMap<Integer, ItemStack> notAdded = player.getInventory().addItem(item);
                
                if (notAdded.isEmpty()) {
                    player.sendMessage("§a[InventoryManager] Se agregó " + amount + " " + materialName.replace("_", " ").toLowerCase() + " a tu inventario!");
                    return true;
                } else {
                    player.sendMessage("§e[InventoryManager] Se agregó parcialmente " + amount + " " + materialName.replace("_", " ").toLowerCase() + " (inventario lleno)");
                    return true;
                }
            } else {
                // Jugador offline - guardar como item pendiente
                return addPendingItem(uuid, materialName, amount);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Bukkit.getLogger().severe("[InventoryManager] Error al agregar item: " + e.getMessage());
            return false;
        }
    }
    
    private boolean addPendingItem(String uuid, String materialName, int amount) {
        try {
            // Buscar si ya existe un documento de items pendientes para este jugador
            Document existingDoc = pendingItemsCollection.find(
                Filters.eq("uuid", uuid)
            ).first();
            
            if (existingDoc != null) {
                // Actualizar documento existente
                JsonArray pendingItems = gson.fromJson(existingDoc.getString("items"), JsonArray.class);
                
                // Buscar si ya existe este material en los items pendientes
                boolean found = false;
                for (int i = 0; i < pendingItems.size(); i++) {
                    JsonObject item = pendingItems.get(i).getAsJsonObject();
                    if (item.get("material").getAsString().equals(materialName)) {
                        // Sumar la cantidad
                        int currentAmount = item.get("amount").getAsInt();
                        item.addProperty("amount", currentAmount + amount);
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    // Agregar nuevo item
                    JsonObject newItem = new JsonObject();
                    newItem.addProperty("material", materialName);
                    newItem.addProperty("amount", amount);
                    pendingItems.add(newItem);
                }
                
                // Actualizar en la base de datos
                Document updatedDoc = new Document("uuid", uuid)
                        .append("items", pendingItems.toString())
                        .append("lastUpdated", System.currentTimeMillis());
                
                pendingItemsCollection.replaceOne(
                    Filters.eq("uuid", uuid),
                    updatedDoc,
                    new ReplaceOptions().upsert(true)
                );
            } else {
                // Crear nuevo documento
                JsonArray pendingItems = new JsonArray();
                JsonObject item = new JsonObject();
                item.addProperty("material", materialName);
                item.addProperty("amount", amount);
                pendingItems.add(item);
                
                Document newDoc = new Document("uuid", uuid)
                        .append("items", pendingItems.toString())
                        .append("lastUpdated", System.currentTimeMillis());
                
                pendingItemsCollection.insertOne(newDoc);
            }
            
            Bukkit.getLogger().info("[InventoryManager] Item pendiente agregado para UUID " + uuid + ": " + amount + " " + materialName);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            Bukkit.getLogger().severe("[InventoryManager] Error al agregar item pendiente: " + e.getMessage());
            return false;
        }
    }
    
    private void processPendingItems(Player player) {
        try {
            Document pendingDoc = pendingItemsCollection.find(
                Filters.eq("uuid", player.getUniqueId().toString())
            ).first();
            
            if (pendingDoc != null) {
                String itemsJson = pendingDoc.getString("items");
                JsonArray pendingItems = gson.fromJson(itemsJson, JsonArray.class);
                
                int itemsProcessed = 0;
                boolean hasRemainingItems = false;
                
                for (int i = 0; i < pendingItems.size(); i++) {
                    JsonObject itemJson = pendingItems.get(i).getAsJsonObject();
                    String materialName = itemJson.get("material").getAsString();
                    int amount = itemJson.get("amount").getAsInt();
                    
                    // Solo procesar si hay cantidad pendiente
                    if (amount > 0) {
                        try {
                            Material material = Material.valueOf(materialName);
                            ItemStack item = new ItemStack(material, amount);
                            
                            // Intentar agregar el item
                            java.util.HashMap<Integer, ItemStack> notAdded = player.getInventory().addItem(item);
                            
                            if (notAdded.isEmpty()) {
                                // Item agregado completamente - marcar como procesado
                                itemsProcessed += amount;
                                itemJson.addProperty("amount", 0); // Marcar como procesado
                            } else {
                                // Si no se pudo agregar todo, mantener el resto como pendiente
                                int remainingAmount = notAdded.values().iterator().next().getAmount();
                                int processedAmount = amount - remainingAmount;
                                itemsProcessed += processedAmount;
                                itemJson.addProperty("amount", remainingAmount);
                                hasRemainingItems = true;
                            }
                        } catch (Exception e) {
                            // Ignorar items inválidos
                            itemJson.addProperty("amount", 0); // Marcar como procesado para evitar reintentos
                        }
                    }
                }
                
                if (itemsProcessed > 0) {
                    player.sendMessage("§a[InventoryManager] Se procesaron " + itemsProcessed + " items pendientes!");
                }
                
                // Eliminar el documento de items pendientes si se procesaron todos
                if (!hasRemainingItems) {
                    pendingItemsCollection.deleteOne(Filters.eq("uuid", player.getUniqueId().toString()));
                    player.sendMessage("§a[InventoryManager] Todos los items pendientes han sido entregados.");
                } else {
                    // Actualizar con los items restantes
                    Document updatedDoc = new Document("uuid", player.getUniqueId().toString())
                            .append("items", pendingItems.toString())
                            .append("lastUpdated", System.currentTimeMillis());
                    
                    pendingItemsCollection.replaceOne(
                        Filters.eq("uuid", player.getUniqueId().toString()),
                        updatedDoc,
                        new ReplaceOptions().upsert(true)
                    );
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            player.sendMessage("§c[InventoryManager] Error al procesar items pendientes.");
        }
    }
}
