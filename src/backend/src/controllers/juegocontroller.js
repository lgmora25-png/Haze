// src/backend/controllers/juegocontroller.js

import { Juego } from '../models/Juego.js';
import { JuegoRepository } from '../repositories/JuegoRepository.js';

const juegoRepository = new JuegoRepository();

export class JuegoController {
  
  // === HU1: BUSCAR/LISTAR JUEGOS ===
  static async obtenerTodos(req, res) {
    try {
      const juegos = await juegoRepository.obtenerTodos();
      return res.status(200).json(juegos);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los juegos desde el servidor." });
    }
  }

  // === HU2: SUBIR/CREAR JUEGO ===
  static async crear(req, res) {
    try {
      // Creamos la instancia del modelo Juego con los datos que llegan del frontend
      const nuevoJuego = new Juego(req.body);

      // Validación de las reglas de negocio del modelo
      if (!nuevoJuego.esValido()) {
        return res.status(400).json({ error: "Datos del juego inválidos o incompletos." });
      }

      // Guardamos en la base de datos de Supabase a través del repositorio
      const juegoCreado = await juegoRepository.crear(nuevoJuego);

      return res.status(201).json({
        mensaje: "El juego se registró con éxito en el sistema",
        juego: juegoCreado
      });

    } catch (error) {
      console.error('Error al crear juego:', error);
      if (String(error.message).toLowerCase().includes('duplic')) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno en el servidor al guardar el juego." });
    }
  }

  // === HU5: CONSULTAR DETALLE DE JUEGO POR ID ===
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const juego = await juegoRepository.obtenerPorId(id);

      if (!juego) {
        return res.status(404).json({ error: "Juego no encontrado" });
      }

      return res.status(200).json(juego);
    } catch (error) {
      return res.status(500).json({ error: "Error en el servidor al buscar el juego." });
    }
  }
}