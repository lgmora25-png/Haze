<script setup>
// Tu archivo router/index.js se encarga de cargarlos dinámicamente.
</script>

<template>
  <div class="haze-app-container">
    
    <nav class="navbar-global">
      <div class="nav-links-left">
        <router-link to="/" class="nav-logo">HAZE 👾</router-link>
      </div>
      
      <div class="nav-links">
        <router-link 
          to="/" 
          class="nav-btn"
          active-class="active"
        >
          Ver Catálogo
        </router-link>
        
        <router-link 
          to="/subir-juego" 
          class="nav-btn btn-accent"
          active-class="active"
        >
          ➕ Subir Juego
        </router-link>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<style>
/* Mantenemos tus estilos globales y paleta de colores original */
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
  text-decoration: none;
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

/* El estado hover y la clase active que Vue Router controla por sí solo */
.nav-btn:hover, .nav-btn.active {
  color: #fff;
}

/* Tu característico botón de acento rojo para HAZE */
.nav-btn.btn-accent {
  background-color: #da5b5b;
  color: white;
}

.nav-btn.btn-accent:hover {
  background-color: #c44a4a;
}

/* El botón rojo se oscurece un poco al estar activo para que resalte correctamente */
.nav-btn.btn-accent.active {
  background-color: #a83b3b;
}

.main-content {
  padding: 20px;
}
</style>