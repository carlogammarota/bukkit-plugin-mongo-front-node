<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- 404 Animation -->
      <div class="mb-8">
        <div class="relative">
          <div class="text-9xl font-bold gradient-text opacity-20">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="fas fa-cube text-6xl text-craftar-400 floating"></i>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-4xl font-bold text-white mb-4">¡Oops! Página no encontrada</h1>
      <p class="text-xl text-gray-400 mb-8 max-w-md mx-auto">
        La página que estás buscando no existe o ha sido movida a otra ubicación.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/" class="btn-primary">
          <i class="fas fa-home mr-2"></i>
          Volver al Inicio
        </router-link>
        <button @click="goBack" class="btn-secondary">
          <i class="fas fa-arrow-left mr-2"></i>
          Página Anterior
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12">
        <h3 class="text-lg font-semibold text-gray-300 mb-4">Enlaces Útiles</h3>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/shop" class="text-craftar-400 hover:text-craftar-300 transition-colors duration-300">
            <i class="fas fa-store mr-1"></i>
            Tienda
          </router-link>
          <router-link to="/dashboard" v-if="authStore.isAuthenticated" class="text-craftar-400 hover:text-craftar-300 transition-colors duration-300">
            <i class="fas fa-tachometer-alt mr-1"></i>
            Dashboard
          </router-link>
          <router-link to="/login" v-if="!authStore.isAuthenticated" class="text-craftar-400 hover:text-craftar-300 transition-colors duration-300">
            <i class="fas fa-sign-in-alt mr-1"></i>
            Iniciar Sesión
          </router-link>
          <a href="#" class="text-craftar-400 hover:text-craftar-300 transition-colors duration-300">
            <i class="fas fa-question-circle mr-1"></i>
            Soporte
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
