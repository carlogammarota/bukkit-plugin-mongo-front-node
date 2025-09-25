<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
          🛒 Tienda CraftAR
        </h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Compra items de Minecraft con dinero real y recíbelos instantáneamente en el servidor
        </p>
        <div class="mt-6 flex justify-center">
          <div class="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg px-6 py-3 backdrop-blur-sm">
            <span class="text-green-400 font-semibold">⚡ Entrega instantánea</span>
            <span class="text-gray-300 mx-2">•</span>
            <span class="text-blue-400 font-semibold">🔒 Pago seguro</span>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <i class="fas fa-info-circle text-blue-400 text-xl"></i>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-blue-400 mb-3">💡 ¿Cómo funcionan las cantidades?</h3>
            <div class="grid md:grid-cols-3 gap-4 text-gray-300">
              <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h4 class="font-semibold text-white mb-2">📦 Productos Individuales</h4>
                <p class="text-sm">Al agregar "1" al carrito, recibes 1 item</p>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h4 class="font-semibold text-white mb-2">📚 Productos en Paquetes</h4>
                <p class="text-sm">Al agregar "1" al carrito, recibes la cantidad indicada en el nombre</p>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h4 class="font-semibold text-white mb-2">🛒 En el Carrito</h4>
                <p class="text-sm">Puedes ajustar la cantidad de paquetes que deseas comprar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-xl">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="🔍 Buscar items..."
                class="w-full px-4 py-3 pl-12 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 "
                @input="debouncedSearch"
              >
              <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <!-- Category Filter -->
          <div class="lg:w-64">
            <select 
              v-model="filters.category" 
              @change="applyFilters" 
              class="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 "
            >
              <option value="all">🏷️ Todas las Categorías</option>
              <option v-for="category in shopStore.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <!-- Sort Filter -->
          <div class="lg:w-48">
            <select 
              v-model="filters.sort" 
              @change="applyFilters" 
              class="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 "
            >
              <option value="newest">🆕 Más Recientes</option>
              <option value="price-low">💰 Precio: Menor a Mayor</option>
              <option value="price-high">💎 Precio: Mayor a Menor</option>
              <option value="name">🔤 Nombre A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="shopStore.loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
        <p class="text-xl text-gray-400">🔄 Cargando productos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!shopStore.products || shopStore.products.length === 0" class="text-center py-16">
        <div class="text-8xl mb-6">🔍</div>
        <h3 class="text-3xl font-bold mb-4 text-gray-300">No se encontraron productos</h3>
        <p class="text-gray-400 mb-8 text-lg">Intenta ajustar los filtros de búsqueda</p>
        <button 
          @click="resetFilters" 
          class="bg-gradient-to-r from-blue-600 to-purple-600  text-white font-semibold py-3 px-8 rounded-xl  shadow-lg  "
        >
          🧹 Limpiar Filtros
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        <div 
          v-for="product in shopStore.products" 
          :key="product._id" 
          class="group bg-gray-800/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-700/50 relative overflow-hidden"
        >
          <!-- Product Image -->
          <div class="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
            <img 
              v-if="product.image" 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="handleImageError($event)"
            />
            <div v-else class="text-6xl text-gray-500">
              🧱
            </div>
            
            <!-- Stock Badge -->
            <div v-if="product.stock === 0" class="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <span class="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border border-red-400/50">
                ❌ Agotado
              </span>
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="mb-4">
            <h3 class="text-lg font-bold mb-2 text-white">
              {{ product.name }}
            </h3>
            <p class="text-gray-400 text-sm mb-3 line-clamp-2">
              {{ product.description }}
            </p>
            
            <!-- Quantity Info -->
            <div v-if="product.defaultQuantity && product.defaultQuantity > 1" class="mb-3">
              <span class="inline-flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-500/30 backdrop-blur-sm">
                <i class="fas fa-info-circle mr-1"></i>
                Cantidad por unidad: {{ product.defaultQuantity }}
              </span>
            </div>
            
            <!-- Price and Category -->
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-green-400">
                ${{ product.price.toLocaleString('es-AR') }}
              </span>
              <span class="text-gray-500 text-sm">
                {{ product.category }}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button 
              @click="addToCart(product)"
              :disabled="product.stock === 0"
              class="flex-1 bg-gradient-to-r from-green-600 to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl shadow-lg border border-green-500/20 flex items-center justify-center gap-2 relative overflow-hidden"
              :title="product.defaultQuantity && product.defaultQuantity > 1 ? `Agregar 1 unidad (${product.defaultQuantity} items en total)` : 'Agregar al carrito'"
            >
              <i class="fas fa-cart-plus"></i>
              <span v-if="product.defaultQuantity && product.defaultQuantity > 1">
                Agregar ({{ product.defaultQuantity }})
              </span>
              <span v-else>Agregar</span>
            </button>
            
            <button 
              @click="viewProduct(product)"
              class="bg-gray-700/80  text-white font-semibold py-3 px-4 rounded-xl  shadow-md  border border-gray-600/50  backdrop-blur-sm flex items-center justify-center"
              title="Ver detalles"
            >
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="shopStore.pagination && shopStore.pagination.pages > 1" class="flex justify-center">
        <div class="flex items-center space-x-3 bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <button 
            @click="changePage(shopStore.pagination.current - 1)"
            :disabled="!shopStore.pagination.hasPrev"
            class="bg-gray-700/80  disabled:bg-gray-600/30 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg  shadow-md  border border-gray-600/50  backdrop-blur-sm flex items-center justify-center"
            title="Página anterior"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <span class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow-lg border border-blue-500/20 backdrop-blur-sm">
            {{ shopStore.pagination.current }} de {{ shopStore.pagination.pages }}
          </span>
          
          <button 
            @click="changePage(shopStore.pagination.current + 1)"
            :disabled="!shopStore.pagination.hasNext"
            class="bg-gray-700/80  disabled:bg-gray-600/30 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg  shadow-md  border border-gray-600/50  backdrop-blur-sm flex items-center justify-center"
            title="Página siguiente"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Cart Sidebar -->
    <div v-if="showCart" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] " @click="showCart = false">
      <div class="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md md:w-96 bg-gray-900/95 backdrop-blur-md shadow-2xl border-l border-gray-700/50 transition-transform duration-300" @click.stop>
        <div class="p-6 h-full flex flex-col">
          <!-- Cart Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">🛒 Carrito</h2>
            <button @click="showCart = false" class="text-gray-400  transition-colors duration-300">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <!-- Empty Cart -->
          <div v-if="shopStore.cart.length === 0" class="flex-1 flex flex-col items-center justify-center text-center">
            <div class="text-6xl mb-4">🛒</div>
            <p class="text-gray-400 text-lg">Tu carrito está vacío</p>
            <p class="text-gray-500 text-sm mt-2">Agrega algunos productos para comenzar</p>
          </div>
          
          <!-- Cart Items -->
          <div v-else class="flex-1 overflow-y-auto space-y-3 mb-6">
            <div 
              v-for="item in shopStore.cart" 
              :key="item.id" 
              class="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50   p-4"
            >
              <!-- Product Image and Info Row -->
              <div class="flex items-start space-x-3 mb-3">
                <!-- Product Image -->
                <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img 
                    v-if="item.image" 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-full h-full object-cover rounded-lg"
                    @error="handleImageError($event)"
                  />
                  <div v-else class="text-lg text-gray-500">🧱</div>
                </div>
                
                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-white text-sm leading-tight truncate">{{ item.name }}</h3>
                  <p class="text-gray-400 text-xs">${{ item.price.toLocaleString('es-AR') }}</p>
                  <div v-if="item.defaultQuantity && item.defaultQuantity > 1" class="mt-1">
                    <span class="text-xs text-blue-400">
                      <i class="fas fa-cube mr-1"></i>
                      Total: {{ item.quantity * item.defaultQuantity }} unidades
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Quantity Controls Row -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="updateQuantity(item.id, item.quantity - 1)" 
                    class="w-8 h-8 bg-gray-700/80  rounded-lg flex items-center justify-center  shadow-md  border border-gray-600/50  backdrop-blur-sm"
                    title="Reducir cantidad"
                  >
                    <i class="fas fa-minus text-xs"></i>
                  </button>
                  <span class="w-10 text-center font-semibold bg-gray-700/50 rounded-lg py-1 text-sm backdrop-blur-sm border border-gray-600/50">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)" 
                    class="w-8 h-8 bg-gray-700/80  rounded-lg flex items-center justify-center  shadow-md  border border-gray-600/50  backdrop-blur-sm"
                    title="Aumentar cantidad"
                  >
                    <i class="fas fa-plus text-xs"></i>
                  </button>
                </div>
                
                <button 
                  @click="removeFromCart(item.id)" 
                  class="w-8 h-8 bg-red-600/80  rounded-lg flex items-center justify-center  shadow-md  border border-red-500/50  backdrop-blur-sm"
                  title="Eliminar del carrito"
                >
                  <i class="fas fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Cart Footer -->
          <div v-if="shopStore.cart.length > 0" class="border-t border-gray-700 pt-6">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-semibold text-white">Total:</span>
              <span class="text-2xl font-bold text-green-400">
                ${{ shopStore.cartTotal.toLocaleString('es-AR') }}
              </span>
            </div>
            <button 
              @click="proceedToCheckout" 
              class="w-full bg-gradient-to-r from-green-600 to-green-700  text-white font-semibold py-4 px-6 rounded-xl  shadow-lg  border border-green-500/20  flex items-center justify-center gap-2"
            >
              <i class="fas fa-credit-card"></i>
              💳 Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" @click="showProductModal = false">
      <div class="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">📦 Detalles del Producto</h2>
            <button @click="showProductModal = false" class="text-gray-400  transition-colors duration-300">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <!-- Product Info -->
          <div v-if="selectedProduct" class="space-y-6">
            <!-- Product Image and Basic Info -->
            <div class="flex flex-col md:flex-row gap-6">
              <div class="md:w-1/3">
                <div class="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <img 
                    v-if="selectedProduct.image" 
                    :src="selectedProduct.image" 
                    :alt="selectedProduct.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div v-else class="text-6xl text-gray-500">
                    <i class="fas fa-cube"></i>
                  </div>
                </div>
              </div>
              
              <div class="md:w-2/3 space-y-4">
                <h3 class="text-2xl font-bold text-white">{{ selectedProduct.name }}</h3>
                <p class="text-gray-300">{{ selectedProduct.description }}</p>
                
                <div class="flex items-center justify-between">
                  <span class="text-3xl font-bold text-green-400">
                    ${{ selectedProduct.price.toLocaleString('es-AR') }}
                  </span>
                  <span class="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-semibold border border-blue-500/30">
                    {{ selectedProduct.category }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Items Included -->
            <div v-if="selectedProduct.items && selectedProduct.items.length > 0" class="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <h4 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-gift text-green-400"></i>
                Items Incluidos
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  v-for="item in selectedProduct.items" 
                  :key="item.item"
                  class="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50 flex items-center justify-between"
                >
                  <span class="text-gray-300 font-medium">{{ item.item.replace(/_/g, ' ').toLowerCase() }}</span>
                  <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-semibold border border-green-500/30">
                    x{{ item.quantity }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Single Item Info -->
            <div v-else-if="selectedProduct.minecraftItem" class="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <h4 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-cube text-blue-400"></i>
                Item Incluido
              </h4>
              <div class="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50 flex items-center justify-between">
                <span class="text-gray-300 font-medium">{{ selectedProduct.minecraftItem.replace(/_/g, ' ').toLowerCase() }}</span>
                <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-semibold border border-blue-500/30">
                  x{{ selectedProduct.defaultQuantity || 1 }}
                </span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
              <button 
                @click="addToCart(selectedProduct)"
                :disabled="selectedProduct.stock === 0"
                class="flex-1 bg-gradient-to-r from-green-600 to-green-700  disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl  shadow-lg  border border-green-500/20  flex items-center justify-center gap-2"
              >
                <i class="fas fa-cart-plus"></i>
                Agregar al Carrito
              </button>
              
              <button 
                @click="showProductModal = false"
                class="bg-gray-700/80  text-white font-semibold py-3 px-4 rounded-xl  shadow-md  border border-gray-600/50  backdrop-blur-sm flex items-center justify-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '../stores/shop'

const router = useRouter()
const shopStore = useShopStore()
const showCart = ref(false)
const showProductModal = ref(false)
const selectedProduct = ref(null)

const filters = reactive({
  search: '',
  category: 'all',
  sort: 'newest',
  page: 1,
  limit: 12
})

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  shopStore.setFilters(filters)
  shopStore.fetchProducts()
}

const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    category: 'all',
    sort: 'newest',
    page: 1,
    limit: 12
  })
  applyFilters()
}

const changePage = (page) => {
  if (page >= 1 && page <= shopStore.pagination.pages) {
    filters.page = page
    applyFilters()
  }
}

const addToCart = (product) => {
  shopStore.addToCart(product)
  showCart.value = true
}

const updateQuantity = (productId, quantity) => {
  shopStore.updateCartQuantity(productId, quantity)
}

const removeFromCart = (productId) => {
  shopStore.removeFromCart(productId)
}

const viewProduct = (product) => {
  selectedProduct.value = product
  showProductModal.value = true
}

const handleImageError = (event) => {
  // Si la imagen falla al cargar, ocultarla y mostrar el ícono por defecto
  event.target.style.display = 'none'
}

const proceedToCheckout = () => {
  showCart.value = false
  router.push('/checkout')
}

onMounted(async () => {
  await shopStore.fetchProducts()
  await shopStore.fetchCategories()
})

// Watch for cart changes to show cart
watch(() => shopStore.cartItemsCount, (newCount) => {
  if (newCount > 0 && !showCart.value) {
    // Auto-show cart when items are added
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>