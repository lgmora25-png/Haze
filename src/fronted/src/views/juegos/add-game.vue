<script setup> // Importamos las funciones necesarias de Vue y Vue Router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cargando = ref(false)

// Estado del formulario
const juego = ref({
  titulo: '',
  precio: 0,
  generos: '',
  descripcion: '',
  imagen_url: '' // Aquí se guarda el texto Base64 de la foto local
})

// Función para procesar la imagen local de la PC
const MAX_IMAGEN_MB = 2 // Base64 crece ~33%
const procesarImagen = (event) => {
  const archivo = event.target.files[0]
  if (!archivo) return

  const maxBytes = MAX_IMAGEN_MB * 1024 * 1024
  if (archivo.size > maxBytes) {
    alert(`❌ La imagen es demasiado grande. Máximo permitido: ${MAX_IMAGEN_MB}MB.`)
    event.target.value = ''
    juego.value.imagen_url = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    juego.value.imagen_url = e.target.result
  }
  reader.readAsDataURL(archivo)
}


const publicarJuego = async () => {
  if (!juego.value.titulo || !juego.value.imagen_url) {
    alert("Por favor, completa al menos el título y selecciona una imagen.")
    return
  }

  cargando.value = true

  try {
    // === PASO 1: VALIDACIÓN DE DUPLICADOS ===
    // Consultamos los juegos que ya están guardados en la base de datos
    const resValidar = await fetch('http://localhost:3000/api/juegos')
    
    if (resValidar.ok) {
      const juegosExistentes = await resValidar.json()

      // 1. Validar si el título ya existe (ignorando mayúsculas/minúsculas y espacios extras)
      const tituloExiste = juegosExistentes.some(
        j => j.titulo.trim().toLowerCase() === juego.value.titulo.trim().toLowerCase()
      )

      // Si el título se repite, detenemos el proceso
      if (tituloExiste) {
        alert("❌ Error: Ya existe un juego publicado con este título en HAZE.")
        cargando.value = false
        return
      }
    }

    // === PASO 2: REGISTRO DEL JUEGO (Si pasó las validaciones) ===
    const res = await fetch('http://localhost:3000/api/juegos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(juego.value)
    })
    
    if (res.ok) {
      alert('¡Juego publicado con éxito!')
      router.push('/') // Volvemos al catálogo
    } else {
      let errorMessage = 'No se pudo publicar'
      try {
        const errorData = await res.json()
        errorMessage = errorData.error || errorData.details || errorMessage
      } catch (jsonError) {
        const text = await res.text()
        if (text) errorMessage = text
      }
      alert('Error: ' + errorMessage)
    }
  } catch (err) {
    console.error("Error en el flujo:", err)
    alert("Hubo un problema al conectar con el servidor.")
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="add-game-page">
    <header class="header">
      <h1>Subir un nuevo juego</h1>
      <p>Comparte tu creación con la comunidad de HAZE.</p>
    </header>

    <form @submit.prevent="publicarJuego" class="game-form">
      <div class="form-group">
        <label>Título del juego</label>
        <input v-model="juego.titulo" type="text" required placeholder="Ej: Project Zomboid" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Precio ($)</label>
          <input v-model="juego.precio" type="number" step="0.01" min="0" />
        </div>
        <div class="form-group">
          <label>Géneros</label>
          <input v-model="juego.generos" type="text" placeholder="Ej: Survival, RPG" />
        </div>
      </div>

      <div class="form-group">
        <label>Portada del juego (Selecciona un archivo de tu PC)</label>
        <input 
          type="file" 
          accept="image/*" 
          @change="procesarImagen" 
          required 
          class="file-input"
        />
        
        <div v-if="juego.imagen_url" class="preview-container">
          <p>Vista previa de la portada:</p>
          <img :src="juego.imagen_url" alt="Previsualización" class="image-preview" />
        </div>
      </div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea v-model="juego.descripcion" rows="5" required placeholder="Cuenta de qué trata tu juego..."></textarea>
      </div>

      <button type="submit" class="btn-publish" :disabled="cargando">
        {{ cargando ? 'Verificando y publicando...' : 'Publicar juego' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.add-game-page { max-width: 600px; margin: 40px auto; padding: 20px; }
.header { margin-bottom: 30px; text-align: center; }
.header h1 { font-size: 2rem; color: #fff; margin-bottom: 10px; }
.header p { color: #888; }

.game-form { background: #1a1a1a; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

label { display: block; margin-bottom: 8px; color: #aaa; font-size: 0.9rem; }
input, textarea { width: 100%; padding: 12px; background: #2b2b2b; border: 1px solid #444; border-radius: 6px; color: white; box-sizing: border-box; }
input:focus, textarea:focus { outline: 1px solid #da5b5b; }

.file-input { padding: 10px; background: #2b2b2b; cursor: pointer; }

.preview-container { margin-top: 15px; padding: 15px; background: #222; border-radius: 8px; border: 1px dashed #444; text-align: center; }
.preview-container p { font-size: 0.85rem; color: #888; margin: 0 0 10px 0; }
.image-preview { max-width: 100%; max-height: 200px; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }

.btn-publish { width: 100%; padding: 15px; background: #da5b5b; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer; transition: 0.3s; }
.btn-publish:hover { background: #b04848; }
.btn-publish:disabled { background: #555; cursor: not-allowed; }
</style>