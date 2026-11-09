import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [prodStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_productos,
        SUM(CASE WHEN disponible = 1 THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN destacado = 1 THEN 1 ELSE 0 END) as destacados,
        COALESCE(AVG(precio), 0) as precio_promedio,
        COALESCE(SUM(precio), 0) as valor_catalogo
      FROM productos
    `)

    const [catStats] = await pool.query('SELECT COUNT(*) as total_categorias FROM categorias')
    const [inqStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_consultas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes
      FROM consultas
    `)

    res.json({
      success: true,
      data: {
        productos: prodStats[0],
        categorias: catStats[0].total_categorias,
        consultas: inqStats[0]
      }
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ success: false, message: 'Error interno', error: error.message })
  }
})

export default router

