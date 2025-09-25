<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-craftar-500 to-craftar-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-cube text-white text-2xl"></i>
          </div>
        </div>
        <h2 class="text-3xl font-bold gradient-text mb-2">Crear Cuenta</h2>
        <p class="text-gray-400">Regístrate en el sitio web para acceder al servidor</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Error Message -->
        <div v-if="authStore.error" class="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
            <span class="text-red-300">{{ authStore.error }}</span>
          </div>
        </div>

        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
            Nombre de Usuario
          </label>
          <div class="relative">
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input-field pl-10"
              placeholder="Elige un nombre de usuario"
            >
            <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div class="relative">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field pl-10"
              placeholder="tu@email.com"
            >
            <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input-field pl-10 pr-10"
              placeholder="Mínimo 6 caracteres"
            >
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="input-field pl-10 pr-10"
              placeholder="Repite tu contraseña"
            >
            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Password Validation -->
        <div v-if="form.password" class="space-y-2">
          <div class="flex items-center text-sm">
            <i :class="form.password.length >= 6 ? 'fas fa-check text-green-400' : 'fas fa-times text-red-400'" class="mr-2"></i>
            <span :class="form.password.length >= 6 ? 'text-green-400' : 'text-red-400'">
              Mínimo 6 caracteres
            </span>
          </div>
          <div class="flex items-center text-sm">
            <i :class="form.password === form.confirmPassword && form.confirmPassword ? 'fas fa-check text-green-400' : 'fas fa-times text-red-400'" class="mr-2"></i>
            <span :class="form.password === form.confirmPassword && form.confirmPassword ? 'text-green-400' : 'text-red-400'">
              Las contraseñas coinciden
            </span>
          </div>
        </div>

        <!-- Terms -->
        <div class="flex items-start">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-craftar-600 focus:ring-craftar-500 border-gray-600 rounded bg-gray-800 mt-1"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-300">
            Acepto los 
            <a href="#" class="text-craftar-400 hover:text-craftar-300">Términos de Servicio</a>
            y la 
            <a href="#" class="text-craftar-400 hover:text-craftar-300">Política de Privacidad</a>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading || !isFormValid"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="authStore.loading" class="flex items-center justify-center">
            <div class="spinner mr-2"></div>
            Creando cuenta...
          </div>
          <div v-else class="flex items-center justify-center">
            <i class="fas fa-user-plus mr-2"></i>
            Crear Cuenta
          </div>
        </button>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-900 text-gray-400">O</span>
          </div>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-gray-400">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-craftar-400 hover:text-craftar-300 font-semibold">
              Inicia sesión aquí
            </router-link>
          </p>
        </div>
      </form>

      <!-- Benefits -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-300 mb-3">¿Cómo funciona?</h3>
        <div class="text-xs text-gray-400 space-y-2">
          <div class="flex items-start">
            <span class="bg-craftar-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
            <span>Regístrate aquí con tu usuario y contraseña</span>
          </div>
          <div class="flex items-start">
            <span class="bg-craftar-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
            <span>¡Accede a la tienda y disfruta del servidor!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isFormValid = computed(() => {
  return form.username &&
         form.email &&
         form.password &&
         form.password.length >= 6 &&
         form.password === form.confirmPassword &&
         form.acceptTerms
})

const handleRegister = async () => {
  authStore.clearError()
  
  const result = await authStore.register({
    username: form.username,
    email: form.email,
    password: form.password
  })
  
  if (result.success) {
    router.push('/dashboard')
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>
