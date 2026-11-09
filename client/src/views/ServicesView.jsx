import { useState } from 'react'
import { ShieldCheck, DoorClosed, Home, Sofa, Flame, Send, MessageCircle, CheckCircle2, Clock, Phone } from 'lucide-react'
import { api } from '../services/api'

export function ServicesView({ onNotify }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipo_trabajo: 'Portón Corredizo / Automatizado',
    mensaje: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const servicios = [
    {
      icon: <DoorClosed size={28} />,
      title: 'Portones & Puertas de Seguridad',
      desc: 'Fabricación a medida de portones corredizos, levadizos contrapesados y batientes. Preparados para automatización de alta velocidad con cerraduras de máxima seguridad.',
      items: ['Chapa plegada calibre 16 y 18', 'Guías con ruedas a rulemán blindado', 'Acabado en esmalte sintético o epoxi', 'Diseños ciegos o con ventilación']
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Rejas & Cerramientos Perimetrales',
      desc: 'Protección para tu hogar o empresa con diseños modernos horizontales, verticales o artísticos que no sacrifican la estética de la fachada.',
      items: ['Varillas de hierro macizo 1/2" y 5/8"', 'Marcos tubulares reforzados', 'Cercos para piletas y jardines', 'Barandas de escalera y balcones']
    },
    {
      icon: <Home size={28} />,
      title: 'Pérgolas & Estructuras Metálicas',
      desc: 'Techos para galerías, cocheras y entrepisos comerciales con caños estructurales de gran porte calculados para resistir cargas de viento y peso.',
      items: ['Tubos estructurales 80x80 a 140x140mm', 'Aptas para chapa, vidrio o policarbonato', 'Aleros de acceso suspendidos', 'Entrepisos y escaleras caracol']
    },
    {
      icon: <Sofa size={28} />,
      title: 'Mobiliario Industrial a Medida',
      desc: 'Línea de diseño que conjuga perfiles de hierro estructural con maderas macizas nobles (roble, petiribí, guayubira o paraíso) para hogares y locales.',
      items: ['Mesas de comedor y escritorios', 'Estanterías modulares tipo loft', 'Barras y banquetas para gastronomía', 'Vitrinas y mostradores de recepción']
    },
    {
      icon: <Flame size={28} />,
      title: 'Parrillas, Chulengos & Fogoneros',
      desc: 'El sueño del asador. Emparrillados con módulos desmontables en ángulo V o varilla redonda, grasero frontal y sistemas de elevación por manivela.',
      items: ['Tambores con tejuelas refractarias', 'Fogoneros desmontables para exterior', 'Cruces para asador al piso', 'Tapas con pirómetro y chimenea']
    }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre || !formData.telefono || !formData.mensaje) {
      onNotify('Por favor completa nombre, teléfono y descripción del trabajo.', 'error')
      return
    }

    setSubmitting(true)
    try {
      await api.createInquiry(formData)
      setSubmitted(true)
      onNotify('¡Consulta enviada al taller de Herrería Crisol con éxito!', 'success')
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        tipo_trabajo: 'Portón Corredizo / Automatizado',
        mensaje: ''
      })
    } catch (error) {
      console.error(error)
      onNotify('No se pudo enviar la consulta. Verifica la conexión con el servidor MySQL.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWhatsAppDirect = () => {
    const text = `Hola Herrería Crisol! Mi nombre es ${formData.nombre || 'un cliente'}. Me gustaría pedir presupuesto para: ${formData.tipo_trabajo}. Detalle: ${formData.mensaje || 'Quisiera consultar medidas y precios'}`
    window.open(`https://wa.me/5491123456789?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="services-view">
      {/* 1. Header de la Sección */}
      <section className="about-hero">
        <div className="container">
          <span className="section-tag">Sección 3 • Institucional</span>
          <h1 className="section-title" style={{ fontSize: '2.8rem' }}>
            Servicios de Herrería & Presupuestos
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '720px' }}>
            Brindamos soluciones integrales de herrería pesada, liviana y artística para particulares, estudios de arquitectura y constructoras.
          </p>
        </div>
      </section>

      {/* 2. Lista de Servicios */}
      <section className="section-padding">
        <div className="container">
          <div className="services-grid">
            {servicios.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-card-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="service-list">
                  {s.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Formulario de Cotización Institucional (Conectado a MySQL) */}
          <div className="quote-box" id="formulario-cotizacion">
            <div className="quote-header">
              <span className="section-tag">Asesoramiento Sin Cargo</span>
              <h3>Solicitá tu Presupuesto a Medida</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Completá los datos y te responderemos con una cotización estimada y planos de viabilidad técnica.
              </p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={54} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>¡Consulta Registrada Correctamente!</h4>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                  Tu solicitud ha sido guardada en nuestra base de datos. Nos pondremos en contacto contigo a la brevedad.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={() => setSubmitted(false)}>
                    Enviar otra consulta
                  </button>
                  <button className="btn-wsp-prod" onClick={handleWhatsAppDirect}>
                    <MessageCircle size={18} />
                    <span>Avisar al Taller por WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="quote-form-grid">
                  <div className="form-group">
                    <label>Nombre y Apellido *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="Ej: Marcelo Gómez"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono / WhatsApp de Contacto *</label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control"
                      placeholder="Ej: +54 9 11 4455-6677"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Correo Electrónico (Opcional)</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tipo de Proyecto o Trabajo *</label>
                    <select
                      name="tipo_trabajo"
                      className="form-control"
                      value={formData.tipo_trabajo}
                      onChange={handleChange}
                    >
                      <option value="Portón Corredizo / Automatizado">Portón Corredizo / Automatizado</option>
                      <option value="Rejas de Seguridad y Cerramientos">Rejas de Seguridad y Cerramientos</option>
                      <option value="Pérgola o Techo Estructural">Pérgola o Techo Estructural</option>
                      <option value="Mobiliario Industrial a Medida">Mobiliario Industrial a Medida</option>
                      <option value="Parrilla, Fogonero o Asador">Parrilla, Fogonero o Asador</option>
                      <option value="Escalera / Baranda Metálica">Escalera / Baranda Metálica</option>
                      <option value="Otro Trabajo Especial">Otro Trabajo Especial</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label>Detalle del Trabajo o Medidas Aproximadas *</label>
                    <textarea
                      name="mensaje"
                      rows={4}
                      className="form-control"
                      placeholder="Contanos las medidas aproximadas (ancho, alto), si es para interior o exterior, y cualquier detalle relevante para armar tu presupuesto..."
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{ opacity: submitting ? 0.7 : 1 }}
                  >
                    <Send size={18} />
                    <span>{submitting ? 'Enviando...' : 'Enviar Solicitud de Presupuesto'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-wsp-prod"
                    onClick={handleWhatsAppDirect}
                  >
                    <MessageCircle size={18} />
                    <span>Consultar Directo por WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

