// src/models/Usuario.js

export class Usuario {
  constructor({ id = null, nombre_usuario, correo, contrasena }) {
    this.id = id;
    this.nombre_usuario = nombre_usuario;
    this.correo = correo;
    this.contrasena = contrasena;
  }

  // === HISTORIA DE USUARIO 3 (Registrar Perfil) ===
  // Validación de formato: Verifica que no haya campos vacíos y el correo sea válido
  esValido() {
    if (!this.nombre_usuario || !this.correo || !this.contrasena) {
      return false;
    }
    // Expresión regular básica para validar el formato de correo con "@"
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(this.correo)) {
      return false;
    }
    return true;
  }
}