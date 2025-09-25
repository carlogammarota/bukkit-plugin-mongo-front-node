<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-2">
          ¡Bienvenido, {{ authStore.user.username }}!
        </h1>
        <p class="text-gray-400">Panel de control de tu cuenta CraftAR</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-coins text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Monedas</p>
              <p class="text-2xl font-bold text-yellow-400">
                {{ authStore.userCoins.toLocaleString('es-AR') }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-minecraft-green rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-shopping-cart text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Compras</p>
              <p class="text-2xl font-bold">{{ userStats.orders }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-cube text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Items Comprados</p>
              <p class="text-2xl font-bold">{{ userStats.itemsBought }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-calendar-alt text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Miembro desde</p>
              <p class="text-lg font-bold">{{ formatDate(authStore.user.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Info -->
        <div class="lg:col-span-2">
          <div class="card mb-8">
            <h2 class="text-xl font-semibold mb-6">Información del Perfil</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Usuario</span>
                <span class="font-semibold">{{ authStore.user.username }}</span>
              </div>
              <div class="flex items-center justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Email</span>
                <span class="font-semibold">{{ authStore.user.email }}</span>
              </div>
              <div class="flex items-center justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Nombre en Minecraft</span>
                <span class="font-semibold">
                  {{ authStore.user.minecraftUsername || 'No especificado' }}
                </span>
              </div>
              <div class="flex items-center justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Rol</span>
                <span class="font-semibold capitalize">
                  <span :class="authStore.isAdmin ? 'text-red-400' : 'text-green-400'">
                    {{ authStore.user.role }}
                  </span>
                </span>
              </div>
              <div class="flex items-center justify-between py-3">
                <span class="text-gray-400">Último acceso</span>
                <span class="font-semibold">{{ formatDate(authStore.user.lastLogin) }}</span>
              </div>
            </div>
            <div class="mt-6">
              <router-link to="/profile" class="btn-primary p-2 bg-gray-800 rounded-md">
                <i class="fas fa-edit mr-2"></i>
                Editar Perfil
              </router-link>
            </div>
          </div>

          <!-- Minecraft Connection -->
          <div class="card mb-8">
            <h2 class="text-xl font-semibold mb-6">Conexión con Minecraft</h2>
            <div v-if="authStore.user.minecraftUsername" class="space-y-4">
              <div class="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-400 mr-3"></i>
                  <div>
                    <h3 class="font-semibold text-green-300">Cuenta Conectada</h3>
                    <p class="text-green-400 text-sm">
                      Tu cuenta web está conectada con: <strong>{{ authStore.user.minecraftUsername }}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Código de Acceso para Cuenta Conectada -->
              <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <h4 class="font-semibold text-yellow-400 mb-3">
                  <i class="fas fa-key mr-2"></i>
                  Código de Acceso Actual
                </h4>
                
                <!-- Mostrar código existente si está disponible -->
                <div v-if="minecraftCode" class="bg-gray-900 rounded-lg p-3 mb-3">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-white tracking-wider">{{ minecraftCode }}</p>
                    <p v-if="codeTimeRemaining > 0" class="text-orange-400 text-sm mt-1">
                      <i class="fas fa-clock mr-1"></i>
                      Expira en: {{ Math.floor(codeTimeRemaining / 60) }}:{{ (codeTimeRemaining % 60).toString().padStart(2, '0') }}
                    </p>
                    <p v-else class="text-red-400 text-sm mt-1">
                      <i class="fas fa-exclamation-triangle mr-1"></i>
                      Código expirado - genera uno nuevo
                    </p>
                  </div>
                </div>

                <!-- Botón para generar/renovar código -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button 
                    @click="generateMinecraftCode" 
                    :disabled="loadingMinecraftCode"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    <div v-if="loadingMinecraftCode" class="flex items-center justify-center">
                      <div class="spinner mr-2"></div>
                      Generando código...
                    </div>
                    <div v-else class="flex items-center justify-center">
                      <i class="fas fa-sync-alt mr-2"></i>
                      {{ minecraftCode ? 'Renovar Código' : 'Generar Código' }}
                    </div>
                  </button>
                  
                  <button 
                    v-if="minecraftCode" 
                    @click="copyAccessCode"
                    class="btn-secondary flex-1"
                  >
                    <i class="fas fa-copy mr-2"></i>
                    Copiar Código
                  </button>
                </div>

                <div class="mt-4 space-y-2 text-sm text-gray-300">
                  <p><strong>Instrucciones:</strong></p>
                  <ol class="list-decimal list-inside space-y-1 ml-4">
                    <li>Conecta al servidor Minecraft</li>
                    <li>Usa el comando: <code class="bg-gray-700 px-2 py-1 rounded">/login {{ minecraftCode || 'XXXXXXX' }}</code></li>
                    <li>¡Tu cuenta web estará conectada!</li>
                    <li><strong>Importante:</strong> Este código expira en 5 minutos</li>
                  </ol>
                </div>
                
                <div class="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
                  <div class="flex items-start">
                    <i class="fas fa-info-circle text-blue-400 mr-2 mt-1"></i>
                    <div class="text-sm text-blue-300">
                      <p><strong>¿Por qué necesito un código cada 5 minutos?</strong></p>
                      <p class="mt-1">Por seguridad, el código expira cada 5 minutos. Si necesitas más tiempo, simplemente genera uno nuevo desde aquí.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="space-y-4">
              <div class="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <div class="flex items-center mb-4">
                  <i class="fas fa-info-circle text-blue-400 mr-3"></i>
                  <div>
                    <h3 class="font-semibold text-blue-300">Conecta tu cuenta con Minecraft</h3>
                    <p class="text-blue-400 text-sm">
                      Genera un código temporal para conectar tu cuenta web con tu personaje de Minecraft
                    </p>
                  </div>
                </div>
                
                <button 
                  @click="generateMinecraftCode" 
                  :disabled="loadingMinecraftCode"
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="loadingMinecraftCode" class="flex items-center">
                    <div class="spinner mr-2"></div>
                    Generando código...
                  </div>
                  <div v-else class="flex items-center">
                    <i class="fas fa-gamepad mr-2"></i>
                    Generar Código de Acceso
                  </div>
                </button>
              </div>

              <!-- Generated Code Display -->
              <div v-if="minecraftCode" class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <h4 class="font-semibold text-yellow-400 mb-3">
                  <i class="fas fa-key mr-2"></i>
                  Código de Acceso Temporal
                </h4>
                <div class="bg-gray-900 rounded-lg p-3 mb-3">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-white tracking-wider">{{ minecraftCode }}</p>
                    <p v-if="codeTimeRemaining > 0" class="text-orange-400 text-sm mt-1">
                      <i class="fas fa-clock mr-1"></i>
                      Expira en: {{ Math.floor(codeTimeRemaining / 60) }}:{{ (codeTimeRemaining % 60).toString().padStart(2, '0') }}
                    </p>
                    <p v-else class="text-red-400 text-sm mt-1">
                      <i class="fas fa-exclamation-triangle mr-1"></i>
                      Código expirado - genera uno nuevo
                    </p>
                  </div>
                </div>
                <div class="space-y-2 text-sm text-gray-300">
                  <p><strong>Instrucciones:</strong></p>
                  <ol class="list-decimal list-inside space-y-1 ml-4">
                    <li>Conecta al servidor Minecraft</li>
                    <li>Usa el comando: <code class="bg-gray-700 px-2 py-1 rounded">/login {{ minecraftCode }}</code></li>
                    <li>¡Tu cuenta web estará conectada!</li>
                    <li><strong>Importante:</strong> Este código expira en 5 minutos</li>
                  </ol>
                </div>
                <div class="mt-4 p-3 bg-orange-900/20 border border-orange-500 rounded-lg">
                  <div class="flex items-start">
                    <i class="fas fa-info-circle text-orange-400 mr-2 mt-1"></i>
                    <div class="text-sm text-orange-300">
                      <p><strong>¿Por qué el código cambia cada 5 minutos?</strong></p>
                      <p class="mt-1">Por seguridad, el código expira cada 5 minutos. Si necesitas más tiempo, simplemente genera uno nuevo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="card">
            <h2 class="text-xl font-semibold mb-6">Compras Recientes</h2>
            <div v-if="recentOrders.length === 0" class="text-center py-8">
              <i class="fas fa-shopping-cart text-4xl text-gray-600 mb-4"></i>
              <p class="text-gray-400 mb-4">No tienes compras recientes</p>
              <router-link to="/shop" class="btn-primary">
                <i class="fas fa-store mr-2"></i>
                Ir a la Tienda
              </router-link>
            </div>
            <div v-else class="space-y-4">
              <div v-for="order in recentOrders" :key="order._id || order.id" class="border border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h3 class="text-lg font-semibold">Orden #{{ order._id ? order._id.slice(-8) : 'N/A' }}</h3>
                    <p class="text-gray-400 text-sm">{{ formatDate(order.createdAt) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xl font-bold text-craftar-400">
                      {{ order.paymentMethod === 'coins' ? order.totalAmount.toLocaleString('es-AR') + ' monedas' : '$' + order.totalAmount.toLocaleString('es-AR') }}
                    </p>
                    <span :class="getStatusColor(order.status)" class="text-sm font-medium">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                </div>

                <!-- Order Items -->
                <div class="mb-3">
                  <h4 class="text-sm font-medium text-gray-400 mb-2">Items comprados:</h4>
                  <div class="space-y-1">
                    <div v-for="item in order.items" :key="item.productId._id" class="flex items-center justify-between text-sm">
                      <span class="flex items-center">
                        <i class="fas fa-cube text-gray-500 mr-2"></i>
                        {{ item.productId.name }} x{{ item.quantity }}
                      </span>
                      <span class="text-gray-400">
                        {{ order.paymentMethod === 'coins' ? (item.price * item.quantity).toLocaleString('es-AR') + ' monedas' : '$' + (item.price * item.quantity).toLocaleString('es-AR') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Payment Info -->
                <div class="mb-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">Método de pago:</span>
                    <span class="capitalize flex items-center">
                      <i class="fas fa-coins mr-1 text-yellow-500" v-if="order.paymentMethod === 'coins'"></i>
                      <i class="fas fa-credit-card mr-1 text-blue-500" v-else-if="order.paymentMethod === 'mercadopago'"></i>
                      <i class="fas fa-wallet mr-1 text-green-500" v-else></i>
                      {{ getPaymentMethodText(order.paymentMethod) }}
                    </span>
                  </div>
                  <div v-if="order.walletAmountUsed > 0" class="flex items-center justify-between text-sm mt-1">
                    <span class="text-gray-400">
                      {{ order.paymentMethod === 'coins' ? 'Monedas usadas:' : 'Saldo usado:' }}
                    </span>
                    <span class="text-craftar-400">
                      {{ order.paymentMethod === 'coins' ? order.walletAmountUsed.toLocaleString('es-AR') + ' monedas' : '$' + order.walletAmountUsed.toLocaleString('es-AR') }}
                    </span>
                  </div>
                </div>

                <!-- Delivery Status -->
                <div class="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div class="flex items-center">
                    <i :class="getDeliveryIcon(order.status)" class="mr-2"></i>
                    <span class="text-sm text-gray-400">
                      {{ getDeliveryStatus(order.status) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      v-if="order.status === 'pending'" 
                      @click="goToOrders"
                      class="btn-primary text-xs px-3 py-1"
                    >
                      <i class="fas fa-credit-card mr-1"></i>
                      Pagar
                    </button>
                    <button 
                      v-if="order.status === 'paying'" 
                      @click="goToOrders"
                      class="btn-secondary text-xs px-3 py-1"
                    >
                      <i class="fas fa-external-link-alt mr-1"></i>
                      Continuar
                    </button>
                    <button 
                      v-if="order.status === 'delivered'" 
                      @click="goToOrders"
                      class="btn-secondary text-xs px-3 py-1"
                    >
                      <i class="fas fa-eye mr-1"></i>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-6">Acciones Rápidas</h3>
            <div class="space-y-4">
              <router-link to="/shop" class="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-all duration-300 group">
                <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 transition-colors duration-300">
                  <i class="fas fa-store text-green-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-white group-hover:text-green-400 transition-colors duration-300">Ir a la Tienda</h4>
                  <p class="text-sm text-gray-400">Comprar items para Minecraft</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400 group-hover:text-green-400 transition-colors duration-300"></i>
              </router-link>
              
              <router-link to="/profile" class="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-all duration-300 group">
                <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <i class="fas fa-user text-blue-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">Mi Perfil</h4>
                  <p class="text-sm text-gray-400">Editar información personal</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-400 transition-colors duration-300"></i>
              </router-link>
              
              <router-link to="/dashboard/orders" class="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-all duration-300 group">
                <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <i class="fas fa-shopping-cart text-purple-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">Mis Órdenes</h4>
                  <p class="text-sm text-gray-400">Ver historial de compras</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400 group-hover:text-purple-400 transition-colors duration-300"></i>
              </router-link>
              
              <router-link to="/dashboard/coins" class="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-all duration-300 group">
                <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-500/30 transition-colors duration-300">
                  <i class="fas fa-coins text-yellow-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">Mis Monedas</h4>
                  <p class="text-sm text-gray-400">Gestionar saldo de monedas</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400 group-hover:text-yellow-400 transition-colors duration-300"></i>
              </router-link>
              
              <router-link v-if="authStore.isAdmin" to="/admin" class="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-all duration-300 group">
                <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-500/30 transition-colors duration-300">
                  <i class="fas fa-cog text-red-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-white group-hover:text-red-400 transition-colors duration-300">Administración</h4>
                  <p class="text-sm text-gray-400">Panel de administración</p>
                </div>
                <i class="fas fa-chevron-right text-gray-400 group-hover:text-red-400 transition-colors duration-300"></i>
              </router-link>
            </div>
          </div>

          <!-- Server Info -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Información del Servidor</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">IP del Servidor</span>
                <span class="font-mono text-craftar-400">play.craftar.com</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Versión</span>
                <span class="text-green-400">1.20.4</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Jugadores Online</span>
                <span class="text-yellow-400">{{ onlinePlayers }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Estado</span>
                <span class="text-green-400">Online</span>
              </div>
            </div>
            <button @click="copyServerIP" class="w-full mt-4 btn-primary p-2 bg-gray-800 rounded-md">
              <i class="fas fa-copy mr-2"></i>
              Copiar IP
            </button>
          </div>

          <!-- Tips -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Consejos</h3>
            <div class="space-y-3 text-sm text-gray-400">
              <div class="flex items-start">
                <i class="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i>
                <p>Conecta tu cuenta de Minecraft para recibir items automáticamente</p>
              </div>
              <div class="flex items-start">
                <i class="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i>
                <p>Participa en eventos para ganar items gratis</p>
              </div>
              <div class="flex items-start">
                <i class="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i>
                <p>Únete a nuestro Discord para noticias y soporte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../config/axios'

const router = useRouter()
const authStore = useAuthStore()
const onlinePlayers = ref(0)
const userStats = reactive({
  orders: 0,
  itemsBought: 0
})
const recentOrders = ref([])
const minecraftCode = ref('')
const loadingMinecraftCode = ref(false)
const codeTimeRemaining = ref(0)
const codeExpiresAt = ref(null)
let codeTimer = null

const formatDate = (dateString) => {
  if (!dateString) return 'Nunca'
  return new Date(dateString).toLocaleDateString('es-AR')
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-400',
    paid: 'text-blue-400',
    delivered: 'text-green-400',
    cancelled: 'text-red-400'
  }
  return colors[status] || 'text-gray-400'
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

const getPaymentMethodText = (method) => {
  const methods = {
    mercadopago: 'MercadoPago',
    wallet: 'Cartera',
    coins: 'Monedas'
  }
  return methods[method] || method
}

const getDeliveryIcon = (status) => {
  const icons = {
    pending: 'fas fa-clock text-yellow-400',
    paying: 'fas fa-spinner fa-spin text-blue-400',
    paid: 'fas fa-check-circle text-green-400',
    delivered: 'fas fa-check-double text-green-400',
    cancelled: 'fas fa-times-circle text-red-400',
    error: 'fas fa-exclamation-triangle text-red-400'
  }
  return icons[status] || 'fas fa-question-circle text-gray-400'
}

const getDeliveryStatus = (status) => {
  const statuses = {
    pending: 'Esperando pago',
    paying: 'Procesando pago',
    paid: 'Pago confirmado',
    delivered: 'Items entregados en el juego',
    cancelled: 'Orden cancelada',
    error: 'Error en el pago'
  }
  return statuses[status] || 'Estado desconocido'
}

const goToOrders = () => {
  // Redirigir a la página de órdenes
  router.push('/dashboard/orders')
}

const copyServerIP = async () => {
  try {
    await navigator.clipboard.writeText('play.craftar.com')
    // Show success message
    console.log('IP copiada al portapapeles')
  } catch (err) {
    console.error('Error al copiar IP:', err)
  }
}

const copyAccessCode = async () => {
  try {
    if (minecraftCode.value) {
      await navigator.clipboard.writeText(minecraftCode.value)
      // Show success message
      console.log('Código copiado al portapapeles')
      // Aquí podrías agregar una notificación visual
    }
  } catch (err) {
    console.error('Error al copiar código:', err)
  }
}

const generateMinecraftCode = async () => {
  try {
    loadingMinecraftCode.value = true
    const response = await api.post('/api/auth/minecraft-code')
    
    if (response.data.success) {
      minecraftCode.value = response.data.accessCode
      codeExpiresAt.value = new Date(response.data.expiresAt)
      
      // Limpiar timer anterior si existe
      if (codeTimer) {
        clearInterval(codeTimer)
      }
      
      // Iniciar contador de tiempo
      startCodeTimer()
    }
  } catch (error) {
    console.error('Error generating Minecraft code:', error)
    alert('Error al generar el código de acceso')
  } finally {
    loadingMinecraftCode.value = false
  }
}

const startCodeTimer = () => {
  const updateTimer = () => {
    if (!codeExpiresAt.value) return
    
    const now = new Date()
    const timeLeft = Math.max(0, Math.floor((codeExpiresAt.value - now) / 1000))
    codeTimeRemaining.value = timeLeft
    
    if (timeLeft <= 0) {
      clearInterval(codeTimer)
      codeTimer = null
      // Opcional: limpiar el código cuando expire
      // minecraftCode.value = ''
    }
  }
  
  updateTimer() // Actualizar inmediatamente
  codeTimer = setInterval(updateTimer, 1000) // Actualizar cada segundo
}

const loadUserData = async () => {
  try {
    // Load user orders
    const ordersResponse = await api.get('/api/orders')
    recentOrders.value = ordersResponse.data.slice(0, 5)
    userStats.orders = ordersResponse.data.length
    
    // Calculate items bought
    userStats.itemsBought = ordersResponse.data.reduce((total, order) => {
      return total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0)
    }, 0)
    
    // Simulate online players
    onlinePlayers.value = Math.floor(Math.random() * 50) + 20
    
    // Cargar código existente si existe
    await loadExistingCode()
    
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const loadExistingCode = async () => {
  try {
    const response = await api.get('/api/auth/my-code')
    
    if (response.data.success) {
      minecraftCode.value = response.data.accessCode
      codeExpiresAt.value = new Date(response.data.expiresAt)
      
      // Iniciar contador si el código aún es válido
      if (response.data.timeRemaining > 0) {
        codeTimeRemaining.value = response.data.timeRemaining
        startCodeTimer()
      } else {
        // Código expirado, limpiar
        minecraftCode.value = ''
        codeTimeRemaining.value = 0
      }
    }
  } catch (error) {
    // No hay código válido o error - esto es normal
    console.log('No hay código válido o error al cargar:', error.message)
  }
}

// Auto-recargar código cada 4 minutos para usuarios conectados
let codeRefreshInterval = null

const startCodeRefresh = () => {
  if (codeRefreshInterval) {
    clearInterval(codeRefreshInterval)
  }
  
  // Solo auto-recargar si el usuario tiene minecraftUsername (cuenta conectada)
  if (authStore.user.minecraftUsername) {
    codeRefreshInterval = setInterval(async () => {
      try {
        await loadExistingCode()
      } catch (error) {
        console.error('Error auto-recargando código:', error)
      }
    }, 4 * 60 * 1000) // Cada 4 minutos
  }
}

onMounted(() => {
  loadUserData()
  // Iniciar auto-recarga de código si el usuario está conectado
  startCodeRefresh()
})

onUnmounted(() => {
  if (codeTimer) {
    clearInterval(codeTimer)
  }
  if (codeRefreshInterval) {
    clearInterval(codeRefreshInterval)
  }
})
</script>
