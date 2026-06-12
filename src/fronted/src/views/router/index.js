// src/router/Index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importamos tus componentes (ajusta la ruta de carpetas si es necesario)
import SearchGame from '../juegos/BuscarJuego.vue'
import AddGame from '../juegos/Agregar-Juego.vue'
import InfoGame from '../juegos/InfoJuego.vue'
import Register from '../Registro/Registro.vue'
import Profile from '../Registro/Perfil.vue'
import Login from '../Registro/Acceso.vue'
import ProcessPayment from '../Registro/Procesar-Pago.vue'
import ConsultPayment from '../Registro/ConsultarPago.vue'

const routes = [
  {
    path: '/',
    name: 'explorar',
    component: SearchGame
  },
  {
    path: '/subir',
    name: 'subir-juego',
    component: AddGame,
    meta: { requiresOwner: true }
  },
  {
    // Usamos :id dinámico para saber qué juego abrir
    path: '/juego/:id',
    name: 'detalle-juego',
    component: InfoGame,
    props: true // Permite recibir el id directamente como una Prop
  },
  {
    path: '/registro',
    name: 'registro-perfil',
    component: Register
  },

  // === HISTORIA DE USUARIO 4: Consultar Perfil ===
  {
    path: '/perfil',
    name: 'mi-perfil',
    component: Profile
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/pagos/process',
    name: 'procesar-pago',
    component: ProcessPayment,
    meta: { requiresOwner: true }
  },
  {
    path: '/pagos/consult',
    name: 'consultar-pago',
    component: ConsultPayment,
    meta: { requiresOwner: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard: bloquea rutas marcadas con `requiresOwner` si el rol no es `dueno`
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.requiresOwner) {
    const rol = localStorage.getItem('rol')
    if (rol === 'dueno') {
      return next()
    }
    // Mensaje simple y redirección al catálogo
    window.alert('Acceso denegado: necesitas ser dueño para acceder a esta sección.')
    return next({ name: 'explorar' })
  }
  return next()
})

export default router