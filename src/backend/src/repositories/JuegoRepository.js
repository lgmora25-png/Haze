import { supabase } from '../config/conexion.js';
import { Juego } from '../models/Juego.js';

export class JuegoRepository {
  // 1. Obtener todos los juegos (para el catálogo)
  async obtenerTodos() {
    const { data, error } = await supabase
      .from('juegos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al obtener juegos: ${error.message}`);

    // Convertimos los registros crudos en objetos del Modelo Juego (Mapeo POO)
    return data.map(juegoData => new Juego(juegoData));
  }

  // 2. Insertar un juego nuevo (para el formulario add-game)
  async crear(juegoInstancia) {
    // Control de calidad antes de tocar la base de datos
    if (!juegoInstancia.esValido()) {
      throw new Error("Datos inválidos: El título y la imagen son obligatorios.");
    }

    const { data, error } = await supabase
      .from('juegos')
      .insert([
        {
          titulo: juegoInstancia.titulo,
          precio: juegoInstancia.precio,
          generos: juegoInstancia.generos,
          descripcion: juegoInstancia.descripcion,
          imagen_url: juegoInstancia.imagen_url
        }
      ])
      .select();

    if (error) throw new Error(`Error al insertar juego: ${error.message}`);
    
    return new Juego(data[0]);
  }
}