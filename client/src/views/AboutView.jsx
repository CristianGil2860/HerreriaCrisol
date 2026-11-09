import { Flame, Shield, Wrench, CheckCircle, ArrowRight } from 'lucide-react'

export function AboutView({ setSeccionActiva }) {
  const values = [
    {
      title: 'Nobleza en los Materiales',
      desc: 'No escatimamos en calibres ni espesores. Utilizamos caños de pared gruesa, perfiles macizos y chapas de primera fundición para asegurar obras inalterables con el paso del tiempo.'
    },
    {
      title: 'Fusión de Tradición e Innovación',
      desc: 'Honramos el arte de la forja a fuego y yunque, integrándolo con tecnología contemporánea como corte computarizado por plasma, soldadura MIG de atmósfera inerte y pintura electrostática.'
    },
    {
      title: 'Compromiso & Puntualidad',
      desc: 'Entendemos el valor del tiempo en una obra o remodelación. Planificamos cada etapa con precisión para cumplir estrictamente con los plazos de entrega pactados.'
    },
    {
      title: 'Terminaciones Artesanales',
      desc: 'Cada cordón de soldadura es pulido a mano. Aplicamos fondos fosfatizantes y pinturas con filtro UV que protegen el hierro contra la corrosión y el clima extremo.'
    }
  ]

  const gallery = [
    {
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      caption: 'Soldadura de precisión MIG en marcos estructurales'
    },
    {
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      caption: 'Ensamble de mesas de hierro con madera maciza'
    },
    {
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      caption: 'Ajuste de portones corredizos y recibidores'
    }
  ]

  return (
    <div className="about-view">
      {/* 1. Encabezado de la Sección */}
      <section className="about-hero">
        <div className="container">
          <span className="section-tag">Sección 2 • Institucional</span>
          <h1 className="section-title" style={{ fontSize: '2.8rem' }}>
            Nuestro Taller, Pasión y Oficio
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '720px' }}>
            En Herrería Crisol entendemos el metal no como un material frío, sino como un elemento vivo capaz de brindar seguridad, cobijo y belleza eterna.
          </p>
        </div>
      </section>

      {/* 2. Historia & Filosofía */}
      <section className="section-padding">
        <div className="container about-split">
          <div className="about-narrative">
            <span className="hero-pill" style={{ marginBottom: '1rem' }}>
              <Flame size={15} />
              <span>La Historia del Crisol</span>
            </span>
            <h2>El fuego que forja nuestra identidad</h2>
            <p>
              El <strong>crisol</strong> es el recipiente refractario donde los metales se funden a temperaturas extremas para purificarse y amalgamarse. Elegimos este nombre porque simboliza nuestra vocación: tomar el acero en bruto, someterlo a la técnica y transformarlo en creaciones resistentes y llenas de carácter.
            </p>
            <p>
              Iniciamos nuestro camino hace más de 15 años como un modesto taller de forja artesanal de barrio. Con esfuerzo continuo, inversión en maquinaria industrial y la confianza de cientos de familias, arquitectos y constructoras, hoy contamos con una planta de fabricación equipada para resolver desde la reja más detallada hasta complejas naves y portones automatizados.
            </p>
            <p>
              Nuestra mayor satisfacción es saber que cada trabajo que sale del taller de Crisol está pensado para durar décadas sin deformaciones ni fallas estructurales.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <button className="btn-primary" onClick={() => setSeccionActiva('servicios')}>
                <span>Conocer Servicios de Herrería</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div>
            <div className="hero-card-main" style={{ maxHeight: '480px' }}>
              <img
                src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1000&q=80"
                alt="Maestro herrero trabajando en el taller"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' }}
              />
              <div className="hero-card-overlay">
                <span style={{ color: 'var(--color-fire-glow)', fontWeight: 700, fontSize: '0.88rem' }}>
                  Maestros Herreros & Metalúrgicos
                </span>
                <p style={{ color: 'white', fontSize: '1.05rem', fontWeight: 600 }}>
                  Compromiso absoluto en cada unión, bisagra y remache.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Valores Fundamentales */}
      <section className="section-padding" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Nuestros Pilares</span>
            <h2 className="section-title">¿Por Qué Confiar en Herrería Crisol?</h2>
            <p className="section-subtitle">
              Trabajamos con estándares industriales exigentes sin perder la calidez del trato personalizado.
            </p>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Galería del Taller */}
          <div className="workshop-gallery">
            {gallery.map((g, i) => (
              <div key={i} className="gallery-item">
                <img src={g.img} alt={g.caption} />
                <div className="gallery-caption">{g.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

