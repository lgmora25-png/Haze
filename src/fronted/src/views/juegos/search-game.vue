<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const juegos = ref([])
const cargando = ref(true)
const mensajeError = ref('')
const textoBusqueda = ref('')
const esDueno = ref(false)
const menuAbierto = ref(false)

onMounted(async () => {
  const rolUsuario = localStorage.getItem('rol')
  esDueno.value = rolUsuario === 'dueno'
  try {
    console.log("Intentando conectar con: http://localhost:3000/api/juegos");
    const res = await fetch('http://localhost:3000/api/juegos')
    if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
    
    const data = await res.json()
    // Validación: Si la API devuelve { data: [...] } en lugar de [...]
    juegos.value = Array.isArray(data) ? data : (data.data || [])
    
    console.log("Juegos cargados con éxito:", juegos.value);
  } catch (err) {
    console.error("❌ Error en search-game.vue:", err)
    mensajeError.value = 'No se pudo cargar el catálogo. Revisa si el backend (puerto 3000) está encendido.'
  } finally {
    cargando.value = false
  }
})

// Actualizamos cuando la sesión cambia en otros componentes (login/logout)
const handleSessionUpdated = () => {
  const rolUsuario = localStorage.getItem('rol')
  esDueno.value = rolUsuario === 'dueno'
}

window.addEventListener('session-updated', handleSessionUpdated)
onBeforeUnmount(() => {
  window.removeEventListener('session-updated', handleSessionUpdated)
})

const juegosFiltrados = computed(() => {
  if (!Array.isArray(juegos.value)) return []
  return juegos.value.filter(j => 
    j.titulo?.toLowerCase().includes(textoBusqueda.value.toLowerCase())
  )
})

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

const gestionarPago = () => {
  router.push('/pagos/manage')
}

const irASubir = () => {
  router.push('/subir')
}

// Navegamos a la ruta de detalle usando el ID del juego
const irADetalle = (juego) => {
  const id = juego.juego_id || juego.id
  if (!id) return
  router.push(`/juego/${id}`)
}
</script>

<template>
  <div class="catalog-page">
    <div v-if="esDueno" class="admin-container">
      <button @click="toggleMenu" class="gear-btn">⚙️ Configuración</button>
      <div v-if="menuAbierto" class="admin-dropdown">
        <button @click="irASubir" class="dropdown-item">➕ Add Game</button>
        <button @click="gestionarPago" class="dropdown-item">💳 Gestionar Pago</button>
      </div>
    </div>

    <header class="catalog-header">
      <div class="header-left">
        <h1>Explora HAZE</h1>
        <router-link v-if="esDueno" to="/subir" class="upload-btn">➕ Subir Juego</router-link>
      </div>
      <input 
        v-model="textoBusqueda" 
        type="text" 
        placeholder="Buscar juegos..." 
        class="search-bar"
      />
    </header>

    <div v-if="cargando" class="loader">Cargando catálogo...</div>
    <div v-else-if="mensajeError" class="error-message">{{ mensajeError }}</div>

    <main v-else>
      <div v-if="juegosFiltrados.length === 0" class="empty-state">
        No se encontraron juegos disponibles.
      </div>
      <div class="game-grid">
      <article 
        v-for="juego in juegosFiltrados" 
        :key="juego.juego_id || juego.id" 
        class="game-card" 
        @click="irADetalle(juego)"
      >
        <div class="img-container">
          <img :src="juego.imagen_url" :alt="juego.titulo">
        </div>
        <div class="card-content">
          <h3>{{ juego.titulo }}</h3>
          <p class="genre">{{ juego.generos }}</p>
          <div class="price-tag">{{ juego.precio == 0 ? 'Gratis' : '$' + juego.precio }}</div>
        </div>
      </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.catalog-page { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
.catalog-header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.catalog-header .header-left { display: flex; align-items: center; gap: 12px; }
.upload-btn { background: #2b2b2b; color: #fff; padding: 8px 12px; border-radius: 8px; text-decoration: none; border: 1px solid #444; font-weight: 700; }
.upload-btn:hover { border-color: #da5b5b; }
.search-bar { width: 100%; max-width: 420px; padding: 12px 20px; border-radius: 25px; border: 1px solid #444; background: #1a1a1a; color: white; margin-top: 0; }
.search-bar:focus { outline: 1px solid #da5b5b; }

.game-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }

.game-card { background: #1a1a1a; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.game-card:hover { transform: translateY(-10px); }

.img-container { aspect-ratio: 16/9; overflow: hidden; }
.img-container img { width: 100%; height: 100%; object-fit: cover; }

.card-content { padding: 15px; }
.card-content h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: #fff; }
.genre { color: #888; font-size: 0.85rem; margin-bottom: 10px; }
.price-tag { font-weight: bold; color: #da5b5b; }
.loader { text-align: center; color: #aaa; margin-top: 50px; }
.error-message { text-align: center; color: #da5b5b; margin-top: 50px; font-weight: bold; }
.empty-state { text-align: center; color: #888; margin-top: 50px; }

.admin-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.gear-btn {
  background: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.25s ease;
}

.gear-btn:hover {
  border-color: #da5b5b;
  box-shadow: 0 0 14px rgba(218, 91, 91, 0.3);
}

.admin-dropdown {
  margin-top: 10px;
  min-width: 180px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.dropdown-item {
  background: transparent;
  color: #ccc;
  border: none;
  padding: 10px 12px;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #da5b5b;
  color: #fff;
}
</style>