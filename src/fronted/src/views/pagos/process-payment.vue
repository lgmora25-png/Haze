<template>
  <div>
    <h2>Procesar Pago Móvil</h2>

    <form @submit.prevent="confirmar">
      <div>
        <label>ID del pago</label>
        <input v-model="id" placeholder="Escribe el id del pago" />
      </div>

      <div>
        <label>Documento del cliente</label>
        <input v-model="cliente_documento" placeholder="Documento" />
      </div>

      <div>
        <label>Nombre del cliente</label>
        <input v-model="cliente_nombre" placeholder="Nombre" />
      </div>

      <div>
        <label>Teléfono</label>
        <input v-model="telefono" placeholder="Teléfono" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="buttons">
        <button type="button" @click="cancelar">Cancelar</button>
        <button type="submit">Confirmar</button>
      </div>
    </form>

    <div v-if="mensaje" class="success">{{ mensaje }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const id = ref(route.query.id || '')
const cliente_documento = ref('')
const cliente_nombre = ref('')
const telefono = ref('')
const error = ref('')
const mensaje = ref('')

const cancelar = () => {
  mensaje.value = ''
  error.value = ''
  router.push('/pagos/manage')
}

const confirmar = async () => {
  error.value = ''
  mensaje.value = ''

  if (!id.value) {
    error.value = 'Debe ingresar el id del pago.'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/pagos/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id.value,
        cliente_documento: cliente_documento.value,
        cliente_nombre: cliente_nombre.value,
        telefono: telefono.value,
        confirmar: true
      })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.mensaje || data.error || 'Error procesando pago')

    mensaje.value = data.mensaje || 'Pago procesado con éxito.'
    // Tras confirmar éxito, esperar confirmación del empleado para volver
    setTimeout(() => router.push('/pagos/manage'), 1200)
  } catch (err) {
    error.value = err.message || 'Error inesperado.'
  }
}
</script>

<style scoped>
.error { color: #f27b7b }
.success { color: #7be27b }
.buttons { display:flex; gap:10px; margin-top:12px }
button { padding:8px 12px; border-radius:6px }
</style>
