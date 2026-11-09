import { X, Trash2, MessageCircle, ArrowRight, ShoppingBag } from 'lucide-react'

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (!isOpen) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const total = items.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0)

  // Armar mensaje para WhatsApp
  const handleSendWhatsApp = () => {
    if (items.length === 0) return

    let text = `🔥 *CONSULTA DE PEDIDO - HERRERÍA CRISOL*\n`
    text += `Hola! Me comunico desde su tienda virtual para consultar disponibilidad y coordinar la compra de los siguientes productos:\n\n`

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.nombre}*\n`
      text += `   - Cantidad: ${item.cantidad}\n`
      text += `   - Precio unitario: ${formatPrice(item.precio)}\n`
      text += `   - Subtotal: ${formatPrice(parseFloat(item.precio) * item.cantidad)}\n\n`
    })

    text += `💰 *TOTAL ESTIMADO: ${formatPrice(total)}*\n\n`
    text += `¿Tienen stock o cuál es el plazo de entrega/instalación? ¡Muchas gracias!`

    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/5491123456789?text=${encoded}`, '_blank')
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel">
        {/* Cabecera */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} color="var(--color-fire-glow)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Mi Cotizador / Pedido</h3>
          </div>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="drawer-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <h4 style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Tu cotizador está vacío</h4>
              <p style={{ fontSize: '0.9rem' }}>
                Explora la tienda virtual y agrega los productos de herrería que te interesen para consultar su precio y coordinar la compra.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="drawer-item">
                <img src={item.imagen_url} alt={item.nombre} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
                    {item.nombre}
                  </h4>
                  <div style={{ color: 'var(--color-fire-glow)', fontWeight: 700, fontSize: '0.92rem' }}>
                    {formatPrice(item.precio)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                      style={{ width: '24px', height: '24px', background: 'var(--color-surface-hover)', borderRadius: '4px', color: 'white' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.cantidad}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                      style={{ width: '24px', height: '24px', background: 'var(--color-surface-hover)', borderRadius: '4px', color: 'white' }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn-icon-action danger"
                  onClick={() => onRemoveItem(item.id)}
                  title="Eliminar del cotizador"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pie de página con Total y Acción */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-total-row">
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>Total Estimado:</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-fire-glow)' }}>
                {formatPrice(total)}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginBottom: '1rem', lineHeight: '1.4' }}>
              💡 <em>Sin pasarela de pago online. El pedido se envía directamente al taller por WhatsApp para verificar medidas y coordinar entrega o instalación.</em>
            </p>

            <button
              className="btn-wsp-prod"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              onClick={handleSendWhatsApp}
            >
              <MessageCircle size={20} />
              <span>Enviar Pedido a WhatsApp</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onClearCart}
              style={{ width: '100%', background: 'transparent', color: 'var(--color-text-dim)', fontSize: '0.8rem', marginTop: '0.75rem', textDecoration: 'underline' }}
            >
              Vaciar cotizador
            </button>
          </div>
        )}
      </div>
    </>
  )
}

