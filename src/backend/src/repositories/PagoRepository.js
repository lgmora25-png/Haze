import { supabase } from '../config/conexion.js'
import { Pago } from '../models/Pago.js'

export class PagoRepository {
  constructor() {}

  // Buscar pagos por filtros de cliente (nombre, documento, telefono)
  async buscarPorCliente({ nombre, documento, telefono }) {
    let query = supabase.from('pagos').select('*')

    if (nombre) query = query.ilike('cliente_nombre', `%${nombre}%`)
    if (documento) query = query.eq('cliente_documento', documento)
    if (telefono) query = query.eq('telefono', telefono)

    const { data, error } = await query.order('creado_at', { ascending: false })
    if (error) {
      const message = String(error.message || '').toLowerCase()
      if (message.includes('permission denied')) {
        throw new Error('Error al buscar pagos: permiso denegado. Configura SUPABASE_SERVICE_ROLE_KEY en el backend o habilita acceso a la tabla pagos.');
      }
      throw new Error(`Error al buscar pagos: ${error.message}`)
    }

    return (data || []).map(d => new Pago(d))
  }

  async obtenerPorId(id) {
    const candidateKeys = ['pago_id', 'id']

    for (const key of candidateKeys) {
      const { data, error } = await supabase.from('pagos').select('*').eq(key, id).single()
      if (error) {
        const msg = String(error.message || '').toLowerCase()
        if (msg.includes('column') || msg.includes('unknown') || error.code === 'PGRST116') continue
        throw new Error(`Error al obtener pago por id: ${error.message}`)
      }

      return new Pago(data)
    }

    return null
  }

  async procesarPago(id, datosActualizados = {}) {
    // Validaciones ligeras aquí
    const pago = await this.obtenerPorId(id)
    if (!pago) throw new Error('Pago no encontrado')

    // Actualizamos estado y cualquier dato adicional
    const payload = {
      ...datosActualizados,
      estado: datosActualizados.estado ?? 'procesado'
    }

    const { data, error } = await supabase.from('pagos').update(payload).eq('pago_id', pago.pago_id).select()
    if (error) throw new Error(`Error al procesar pago: ${error.message}`)

    return new Pago(data[0])
  }
}
