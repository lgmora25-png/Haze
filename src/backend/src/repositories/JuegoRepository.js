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
    // Nota: las cadenas Base64 de imagen pueden ser muy grandes y causar un GET con URI demasiado largo.
    const imagenUrlSegment = String(imagenUrl || '');
    if (imagenUrlSegment.length <= 1500) {
      try {
        const { data: imagenExistente, error: imagenError } = await supabase
          .from('juegos')
          .select('id')
          .eq('imagen_url', imagenUrl)
          .limit(1);

        if (imagenError) throw imagenError;
        if (imagenExistente && imagenExistente.length > 0) {
          throw new Error('Duplicado: La imagen ya está en uso por otro juego.');
        }
      } catch (err) {
        if (String(err.message || err).toLowerCase().includes('duplic')) throw err;
        throw new Error(`Error al validar imagen existente: ${err.message || err}`);
      }
    } else {
      console.warn('Se omite la validación de imagen duplicada porque la URL/Base64 es muy larga.');
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
  async obtenerPorId(id) {
    const candidateKeys = ['id', 'juego_id'];

    for (const key of candidateKeys) {
      const { data, error } = await supabase
        .from('juegos')
        .select('*')
        .eq(key, id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          continue; // Intentar siguiente nombre de columna
        }

        const message = String(error.message || '').toLowerCase();
        if (message.includes('column') || message.includes('unknown')) {
          continue; // Puede que este nombre de columna no exista en la tabla
        }

        throw new Error(`Error al obtener juego por ID: ${error.message}`);
      }

      return new Juego(data);
    }

    return null;
  }
}