# 🔨 Herrería Crisol — Sitio Web Institucional & Tienda Virtual

Plataforma web full-stack para **Herrería Crisol**, taller de forja artesanal, herrería de obra y diseño industrial de estructuras metálicas.

---

## 🚀 Arquitectura y Tecnologías

* **Frontend:**
  * **React 19** con **JavaScript (JSX)** y **Vite 6**.
  * **Lucide React** para iconografía industrial moderna.
  * Estilizado con **CSS Variables** modularizado en `App.css` e `index.css` (diseño oscuro con tonos fuego, acero y bronce).
* **Backend:**
  * **Node.js** con **Express 4**.
  * **MySQL** (conectado a base de datos `herreria_crisol` vía `mysql2/promise`).
  * **Multer** para subida y procesamiento de imágenes locales en `/server/uploads`.
  * **CORS** y **Dotenv** para configuración por entorno.
* **API REST:**
  * `/api/products` (Listado con filtros, detalle, creación, edición, borrado y alternar disponibilidad).
  * `/api/categories` (Categorías con conteo de productos).
  * `/api/inquiries` (Recepción de consultas y presupuestos de obra).
  * `/api/upload` (Carga de fotos de productos).
  * `/api/stats` (Métricas en tiempo real para el panel de administración).
  * `/api/health` (Chequeo de estado de la API y conexión con MySQL).

---

## 🧭 Secciones de la Aplicación

### 1. Sitio Web Institucional (3 Secciones)
1. **🏠 Inicio (Hero & Presentación):** 
   - Banner visual con identidad de marca, métricas del taller (+15 años de oficio, +1.200 obras), especialidades insignia y método de fabricación paso a paso.
2. **⚒️ Nuestro Taller & Oficio (Nosotros):**
   - La historia del Crisol (el arte del fuego y el yunque), pilares de calidad (acero de primera calidad, soldadura MIG de precisión, tratamientos anticorrosión) y galería del taller.
3. **🏗️ Servicios de Herrería & Cotizaciones (Servicios):**
   - Catálogo de servicios de obra (portones automatizados, rejas de seguridad, pérgolas, entrepisos, mobiliario y parrillas).
   - **Formulario interactivo de solicitud de presupuesto:** Guarda la consulta directamente en la tabla `consultas` de MySQL y ofrece redirigir el mensaje preparado a WhatsApp.

### 2. 🛒 Tienda Virtual (Catálogo con Precios)
- Catálogo interactivo con buscador por texto, filtro de categorías dinámico y ordenamiento por precio o destacados.
- Ficha técnica completa de cada producto (materiales, dimensiones, tiempo de entrega).
- **Sin pasarelas de pago:** Los clientes pueden:
  - Presionar **"Pedir por WhatsApp"** para abrir un chat directo con el taller con el producto y precio precargado.
  - Usar el botón **"Cotizador"** para armar un pedido con múltiples productos y enviarlo consolidado al taller.

### 3. ⚙️ Panel de Control (Admin)
- Resumen en tiempo real (KPIs de productos totales, activos, categorías y consultas recibidas).
- **Publicación de productos:** Modal con nombre, precio en ARS, categoría, descripción, materiales, medidas y foto (mediante enlace o subida de archivo local al servidor con Multer).
- **Edición y borrado:** Con confirmación modal de seguridad.
- **Switch rápido de disponibilidad:** Pausar o activar productos al instante en MySQL.
- **Gestión de Consultas:** Bandeja de mensajes de clientes con cambio de estado (`pendiente`, `contactado`, `presupuestado`, `finalizado`) y botón directo para chatear por WhatsApp.

---

## ⚡ Cómo Iniciar el Proyecto

### 1. Requisitos Previos
Tener activo el servicio de MySQL (por ejemplo, desde **XAMPP Control Panel** o servicio local en el puerto 3306). La base de datos `herreria_crisol` y sus tablas se inicializan automáticamente al arrancar el backend con datos de ejemplo.

### 2. Iniciar el Backend (Node.js + MySQL)
Desde la raíz del proyecto:
```powershell
npm run server
```
*API activa en:* `http://localhost:3001`  
*Chequeo de salud:* `http://localhost:3001/api/health`

### 3. Iniciar el Frontend (React + Vite)
En otra terminal desde la raíz:
```powershell
npm run dev
```
*Sitio web disponible en:* `http://localhost:5173/`

---

## 🗄️ Estructura de la Base de Datos (`herreria_crisol`)

* **`categorias`**: `id`, `nombre`, `slug`, `descripcion`, `icono`
* **`productos`**: `id`, `nombre`, `descripcion`, `precio`, `categoria_id`, `imagen_url`, `destacado`, `disponible`, `materiales`, `dimensiones`, `tiempo_fabricacion`
* **`consultas`**: `id`, `nombre`, `telefono`, `email`, `tipo_trabajo`, `mensaje`, `producto_id`, `estado`, `created_at`
