<script setup>
import { ref } from 'vue'

// Avisamos a App.vue que este componente puede enviar el evento para volver
defineEmits(['volver'])

// Variables reactivas para capturar los datos del formulario
const titulo = ref('')
const categoria = ref('')
const precio = ref(0)
const imagen = ref('')
const disponible = ref(true)

// Función para manejar el envío del formulario
const guardarJuego = () => {
  // Aquí armamos el objeto con la información limpia
  const nuevoJuego = {
    titulo: titulo.value,
    categoria: categoria.value,
    precio: parseFloat(precio.value) || 0,
    imagen: imagen.value || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    disponible: disponible.value
  }

  console.log('Guardando en HAZE:', nuevoJuego)
  alert(`¡${nuevoJuego.titulo} se ha configurado con éxito de forma local!`)
}
</script>

<template>
  <div class="itch-add-game">
    <button class="btn-back" @click="$emit('volver')">
      ⬅ Volver al catálogo
    </button>

    <header class="form-header">
      <h1>Create a new project</h1>
      <p>Subir un nuevo videojuego independiente a la red de HAZE</p>
    </header>

    <div class="form-container">
      <form @submit.prevent="guardarJuego">
        
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            id="title"
            v-model="titulo" 
            type="text" 
            placeholder="Ej. Project Zomboid 2" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="category">Classification / Genre</label>
          <input 
            id="category"
            v-model="categoria" 
            type="text" 
            placeholder="Ej. Survival Horror, Metroidvania" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="price">Pricing ($ USD)</label>
          <input 
            id="price"
            v-model="precio" 
            type="number" 
            step="0.01" 
            min="0"
            placeholder="0.00" 
          />
          <span class="field-help">Coloca 0 si tu juego es Free-to-play o Name Your Own Price.</span>
        </div>

        <div class="form-group">
          <label for="image">Cover Image URL</label>
          <input 
            id="image"
            v-model="imagen" 
            type="url" 
            placeholder="https://ejemplo.com/portada.png" 
          />
          <span class="field-help">Pega el enlace de una imagen horizontal para la tarjeta del catálogo.</span>
        </div>

        <div class="form-group checkbox-group">
          <input 
            id="visibility"
            v-model="disponible" 
            type="checkbox" 
          />
          <label for="visibility">Publicado y disponible para la venta inmediata</label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit-project">
            Save & view page
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
.itch-add-game {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px 0;
}

.btn-back {
  background: none;
  border: 1px solid #434343;
  color: #dadada;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 25px;
  transition: all 0.15s ease;
}

.btn-back:hover {
  background-color: #2b2b2b;
  border-color: #858585;
  color: #fff;
}

.form-header {
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
  margin-bottom: 30px;
  text-align: left;
}

.form-header h1 {
  font-size: 1.8rem;
  color: #fff;
  margin: 0;
  font-weight: 600;
}

.form-header p {
  color: #858585;
  margin: 5px 0 0 0;
  font-size: 0.9rem;
}

/* Caja contenedora del formulario */
.form-container {
  background-color: #2b2b2b;
  padding: 25px;
  border-radius: 4px;
  border: 1px solid #333;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="url"] {
  background-color: #1c1c1c;
  border: 1px solid #434343;
  padding: 10px 12px;
  color: #fff;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.15s;
}

.form-group input:focus {
  outline: none;
  border-color: #da5b5b;
}

.field-help {
  font-size: 0.8rem;
  color: #858585;
}

/* Grupo especial para el Checkbox */
.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.checkbox-group input {
  width: 16px;
  height: 16px;
  accent-color: #da5b5b;
}

.checkbox-group label {
  font-weight: normal;
  font-size: 0.9rem;
  color: #dadada;
}

/* Botón de guardar estilo itch.io */
.form-actions {
  border-top: 1px solid #333;
  padding-top: 20px;
  margin-top: 30px;
}

.btn-submit-project {
  background-color: #da5b5b;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-submit-project:hover {
  background-color: #c44a4a;
}
</style>