/**
 * Servicio de comunicación con la API REST de Herrería Crisol
 * Backend: Node.js + Express + MySQL en http://localhost:3001
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.port === '3001' ? '/api' : 'http://localhost:3001/api')

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Si enviamos FormData (para subida de imágenes), eliminamos Content-Type para que el navegador configure el boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type']
  }

  try {
    const res = await fetch(url, config)
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || `Error del servidor HTTP ${res.status}`)
    }
    return json
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error)
    throw error
  }
}

export const api = {
  // --- PRODUCTOS ---
  async getProducts(params = {}) {
    const query = new URLSearchParams()
    if (params.categoria && params.categoria !== 'todas') query.append('categoria', params.categoria)
    if (params.search) query.append('search', params.search)
    if (params.destacado) query.append('destacado', params.destacado)
    if (params.disponible !== undefined) query.append('disponible', params.disponible)
    if (params.sort) query.append('sort', params.sort)

    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/products${qs}`)
  },

  async getProductById(id) {
    return request(`/products/${id}`)
  },

  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  async updateProduct(id, productData) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  async toggleProductAvailability(id) {
    return request(`/products/${id}/toggle-disponible`, {
      method: 'PATCH',
    })
  },

  async deleteProduct(id) {
    return request(`/products/${id}`, {
      method: 'DELETE',
    })
  },

  // --- CATEGORÍAS ---
  async getCategories() {
    return request('/categories')
  },

  // --- CONSULTAS / PRESUPUESTOS (Sitio Institucional) ---
  async getInquiries() {
    return request('/inquiries')
  },

  async createInquiry(inquiryData) {
    return request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    })
  },

  async updateInquiryStatus(id, status) {
    return request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: status }),
    })
  },

  // --- ESTADÍSTICAS DEL PANEL ---
  async getStats() {
    return request('/stats')
  },

  // --- SUBIDA DE IMAGEN ---
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('imagen', file)
    return request('/upload', {
      method: 'POST',
      body: formData,
    })
  },

  // --- CHEQUEO DE ESTADO ---
  async checkHealth() {
    return request('/health')
  }
}

