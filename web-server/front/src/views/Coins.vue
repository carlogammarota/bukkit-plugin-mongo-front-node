<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          <i class="fas fa-coins text-yellow-500 mr-3"></i>
          Mis Monedas
        </h1>
        <p class="text-gray-400">Gestiona tus monedas y realiza compras en la tienda</p>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl p-6 mb-8 shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">Saldo Actual</h2>
            <p class="text-3xl font-bold text-white">
              {{ authStore.userCoins.toLocaleString('es-AR') }} monedas
            </p>
          </div>
          <div class="text-6xl opacity-20">
            <i class="fas fa-coins"></i>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Cargar Monedas -->
        <div class="bg-gray-800 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">
            <i class="fas fa-plus-circle text-green-500 mr-2"></i>
            Cargar Monedas
          </h3>
          <p class="text-gray-400 mb-4">Agrega monedas a tu cuenta usando MercadoPago</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Cantidad a cargar
              </label>
              <div class="space-y-3">
                <input
                  v-model="depositAmount"
                  type="number"
                  min="100"
                  step="100"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-craftar-500 focus:border-transparent"
                  placeholder="1000"
                >
                <div class="grid grid-cols-3 gap-2">
                  <button
                    @click="depositAmount = 1000"
                    class="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    💰 $1K
                  </button>
                  <button
                    @click="depositAmount = 5000"
                    class="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    💎 $5K
                  </button>
                  <button
                    @click="depositAmount = 10000"
                    class="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    👑 $10K
                  </button>
                </div>
              </div>
            </div>
            
            <button
              @click="handleDeposit"
              :disabled="!depositAmount || depositAmount < 100 || coinsStore.loading"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <i v-if="coinsStore.loading" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-credit-card mr-2"></i>
              {{ coinsStore.loading ? 'Procesando...' : 'Cargar Monedas' }}
            </button>
          </div>
        </div>

        <!-- Información -->
        <div class="bg-gray-800 rounded-xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">
            <i class="fas fa-info-circle text-blue-500 mr-2"></i>
            Información
          </h3>
          <div class="space-y-3 text-gray-300">
            <div class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>Las monedas se cargan instantáneamente después del pago</span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>Puedes usar tus monedas para comprar en la tienda</span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>Los pagos son seguros con MercadoPago</span>
            </div>
            <div class="flex items-start">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>Monto mínimo de carga: $100 ARS</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transacciones -->
      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">
            <i class="fas fa-history text-purple-500 mr-2"></i>
            Historial de Transacciones
          </h3>
          <button
            @click="loadTransactions"
            :disabled="coinsStore.loading"
            class="text-craftar-400 hover:text-craftar-300 transition-colors"
          >
            <i v-if="coinsStore.loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-sync-alt"></i>
          </button>
        </div>

        <div v-if="coinsStore.loading && transactions.length === 0" class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-600 mb-4"></i>
          <p class="text-gray-400">Cargando transacciones...</p>
        </div>

        <div v-else-if="transactions.length === 0" class="text-center py-8">
          <i class="fas fa-history text-4xl text-gray-600 mb-4"></i>
          <p class="text-gray-400">No tienes transacciones aún</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="transaction in transactions"
            :key="transaction._id"
            class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                   :class="{
                     'bg-green-600': transaction.type === 'deposit',
                     'bg-red-600': transaction.type === 'payment',
                     'bg-blue-600': transaction.type === 'refund'
                   }">
                <i class="fas text-white"
                   :class="{
                     'fa-plus': transaction.type === 'deposit',
                     'fa-minus': transaction.type === 'payment',
                     'fa-undo': transaction.type === 'refund'
                   }"></i>
              </div>
              <div>
                <p class="text-white font-medium">{{ transaction.description }}</p>
                <p class="text-gray-400 text-sm">
                  {{ formatDate(transaction.createdAt) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold"
                 :class="{
                   'text-green-400': transaction.amount > 0,
                   'text-red-400': transaction.amount < 0
                 }">
                {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount.toLocaleString('es-AR') }}
              </p>
              <p class="text-gray-400 text-sm">monedas</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessMessage" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center" @click="showSuccessMessage = false">
      <div class="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-green-500/50" @click.stop>
        <div class="text-center">
          <div class="text-6xl mb-4">✅</div>
          <h3 class="text-2xl font-bold text-white mb-4">¡Pago Exitoso!</h3>
          <p class="text-gray-300 mb-6">
            Tu pago ha sido procesado correctamente y las monedas han sido cargadas a tu cuenta.
          </p>
          <div class="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <p class="text-green-400 font-semibold">
              💰 Saldo actualizado: {{ authStore.userCoins.toLocaleString('es-AR') }} monedas
            </p>
          </div>
          <button 
            @click="showSuccessMessage = false"
            class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ¡Perfecto!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCoinsStore } from '../stores/coins'

const route = useRoute()
const authStore = useAuthStore()
const coinsStore = useCoinsStore()

const depositAmount = ref(1000)
const transactions = ref([])
const showSuccessMessage = ref(false)

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value < 100) {
    alert('El monto mínimo es $100 ARS')
    return
  }

  console.log('Enviando cantidad:', depositAmount.value)
  const result = await coinsStore.depositCoins(depositAmount.value)
  
  if (result.success) {
    // Redirigir a MercadoPago
    window.open(result.data.paymentUrl, '_blank')
  } else {
    alert('Error al crear la carga de monedas: ' + result.error)
  }
}

const loadTransactions = async () => {
  const result = await coinsStore.getTransactions()
  if (result.success) {
    transactions.value = result.data
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await loadTransactions()
  
  // Verificar si viene de una carga exitosa
  if (route.query.payment === 'success') {
    console.log('Carga de monedas exitosa')
    
    // Mostrar mensaje de éxito
    showSuccessMessage.value = true
    
    // Actualizar el saldo del usuario
    await authStore.fetchUserData()
    
    // Limpiar los parámetros de la URL
    window.history.replaceState({}, document.title, '/dashboard/wallet')
  }
})
</script>
