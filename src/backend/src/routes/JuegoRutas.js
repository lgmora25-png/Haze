import { Router } from 'express';
import { JuegoControlador } from '../controllers/JuegoControlador.js';

const router = Router();


router.get('/', JuegoControlador.obtenerTodos);  // GET /api/juegos
router.post('/', JuegoControlador.crear);        // POST /api/juegos

// Ahora Express podrá entender cuando alguien pida /api/juegos/1, /api/juegos/2, etc.
router.get('/:id', JuegoControlador.obtenerPorId); 

export default router;