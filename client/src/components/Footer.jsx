import { Flame, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react'

export function Footer({ setSeccionActiva }) {
  const handleNav = (sec) => {
    setSeccionActiva(sec)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Columna 1: Identidad */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon-box" style={{ width: '36px', height: '36px' }}>
                <Flame size={20} />
              </div>
              <span className="brand-name" style={{ fontSize: '1.15rem' }}>
                HERRERÍA <span>CRISOL</span>
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Forjando solidez, elegancia y seguridad desde hace más de 15 años. Especialistas en herrería artística, estructuras pesadas y mobiliario contemporáneo en hierro y madera.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-fire-glow)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Garantía estructural de 5 años</span>
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="footer-col">
            <h4>Secciones</h4>
            <ul>
              <li><button onClick={() => handleNav('inicio')} style={{ background: 'none', color: 'inherit' }}>Inicio & Presentación</button></li>
              <li><button onClick={() => handleNav('taller')} style={{ background: 'none', color: 'inherit' }}>Nuestro Taller & Oficio</button></li>
              <li><button onClick={() => handleNav('servicios')} style={{ background: 'none', color: 'inherit' }}>Servicios de Obra & Cotizaciones</button></li>
              <li><button onClick={() => handleNav('tienda')} style={{ background: 'none', color: 'inherit' }}>Tienda Virtual (Catálogo con Precios)</button></li>
              <li><button onClick={() => handleNav('admin')} style={{ background: 'none', color: 'inherit' }}>Panel de Control (Admin)</button></li>
            </ul>
          </div>

          {/* Columna 3: Especialidades */}
          <div className="footer-col">
            <h4>Especialidades</h4>
            <ul>
              <li>Portones corredizos y levadizos</li>
              <li>Rejas de seguridad y cerramientos</li>
              <li>Parrillas, chulengos y fogoneros</li>
              <li>Mobiliario industrial a medida</li>
              <li>Pérgolas y tinglados estructurales</li>
            </ul>
          </div>

          {/* Columna 4: Contacto & Taller */}
          <div className="footer-col">
            <h4>Contacto & Taller</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-fire-glow)" />
                <span>Parque Industrial Metalúrgico, Calle 14 N° 840</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-fire-glow)" />
                <span>+54 9 11 2345-6789</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--color-fire-glow)" />
                <span>contacto@herreriacrisol.com.ar</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--color-fire-glow)" />
                <span>Lun a Vie: 07:30 a 18:00 hs | Sáb: 08:00 a 13:00 hs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Herrería Crisol. Todos los derechos reservados.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Desarrollado con React 19, Node.js y MySQL
          </p>
        </div>
      </div>
    </footer>
  )
}

