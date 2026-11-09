import { X, MessageCircle, ShoppingBag, Check, Clock, Ruler, Wrench } from 'lucide-react'

export function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsApp = () => {
    const text = `Hola Herrería Crisol! Me interesa el producto: *${product.nombre}* (Precio: ${formatPrice(product.precio)}).\n¿Tienen disponibilidad o cuánto demora la fabricación? ¡Muchas gracias!`
    window.open(`https://wa.me/5491123456789?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="product-tag-cat" style={{ position: 'static' }}>
              {product.categoria_nombre || 'Herrería'}
            </span>
            <h3 style={{ fontSize: '1.25rem' }}>Ficha Técnica del Producto</h3>
          </div>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', alignItems: 'start' }}>
            {/* Foto grande del producto */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', height: '340px' }}>
              <img
                src={product.imagen_url}
                alt={product.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' }}
              />
            </div>

            {/* Datos Técnicos y Precio */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                {product.nombre}
              </h2>

              <div style={{ marginBottom: '1.25rem' }}>
                <span className="product-price-label">Precio al Público</span>
                <div className="product-price" style={{ fontSize: '2.1rem' }}>
                  {formatPrice(product.precio)}
                </div>
              </div>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {product.descripcion}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                {product.materiales && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <Wrench size={16} color="var(--color-fire-glow)" />
                    <span><strong>Materiales:</strong> {product.materiales}</span>
                  </div>
                )}
                {product.dimensiones && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <Ruler size={16} color="var(--color-fire-glow)" />
                    <span><strong>Dimensiones:</strong> {product.dimensiones}</span>
                  </div>
                )}
                {product.tiempo_fabricacion && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <Clock size={16} color="var(--color-fire-glow)" />
                    <span><strong>Plazo estimado:</strong> {product.tiempo_fabricacion}</span>
                  </div>
                )}
              </div>

              {/* Botones de Acción (Sin pasarela) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="btn-wsp-prod" style={{ padding: '0.85rem' }} onClick={handleWhatsApp}>
                  <MessageCircle size={18} />
                  <span>Pedir / Consultar por WhatsApp</span>
                </button>

                <button
                  className="btn-secondary"
                  style={{ justifyContent: 'center', padding: '0.85rem' }}
                  onClick={() => {
                    onAddToCart(product)
                    onClose()
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Agregar al Cotizador</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

