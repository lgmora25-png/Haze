import { ResenaRepository } from '../repositories/ResenaRepository.js'
import { supabase } from '../config/conexion.js'

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
          mensaje: 'Debe dar rating para publicar una reseña'
        });
      }

      // === VALIDACIONES ADICIONALES SEGUN REGLAS DE NEGOCIO ===
      // 1) Solo miembros UCAB (verificamos por correo asociado al usuario)
      // 2) Debe tener y haber jugado el juego (intentamos consultar tablas comunes; si no existe la tabla
      //    tratamos como no poseído)
      // 3) Solo una reseña por usuario por juego

      // Recuperar usuario por nombre de usuario
      const { data: usuarios, error: userErr } = await supabase
        .from('usuarios')
        .select('*')
        .or(`nombre_usuario.eq.${usuario_nombre},correo.eq.${usuario_nombre}`)
        .limit(1)

      if (userErr || !usuarios || usuarios.length === 0) {
        // No encontramos el usuario -> no puede publicar
        return res.status(403).json({ mensaje: 'Debe tener y haber jugado el juego para publicar una reseña' })
      }

      const usuario = usuarios[0]

      // Regla 1: Exclusivo para miembros UCAB (por correo)
      const correo = (usuario.correo || '').toLowerCase()
      if (!correo.endsWith('@ucab.edu.ve')) {
        return res.status(403).json({ mensaje: 'Funcionalidad exclusiva para miembros de la comunidad UCAB.' })
      }

      // Regla 2: Verificar si el usuario tiene/ha jugado el juego
      const usuarioTieneElJuego = async () => {
        // Intentamos consultar varias tablas que podrían representar compras/posesión
        const tablas = ['compras', 'usuario_juegos', 'juegos_usuario', 'pagos']
        for (const tabla of tablas) {
          try {
            const q = supabase.from(tabla).select('*')
              .or(`cliente_nombre.eq.${usuario_nombre},usuario_nombre.eq.${usuario_nombre},cliente_documento.eq.${usuario.documento || ''}`)
              .eq('juego_id', juego_id)
              .limit(1)

            const { data: d, error: e } = await q
            if (!e && d && d.length > 0) return true
          } catch (err) {
            // ignoramos errores de tabla no existente y seguimos probando
            continue
          }
        }
        return false
      }

      const tiene = await usuarioTieneElJuego()
      if (!tiene) {
        return res.status(403).json({ mensaje: 'Debe tener y haber jugado el juego para publicar una reseña' })
      }

      // Regla 3: Unicidad de reseña por juego/usuario
      const { data: duplicado, error: dupErr } = await supabase
        .from('resenas')
        .select('*')
        .eq('juego_id', juego_id)
        .eq('usuario_nombre', usuario_nombre)
        .limit(1)

      if (!dupErr && duplicado && duplicado.length > 0) {
        return res.status(400).json({ mensaje: 'Solo puede tener una reseña publicada por juego' })
      }

      // Instanciar y guardar la reseña a través del repositorio
      const nuevaResena = await resenaRepository.guardar({
        juego_id,
        usuario_nombre,
        rating,
        comentario
      });

      // Criterio de Aceptación 2: Éxito en la publicación
      res.status(201).json({ 
        mensaje: 'Reseña publicada', 
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
      const { usuario_nombre } = req.body;

      if (!usuario_nombre) {
        return res.status(401).json({ error: 'Debe iniciar sesión para eliminar reseñas.' });
      }

      const resenaExistente = await resenaRepository.obtenerPorId(id);
      if (!resenaExistente) {
        return res.status(404).json({ error: 'Reseña no encontrada.' });
      }

      if (resenaExistente.usuario_nombre !== usuario_nombre) {
        return res.status(403).json({ error: 'Solo puedes eliminar tus propias reseñas.' });
      }

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