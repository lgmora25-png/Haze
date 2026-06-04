<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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
const usuarioNombre = ref(localStorage.getItem('usuarioNombre') || '')
const estaLogueado = ref(Boolean(localStorage.getItem('usuarioId')))
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

const puedeEliminar = (review) => {
  return estaLogueado.value && usuarioNombre.value && review.usuario_nombre === usuarioNombre.value
}

const enviarResena = async () => {
  errorMensaje.value = ''

  if (!estaLogueado.value) {
    const deseaLogin = confirm('Solo puedes redactar reseñas si estás logueado. ¿Deseas iniciar sesión ahora?')
    if (deseaLogin) {
      router.push('/login')
    }
    return
  }

  let usuarioParaEnviar = usuarioNombre.value.trim()

  if (!nuevoComentario.value.trim()) {
    errorMensaje.value = 'Completa tu comentario antes de enviar.'
    return
  }

  if (nuevoRating.value < 1 || nuevoRating.value > 5) {
    errorMensaje.value = 'El rating debe ser entre 1 y 5.'
    return
  }

  cargandoEnvio.value = true

  try {
    // Si estamos logueados pero no tenemos el nombre en memoria, lo pedimos al backend
    if (estaLogueado.value && !usuarioNombre.value) {
      try {
        const resPerfil = await fetch(`http://localhost:3000/api/usuarios/perfil/${localStorage.getItem('usuarioId')}`)
        if (resPerfil.ok) {
          const perfilData = await resPerfil.json()
          usuarioNombre.value = perfilData.nombre_usuario || perfilData.nombre || usuarioNombre.value || ''
          if (usuarioNombre.value) localStorage.setItem('usuarioNombre', usuarioNombre.value)
        }
      } catch (err) {
        console.warn('No se pudo recuperar nombre de usuario antes de enviar la reseña:', err)
      }
    }

    if (!usuarioNombre.value.trim()) {
      throw new Error('No se pudo recuperar tu nombre de usuario. Vuelve a iniciar sesión.')
    }
    usuarioParaEnviar = usuarioNombre.value.trim()
    const res = await fetch('http://localhost:3000/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juego_id: juegoId.value,
        usuario_nombre: usuarioParaEnviar,
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
  if (!estaLogueado.value) {
    errorMensaje.value = 'Debes iniciar sesión para eliminar reseñas.'
    return
  }

  if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return

  errorMensaje.value = ''
  try {
    const res = await fetch(`http://localhost:3000/api/resenas/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_nombre: usuarioNombre.value })
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

const handleSessionUpdated = () => {
  usuarioNombre.value = localStorage.getItem('usuarioNombre') || ''
  estaLogueado.value = Boolean(localStorage.getItem('usuarioId'))
}

onMounted(async () => {
  handleSessionUpdated()
  await loadGameData()
  await loadReviews()
})

window.addEventListener('session-updated', handleSessionUpdated)

onBeforeUnmount(() => {
  window.removeEventListener('session-updated', handleSessionUpdated)
})

// Si el ID cambia (por ejemplo, navegando entre juegos), recargamos todo
watch(() => route.params.id, async () => {
  await loadGameData()
  await loadReviews()
})

const irAProcesarPago = () => {
  router.push('/pagos/process')
}

const volver = () => router.push('/')
</script>

<template>
  <div v-if="juegoLocal" class="game-page">
    <button @click="volver" class="btn-back">← Volver al catálogo</button>

    <header class="game-hero">
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
                      v-if="puedeEliminar(review)"
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

            <div v-if="!estaLogueado" class="review-group alert">
              <p>Solo puedes redactar reseñas si estás logueado. Si deseas comentar, inicia sesión primero.</p>
            </div>

            <div v-else class="review-group logged-in-note">
              <p>Tu comentario se publicará como <strong>{{ usuarioNombre || 'Usuario conectado' }}</strong>.</p>
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
          <button class="btn-action" @click="irAProcesarPago">Procesar Pago</button>
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
.review-form {
  margin-top: 25px;
  padding: 28px;
  background: linear-gradient(180deg, rgba(24,24,24,0.98) 0%, rgba(20,20,20,0.95) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(0,0,0,0.35);
}
.review-form-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 22px;
}
.review-form h4 {
  margin: 0 0 6px;
  font-size: 1.4rem;
  color: #fff;
}
.review-form-description {
  margin: 0;
  color: #b8b8b8;
  line-height: 1.6;
}
.review-group { margin-bottom: 18px; }
.review-row { display: grid; grid-template-columns: 1fr; gap: 16px; }
.review-group label { display: block; color: #aaa; margin-bottom: 10px; font-weight: 600; }
.review-group input,
.review-group textarea,
.review-group select { width: 100%; padding: 14px 16px; border-radius: 14px; border: 1px solid #2f2f2f; background: #121212; color: #fff; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03); }
.review-group input:focus,
.review-group textarea:focus,
.review-group select:focus { outline: none; border-color: #da5b5b; }
.review-group textarea { min-height: 150px; resize: vertical; }
.logged-in-note { background: rgba(218,91,91,0.08); border: 1px solid rgba(218,91,91,0.18); padding: 14px 16px; border-radius: 14px; color: #e0d7d7; }
.logged-in-note strong { color: #fff; }
.form-error { color: #f27b7b; margin-bottom: 16px; font-weight: 700; }
.btn-submit { width: 100%; padding: 16px; border: none; background: #ff5c5c; color: white; border-radius: 14px; cursor: pointer; font-weight: 700; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 26px rgba(255,92,92,0.28); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.buy-card, .info-card { background: #1a1a1a; padding: 25px; border-radius: 12px; margin-bottom: 20px; }
.price { font-size: 2.2rem; font-weight: 800; color: #da5b5b; margin: 0 0 15px 0; }
.btn-action { width: 100%; padding: 14px; background: #da5b5b; border: none; color: white; font-weight: 700; border-radius: 6px; cursor: pointer; }
.info-card ul { list-style: none; padding: 0; }
.info-card li { padding: 8px 0; border-bottom: 1px solid #333; font-size: 0.9rem; }

@media (max-width: 768px) {
  .game-grid { grid-template-columns: 1fr; }
}
</style>