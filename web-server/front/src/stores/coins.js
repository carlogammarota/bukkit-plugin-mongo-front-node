import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../config/axios'

export const useCoinsStore = defineStore('coins', () => {
  const loading = ref(false)
  const error = ref(null)
  const transactions = ref([])

  // Actions
  const getBalance = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/coins/balance')
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al obtener monedas'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const depositCoins = async (amount) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/coins/deposit', { amount })
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar monedas'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const getTransactions = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/coins/transactions')
      transactions.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al obtener transacciones'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    loading,
    error,
    transactions,
    
    // Actions
    getBalance,
    depositCoins,
    getTransactions,
    clearError
  }
})
