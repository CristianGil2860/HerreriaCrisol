import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Listar todos los productos con filtros
router.get('/', async (req, res) => {
  try {
    const { categoria, search, destacado, disponible, sort } = req.query

    let sql = `
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `
    const params = []

    if (categoria && categoria !== 'todas') {
      sql += ' AND (c.slug = ? OR p.categoria_id = ?)'
      params.push(categoria, categoria)
    }

    if (search && search.trim() !== '') {
      sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.materiales LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    if (destacado !== undefined && destacado !== '') {
      sql += ' AND p.destacado = ?'
      params.push(destacado === 'true' || destacado === '1' ? 1 : 0)
    }

    if (disponible !== undefined && disponible !== '') {
      sql += ' AND p.disponible = ?'
      params.push(disponible === 'true' || disponible === '1' ? 1 : 0)
    }

    // Ordenamiento
    if (sort === 'precio_asc') {
      sql += ' ORDER BY p.precio ASC'
    } else if (sort === 'precio_desc') {
      sql += ' ORDER BY p.precio DESC'
    } else if (sort === 'nombre_asc') {
      sql += ' ORDER BY p.nombre ASC'
    } else {
      sql += ' ORDER BY p.destacado DESC, p.created_at DESC'
    }

    const [rows] = await pool.query(sql, params)
    res.json({ success: true, count: rows.length, data: rows })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message })
  }
})

// Obtener un solo producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id])

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('Error al obtener producto:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message })
  }
})

// Crear producto (Panel de Control)
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      categoria_id,
      imagen_url,
      destacado,
      disponible,
      materiales,
      dimensiones,
      tiempo_fabricacion
    } = req.body

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y el precio son campos obligatorios.'
      })
    }

    const fallbackImg = 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80'

    const [result] = await pool.query(`
      INSERT INTO productos 
      (nombre, descripcion, precio, categoria_id, imagen_url, destacado, disponible, materiales, dimensiones, tiempo_fabricacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nombre,
      descripcion || '',
      parseFloat(precio),
      categoria_id ? parseInt(categoria_id) : null,
      imagen_url || fallbackImg,
      destacado ? 1 : 0,
      disponible !== undefined ? (disponible ? 1 : 0) : 1,
      materiales || 'Hierro forjado y perfiles de acero',
      dimensiones || 'A convenir / estándar',
      tiempo_fabricacion || '7 a 10 días hábiles'
    ])

    const [created] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId])

    res.status(201).json({
      success: true,
      message: 'Producto publicado exitosamente en Herrería Crisol.',
      data: created[0]
    })
  } catch (error) {
    console.error('Error al crear producto:', error)
    res.status(500).json({ success: false, message: 'Error al registrar producto', error: error.message })
  }
})

// Modificar producto (Panel de Control)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      nombre,
      descripcion,
      precio,
      categoria_id,
      imagen_url,
      destacado,
      disponible,
      materiales,
      dimensiones,
      tiempo_fabricacion
    } = req.body

    const [existing] = await pool.query('SELECT id FROM productos WHERE id = ?', [id])
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' })
    }

    await pool.query(`
      UPDATE productos SET
        nombre = ?,
        descripcion = ?,
        precio = ?,
        categoria_id = ?,
        imagen_url = ?,
        destacado = ?,
        disponible = ?,
        materiales = ?,
        dimensiones = ?,
        tiempo_fabricacion = ?
      WHERE id = ?
    `, [
      nombre,
      descripcion,
      parseFloat(precio),
      categoria_id ? parseInt(categoria_id) : null,
      imagen_url,
      destacado ? 1 : 0,
      disponible ? 1 : 0,
      materiales,
      dimensiones,
      tiempo_fabricacion,
      id
    ])

    const [updated] = await pool.query('SELECT * FROM productos WHERE id = ?', [id])

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      data: updated[0]
    })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({ success: false, message: 'Error al actualizar producto', error: error.message })
  }
})

// Alternar disponibilidad rápida
router.patch('/:id/toggle-disponible', async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.query('SELECT disponible FROM productos WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' })
    }

    const nuevoEstado = rows[0].disponible === 1 ? 0 : 1
    await pool.query('UPDATE productos SET disponible = ? WHERE id = ?', [nuevoEstado, id])

    res.json({
      success: true,
      message: `Disponibilidad cambiada a ${nuevoEstado ? 'Disponible' : 'Pausado'}`,
      disponible: nuevoEstado
    })
  } catch (error) {
    console.error('Error al cambiar disponibilidad:', error)
    res.status(500).json({ success: false, message: 'Error interno', error: error.message })
  }
})

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' })
    }

    res.json({ success: true, message: 'Producto eliminado correctamente.' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.status(500).json({ success: false, message: 'Error al eliminar producto', error: error.message })
  }
})

export default router

