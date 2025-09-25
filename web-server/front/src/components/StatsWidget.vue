<template>
  <div class="stats-widget">
    <!-- Connection Status -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white flex items-center">
        <i class="fas fa-chart-line mr-2 text-blue-400"></i>
        Estadísticas del Servidor
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full" :class="statsStore.connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'"></div>
        <span class="text-sm text-gray-400">
          {{ statsStore.connectionStatus.connected ? 'Conectado' : 'Desconectado' }}
        </span>
      </div>
    </div>

    <!-- Server Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400 mb-1">{{ statsStore.serverStats.online_players || 0 }}</div>
          <div class="text-sm text-gray-400">Jugadores Online</div>
        </div>
      </div>
      
      <div class="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400 mb-1">{{ statsStore.serverStats.max_players || 0 }}</div>
          <div class="text-sm text-gray-400">Máximo</div>
        </div>
      </div>
      
      <div class="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-400 mb-1">{{ statsStore.serverStats.version || '-' }}</div>
          <div class="text-sm text-gray-400">Versión</div>
        </div>
      </div>
      
      <div class="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400 mb-1">24/7</div>
          <div class="text-sm text-gray-400">Activo</div>
        </div>
      </div>
    </div>

    <!-- Players List (Collapsible) -->
    <div v-if="statsStore.serverStats.players && Object.keys(statsStore.serverStats.players).length > 0" class="mt-6">
      <button 
        @click="togglePlayersList" 
        class="w-full flex items-center justify-between p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:bg-gray-700/80 transition-colors mb-4"
      >
        <span class="text-white font-medium">
          <i class="fas fa-users mr-2 text-blue-400"></i>
          Jugadores Conectados ({{ Object.keys(statsStore.serverStats.players).length }})
        </span>
        <i class="fas fa-chevron-down transition-transform" :class="{ 'rotate-180': showPlayersList }"></i>
      </button>
      
      <div v-if="showPlayersList" class="mt-4 space-y-3 max-h-96 overflow-y-auto">
        <div 
          v-for="player in Object.values(statsStore.serverStats.players)" 
          :key="player.name"
          class="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 pb-2 mb-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white text-sm"></i>
              </div>
              <div>
                <h4 class="font-semibold text-white">{{ player.name }}</h4>
                <p class="text-sm text-gray-400">{{ player.display_name }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center space-x-1 mb-1">
                <i class="fas fa-heart text-red-400"></i>
                <span class="text-sm font-medium text-white">{{ Math.round((player.health / player.max_health) * 100) }}%</span>
              </div>
              <div class="flex items-center space-x-1">
                <i class="fas fa-wifi" :class="getPingColor(player.ping)"></i>
                <span class="text-sm text-gray-400">{{ player.ping }}ms</span>
              </div>
            </div>
          </div>
          
          <!-- Health Bar -->
          <div class="mb-3">
            <div class="flex justify-between text-xs text-gray-400 mb-1">
              <span>Salud</span>
              <span>{{ Math.round((player.health / player.max_health) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300" 
                :class="getHealthBarColor(player.health, player.max_health)"
                :style="{ width: `${(player.health / player.max_health) * 100}%` }"
              ></div>
            </div>
          </div>
          
          <!-- Player Info Grid -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center space-x-2">
              <i class="fas fa-map-marker-alt text-blue-400"></i>
              <span class="text-gray-300">{{ player.world }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="fas fa-gamepad text-green-400"></i>
              <span class="text-gray-300">{{ player.game_mode }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="fas fa-clock text-yellow-400"></i>
              <span class="text-gray-300">{{ Math.round(player.play_time_hours * 10) / 10 }}h</span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="fas fa-utensils text-orange-400"></i>
              <span class="text-gray-300">{{ Math.round((player.food_level / 20) * 100) }}%</span>
            </div>
          </div>
          
          <!-- Location -->
          <div class="mt-3 pt-3 border-t border-gray-700/50">
            <div class="flex items-center space-x-2 text-xs text-gray-400">
              <i class="fas fa-crosshairs text-purple-400"></i>
              <span>X: {{ Math.round(player.x * 10) / 10 }} Y: {{ Math.round(player.y * 10) / 10 }} Z: {{ Math.round(player.z * 10) / 10 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Players Message -->
    <div v-else-if="statsStore.connectionStatus.connected" class="text-center py-8 text-gray-400">
      <i class="fas fa-user-slash text-4xl mb-4"></i>
      <p class="text-lg">No hay jugadores conectados</p>
    </div>

    <!-- Loading State -->
    <div v-if="!statsStore.connectionStatus.connected" class="text-center py-8 text-gray-400">
      <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
      <p class="text-lg">Conectando con el servidor...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStatsStore } from '../stores/stats'

const statsStore = useStatsStore()
const showPlayersList = ref(false)

const togglePlayersList = () => {
  showPlayersList.value = !showPlayersList.value
}

const getHealthBarColor = (health, maxHealth) => {
  const percentage = (health / maxHealth) * 100
  if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-green-400'
  if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-400'
  if (percentage >= 20) return 'bg-gradient-to-r from-orange-500 to-orange-400'
  return 'bg-gradient-to-r from-red-500 to-red-400'
}

const getPingColor = (ping) => {
  if (ping <= 50) return 'text-green-400'
  if (ping <= 100) return 'text-yellow-400'
  if (ping <= 200) return 'text-orange-400'
  return 'text-red-400'
}

onMounted(() => {
  // Conectar al socket y obtener estadísticas
  statsStore.connectSocket()
  statsStore.fetchStats()
})

onUnmounted(() => {
  // Desconectar del socket
  statsStore.disconnect()
})
</script>

<style scoped>
.stats-widget {
  @apply bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
