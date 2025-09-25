<template>
  <div class="min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-2">Finalizar Compra</h1>
        <p class="text-gray-400">Revisa tu pedido y completa el pago</p>
      </div>

      <div v-if="shopStore.cart.length === 0" class="text-center py-12">
        <i class="fas fa-shopping-cart text-6xl text-gray-600 mb-4"></i>
        <h3 class="text-2xl font-semibold mb-2">Tu carrito está vacío</h3>
        <p class="text-gray-400 mb-6">Agrega algunos items antes de proceder al pago</p>
        <router-link to="/shop" class="btn-primary">
          <i class="fas fa-store mr-2"></i>
          Ir a la Tienda
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Summary -->
        <div class="lg:col-span-2">
          <div class="card mb-6">
            <h2 class="text-xl font-semibold mb-6">Resumen del Pedido</h2>
            <div class="space-y-4">
              <div v-for="item in shopStore.cart" :key="item.id" class="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <i class="fas fa-cube text-gray-500"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ item.name }}</h3>
                    <p class="text-gray-400 text-sm">{{ item.minecraftItem }}</p>
                    <div v-if="item.defaultQuantity && item.defaultQuantity > 1" class="mt-1">
                      <span class="text-xs text-blue-400">
                        <i class="fas fa-info-circle mr-1"></i>
                        {{ item.quantity }} unidad(es) × {{ item.defaultQuantity }} = {{ item.quantity * item.defaultQuantity }} total
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold">${{ item.price.toLocaleString('es-AR') }}</p>
                  <p class="text-gray-400 text-sm">x{{ item.quantity }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <div class="card">
            <h2 class="text-xl font-semibold mb-6">Información de Pago</h2>
            <form @submit.prevent="processPayment">
              <!-- Payment Method -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-3">Método de Pago</label>
                <div class="space-y-4">
                  <!-- MercadoPago -->
                  <label class="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-craftar-500 transition-colors duration-300"
                         :class="{ 'border-craftar-500 bg-craftar-500/10': paymentMethod === 'mercadopago' }">
                    <input v-model="paymentMethod" type="radio" value="mercadopago" class="sr-only">
                    <i class="fas fa-credit-card text-2xl mr-3 text-craftar-400"></i>
                    <div>
                      <p class="font-semibold text-white">MercadoPago</p>
                      <p class="text-gray-400 text-sm">Tarjetas, transferencias, efectivo</p>
                    </div>
                  </label>

                  <!-- Pagar con Monedas -->
                  <label class="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors duration-300"
                         :class="{ 'border-yellow-500 bg-yellow-500/10': paymentMethod === 'coins' }">
                    <input v-model="paymentMethod" type="radio" value="coins" class="sr-only">
                    <i class="fas fa-coins text-2xl mr-3 text-yellow-500"></i>
                    <div>
                      <p class="font-semibold text-white">Pagar con Monedas</p>
                      <p class="text-gray-400 text-sm">
                        Tienes {{ authStore.userCoins.toLocaleString('es-AR') }} monedas disponibles
                        <span v-if="authStore.userCoins < shopStore.cartTotal" class="text-red-400 ml-2">
                          (Insuficientes)
                        </span>
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Payment Info -->
              <div v-if="paymentMethod" class="space-y-4">
                <!-- MercadoPago Info -->
                <div v-if="paymentMethod === 'mercadopago'" class="bg-craftar-500/10 border border-craftar-500 rounded-lg p-4">
                  <div class="flex items-center">
                    <i class="fas fa-info-circle text-craftar-400 mr-3"></i>
                    <div>
                      <p class="font-semibold text-white">Pago Seguro con MercadoPago</p>
                      <p class="text-gray-400 text-sm">Serás redirigido a MercadoPago para completar el pago de forma segura</p>
                    </div>
                  </div>
                </div>

                <!-- Monedas Info -->
                <div v-if="paymentMethod === 'coins'" class="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
                  <div class="flex items-center">
                    <i class="fas fa-coins text-yellow-500 mr-3"></i>
                    <div>
                      <p class="font-semibold text-white">Pago con Monedas</p>
                      <p class="text-gray-400 text-sm">
                        Se descontarán {{ shopStore.cartTotal.toLocaleString('es-AR') }} monedas de tu cuenta
                        <span v-if="authStore.userCoins >= shopStore.cartTotal" class="text-green-400 ml-2">
                          ✓ Saldo suficiente
                        </span>
                        <span v-else class="text-red-400 ml-2">
                          ✗ Saldo insuficiente
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Terms -->
              <div class="mt-6">
                <label class="flex items-start">
                  <input v-model="acceptTerms" type="checkbox" required class="h-4 w-4 text-craftar-600 focus:ring-craftar-500 border-gray-600 rounded bg-gray-800 mt-1">
                  <span class="ml-2 text-sm text-gray-300">
                    Acepto los 
                    <a href="#" class="text-craftar-400 hover:text-craftar-300">Términos de Servicio</a>
                    y confirmo que los items serán entregados en el servidor de Minecraft.
                  </span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="!isFormValid || shopStore.loading || (paymentMethod === 'coins' && authStore.userCoins < shopStore.cartTotal)"
                class="w-full mt-6 btn-minecraft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div v-if="shopStore.loading" class="flex items-center justify-center">
                  <div class="spinner mr-2"></div>
                  Procesando Pago...
                </div>
                <div v-else class="flex items-center justify-center">
                  <i v-if="paymentMethod === 'mercadopago'" class="fas fa-credit-card mr-2"></i>
                  <i v-else-if="paymentMethod === 'coins'" class="fas fa-coins mr-2"></i>
                  <span v-if="paymentMethod === 'mercadopago'">
                    Pagar ${{ shopStore.cartTotal.toLocaleString('es-AR') }}
                  </span>
                  <span v-else-if="paymentMethod === 'coins'">
                    Pagar con {{ shopStore.cartTotal.toLocaleString('es-AR') }} monedas
                  </span>
                </div>
              </button>
            </form>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="space-y-6">
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Resumen de Compra</h3>
            <div class="space-y-3">
              <div v-for="item in shopStore.cart" :key="item.id" class="flex justify-between text-sm">
                <div>
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <div v-if="item.defaultQuantity && item.defaultQuantity > 1" class="text-xs text-blue-400">
                    ({{ item.quantity * item.defaultQuantity }} total)
                  </div>
                </div>
                <span>${{ (item.price * item.quantity).toLocaleString('es-AR') }}</span>
              </div>
              <div class="border-t border-gray-700 pt-3">
                <div class="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>${{ shopStore.cartTotal.toLocaleString('es-AR') }}</span>
                </div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Impuestos</span>
                  <span>$0</span>
                </div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Envío</span>
                  <span class="text-green-400">Gratis</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t border-gray-700 pt-3">
                  <span>Total</span>
                  <span class="text-craftar-400">${{ shopStore.cartTotal.toLocaleString('es-AR') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Monedas Info -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">
              <i class="fas fa-coins text-yellow-500 mr-2"></i>
              Mis Monedas
            </h3>
            <div class="text-center mb-4">
              <p class="text-2xl font-bold text-yellow-400">
                {{ authStore.userCoins.toLocaleString('es-AR') }}
              </p>
              <p class="text-gray-400 text-sm">monedas disponibles</p>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Costo total:</span>
                <span class="text-white">{{ shopStore.cartTotal.toLocaleString('es-AR') }} monedas</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Después del pago:</span>
                <span :class="authStore.userCoins >= shopStore.cartTotal ? 'text-green-400' : 'text-red-400'">
                  {{ (authStore.userCoins - shopStore.cartTotal).toLocaleString('es-AR') }} monedas
                </span>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-700">
              <router-link to="/dashboard/coins" class="text-yellow-400 hover:text-yellow-300 text-sm flex items-center justify-center">
                <i class="fas fa-plus mr-2"></i>
                Cargar más monedas
              </router-link>
            </div>
          </div>

          <!-- Security Info -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Información de Seguridad</h3>
            <div class="space-y-3 text-sm text-gray-400">
              <div class="flex items-center">
                <i class="fas fa-shield-alt text-green-400 mr-2"></i>
                <span>Pago 100% seguro</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-lock text-green-400 mr-2"></i>
                <span>Datos encriptados</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-bolt text-green-400 mr-2"></i>
                <span>Entrega instantánea</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-undo text-green-400 mr-2"></i>
                <span>Garantía de devolución</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '../stores/shop'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const shopStore = useShopStore()
const authStore = useAuthStore()

const paymentMethod = ref('mercadopago')
const acceptTerms = ref(false)

const isFormValid = computed(() => {
  return paymentMethod.value && acceptTerms.value
})


const processPayment = async () => {
  if (!isFormValid.value) return

  // Create order
  const orderResult = await shopStore.createOrder()
  if (!orderResult.success) {
    alert('Error al crear la orden: ' + orderResult.error)
    return
  }

  // Process payment
  const paymentResult = await shopStore.processPayment(orderResult.order.id, paymentMethod.value)
  if (paymentResult.success) {
    if (paymentResult.redirect) {
      // Redirigir directamente a MercadoPago
      window.location.href = paymentResult.paymentUrl
    } else {
      // Pago procesado inmediatamente (cartera)
      shopStore.clearCart()
      router.push('/dashboard?payment=success')
    }
  } else {
    alert('Error al procesar el pago: ' + paymentResult.error)
  }
}

onMounted(() => {
  if (shopStore.cart.length === 0) {
    router.push('/shop')
  }
})
</script>
