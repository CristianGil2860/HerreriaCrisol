import { Flame, ShoppingCart, MessageCircle, Menu, X, Settings, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function Navbar({ seccionActiva, setSeccionActiva, itemsCotizacion, onToggleCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'taller', label: 'Nuestro Taller' },
    { id: 'servicios', label: 'Servicios de Herrería' },
    { id: 'tienda', label: 'Tienda Virtual' },
  ]

  const totalItems = itemsCotizacion.reduce((acc, item) => acc + item.cantidad, 0)

  const handleNavClick = (id) => {
    setSeccionActiva(id)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand / Logo */}
        <button className="brand-link" onClick={() => handleNavClick('inicio')}>
          <div className="brand-icon-box">
            <Flame size={22} />
          </div>
          <div className="brand-texts">
            <span className="brand-name">
              HERRERÍA <span>CRISOL</span>
            </span>
            <span className="brand-tagline">Arte en Hierro & Estructuras</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="nav-menu desktop-only">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${seccionActiva === link.id ? 'active' : ''}`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button
            className={`nav-link nav-link-admin ${seccionActiva === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
            title="Panel de administración de productos"
          >
            <Settings size={15} />
            <span>Panel Admin</span>
          </button>
        </nav>

        {/* Actions: Cart + WhatsApp + Hamburger */}
        <div className="nav-actions">
          {/* Botón Cotizador */}
          <button
            className="cart-toggle-btn"
            onClick={onToggleCart}
            title="Ver productos agregados para cotizar"
          >
            <ShoppingCart size={18} />
            <span className="cart-text">Cotizador</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {/* Botón WhatsApp */}
          <a
            href="https://wa.me/5491123456789?text=Hola%20Herrería%20Crisol!%20Me%20gustaría%20hacerles%20una%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wsp-nav"
            title="Chatear por WhatsApp con el taller"
          >
            <MessageCircle size={18} />
            <span className="wsp-text">WhatsApp</span>
          </a>

          {/* Botón Hamburguesa para Móvil y Tablet */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar menú de navegación"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-container">
            <div className="mobile-menu-links">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  className={`mobile-nav-link ${seccionActiva === link.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(link.id)}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} />
                </button>
              ))}

              <button
                className={`mobile-nav-link admin ${seccionActiva === 'admin' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Settings size={18} />
                  <span>Panel Admin</span>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mobile-menu-footer">
              <a
                href="https://wa.me/5491123456789?text=Hola%20Herrería%20Crisol!%20Me%20gustaría%20hacerles%20una%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wsp-prod"
                style={{ width: '100%', padding: '0.9rem', justifyContent: 'center' }}
              >
                <MessageCircle size={20} />
                <span>Contactar Taller por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
