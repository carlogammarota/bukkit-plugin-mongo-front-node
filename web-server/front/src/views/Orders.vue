<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-2">
          Mis Órdenes
        </h1>
        <p class="text-gray-400">Gestiona tus compras y pagos</p>
      </div>

      <!-- Wallet Balance -->
      <div class="card mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-craftar-600 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-wallet text-white text-xl"></i>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Saldo de Cartera</p>
              <p class="text-2xl font-bold text-craftar-400">
                ${{ walletBalance.toLocaleString('es-AR') }}
              </p>
            </div>
          </div>
          <button @click="showDepositModal = true" class="btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Cargar Saldo
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Historial de Órdenes</h2>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-400">Actualización automática</span>
            </div>
            <button @click="refreshOrders" class="btn-secondary">
              <i class="fas fa-sync-alt mr-2"></i>
              Actualizar
            </button>
          </div>
        </div>

        <div v-if="orders.length === 0" class="text-center py-12">
          <i class="fas fa-shopping-cart text-6xl text-gray-600 mb-4"></i>
          <p class="text-gray-400 mb-4">No tienes órdenes aún</p>
          <router-link to="/shop" class="btn-primary">
            <i class="fas fa-store mr-2"></i>
            Ir a la Tienda
          </router-link>
        </div>

        <div v-else class="space-y-4">
          <div v-for="order in orders" :key="order._id || order.id" class="border border-gray-700 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold">Orden #{{ order._id ? order._id.slice(-8) : 'N/A' }}</h3>
                <p class="text-gray-400 text-sm">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-craftar-400">
                  ${{ order.totalAmount.toLocaleString('es-AR') }}
                </p>
                <span :class="getStatusColor(order.status)" class="text-sm font-medium">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-400 mb-2">Items:</h4>
              <div class="space-y-2">
                <div v-for="item in order.items" :key="item.productId._id" class="flex items-center justify-between text-sm">
                  <div class="flex items-center">
                    <!-- Product Image -->
                    <div class="w-8 h-8 bg-gray-700 rounded mr-3 flex items-center justify-center flex-shrink-0">
                      <img 
                        v-if="item.productId.image" 
                        :src="item.productId.image" 
                        :alt="item.productId.name"
                        class="w-full h-full object-cover rounded"
                        @error="handleImageError($event)"
                      />
                      <i v-else class="fas fa-cube text-gray-500 text-xs"></i>
                    </div>
                    <span>{{ item.productId.name }} x{{ item.quantity }}</span>
                  </div>
                  <span class="text-gray-400">${{ (item.price * item.quantity).toLocaleString('es-AR') }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Método de pago:</span>
                <span class="capitalize">{{ getPaymentMethodText(order.paymentMethod) }}</span>
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

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-700">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-400">
                  {{ getStatusDescription(order.status) }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  v-if="order.status === 'pending'" 
                  @click="payOrder(order)"
                  class="btn-primary"
                >
                  <i class="fas fa-credit-card mr-2"></i>
                  Pagar
                </button>
                <button 
                  v-if="order.status === 'paying'" 
                  @click="openPaymentUrl(order)"
                  class="btn-secondary"
                >
                  <i class="fas fa-external-link-alt mr-2"></i>
                  Continuar Pago
                </button>
                <button 
                  v-if="order.status === 'delivered'" 
                  @click="viewOrderDetails(order)"
                  class="btn-secondary"
                >
                  <i class="fas fa-eye mr-2"></i>
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deposit Modal -->
    <div v-if="showDepositModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Cargar Saldo</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">Monto a cargar</label>
          <input 
            v-model="depositAmount" 
            type="number" 
            min="100" 
            step="100"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-craftar-500"
            placeholder="Ingresa el monto"
          >
        </div>
        <div class="flex items-center justify-end space-x-3">
          <button @click="showDepositModal = false" class="btn-secondary">
            Cancelar
          </button>
          <button @click="processDeposit" class="btn-primary" :disabled="!depositAmount || depositAmount < 100">
            <i class="fas fa-credit-card mr-2"></i>
            Cargar con MercadoPago
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Procesar Pago</h3>
        <div class="mb-4">
          <p class="text-gray-400 mb-4">Selecciona el método de pago:</p>
          <div class="space-y-3">
            <label class="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700">
              <input v-model="paymentMethod" type="radio" value="mercadopago" class="mr-3">
              <div>
                <div class="font-medium">MercadoPago</div>
                <div class="text-sm text-gray-400">Pago completo con MercadoPago</div>
              </div>
            </label>
            <label class="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700">
              <input v-model="paymentMethod" type="radio" value="wallet" class="mr-3">
              <div>
                <div class="font-medium">Saldo de Cartera</div>
                <div class="text-sm text-gray-400">Usar saldo disponible: ${{ walletBalance.toLocaleString('es-AR') }}</div>
              </div>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-3">
          <button @click="showPaymentModal = false" class="btn-secondary">
            Cancelar
          </button>
          <button @click="processPayment" class="btn-primary" :disabled="!paymentMethod">
            <i class="fas fa-credit-card mr-2"></i>
            Procesar Pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useShopStore } from '../stores/shop'
import api from '../config/axios'
import { io } from 'socket.io-client'

const route = useRoute()
const authStore = useAuthStore()
const shopStore = useShopStore()
const orders = ref([])
const walletBalance = ref(0)
const showDepositModal = ref(false)
const showPaymentModal = ref(false)
const depositAmount = ref('')
const paymentMethod = ref('mercadopago')
const selectedOrder = ref(null)
const socket = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-400',
    paying: 'text-blue-400',
    paid: 'text-green-400',
    delivered: 'text-green-400',
    cancelled: 'text-red-400',
    error: 'text-red-400'
  }
  return colors[status] || 'text-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    paying: 'Pagando',
    paid: 'Pagado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    error: 'Error'
  }
  return texts[status] || status
}

