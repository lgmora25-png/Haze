// src/routes/usuarioRoutes.js

import { Router } from 'express';
import { UsuarioControlador } from '../controllers/UsuarioControlador.js'; // Asegúrate de que el nombre del archivo coincida exactamente

const router = Router();

// Endpoint para HU3 (Registrar)
router.post('/registro', UsuarioControlador.registrar);

// Endpoint para el Login
router.post('/login', UsuarioControlador.login);

// Endpoint para verificación de contraseña
router.post('/verificar-contrasena', UsuarioControlador.verificarContrasena);

// Endpoint para HU4 (Consultar)
router.get('/perfil/:id', UsuarioControlador.consultarPerfil);

export default router;