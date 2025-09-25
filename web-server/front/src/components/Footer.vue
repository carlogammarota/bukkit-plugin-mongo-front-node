<template>
  <footer class="bg-gray-900 border-t border-gray-800 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo y Descripción -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-craftar-500 to-craftar-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-cube text-white text-xl"></i>
            </div>
            <span class="font-orbitron font-bold text-xl gradient-text">CraftAR</span>
          </div>
          <p class="text-gray-400 mb-6 max-w-md">
            El mejor servidor de Minecraft en Argentina. Únete a nuestra comunidad y disfruta de una experiencia única con mods, eventos y mucho más.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-craftar-400 transition-colors duration-300">
              <i class="fab fa-discord text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-craftar-400 transition-colors duration-300">
              <i class="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-craftar-400 transition-colors duration-300">
              <i class="fab fa-youtube text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-craftar-400 transition-colors duration-300">
              <i class="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>

        <!-- Enlaces Rápidos -->
        <div>
          <h3 class="text-white font-semibold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white transition-colors duration-300">
                Inicio
              </router-link>
            </li>
            <li>
              <router-link to="/shop" class="text-gray-400 hover:text-white transition-colors duration-300">
                Tienda
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard" v-if="authStore.isAuthenticated" class="text-gray-400 hover:text-white transition-colors duration-300">
                Dashboard
              </router-link>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">
                Reglas del Servidor
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">
                Soporte
              </a>
            </li>
          </ul>
        </div>

        <!-- Información del Servidor -->
        <div>
          <h3 class="text-white font-semibold mb-4">Servidor</h3>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center">
              <i class="fas fa-server text-craftar-400 mr-2"></i>
              IP: play.craftar.com
            </li>
            <li class="flex items-center">
              <i class="fas fa-users text-craftar-400 mr-2"></i>
              Jugadores Online: {{ onlinePlayers }}
            </li>
            <li class="flex items-center">
              <i class="fas fa-clock text-craftar-400 mr-2"></i>
              Uptime: 99.9%
            </li>
            <li class="flex items-center">
              <i class="fas fa-shield-alt text-craftar-400 mr-2"></i>
              Protección Anti-Cheat
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div class="text-gray-400 text-sm">
          © 2024 CraftAR. Todos los derechos reservados.
        </div>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors duration-300">
            Términos de Servicio
          </a>
          <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors duration-300">
            Política de Privacidad
          </a>
          <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors duration-300">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const onlinePlayers = ref(0)

onMounted(async () => {
  try {
    // Simular jugadores online (en producción esto vendría de la API)
    onlinePlayers.value = Math.floor(Math.random() * 50) + 20
  } catch (error) {
    console.error('Error fetching server stats:', error)
  }
})
</script>