const getStatusDescription = (status) => {
  const descriptions = {
    pending: 'Esperando pago',
    paying: 'Procesando pago',
    paid: 'Pago confirmado',
    delivered: 'Items entregados',
    cancelled: 'Orden cancelada',
    error: 'Error en el pago'
  }
  return descriptions[status] || ''
}

const getPaymentMethodText = (method) => {
  const methods = {
    mercadopago: 'MercadoPago',
    wallet: 'Cartera',
    coins: 'Monedas'
  }
  return methods[method] || method
}

const handleImageError = (event) => {
  // Si la imagen falla al cargar, ocultarla y mostrar el ícono por defecto
  event.target.style.display = 'none'
}

const loadOrders = async () => {
  try {
    const response = await api.get('/api/orders')
    orders.value = response.data
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

const loadWalletBalance = async () => {
  try {
    const response = await api.get('/api/wallet/balance')
    walletBalance.value = response.data.balance
  } catch (error) {
    console.error('Error loading wallet balance:', error)
  }
}

const refreshOrders = () => {
  loadOrders()
  loadWalletBalance()
}

const payOrder = (order) => {
  selectedOrder.value = order
  showPaymentModal.value = true
}

const processPayment = async () => {
  try {
    const response = await api.post(`/api/orders/${selectedOrder.value._id}/pay`, {
      paymentMethod: paymentMethod.value,
      walletAmount: paymentMethod.value === 'wallet' ? selectedOrder.value.totalAmount : null
    })

    if (paymentMethod.value === 'mercadopago') {
      // Redirigir a MercadoPago
      window.open(response.data.paymentUrl, '_blank')
    } else {
      // Pago con cartera procesado
      await refreshOrders()
    }

    showPaymentModal.value = false
    selectedOrder.value = null
  } catch (error) {
    console.error('Error processing payment:', error)
    alert('Error al procesar el pago')
  }
}

const openPaymentUrl = (order) => {
  // Aquí podrías obtener la URL de pago desde la orden
  // Por ahora, redirigimos a MercadoPago
  window.open('https://www.mercadopago.com.ar', '_blank')
}

const viewOrderDetails = (order) => {
  // Implementar vista de detalles
  console.log('View order details:', order)
}

const processDeposit = async () => {
  try {
    const response = await api.post('/api/wallet/deposit', {
      amount: parseInt(depositAmount.value)
    })

    // Redirigir a MercadoPago
    window.open(response.data.paymentUrl, '_blank')
    
    showDepositModal.value = false
    depositAmount.value = ''
  } catch (error) {
    console.error('Error processing deposit:', error)
    alert('Error al procesar la carga de saldo')
  }
}

const setupSocket = () => {
  socket.value = io('https://cd2426bdec3d.ngrok-free.app')
  
  socket.value.on('connect', () => {
    console.log('Conectado al socket')
    // Unirse a la sala del usuario
    socket.value.emit('join-user-room', authStore.user.id)
  })

  socket.value.on('order-updated', (data) => {
    console.log('Orden actualizada:', data)
    // Actualizar la orden específica
    const orderIndex = orders.value.findIndex(order => (order._id || order.id) === data.orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = data.status
    }
  })

  socket.value.on('wallet-updated', (data) => {
    console.log('Cartera actualizada:', data)
    walletBalance.value = data.newBalance
    authStore.updateBalance(data.newBalance)
  })

  socket.value.on('coins-updated', (data) => {
    console.log('Monedas actualizadas:', data)
    walletBalance.value = data.newBalance
    authStore.updateCoins(data.newCoins)
  })
}

onMounted(() => {
  loadOrders()
  loadWalletBalance()
  setupSocket()
  
  // Verificar si viene de una compra exitosa y limpiar carrito
  if (route.query.payment === 'success' || route.query.status === 'approved') {
    shopStore.clearCart()
    console.log('Carrito limpiado después de compra exitosa')
  }
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.emit('leave-user-room', authStore.user.id)
    socket.value.disconnect()
  }
})
</script>
