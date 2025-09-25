<template>
  <div id="app" class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <NavBar />
    
    <!-- Main Content -->
    <main class="min-h-screen">
      <router-view />
    </main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
      <div class="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
        <div class="spinner mb-4"></div>
        <p class="text-white">Cargando...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const authStore = useAuthStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await authStore.checkAuth()
  } catch (error) {
    console.error('Error checking auth:', error)
  } finally {
    loading.value = false
  }
})
</script>
