<template>
  <div>
    <h2>Consultar Pago Móvil</h2>

    <form @submit.prevent="buscar">
      <div>
        <label>Nombre</label>
        <input v-model="nombre" />
      </div>
      <div>
        <label>Documento</label>
        <input v-model="documento" />
      </div>
      <div>
        <label>Teléfono</label>
        <input v-model="telefono" />
      </div>

      <div class="buttons">
        <button type="button" @click="cancelar">Cancelar</button>
        <button type="submit">Confirmar</button>
      </div>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="resultados.length">
      <h3>Pagos encontrados</h3>
      <ul>
        <li v-for="p in resultados" :key="p.pago_id">
          <button @click="verDetalles(p.pago_id)">Seleccionar</button>
          Pago ID: {{ p.pago_id }} - Monto: {{ p.monto }} - Estado: {{ p.estado }}
        </li>
      </ul>
    </div>

    <div v-if="detalle">
      <h3>Detalle del Pago (solo lectura)</h3>
      <pre>{{ detalle }}</pre>
      <div class="actions">
        <button @click="seguirViendo">Seguir viendo pagos</button>
        <button @click="volverABuscar">Terminar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nombre = ref('')
const documento = ref('')
const telefono = ref('')
const resultados = ref([])
const detalle = ref(null)
const error = ref('')

const cancelar = () => router.push('/pagos/manage')

const buscar = async () => {
  error.value = ''
  detalle.value = null
  resultados.value = []

  try {
    const res = await fetch('http://localhost:3000/api/pagos/consultar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre.value, documento: documento.value, telefono: telefono.value })
    })

    if (!res.ok) {
      const d = await res.json()
      throw new Error(d.mensaje || d.error || 'No se pudo consultar')
    }

    resultados.value = await res.json()
  } catch (err) {
    error.value = err.message || 'Error inesperado buscando pagos.'
  }
}

const verDetalles = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/pagos/${id}`)
    if (!res.ok) throw new Error('No se pudo obtener detalle')
    detalle.value = await res.json()
  } catch (err) {
    error.value = err.message || 'Error cargando detalle.'
  }
}

const seguirViendo = () => {
  detalle.value = null
}

const volverABuscar = () => {
  resultados.value = []
  detalle.value = null
  nombre.value = ''
  documento.value = ''
  telefono.value = ''
}
</script>

<style scoped>
.error { color: #f27b7b }
.buttons { display:flex; gap:10px; margin-top:12px }
.actions { display:flex; gap:8px; margin-top:12px }
pre { background: #111; padding:12px; border-radius:8px }
</style>
