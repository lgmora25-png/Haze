<template>
  <div class="page-card process-page">
    <div class="page-header">
      <h2>Procesar Pago Móvil</h2>
      <p>Completa la información del pago y confirma para registrar la transacción.</p>
    </div>

    <form @submit.prevent="confirmar" class="form-card">
      <div class="form-group">
        <label>ID del pago</label>
        <input class="input-field" v-model="id" placeholder="Escribe el id del pago" />
      </div>

      <div class="form-group">
        <label>Documento del cliente</label>
        <input class="input-field" v-model="cliente_documento" placeholder="Documento" />
      </div>

      <div class="form-group">
        <label>Nombre del cliente</label>
        <input class="input-field" v-model="cliente_nombre" placeholder="Nombre" />
      </div>

      <div class="form-group">
        <label>Teléfono</label>
        <input class="input-field" v-model="telefono" placeholder="Teléfono" />
      </div>

      <div v-if="error" class="alert error">{{ error }}</div>

      <div class="button-row">
        <button type="button" class="secondary-btn" @click="cancelar">Cancelar</button>
        <button type="submit" class="primary-btn">Confirmar</button>
      </div>
    </form>

    <div v-if="mensaje" class="alert success">{{ mensaje }}</div>
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
  router.push('/pagos/consult')
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
    setTimeout(() => router.push('/pagos/consult'), 1200)
  } catch (err) {
    error.value = err.message || 'Error inesperado.'
  }
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

.page-header h2 {
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

.alert {
  border-radius: 14px;
  padding: 14px 18px;
  margin-top: 6px;
  font-weight: 700;
}

.alert.error {
  background: rgba(218, 91, 91, 0.16);
  color: #f2a2a2;
  border: 1px solid rgba(218, 91, 91, 0.28);
}

.alert.success {
  background: rgba(76, 175, 80, 0.16);
  color: #8cd08c;
  border: 1px solid rgba(76, 175, 80, 0.28);
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 6px;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
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

.primary-btn:hover {
  transform: translateY(-1px);
  background: #bd4b4b;
}

.secondary-btn:hover {
  background: #3a3a3a;
}
</style>
