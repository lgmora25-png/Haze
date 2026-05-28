<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 1. CAPTURAR EL ID PASADO POR EL ROUTER COMO PROP (Soluciona la carga del juego)
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()

// Variables de Estado del Juego
const juego = ref(null)
const cargando = ref(true)
const errorMensaje = ref(null)

// Variables para Historias de Usuario: Reseñas (Pablo Morillo)
const resenas = ref([])
const nuevoRating = ref(0)
const nuevoComentario = ref('')
const usuarioActual = ref('LuisMora_UCAB') // Simulación de usuario logueado en sesión
const poseeElJuego = ref(true) // Simulación requerida por el ERS (H5: comprobar si posee/jugó el título)

// Variables para Historias de Usuario: Gestión de Pagos (Adrian Arreaza)
const formularioPago = ref({
  nombreUsuario: '',
  telefono: '',
  cedula: '',
  bancoOrigen: '',
  referencia: ''
})

// Cargar información del juego y sus reseñas al montar el componente
onMounted(async () => {
  // Usamos la prop de manera segura y directa
  const juegoId = props.id
  try {
    cargando.value = true
    
    // 1. Obtener detalles del juego desde el backend
    const resJuego = await fetch(`http://127.0.0.1:3000/api/juegos/${juegoId}`)
    if (!resJuego.ok) throw new Error('No se pudo obtener la información del videojuego.')
    
    // CORRECCIÓN: Leemos el JSON de forma limpia y directa
    juego.value = await resJuego.json()
    
    // 2. Obtener reseñas vinculadas desde el backend
    const resResenas = await fetch(`http://127.0.0.1:3000/api/resenas/juego/${juegoId}`)
    if (resResenas.ok) {
      resenas.value = await resResenas.json()
    }
  } catch (error) {
    errorMensaje.value = error.message
    console.error(error)
  } finally {
    cargando.value = false
  }
})

// === HISTORIA DE USUARIO 5: REDACTAR RESEÑA ===
const publicarResena = async () => {
  // Criterio de Aceptación 1 y Conversación: Validar si posee y ha jugado el título
  if (!poseeElJuego.value) {
    alert("Debe tener y haber jugado el juego para publicar una reseña")
    return
  }

  // Regla de Negocio 2: Unicidad (Solo una reseña por juego)
  const yaReseno = resenas.value.some(r => r.usuario_nombre === usuarioActual.value)
  if (yaReseno) {
    alert("Solo puede tener una reseña publicada por juego")
    return
  }

  // Criterio de Aceptación 1: Calificación obligatoria
  if (nuevoRating.value === 0) {
    alert("Debe dar rating para publicar una reseña")
    return
  }

  try {
    const respuesta = await fetch('http://127.0.0.1:3000/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juego_id: props.id, // CORRECCIÓN: Enviamos la prop id correspondiente
        usuario_nombre: usuarioActual.value,
        rating: nuevoRating.value,
        comentario: nuevoComentario.value
      })
    })

    if (!respuesta.ok) {
      const errData = await respuesta.json()
      throw new Error(errData.mensaje || 'Error al publicar la reseña')
    }

    const dataJson = await respuesta.json()
    alert(dataJson.mensaje) // "Reseña publicada" (Criterio de Aceptación 2)
    
    // Recargar la lista localmente de inmediato
    resenas.value.unshift(dataJson.data)
    
    // Limpiar formulario
    nuevoRating.value = 0
    nuevoComentario.value = ''
  } catch (error) {
    alert(error.message)
  }
}

// === HISTORIA DE USUARIO 6: ELIMINAR RESEÑA ===
const borrarResena = async (idResena) => {
  // Criterio de Aceptación 1: Ventana emergente de confirmación
  const confirmar = confirm("¿Está seguro de que desea borrar su reseña?")
  if (!confirmar) return

  try {
    const respuesta = await fetch(`http://127.0.0.1:3000/api/resenas/${idResena}`, {
      method: 'DELETE'
    })

    if (!respuesta.ok) throw new Error('No se pudo eliminar la reseña.')

    const dataJson = await respuesta.json()
    alert(dataJson.mensaje) // "La reseña ha sido eliminada" (Criterio de Aceptación 2)

    // Filtrar el estado local para removerla de la pantalla
    resenas.value = resenas.value.filter(r => r.id !== idResena)
  } catch (error) {
    alert(error.message)
  }
}

// === HISTORIA DE USUARIO 7: PROCESAR PAGO MÓVIL (Simulación Rol Empleado) ===
const procesarPagoMovil = () => {
  // Criterio de Aceptación 1 y Validación de Robustez (Requisitos Suplementarios)
  const { nombreUsuario, telefono, cedula, bancoOrigen, referencia } = formularioPago.value

  if (!nombreUsuario || !telefono || !cedula || !bancoOrigen || !referencia) {
    alert("Error: Todos los campos del Pago Móvil son obligatorios.")
    return
  }

  // Simulación de validación de datos vinculados al cliente del ERS
  if (nombreUsuario !== usuarioActual.value) {
    alert("Error: El pago recibido no coincide con los datos del usuario que se está atendiendo.")
    return
  }

  alert("¡Pago Móvil Procesado con Éxito! Transacción vinculada al cliente.");
  // Resetear formulario tras confirmación
  formularioPago.value = { nombreUsuario: '', telefono: '', cedula: '', bancoOrigen: '', referencia: '' }
}
</script>

