import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../config/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const loading = ref(false)
  const error = ref(null)
  const deviceId = ref(localStorage.getItem('deviceId') || generateDeviceId())

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userBalance = computed(() => user.value?.balance || 0)
  const userCoins = computed(() => user.value?.coins || user.value?.balance || 0)

  // Generate device ID
  function generateDeviceId() {
    const id = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('deviceId', id)
    return id
  }

  // Token se maneja automáticamente por el interceptor de api

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const loginData = {
        ...credentials,
        deviceId: deviceId.value,
        deviceName: navigator.userAgent.substring(0, 50) + ' - ' + new Date().toLocaleDateString()
      }
      
      const response = await api.post('/api/auth/login', loginData)
      const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data
      
      token.value = accessToken
      refreshToken.value = newRefreshToken
      user.value = userData
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al iniciar sesión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const loginPlayer = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/auth/login-player', credentials)
      const { token: newToken, user: userData } = response.data
      
      token.value = newToken
      user.value = userData
      
      localStorage.setItem('token', newToken)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al iniciar sesión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/auth/register', userData)
      const { accessToken, refreshToken: newRefreshToken, user: newUser } = response.data
      
      token.value = accessToken
      refreshToken.value = newRefreshToken
      user.value = newUser
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al registrarse'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token.value) {
        await api.post('/api/auth/logout')
      }
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      // Clear local state regardless of API call result
      token.value = null
      refreshToken.value = null
      user.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('token') // Limpiar también el token antiguo por compatibilidad
    }
  }

  const refreshAccessToken = async () => {
    if (!refreshToken.value) return false
    
    try {
      const response = await api.post('/api/auth/refresh', {
        refreshToken: refreshToken.value
      })
      
      const { accessToken } = response.data
      token.value = accessToken
      localStorage.setItem('accessToken', accessToken)
      
      return true
    } catch (err) {
      // Refresh token is invalid, logout
      await logout()
      return false
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      // Try to get user profile to validate token
      const response = await api.get('/api/auth/profile')
      user.value = response.data.user
      return true
    } catch (err) {
      // Token might be expired, try to refresh
      if (err.response?.status === 401 && refreshToken.value) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          // Try again with new token
          try {
            const response = await api.get('/api/auth/profile')
            user.value = response.data.user
            return true
          } catch (retryErr) {
            await logout()
            return false
          }
        }
      }
      
      // Token is invalid, logout
      await logout()
      return false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/api/auth/profile', profileData)
      user.value = response.data.user
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al actualizar perfil'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const updateBalance = (newBalance) => {
    if (user.value) {
      user.value.balance = newBalance
      user.value.coins = newBalance
    }
  }

  const updateCoins = (newCoins) => {
    if (user.value) {
      user.value.coins = newCoins
      user.value.balance = newCoins
    }
  }

  const fetchUserProfile = async () => {
    if (!token.value) return false
    
    try {
      const response = await api.get('/api/auth/profile')
      user.value = response.data.user
      return true
    } catch (err) {
      console.error('Error fetching user profile:', err)
      return false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    isAdmin,
    userBalance,
    userCoins,
    
    // Actions
    login,
    loginPlayer,
    register,
    logout,
    checkAuth,
    updateProfile,
    clearError,
    updateBalance,
    updateCoins,
    fetchUserProfile
  }
}, {
  persist: {
    key: 'auth-store',
    storage: localStorage,
    paths: ['user', 'token']
  }
})
