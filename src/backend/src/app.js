import express from 'express'
import cors from 'cors' // <-- Asegúrate de que esté aquí
import juegoRoutes from './routes/juegoRoutes.js'

const app = express()

// IMPORTANTE: cors() DEBE ir antes de las rutas
app.use(cors()) 
app.use(express.json())

app.use('/api/juegos', juegoRoutes)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en: http://localhost:3000`)
})