<template>
  <div class="info-game-container">
    <button @click="router.push({ name: 'catalog' })" class="btn-regresar">⬅ Volver al Catálogo</button>

    <div v-if="cargando" class="loading-box">⏳ Cargando detalles del videojuego en HAZE...</div>
    <div v-else-if="errorMensaje" class="error-box">⚠️ Error: {{ errorMensaje }}</div>
    
    <div v-else>
      <header class="game-header">
        <h1>{{ juego?.titulo || 'Videojuego de HAZE' }}</h1>
        <span class="game-price-tag">
          Precio: {{ juego?.precio == 0 ? 'Gratis' : '$' + Number(juego?.precio).toFixed(2) }}
        </span>
      </header>

      <div class="game-grid-layout">
        
        <section class="reviews-section">
          <h2>Sección de Reseñas</h2>
          
          <div class="add-review-card">
            <h3>Publicar una opinión</h3>
            
            <div class="rating-selector">
              <label>Calificación (Estrellas 1-5): </label>
              <select v-model.number="nuevoRating" class="form-select">
                <option value="0">Seleccionar...</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
            </div>

            <textarea 
              v-model="nuevoComentario" 
              placeholder="Escribe tu comentario sobre el juego aquí (Opcional)..." 
              class="form-textarea"
            ></textarea>

            <button @click="publicarResena" class="btn-submit-review">Publicar Reseña</button>
          </div>

          <div class="reviews-list">
            <h3>Opiniones de la Comunidad UCAB</h3>
            <div v-if="resenas.length === 0" class="no-reviews-msg">Nadie ha publicado reseñas sobre este juego aún.</div>
            
            <article v-for="resena in resenas" :key="resena.id" class="review-item">
              <div class="review-meta">
                <strong>👤 {{ resena.usuario_nombre }}</strong>
                <span class="stars-display">{{ '⭐'.repeat(resena.rating) }}</span>
                <small>📅 {{ new Date(resena.creado_at).toLocaleDateString() }}</small>
              </div>
              <p class="review-body">{{ resena.comentario || '*Sin comentario escrito*' }}</p>
              
              <button 
                v-if="resena.usuario_nombre === usuarioActual" 
                @click="borrarResena(resena.id)" 
                class="btn-delete-review"
              >
                🗑️ Eliminar mi reseña
              </button>
            </article>
          </div>
        </section>

        <section class="payments-section">
          <h2>Gestionar Pagos</h2>
          <div class="payment-card">
            <h3>Procesar Pago Móvil (Módulo del Empleado)</h3>
            <p class="payment-desc">Registro analítico y simulación de conciliación financiera de la UCAB.</p>
            
            <div class="form-group">
              <label>Nombre del Usuario:</label>
              <input v-model="formularioPago.nombreUsuario" type="text" placeholder="Ej: LuisMora_UCAB" class="form-input" />
            </div>

            <div class="form-group">
              <label>Número Telefónico:</label>
              <input v-model="formularioPago.telefono" type="text" placeholder="Ej: 04121234567" class="form-input" />
            </div>

            <div class="form-group">
              <label>Cédula de Identidad:</label>
              <input v-model="formularioPago.cedula" type="text" placeholder="Ej: V-25123456" class="form-input" />
            </div>

            <div class="form-group">
              <label>Banco de Origen:</label>
              <input v-model="formularioPago.bancoOrigen" type="text" placeholder="Ej: Banco de Venezuela" class="form-input" />
            </div>

            <div class="form-group">
              <label>Número de Referencia (Últimos 4/6 dígitos):</label>
              <input v-model="formularioPago.referencia" type="text" placeholder="Ej: 9876" class="form-input" />
            </div>

            <button @click="procesarPagoMovil" class="btn-submit-payment">⚡ Procesar Transacción</button>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
.info-game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
}

.btn-regresar {
  background-color: #434343;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: 600;
}

.btn-regresar:hover {
  background-color: #555;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
  margin-bottom: 25px;
}

.game-header h1 {
  font-size: 2.2rem;
  margin: 0;
}

.game-price-tag {
  background-color: #da5b5b;
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
}

.game-grid-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 30px;
}

h2 {
  border-left: 4px solid #da5b5b;
  padding-left: 10px;
  font-size: 1.4rem;
  margin-bottom: 20px;
}

.add-review-card, .payment-card {
  background-color: #2b2b2b;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 25px;
}

.add-review-card h3, .payment-card h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: #da5b5b;
}

.rating-selector {
  margin-bottom: 15px;
}

.form-select, .form-textarea, .form-input {
  background-color: #1c1c1c;
  border: 1px solid #434343;
  color: white;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  height: 80px;
  resize: vertical;
  margin-bottom: 15px;
}

.btn-submit-review {
  background-color: #da5b5b;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-submit-review:hover {
  background-color: #c44a4a;
}

.reviews-list {
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 6px;
}

.review-item {
  background-color: #2b2b2b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  border-left: 3px solid #6b7280;
}

.review-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.stars-display {
  color: #fbbf24;
}

.review-body {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #ddd;
}

.btn-delete-review {
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 3px 8px;
  font-size: 0.75rem;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 5px;
}

.btn-delete-review:hover {
  background-color: #ff6b6b;
  color: white;
}

.payment-desc {
  font-size: 0.85rem;
  color: #a3a3a3;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: #ccc;
}

.btn-submit-payment {
  background-color: #10b981;
  color: white;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.btn-submit-payment:hover {
  background-color: #059669;
}

.loading-box, .error-box, .no-reviews-msg {
  text-align: center;
  padding: 30px;
  color: #aaa;
  background-color: #2b2b2b;
  border-radius: 4px;
}
</style>