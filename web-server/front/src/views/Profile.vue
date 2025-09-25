<template>
  <div class="min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold gradient-text mb-2">Mi Perfil</h1>
        <p class="text-gray-400">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <!-- Debug Info -->
      <div v-if="!authStore.user" class="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
          <span class="text-red-300">Error: No se pudo cargar la información del usuario</span>
        </div>
      </div>

      <!-- Debug User Object -->
      <div v-if="authStore.user" class="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6">
        <div class="flex items-center mb-2">
          <i class="fas fa-info-circle text-blue-400 mr-2"></i>
          <span class="text-blue-300 font-semibold">Debug: Información del Usuario</span>
        </div>
        <div class="text-sm text-gray-300">
          <p><strong>ID:</strong> {{ authStore.user.id || 'No definido' }}</p>
          <p><strong>Username:</strong> {{ authStore.user.username || 'No definido' }}</p>
          <p><strong>Email:</strong> {{ authStore.user.email || 'No definido' }}</p>
          <p><strong>Role:</strong> {{ authStore.user.role || 'No definido' }}</p>
          <p><strong>Propiedades disponibles:</strong> {{ Object.keys(authStore.user).join(', ') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="card">
            <h2 class="text-xl font-semibold mb-6">Información Personal</h2>
            <form @submit.prevent="updateProfile">
              <!-- Error Message -->
              <div v-if="authStore.error" class="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                  <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
                  <span class="text-red-300">{{ authStore.error }}</span>
                </div>
              </div>

              <!-- Success Message -->
              <div v-if="successMessage" class="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-400 mr-2"></i>
                  <span class="text-green-300">{{ successMessage }}</span>
                </div>
              </div>

              <div class="space-y-6">
                <!-- Username -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
                  <input
                    v-model="profileForm.username"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Nombre de usuario"
                  >
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    required
                    class="input-field"
                    placeholder="tu@email.com"
                  >
                </div>

                <!-- Minecraft Username -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Nombre en Minecraft</label>
                  <input
                    v-model="profileForm.minecraftUsername"
                    type="text"
                    class="input-field"
                    placeholder="Tu nombre de usuario en Minecraft"
                  >
                  <p class="text-xs text-gray-500 mt-1">
                    Este nombre debe coincidir exactamente con tu nombre de usuario en Minecraft
                  </p>
                </div>

                <!-- Current Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Contraseña Actual</label>
                  <div class="relative">
                    <input
                      v-model="profileForm.currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      class="input-field pl-10 pr-10"
                      placeholder="Ingresa tu contraseña actual"
                    >
                    <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <button
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <!-- New Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Nueva Contraseña (Opcional)</label>
                  <div class="relative">
                    <input
                      v-model="profileForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="input-field pl-10 pr-10"
                      placeholder="Deja vacío para mantener la actual"
                    >
                    <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <!-- Confirm New Password -->
                <div v-if="profileForm.newPassword">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Confirmar Nueva Contraseña</label>
                  <div class="relative">
                    <input
                      v-model="profileForm.confirmNewPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="input-field pl-10 pr-10"
                      placeholder="Confirma tu nueva contraseña"
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
                <div v-if="profileForm.newPassword" class="space-y-2">
                  <div class="flex items-center text-sm">
                    <i :class="profileForm.newPassword.length >= 6 ? 'fas fa-check text-green-400' : 'fas fa-times text-red-400'" class="mr-2"></i>
                    <span :class="profileForm.newPassword.length >= 6 ? 'text-green-400' : 'text-red-400'">
                      Mínimo 6 caracteres
                    </span>
                  </div>
                  <div class="flex items-center text-sm">
                    <i :class="profileForm.newPassword === profileForm.confirmNewPassword && profileForm.confirmNewPassword ? 'fas fa-check text-green-400' : 'fas fa-times text-red-400'" class="mr-2"></i>
                    <span :class="profileForm.newPassword === profileForm.confirmNewPassword && profileForm.confirmNewPassword ? 'text-green-400' : 'text-red-400'">
                      Las contraseñas coinciden
                    </span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="authStore.loading || !isFormValid"
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="authStore.loading" class="flex items-center justify-center">
                    <div class="spinner mr-2"></div>
                    Actualizando...
                  </div>
                  <div v-else class="flex items-center justify-center">
                    <i class="fas fa-save mr-2"></i>
                    Guardar Cambios
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Account Info -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Información de la Cuenta</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">ID de Usuario</span>
                <span class="font-mono text-craftar-400">{{ authStore.user.id ? authStore.user.id.slice(-8) : 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Rol</span>
                <span :class="authStore.isAdmin ? 'text-red-400' : 'text-green-400'" class="capitalize">
                  {{ authStore.user.role || 'user' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Miembro desde</span>
                <span>{{ formatDate(authStore.user.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Último acceso</span>
                <span>{{ formatDate(authStore.user.lastLogin) }}</span>
              </div>
            </div>
          </div>

          <!-- Balance -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Balance</h3>
            <div class="text-center">
              <div class="text-3xl font-bold text-craftar-400 mb-2">
                ${{ authStore.userBalance.toLocaleString('es-AR') }}
              </div>
              <p class="text-gray-400 text-sm mb-4">Saldo disponible</p>
              <router-link to="/shop" class="btn-primary w-full">
                <i class="fas fa-store mr-2"></i>
                Ir a la Tienda
              </router-link>
            </div>
          </div>

          <!-- Security -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Seguridad</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-400">Contraseña</span>
                <span class="text-green-400 text-sm">
                  <i class="fas fa-check-circle mr-1"></i>
                  Configurada
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-400">Autenticación 2FA</span>
                <span class="text-gray-400 text-sm">
                  <i class="fas fa-times-circle mr-1"></i>
                  No disponible
                </span>
              </div>
              <button class="w-full btn-secondary text-sm">
                <i class="fas fa-shield-alt mr-2"></i>
                Configurar Seguridad
              </button>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="card border-red-500">
            <h3 class="text-lg font-semibold mb-4 text-red-400">Zona de Peligro</h3>
            <div class="space-y-3">
              <button @click="showDeleteAccountModal = true" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                <i class="fas fa-trash mr-2"></i>
                Eliminar Cuenta
              </button>
              <p class="text-xs text-gray-500">
                Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteAccountModal" class="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4 text-red-400">Eliminar Cuenta</h3>
        <p class="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
        </p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Confirma tu contraseña</label>
            <input
              v-model="deletePassword"
              type="password"
              class="input-field"
              placeholder="Ingresa tu contraseña para confirmar"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Escribe "ELIMINAR" para confirmar</label>
            <input
              v-model="deleteConfirmation"
              type="text"
              class="input-field"
              placeholder="ELIMINAR"
            >
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showDeleteAccountModal = false" class="flex-1 btn-secondary">
            Cancelar
          </button>
          <button @click="deleteAccount" :disabled="!canDeleteAccount" class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-300">
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showDeleteAccountModal = ref(false)
const successMessage = ref('')
const deletePassword = ref('')
const deleteConfirmation = ref('')

const profileForm = reactive({
  username: '',
  email: '',
  minecraftUsername: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const isFormValid = computed(() => {
  return profileForm.username &&
         profileForm.email &&
         profileForm.currentPassword &&
         (!profileForm.newPassword || profileForm.newPassword === profileForm.confirmNewPassword)
})

const canDeleteAccount = computed(() => {
  return deletePassword.value && deleteConfirmation.value === 'ELIMINAR'
})

const formatDate = (dateString) => {
  if (!dateString) return 'Nunca'
  return new Date(dateString).toLocaleDateString('es-AR')
}

const updateProfile = async () => {
  authStore.clearError()
  successMessage.value = ''
  
  const updateData = {
    username: profileForm.username,
    email: profileForm.email,
    minecraftUsername: profileForm.minecraftUsername,
    currentPassword: profileForm.currentPassword
  }
  
  if (profileForm.newPassword) {
    updateData.newPassword = profileForm.newPassword
  }
  
  const result = await authStore.updateProfile(updateData)
  
  if (result.success) {
    successMessage.value = 'Perfil actualizado exitosamente'
    // Clear password fields
    profileForm.currentPassword = ''
    profileForm.newPassword = ''
    profileForm.confirmNewPassword = ''
  }
}

const deleteAccount = async () => {
  if (!canDeleteAccount.value) return
  
  try {
    // Implementar eliminación de cuenta
    alert('Función de eliminación de cuenta no implementada aún')
    showDeleteAccountModal.value = false
  } catch (error) {
    console.error('Error deleting account:', error)
  }
}

onMounted(async () => {
  // Initialize form with current user data
  if (authStore.user) {
    profileForm.username = authStore.user.username || ''
    profileForm.email = authStore.user.email || ''
    profileForm.minecraftUsername = authStore.user.minecraftUsername || ''
  } else {
    // Try to fetch user profile if not available
    await authStore.fetchUserProfile()
    if (authStore.user) {
      profileForm.username = authStore.user.username || ''
      profileForm.email = authStore.user.email || ''
      profileForm.minecraftUsername = authStore.user.minecraftUsername || ''
    }
  }
  
  authStore.clearError()
})
</script>
