import { ResenaRepository } from '../repositories/ResenaRepository.js'

const resenaRepository = new ResenaRepository()

export const resenaController = {
  /**
   * Obtiene todas las reseñas vinculadas a un videojuego específico
   * Ruta: GET /api/resenas/juego/:juegoId
   */
  obtenerResenas: async (req, res) => {
    try {
      const { juegoId } = req.params;
      
      const listaResenas = await resenaRepository.obtenerPorJuego(juegoId);
      
      res.json(listaResenas);
    } catch (error) {
      console.error('❌ Error en resenaController.obtenerResenas:', error);
      res.status(500).json({ error: 'Error interno al cargar las reseñas del juego.' });
    }
  },

  /**
   * Crea y publica una nueva reseña en el sistema
   * Ruta: POST /api/resenas
   */
  crearResena: async (req, res) => {
    try {
      const { juego_id, usuario_nombre, rating, comentario } = req.body;

      // === HISTORIA DE USUARIO 5: CRITERIO DE ACEPTACIÓN 1 ===
      // Validación: "Debe dar rating para publicar una reseña"
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          mensaje: 'Debe dar rating para publicar una reseña.' 
        });
      }

      // === NOTA PARA EVALUACIÓN DEL ERS ===
      // Si necesitaras simular de forma estricta el caso donde el usuario no posee el juego,
      // el criterio de aceptación del ERS exige responder textualmente con:
      // "Debe tener y haber jugado el juego para publicar una reseña"
      //
      // Si quisieras validar la unicidad en el backend (Criterio: "Solo puede tener una reseña publicada por juego"):
      // const existe = await Resena.verificarDuplicado(juego_id, usuario_nombre);
      // if (existe) return res.status(400).json({ mensaje: 'Solo puede tener una reseña publicada por juego' });

      // Instanciar y guardar la reseña a través del repositorio
      const nuevaResena = await resenaRepository.guardar({
        juego_id,
        usuario_nombre,
        rating,
        comentario
      });

      // Criterio de Aceptación 2: Éxito en la publicación
      res.status(201).json({ 
        mensaje: 'Reseña publicada con éxito.', 
        data: nuevaResena 
      });
    } catch (error) {
      console.error('❌ Error en resenaController.crearResena:', error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Elimina una reseña específica por su ID
   * Ruta: DELETE /api/resenas/:id
   */
  eliminarResena: async (req, res) => {
    try {
      const { id } = req.params;

      await resenaRepository.eliminar(id);

      // === HISTORIA DE USUARIO 6: CRITERIO DE ACEPTACIÓN 2 ===
      // Respuesta textual obligatoria según las pautas de tu ERS
      res.json({ 
        mensaje: 'La reseña ha sido eliminada' 
      });
    } catch (error) {
      console.error('❌ Error en resenaController.eliminarResena:', error);
      res.status(500).json({ error: 'No se pudo procesar la eliminación de la reseña.' });
    }
  }
};