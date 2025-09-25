import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy load components
const Home = () => import('../views/Home.vue')
const Shop = () => import('../views/Shop.vue')
const Blog = () => import('../views/Blog.vue')
const Login = () => import('../views/auth/Login.vue')
const Register = () => import('../views/auth/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Admin = () => import('../views/Admin.vue')
const Checkout = () => import('../views/Checkout.vue')
const Profile = () => import('../views/Profile.vue')
const Orders = () => import('../views/Orders.vue')
const Coins = () => import('../views/Coins.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'CraftAR - Tu Servidor de Minecraft' }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
    meta: { title: 'Tienda - CraftAR' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: { title: 'Blog - CraftAR' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Iniciar Sesión - CraftAR', requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Crear Cuenta - CraftAR', requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard - CraftAR', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { title: 'Panel de Administración - CraftAR', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { title: 'Finalizar Compra - CraftAR', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Mi Perfil - CraftAR', requiresAuth: true }
  },
  {
    path: '/dashboard/orders',
    name: 'Orders',
    component: Orders,
    meta: { title: 'Mis Órdenes - CraftAR', requiresAuth: true }
  },
  {
    path: '/dashboard/coins',
    name: 'Coins',
    component: Coins,
    meta: { title: 'Mis Monedas - CraftAR', requiresAuth: true }
  },
  {
    path: '/dashboard/wallet',
    name: 'Wallet',
    component: Coins,
    meta: { title: 'Mi Billetera - CraftAR', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Página No Encontrada - CraftAR' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  document.title = to.meta.title || 'CraftAR'
  
  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check admin requirements
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Redirect authenticated users away from auth pages
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

export default router
