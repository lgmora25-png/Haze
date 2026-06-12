// src/controllers/UsuarioController.js

import { Usuario } from '../models/Usuario.js';
import { UsuarioRepositorio } from '../repositories/UsuarioRepositorio.js';

const usuarioRepository = new UsuarioRepositorio();

export class UsuarioControlador {
  
  // === HU3: REGISTRAR PERFIL ===
  static async registrar(req, res) {
    try {
      const nuevoUsuario = new Usuario(req.body);

      if (!nuevoUsuario.esValido()) {
        return res.status(400).json({ error: "datos invalidos" });
      }

      const usuarioCreado = await usuarioRepository.crear(nuevoUsuario);

      return res.status(201).json({
        mensaje: "El usuario se registro en del sistema",
        usuario: usuarioCreado,
        usuarioId: usuarioCreado.id
      });

    } catch (error) {
      if (error.message === "El usuario ya existe") {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error en el servidor." });
    }
  }

  // === LÓGICA DE LOGIN ===
  static async login(req, res) {
    try {
      const { correo, contrasena } = req.body;

      // Validación de seguridad por si envían campos vacíos
      if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
      }

      const usuario = await usuarioRepository.loginUsuario(correo, contrasena);

      // Si la base de datos ya tiene rol, lo usamos; si no, aplicamos un fallback por correo para pruebas
      let rolAsignado = usuario.rol || 'usuario';
      if (!usuario.rol && ['admin@ucab.edu.ve', 'dueno@haze.com'].includes(usuario.correo)) {
        rolAsignado = 'dueno';
      }
      
      // Si pasa, mandamos el ID, el ROL y el nombre de usuario para guardarlo en el frontend
      return res.status(200).json({ 
        mensaje: 'Login exitoso', 
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre_usuario,
        rol: rolAsignado
      });

    } catch (error) {
      // Capturamos si es "El usuario no existe" o "Contraseña incorrecta"
      return res.status(401).json({ error: error.message });
    }
  }

  // === HU4: CONSULTAR PERFIL ===
  static async consultarPerfil(req, res) {
    try {
      const { id } = req.params; 

      const perfil = await usuarioRepository.obtenerPorId(id);

      if (!perfil) {
        return res.status(404).json({ error: "Perfil no encontrado" });
      }

      let rolAsignado = perfil.rol || 'usuario';
      if (!perfil.rol && ['admin@ucab.edu.ve', 'dueno@haze.com'].includes(perfil.correo)) {
        rolAsignado = 'dueno';
      }

      return res.status(200).json({
        ...perfil,
        rol: rolAsignado
      });

    } catch (error) {
      return res.status(500).json({ error: "Error al consultar el perfil." });
    }
  }

  // === VERIFICAR CONTRASEÑA ===
  static async verificarContrasena(req, res) {
    try {
      const { usuarioId, contrasena } = req.body;

      if (!usuarioId || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos para verificar la contraseña.' });
      }

      const esValida = await usuarioRepository.verificarContrasena(usuarioId, contrasena);

      if (!esValida) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      return res.status(200).json({ mensaje: 'Contraseña válida', valido: true });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Error al verificar la contraseña.' });
    }
  }
}