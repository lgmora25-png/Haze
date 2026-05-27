Diagrama simplificado

App

pantallaActual
juegoSeleccionado
irAPantalla()
App ──> SearchGame
App ──> AddGame
App ──> ViewGame

Search-game.vue

juegos
textoBusqueda
filtroAplicado
juegosFiltrados
buscar()

View-game.vue

juegos
textoBusqueda
filtroAplicado
juegosFiltrados
buscar()

Add-game.vue

titulo
categoria
precio
imagen
disponible
guardarJuego()

Juego

id, titulo, categoria, precio, imagen, disponible