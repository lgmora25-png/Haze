import { JuegoRepository } from '../repositories/JuegoRepository.js';
import { Juego } from '../models/Juego.js';

// Instanciamos el repositorio para usar sus métodos de base de datos
const juegoRepository = new JuegoRepository();

export class JuegoController {
  
  // 1. CONTROLADOR PARA LISTAR LOS JUEGOS
  static async obtenerTodos(req, res) {
    try {
      const juegos = await juegoRepository.obtenerTodos();
      // Respondemos al frontend con un código 200 (OK) y la lista de objetos
      return res.status(200).json(juegos);
    } catch (error) {
      console.error("❌ Error en JuegoController.obtenerTodos:", error.message);
      return res.status(500).json({ error: "Error interno del servidor al obtener los juegos." });
    }
  }

  // 2. CONTROLADOR PARA CREAR UN JUEGO NUEVO
  static async crear(req, res) {
    try {
      // Extraemos los datos que el usuario escribió en el formulario de Vue
      const { titulo, precio, generos, descripcion, imagen_url } = req.body;

      // Creamos una nueva instancia del modelo Juego (POO)
      const nuevoJuego = new Juego({ titulo, precio, generos, descripcion, imagen_url });

      // Le pedimos al repositorio que guarde este objeto en Supabase
      const juegoGuardado = await juegoRepository.crear(nuevoJuego);

      // Respondemos con un código 201 (Creado con éxito) y el objeto guardado
      return res.status(201).json(juegoGuardado);
    } catch (error) {
      console.error("❌ Error en JuegoController.crear:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }
}