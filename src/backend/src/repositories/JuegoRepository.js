import { supabase } from '../config/Conexion.js';
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
    // Normalizar valores para validaciones
    const tituloNormalizado = String(juegoInstancia.titulo).trim();
    const imagenUrl = juegoInstancia.imagen_url;

    // 1) Validar que no exista un juego con el mismo título (case-insensitive)
    try {
      const { data: tituloExistente, error: tituloError } = await supabase
        .from('juegos')
        .select('id')
        .ilike('titulo', tituloNormalizado)
        .limit(1);

      if (tituloError) throw tituloError;
      if (tituloExistente && tituloExistente.length > 0) {
        throw new Error('Duplicado: Ya existe un juego con ese título.');
      }
    } catch (err) {
      if (String(err.message || err).toLowerCase().includes('duplic')) throw err;
      // si hubo un error inesperado al validar, lo convertimos en error genérico
      throw new Error(`Error al validar título existente: ${err.message || err}`);
    }

    // 2) Validar que la misma imagen/base64 no haya sido usada
    // Esta comprobación se elimina porque, con imágenes Base64 grandes,
    // Supabase puede generar URIs extensas y provocar errores 414.
    // El frontend ya hace una verificación general de duplicados por título e imagen,
    // y el backend continúa validando el título para evitar duplicados críticos.

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
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('juegos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error al obtener juego por ID: ${error.message}`);
    }

    return data ? new Juego(data) : null;
  }
}