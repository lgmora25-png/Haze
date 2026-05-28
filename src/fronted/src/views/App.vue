<template>
  <div id="app">
    <!-- Navbar Global -->
    <nav class="itch-navbar">
      <div class="logo" @click="irAPantalla('search')">HAZE</div>
      <div class="nav-links">
        <button 
          @click="irAPantalla('search')" 
          :class="{ active: pantallaActual === 'search' }">Explorar</button>
        <button 
          @click="irAPantalla('add')" 
          :class="{ active: pantallaActual === 'add' }">➕ Subir Juego</button>
      </div>
    </nav>

    <!-- Escenario Dinámico -->
    <main class="main-content">
      <SearchGame 
        v-if="pantallaActual === 'search'" 
        @ver-detalle="(juego) => irAPantalla('view', juego)" 
      />
      <AddGame 
        v-if="pantallaActual === 'add'" 
        @volver="irAPantalla('search')" 
      />
      <InfoGame 
        v-if="pantallaActual === 'view'" 
        :juego="juegoSeleccionado" 
        @volver="irAPantalla('search')" 
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SearchGame from './juegos/search-game.vue';
import AddGame from './juegos/add-game.vue';
import InfoGame from './juegos/info-game.vue';

const pantallaActual = ref('search');
const juegoSeleccionado = ref(null);

const irAPantalla = (pantalla, juego = null) => {
  pantallaActual.value = pantalla;
  juegoSeleccionado.value = juego;
  
  // Opcional: Esto ayuda a que siempre empieces a ver la página desde arriba
  window.scrollTo(0, 0);
};
</script>
<style>
/* Reset básico si no lo tienes */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #121212; /* Fondo oscuro base */
  color: #fff;
}

/* NAVBAR GLOBAL */
.itch-navbar {
  display: flex;
  justify-content: space-between; /* Logo a la izquierda, botones a la derecha */
  align-items: center;
  padding: 15px 40px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.logo {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  cursor: pointer;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  gap: 15px; /* Espacio entre los botones */
}

/* Estilo de los botones del Navbar */
.nav-links button {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  transition: color 0.3s ease;
}

.nav-links button:hover {
  color: #fff;
}

/* El indicador de página activa (la línea roja abajo) */
.itch-navbar button.active {
  color: #da5b5b;
  border-bottom: 2px solid #da5b5b;
}

.main-content {
  padding-top: 20px;
}
</style>