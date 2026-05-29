<!-- login.vue -->
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

const iniciarSesion = async () => {
  // Limpiamos mensajes previos
  mensajeError.value = '';
  mensajeExito.value = '';

  const { correo, contrasena } = formulario.value;

  // 1. Validación de campos vacíos
  if (!correo || !contrasena) {
    mensajeError.value = "Por favor, completa todos los campos.";
    return;
  }

  try {
    // 2. Petición al backend
    const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario.value)
    });

    const data = await res.json();

    // 3. Manejo de errores que responde el backend
    if (!res.ok) {
      // Mostrará "El usuario no existe" o "Contraseña incorrecta"
      mensajeError.value = data.error || "Error al iniciar sesión"; 
    } else {
      // 4. Éxito
      mensajeExito.value = "¡Bienvenido de vuelta!";
      
      // Guardamos la sesión en el navegador
      localStorage.setItem('usuario_id', data.usuarioId);
      
      // Redirigimos al inicio después de un momentito para que vea el mensaje
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  } catch (error) {
    mensajeError.value = "Error al conectar con el servidor.";
  }
};
</script>

<style scoped>
/* Pegar aquí todos los mismos estilos que ya tenías en tu login / register (auth-page, auth-box, alert, etc.) */
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 70vh; }
.auth-box { background: #1a1a1a; padding: 40px; border-radius: 12px; width: 100%; max-width: 550px; min-height: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); text-align: center; border: 1px solid #333; display: flex; flex-direction: column; justify-content: center; }
.auth-box h2 { color: #fff; margin-bottom: 20px; }
.form-group { margin-bottom: 15px; text-align: left; }
label { display: block; color: #aaa; margin-bottom: 5px; font-size: 0.9rem; font-weight: bold; }
input { width: 100%; padding: 10px; background: #2b2b2b; border: 1px solid #444; border-radius: 6px; color: white; box-sizing: border-box; }
input:focus { border-color: #da5b5b; outline: none; }
.btn-submit { width: 100%; padding: 12px; margin-top: 15px; background: #da5b5b; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer; transition: background 0.3s; }
.btn-submit:hover { background: #b04848; }

/* Mensajes de alerta */
.alert { padding: 10px; border-radius: 6px; margin-bottom: 15px; font-weight: bold; }
.alert.error { background: rgba(218, 91, 91, 0.2); color: #ff6b6b; border: 1px solid #da5b5b; }
.alert.success { background: rgba(76, 175, 80, 0.2); color: #4caf50; border: 1px solid #4caf50; }

.auth-link { text-align: center; margin-top: 25px; color: #a0a0a0; font-size: 14px; }
.auth-link a { color: #da5b5b; text-decoration: none; font-weight: bold; margin-left: 5px; transition: color 0.3s; }
.auth-link a:hover { text-decoration: underline; color: #fff; }
</style>