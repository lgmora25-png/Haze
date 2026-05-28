// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importamos tus componentes (ajusta la ruta de carpetas si es necesario)
import SearchGame from '../juegos/search-game.vue'
import AddGame from '../juegos/add-game.vue'
import InfoGame from '../juegos/info-game.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router