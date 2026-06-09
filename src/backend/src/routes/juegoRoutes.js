import { Router } from 'express';
import { JuegoController } from '../controllers/Juegocontroller.js';

const router = Router();


router.get('/', JuegoController.obtenerTodos);  // GET /api/juegos
router.post('/', JuegoController.crear);        // POST /api/juegos

// Ahora Express podrá entender cuando alguien pida /api/juegos/1, /api/juegos/2, etc.
router.get('/:id', JuegoController.obtenerPorId); 

export default router;