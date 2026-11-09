import { useState, useEffect } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { NotificationToast } from './components/NotificationToast'

import { HomeView } from './views/HomeView'
import { AboutView } from './views/AboutView'
import { ServicesView } from './views/ServicesView'
import { StoreView } from './views/StoreView'
import { AdminView } from './views/AdminView'

function App() {
  // Pestañas: 'inicio' | 'taller' | 'servicios' | 'tienda' | 'admin'
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  // Cotizador en memoria con persistencia en localStorage
  const [itemsCotizacion, setItemsCotizacion] = useState(() => {
    try {
      const saved = localStorage.getItem('crisol_cotizador')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('crisol_cotizador', JSON.stringify(itemsCotizacion))
    } catch (e) {
      console.error(e)
    }
  }, [itemsCotizacion])

  // Notificaciones Toast
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Funciones del Carrito/Cotizador
  const handleAddToCart = (product) => {
    setItemsCotizacion((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
    addToast(`"${product.nombre}" agregado al cotizador`, 'success')
  }

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setItemsCotizacion((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, cantidad: newQty } : item))
    )
  }

  const handleRemoveFromCart = (productId) => {
    setItemsCotizacion((prev) => prev.filter((item) => item.id !== productId))
    addToast('Producto quitado del cotizador', 'info')
  }

  const handleClearCart = () => {
    setItemsCotizacion([])
    addToast('Cotizador vaciado', 'info')
  }

  return (
    <div className="app-root">
      {/* Barra de Navegación */}
      <Navbar
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        itemsCotizacion={itemsCotizacion}
        onToggleCart={() => setCartOpen(!cartOpen)}
      />

      {/* Contenido Principal Dinámico */}
      <main style={{ flexGrow: 1 }}>
        {seccionActiva === 'inicio' && (
          <HomeView setSeccionActiva={setSeccionActiva} />
        )}

        {seccionActiva === 'taller' && (
          <AboutView setSeccionActiva={setSeccionActiva} />
        )}

        {seccionActiva === 'servicios' && (
          <ServicesView onNotify={addToast} />
        )}

        {seccionActiva === 'tienda' && (
          <StoreView
            onAddToCart={handleAddToCart}
            onNotify={addToast}
          />
        )}

        {seccionActiva === 'admin' && (
          <AdminView
            onNotify={addToast}
            setSeccionActiva={setSeccionActiva}
          />
        )}
      </main>

      {/* Cajón de Cotización / Pedido (Sin pasarela de pago) */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={itemsCotizacion}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Notificaciones flotantes */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />

      {/* Pie de Página Institucional */}
      <Footer setSeccionActiva={setSeccionActiva} />
    </div>
  )
}

export default App
