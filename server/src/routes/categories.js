import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Obtener todas las categorías con conteo de productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, COUNT(p.id) as total_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.categoria_id
      GROUP BY c.id
      ORDER BY c.nombre ASC
    `)
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message })
  }
})

// Crear nueva categoría (opcional desde el panel)
router.post('/', async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono } = req.body
    if (!nombre) {
      return res.status(400).json({ success: false, message: 'El nombre es obligatorio' })
    }

    const finalSlug = slug || nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, slug, descripcion, icono) VALUES (?, ?, ?, ?)',
      [nombre, finalSlug, descripcion || '', icono || 'wrench']
    )

    res.status(201).json({
      success: true,
      message: 'Categoría creada con éxito',
      data: { id: result.insertId, nombre, slug: finalSlug, descripcion, icono }
    })
  } catch (error) {
    console.error('Error al crear categoría:', error)
    res.status(500).json({ success: false, message: 'Error al crear categoría', error: error.message })
  }
})

export default router

