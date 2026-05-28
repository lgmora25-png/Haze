import { Router } from 'express';
import { JuegoController } from '../controllers/Juegocontroller.js';

const router = Router();

// Definimos las rutas y les asignamos su controlador correspondiente
router.get('/', JuegoController.obtenerTodos);  // URL: /api/juegos (GET)
router.post('/', JuegoController.crear);        // URL: /api/juegos (POST)

export default router;