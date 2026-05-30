<template>
  <div>
    <h2>Procesar Pago Móvil</h2>

    <form @submit.prevent="confirmar">
      <div>
        <label>Referencia de pago (pago_ref)</label>
        <input v-model="id" @blur="loadPago" :disabled="loading" placeholder="Escribe la referencia del pago (pago_ref)" />
        <div v-if="errorId" class="field-error">{{ errorId }}</div>
      </div>

      <div>
        <label>Documento del cliente</label>
        <input v-model="cliente_documento" :disabled="loading" placeholder="Documento" />
        <div v-if="errorDoc" class="field-error">{{ errorDoc }}</div>
      </div>

      <div>
        <label>Nombre del cliente</label>
        <input v-model="cliente_nombre" :disabled="loading" placeholder="Nombre" />
        <div v-if="errorNombre" class="field-error">{{ errorNombre }}</div>
      </div>

      <div>
        <label>Teléfono</label>
        <input v-model="telefono" :disabled="loading" placeholder="Teléfono" />
        <div v-if="errorTelefono" class="field-error">{{ errorTelefono }}</div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="buttons">
        <button type="button" @click="cancelar" :disabled="loading">Cancelar</button>
        <button type="submit" :disabled="loading">Confirmar</button>
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

const errorId = ref('')
const errorDoc = ref('')
const errorNombre = ref('')
const errorTelefono = ref('')
const loading = ref(false)

// Carga optimizada: intenta obtener los datos del pago por ID para prellenar campos
const loadPago = async () => {
  error.value = ''
  errorId.value = ''
  if (!id.value) return

    loading.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/pagos/${encodeURIComponent(id.value)}`)
    if (res.ok) {
      const data = await res.json()
      cliente_documento.value = data.cliente_documento || cliente_documento.value
      cliente_nombre.value = data.cliente_nombre || cliente_nombre.value
      telefono.value = data.telefono || telefono.value
        mensaje.value = 'Pago encontrado.'
    } else {
      const data = await res.json().catch(() => ({}))
      if (res.status === 404) {
        errorId.value = data.mensaje || 'Pago no encontrado.'
      } else {
        error.value = data.error || data.mensaje || 'Error al cargar el pago.'
      }
    }
  } catch (err) {
    error.value = err.message || 'Error de conexión.'
  } finally {
    loading.value = false
  }
}

const cancelar = () => {
  mensaje.value = ''
  error.value = ''
  router.push('/pagos/manage')
}

const confirmar = async () => {
  // Reset field errors
  error.value = ''
  errorId.value = ''
  errorDoc.value = ''
  errorNombre.value = ''
  errorTelefono.value = ''
  mensaje.value = ''

  if (!id.value) {
    errorId.value = 'Debe ingresar el id del pago.'
    return
  }

  loading.value = true
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

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      // Map server messages to inline field errors when possible
      const msg = (data.mensaje || data.error || '').toLowerCase()
      if (msg.includes('documento')) {
        errorDoc.value = data.mensaje || data.error
      } else if (msg.includes('pago no encontrado') || msg.includes('no encontrado')) {
        errorId.value = data.mensaje || data.error
      } else if (msg.includes('se requiere') && msg.includes('id')) {
        errorId.value = data.mensaje || data.error
      } else {
        error.value = data.mensaje || data.error || 'Error procesando pago.'
      }
      return
    }

    mensaje.value = data.mensaje || 'Pago procesado con éxito.'
    // Mostrar confirmación al empleado y redirigir solo al aceptar
    if (confirm(mensaje.value + '\n\nPresiona OK para volver a la gestión de pagos.')) {
      router.push('/pagos/manage')
    }
  } catch (err) {
    error.value = err.message || 'Error inesperado.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error { color: #f27b7b }
.success { color: #7be27b }
.buttons { display:flex; gap:10px; margin-top:12px }
button { padding:8px 12px; border-radius:6px }
</style>
