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
        <h2 class="text-3xl font-bold gradient-text mb-2">Iniciar Sesión</h2>
        <p class="text-gray-400">Accede a tu cuenta de CraftAR</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
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
              placeholder="Ingresa tu nombre de usuario"
            >
            <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
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
              placeholder="Ingresa tu contraseña"
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

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-craftar-600 focus:ring-craftar-500 border-gray-600 rounded bg-gray-800"
            >
            <label for="remember" class="ml-2 block text-sm text-gray-300">
              Recordarme
            </label>
          </div>
          <a href="#" class="text-sm text-craftar-400 hover:text-craftar-300">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="authStore.loading" class="flex items-center justify-center">
            <div class="spinner mr-2"></div>
            Iniciando sesión...
          </div>
          <div v-else class="flex items-center justify-center">
            <i class="fas fa-sign-in-alt mr-2"></i>
            Iniciar Sesión
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

        <!-- Register Info -->
        <div class="text-center">
          <p class="text-gray-400">
            ¿No tienes cuenta?
            <router-link to="/register" class="text-craftar-400 hover:text-craftar-300 font-semibold">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </form>

      <!-- Demo Credentials -->
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-300 mb-2">Credenciales de Demo:</h3>
        <div class="text-xs text-gray-400 space-y-1">
          <p><strong>Admin:</strong> admin / admin123</p>
          <p class="text-gray-500 mt-2">
            <i class="fas fa-info-circle mr-1"></i>
            Regístrate primero para crear tu cuenta
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  authStore.clearError()
  
  const result = await authStore.login({
    username: form.username,
    password: form.password
  })
  
  if (result.success) {
    const redirectTo = route.query.redirect || '/dashboard'
    router.push(redirectTo)
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>
