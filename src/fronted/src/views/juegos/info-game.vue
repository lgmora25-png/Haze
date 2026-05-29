<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  juego: Object
})

const route = useRoute()
const router = useRouter()

const juegoLocal = ref(null)
const reviews = ref([])
const nuevoComentario = ref('')
const nuevoRating = ref(5)
const nuevoUsuario = ref('')
const cargandoJuego = ref(false)
const cargandoResenas = ref(false)
const cargandoEnvio = ref(false)
const errorMensaje = ref('')

// El ID ahora puede venir de la prop o de la URL del navegador
const juegoId = computed(() => props.juego?.juego_id ?? props.juego?.id ?? route.params.id ?? route.params.juego_id ?? '')

const loadGameData = async () => {
  if (!juegoId.value) return

  // Si llega por props (opcional), úsala solo si realmente trae datos.
  if (props.juego && (props.juego.titulo || props.juego.juego_id || props.juego.id)) {
    juegoLocal.value = props.juego
    return
  }

  cargandoJuego.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/juegos/${juegoId.value}`)
    if (res.ok) {
      const data = await res.json()
      // Si la API devuelve el objeto dentro de una propiedad 'data'
      juegoLocal.value = data.data || data
    }
  } catch (err) {
    console.error("Error cargando el juego:", err)
  } finally {
    cargandoJuego.value = false
  }
}

const loadReviews = async () => {
  if (!juegoId.value) return
  cargandoResenas.value = true
  errorMensaje.value = ''

  try {
    const res = await fetch(`http://localhost:3000/api/resenas/juego/${juegoId.value}`)
    if (!res.ok) throw new Error('No se pudieron cargar las reseñas')
    reviews.value = await res.json()
  } catch (err) {
    console.error(err)
    errorMensaje.value = 'Error al cargar reseñas.'
  } finally {
    cargandoResenas.value = false
  }
}

const enviarResena = async () => {
  errorMensaje.value = ''

  if (!nuevoUsuario.value.trim() || !nuevoComentario.value.trim()) {
    errorMensaje.value = 'Completa tu nombre y el comentario antes de enviar.'
    return
  }

  if (nuevoRating.value < 1 || nuevoRating.value > 5) {
    errorMensaje.value = 'El rating debe ser entre 1 y 5.'
    return
  }

  cargandoEnvio.value = true

  try {
    const res = await fetch('http://localhost:3000/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juego_id: juegoId.value,
        usuario_nombre: nuevoUsuario.value.trim(),
        rating: Number(nuevoRating.value),
        comentario: nuevoComentario.value.trim()
      })
    })

    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(responseData.mensaje || responseData.error || 'No se pudo enviar la reseña')
    }

    const nuevaResena = responseData.data ?? responseData
    reviews.value.unshift(nuevaResena)
    nuevoUsuario.value = ''
    nuevoComentario.value = ''
    nuevoRating.value = 5
  } catch (err) {
    console.error(err)
    errorMensaje.value = err.message || 'Error al enviar la reseña.'
  } finally {
    cargandoEnvio.value = false
  }
}

const eliminarResena = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return

  errorMensaje.value = ''
  try {
    const res = await fetch(`http://localhost:3000/api/resenas/${id}`, {
      method: 'DELETE'
    })

    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(responseData.error || 'No se pudo eliminar la reseña')
    }

    reviews.value = reviews.value.filter(review => review.id !== id)
  } catch (err) {
    console.error(err)
    errorMensaje.value = err.message || 'Error al eliminar la reseña.'
  }
}

onMounted(async () => {
  await loadGameData()
  await loadReviews()
})

// Si el ID cambia (por ejemplo, navegando entre juegos), recargamos todo
watch(() => route.params.id, async () => {
  await loadGameData()
  await loadReviews()
})

const volver = () => router.push('/')
</script>

