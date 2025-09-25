<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-2">Panel de Administración</h1>
        <p class="text-gray-400">Gestiona el servidor y los usuarios de CraftAR</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-craftar-600 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-users text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Usuarios Registrados</p>
              <p class="text-2xl font-bold">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-minecraft-green rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-shopping-cart text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Órdenes Totales</p>
              <p class="text-2xl font-bold">{{ stats.totalOrders }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-dollar-sign text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Ingresos Totales</p>
              <p class="text-2xl font-bold">${{ stats.totalRevenue.toLocaleString('es-AR') }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-cube text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Productos Activos</p>
              <p class="text-2xl font-bold">{{ stats.activeProducts }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300',
                activeTab === tab.id
                  ? 'border-craftar-500 text-craftar-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              <i :class="tab.icon + ' mr-2'"></i>
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-8">
        <!-- Players Management -->
        <div v-if="activeTab === 'players'" class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Gestión de Jugadores</h2>
            <button @click="refreshPlayers" class="btn-secondary">
              <i class="fas fa-sync-alt mr-2"></i>
              Actualizar
            </button>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-gray-400">Cargando jugadores...</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="text-left py-3 px-4">Nombre</th>
                  <th class="text-left py-3 px-4">UUID</th>
                  <th class="text-left py-3 px-4">Última Conexión</th>
                  <th class="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in players" :key="player.uuid" class="border-b border-gray-800 hover:bg-gray-800/50">
                  <td class="py-3 px-4 font-semibold">{{ player.name }}</td>
                  <td class="py-3 px-4 font-mono text-sm text-gray-400">{{ player.uuid.slice(0, 8) }}...</td>
                  <td class="py-3 px-4 text-gray-400">{{ formatDate(player.lastSeen) }}</td>
                  <td class="py-3 px-4">
                    <button @click="viewPlayerInventory(player)" class="btn-secondary text-sm mr-2">
                      <i class="fas fa-box mr-1"></i>
                      Inventario
                    </button>
                    <button @click="giveItemToPlayer(player)" class="btn-primary text-sm">
                      <i class="fas fa-gift mr-1"></i>
                      Dar Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Items Management -->
        <div v-if="activeTab === 'items'" class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Gestión de Items</h2>
            <button @click="showAddItemModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Dar Item a Jugador
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in minecraftItems.slice(0, 30)" :key="item" class="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div class="flex items-center justify-between">
                <span class="font-mono text-sm">{{ item }}</span>
                <button @click="selectItem(item)" class="text-craftar-400 hover:text-craftar-300">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Management -->
        <div v-if="activeTab === 'orders'" class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Gestión de Órdenes</h2>
            <button @click="refreshOrders" class="btn-secondary">
              <i class="fas fa-sync-alt mr-2"></i>
              Actualizar
            </button>
          </div>

          <div v-if="ordersLoading" class="text-center py-8">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-gray-400">Cargando órdenes...</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="text-left py-3 px-4">ID</th>
                  <th class="text-left py-3 px-4">Usuario</th>
                  <th class="text-left py-3 px-4">Total</th>
                  <th class="text-left py-3 px-4">Estado</th>
                  <th class="text-left py-3 px-4">Fecha</th>
                  <th class="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order._id" class="border-b border-gray-800 hover:bg-gray-800/50">
                  <td class="py-3 px-4 font-mono text-sm">#{{ order._id.slice(-8) }}</td>
                  <td class="py-3 px-4">{{ order.userId.username }}</td>
                  <td class="py-3 px-4 font-semibold text-craftar-400">${{ order.totalAmount.toLocaleString('es-AR') }}</td>
                  <td class="py-3 px-4">
                    <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded-full text-xs">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-400">{{ formatDate(order.createdAt) }}</td>
                  <td class="py-3 px-4">
                    <button @click="viewOrderDetails(order)" class="btn-secondary text-sm">
                      <i class="fas fa-eye mr-1"></i>
                      Ver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Products Management -->
        <div v-if="activeTab === 'products'" class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Gestión de Productos</h2>
            <button @click="showAddProductModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Agregar Producto
            </button>
          </div>

          <div v-if="productsLoading" class="text-center py-8">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-gray-400">Cargando productos...</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="product in products" :key="product._id" class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-300">
              <!-- Product Image -->
              <div class="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <img 
                  v-if="product.image" 
                  :src="product.image" 
                  :alt="product.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError($event)"
                />
                <i v-else class="fas fa-cube text-4xl text-gray-500"></i>
              </div>
              
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold">{{ product.name }}</h3>
                <span :class="product.isActive ? 'text-green-400' : 'text-red-400'" class="text-sm">
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <p class="text-gray-400 text-sm mb-4">{{ product.description }}</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-craftar-400 font-bold">${{ product.price.toLocaleString('es-AR') }}</span>
                <span class="text-gray-500 text-sm">{{ product.category }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="editProduct(product)" class="flex-1 btn-secondary text-sm">
                  <i class="fas fa-edit mr-1"></i>
                  Editar
                </button>
                <button @click="toggleProductStatus(product)" :class="product.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'" class="flex-1 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300">
                  <i :class="product.isActive ? 'fas fa-pause' : 'fas fa-play'" class="mr-1"></i>
                  {{ product.isActive ? 'Desactivar' : 'Activar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddItemModal" class="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Dar Item a Jugador</h3>
        <form @submit.prevent="giveItem">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Jugador</label>
              <select v-model="selectedPlayer" required class="input-field">
                <option value="">Seleccionar jugador</option>
                <option v-for="player in players" :key="player.uuid" :value="player.uuid">
                  {{ player.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Item</label>
              <input v-model="selectedItem" type="text" required class="input-field" placeholder="DIAMOND_SWORD">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
              <input v-model.number="itemAmount" type="number" required min="1" class="input-field" placeholder="1">
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="button" @click="showAddItemModal = false" class="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="flex-1 btn-primary">
              <i class="fas fa-gift mr-2"></i>
              Dar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()

const activeTab = ref('players')
const loading = ref(false)
const ordersLoading = ref(false)
const productsLoading = ref(false)
const showAddItemModal = ref(false)
const showAddProductModal = ref(false)

const stats = reactive({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  activeProducts: 0
})

const players = ref([])
const orders = ref([])
const products = ref([])
const minecraftItems = ref([])

const selectedPlayer = ref('')
const selectedItem = ref('')
const itemAmount = ref(1)

const tabs = [
  { id: 'players', name: 'Jugadores', icon: 'fas fa-users' },
  { id: 'items', name: 'Items', icon: 'fas fa-cube' },
  { id: 'orders', name: 'Órdenes', icon: 'fas fa-shopping-cart' },
  { id: 'products', name: 'Productos', icon: 'fas fa-store' }
]

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('es-AR')
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500',
    paid: 'bg-blue-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    paid: 'Pagado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return texts[status] || status
}

const refreshPlayers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/players')
    players.value = response.data
  } catch (error) {
    console.error('Error loading players:', error)
  } finally {
    loading.value = false
  }
}

const refreshOrders = async () => {
  ordersLoading.value = true
  try {
    const response = await axios.get('/api/orders')
    orders.value = response.data
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    ordersLoading.value = false
  }
}

const loadProducts = async () => {
  productsLoading.value = true
  try {
    const response = await axios.get('/api/shop/products')
    products.value = response.data.products
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    productsLoading.value = false
  }
}

const loadMinecraftItems = async () => {
  try {
    const response = await axios.get('/api/items')
    minecraftItems.value = response.data
  } catch (error) {
    console.error('Error loading minecraft items:', error)
  }
}

const giveItem = async () => {
  try {
    const response = await axios.post('/api/add-item', {
      uuid: selectedPlayer.value,
      item: selectedItem.value,
      amount: itemAmount.value
    })
    
    if (response.data.success) {
      alert('Item enviado exitosamente al servidor')
      showAddItemModal.value = false
      selectedPlayer.value = ''
      selectedItem.value = ''
      itemAmount.value = 1
    }
  } catch (error) {
    alert('Error al enviar item: ' + (error.response?.data?.error || error.message))
  }
}

const selectItem = (item) => {
  selectedItem.value = item
  showAddItemModal.value = true
}

const viewPlayerInventory = (player) => {
  // Implementar vista de inventario
  console.log('View inventory for:', player)
}

const giveItemToPlayer = (player) => {
  selectedPlayer.value = player.uuid
  showAddItemModal.value = true
}

const viewOrderDetails = (order) => {
  // Implementar vista de detalles de orden
  console.log('View order:', order)
}

const editProduct = (product) => {
  // Implementar edición de producto
  console.log('Edit product:', product)
}

const handleImageError = (event) => {
  // Si la imagen falla al cargar, ocultarla y mostrar el ícono por defecto
  event.target.style.display = 'none'
}

const toggleProductStatus = async (product) => {
  try {
    await axios.put(`/api/shop/products/${product._id}`, {
      isActive: !product.isActive
    })
    product.isActive = !product.isActive
  } catch (error) {
    console.error('Error updating product:', error)
  }
}

onMounted(() => {
  refreshPlayers()
  refreshOrders()
  loadProducts()
  loadMinecraftItems()
  
  // Load stats
  stats.totalUsers = players.value.length
  stats.totalOrders = orders.value.length
  stats.totalRevenue = orders.value.reduce((sum, order) => sum + order.totalAmount, 0)
  stats.activeProducts = products.value.filter(p => p.isActive).length
})
</script>
