<template>
  <div class="admin-page">
    <div class="admin-card">
      <h1>Panel Administrativo</h1>
      <p>Bienvenido, dueño. Aquí puedes gestionar tu catálogo y añadir juegos.</p>
      <div class="admin-actions">
        <router-link to="/subir" class="admin-action-btn">
          ➕ Añadir Juego
        </router-link>
      </div>
      <div class="admin-note">
        <p>Esta sección es solo visible para usuarios con rol <strong>dueno</strong>.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente estático tipo wireframe para el panel de administración.
</script>

<style scoped>
.admin-page {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #0f0f0f;
}

.admin-card {
  width: 100%;
  max-width: 700px;
  background: #181818;
  border: 1px solid #2f2f2f;
  border-radius: 18px;
  padding: 36px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.35);
  color: #f1f1f1;
}

.admin-card h1 {
  margin: 0 0 14px;
  font-size: 2rem;
  color: #fff;
}

.admin-card p {
  color: #bdbdbd;
  line-height: 1.7;
}

.admin-actions {
  margin-top: 28px;
}

.admin-action-btn {
  display: inline-block;
  background: #da5b5b;
  color: white;
  padding: 14px 24px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.admin-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(218, 91, 91, 0.35);
}

.admin-note {
  margin-top: 22px;
  padding: 18px;
  background: #111;
  border: 1px solid #2e2e2e;
  border-radius: 14px;
}

.admin-note strong {
  color: #ffdd57;
}
</style>
