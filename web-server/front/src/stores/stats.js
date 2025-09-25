import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    serverStats: {},
    connectionStatus: { 
      connected: false, 
      clients: 0, 
      lastUpdate: null 
    },
    socket: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  }),

  actions: {
    connectSocket() {
      try {
        // Conectar al servidor Socket.IO
        this.socket = io(window.location.origin, {
          transports: ['websocket', 'polling']
        })
        
        this.socket.on('connect', () => {
          console.log('✅ Conectado al servidor de estadísticas')
          this.connectionStatus.connected = true
          this.reconnectAttempts = 0
          
          // Unirse a la sala de estadísticas
          this.socket.emit('join-stats-room')
        })

        this.socket.on('stats-update', (data) => {
          console.log('📊 Estadísticas actualizadas:', data)
          this.serverStats = data
          this.connectionStatus.lastUpdate = new Date()
        })

        this.socket.on('disconnect', () => {
          console.log('🔌 Conexión cerrada')
          this.connectionStatus.connected = false
          this.attemptReconnect()
        })

        this.socket.on('connect_error', (error) => {
          console.error('❌ Error en Socket.IO:', error)
          this.connectionStatus.connected = false
        })

      } catch (error) {
        console.error('❌ Error conectando Socket.IO:', error)
        this.connectionStatus.connected = false
      }
    },

    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        console.log(`🔄 Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        
        setTimeout(() => {
          this.connectSocket()
        }, 3000)
      } else {
        console.log('❌ Máximo de intentos de reconexión alcanzado')
      }
    },

    async fetchStats() {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        
        if (data.success) {
          this.serverStats = data.data || {}
          this.connectionStatus = data.connection || { connected: false }
        }
      } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error)
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.emit('leave-stats-room')
        this.socket.disconnect()
        this.socket = null
      }
    }
  }
})
