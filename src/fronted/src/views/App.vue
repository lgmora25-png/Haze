<script setup>
import { ref } from 'vue'
import SearchGame from './juegos/search-game.vue'
import AddGame from './juegos/add-game.vue'
import ViewGame from './juegos/view-game.vue'

const pantallaActual = ref('search')


const juegoSeleccionado = ref(null)

const irAPantalla = (pantalla, datosJuego = null) => {
  pantallaActual.value = pantalla
  if (datosJuego) {
    juegoSeleccionado.value = datosJuego
  }
}
</script>

<template>
  <div class="haze-app-container">
    
    <nav class="navbar-global">
      <div class="nav-logo" @click="irAPantalla('search')">HAZE 👾</div>
      <div class="nav-links">
        <button 
          class="nav-btn" 
          :class="{ active: pantallaActual === 'search' }"
          @click="irAPantalla('search')"
        >
          Ver Catálogo
        </button>
        <button 
          class="nav-btn btn-accent" 
          @click="irAPantalla('add')"
        >
          ➕ Subir Juego
        </button>
      </div>
    </nav>

    <main class="main-content">
      <SearchGame 
        v-if="pantallaActual === 'search'" 
        @ver-detalle="(juego) => irAPantalla('view', juego)" 
      />

      <AddGame 
        v-if="pantallaActual === 'add'" 
        @volver="irAPantalla('search')" 
      />

      <ViewGame 
        v-if="pantallaActual === 'view'" 
        :juego="juegoSeleccionado"
        @volver="irAPantalla('search')" 
      />
    </main>

  </div>
</template>

<style>

body {
  margin: 0;
  background-color: #1c1c1c;
  color: #dadada;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.navbar-global {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2b2b2b;
  padding: 10px 30px;
  border-bottom: 1px solid #333;
}

.nav-logo {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-btn {
  background: none;
  border: none;
  color: #858585;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: color 0.15s;
}

.nav-btn:hover, .nav-btn.active {
  color: #fff;
}

.nav-btn.btn-accent {
  background-color: #da5b5b;
  color: white;
}

.nav-btn.btn-accent:hover {
  background-color: #c44a4a;
}

.main-content {
  padding: 20px;
}
</style>