<template>
  <div v-if="juegoLocal" class="game-page">
    <button @click="volver" class="btn-back">← Volver al catálogo</button>

    <header class="game-hero">
      <h1>{{ juegoLocal.titulo }}</h1>
      <h1>{{ juegoLocal.titulo || 'Cargando título...' }}</h1>
    </header>

    <div class="game-grid">
      <main class="content">
        <div class="image-wrapper">
          <img :src="juegoLocal.imagen_url" :alt="juegoLocal.titulo">
          <img :src="juegoLocal.imagen_url" :alt="juegoLocal.titulo">
        </div>
        
        <section class="description">
          <h3>Sobre este juego</h3>
          <p>{{ juegoLocal.descripcion }}</p>
        </section>

        <section class="reviews">
          <h3>Reseñas de la comunidad</h3>

          <div v-if="cargandoResenas" class="review-box">
            <p>Cargando reseñas...</p>
          </div>

          <div v-else>
            <template v-if="reviews.length">
              <div v-for="review in reviews" :key="review.id" class="review-box">
                <div class="review-meta">
                  <strong>{{ review.usuario_nombre }}</strong>
                  <div class="review-meta-right">
                    <span class="rating">★ {{ review.rating }}</span>
                    <button
                      type="button"
                      class="btn-delete"
                      @click="eliminarResena(review.id)"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p>{{ review.comentario }}</p>
                <small>{{ new Date(review.creado_at).toLocaleDateString('es-ES') }}</small>
              </div>
            </template>

            <div v-else class="review-box">
              <p>Aún no hay reseñas para este título. ¡Sé el primero en opinar!</p>
            </div>
          </div>

          <form @submit.prevent="enviarResena" class="review-form">
            <h4>Deja tu reseña</h4>

            <div class="review-group">
              <label>Nombre</label>
              <input v-model="nuevoUsuario" type="text" placeholder="Tu nombre o nickname" />
            </div>

            <div class="review-row">
              <div class="review-group">
                <label>Rating</label>
                <select v-model.number="nuevoRating">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
            </div>

            <div class="review-group">
              <label>Comentario</label>
              <textarea v-model="nuevoComentario" rows="4" placeholder="Escribe tu opinión..."></textarea>
            </div>

            <p v-if="errorMensaje" class="form-error">{{ errorMensaje }}</p>

            <button type="submit" class="btn-submit" :disabled="cargandoEnvio">
              {{ cargandoEnvio ? 'Enviando...' : 'Publicar reseña' }}
            </button>
          </form>
        </section>
      </main>

      <aside class="sidebar">
        <div class="buy-card">
          <p class="price">{{ juegoLocal.precio == 0 ? 'Gratis' : '$' + juegoLocal.precio }}</p>
          <button class="btn-action">Descargar ahora</button>
        </div>
        
        <div class="info-card">
          <h4>Detalles del título</h4>
          <ul>
            <li><strong>Género:</strong> {{ juegoLocal.generos }}</li>
            <li><strong>Estado:</strong> {{ juegoLocal.disponible ? 'Publicado' : 'En desarrollo' }}</li>
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
.review-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #ddd; }
.review-meta-right { display: flex; align-items: center; gap: 12px; }
.rating { color: #da5b5b; font-weight: 700; }
.btn-delete { background: transparent; border: 1px solid #777; padding: 6px 12px; border-radius: 8px; color: #f27b7b; cursor: pointer; transition: background 0.2s ease; }
.btn-delete:hover { background: rgba(242, 123, 123, 0.15); }
.btn-delete:active { transform: translateY(1px); }
.review-form { margin-top: 25px; padding: 20px; background: #141414; border: 1px solid #333; border-radius: 12px; }
.review-group { margin-bottom: 16px; }
.review-row { display: grid; grid-template-columns: 1fr; gap: 16px; }
.review-group label { display: block; color: #aaa; margin-bottom: 8px; }
.review-group input,
.review-group textarea,
.review-group select { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #444; background: #1a1a1a; color: #fff; }
.review-group textarea { min-height: 130px; resize: vertical; }
.form-error { color: #f27b7b; margin-bottom: 12px; }
.btn-submit { width: 100%; padding: 14px; border: none; background: #da5b5b; color: white; border-radius: 8px; cursor: pointer; }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.buy-card, .info-card { background: #1a1a1a; padding: 25px; border-radius: 12px; margin-bottom: 20px; }
.price { font-size: 2.2rem; font-weight: 800; color: #da5b5b; margin: 0 0 15px 0; }
.btn-action { width: 100%; padding: 14px; background: #da5b5b; border: none; color: white; font-weight: 700; border-radius: 6px; cursor: pointer; }
.info-card ul { list-style: none; padding: 0; }
.info-card li { padding: 8px 0; border-bottom: 1px solid #333; font-size: 0.9rem; }

@media (max-width: 768px) {
  .game-grid { grid-template-columns: 1fr; }
}
</style>