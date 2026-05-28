<script setup>
// Recibimos el juego desde App.vue y emitimos un evento para volver
const props = defineProps({
  juego: Object
});

const emit = defineEmits(['volver']);
</script>

<template>
  <div v-if="juego" class="game-page">
    <button @click="$emit('volver')" class="btn-back">← Volver al catálogo</button>

    <header class="game-hero">
      <h1>{{ juego.titulo }}</h1>
    </header>

    <div class="game-grid">
      <main class="content">
        <div class="image-wrapper">
          <img :src="juego.imagen_url" :alt="juego.titulo">
        </div>
        
        <section class="description">
          <h3>Sobre este juego</h3>
          <p>{{ juego.descripcion }}</p>
        </section>

        <section class="reviews">
          <h3>Reseñas de la comunidad</h3>
          <div class="review-box">
            <p>Aún no hay reseñas para este título. ¡Sé el primero en opinar!</p>
          </div>
        </section>
      </main>

      <aside class="sidebar">
        <div class="buy-card">
          <p class="price">{{ juego.precio == 0 ? 'Gratis' : '$' + juego.precio }}</p>
          <button class="btn-action">Descargar ahora</button>
        </div>
        
        <div class="info-card">
          <h4>Detalles del título</h4>
          <ul>
            <li><strong>Género:</strong> {{ juego.generos }}</li>
            <li><strong>Estado:</strong> {{ juego.disponible ? 'Publicado' : 'En desarrollo' }}</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
  <div v-else class="loader">Cargando la experiencia...</div>
</template>

<style scoped>
.game-page { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }

/* Estilo del botón volver */
.btn-back { background: none; border: 1px solid #444; color: #aaa; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; }
.btn-back:hover { color: white; border-color: white; }

.game-hero h1 { font-size: 3rem; margin-bottom: 2rem; color: #fff; }
.game-grid { display: grid; grid-template-columns: 1fr 320px; gap: 40px; }

.image-wrapper img { width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.description { margin: 30px 0; line-height: 1.8; color: #ccc; }
.reviews { margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; }
.review-box { background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 15px; }

.buy-card, .info-card { background: #1a1a1a; padding: 25px; border-radius: 12px; margin-bottom: 20px; }
.price { font-size: 2.2rem; font-weight: 800; color: #da5b5b; margin: 0 0 15px 0; }
.btn-action { width: 100%; padding: 14px; background: #da5b5b; border: none; color: white; font-weight: 700; border-radius: 6px; cursor: pointer; }
.info-card ul { list-style: none; padding: 0; }
.info-card li { padding: 8px 0; border-bottom: 1px solid #333; font-size: 0.9rem; }

@media (max-width: 768px) {
  .game-grid { grid-template-columns: 1fr; }
}
</style>