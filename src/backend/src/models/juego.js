// Modelo: Clase Juego (POO purista)
export class Juego {
  constructor({ id = null, titulo, precio = 0, generos = null, descripcion = null, imagen_url }) {
    this.id = id;                     // Identificador único de la base de datos
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
    return !!(this.titulo && this.imagen_url);
  }
}