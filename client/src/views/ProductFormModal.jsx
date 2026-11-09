import { useState, useEffect } from 'react'
import { X, Upload, Image, Link, Check, AlertCircle } from 'lucide-react'
import { api } from '../services/api'

export function ProductFormModal({ product, categories, onClose, onSave, onNotify }) {
  const isEditing = Boolean(product && product.id)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: categories.length > 0 ? categories[0].id : '',
    imagen_url: '',
    destacado: 0,
    disponible: 1,
    materiales: '',
    dimensiones: '',
    tiempo_fabricacion: '7 a 10 días hábiles'
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageMode, setImageMode] = useState('url') // 'url' | 'file'
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        categoria_id: product.categoria_id || (categories[0]?.id || ''),
        imagen_url: product.imagen_url || '',
        destacado: product.destacado ? 1 : 0,
        disponible: product.disponible ? 1 : 0,
        materiales: product.materiales || '',
        dimensiones: product.dimensiones || '',
        tiempo_fabricacion: product.tiempo_fabricacion || '7 a 10 días hábiles'
      })
    }
  }, [product, categories])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  // Subir imagen al servidor Node.js
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const res = await api.uploadImage(file)
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, imagen_url: res.url }))
        onNotify('Imagen subida correctamente al servidor local', 'success')
      }
    } catch (error) {
      console.error(error)
      onNotify('Error al subir imagen al servidor', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre || !formData.precio) {
      onNotify('El nombre y el precio son obligatorios', 'error')
      return
    }

    setSaving(true)
    try {
      if (isEditing) {
        await api.updateProduct(product.id, formData)
        onNotify(`Producto "${formData.nombre}" actualizado con éxito`, 'success')
      } else {
        await api.createProduct(formData)
        onNotify(`Producto "${formData.nombre}" publicado en la tienda virtual`, 'success')
      }
      onSave()
      onClose()
    } catch (error) {
      console.error(error)
      onNotify(error.message || 'Error al guardar producto', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            {isEditing ? '✏️ Modificar Producto' : '🔨 Publicar Nuevo Producto'}
          </h3>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="quote-form-grid">
              <div className="form-group form-full">
                <label>Nombre del Producto *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  placeholder="Ej: Portón Corredizo Automatizado 3x2m"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio al Público (ARS) *</label>
                <input
                  type="number"
                  step="any"
                  name="precio"
                  className="form-control"
                  placeholder="Ej: 185000"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="categoria_id"
                  className="form-control"
                  value={formData.categoria_id}
                  onChange={handleChange}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-full">
                <label>Descripción del Producto</label>
                <textarea
                  name="descripcion"
                  rows={3}
                  className="form-control"
                  placeholder="Detalla las características técnicas, usos recomendados, acabados..."
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Materiales Empleados</label>
                <input
                  type="text"
                  name="materiales"
                  className="form-control"
                  placeholder="Ej: Caño estructural 60x40, chapa plegada"
                  value={formData.materiales}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Dimensiones / Medidas</label>
                <input
                  type="text"
                  name="dimensiones"
                  className="form-control"
                  placeholder="Ej: 200 x 90 x 78 cm"
                  value={formData.dimensiones}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-full">
                <label>Plazo de Fabricación / Disponibilidad</label>
                <input
                  type="text"
                  name="tiempo_fabricacion"
                  className="form-control"
                  placeholder="Ej: En stock / 7 a 10 días hábiles"
                  value={formData.tiempo_fabricacion}
                  onChange={handleChange}
                />
              </div>

              {/* Imagen del Producto */}
              <div className="form-group form-full" style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Imagen del Producto</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className={`btn-icon-action ${imageMode === 'url' ? 'active' : ''}`}
                      style={{ width: 'auto', padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
                      onClick={() => setImageMode('url')}
                    >
                      <Link size={14} /> URL
                    </button>
                    <button
                      type="button"
                      className={`btn-icon-action ${imageMode === 'file' ? 'active' : ''}`}
                      style={{ width: 'auto', padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
                      onClick={() => setImageMode('file')}
                    >
                      <Upload size={14} /> Subir Archivo
                    </button>
                  </div>
                </div>

                {imageMode === 'url' ? (
                  <input
                    type="url"
                    name="imagen_url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imagen_url}
                    onChange={handleChange}
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="form-control"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <p style={{ fontSize: '0.8rem', color: 'var(--color-fire-glow)', marginTop: '0.35rem' }}>Subiendo imagen...</p>}
                  </div>
                )}

                {/* Vista previa de la imagen */}
                {formData.imagen_url && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={formData.imagen_url}
                      alt="Preview"
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Vista previa de la imagen asignada</span>
                  </div>
                )}
              </div>

              {/* Opciones booleanas */}
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '0.5rem' }} className="form-full">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado === 1}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-fire)' }}
                  />
                  <span>⭐ Producto Destacado en Portada</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible === 1}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-success)' }}
                  />
                  <span>✅ Disponible para Venta (Activo)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Check size={18} />
              <span>{saving ? 'Guardando en MySQL...' : isEditing ? 'Guardar Cambios' : 'Publicar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

