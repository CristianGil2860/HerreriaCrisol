import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Listar todas las consultas (para el Panel de Control)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, p.nombre as producto_nombre
      FROM consultas c
      LEFT JOIN productos p ON c.producto_id = p.id
      ORDER BY c.created_at DESC
    `)
    res.json({ success: true, count: rows.length, data: rows })
  } catch (error) {
    console.error('Error al obtener consultas:', error)
    res.status(500).json({ success: false, message: 'Error interno', error: error.message })
  }
})

// Registrar nueva consulta (desde el sitio institucional o tienda)
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, email, tipo_trabajo, mensaje, producto_id } = req.body

    if (!nombre || !telefono || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, teléfono y mensaje son obligatorios.'
      })
    }

    const [result] = await pool.query(`
      INSERT INTO consultas (nombre, telefono, email, tipo_trabajo, mensaje, producto_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      nombre,
      telefono,
      email || null,
      tipo_trabajo || 'Presupuesto General',
      mensaje,
      producto_id ? parseInt(producto_id) : null
    ])

    res.status(201).json({
      success: true,
      message: '¡Gracias por contactar a Herrería Crisol! Responderemos a la brevedad.',
      data: { id: result.insertId }
    })
  } catch (error) {
    console.error('Error al guardar consulta:', error)
    res.status(500).json({ success: false, message: 'Error al enviar consulta', error: error.message })
  }
})

// Cambiar estado de una consulta (pendiente, contactado, presupuestado, finalizado)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const validStates = ['pendiente', 'contactado', 'presupuestado', 'finalizado']
    if (!validStates.includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' })
    }

    await pool.query('UPDATE consultas SET estado = ? WHERE id = ?', [estado, id])
    res.json({ success: true, message: `Estado actualizado a "${estado}"` })
  } catch (error) {
    console.error('Error al actualizar estado:', error)
    res.status(500).json({ success: false, message: 'Error al actualizar estado', error: error.message })
  }
})

export default router

