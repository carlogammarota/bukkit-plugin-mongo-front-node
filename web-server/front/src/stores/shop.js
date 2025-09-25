import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../config/axios'

export const useShopStore = defineStore('shop', () => {
  const products = ref([])
  const categories = ref([])
  const cart = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    category: 'all',
    search: '',
    page: 1,
    limit: 12
  })
  const pagination = ref({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  })

  // Computed properties
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })
  
  const cartItemsCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0)
  })
  
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const matchesCategory = filters.value.category === 'all' || product.category === filters.value.category
      const matchesSearch = !filters.value.search || 
        product.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.value.search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  })

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams({
        page: filters.value.page,
        limit: filters.value.limit
      })
      
      if (filters.value.category !== 'all') {
        params.append('category', filters.value.category)
      }
      
      if (filters.value.search) {
        params.append('search', filters.value.search)
      }
      
      const response = await api.get(`/api/shop/products?${params}`)
      products.value = response.data.products
      pagination.value = response.data.pagination
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar productos'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/shop/categories')
      categories.value = response.data
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar categorías'
      return { success: false, error: error.value }
    }
  }

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.value.find(item => item.id === product._id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        minecraftItem: product.minecraftItem,
        image: product.image,
        defaultQuantity: product.defaultQuantity || 1
      })
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId)
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  const updateCartQuantity = (productId, quantity) => {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        localStorage.setItem('cart', JSON.stringify(cart.value))
      }
    }
  }

  const clearCart = () => {
    cart.value = []
    localStorage.removeItem('cart')
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      category: 'all',
      search: '',
      page: 1,
      limit: 12
    }
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cart.value = JSON.parse(savedCart)
    }
  }

  const createOrder = async () => {
    loading.value = true
    error.value = null
    
    try {
      const orderItems = cart.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
      
      const response = await api.post('/api/orders', { items: orderItems })
      return { success: true, order: response.data.order }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear orden'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const processPayment = async (orderId, paymentMethod) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/api/orders/${orderId}/pay`, {
        paymentMethod
      })
      
      if (paymentMethod === 'mercadopago' && response.data.paymentUrl) {
        // Retornar URL de pago para redirección
        return { 
          success: true, 
          redirect: true, 
          paymentUrl: response.data.paymentUrl,
          order: response.data.order 
        }
      }
      
      return { success: true, order: response.data.order }
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al procesar pago'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize cart from storage
  loadCartFromStorage()

  return {
    // State
    products,
    categories,
    cart,
    loading,
    error,
    filters,
    pagination,
    
    // Computed
    cartTotal,
    cartItemsCount,
    filteredProducts,
    
    // Actions
    fetchProducts,
    fetchCategories,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setFilters,
    resetFilters,
    createOrder,
    processPayment,
    clearError
  }
})
