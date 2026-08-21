import bcrypt from 'bcryptjs';
import { getConnection, sql } from '../config/db.js';

const INITIAL_CATEGORIES = [
  {
    id: "estandar",
    name: "Estándar",
    description: "Habitaciones individuales y dobles con todas las comodidades esenciales de LuxSur.",
    orderIndex: 0,
    isActive: 1
  },
  {
    id: "suites",
    name: "Suites",
    description: "Suites de alto confort, decoración boutique y ambientes espaciosos.",
    orderIndex: 1,
    isActive: 1
  },
  {
    id: "familiar",
    name: "Familiar",
    description: "Alojamiento con camas múltiples ideal para grupos familiares y estadías compartidas.",
    orderIndex: 2,
    isActive: 1
  },
  {
    id: "ejecutiva",
    name: "Ejecutiva",
    description: "Espacios de tranquilidad y conectividad diseñados para viajeros de negocios.",
    orderIndex: 3,
    isActive: 1
  },
  {
    id: "presidencial",
    name: "Presidencial",
    description: "La máxima experiencia de lujo y exclusividad de LuxSur Hotel Boutique.",
    orderIndex: 4,
    isActive: 1
  }
];

const INITIAL_ROOMS = [
  {
    id: "estandar-doble",
    name: "Standard Single",
    category: "Estándar",
    guests: 1,
    guestsLabel: "1 Persona",
    size: "32 m²",
    bed: "Cama Single (96.5 cm x 190.5 cm)",
    pricePYG: "235.000 Gs.",
    priceNumeric: 235000,
    showPrice: 1,
    badge: "Sólo queda 1",
    badgeType: "urgent",
    description: "Elegante departamento equipado con acabados boutique, zona de lectura, escritorio ejecutivo, Smart TV y baño privado con ducha.",
    image: "/images/stardardSingle/camaVentana.JPG",
    gallery: JSON.stringify([
      "/images/stardardSingle/banio.JPG",
      "/images/stardardSingle/otroAngulo.JPG"
    ]),
    features: JSON.stringify([
      "Wi-Fi Gratis de alta velocidad 5G",
      "Aire Acondicionado & Calefacción",
      "Cama Single (96.5 cm x 190.5 cm)",
      "TV LED Smart con Cable",
      "Desayuno Buffet Gourmet Incluido",
      "Escritorio Ejecutivo y Sillón",
      "Secador de Pelo y Kits de Baño"
    ]),
    customBookingUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
    orderIndex: 0,
    isActive: 1
  },
  {
    id: "suite-deluxe",
    name: "Suite Deluxe",
    category: "Suites",
    guests: 4,
    guestsLabel: "4 Personas",
    size: "20 m²",
    bed: "Cama Full/Double (134.5 cm x 190.5 cm)",
    pricePYG: "616.000 Gs.",
    priceNumeric: 616000,
    showPrice: 1,
    badge: "Más Popular",
    badgeType: "popular",
    description: "Espaciosa Suite de máximo confort dotada de A.A., calefacción, escritorio, armario, Wi-Fi gratis y TV. Confort exclusivo preparado para hasta 4 huéspedes.",
    image: "/images/suiteDeluxe/suiteCama.jpeg",
    gallery: JSON.stringify([
      "/images/suiteDeluxe/banio.jpeg",
      "/images/suiteDeluxe/balcon.jpeg"
    ]),
    features: JSON.stringify([
      "Capacidad para hasta 4 huéspedes",
      "Aire Acondicionado & Calefacción Central",
      "Escritorio Ejecutivo & Armario Espacioso",
      "Wi-Fi Gratis 5G en toda la suite",
      "Cama Full/Double (134.5 cm x 190.5 cm)",
      "Smart TV Premium",
      "Desayuno Buffet Gourmet Incluido",
      "Servicio de Habitación Preferencial"
    ]),
    customBookingUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
    orderIndex: 1,
    isActive: 1
  },
  {
    id: "familiar",
    name: "Habitación Familiar",
    category: "Familiar",
    guests: 4,
    guestsLabel: "4 Personas",
    size: "45 m²",
    bed: "2 Camas Matrimoniales / Queen",
    pricePYG: "616.000 Gs.",
    priceNumeric: 616000,
    showPrice: 1,
    badge: "Ideal para Familias",
    badgeType: "family",
    description: "Alojamiento amplio y acogedor con la versatilidad ideal para grupos familiares que buscan combinar descanso, confort e independencia en Encarnación.",
    image: "/images/suiteCuadruple/camaVentana.jpg",
    gallery: JSON.stringify([
      "/images/suiteCuadruple/mesita.JPG",
      "/images/suiteCuadruple/otroAngulo.jpeg"
    ]),
    features: JSON.stringify([
      "Alojamiento amplio ideal para 4 personas",
      "Configuración modular de camas confortables",
      "Wi-Fi de Alta Velocidad sin costo",
      "Climatización individual Frío/Calor",
      "Smart TV 55\" con canales en HD",
      "Armario amplio y caja fuerte digital",
      "Baño amplio equipado con amenidades",
      "Desayuno Buffet servido en Rooftop"
    ]),
    customBookingUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
    orderIndex: 2,
    isActive: 1
  }
];

