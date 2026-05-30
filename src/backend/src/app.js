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

app.use(express.json())
app.use('/api/juegos', juegoRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/resenas', resenaRoutes)
app.use('/api/pagos', pagoRoutes)

// Log registered routes (for debugging)
try {
  const routes = app._router && app._router.stack ? app._router.stack.filter(l=>l.route).map(l=>l.route.path) : []
  console.log('Rutas registradas:', routes)
} catch (e) {
  console.error('No se pudieron listar rutas:', e.message)
}

const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en: http://localhost:3000`)
})