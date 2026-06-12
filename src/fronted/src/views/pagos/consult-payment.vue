<template>
  <div class="page-card consult-page">
    <div class="page-header">
      <h2>Consultar Pago Móvil</h2>
      <p>Busca pagos por nombre, documento o teléfono y revisa el estado rápidamente.</p>
    </div>

    <form @submit.prevent="buscar" class="form-card">
      <div class="form-group">
        <label>Nombre</label>
        <input class="input-field" v-model="nombre" placeholder="Nombre del cliente" />
      </div>
      <div class="form-group">
        <label>Documento</label>
        <input class="input-field" v-model="documento" placeholder="Número de documento" />
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input class="input-field" v-model="telefono" placeholder="Teléfono del cliente" />
      </div>

      <div class="button-row">
        <button type="button" class="secondary-btn" @click="cancelar">Cancelar</button>
        <button type="submit" class="primary-btn">Buscar</button>
      </div>
    </form>

    <div v-if="error" class="alert error">{{ error }}</div>

    <div v-if="resultados.length" class="result-card">
      <h3>Pagos encontrados</h3>
      <ul>
        <li v-for="p in resultados" :key="p.pago_id" class="result-item">
          <div>
            <strong>Pago ID:</strong> {{ p.pago_id }}
            <span>• Monto: {{ p.monto }}</span>
            <span>• Estado: {{ p.estado }}</span>
          </div>
          <button type="button" class="select-btn" @click="verDetalles(p.pago_id)">Seleccionar</button>
        </li>
      </ul>
    </div>

    <div v-if="detalle" class="detail-card">
      <h3>Detalle del Pago</h3>
      <pre>{{ detalle }}</pre>
      <div class="actions">
        <button class="secondary-btn" @click="seguirViendo">Seguir viendo pagos</button>
        <button class="primary-btn" @click="volverABuscar">Terminar</button>
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

const cancelar = () => router.push('/pagos/consult')

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
.page-card {
  max-width: 760px;
  margin: 40px auto;
  padding: 32px;
  background: #1a1a1a;
  border: 1px solid #2e2e2e;
  border-radius: 22px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
}

.page-header h2,
.result-card h3,
.detail-card h3 {
  margin: 0 0 8px;
  color: #fff;
}

.page-header p {
  margin: 0 0 24px;
  color: #b8b3c1;
  line-height: 1.65;
}

.form-card {
  display: grid;
  gap: 18px;
}

.form-group {
  display: grid;
  gap: 8px;
}

label {
  color: #aaa;
  font-weight: 700;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #333;
  background: #121212;
  color: #fff;
}

.input-field:focus {
  outline: 1px solid #da5b5b;
  border-color: #da5b5b;
}

.button-row,
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
}

.primary-btn,
.secondary-btn,
.select-btn {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.primary-btn {
  background: #da5b5b;
  color: #fff;
}

.secondary-btn {
  background: #2b2b2b;
  color: #ddd;
  border: 1px solid #3a3a3a;
}

.primary-btn:hover,
.select-btn:hover {
  transform: translateY(-1px);
  background: #bd4b4b;
}

.secondary-btn:hover {
  background: #3a3a3a;
}

.alert.error {
  margin-top: 18px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(218, 91, 91, 0.16);
  color: #f2a2a2;
  border: 1px solid rgba(218, 91, 91, 0.28);
}

.result-card,
.detail-card {
  margin-top: 28px;
  padding: 22px;
  background: #141414;
  border: 1px solid #262626;
  border-radius: 18px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #242424;
  color: #ddd;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item span {
  display: inline-block;
  color: #aaa;
  margin-left: 10px;
}

.select-btn {
  background: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
}

pre {
  margin: 0;
  background: #111;
  padding: 18px;
  border-radius: 16px;
  overflow-x: auto;
  color: #f6f6f6;
}
</style>
