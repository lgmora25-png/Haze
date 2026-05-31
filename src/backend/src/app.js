import express from 'express'
import cors from 'cors'
import juegoRoutes from './routes/juegoRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import resenaRoutes from './routes/resenaRoutes.js'
import pagoRoutes from './routes/pagoRoutes.js'

const app = express()


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/api/juegos', juegoRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/resenas', resenaRoutes)
app.use('/api/pagos', pagoRoutes)

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload demasiado grande. Usa una imagen más pequeña o ajusta el límite.' });
  }
  next(err);
});

const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en: http://localhost:3000`)
})