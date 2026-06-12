import express from 'express'
// Importación exacta apuntando a tu archivo con mayúscula inicial
import { ResenaControlador } from '../controllers/ResenaControlador.js'

const router = express.Router()

// Rutas mapeadas para conectar con info-game.vue
router.get('/juego/:juegoId', ResenaControlador.obtenerResenas)
router.post('/', ResenaControlador.crearResena)
router.delete('/:id', ResenaControlador.eliminarResena)

export default router