import express from 'express'
import { pagoController } from '../controllers/Pagocontroller.js'

const router = express.Router()

// Buscar pagos por filtros (nombre, documento, telefono)
router.post('/consultar', pagoController.consultar)

// Procesar pago (confirmar o cancelar)
router.post('/process', pagoController.procesarPago)

// Obtener pago por id
router.get('/:id', pagoController.obtenerPorId)

export default router
