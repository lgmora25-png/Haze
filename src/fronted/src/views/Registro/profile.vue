<!-- profile.vue -->
<template>
  <div class="profile-page">
    
    <div v-if="mensajeError" class="alert error">
      {{ mensajeError }}
      <button @click="router.push('/')" class="btn-action mt-10">Volver al catálogo</button>
    </div>

    <div v-else-if="usuario" class="profile-card">
      <header class="profile-header">
        <div class="avatar">🎮</div>
        <h2>Mi Perfil</h2>
      </header>
      
      <div class="profile-info">
        <p><strong>Nombre de Usuario:</strong> {{ usuario.nombre_usuario }}</p>
        <p><strong>Correo:</strong> {{ usuario.correo }}</p>
        <p><strong>Contraseña:</strong> ********</p>
      </div>

      <div class="profile-actions">
        <div class="action-left">
          <button @click="cerrarSesion" class="btn-secondary">Cerrar Sesión</button>
        </div>
        
        <div class="action-right">
          <button class="btn-action">Modificar</button>
          <button class="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>

    <div v-else class="loader">Consultando datos del usuario...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const usuario = ref(null);
const mensajeError = ref('');

// === HISTORIA DE USUARIO 4: Consultar Perfil (Frontend) ===
onMounted(async () => {
  // Ahora solo leemos el ID real que guardó el Login (clave `usuarioId`)
  const sesionActivaId = localStorage.getItem('usuarioId');

  if (!sesionActivaId) {
    // Si entra directo a /perfil sin loguearse, lo mandamos al registro
    router.push('/registro');
    return;
  }

  try {
    const url = `http://localhost:3000/api/usuarios/perfil/${sesionActivaId}`;
    const res = await fetch(url);


    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      mensajeError.value = data?.error || "Perfil no encontrado";

      // Log más completo para depurar qué está pasando
      console.error('GET /perfil error:', {
        sesionActivaId,
        status: res.status,
        url: res.url,
        data,
        localStorageUsuarioId: localStorage.getItem('usuario_id')
      });

      // Si el backend responde 404 (perfil no existe), limpiamos sesión y redirigimos
      if (res.status === 404 || data?.error === 'Perfil no encontrado') {
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('rol');
        router.push('/registro');
      }
    } else {
      usuario.value = await res.json();
    }
  } catch (error) {
    mensajeError.value = "Error al comunicarse con el servidor.";
  }
});

const cerrarSesion = () => {
  localStorage.removeItem('usuarioId');
  localStorage.removeItem('rol');
  router.push('/registro');
};
</script>

<style scoped>
.profile-page { max-width: 700px; margin: 40px auto; padding: 20px; }
.profile-card { background: #1a1a1a; padding: 40px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); border: 1px solid #333;}
.profile-header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 20px; }
.avatar { font-size: 4rem; margin-bottom: 10px; }
.profile-header h2 { color: #fff; margin: 0; }

.profile-info { margin-bottom: 40px; }
.profile-info p { color: #ccc; font-size: 1.1rem; padding: 15px 10px; border-bottom: 1px solid #2a2a2a; margin: 0; display: flex; justify-content: space-between;}
.profile-info strong { color: #fff; }

/* Contenedor principal de botones */
.profile-actions { 
  display: flex; 
  justify-content: space-between; /* Separa los divs a los extremos */
  align-items: center;
}

/* Contenedor de botones derechos */
.action-right {
  display: flex;
  gap: 15px;
}

/* Estilos de botones */
.btn-action { padding: 10px 20px; background: #da5b5b; border: none; color: white; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.3s;}
.btn-danger { padding: 10px 20px; background: transparent; border: 1px solid #ff4444; color: #ff4444; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s;}
.btn-secondary { padding: 10px 20px; background: #333; border: none; color: #aaa; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.3s;}

.btn-action:hover { background: #b04848; }
.btn-danger:hover { background: #ff4444; color: white; }
.btn-secondary:hover { background: #444; color: white; }

.mt-10 { margin-top: 15px; display: block; margin-left: auto; margin-right: auto;}

.alert { padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 20px; }
.alert.error { background: rgba(218, 91, 91, 0.2); color: #ff6b6b; border: 1px solid #da5b5b; font-weight: bold; }
.loader { text-align: center; color: #888; margin-top: 50px; }
</style>