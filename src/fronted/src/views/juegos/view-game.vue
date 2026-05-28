<script setup>
import { ref, computed, onMounted } from 'vue'

// Avisamos a App.vue que este componente puede enviar el evento 'ver-detalle'
defineEmits(['ver-detalle'])

// 1. El estado ahora inicia vacío porque los datos vendrán del backend real
const juegos = ref([])
const cargando = ref(true)
const errorMensaje = ref(null)

// Variables reactivas para el buscador
const textoBusqueda = ref('')
const filtroAplicado = ref('')

// 2. Función encargada de consumir tu nueva API Express local
const cargarCatalogo = async () => {
  try {
    cargando.value = true
    errorMensaje.value = null
    
    // Apuntamos al puerto 3000 de tu servidor Express
    const respuesta = await fetch('http://localhost:3000/api/juegos')
    
    if (!respuesta.ok) {
      throw new Error('Hubo un problema al conectar con el servidor de HAZE.')
    }
    
    // Guardamos los datos que nos entregó el JuegoController
    juegos.value = await respuesta.json()
  } catch (error) {
    errorMensaje.value = error.message
    console.error('Error al cargar juegos:', error)
  } finally {
    cargando.value = false
  }
}

// 3. Hook para disparar la carga automáticamente cuando el usuario entre a la página
onMounted(() => {
  cargarCatalogo()
})

// Ejecuta el filtro cuando el usuario le da al botón o presiona Enter
const buscar = () => {
  filtroAplicado.value = textoBusqueda.value
}

// Filtra la lista en tiempo real basado en lo que regrese el backend
const juegosFiltrados = computed(() => {
  if (!filtroAplicado.value.trim()) {
    return juegos.value
  }
  return juegos.value.filter(juego => 
    juego.titulo.toLowerCase().includes(filtroAplicado.value.toLowerCase())
  )
})
</script>

<template>
  <div class="itch-catalog">
    
    <div class="search-container">
      <input 
        v-model="textoBusqueda" 
        @keyup.enter="buscar"
        type="text" 
        placeholder="Introduce el nombre de un juego..." 
        class="search-input"
      />
      <button @click="buscar" class="btn-search">
        🔍 Buscar juegos
      </button>
    </div>

    <header class="itch-header">
      <h1>Featured Games</h1>
      <p v-if="filtroAplicado">Resultados para: "{{ filtroAplicado }}"</p>
      <p v-else>Latest titles on HAZE</p>
    </header>

    <div v-if="cargando" class="no-results">
      ⏳ Cargando el catálogo de HAZE desde el servidor...
    </div>

    <div v-else-if="errorMensaje" class="no-results" style="color: #da5b5b; border-color: #da5b5b;">
      ⚠️ Error: {{ errorMensaje }}. Asegúrate de encender el backend.
    </div>

    <div v-else-if="juegosFiltrados.length === 0" class="no-results">
      No se encontraron videojuegos que coincidan con tu búsqueda.
    </div>

    <main v-else class="itch-grid">
      <article 
        v-for="juego in juegosFiltrados" 
        :key="juego.id" 
        class="itch-card"
        :class="{ 'itch-out': !juego.disponible }"
        @click="$emit('ver-detalle', juego)"
      >
        <div class="itch-card-image">
          <img :src="juego.imagen_url" :alt="juego.titulo">
        </div>
        
        <div class="itch-card-content">
          <h2 class="itch-title">{{ juego.titulo }}</h2>
          <p class="itch-category">{{ juego.generos || 'Sin categoría' }}</p>
          
          <div class="itch-footer">
            <span class="itch-price">
              {{ juego.precio === 0 ? 'Gratis' : `$${Number(juego.precio).toFixed(2)}` }}
            </span>
            <span v-if="!juego.disponible" class="itch-badge">In development</span>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>
<style scoped>

.itch-catalog {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 0;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  background-color: #2b2b2b;
  padding: 12px;
  border-radius: 4px;
}

.search-input {
  flex: 1;
  background-color: #1c1c1c;
  border: 1px solid #434343;
  padding: 8px 12px;
  color: #fff;
  border-radius: 4px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: 1px solid #da5b5b;
}

.btn-search {
  background-color: #da5b5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.15s ease;
}

.btn-search:hover {
  background-color: #c44a4a;
}

.itch-header {
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
  margin-bottom: 25px;
  text-align: left;
}

.itch-header h1 {
  font-size: 1.8rem;
  color: #fff;
  margin: 0;
  font-weight: 600;
}

.itch-header p {
  color: #858585;
  margin: 5px 0 0 0;
  font-size: 0.9rem;
}

.itch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.itch-card {
  background-color: #2b2b2b;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.itch-card:hover {
  background-color: #383838;
}

.itch-card-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  background-color: #111;
  overflow: hidden;
}

.itch-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.itch-card-content {
  padding: 12px;
}

.itch-title {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.itch-category {
  font-size: 0.85rem;
  color: #858585;
  margin: 0 0 12px 0;
}

.itch-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.itch-price {
  font-size: 0.95rem;
  font-weight: 600;
  background-color: #434343;
  padding: 2px 6px;
  border-radius: 3px;
  color: #fff;
}

.itch-badge {
  font-size: 0.75rem;
  background-color: #4b5563;
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  font-weight: bold;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #858585;
  background-color: #2b2b2b;
  border-radius: 4px;
}

.itch-card.itch-out {
  opacity: 0.75;
}
</style>