const INITIAL_SETTINGS = {
  id: "main",
  hotelName: "LuxSur Hotel Boutique",
  stars: 4,
  tagline: "El lujo del Sur en el corazón de Encarnación, Paraguay.",
  address: "Encarnación, Itapúa - Paraguay",
  phone: "+595 986 495 500",
  whatsappRaw: "595986495500",
  whatsappMessage: "Hola LuxSur Hotel Boutique, deseo consultar disponibilidad de habitaciones.",
  email: "reservas@luxsurhotel.com.py",
  cloudbedsUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
  mapsUrl: "https://maps.google.com/?q=Encarnacion+Paraguay+LuxSur+Hotel",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14167.337834524451!2d-55.8752216!3d-27.3371904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94579549f3c7b741%3A0x7d01869e5d429a3!2sEncarnaci%C3%B3n%2C%20Paraguay!5e0!3m2!1ses!2s!4v1700000000000!5m2!1ses!2s",
  announcementBanner: "¡Bienvenidos a LuxSur Hotel Boutique! Tarifas especiales en reservas directas.",
  isBannerActive: 0
};

const INITIAL_EXPERIENCES = [
  {
    id: "celebraciones",
    title: "Celebraciones Familiares",
    subtitle: "Inolvidable",
    description: "Haz de tus bodas, aniversarios, graduaciones o cumpleaños una fiesta memorable con salones privados, gastronomía a medida y servicio 4 estrellas.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
    tag: "Eventos & Festejos",
    orderIndex: 0,
    isActive: 1
  },
  {
    id: "vacaciones",
    title: "Vacaciones Soñadas",
    subtitle: "Relax & Paraná",
    description: "Disfruta de la vibrante Encarnación, a solo 3 minutos de la afamada Costanera San José, sintiendo la brisa del río Paraná con todo el confort de LuxSur.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    tag: "Turismo & Relax",
    orderIndex: 1,
    isActive: 1
  },
  {
    id: "luna-de-miel",
    title: "Luna de Miel & Romántico",
    subtitle: "Experiencia VIP",
    description: "Servicio romántico especial con ambiente personalizado, pétalos de rosa, espumante helado en la suite, chocolates artesanales y late check-out.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    tag: "Parejas VIP",
    orderIndex: 2,
    isActive: 1
  },
  {
    id: "tematicas",
    title: "Habitaciones Temáticas",
    subtitle: "Estilo Único",
    description: "Espacios diseñados artísticamente con detalles temáticos únicos que transforman una estadía común en un viaje sensorial inolvidable.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    tag: "Diseño Exclusivo",
    orderIndex: 3,
    isActive: 1
  }
];

