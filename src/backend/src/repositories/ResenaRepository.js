import { supabase } from '../config/Conexion.js'
import { Resena } from '../models/Resena.js'

export class ResenaRepository {
  async obtenerPorJuego(juegoId) {
    const { data, error } = await supabase
      .from('resenas')
      .select('*')
      .eq('juego_id', juegoId)
      .order('creado_at', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener reseñas: ${error.message}`)
    }

    return data.map((resenaData) => new Resena(resenaData))
  }

  async guardar(datosResena) {
    const { data, error } = await supabase
      .from('resenas')
      .insert([datosResena])
      .select()

    if (error) {
      throw new Error(`Error al guardar la reseña: ${error.message}`)
    }

    return new Resena(data[0])
  }

  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('resenas')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Error al obtener la reseña: ${error.message}`)
    }

    return data ? new Resena(data) : null
  }

  async eliminar(id) {
    const { error } = await supabase
      .from('resenas')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Error al eliminar la reseña: ${error.message}`)
    }

    return true
  }
}
