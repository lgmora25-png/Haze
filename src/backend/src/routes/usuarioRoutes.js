// src/routes/usuarioRoutes.js

import { Router } from 'express';
import { UsuarioController } from '../controllers/Usuariocontroller.js'; // Asegúrate de que el nombre del archivo coincida exactamente

const router = Router();

// Endpoint para HU3 (Registrar)
router.post('/registro', UsuarioController.registrar);

// Endpoint para el Login
router.post('/login', UsuarioController.login);

// Endpoint para verificación de contraseña
router.post('/verificar-contrasena', UsuarioController.verificarContrasena);

// Endpoint para HU4 (Consultar)
router.get('/perfil/:id', UsuarioController.consultarPerfil);

export default router;