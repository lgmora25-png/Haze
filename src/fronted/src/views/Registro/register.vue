<!-- register.vue -->
<template>
  <div class="auth-page">
    <div class="auth-box">
      <h2>Registrar Perfil</h2>
      
      <div v-if="mensajeError" class="alert error">{{ mensajeError }}</div>
      <div v-if="mensajeExito" class="alert success">{{ mensajeExito }}</div>

      <form @submit.prevent="registrarUsuario" v-if="!mensajeExito">
        <div class="form-group">
          <label>Nombre de usuario</label>
          <input v-model="formulario.nombre_usuario" type="text" placeholder="Ej: Player1" />
        </div>

        <div class="form-group">
          <label>Correo</label>
          <input v-model="formulario.correo" type="text" placeholder="Ej: correo@ucab.edu.ve" />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="formulario.contrasena" type="password" placeholder="Tu contraseña segura" />
        </div>

        <button type="submit" class="btn-submit">Confirmar</button>
      </form>

      <p class="auth-link" v-if="!mensajeExito">
        ¿Ya tienes una cuenta? 
        <router-link to="/login">Inicia sesión</router-link>
      </p>

      <button v-if="mensajeExito" @click="irAlInicio" class="btn-submit">
        Regresar al catálogo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos reactivos del formulario
const formulario = ref({
  nombre_usuario: '',
  correo: '',
  contrasena: ''
});

const mensajeError = ref('');
const mensajeExito = ref('');

// === LÓGICA DEL BOTÓN CONFIRMAR (HU3) ===
const registrarUsuario = async () => {
  // Limpiamos mensajes previos
  mensajeError.value = '';
  mensajeExito.value = '';

  const { nombre_usuario, correo, contrasena } = formulario.value;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. Diagrama HU3: "Valida los datos" -> "No cumple el formato"
  if (!nombre_usuario || !correo || !contrasena || !correoRegex.test(correo)) {
    mensajeError.value = "datos invalidos"; // Mensaje exacto del PDF
    return;
  }

  // 2. Conexión con la Base de Datos (Backend en puerto 3000)
  try {
    const res = await fetch('http://localhost:3000/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario.value)
    });

    const data = await res.json();

    // 3. Evaluar respuesta del Backend según el Diagrama
    if (!res.ok) {
      // Diagrama HU3: "el usuario existe"
      mensajeError.value = data.error || "El usuario ya existe"; 
    } else {
      // Diagrama HU3: "El usuario no existe"
      mensajeExito.value = "El usuario se registro en del sistema"; 
      
      // Simulamos el inicio de sesión automático para que aparezca el botón del perfil
      // El backend devuelve: { usuario: usuarioCreado }
      localStorage.setItem('usuario_id', data.usuario?.id);
    }
  } catch (error) {
    mensajeError.value = "Error al conectar con el servidor.";
  }
};

const irAlInicio = () => {
  router.push('/');
};
</script>

<style scoped>
.auth-page { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 70vh; 
}

/* MODIFICADO: Aumentamos el tamaño de la tarjeta (ancho y alto) */
.auth-box { 
  background: #1a1a1a; 
  padding: 40px; 
  border-radius: 12px; 
  width: 100%; 
  max-width: 550px; /* Antes 400px */
  min-height: 500px; /* Nuevo alto mínimo */
  box-shadow: 0 5px 15px rgba(0,0,0,0.5); 
  text-align: center; 
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra todo el contenido verticalmente */
}

.auth-box h2 { color: #fff; margin-bottom: 20px; }
.form-group { margin-bottom: 15px; text-align: left; }
label { display: block; color: #aaa; margin-bottom: 5px; font-size: 0.9rem; font-weight: bold; }
input { width: 100%; padding: 10px; background: #2b2b2b; border: 1px solid #444; border-radius: 6px; color: white; box-sizing: border-box; }
input:focus { border-color: #da5b5b; outline: none; }

.btn-submit { 
  width: 100%; 
  padding: 12px; 
  margin-top: 15px; 
  background: #da5b5b; 
  border: none; 
  color: white; 
  font-weight: bold; 
  border-radius: 6px; 
  cursor: pointer; 
  transition: background 0.3s; 
}

.btn-submit:hover { background: #b04848; }

.alert { padding: 10px; border-radius: 6px; margin-bottom: 15px; font-weight: bold; }
.alert.error { background: rgba(218, 91, 91, 0.2); color: #ff6b6b; border: 1px solid #da5b5b; }
.alert.success { background: rgba(76, 175, 80, 0.2); color: #4caf50; border: 1px solid #4caf50; }

/* NUEVO: Estilos para el texto de "¿Ya tienes una cuenta?" */
.auth-link {
  text-align: center;
  margin-top: 25px;
  color: #a0a0a0;
  font-size: 14px;
}

.auth-link a {
  color: #da5b5b; /* Se ajusta al mismo color salmón/rojo de tus botones */
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
  transition: color 0.3s;
}

.auth-link a:hover {
  text-decoration: underline;
  color: #fff;
}
</style>