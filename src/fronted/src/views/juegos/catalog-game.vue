<script setup>
import { ref } from 'vue'

const juegos = ref([
  {
    id: 1,
    titulo: 'Project Zomboid',
    categoria: 'Survival RPG',
    precio: 19.99,
    imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', 
    disponible: true
  },
  {
    id: 2,
    titulo: "Don't Starve Together",
    categoria: 'Indie Survival',
    precio: 14.99,
    imagen: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80',
    disponible: true
  },
  {
    id: 3,
    titulo: 'Minecraft',
    categoria: 'Sandbox Adventure',
    precio: 29.99,
    imagen: 'https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?auto=format&fit=crop&w=400&q=80',
    disponible: false
  }
])
</script>

<template>
  <div class="itch-catalog">
    <header class="itch-header">
      <h1>Featured Games</h1>
      <p>Latest titles on HAZE</p>
    </header>

    <main class="itch-grid">
      <article 
        v-for="juego in juegos" 
        :key="juego.id" 
        class="itch-card"
        :class="{ 'itch-out': !juego.disponible }"
      >
        <div class="itch-card-image">
          <img :src="juego.imagen" :alt="juego.titulo">
        </div>
        
        <div class="itch-card-content">
          <h2 class="itch-title">{{ juego.titulo }}</h2>
          <p class="itch-category">{{ juego.categoria }}</p>
          
          <div class="itch-footer">
            <span class="itch-price">${{ juego.precio.toFixed(2) }}</span>
            <span v-if="!juego.disponible" class="itch-badge">In development</span>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
/* Fondo gris oscuro plano típico de itch.io (#222 o #1c1c1c) */
.itch-catalog {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  color: #dadada;
  background-color: #1c1c1c;
  min-height: 100vh;
}

/* Encabezado minimalista alineado a la izquierda */
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

/* Grilla densa y limpia */
.itch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* Tarjeta minimalista sin bordes exagerados */
.itch-card {
  background-color: #2b2b2b;
  border-radius: 4px; /* itch.io usa bordes casi rectos o muy sutiles */
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

/* Al pasar el mouse, itch.io aclara el fondo de la tarjeta */
.itch-card:hover {
  background-color: #383838;
}

/* Contenedor de la imagen con proporción fija de banner */
.itch-card-image {
  width: 100%;
  aspect-ratio: 16 / 10; /* Hace que todas las portadas tengan exactamente el mismo tamaño */
  background-color: #111;
  overflow: hidden;
}

.itch-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Textos compactos dentro de la tarjeta */
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
  text-overflow: ellipsis; /* Si el título es muy largo, le pone "..." */
}

.itch-category {
  font-size: 0.85rem;
  color: #858585;
  margin: 0 0 12px 0;
}

/* Fila de precio */
.itch-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.itch-price {
  font-size: 0.95rem;
  font-weight: 600;
  background-color: #434343; /* Bloque gris sutil para el precio */
  padding: 2px 6px;
  border-radius: 3px;
  color: #fff;
}

/* Etiqueta para juegos en desarrollo o agotados */
.itch-badge {
  font-size: 0.75rem;
  background-color: #da5b5b;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  font-weight: bold;
}

.itch-card.itch-out {
  opacity: 0.75;
}
</style>