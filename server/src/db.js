import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'herreria_crisol',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export async function initDatabase() {
  try {
    // 1. Asegurar que la base de datos exista
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 3306
    })

    const dbName = process.env.DB_NAME || 'herreria_crisol'
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    await rootConnection.end()

    // 2. Crear tabla de categorías
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL,
        descripcion TEXT,
        icono VARCHAR(50) DEFAULT 'wrench'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 3. Crear tabla de productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT NOT NULL,
        precio DECIMAL(12, 2) NOT NULL,
        categoria_id INT,
        imagen_url TEXT NOT NULL,
        destacado TINYINT(1) DEFAULT 0,
        disponible TINYINT(1) DEFAULT 1,
        materiales VARCHAR(255),
        dimensiones VARCHAR(150),
        tiempo_fabricacion VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 4. Crear tabla de consultas institucionales / presupuestos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        telefono VARCHAR(50) NOT NULL,
        email VARCHAR(150),
        tipo_trabajo VARCHAR(100) NOT NULL,
        mensaje TEXT NOT NULL,
        producto_id INT NULL,
        estado ENUM('pendiente', 'contactado', 'presupuestado', 'finalizado') DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 5. Verificar si hay categorías precargadas
    const [catRows] = await pool.query('SELECT COUNT(*) as count FROM categorias')
    if (catRows[0].count === 0) {
      console.log('🌱 Inicializando categorías por defecto en Herrería Crisol...')
      await pool.query(`
        INSERT INTO categorias (nombre, slug, descripcion, icono) VALUES
        ('Mobiliario Industrial', 'mobiliario-industrial', 'Mesas, estanterías y sillas combinando hierro y maderas nobles.', 'sofa'),
        ('Parrillas y Asadores', 'parrillas-asadores', 'Parrillas rodantes, chulengos y fogoneros para los amantes del fuego.', 'flame'),
        ('Portones y Puertas', 'portones-puertas', 'Portones corredizos, batientes y puertas de seguridad de máxima durabilidad.', 'door-closed'),
        ('Rejas y Cerramientos', 'rejas-cerramientos', 'Protección perimetral con diseños modernos y herrería artística.', 'shield'),
        ('Pérgolas y Estructuras', 'pergolas-estructuras', 'Estructuras metálicas de gran porte, techos, galerías y aleros.', 'home');
      `)
    }

    // 6. Verificar si hay productos precargados
    const [prodRows] = await pool.query('SELECT COUNT(*) as count FROM productos')
    if (prodRows[0].count === 0) {
      console.log('🌱 Inicializando catálogo de productos de Herrería Crisol...')
      const initialProducts = [
        [
          'Mesa Comedor Industrial "Crisol Roble"',
          'Mesa de diseño robusto con caño estructural de 70x30 pulido y protegido con laca poliuretánica mate. Tapa de madera maciza de eucalipto alistonado de 2 pulgadas tratada para alto tránsito.',
          220000.00,
          1,
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=900&q=80',
          1,
          1,
          'Caño estructural 70x30mm, madera maciza 2"',
          '200 x 90 x 78 cm',
          '7 a 10 días hábiles'
        ],
        [
          'Parrilla Chulengo Móvil con Fogonero',
          'Tambor reforzado con tejuelas refractarias en la base. Emparrillado en ángulo V enlozado desmontable con grasero frontal y tabla lateral de madera dura para apoyo.',
          165000.00,
          2,
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
          1,
          1,
          'Chapa reforzada 1.6mm, tejuelas refractarias, enlozado',
          '130 x 60 x 115 cm',
          'En stock / 48 hs'
        ],
        [
          'Portón Corredizo Automatizable "Líneas Plegadas"',
          'Portón corredizo moderno construido en chapa plegada calibre 18 y marco perimetral en tubo 80x40. Incluye guía inferior galvanizada, ruedas con rulemán blindado y recibidor.',
          480000.00,
          3,
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
          1,
          1,
          'Chapa BWG 18, caño 80x40mm, ruedas blindadas',
          '300 x 205 cm',
          '15 a 20 días hábiles'
        ],
        [
          'Fogonero Brasero Octogonal con Estaca y Parrilla',
          'Fogonero de chapa de 3.2mm de espesor con aro superior contenedor, media parrilla desmontable y soporte de cruz regulable para asado criollo.',
          95000.00,
          2,
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
          1,
          1,
          'Chapa acero al carbono 3.2mm, pintura alta temperatura',
          'Diámetro 85 cm, alto 45 cm',
          'Entrega inmediata'
        ],
        [
          'Set x4 Banquetas Altas Estilo Fábrica',
          'Banquetas para barra o desayunador. Estructura de hierro macizo torsionado con respaldo ergonómico y asiento de petiribí lustrado.',
          115000.00,
          1,
          'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80',
          0,
          1,
          'Varilla de hierro macizo 12mm, madera petiribí',
          '35 x 35 x 75 cm de asiento',
          '5 a 7 días hábiles'
        ],
        [
          'Reja de Seguridad Paneles Horizontales',
          'Reja perimetral y para aberturas con caños rectangulares horizontales de separación calculada para máxima seguridad sin perder visión estética ni iluminación.',
          130000.00,
          4,
          'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=900&q=80',
          0,
          1,
          'Tubo estructural 40x20mm, planchuela 1 1/4"',
          '150 x 110 cm (a medida)',
          '7 a 10 días hábiles'
        ],
        [
          'Pérgola Metálica Exterior Minimalista',
          'Estructura para galería o cochera con columnas 100x100mm, vigas reticuladas y tirantes con pendiente oculta. Apta para chapa traslúcida o deck.',
          620000.00,
          5,
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
          1,
          1,
          'Tubos 100x100mm y perfiles C de chapa galvanizada',
          '500 x 350 x 280 cm',
          '20 días hábiles'
        ],
        [
          'Estantería Tipo Biblioteca "Crisol Brooklyn"',
          'Mueble modular para living, oficina o taller. 5 estantes de pino finger joint tratado al tono nogal sobre estructura de hierro ángulo y refuerzo posterior en cruz.',
          175000.00,
          1,
          'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80',
          0,
          1,
          'Hierro ángulo 1", madera alistonada 20mm',
          '190 x 90 x 35 cm',
          '7 días hábiles'
        ]
      ]

      for (const prod of initialProducts) {
        await pool.query(
          `INSERT INTO productos 
           (nombre, descripcion, precio, categoria_id, imagen_url, destacado, disponible, materiales, dimensiones, tiempo_fabricacion)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          prod
        )
      }
      console.log('✅ Catálogo inicial cargado exitosamente.')
    }

    console.log('⚡ Conexión y tablas de MySQL configuradas correctamente para Herrería Crisol.')
  } catch (error) {
    console.error('❌ Error inicializando la base de datos MySQL:', error.message)
    console.error('Verifique que el servicio MySQL (ej: XAMPP) esté activo.')
  }
}

