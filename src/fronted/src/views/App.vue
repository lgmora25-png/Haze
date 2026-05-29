<template>
  <div id="app">
    <nav class="itch-navbar">
      <router-link to="/" class="logo-link">
        <div class="logo">HAZE</div>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-btn" active-class="active">Explorar</router-link>
        <router-link to="/subir" class="nav-btn" active-class="active">➕ Subir Juego</router-link>
        
        <router-link v-if="!estaLogueado" to="/registro" class="nav-btn" active-class="active">Registrarse</router-link>
        
        <router-link v-else to="/perfil" class="nav-btn profile-circle" active-class="active">
          <div class="avatar-circle">👤</div>
        </router-link>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const estaLogueado = ref(false);

// Esta función "observa" cada vez que cambias de página.
// Si detecta que existe el 'usuario_id' en la memoria, muestra el perfil.
// Si no, muestra el botón de registrarse.
watch(route, () => {
  try {
    estaLogueado.value = !!localStorage.getItem('usuario_id');
  } catch (e) {
    estaLogueado.value = false;
  }
}, { immediate: true });
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #121212; /* El negro de fondo de pantalla completa */
  color: #ffffff; /* Letras blancas por defecto */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

<style scoped>
.itch-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.logo-link {
  text-decoration: none; 
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
  gap: 15px;
  align-items: center; /* Centra los botones y el círculo verticalmente */
}

.nav-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  text-decoration: none; 
  transition: color 0.3s ease;
}

.nav-btn:hover {
  color: #fff;
}

/* El Vue Router aplica automáticamente esta clase cuando estás en esa ruta */
.nav-btn.active {
  color: #da5b5b;
}

/* Estilos especiales para el circulito del perfil */
.profile-circle {
  padding: 0;
}

.avatar-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.nav-btn.active .avatar-circle {
  border-color: #da5b5b; /* Se ilumina el borde si estás en tu perfil */
}

.avatar-circle:hover {
  border-color: #fff;
}

.main-content {
  padding-top: 20px;
}
</style>