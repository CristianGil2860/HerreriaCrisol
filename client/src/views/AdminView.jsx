import { useState, useEffect } from 'react'
import {
  Package,
  Layers,
  MessageSquare,
  DollarSign,
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  ExternalLink,
  Phone,
  CheckCircle,
  Database,
  Activity
} from 'lucide-react'
import { api } from '../services/api'
import { ProductFormModal } from './ProductFormModal'

export function AdminView({ onNotify, setSeccionActiva }) {
  const [activeTab, setActiveTab] = useState('productos') // 'productos' | 'consultas' | 'sistema'
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtros de tabla productos
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCat, setFilterCat] = useState('todas')

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [healthStatus, setHealthStatus] = useState(null)

  const loadAllAdminData = async () => {
    setLoading(true)
    try {
      const [statsRes, prodRes, catRes, inqRes, healthRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getProducts().catch(() => ({ success: false, data: [] })),
        api.getCategories().catch(() => ({ success: false, data: [] })),
        api.getInquiries().catch(() => ({ success: false, data: [] })),
        api.checkHealth().catch(() => null)
      ])

      if (statsRes?.success) setStats(statsRes.data)
      if (prodRes?.success) setProducts(prodRes.data)
      if (catRes?.success) setCategories(catRes.data)
      if (inqRes?.success) setInquiries(inqRes.data)
      if (healthRes) setHealthStatus(healthRes)
    } catch (error) {
      console.error('Error al cargar panel de administración:', error)
      onNotify('Error de sincronización con la API de Node/MySQL', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllAdminData()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Alternar disponibilidad rápida de producto
  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await api.toggleProductAvailability(id)
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, disponible: p.disponible ? 0 : 1 } : p))
      )
      onNotify('Disponibilidad actualizada en MySQL', 'info')
    } catch (error) {
      console.error(error)
      onNotify('No se pudo cambiar el estado', 'error')
    }
  }

  // Eliminar producto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return
    try {
      await api.deleteProduct(productToDelete.id)
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      onNotify(`Producto "${productToDelete.nombre}" eliminado`, 'success')
      setProductToDelete(null)
      loadAllAdminData()
    } catch (error) {
      console.error(error)
      onNotify('Error al eliminar producto', 'error')
    }
  }

  // Cambiar estado de una consulta recibida
  const handleInquiryStatusChange = async (id, newStatus) => {
    try {
      await api.updateInquiryStatus(id, newStatus)
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, estado: newStatus } : inq))
      )
      onNotify(`Estado de consulta cambiado a "${newStatus}"`, 'success')
    } catch (error) {
      console.error(error)
      onNotify('Error al actualizar estado de consulta', 'error')
    }
  }

  // Filtrado local de productos para la tabla
  const filteredProducts = products.filter((p) => {
    const matchTerm =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = filterCat === 'todas' || p.categoria_slug === filterCat || p.categoria_id === parseInt(filterCat)
    return matchTerm && matchCat
  })

  return (
    <div className="admin-view container">
      {/* Cabecera del Panel */}
      <div className="admin-header">
        <div>
          <span className="section-tag">Backoffice • Herrería Crisol</span>
          <h1>Panel de Control de Productos</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Gestiona el catálogo oficial, publica nuevos artículos con precio y administra las consultas de clientes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={loadAllAdminData} title="Refrescar datos">
            <RefreshCw size={16} />
            <span>Actualizar</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              setProductToEdit(null)
              setIsModalOpen(true)
            }}
          >
            <Plus size={18} />
            <span>Publicar Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards / Métricas en vivo */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(234, 88, 12, 0.15)', color: 'var(--color-fire-glow)' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="kpi-val">{stats?.productos?.total_productos ?? products.length}</div>
            <div className="kpi-lbl">Productos en Catálogo</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="kpi-val">{stats?.productos?.disponibles ?? products.filter(p => p.disponible).length}</div>
            <div className="kpi-lbl">Activos / Disponibles</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="kpi-val">{categories.length}</div>
            <div className="kpi-lbl">Categorías de Herrería</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-amber)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="kpi-val">{inquiries.length}</div>
            <div className="kpi-lbl">Consultas Recibidas</div>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          <Package size={18} />
          <span>Catálogo de Productos ({products.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'consultas' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultas')}
        >
          <MessageSquare size={18} />
          <span>Consultas & Presupuestos ({inquiries.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'sistema' ? 'active' : ''}`}
          onClick={() => setActiveTab('sistema')}
        >
          <Database size={18} />
          <span>Estado del Servidor & MySQL</span>
        </button>
      </div>

      {/* ================= PESTAÑA 1: PRODUCTOS ================= */}
      {activeTab === 'productos' && (
        <div>
          {/* Barra de Filtros */}
          <div className="store-toolbar" style={{ margin: '0 0 1.5rem 0' }}>
            <div className="search-box">
              <Search size={18} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-actions">
              <select
                className="form-control"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Foto</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      No se encontraron productos registrados. Haz clic en "Publicar Nuevo Producto".
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img src={p.imagen_url} alt={p.nombre} className="admin-prod-thumb" />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                          {p.nombre}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {p.materiales || 'Hierro macizo'}
                        </div>
                      </td>
                      <td>
                        <span className="product-tag-cat" style={{ position: 'static' }}>
                          {p.categoria_nombre || 'Herrería'}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-fire-glow)', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                          {formatPrice(p.precio)}
                        </strong>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleAvailability(p.id, p.disponible)}
                          className={`badge-status ${p.disponible ? 'active' : 'paused'}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                          title="Clic para cambiar entre Disponible y Pausado"
                        >
                          {p.disponible ? 'Disponible' : 'Pausado'}
                        </button>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon-action"
                            onClick={() => {
                              setProductToEdit(p)
                              setIsModalOpen(true)
                            }}
                            title="Editar datos del producto"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            className="btn-icon-action danger"
                            onClick={() => setProductToDelete(p)}
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 2: CONSULTAS Y PRESUPUESTOS ================= */}
      {activeTab === 'consultas' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente / Contacto</th>
                <th>Tipo de Trabajo</th>
                <th>Mensaje / Medidas</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Contactar</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
                    No hay consultas ni solicitudes de presupuesto registradas en MySQL todavía.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', whiteSpace: 'nowrap' }}>
                      {new Date(inq.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{inq.nombre}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{inq.telefono}</div>
                      {inq.email && <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>{inq.email}</div>}
                    </td>
                    <td>
                      <span className="product-tag-cat" style={{ position: 'static' }}>
                        {inq.tipo_trabajo}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                        {inq.mensaje}
                      </p>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                        value={inq.estado}
                        onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                      >
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="contactado">📞 Contactado</option>
                        <option value="presupuestado">📄 Presupuestado</option>
                        <option value="finalizado">✅ Finalizado</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <a
                        href={`https://wa.me/${inq.telefono.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(inq.nombre)}!%20Nos%20comunicamos%20de%20Herrería%20Crisol%20por%20tu%20consulta%20de:%20${encodeURIComponent(inq.tipo_trabajo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-wsp-prod"
                        style={{ display: 'inline-flex', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                        title="Abrir chat de WhatsApp con el cliente"
                      >
                        <Phone size={14} />
                        <span>Chatear</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PESTAÑA 3: ESTADO DEL SISTEMA ================= */}
      {activeTab === 'sistema' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="value-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Database size={24} color="var(--color-fire-glow)" />
              <h3 style={{ margin: 0 }}>Base de Datos MySQL</h3>
            </div>
            <p><strong>Servicio:</strong> MySQL (XAMPP / MariaDB)</p>
            <p><strong>Base de Datos:</strong> <code>herreria_crisol</code></p>
            <p><strong>Puerto:</strong> 3306</p>
            <p><strong>Estado:</strong> <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Conectado & Operativo</span></p>
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
              Tablas inicializadas: <code>productos</code>, <code>categorias</code>, <code>consultas</code>.
            </p>
          </div>

          <div className="value-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Activity size={24} color="var(--color-fire-glow)" />
              <h3 style={{ margin: 0 }}>API Backend (Node.js + Express)</h3>
            </div>
            <p><strong>Servidor:</strong> Express v4</p>
            <p><strong>Puerto:</strong> 3001</p>
            <p><strong>Endpoint:</strong> <code>http://localhost:3001/api</code></p>
            <p><strong>Subida de imágenes:</strong> Multer activo en <code>/uploads</code></p>
            <p><strong>Salud API:</strong> {healthStatus?.status === 'ok' ? '✅ En línea y respondiendo' : 'Conectando...'}</p>
          </div>
        </div>
      )}

      {/* Modal de Publicar / Editar Producto */}
      {isModalOpen && (
        <ProductFormModal
          product={productToEdit}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false)
            setProductToEdit(null)
          }}
          onSave={loadAllAdminData}
          onNotify={onNotify}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {productToDelete && (
        <div className="modal-backdrop" onClick={() => setProductToDelete(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--color-danger)' }}>¿Eliminar Producto?</h3>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar permanentemente <strong>"{productToDelete.nombre}"</strong> de la base de datos de Herrería Crisol?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setProductToDelete(null)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                style={{ background: 'var(--color-danger)' }}
                onClick={handleDeleteProduct}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

