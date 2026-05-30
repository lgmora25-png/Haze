<template>
  <div id="app">
    <!-- Barra de Navegación Superior Estilo Itch.io -->
    <nav class="itch-navbar">
      <div class="logo-link" @click="irAPantalla('/')">
        <div class="logo">HAZE</div>
      </div>

      <div class="nav-links">
        <router-link to="/" class="nav-btn" :class="{ active: route.path === '/' }">Explorar</router-link>

        <!-- Botón visible solo para dueños -->
        <router-link
          v-if="!estaLogueado"
          to="/registro"
          class="nav-btn"
          :class="{ active: route.path === '/registro' }"
        >
          Registrarse
        </router-link>

        <router-link
          v-if="!estaLogueado"
          to="/login"
          class="nav-btn"
          :class="{ active: route.path === '/login' }"
        >
          Iniciar Sesión
        </router-link>

        <router-link
          v-if="estaLogueado"
          to="/perfil"
          class="nav-btn"
          :class="{ active: route.path === '/perfil' }"
        >
          Mi Perfil
        </router-link>

        <button
          v-if="estaLogueado"
          class="nav-btn"
          @click="cerrarSesion"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>

    <!-- Router principal de tu SPA -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeUnmount } from 'vue';

// Estados reactivos de navegación (Controlador)
const router = useRouter();
const route = useRoute();

const usuarioId = ref(localStorage.getItem('usuarioId') || '');
const usuarioNombre = ref(localStorage.getItem('usuarioNombre') || '');
const rol = ref(localStorage.getItem('rol') || '');
const estaLogueado = computed(() => Boolean(usuarioId.value));

const actualizarSesion = async () => {
  usuarioId.value = localStorage.getItem('usuarioId') || '';
  usuarioNombre.value = localStorage.getItem('usuarioNombre') || '';
  rol.value = localStorage.getItem('rol') || '';

  // Si existe usuarioId pero falta info, intentamos recuperarla del backend
    if (usuarioId.value && (!rol.value || !usuarioNombre.value)) {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/perfil/${usuarioId.value}`);
      if (res.ok) {
        const data = await res.json();
        const fetchedRol = data.rol || (data.data && data.data.rol) || 'usuario';
        const fetchedNombre = data.nombre_usuario || (data.data && data.data.nombre_usuario) || '';

        rol.value = fetchedRol;
        usuarioNombre.value = fetchedNombre;

        localStorage.setItem('rol', fetchedRol);
        if (fetchedNombre) {
          localStorage.setItem('usuarioNombre', fetchedNombre);
        }
      }
    } catch (err) {
      console.error('No se pudo obtener la sesión completa desde el perfil:', err);
    }
  }
};

onMounted(() => { actualizarSesion(); });
watch(() => route.path, actualizarSesion);
// Listener para eventos de sesión (login/logout desde componentes)
const handleSessionUpdated = () => actualizarSesion();
window.addEventListener('session-updated', handleSessionUpdated);
onBeforeUnmount(() => {
  window.removeEventListener('session-updated', handleSessionUpdated);
});

/**
 * Función Orquestadora de Navegación
 */
const cerrarSesion = () => {
  localStorage.removeItem('usuarioId');
  localStorage.removeItem('usuarioNombre');
  localStorage.removeItem('rol');
  usuarioId.value = '';
  usuarioNombre.value = '';
  rol.value = '';
  router.push('/');
};

const irAPantalla = (path) => {
  router.push(path);
};
</script>

<style>
/* Estilos Base Globales */
body {
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

<style scoped>
/* Estilos del Contenedor de la Navbar */
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
  cursor: pointer;
}

.logo {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* Transformamos los antiguos enlaces en botones limpios */
.nav-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #fff;
  background-color: #252525;
}

/* Clase activa reactiva cuando coincide con la pantalla actual */
.nav-btn.active {
  color: #da5b5b;
  background-color: #2a1b1b;
}

.main-content {
  padding: 20px 40px;
}
</style>