import express from 'express'
import { PagoControlador } from '../controllers/PagoControlador.js'

const router = express.Router()

// Buscar pagos por filtros (nombre, documento, telefono)
router.post('/consultar', PagoControlador.consultar)

// Procesar pago (confirmar o cancelar)
router.post('/process', PagoControlador.procesarPago)

// Obtener pago por id
router.get('/:id', PagoControlador.obtenerPorId)

export default router
