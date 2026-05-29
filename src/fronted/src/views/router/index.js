// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importamos tus componentes (ajusta la ruta de carpetas si es necesario)
import SearchGame from '../juegos/search-game.vue'
import AddGame from '../juegos/add-game.vue'
import InfoGame from '../juegos/info-game.vue'
import Register from '../Registro/register.vue'
import Profile from '../Registro/profile.vue'
import Login from '../Registro/login.vue'

const routes = [
  {
    path: '/',
    name: 'explorar',
    component: SearchGame
  },
  {
    path: '/subir',
    name: 'subir-juego',
    component: AddGame
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router