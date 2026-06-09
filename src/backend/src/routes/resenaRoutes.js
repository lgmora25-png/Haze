import express from 'express'
// Importación exacta apuntando a tu archivo con mayúscula inicial
import { resenaController } from '../controllers/Resenacontroller.js'

const router = express.Router()

// Rutas mapeadas para conectar con info-game.vue
router.get('/juego/:juegoId', resenaController.obtenerResenas)
router.post('/', resenaController.crearResena)
router.delete('/:id', resenaController.eliminarResena)

export default router