const INITIAL_SERVICES = [
  {
    id: "wifi",
    icon: "Wifi",
    title: "Wi-Fi Gratuito 5G",
    description: "Conexión de ultra alta velocidad e ilimitada en todas las habitaciones, salones y terraza del hotel.",
    orderIndex: 0,
    isActive: 1
  },
  {
    id: "desayuno",
    icon: "Coffee",
    title: "Desayuno Buffet Gourmet",
    description: "Variedad de repostería típica paraguaya, frutas de estación, jugos naturales y café de especialidad.",
    orderIndex: 1,
    isActive: 1
  },
  {
    id: "restaurant",
    icon: "UtensilsCrossed",
    title: "Restaurant & Bar Rooftop",
    description: "Gastronomía internacional y coctelería de autor con vista panorámica deslumbrante de Encarnación.",
    orderIndex: 2,
    isActive: 1
  },
  {
    id: "estacionamiento",
    icon: "Car",
    title: "Estacionamiento Privado",
    description: "Estacionamiento privado dentro del recinto con monitoreo y seguridad las 24 horas.",
    orderIndex: 3,
    isActive: 1
  },
  {
    id: "climatizacion",
    icon: "AirVent",
    title: "Climatización Inteligente",
    description: "Sistemas de Aire Acondicionado y Calefacción regulables en cada ambiente para tu máximo confort.",
    orderIndex: 4,
    isActive: 1
  },
  {
    id: "roomservice",
    icon: "RoomService",
    title: "Servicio a la Habitación",
    description: "Atención personalizada 24/7 para disfrutar de bocados exquisitos y bebidas sin salir de tu suite.",
    orderIndex: 5,
    isActive: 1
  }
];

const INITIAL_ROOFTOP = {
  id: "rooftop",
  title: "Restaurant Panorámico & Rooftop Bar",
  subtitle: "Sabores exquisitos sobre los cielos de Encarnación",
  description: "Ubicado en la terraza de LuxSur Hotel Boutique, nuestro Restaurant Panorámico combina cortes carnes de primera calidad, pescados frescos de la cuenca del Paraná y una refinada carta de cócteles clásicos y contemporáneos.",
  hours: "Abierto diariamente: 07:00 hs - 23:30 hs",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  highlights: JSON.stringify([
    "Vista de 360° a la ciudad y alrededores",
    "Desayuno Buffet incluido para huéspedes",
    "Cenas románticas y reservas corporativas",
    "Carta de Vinos seleccionados por Sommelier"
  ])
};

const INITIAL_REVIEWS = [
  {
    name: "Carlos Eduardo M.",
    origin: "Asunción, Paraguay",
    rating: 5,
    stayDate: "Julio 2026",
    comment: "Excelente hotel 4 estrellas en Encarnación. Las habitaciones son súper confortables y el restaurant de la terraza tiene una vista alucinante.",
    isFeatured: 1,
    orderIndex: 0
  },
  {
    name: "Valeria G.",
    origin: "Buenos Aires, Argentina",
    rating: 5,
    stayDate: "Junio 2026",
    comment: "Atención impecable. La Suite Deluxe fue súper cómoda para mi familia. Queda a minutos de la Costanera. Sin duda volveremos.",
    isFeatured: 1,
    orderIndex: 1
  },
  {
    name: "Rodrigo Benítez",
    origin: "Ciudad del Este, Paraguay",
    rating: 5,
    stayDate: "Mayo 2026",
    comment: "El desayuno buffet es delicioso y variado. El Wi-Fi funciona rápido para trabajar y el proceso de reserva directa fue sumamente ágil.",
    isFeatured: 1,
    orderIndex: 2
  }
];

