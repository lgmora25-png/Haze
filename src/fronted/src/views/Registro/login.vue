<template>
  <div class="auth-page">
    <div class="auth-box">
      <h2>Iniciar Sesión</h2>

      <div v-if="mensajeError" class="alert error">{{ mensajeError }}</div>
      <div v-if="mensajeExito" class="alert success">{{ mensajeExito }}</div>

      <form @submit.prevent="iniciarSesion" v-if="!mensajeExito">
        <div class="form-group">
          <label>Correo</label>
          <input v-model="formulario.correo" type="email" placeholder="Ej: correo@ucab.edu.ve" />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="formulario.contrasena" type="password" placeholder="Tu contraseña" />
        </div>

        <button type="submit" class="btn-submit">Confirmar</button>
      </form>

      <p class="auth-link" v-if="!mensajeExito">
        ¿No tienes una cuenta? 
        <router-link to="/registro">Crear una cuenta</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Variables reactivas
const formulario = ref({
  correo: '',
  contrasena: ''
});

const mensajeError = ref('');
const mensajeExito = ref('');

// Función para conectar con el backend
const iniciarSesion = async () => {
  try {
    mensajeError.value = '';
    mensajeExito.value = '';

    const response = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formulario.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // 💾 GUARDADO EN LOCALSTORAGE
    localStorage.setItem('usuarioId', data.usuarioId);
    localStorage.setItem('rol', data.rol); // 👈 ¡Línea agregada! Guardará 'dueno' o 'usuario'

    mensajeExito.value = data.mensaje || '¡Bienvenido de nuevo!';
    
    // Redirección al catálogo después de 1.5 segundos
    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (error) {
    mensajeError.value = error.message;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #121212;
  padding: 20px;
}
.auth-box { 
  background: #1a1a1a; 
  padding: 40px; 
  border-radius: 12px; 
  width: 100%; 
  max-width: 550px; 
  min-height: 500px; 
  box-shadow: 0 5px 15px rgba(0,0,0,0.5); 
  text-align: center; 
  border: 1px solid #333; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
}
.auth-box h2 { color: #fff; margin-bottom: 20px; }
.form-group { margin-bottom: 15px; text-align: left; }
label { display: block; color: #aaa; margin-bottom: 5px; font-size: 0.9rem; font-weight: bold; }
input { width: 100%; padding: 10px; background: #2b2b2b; border: 1px solid #444; border-radius: 6px; color: white; box-sizing: border-box; }
input:focus { border-color: #da5b5b; outline: none; }
.btn-submit { width: 100%; padding: 12px; margin-top: 15px; background: #da5b5b; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer; transition: background 0.3s; }
.btn-submit:hover { background: #b04848; }

.auth-link { color: #aaa; margin-top: 20px; font-size: 0.9rem; }
.auth-link a { color: #da5b5b; text-decoration: none; font-weight: bold; }
.auth-link a:hover { text-decoration: underline; }

.alert { padding: 12px; border-radius: 6px; margin-bottom: 20px; font-weight: bold; font-size: 0.95rem; text-align: center; }
.alert.error { background: rgba(218, 91, 91, 0.15); color: #da5b5b; border: 1px solid rgba(218, 91, 91, 0.3); }
.alert.success { background: rgba(76, 175, 80, 0.15); color: #4caf50; border: 1px solid rgba(76, 175, 80, 0.3); }
</style>