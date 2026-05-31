import { PagoRepository } from '../repositories/PagoRepository.js'

const pagoRepository = new PagoRepository()

export const pagoController = {
  // POST /api/pagos/consultar  -> { nombre, documento, telefono }
  consultar: async (req, res) => {
    try {
      const { nombre, documento, telefono } = req.body
      const resultados = await pagoRepository.buscarPorCliente({ nombre, documento, telefono })

      if (!resultados || resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron pagos para los datos ingresados.' })
      }

      res.json(resultados)
    } catch (error) {
      console.error('Error en pagoController.consultar:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // GET /api/pagos/:id
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params
      const pago = await pagoRepository.obtenerPorId(id)
      if (!pago) return res.status(404).json({ mensaje: 'Pago no encontrado' })
      res.json(pago)
    } catch (error) {
      console.error('Error en pagoController.obtenerPorId:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // POST /api/pagos/process { id, cliente_nombre, cliente_documento, telefono, confirmar }
  procesarPago: async (req, res) => {
    try {
      const { id, cliente_nombre, cliente_documento, telefono, confirmar } = req.body

      if (!id) return res.status(400).json({ mensaje: 'Se requiere el id del pago.' })

      // Si el empleado cancela en cualquier momento
      if (!confirmar) {
        return res.status(200).json({ mensaje: 'Proceso cancelado por el empleado.' })
      }

      // Validación: el sistema verifica que los datos coincidan con el registro
      const pago = await pagoRepository.obtenerPorId(id)
      if (!pago) return res.status(404).json({ mensaje: 'Pago no encontrado.' })

      // Comprobaciones específicas
      if (String(pago.cliente_documento) !== String(cliente_documento)) {
        return res.status(400).json({ mensaje: 'Documento del cliente no coincide.' })
      }

      // Si todo coincide, procesamos el pago
      const pagoProcesado = await pagoRepository.procesarPago(id, { cliente_nombre, telefono, estado: 'procesado' })

      res.json({ mensaje: 'Pago procesado con éxito.', data: pagoProcesado })
    } catch (error) {
      console.error('Error en pagoController.procesarPago:', error)
      res.status(500).json({ error: error.message })
    }
  }
}
