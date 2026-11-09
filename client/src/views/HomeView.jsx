import { Flame, ShieldCheck, Sparkles, ArrowRight, Hammer, Ruler, CheckCircle2, PhoneCall, Award } from 'lucide-react'

export function HomeView({ setSeccionActiva }) {
  const features = [
    {
      icon: <Hammer size={24} />,
      title: 'Forja & Precisión',
      desc: 'Combinamos técnicas tradicionales de forja en yunque con corte moderno y ensamble milimétrico.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Acero de 1ra Calidad',
      desc: 'Utilizamos perfiles estructurales pesados, chapas gruesas y tratamientos antióxido de alta resistencia.'
    },
    {
      icon: <Ruler size={24} />,
      title: 'Trabajos 100% a Medida',
      desc: 'Adaptamos cada diseño a las dimensiones exactas y necesidades estéticas de tu hogar, local o empresa.'
    },
    {
      icon: <Award size={24} />,
      title: 'Garantía Estructural',
      desc: 'Respaldamos la solidez de nuestras soldaduras y estructuras con 5 años de garantía escrita.'
    }
  ]

  const highlights = [
    {
      title: 'Portones Corredizos y Automatizados',
      category: 'Herrería de Obra',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      desc: 'Seguridad robusta con terminaciones de diseño contemporáneo y guías reforzadas.'
    },
    {
      title: 'Mobiliario Industrial de Alto Nivel',
      category: 'Diseño en Hierro & Madera',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      desc: 'Mesas, barras y estanterías con maderas nobles seleccionadas y perfiles de hierro pulido.'
    },
    {
      title: 'Parrillas, Chulengos y Fogoneros',
      category: 'Cocina a las Brasas',
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      desc: 'Equipamiento de alto rendimiento con chapa gruesa, tejuelas refractarias y enlozado.'
    }
  ]

  const steps = [
    { step: '01', title: 'Idea & Medición', desc: 'Revisamos tu plano, medidas o te asesoramos en obra para definir el proyecto ideal.' },
    { step: '02', title: 'Corte & Forja', desc: 'Trabajamos el acero en nuestro taller con soldadura MIG y forja al calor del fuego.' },
    { step: '03', title: 'Pintura & Tratamiento', desc: 'Aplicamos fondo fosfatizante y acabado en laca o esmalte epoxi horneado.' },
    { step: '04', title: 'Instalación en Obra', desc: 'Montaje profesional en destino garantizando nivelación, anclaje y funcionamiento.' }
  ]

  return (
    <div className="home-view">
      {/* 1. Hero Banner Principal */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-pill">
              <Sparkles size={16} />
              <span>Taller de Herrería Profesional</span>
            </div>

            <h1 className="hero-title">
              La nobleza del <span className="highlight">acero forjado</span> y la precisión industrial.
            </h1>

            <p className="hero-desc">
              En <strong>Herrería Crisol</strong> transformamos perfiles y barras metálicas en portones de seguridad, mobiliario industrial de diseño, parrillas de alto rendimiento y cerramientos a medida para toda la vida.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setSeccionActiva('tienda')}>
                <span>Explorar Tienda Virtual</span>
                <ArrowRight size={18} />
              </button>

              <button className="btn-secondary" onClick={() => setSeccionActiva('servicios')}>
                <span>Pedir Presupuesto de Obra</span>
              </button>
            </div>

            <div className="hero-badges-row">
              <div className="hero-stat">
                <span className="hero-stat-num">+15</span>
                <span className="hero-stat-lbl">Años de Oficio</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">+1.200</span>
                <span className="hero-stat-lbl">Obras Fabricadas</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">100<span>%</span></span>
                <span className="hero-stat-lbl">Acero Macizo</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-card-main">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                alt="Herrero trabajando el metal en Herrería Crisol"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' }}
              />
              <div className="hero-floating-badge">
                <Flame size={16} color="var(--color-fire-glow)" />
                <span>Forja Artesanal & Soldadura MIG</span>
              </div>
              <div className="hero-card-overlay">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Calidad que trasciende generaciones
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                  Desde piezas decorativas finas hasta estructuras pesadas de soporte y seguridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tira de Características */}
      <section className="features-strip">
        <div className="container features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-box">
              <div className="feature-icon-wrap">{f.icon}</div>
              <div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Showcase de Trabajos Insignia */}
      <section className="section-padding">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Nuestras Creaciones</span>
            <h2 className="section-title">Especialidades del Taller</h2>
            <p className="section-subtitle">
              Cada proyecto es único. Diseñamos y producimos soluciones metálicas que combinan estética, durabilidad y funcionalidad máxima.
            </p>
          </div>

          <div className="products-grid" style={{ marginBottom: '3rem' }}>
            {highlights.map((h, i) => (
              <div key={i} className="product-card">
                <div className="product-thumb-wrap" style={{ height: '240px' }}>
                  <img src={h.img} alt={h.title} />
                  <span className="product-tag-cat">{h.category}</span>
                </div>
                <div className="product-info-wrap">
                  <h3 className="product-title">{h.title}</h3>
                  <p className="product-desc">{h.desc}</p>
                  <button
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: 'auto', padding: '0.65rem' }}
                    onClick={() => setSeccionActiva('tienda')}
                  >
                    <span>Ver en el Catálogo</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-primary" onClick={() => setSeccionActiva('tienda')}>
              <span>Ver Todo el Catálogo con Precios</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Proceso de Trabajo */}
      <section className="section-padding" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Método & Oficio</span>
            <h2 className="section-title">¿Cómo Trabajamos en Herrería Crisol?</h2>
            <p className="section-subtitle">
              Un proceso riguroso y transparente desde el primer boceto hasta el montaje en obra.
            </p>
          </div>

          <div className="features-grid">
            {steps.map((s, i) => (
              <div key={i} className="value-card" style={{ background: 'var(--color-bg)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-fire)', opacity: 0.8, display: 'block', lineHeight: 1, marginBottom: '0.75rem' }}>
                  {s.step}
                </span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

