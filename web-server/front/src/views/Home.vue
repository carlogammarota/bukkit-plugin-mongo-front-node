<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Video/Image -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="floating absolute top-20 left-10 w-20 h-20 bg-craftar-500 rounded-full opacity-20"></div>
        <div class="floating absolute top-40 right-20 w-16 h-16 bg-minecraft-green rounded-full opacity-20" style="animation-delay: 2s;"></div>
        <div class="floating absolute bottom-40 left-20 w-12 h-12 bg-yellow-500 rounded-full opacity-20" style="animation-delay: 4s;"></div>
        <div class="floating absolute bottom-20 right-10 w-24 h-24 bg-red-500 rounded-full opacity-20" style="animation-delay: 1s;"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 class="minecraft-text text-shadow-lg mb-6">
          Bienvenido a <span class="gradient-text">CraftAR</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          El servidor de Minecraft más emocionante de Argentina. 
          Explora mundos infinitos, construye con amigos y vive aventuras épicas.
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <router-link to="/shop" class="btn-minecraft text-lg px-8 py-4">
            <i class="fas fa-shopping-cart mr-2"></i>
            Explorar Tienda
          </router-link>
          <button @click="scrollToFeatures" class="btn-secondary text-lg px-8 py-4">
            <i class="fas fa-info-circle mr-2"></i>
            Conocer Más
          </button>
        </div>
        
        <!-- Server Stats Widget -->
        <div class="max-w-6xl mx-auto">
          <StatsWidget />
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i class="fas fa-chevron-down text-2xl text-gray-400"></i>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="py-20 bg-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title mb-16">¿Por qué elegir CraftAR?</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="card text-center group  transition-transform duration-300">
            <div class="w-16 h-16 bg-craftar-600 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <i class="fas fa-shield-alt text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Protección Total</h3>
            <p class="text-gray-400">
              Sistema anti-cheat avanzado y protección de builds para una experiencia justa y segura.
            </p>
          </div>
          
          <div class="card text-center group  transition-transform duration-300">
            <div class="w-16 h-16 bg-minecraft-green rounded-full flex items-center justify-center mx-auto mb-6 ">
              <i class="fas fa-users text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Comunidad Activa</h3>
            <p class="text-gray-400">
              Más de 1000 jugadores registrados y una comunidad amigable que siempre está dispuesta a ayudar.
            </p>
          </div>
          
          <div class="card text-center group  transition-transform duration-300">
            <div class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <i class="fas fa-gem text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Economía Dinámica</h3>
            <p class="text-gray-400">
              Sistema de economía único con tienda integrada y oportunidades de ganar dinero real.
            </p>
          </div>
          
          <div class="card text-center group  transition-transform duration-300">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <i class="fas fa-calendar-alt text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Eventos Regulares</h3>
            <p class="text-gray-400">
              Torneos, eventos especiales y actividades semanales con premios increíbles.
            </p>
          </div>
          
          <div class="card text-center group  transition-transform duration-300">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <i class="fas fa-rocket text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Performance Óptimo</h3>
            <p class="text-gray-400">
              Servidores de alta performance con lag mínimo y conexión estable desde Argentina.
            </p>
          </div>
          
          <div class="card text-center group  transition-transform duration-300">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <i class="fas fa-headset text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Soporte 24/7</h3>
            <p class="text-gray-400">
              Equipo de moderadores disponible las 24 horas para ayudarte con cualquier problema.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Shop Preview Section -->
    <section class="py-20 bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title mb-16">Tienda de Items</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="product in featuredProducts" :key="product._id" class="card group  transition-transform duration-300">
            <div class="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
              <i class="fas fa-cube text-4xl text-gray-500"></i>
            </div>
            <h3 class="font-semibold mb-2">{{ product.name }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-craftar-400 font-bold">${{ product.price.toLocaleString('es-AR') }}</span>
              <button @click="addToCart(product)" class="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-lg border border-green-500/20 flex items-center justify-center gap-1">
                <i class="fas fa-cart-plus"></i>
                Agregar
              </button>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <router-link to="/shop" class="btn-minecraft text-lg px-8 py-4 bg-gray-800 rounded-md">
            <i class="fas fa-store mr-2"></i>
            Ver Tienda Completa
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-craftar-600 to-craftar-800">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <!-- Mensaje para usuarios no logueados -->
        <div v-if="!authStore.isAuthenticated">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-white">
            ¿Listo para la Aventura?
          </h2>
          <p class="text-xl text-craftar-100 mb-8">
            Únete a CraftAR hoy y comienza tu aventura épica en Minecraft
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/login" class="bg-white text-craftar-600  font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform ">
              <i class="fas fa-sign-in-alt mr-2"></i>
              Iniciar Sesión
            </router-link>
            <router-link to="/shop" class="bg-transparent border-2 border-white text-white  font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform ">
              <i class="fas fa-shopping-cart mr-2"></i>
              Explorar Tienda
            </router-link>
          </div>
        </div>
        
        <!-- Mensaje para usuarios logueados -->
        <div v-else>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-white">
            ¡Bienvenido de vuelta, {{ authStore.user?.username }}!
          </h2>
          <p class="text-xl text-craftar-100 mb-8">
            Continúa tu aventura en CraftAR y descubre nuevos items en nuestra tienda
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/dashboard" class="bg-white text-craftar-600  font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform ">
              <i class="fas fa-tachometer-alt mr-2"></i>
              Mi Dashboard
            </router-link>
            <router-link to="/shop" class="bg-transparent border-2 border-white text-white  font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform ">
              <i class="fas fa-shopping-cart mr-2"></i>
              Explorar Tienda
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Cart Sidebar -->
    <div v-if="showCart" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" @click="showCart = false">
      <div class="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md md:w-96 bg-gray-900/95 backdrop-blur-md shadow-2xl border-l border-gray-700/50 transition-transform duration-300" @click.stop>
        <div class="p-6 h-full flex flex-col">
          <!-- Cart Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">🛒 Carrito</h2>
            <button @click="showCart = false" class="text-gray-400">
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
              class="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4"
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
                    class="w-8 h-8 bg-gray-700/80 rounded-lg flex items-center justify-center shadow-md border border-gray-600/50 backdrop-blur-sm"
                    title="Reducir cantidad"
                  >
                    <i class="fas fa-minus text-xs"></i>
                  </button>
                  <span class="w-10 text-center font-semibold bg-gray-700/50 rounded-lg py-1 text-sm backdrop-blur-sm border border-gray-600/50">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)" 
                    class="w-8 h-8 bg-gray-700/80 rounded-lg flex items-center justify-center shadow-md border border-gray-600/50 backdrop-blur-sm"
                    title="Aumentar cantidad"
                  >
                    <i class="fas fa-plus text-xs"></i>
                  </button>
                </div>
                
                <button 
                  @click="removeFromCart(item.id)" 
                  class="w-8 h-8 bg-red-600/80 rounded-lg flex items-center justify-center shadow-md border border-red-500/50 backdrop-blur-sm"
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
              class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg border border-green-500/20 flex items-center justify-center gap-2"
            >
              <i class="fas fa-credit-card"></i>
              💳 Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useShopStore } from '../stores/shop'
