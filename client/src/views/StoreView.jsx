import { useState, useEffect } from 'react'
import { Search, ShoppingBag, MessageCircle, Eye, Sparkles, Filter, RefreshCw, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import { ProductModal } from './ProductModal'

export function StoreView({ onAddToCart, onNotify }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('destacados')
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  // Cargar categorías y productos
  const loadData = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const [catRes, prodRes] = await Promise.all([
        api.getCategories(),
        api.getProducts({
          categoria: selectedCat,
          search: searchTerm,
          sort: sortBy
        })
      ])

      if (catRes.success) setCategories(catRes.data)
      if (prodRes.success) setProducts(prodRes.data)
    } catch (error) {
      console.error('Error cargando la tienda:', error)
      setFetchError('No se pudo conectar con el servidor MySQL de Herrería Crisol. Asegúrate de que el backend esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedCat, sortBy])

  // Búsqueda con debounce simple
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 350)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsAppQuick = (e, product) => {
    e.stopPropagation()
    const text = `Hola Herrería Crisol! Me interesa el producto: *${product.nombre}* con precio de ${formatPrice(product.precio)}. ¿Tienen stock disponible o cuál es el tiempo de entrega?`
    window.open(`https://wa.me/5491123456789?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleAddCartQuick = (e, product) => {
    e.stopPropagation()
    onAddToCart(product)
    onNotify(`"${product.nombre}" agregado al cotizador.`, 'success')
  }

  return (
    <div className="store-view">
      {/* Banner de la Tienda */}
      <section className="store-header-banner">
        <div className="container">
          <span className="section-tag">Catálogo Oficial</span>
          <h1 className="section-title" style={{ fontSize: '2.8rem' }}>
            Tienda Virtual de Herrería Crisol
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '700px' }}>
            Explora nuestros productos listos para entrega o fabricados a pedido con precios transparentes. Sin intermediarios ni pasarelas de pago: coordiná tu pedido directo con los artesanos del taller.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Barra de Búsqueda y Filtros */}
          <div className="store-toolbar">
            <div className="search-box">
              <Search size={18} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="Buscar por nombre, material o descripción (ej: mesa, chulengo, portón)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-actions">
              <select
                className="form-control"
                style={{ padding: '0.55rem 0.85rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="destacados">⭐ Destacados primero</option>
                <option value="precio_asc">Precio: Menor a Mayor</option>
                <option value="precio_desc">Precio: Mayor a Menor</option>
                <option value="nombre_asc">Alfabético: A-Z</option>
              </select>

              <button className="btn-icon-action" onClick={loadData} title="Refrescar catálogo">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Pestañas de Categorías */}
          <div className="category-tabs">
            <button
              className={`category-tab-btn ${selectedCat === 'todas' ? 'active' : ''}`}
              onClick={() => setSelectedCat('todas')}
            >
              Todos los Productos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab-btn ${selectedCat === cat.slug ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.slug)}
              >
                {cat.nombre} ({cat.total_productos || 0})
              </button>
            ))}
          </div>

          {/* Mensaje de Error de Servidor si no conecta */}
          {fetchError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#fca5a5' }}>
              <AlertCircle size={24} color="var(--color-danger)" />
              <div style={{ flexGrow: 1 }}>
                <strong>Error de conexión con la API:</strong> {fetchError}
              </div>
              <button className="btn-secondary" onClick={loadData} style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                Reintentar
              </button>
            </div>
          )}

          {/* Lista de Productos */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-text-muted)' }}>
              <RefreshCw size={36} className="react-logo-spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <p>Cargando catálogo desde MySQL...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>No se encontraron productos</h3>
              <p>Prueba con otros términos de búsqueda o cambia la categoría seleccionada.</p>
              <button
                className="btn-secondary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => { setSelectedCat('todas'); setSearchTerm('') }}
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => setSelectedProduct(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-thumb-wrap">
                    <img 
                      src={product.imagen_url} 
                      alt={product.nombre} 
                      loading="lazy"
                      onError={(e) => { 
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' 
                      }} 
                    />
                    <span className="product-tag-cat">
                      {product.categoria_nombre || 'Herrería'}
                    </span>
                    {product.destacado === 1 && (
                      <span className="product-tag-featured">
                        <Sparkles size={12} />
                        <span>Destacado</span>
                      </span>
                    )}
                  </div>

                  <div className="product-info-wrap">
                    <h3 className="product-title">{product.nombre}</h3>
                    <p className="product-desc">{product.descripcion}</p>

                    <div className="product-specs">
                      {product.materiales && <div>🔩 {product.materiales}</div>}
                      {product.dimensiones && <div>📏 {product.dimensiones}</div>}
                    </div>

                    <div className="product-price-row">
                      <div>
                        <span className="product-price-label">Precio</span>
                        <div className="product-price">{formatPrice(product.precio)}</div>
                      </div>
                      <span className={`badge-status ${product.disponible ? 'active' : 'paused'}`}>
                        {product.disponible ? 'Disponible' : 'A Pedido'}
                      </span>
                    </div>

                    <div className="product-actions-grid">
                      <button
                        className="btn-wsp-prod"
                        onClick={(e) => handleWhatsAppQuick(e, product)}
                        title="Consultar por WhatsApp sin intermediarios"
                      >
                        <MessageCircle size={16} />
                        <span>Pedir por WhatsApp</span>
                      </button>

                      <button
                        className="btn-cart-prod"
                        onClick={(e) => handleAddCartQuick(e, product)}
                        title="Agregar a mi cotizador"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalle */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  )
}

