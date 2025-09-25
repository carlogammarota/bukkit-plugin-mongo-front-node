<template>
  <nav class="bg-gray-900/95 backdrop-blur-custom border-b border-gray-800 sticky top-0 z-[100]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-r from-craftar-500 to-craftar-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-cube text-white text-xl"></i>
          </div>
          <span class="font-orbitron font-bold text-xl gradient-text">CraftAR</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-gray-300 hover:text-white transition-colors duration-300"
            :class="{ 'text-craftar-400': $route.name === 'Home' }"
          >
            Inicio
          </router-link>
          <router-link 
            to="/shop" 
            class="text-gray-300 hover:text-white transition-colors duration-300"
            :class="{ 'text-craftar-400': $route.name === 'Shop' }"
          >
            Tienda
          </router-link>
          <router-link 
            to="/blog" 
            class="text-gray-300 hover:text-white transition-colors duration-300"
            :class="{ 'text-craftar-400': $route.name === 'Blog' }"
          >
            Blog
          </router-link>
          
          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <!-- Cart -->
            <button @click="toggleCart" class="relative text-gray-300 hover:text-white transition-colors duration-300">
              <i class="fas fa-shopping-cart text-xl"></i>
              <span v-if="shopStore.cartItemsCount > 0" 
                    class="absolute -top-2 -right-2 bg-craftar-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ shopStore.cartItemsCount }}
              </span>
            </button>
            
            <!-- Monedas -->
            <div class="text-sm text-gray-400">
              <i class="fas fa-coins text-yellow-500 mr-1"></i>
              {{ authStore.userCoins.toLocaleString('es-AR') }} monedas
            </div>
            
            <!-- Botón Canjear Cupón -->
            <button @click="showCouponModal = true" class="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
              <i class="fas fa-ticket-alt mr-1"></i>
              Canjear Cupón
            </button>
            
            <!-- User Dropdown -->
            <div class="relative group">
              <button class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300">
                <i class="fas fa-user-circle text-xl"></i>
                <span>{{ authStore.user.username }}</span>
                <i class="fas fa-chevron-down text-xs"></i>
              </button>
              
              <div class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[200]">
                <div class="py-2">
                  <router-link to="/dashboard" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-tachometer-alt mr-2"></i>
                    Dashboard
                  </router-link>
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-user mr-2"></i>
                    Mi Perfil
                  </router-link>
                  <router-link to="/dashboard/orders" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-shopping-cart mr-2"></i>
                    Mis Órdenes
                  </router-link>
                  <router-link to="/dashboard/coins" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-coins mr-2"></i>
                    Mis Monedas
                  </router-link>
                  <div v-if="authStore.isAdmin" class="border-t border-gray-700 my-1"></div>
                  <router-link v-if="authStore.isAdmin" to="/admin" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-cog mr-2"></i>
                    Administración
                  </router-link>
                  <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Guest Menu -->
          <div v-else class="flex items-center space-x-4">
            <router-link to="/login" class="btn-primary">
              Iniciar Sesión
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-300 hover:text-white">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-800 py-4">
        <div class="space-y-4">
          <router-link to="/" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
            Inicio
          </router-link>
          <router-link to="/shop" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
            Tienda
          </router-link>
          <router-link to="/blog" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
            Blog
          </router-link>
          
          <div v-if="authStore.isAuthenticated" class="space-y-4 pt-4 border-t border-gray-800">
            <div class="text-sm text-gray-400">
              <i class="fas fa-coins text-yellow-500 mr-1"></i>
              Monedas: {{ authStore.userCoins.toLocaleString('es-AR') }}
            </div>
            <router-link to="/dashboard" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
              Dashboard
            </router-link>
            <router-link to="/profile" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
              Mi Perfil
            </router-link>
            <router-link to="/dashboard/orders" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
              Mis Órdenes
            </router-link>
            <router-link to="/dashboard/coins" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
              Mis Monedas
            </router-link>
            <router-link v-if="authStore.isAdmin" to="/admin" @click="mobileMenuOpen = false" class="block text-gray-300 hover:text-white">
              Administración
            </router-link>
            <button @click="handleLogout" class="block text-red-400 hover:text-red-300">
              Cerrar Sesión
            </button>
          </div>
          
          <div v-else class="space-y-4 pt-4 border-t border-gray-800">
            <router-link to="/login" @click="mobileMenuOpen = false" class="btn-primary block text-center">
              Iniciar Sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Sidebar -->
    <div v-if="showCart" class="fixed inset-0 bg-black bg-opacity-50 z-[9999]" @click="showCart = false">
      <div class="absolute right-0 top-0 h-full w-96 bg-gray-900 shadow-xl border-l border-gray-700" @click.stop>
        <div class="p-6 h-screen bg-black">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Carrito</h2>
            <button @click="showCart = false" class="text-gray-400 hover:text-white">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div v-if="shopStore.cart.length === 0" class="text-center py-8">
            <i class="fas fa-shopping-cart text-4xl text-gray-600 mb-4"></i>
            <p class="text-gray-400">Tu carrito está vacío</p>
          </div>
          
          <div v-else class="space-y-4 mb-6">
            <div v-for="item in shopStore.cart" :key="item.id" class="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div class="flex-1">
                <h3 class="font-semibold">{{ item.name }}</h3>
                <p class="text-gray-400 text-sm">${{ item.price.toLocaleString('es-AR') }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="shopStore.updateCartQuantity(item.id, item.quantity - 1)" class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center">
                  <i class="fas fa-minus text-xs"></i>
                </button>
                <span class="w-8 text-center">{{ item.quantity }}</span>
                <button @click="shopStore.updateCartQuantity(item.id, item.quantity + 1)" class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center">
                  <i class="fas fa-plus text-xs"></i>
                </button>
                <button @click="shopStore.removeFromCart(item.id)" class="ml-2 text-red-400 hover:text-red-300">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="shopStore.cart.length > 0" class="border-t border-gray-700 pt-6">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-semibold">Total:</span>
              <span class="text-xl font-bold text-craftar-400">
                ${{ shopStore.cartTotal.toLocaleString('es-AR') }}
              </span>
            </div>
            <button @click="proceedToCheckout" class="w-full btn-primary p-2 bg-gray-800 rounded-md">
              <i class="fas fa-credit-card mr-2"></i>
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Canjear Cupón -->
    <div v-if="showCouponModal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] h-screen" @click="showCouponModal = false">
      <div class="absolute inset-0 flex items-center justify-center p-4" @click.stop>
        <div class="bg-gray-900 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">
                <i class="fas fa-ticket-alt text-purple-500 mr-2"></i>
                Canjear Cupón
              </h2>
              <button @click="showCouponModal = false" class="text-gray-400 hover:text-white">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Código del Cupón
                </label>
                <input 
                  v-model="couponCode" 
                  type="text" 
                  placeholder="Ingresa el código del cupón"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  @keyup.enter="redeemCoupon"
                >
              </div>
              
              <div v-if="couponInfo" class="p-4 rounded-lg border" :class="couponInfo.canUse ? 'bg-gray-800 border-gray-600' : 'bg-red-900/20 border-red-500'">
                <h3 class="font-semibold text-white mb-2">{{ couponInfo.description }}</h3>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-400">Recompensa:</span>
                  <span class="text-yellow-500 font-semibold">
                    <i class="fas fa-coins mr-1"></i>
                    {{ couponInfo.coinsReward.toLocaleString('es-AR') }} monedas
                  </span>
                </div>
                <div class="flex justify-between items-center text-sm mt-1">
                  <span class="text-gray-400">Usos restantes:</span>
                  <span :class="couponInfo.canUse ? 'text-green-400' : 'text-red-400'">{{ couponInfo.remainingUses }}</span>
                </div>
                <div v-if="couponInfo.alreadyUsed" class="mt-2 p-2 bg-red-900/50 border border-red-500 rounded">
                  <p class="text-red-400 text-sm">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    Ya has usado este cupón anteriormente
                  </p>
                </div>
              </div>
              
              <div v-if="couponError" class="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p class="text-red-400 text-sm">{{ couponError }}</p>
              </div>
              
              <div v-if="couponSuccess" class="p-4 bg-green-900/50 border border-green-500 rounded-lg">
                <p class="text-green-400 text-sm">{{ couponSuccess }}</p>
              </div>
              
              <button 
                @click="redeemCoupon" 
                :disabled="!couponCode || isRedeeming || (couponInfo && !couponInfo.canUse)"
                class="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="(couponInfo && !couponInfo.canUse) ? 'bg-gray-600 text-gray-400' : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'"
              >
                <i v-if="isRedeeming" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else-if="couponInfo && !couponInfo.canUse" class="fas fa-ban mr-2"></i>
                <i v-else class="fas fa-gift mr-2"></i>
                {{ isRedeeming ? 'Canjeando...' : (couponInfo && !couponInfo.canUse) ? 'Cupón No Disponible' : 'Canjear Cupón' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useShopStore } from '../stores/shop'
import axios from '../config/axios'

const router = useRouter()
const authStore = useAuthStore()
const shopStore = useShopStore()
const mobileMenuOpen = ref(false)
const showCart = ref(false)

// Variables para el modal de cupones
const showCouponModal = ref(false)
const couponCode = ref('')
const couponInfo = ref(null)
const couponError = ref('')
const couponSuccess = ref('')
const isRedeeming = ref(false)

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}

const toggleCart = () => {
  showCart.value = !showCart.value
}

const proceedToCheckout = () => {
  showCart.value = false
  router.push('/checkout')
}

// Funciones para manejar cupones
const checkCouponInfo = async () => {
  if (!couponCode.value.trim()) {
    couponInfo.value = null
    couponError.value = ''
    return
  }

  try {
    const response = await axios.get(`/api/coupons/${couponCode.value.trim()}`)
    couponInfo.value = response.data
    couponError.value = ''
  } catch (error) {
    couponInfo.value = null
    if (error.response?.status === 404) {
      couponError.value = 'Cupón no encontrado'
    } else {
      couponError.value = 'Error al verificar el cupón'
    }
  }
}

const redeemCoupon = async () => {
  if (!couponCode.value.trim()) return

  isRedeeming.value = true
  couponError.value = ''
  couponSuccess.value = ''

  try {
    const response = await axios.post('/api/coupons/redeem', {
      code: couponCode.value.trim()
    })

    if (response.data.success) {
      couponSuccess.value = response.data.message
      
      // Actualizar el saldo del usuario inmediatamente
      await authStore.fetchUserProfile()
      
      // Cerrar el modal después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        couponCode.value = ''
        couponInfo.value = null
        couponSuccess.value = ''
        couponError.value = ''
        showCouponModal.value = false
      }, 1500)
    } else {
      couponError.value = response.data.error || 'Error al canjear el cupón'
    }

  } catch (error) {
    console.error('Error al canjear cupón:', error)
    couponError.value = error.response?.data?.error || 'Error al canjear el cupón'
  } finally {
    isRedeeming.value = false
  }
}

// Watcher para verificar información del cupón cuando cambia el código
import { watch } from 'vue'
watch(couponCode, () => {
  if (couponCode.value.trim()) {
    checkCouponInfo()
  } else {
    couponInfo.value = null
    couponError.value = ''
  }
})
</script>
