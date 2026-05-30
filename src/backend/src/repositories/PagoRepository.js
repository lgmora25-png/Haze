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
    if (error) throw new Error(`Error al buscar pagos: ${error.message}`)

    return (data || []).map(d => new Pago(d))
  }

  async obtenerPorId(id) {
    const candidateKeys = ['pago_ref', 'pago_id', 'id']

    for (const key of candidateKeys) {
      console.log(`PagoRepository: buscando pago por ${key} = ${id}`)
      const { data, error } = await supabase.from('pagos').select('*').eq(key, id).single()
      if (error) {
        const msg = String(error.message || '').toLowerCase()
        console.log(`PagoRepository: error buscando por ${key}:`, error.message)
        // Ignorar errores que provengan de tipo de dato (uuid invalid sintax) o columna desconocida
        if (msg.includes('column') || msg.includes('unknown') || msg.includes('invalid input syntax') || error.code === 'PGRST116') continue
        throw new Error(`Error al obtener pago por id: ${error.message}`)
      }

      console.log(`PagoRepository: encontrado por ${key}:`, data ? 'sí' : 'no')
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

  async buscarPorRef(ref) {
    try {
      const { data, error } = await supabase.from('pagos').select('*').ilike('pago_ref', ref).limit(1).single()
      if (error) {
        const msg = String(error.message || '').toLowerCase()
        if (msg.includes('column') || msg.includes('unknown') || msg.includes('invalid input syntax') || error.code === 'PGRST116') return null
        throw new Error(`Error al buscar pago por ref: ${error.message}`)
      }
      return data ? new Pago(data) : null
    } catch (err) {
      throw err
    }
  }
}
