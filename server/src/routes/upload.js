import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.resolve(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const safeName = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e5)}`
    cb(null, `${safeName}-${unique}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.)'), false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
})

router.post('/', upload.single('imagen'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo' })
    }

    const host = req.get('host')
    const protocol = req.protocol
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

    res.json({
      success: true,
      message: 'Imagen subida correctamente',
      url: imageUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    res.status(500).json({ success: false, message: 'Error procesando la imagen', error: error.message })
  }
})

export default router

