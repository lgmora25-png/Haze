import express from 'express'
import cors from 'cors'
import juegoRoutes from './routes/juegoRoutes.js'
import resenaRoutes from './routes/resenaRoutes.js'

const app = express()


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use('/api/juegos', juegoRoutes)
app.use('/api/resenas', resenaRoutes)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en: http://localhost:3000`)
})