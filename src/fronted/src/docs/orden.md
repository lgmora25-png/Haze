Markdown
## 🏗️ Estructura de Carpetas (Frontend - HAZE)

El frontend de **HAZE** está construido con Vue.js, siguiendo una estructura modular que separa vistas por dominio, lógica de control maestro y recursos estáticos. Su propósito es ofrecer una interfaz reactiva, limpia y de baja densidad visual inspirada en la plataforma *itch.io*.

```text
src/fronted/
├── src/
│   ├── views/
│   │   └── juegos/
│   │       ├── search-game.vue
│   │       ├── view-game.vue
│   │       └── add-game.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── index.html
├── package.json
└── vite.config.js
📂 Desglose de Componentes y Archivos
views/juegos/
Propósito: Representan las pantallas e historias de usuario específicas con las que interactúa el cliente en el ecosistema de videojuegos.

Responsabilidad: Renderizan interfaces temáticas, capturan datos del usuario mediante formularios y emiten señales reactivas hacia el nodo superior.

search-game.vue: Despliega la grilla densa del catálogo y gestiona un motor de búsqueda reactivo filtrando títulos por texto en tiempo real.

view-game.vue: Muestra la página de perfil de un juego seleccionado, distribuyendo los datos de manera asimétrica (sinopsis y caja de conversión/precio).

add-game.vue: Formulario de publicación controlado para recolectar metadatos (título, género, precio, imagen) de nuevos lanzamientos independientes.

App.vue
Propósito: Actúa como el Orquestador Central y Controlador Maestro de la aplicación.

Responsabilidad: Define el diseño global (Navbar fija al estilo itch.io), mantiene el estado dinámico de la navegación (pantallaActual) mediante directivas condicionales v-if y gestiona el traspaso de información unidireccional (Props y Emits) entre las vistas.

main.js
Propósito: Punto de entrada y arranque de la arquitectura de Vue.

Responsabilidad: Inicializa la instancia global de la aplicación (createApp), enlaza los estilos de diseño base y monta el componente raíz App.vue sobre el DOM.

style.css
Propósito: Centraliza las variables de diseño y estilos globales.

Responsabilidad: Configura la paleta cromática plana de HAZE (fondos oscuros #1c1c1c, grises industriales y contrastes en rojo #da5b5b) junto con las tipografías del sistema para asegurar uniformidad visual.

index.html
Propósito: Documento HTML estructurado base.

Responsabilidad: Sirve de contenedor principal mediante el nodo <div id="app"></div> donde Vite inyecta dinámicamente todo el árbol de componentes de Vue.
