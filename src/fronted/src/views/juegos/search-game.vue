<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const juegos = ref([])
const cargando = ref(true)
const mensajeError = ref('')
const textoBusqueda = ref('')

onMounted(async () => {
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

const juegosFiltrados = computed(() => {
  if (!Array.isArray(juegos.value)) return []
  return juegos.value.filter(j => 
    j.titulo?.toLowerCase().includes(textoBusqueda.value.toLowerCase())
  )
})

// Navegamos a la ruta de detalle usando el ID del juego
const irADetalle = (juego) => {
  const id = juego.juego_id || juego.id
  if (!id) return
  router.push(`/juego/${id}`)
}
</script>

<template>
  <div class="catalog-page">
    <header class="catalog-header">
      <h1>Explora HAZE</h1>
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
.catalog-header { margin-bottom: 40px; text-align: center; }
.search-bar { width: 100%; max-width: 500px; padding: 12px 20px; border-radius: 25px; border: 1px solid #444; background: #1a1a1a; color: white; margin-top: 15px; }
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
</style>