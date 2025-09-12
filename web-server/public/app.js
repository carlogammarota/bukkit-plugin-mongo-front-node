// Variables globales
let socket;
let players = [];
let items = [];
let selectedPlayer = null;

// Elementos del DOM
const connectionStatus = document.getElementById('connection-status');
const connectionText = document.getElementById('connection-text');
const lastUpdate = document.getElementById('last-update');
const playerSelect = document.getElementById('player-select');
const selectedPlayerInfo = document.getElementById('selected-player-info');
const playerName = document.getElementById('player-name');
const playerUuid = document.getElementById('player-uuid');
const playerLastSeen = document.getElementById('player-last-seen');
const itemSelect = document.getElementById('item-select');
const itemAmount = document.getElementById('item-amount');
const itemForm = document.getElementById('item-form');
const inventorySection = document.getElementById('inventory-section');
const inventoryGrid = document.getElementById('inventory-grid');
const inventoryItems = document.getElementById('inventory-items');
const refreshInventoryBtn = document.getElementById('refresh-inventory');
const activityLog = document.getElementById('activity-log');
const loadingOverlay = document.getElementById('loading-overlay');
const messageContainer = document.getElementById('message-container');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeSocket();
    loadItems();
    loadPlayers();
    setupEventListeners();
});

// Configurar Socket.IO
function initializeSocket() {
    socket = io();
    
    socket.on('connect', () => {
        updateConnectionStatus(true);
        addActivityLog('Conectado al servidor', 'success');
    });
    
    socket.on('disconnect', () => {
        updateConnectionStatus(false);
        addActivityLog('Desconectado del servidor', 'error');
    });
    
    socket.on('players-update', (updatedPlayers) => {
        players = updatedPlayers;
        updatePlayerSelect();
        addActivityLog(`Jugadores actualizados: ${players.length}`, 'info');
    });
    
    socket.on('item-added', (data) => {
        addActivityLog(`Item agregado: ${data.amount} ${data.item} a ${data.uuid}`, 'success');
        if (selectedPlayer && selectedPlayer.uuid === data.uuid) {
            loadPlayerInventory(selectedPlayer.uuid);
        }
    });
    
    socket.on('error', (error) => {
        showMessage(error, 'error');
        addActivityLog(`Error: ${error}`, 'error');
    });
}

// Configurar event listeners
function setupEventListeners() {
    playerSelect.addEventListener('change', handlePlayerSelect);
    itemForm.addEventListener('submit', handleItemSubmit);
    refreshInventoryBtn.addEventListener('click', () => {
        if (selectedPlayer) {
            loadPlayerInventory(selectedPlayer.uuid);
        }
    });
}

// Cargar lista de items
async function loadItems() {
    try {
        const response = await fetch('/api/items');
        items = await response.json();
        updateItemSelect();
    } catch (error) {
        console.error('Error al cargar items:', error);
        showMessage('Error al cargar la lista de items', 'error');
    }
}

// Cargar lista de jugadores
async function loadPlayers() {
    try {
        const response = await fetch('/api/players');
        players = await response.json();
        updatePlayerSelect();
        socket.emit('request-update');
    } catch (error) {
        console.error('Error al cargar jugadores:', error);
        showMessage('Error al cargar la lista de jugadores', 'error');
    }
}

// Actualizar selector de jugadores
function updatePlayerSelect() {
    playerSelect.innerHTML = '<option value="">Selecciona un jugador...</option>';
    
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.uuid;
        option.textContent = `${player.name} (${formatDate(player.lastSeen)})`;
        playerSelect.appendChild(option);
    });
}

// Actualizar selector de items
function updateItemSelect() {
    itemSelect.innerHTML = '<option value="">Selecciona un item...</option>';
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item.replace(/_/g, ' ').toLowerCase();
        itemSelect.appendChild(option);
    });
}

// Manejar selección de jugador
function handlePlayerSelect(event) {
    const uuid = event.target.value;
    
    if (uuid) {
        selectedPlayer = players.find(p => p.uuid === uuid);
        showSelectedPlayerInfo();
        loadPlayerInventory(uuid);
        inventorySection.classList.remove('hidden');
    } else {
        selectedPlayer = null;
        selectedPlayerInfo.classList.add('hidden');
        inventorySection.classList.add('hidden');
    }
}

// Mostrar información del jugador seleccionado
function showSelectedPlayerInfo() {
    if (selectedPlayer) {
        playerName.textContent = selectedPlayer.name;
        playerUuid.textContent = selectedPlayer.uuid;
        playerLastSeen.textContent = formatDate(selectedPlayer.lastSeen);
        selectedPlayerInfo.classList.remove('hidden');
    }
}

// Cargar inventario del jugador
async function loadPlayerInventory(uuid) {
    try {
        showLoading(true);
        const response = await fetch(`/api/inventory/${uuid}`);
        
        if (response.ok) {
            const inventory = await response.json();
            displayInventory(inventory);
            addActivityLog(`Inventario cargado para ${selectedPlayer.name}`, 'info');
        } else {
            showMessage('No se pudo cargar el inventario del jugador', 'error');
        }
    } catch (error) {
        console.error('Error al cargar inventario:', error);
        showMessage('Error al cargar el inventario', 'error');
    } finally {
        showLoading(false);
    }
}

