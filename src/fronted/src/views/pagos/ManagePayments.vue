<template>
  <div class="page-card payments-manage">
    <div class="page-header">
      <h2>Gestión de Pagos</h2>
      <p>Seleccione la acción deseada para consultar o procesar pagos móviles.</p>
    </div>

    <div class="actions">
      <router-link to="/pagos/process" class="btn action-btn">Procesar Pago</router-link>
      <router-link to="/pagos/consult" class="btn action-btn">Consultar Pago</router-link>
    </div>
  </div>
</template>

<script setup>
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
  margin: 0;
  color: #b8b3c1;
  line-height: 1.65;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 28px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 180px;
  padding: 14px 18px;
  background: #da5b5b;
  color: #fff;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  border: 1px solid transparent;
  transition: transform 0.2s ease, background 0.2s ease;
}

.btn:hover {
  background: #bd4b4b;
  transform: translateY(-1px);
}

.action-btn {
  flex: 1 1 220px;
}
</style>
