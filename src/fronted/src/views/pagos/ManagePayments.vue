<template>
  <div class="payments-manage">
    <h2>Gestión de Pagos</h2>
    <p>Seleccione la acción deseada:</p>

    <div class="actions">
      <router-link to="/pagos/process" class="btn">Procesar Pago</router-link>
      <router-link to="/pagos/consult" class="btn">Consultar pago</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.actions { display:flex; gap:12px; margin-top:12px }
.btn { padding:10px 14px; background:#da5b5b; color:white; border-radius:8px; text-decoration:none }
</style>
