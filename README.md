# HAZE: Plataforma Digital de Videojuegos UCAB

## Introducción

**HAZE** es una plataforma digital web creada para la comunidad de estudiantes y fanáticos de los videojuegos de la Universidad Católica Andrés Bello. 
Su misión es ofrecer un **espacio amigable, intuitivo y eficiente** donde los usuarios ucabistas puedan explorar un catálogo dinámico y experimentar la gestión de una tienda virtual en un entorno seguro y controlado.

---

## Funcionalidades Clave

La aplicación está diseñada para ser ágil, robusta y con altos estándares de calidad (ISO 25010):
* **Acceso como visitante (HU-1):** Explora e interactúa con el catálogo completo de juegos dinámicamente sin necesidad de un inicio de sesión previo.
* **Registro de cuenta y autenticación (HU-3):** Creación de perfiles para la comunidad ucabista con resguardo seguro de credenciales.
* **Gestión Administrativa (HU-2):** Panel exclusivo para el rol de Dueño que permite registrar nuevos títulos, controlando de forma estricta la robustez frente a errores de datos.

Nuestra prioridad en este primer release es garantizar un software **estable, seguro y con tiempos de carga inferiores a 1.5 segundos**, sentando las bases para futuras expansiones del catálogo y simulación de transacciones.

---

## Tecnologías Empleadas

HAZE sigue una arquitectura **Cliente-Servidor (Frontend/Backend)**, empleando herramientas estandarizadas y escalables:

### Frontend
* **HTML5, CSS3 & JavaScript** → Construcción de interfaces dinámicas, estéticas y reactivas optimizadas para navegadores modernos (Google Chrome, Mozilla Firefox y Safari).

### Backend
* **Node.js / Expres (o tu tecnología de Backend)** → Entorno de ejecución y framework robusto para la lógica del servidor, gestión de roles y APIs RESTful.

### Gestión y Persistencia
* **Git & GitHub** → Control de versiones y colaboración del equipo de desarrollo.
* **JSON / Base de Datos** → Formato estándar e intercambio de datos seguro para persistir los registros de juegos y usuarios de la comunidad.

---

## Arquitectura del Proyecto

La arquitectura está basada en un enfoque modular y aislado para facilitar la mantenibilidad evolutiva:

```text
src/
├── backend/     # Lógica del servidor: controladores de rutas, modelos de datos, validaciones de seguridad
└── frontend/    # Interfaz de usuario web: componentes de la interfaz, estilos CSS, lógica de navegación
