import { Juego } from '../models/juego.js';
import { JuegoRepository } from '../repositories/JuegoRepository.js';

const juegoRepository = new JuegoRepository();

export class JuegoController {
  static async obtenerTodos(req, res) {
    try {
      const juegos = await juegoRepository.obtenerTodos();
      return res.status(200).json(juegos);
    } catch (error) {
      console.error('❌ Error en JuegoController.obtenerTodos:', error.message);
      return res.status(500).json({ error: 'Error al obtener los juegos.' });
    }
  }

  static async crear(req, res) {
    try {
      const nuevoJuego = await juegoRepository.crear(new Juego(req.body));
      return res.status(201).json(nuevoJuego);
    } catch (error) {
      console.error('❌ Error en JuegoController.crear:', error.message);
      const msg = String(error.message || '').toLowerCase();
      if (msg.includes('duplicado') || msg.includes('ya existe')) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message || 'Error al crear el juego.' });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const juego = await juegoRepository.obtenerPorId(id);

      if (!juego) {
        return res.status(404).json({ error: 'Juego no encontrado.' });
      }

      return res.status(200).json(juego);
    } catch (error) {
      console.error('❌ Error en JuegoController.obtenerPorId:', error.message);
      return res.status(500).json({ error: 'Error al buscar el juego.' });
    }
  }
}
