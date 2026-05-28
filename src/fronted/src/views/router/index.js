import { createRouter, createWebHistory } from 'vue-router';

// 1. Importaciones limpias usando el alias @
import SearchGame from '@/views/juegos/search-game.vue';
import AddGame from '@/views/juegos/add-game.vue';
import InfoGame from '@/views/juegos/info-game.vue'; 

// 2. Definimos las rutas de la plataforma
const routes = [
  {
    path: '/',
    name: 'catalog',
    component: SearchGame
  },
  {
    path: '/subir-juego',
    name: 'add-game',
    component: AddGame
  },
  {
    path: '/juego/:id', 
    name: 'game-detail',
    component: InfoGame,
    props: true 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;