// Mostrar inventario
function displayInventory(inventory) {
    try {
        const inventoryData = JSON.parse(inventory.inventory);
        
        // Limpiar grid
        inventoryGrid.innerHTML = '';
        
        // Crear slots del inventario (9x4 = 36 slots)
        for (let i = 0; i < 36; i++) {
            const slot = document.createElement('div');
            slot.className = 'bg-gray-600 border border-gray-500 rounded p-2 text-center text-xs min-h-[40px] flex items-center justify-center';
            slot.textContent = i + 1;
            inventoryGrid.appendChild(slot);
        }
        
        // Mostrar items
        inventoryItems.innerHTML = '<h3 class="font-semibold mb-2">Items en el inventario:</h3>';
        
        if (inventoryData.length === 0) {
            inventoryItems.innerHTML += '<p class="text-gray-400">El inventario está vacío</p>';
            return;
        }
        
        const itemsList = document.createElement('div');
        itemsList.className = 'space-y-2';
        
        inventoryData.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'bg-gray-700 rounded p-3 flex justify-between items-center';
            
            const itemInfo = document.createElement('div');
            itemInfo.innerHTML = `
                <div class="font-semibold">${item.material.replace(/_/g, ' ').toLowerCase()}</div>
                <div class="text-sm text-gray-400">Slot: ${item.slot + 1} | Cantidad: ${item.amount}</div>
            `;
            
            const slotIndicator = document.createElement('div');
            slotIndicator.className = 'bg-minecraft-green text-black px-2 py-1 rounded text-xs font-bold';
            slotIndicator.textContent = `SLOT ${item.slot + 1}`;
            
            itemDiv.appendChild(itemInfo);
            itemDiv.appendChild(slotIndicator);
            itemsList.appendChild(itemDiv);
        });
        
        inventoryItems.appendChild(itemsList);
        
    } catch (error) {
        console.error('Error al parsear inventario:', error);
        inventoryItems.innerHTML = '<p class="text-red-400">Error al mostrar el inventario</p>';
    }
}

// Manejar envío de formulario de item
async function handleItemSubmit(event) {
    event.preventDefault();
    
    if (!selectedPlayer) {
        showMessage('Por favor selecciona un jugador primero', 'warning');
        return;
    }
    
    const item = itemSelect.value;
    const amount = parseInt(itemAmount.value);
    
    if (!item || !amount) {
        showMessage('Por favor completa todos los campos', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch('/api/add-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: selectedPlayer.uuid,
                item: item,
                amount: amount
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            addActivityLog(`Item agregado: ${amount} ${item} a ${selectedPlayer.name}`, 'success');
            
            // Recargar inventario después de un breve delay
            setTimeout(() => {
                loadPlayerInventory(selectedPlayer.uuid);
            }, 1000);
        } else {
            showMessage(result.error || 'Error al agregar item', 'error');
        }
        
    } catch (error) {
        console.error('Error al agregar item:', error);
        showMessage('Error al agregar item', 'error');
    } finally {
        showLoading(false);
    }
}

// Actualizar estado de conexión
function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.className = 'w-4 h-4 rounded-full bg-green-500';
        connectionText.textContent = 'Conectado';
        lastUpdate.textContent = new Date().toLocaleTimeString();
    } else {
        connectionStatus.className = 'w-4 h-4 rounded-full bg-red-500';
        connectionText.textContent = 'Desconectado';
    }
}

// Mostrar/ocultar loading
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

// Mostrar mensaje
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `p-4 rounded-lg shadow-lg mb-4 max-w-sm ${
        type === 'success' ? 'bg-green-600' :
        type === 'error' ? 'bg-red-600' :
        type === 'warning' ? 'bg-yellow-600' :
        'bg-blue-600'
    }`;
    
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Agregar entrada al log de actividad
function addActivityLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `text-sm mb-2 ${
        type === 'success' ? 'text-green-400' :
        type === 'error' ? 'text-red-400' :
        type === 'warning' ? 'text-yellow-400' :
        'text-blue-400'
    }`;
    
    const timestamp = new Date().toLocaleTimeString();
    logEntry.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> ${message}`;
    
    // Si es el primer mensaje, limpiar el placeholder
    if (activityLog.querySelector('.text-gray-400')) {
        activityLog.innerHTML = '';
    }
    
    activityLog.appendChild(logEntry);
    
    // Scroll to bottom
    activityLog.scrollTop = activityLog.scrollHeight;
}

// Formatear fecha
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Actualizar botón de envío
function updateSubmitButton() {
    const submitBtn = itemForm.querySelector('button[type="submit"]');
    const hasPlayer = selectedPlayer !== null;
    const hasItem = itemSelect.value !== '';
    const hasAmount = itemAmount.value !== '';
    
    submitBtn.disabled = !(hasPlayer && hasItem && hasAmount);
}

// Event listeners adicionales
itemSelect.addEventListener('change', updateSubmitButton);
itemAmount.addEventListener('input', updateSubmitButton);
