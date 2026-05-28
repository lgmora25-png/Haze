import { supabase } from '../config/conexion.js' // O donde tengas tu cliente de Supabase

export class Resena {
  constructor({ id, juego_id, usuario_nombre, rating, comentario, creado_at }) {
    this.id = id
    this.juego_id = juego_id
    this.usuario_nombre = usuario_nombre
    this.rating = rating
    this.comentario = comentario
    this.creado_at = creado_at
  }

  // Método de clase para obtener reseñas por juego
  static async obtenerPorJuego(juegoId) {
    const { data, error } = await supabase
      .from('resenas')
      .select('*')
      .eq('juego_id', juegoId)
      .order('creado_at', { ascending: false })

    if (error) throw error
    return data.map(r => new Resena(r))
  }

  // Método para guardar una nueva reseña
  static async guardar(datosResena) {
    const { data, error } = await supabase
      .from('resenas')
      .insert([datosResena])
      .select()

    if (error) throw error
    return new Resena(data[0])
  }

  // Método para eliminar una reseña
  static async eliminar(id) {
    const { error } = await supabase
      .from('resenas')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}