import { useAuthStore } from '../stores/auth'
import StatsWidget from '../components/StatsWidget.vue'
import axios from 'axios'

const shopStore = useShopStore()
const authStore = useAuthStore()
const featuresSection = ref(null)
const featuredProducts = ref([])
const showCart = ref(false)

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const addToCart = (product) => {
  console.log('Agregando producto al carrito:', product)
  shopStore.addToCart(product)
  showCart.value = true
  console.log('Carrito actualizado:', shopStore.cart)
}

const updateQuantity = (productId, quantity) => {
  shopStore.updateCartQuantity(productId, quantity)
}

const removeFromCart = (productId) => {
  shopStore.removeFromCart(productId)
}

const proceedToCheckout = () => {
  showCart.value = false
  // Redirigir a la página de checkout
  window.location.href = '/checkout'
}

const handleImageError = (event) => {
  // Si la imagen falla al cargar, ocultarla y mostrar el ícono por defecto
  event.target.style.display = 'none'
}

onMounted(async () => {
  try {
    // Cargar productos destacados
    console.log('Cargando productos destacados...')
    const result = await shopStore.fetchProducts()
    console.log('Resultado de fetchProducts:', result)
    console.log('Productos en store:', shopStore.products)
    
    if (result.success && shopStore.products && shopStore.products.length > 0) {
      featuredProducts.value = shopStore.products.slice(0, 4)
      console.log('Productos destacados cargados:', featuredProducts.value)
    } else {
      // Si no hay productos, usar array vacío
      featuredProducts.value = []
      console.log('No se encontraron productos')
    }
  } catch (error) {
    console.error('Error loading home data:', error)
    featuredProducts.value = []
  }
})
</script>
