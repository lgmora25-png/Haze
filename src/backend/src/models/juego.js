// Modelo: Clase Juego (POO purista)
export class Juego {
  constructor({ id = null, juego_id = null, titulo, precio = 0, generos = null, descripcion = null, imagen_url }) {
    const resolvedId = id ?? juego_id;
    this.id = resolvedId;             // Identificador único de la base de datos
    this.juego_id = resolvedId;       // Alias usado en algunas consultas/props del frontend
    this.titulo = titulo;             // String: Nombre del videojuego
    this.precio = Number(precio);     // Number: Aseguramos que sea un número para operaciones matemáticas
    this.generos = generos;           // String: Categorías o géneros del juego
    this.descripcion = descripcion;   // String: Resumen o sinopsis de la tienda
    this.imagen_url = imagen_url;     // String: Enlace de la portada (.png, .svg, etc.)
  }

  // Regla de Negocio (POO): Formatear el precio para la Vista
  obtenerPrecioFormateado() {
    return this.precio === 0 ? 'Gratis' : `$${this.precio.toFixed(2)}`;
  }

  // Validación de calidad: Verificar si el objeto tiene los datos mínimos obligatorios
  esValido() {
    return !!(this.titulo && this.imagen_url && this.generos); // El título, la imagen y los géneros son obligatorios para considerar el juego como válido
  }
}