export async function initializeDatabase() {
  console.log('🔄 Iniciando verificación y creación de tablas en SQL Server (DB: luxsurHotel)...');
  const pool = await getConnection();

  // 0. Crear categorias_habitaciones
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[categorias_habitaciones]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[categorias_habitaciones] (
            [id] VARCHAR(100) NOT NULL PRIMARY KEY,
            [name] NVARCHAR(100) NOT NULL UNIQUE,
            [description] NVARCHAR(500) NULL,
            [orderIndex] INT NOT NULL DEFAULT 0,
            [isActive] BIT NOT NULL DEFAULT 1,
            [createdAt] DATETIME DEFAULT GETDATE(),
            [updatedAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla categorias_habitaciones creada.';
    END
  `);

  // 1. Crear habitaciones
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[habitaciones]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[habitaciones] (
            [id] VARCHAR(100) NOT NULL PRIMARY KEY,
            [name] NVARCHAR(150) NOT NULL,
            [category] NVARCHAR(100) NOT NULL,
            [guests] INT NOT NULL DEFAULT 1,
            [guestsLabel] NVARCHAR(100) NOT NULL,
            [size] NVARCHAR(50) NOT NULL,
            [bed] NVARCHAR(150) NOT NULL,
            [pricePYG] NVARCHAR(50) NULL,
            [priceNumeric] DECIMAL(18,2) NULL,
            [showPrice] BIT NOT NULL DEFAULT 1,
            [badge] NVARCHAR(100) NULL,
            [badgeType] VARCHAR(50) NULL,
            [description] NVARCHAR(MAX) NOT NULL,
            [image] NVARCHAR(500) NOT NULL,
            [gallery] NVARCHAR(MAX) NULL,
            [features] NVARCHAR(MAX) NULL,
            [customBookingUrl] NVARCHAR(500) NULL,
            [orderIndex] INT NOT NULL DEFAULT 0,
            [isActive] BIT NOT NULL DEFAULT 1,
            [createdAt] DATETIME DEFAULT GETDATE(),
            [updatedAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla habitaciones creada.';
    END
  `);

  // 2. Crear configuraciones
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[configuraciones]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[configuraciones] (
            [id] VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'main',
            [hotelName] NVARCHAR(150) NOT NULL,
            [stars] INT NOT NULL DEFAULT 4,
            [tagline] NVARCHAR(300) NOT NULL,
            [address] NVARCHAR(300) NOT NULL,
            [phone] NVARCHAR(100) NOT NULL,
            [whatsappRaw] NVARCHAR(50) NOT NULL,
            [whatsappMessage] NVARCHAR(300) NULL,
            [email] NVARCHAR(150) NOT NULL,
            [cloudbedsUrl] NVARCHAR(500) NOT NULL,
            [mapsUrl] NVARCHAR(500) NOT NULL,
            [googleMapsEmbed] NVARCHAR(MAX) NOT NULL,
            [announcementBanner] NVARCHAR(500) NULL,
            [isBannerActive] BIT NOT NULL DEFAULT 0,
            [updatedAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla configuraciones creada.';
    END
  `);

  // 3. Crear experiencias
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[experiencias]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[experiencias] (
            [id] VARCHAR(100) NOT NULL PRIMARY KEY,
            [title] NVARCHAR(150) NOT NULL,
            [subtitle] NVARCHAR(100) NOT NULL,
            [description] NVARCHAR(MAX) NOT NULL,
            [image] NVARCHAR(500) NOT NULL,
            [tag] NVARCHAR(100) NOT NULL,
            [orderIndex] INT NOT NULL DEFAULT 0,
            [isActive] BIT NOT NULL DEFAULT 1,
            [createdAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla experiencias creada.';
    END
  `);

  // 4. Crear servicios
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[servicios]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[servicios] (
            [id] VARCHAR(100) NOT NULL PRIMARY KEY,
            [icon] VARCHAR(50) NOT NULL,
            [title] NVARCHAR(150) NOT NULL,
            [description] NVARCHAR(MAX) NOT NULL,
            [orderIndex] INT NOT NULL DEFAULT 0,
            [isActive] BIT NOT NULL DEFAULT 1
        );
        PRINT 'Tabla servicios creada.';
    END
  `);

  // 5. Crear restaurante
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[restaurante]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[restaurante] (
            [id] VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'rooftop',
            [title] NVARCHAR(150) NOT NULL,
            [subtitle] NVARCHAR(150) NOT NULL,
            [description] NVARCHAR(MAX) NOT NULL,
            [hours] NVARCHAR(150) NOT NULL,
            [image] NVARCHAR(500) NOT NULL,
            [highlights] NVARCHAR(MAX) NULL,
            [updatedAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla restaurante creada.';
    END
  `);

  // 6. Crear resenas
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[resenas]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[resenas] (
            [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
            [name] NVARCHAR(150) NOT NULL,
            [origin] NVARCHAR(150) NOT NULL,
            [rating] INT NOT NULL DEFAULT 5,
            [stayDate] NVARCHAR(50) NOT NULL,
            [comment] NVARCHAR(MAX) NOT NULL,
            [isFeatured] BIT NOT NULL DEFAULT 1,
            [orderIndex] INT NOT NULL DEFAULT 0,
            [createdAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla resenas creada.';
    END
  `);

  // 7. Crear usuarios (si no existe)
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'[dbo].[usuarios]') AND OBJECTPROPERTY(id, N'IsUserTable') = 1)
    BEGIN
        CREATE TABLE [dbo].[usuarios] (
            [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
            [usuario] NVARCHAR(50) NOT NULL UNIQUE,
            [password] NVARCHAR(255) NOT NULL,
            [nombre] NVARCHAR(150) NOT NULL,
            [rol] NVARCHAR(50) NOT NULL DEFAULT 'admin',
            [activo] BIT NOT NULL DEFAULT 1,
            [createdAt] DATETIME DEFAULT GETDATE(),
            [updatedAt] DATETIME DEFAULT GETDATE()
        );
        PRINT 'Tabla usuarios creada.';
    END
  `);

  // SEED: Categorías de Habitaciones
  try {
    const catCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[categorias_habitaciones]');
    if (catCount.recordset[0].count === 0) {
      console.log('🌱 Insertando categorías de habitaciones iniciales...');
      for (const cat of INITIAL_CATEGORIES) {
        await pool.request()
          .input('id', sql.VarChar(100), cat.id)
          .input('name', sql.NVarChar(100), cat.name)
          .input('description', sql.NVarChar(500), cat.description)
          .input('orderIndex', sql.Int, cat.orderIndex)
          .input('isActive', sql.Bit, cat.isActive)
          .query(`
            INSERT INTO [dbo].[categorias_habitaciones] (id, name, description, orderIndex, isActive)
            VALUES (@id, @name, @description, @orderIndex, @isActive)
          `);
      }
    }
  } catch (err) {}

  // SEED: Habitaciones
  const roomsCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[habitaciones]');
  if (roomsCount.recordset[0].count === 0) {
    console.log('🌱 Insertando habitaciones iniciales...');
    for (const room of INITIAL_ROOMS) {
      await pool.request()
        .input('id', sql.VarChar(100), room.id)
        .input('name', sql.NVarChar(150), room.name)
        .input('category', sql.NVarChar(100), room.category)
        .input('guests', sql.Int, room.guests)
        .input('guestsLabel', sql.NVarChar(100), room.guestsLabel)
        .input('size', sql.NVarChar(50), room.size)
        .input('bed', sql.NVarChar(150), room.bed)
        .input('pricePYG', sql.NVarChar(50), room.pricePYG)
        .input('priceNumeric', sql.Decimal(18, 2), room.priceNumeric)
        .input('showPrice', sql.Bit, room.showPrice)
        .input('badge', sql.NVarChar(100), room.badge)
        .input('badgeType', sql.VarChar(50), room.badgeType)
        .input('description', sql.NVarChar(sql.MAX), room.description)
        .input('image', sql.NVarChar(500), room.image)
        .input('gallery', sql.NVarChar(sql.MAX), room.gallery)
        .input('features', sql.NVarChar(sql.MAX), room.features)
        .input('customBookingUrl', sql.NVarChar(500), room.customBookingUrl)
        .input('orderIndex', sql.Int, room.orderIndex)
        .input('isActive', sql.Bit, room.isActive)
        .query(`
          INSERT INTO [dbo].[habitaciones] (
            id, name, category, guests, guestsLabel, size, bed, pricePYG, priceNumeric,
            showPrice, badge, badgeType, description, image, gallery, features,
            customBookingUrl, orderIndex, isActive
          ) VALUES (
            @id, @name, @category, @guests, @guestsLabel, @size, @bed, @pricePYG, @priceNumeric,
            @showPrice, @badge, @badgeType, @description, @image, @gallery, @features,
            @customBookingUrl, @orderIndex, @isActive
          )
        `);
    }
  }

  // SEED: Configuraciones
  const settingsCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[configuraciones]');
  if (settingsCount.recordset[0].count === 0) {
    console.log('🌱 Insertando configuraciones iniciales...');
    await pool.request()
      .input('id', sql.VarChar(50), INITIAL_SETTINGS.id)
      .input('hotelName', sql.NVarChar(150), INITIAL_SETTINGS.hotelName)
      .input('stars', sql.Int, INITIAL_SETTINGS.stars)
      .input('tagline', sql.NVarChar(300), INITIAL_SETTINGS.tagline)
      .input('address', sql.NVarChar(300), INITIAL_SETTINGS.address)
      .input('phone', sql.NVarChar(100), INITIAL_SETTINGS.phone)
      .input('whatsappRaw', sql.NVarChar(50), INITIAL_SETTINGS.whatsappRaw)
      .input('whatsappMessage', sql.NVarChar(300), INITIAL_SETTINGS.whatsappMessage)
      .input('email', sql.NVarChar(150), INITIAL_SETTINGS.email)
      .input('cloudbedsUrl', sql.NVarChar(500), INITIAL_SETTINGS.cloudbedsUrl)
      .input('mapsUrl', sql.NVarChar(500), INITIAL_SETTINGS.mapsUrl)
      .input('googleMapsEmbed', sql.NVarChar(sql.MAX), INITIAL_SETTINGS.googleMapsEmbed)
      .input('announcementBanner', sql.NVarChar(500), INITIAL_SETTINGS.announcementBanner)
      .input('isBannerActive', sql.Bit, INITIAL_SETTINGS.isBannerActive)
      .query(`
        INSERT INTO [dbo].[configuraciones] (
          id, hotelName, stars, tagline, address, phone, whatsappRaw, whatsappMessage,
          email, cloudbedsUrl, mapsUrl, googleMapsEmbed, announcementBanner, isBannerActive
        ) VALUES (
          @id, @hotelName, @stars, @tagline, @address, @phone, @whatsappRaw, @whatsappMessage,
          @email, @cloudbedsUrl, @mapsUrl, @googleMapsEmbed, @announcementBanner, @isBannerActive
        )
      `);
  }

  // SEED: Experiencias
  const expCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[experiencias]');
  if (expCount.recordset[0].count === 0) {
    console.log('🌱 Insertando experiencias iniciales...');
    for (const exp of INITIAL_EXPERIENCES) {
      await pool.request()
        .input('id', sql.VarChar(100), exp.id)
        .input('title', sql.NVarChar(150), exp.title)
        .input('subtitle', sql.NVarChar(100), exp.subtitle)
        .input('description', sql.NVarChar(sql.MAX), exp.description)
        .input('image', sql.NVarChar(500), exp.image)
        .input('tag', sql.NVarChar(100), exp.tag)
        .input('orderIndex', sql.Int, exp.orderIndex)
        .input('isActive', sql.Bit, exp.isActive)
        .query(`
          INSERT INTO [dbo].[experiencias] (id, title, subtitle, description, image, tag, orderIndex, isActive)
          VALUES (@id, @title, @subtitle, @description, @image, @tag, @orderIndex, @isActive)
        `);
    }
  }

  // SEED: Servicios
  const servCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[servicios]');
  if (servCount.recordset[0].count === 0) {
    console.log('🌱 Insertando servicios iniciales...');
    for (const serv of INITIAL_SERVICES) {
      await pool.request()
        .input('id', sql.VarChar(100), serv.id)
        .input('icon', sql.VarChar(50), serv.icon)
        .input('title', sql.NVarChar(150), serv.title)
        .input('description', sql.NVarChar(sql.MAX), serv.description)
        .input('orderIndex', sql.Int, serv.orderIndex)
        .input('isActive', sql.Bit, serv.isActive)
        .query(`
          INSERT INTO [dbo].[servicios] (id, icon, title, description, orderIndex, isActive)
          VALUES (@id, @icon, @title, @description, @orderIndex, @isActive)
        `);
    }
  }

  // SEED: Restaurant
  const restCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[restaurante]');
  if (restCount.recordset[0].count === 0) {
    console.log('🌱 Insertando datos iniciales del Restaurant Rooftop...');
    await pool.request()
      .input('id', sql.VarChar(50), INITIAL_ROOFTOP.id)
      .input('title', sql.NVarChar(150), INITIAL_ROOFTOP.title)
      .input('subtitle', sql.NVarChar(150), INITIAL_ROOFTOP.subtitle)
      .input('description', sql.NVarChar(sql.MAX), INITIAL_ROOFTOP.description)
      .input('hours', sql.NVarChar(150), INITIAL_ROOFTOP.hours)
      .input('image', sql.NVarChar(500), INITIAL_ROOFTOP.image)
      .input('highlights', sql.NVarChar(sql.MAX), INITIAL_ROOFTOP.highlights)
      .query(`
        INSERT INTO [dbo].[restaurante] (id, title, subtitle, description, hours, image, highlights)
        VALUES (@id, @title, @subtitle, @description, @hours, @image, @highlights)
      `);
  }

  // SEED: Reseñas
  const revCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[resenas]');
  if (revCount.recordset[0].count === 0) {
    console.log('🌱 Insertando reseñas iniciales...');
    for (const rev of INITIAL_REVIEWS) {
      await pool.request()
        .input('name', sql.NVarChar(150), rev.name)
        .input('origin', sql.NVarChar(150), rev.origin)
        .input('rating', sql.Int, rev.rating)
        .input('stayDate', sql.NVarChar(50), rev.stayDate)
        .input('comment', sql.NVarChar(sql.MAX), rev.comment)
        .input('isFeatured', sql.Bit, rev.isFeatured)
        .input('orderIndex', sql.Int, rev.orderIndex)
        .query(`
          INSERT INTO [dbo].[resenas] (name, origin, rating, stayDate, comment, isFeatured, orderIndex)
          VALUES (@name, @origin, @rating, @stayDate, @comment, @isFeatured, @orderIndex)
        `);
    }
  }

  // SEED: Usuario admin con contraseña encriptada
  try {
    const userCount = await pool.request().query('SELECT COUNT(*) as count FROM [dbo].[usuarios]');
    if (userCount.recordset[0].count === 0) {
      const hashedPassword = await bcrypt.hash('Sqlconesfer2468', 10);
      await pool.request()
        .input('usuario', sql.NVarChar(50), 'admin')
        .input('password', sql.NVarChar(255), hashedPassword)
        .input('nombre', sql.NVarChar(150), 'Administrador LuxSur')
        .input('rol', sql.NVarChar(50), 'admin')
        .input('activo', sql.Bit, 1)
        .query(`
          INSERT INTO [dbo].[usuarios] (usuario, password, nombre, rol, activo)
          VALUES (@usuario, @password, @nombre, @rol, @activo)
        `);
      console.log('🌱 Usuario inicial [admin] insertado con contraseña encriptada (bcrypt).');
    }
  } catch (err) {}

  console.log(' Inicialización de base de datos finalizada con éxito.');
}

if (process.argv[1] && process.argv[1].endsWith('initDb.js')) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Proceso de BD terminado.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error en proceso de BD:', err);
      process.exit(1);
    });
}
