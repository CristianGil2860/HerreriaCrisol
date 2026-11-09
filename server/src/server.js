import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { initDatabase, pool } from './db.js'

import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'
import inquiriesRouter from './routes/inquiries.js'
import uploadRouter from './routes/upload.js'
import statsRouter from './routes/stats.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir archivos estáticos subidos
const uploadsDir = path.resolve(__dirname, '../uploads')
app.use('/uploads', express.static(uploadsDir))

// Endpoint de salud / prueba
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as is_alive')
    res.json({
      status: 'ok',
      service: 'Herrería Crisol API',
      database: 'MySQL conectado',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'warning',
      service: 'Herrería Crisol API',
      database: 'Error de conexión a MySQL',
      error: error.message
    })
  }
})

// Rutas de la API
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/inquiries', inquiriesRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/stats', statsRouter)

// Ruta fallback para 404 de la API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint de API no encontrado' })
})

// Servir frontend compilado de React (client/dist) en el mismo puerto
const clientDistDir = path.resolve(__dirname, '../../client/dist')
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDistDir, 'index.html'))
  })
}

// Inicializar base de datos y arrancar servidor
async function startServer() {
  await initDatabase()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🔥 ==============================================`)
    console.log(`🔨 Servidor Backend - Herrería Crisol`)
    console.log(`🚀 API activa en: http://localhost:${PORT}`)
    console.log(`📦 Endpoint de salud: http://localhost:${PORT}/api/health`)
    console.log(`==============================================\n`)
  })
}

startServer()

