// src/controllers/usuarioController.js

import { Usuario } from '../models/Usuario.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';

const usuarioRepository = new UsuarioRepository();

export class UsuarioController {
  
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
      
      // Si pasa, mandamos el ID para guardarlo en el localStorage del frontend
      return res.status(200).json({ 
        mensaje: 'Login exitoso', 
        usuarioId: usuario.id 
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

      return res.status(200).json(perfil);

    } catch (error) {
      return res.status(500).json({ error: "Error al consultar el perfil." });
    }
  }
}