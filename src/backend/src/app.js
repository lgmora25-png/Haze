import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import juegoRoutes from './routes/juegoRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales de calidad y seguridad
app.use(cors());          // Permite peticiones desde el frontend (Vue)
app.use(express.json());  // Permite al servidor entender formatos JSON en el body

// Enrutador Principal de la API
app.use('/api/juegos', juegoRoutes);

// Ruta de prueba rápida por si abres el puerto en el navegador
app.get('/', (req, res) => {
  res.send('🎮 Servidor de HAZE API corriendo perfectamente.');
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en: http://localhost:${PORT}`);
});