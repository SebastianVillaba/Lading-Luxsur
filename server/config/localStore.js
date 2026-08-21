import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/local_cache.json');

const INITIAL_DATA = {
  rooms: [
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
      showPrice: true,
      badge: "Sólo queda 1",
      badgeType: "urgent",
      description: "Elegante departamento equipado con acabados boutique, zona de lectura, escritorio ejecutivo, Smart TV y baño privado con ducha.",
      image: "/images/stardardSingle/camaVentana.JPG",
      gallery: [
        "/images/stardardSingle/banio.JPG",
        "/images/stardardSingle/otroAngulo.JPG"
      ],
      features: [
        "Wi-Fi Gratis de alta velocidad 5G",
        "Aire Acondicionado & Calefacción",
        "Cama Single (96.5 cm x 190.5 cm)",
        "TV LED Smart con Cable",
        "Desayuno Buffet Gourmet Incluido",
        "Escritorio Ejecutivo y Sillón",
        "Secador de Pelo y Kits de Baño"
      ],
      customBookingUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
      orderIndex: 0,
      isActive: true
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
      showPrice: true,
      badge: "Más Popular",
      badgeType: "popular",
      description: "Espaciosa Suite de máximo confort dotada de A.A., calefacción, escritorio, armario, Wi-Fi gratis y TV. Confort exclusivo preparado para hasta 4 huéspedes.",
      image: "/images/suiteDeluxe/suiteCama.jpeg",
      gallery: [
        "/images/suiteDeluxe/banio.jpeg",
        "/images/suiteDeluxe/balcon.jpeg"
      ],
      features: [
        "Capacidad para hasta 4 huéspedes",
        "Aire Acondicionado & Calefacción Central",
        "Escritorio Ejecutivo & Armario Espacioso",
        "Wi-Fi Gratis 5G en toda la suite",
        "Cama Full/Double (134.5 cm x 190.5 cm)",
        "Smart TV Premium",
        "Desayuno Buffet Gourmet Incluido",
        "Servicio de Habitación Preferencial"
      ],
      customBookingUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
      orderIndex: 1,
      isActive: true
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
      showPrice: true,
      badge: "Ideal para Familias",
      badgeType: "family",
      description: "Alojamiento amplio y acogedor con la versatilidad ideal para grupos familiares que buscan combinar descanso, confort e independencia en Encarnación.",
      image: "/images/suiteCuadruple/camaVentana.jpg",
      gallery: [
        "/images/suiteCuadruple/mesita.JPG",
        "/images/suiteCuadruple/otroAngulo.jpeg"
      ],
      features: [
        "Alojamiento amplio ideal para 4 personas",
        "Configuración modular de camas confortables",
        "Wi-Fi de Alta Velocidad sin costo",
        "Climatización individual Frío/Calor",
        "Smart TV 55\" con canales en HD",
        "Armario amplio y caja fuerte digital",
        "Baño amplio equipado con amenidades",
        "Desayuno Buffet servido en Rooftop"
      ],
      customBookingUrl: "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg",
      orderIndex: 2,
      isActive: true
    }
  ],
  settings: {
    id: "main",
    hotelName: "LuxSur Hotel Boutique",
    stars: 4,
    starSymbol: "****",
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
    isBannerActive: false
  },
  experiences: [
    {
      id: "celebraciones",
      title: "Celebraciones Familiares",
      subtitle: "Inolvidable",
      description: "Haz de tus bodas, aniversarios, graduaciones o cumpleaños una fiesta memorable con salones privados, gastronomía a medida y servicio 4 estrellas.",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
      tag: "Eventos & Festejos",
      orderIndex: 0,
      isActive: true
    },
    {
      id: "vacaciones",
      title: "Vacaciones Soñadas",
      subtitle: "Relax & Paraná",
      description: "Disfruta de la vibrante Encarnación, a solo 3 minutos de la afamada Costanera San José, sintiendo la brisa del río Paraná con todo el confort de LuxSur.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      tag: "Turismo & Relax",
      orderIndex: 1,
      isActive: true
    },
    {
      id: "luna-de-miel",
      title: "Luna de Miel & Romántico",
      subtitle: "Experiencia VIP",
      description: "Servicio romántico especial con ambiente personalizado, pétalos de rosa, espumante helado en la suite, chocolates artesanales y late check-out.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      tag: "Parejas VIP",
      orderIndex: 2,
      isActive: true
    },
    {
      id: "tematicas",
      title: "Habitaciones Temáticas",
      subtitle: "Estilo Único",
      description: "Espacios diseñados artísticamente con detalles temáticos únicos que transforman una estadía común en un viaje sensorial inolvidable.",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
      tag: "Diseño Exclusivo",
      orderIndex: 3,
      isActive: true
    }
  ],
  services: [
    {
      id: "wifi",
      icon: "Wifi",
      title: "Wi-Fi Gratuito 5G",
      description: "Conexión de ultra alta velocidad e ilimitada en todas las habitaciones, salones y terraza del hotel.",
      orderIndex: 0,
      isActive: true
    },
    {
      id: "desayuno",
      icon: "Coffee",
      title: "Desayuno Buffet Gourmet",
      description: "Variedad de repostería típica paraguaya, frutas de estación, jugos naturales y café de especialidad.",
      orderIndex: 1,
      isActive: true
    },
    {
      id: "restaurant",
      icon: "UtensilsCrossed",
      title: "Restaurant & Bar Rooftop",
      description: "Gastronomía internacional y coctelería de autor con vista panorámica deslumbrante de Encarnación.",
      orderIndex: 2,
      isActive: true
    },
    {
      id: "estacionamiento",
      icon: "Car",
      title: "Estacionamiento Privado",
      description: "Estacionamiento privado dentro del recinto con monitoreo y seguridad las 24 horas.",
      orderIndex: 3,
      isActive: true
    },
    {
      id: "climatizacion",
      icon: "AirVent",
      title: "Climatización Inteligente",
      description: "Sistemas de Aire Acondicionado y Calefacción regulables en cada ambiente para tu máximo confort.",
      orderIndex: 4,
      isActive: true
    },
    {
      id: "roomservice",
      icon: "RoomService",
      title: "Servicio a la Habitación",
      description: "Atención personalizada 24/7 para disfrutar de bocados exquisitos y bebidas sin salir de tu suite.",
      orderIndex: 5,
      isActive: true
    }
  ],
  rooftop: {
    id: "rooftop",
    title: "Restaurant Panorámico & Rooftop Bar",
    subtitle: "Sabores exquisitos sobre los cielos de Encarnación",
    description: "Ubicado en la terraza de LuxSur Hotel Boutique, nuestro Restaurant Panorámico combina cortes carnes de primera calidad, pescados frescos de la cuenca del Paraná y una refinada carta de cócteles clásicos y contemporáneos.",
    hours: "Abierto diariamente: 07:00 hs - 23:30 hs",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Vista de 360° a la ciudad y alrededores",
      "Desayuno Buffet incluido para huéspedes",
      "Cenas románticas y reservas corporativas",
      "Carta de Vinos seleccionados por Sommelier"
    ]
  },
  reviews: [
    {
      id: 1,
      name: "Carlos Eduardo M.",
      origin: "Asunción, Paraguay",
      rating: 5,
      stayDate: "Julio 2026",
      comment: "Excelente hotel 4 estrellas en Encarnación. Las habitaciones son súper confortables y el restaurant de la terraza tiene una vista alucinante.",
      isFeatured: true,
      orderIndex: 0
    },
    {
      id: 2,
      name: "Valeria G.",
      origin: "Buenos Aires, Argentina",
      rating: 5,
      stayDate: "Junio 2026",
      comment: "Atención impecable. La Suite Deluxe fue súper cómoda para mi familia. Queda a minutos de la Costanera. Sin duda volveremos.",
      isFeatured: true,
      orderIndex: 1
    },
    {
      id: 3,
      name: "Rodrigo Benítez",
      origin: "Ciudad del Este, Paraguay",
      rating: 5,
      stayDate: "Mayo 2026",
      comment: "El desayuno buffet es delicioso y variado. El Wi-Fi funciona rápido para trabajar y el proceso de reserva directa fue sumamente ágil.",
      isFeatured: true,
      orderIndex: 2
    }
  ],
  users: [
    {
      id: 1,
      username: "admin",
      password: "$2b$10$GLNF2ZkTfPTryd0vTyGv5uM2HiYIlSLZOSASpkmr7VlQUz073Uqc2",
      name: "Administrador LuxSur",
      role: "admin",
      isActive: true,
      createdAt: "2026-08-20T10:00:00.000Z"
    }
  ],
  categories: [
    {
      id: "estandar",
      name: "Estándar",
      description: "Habitaciones individuales y dobles con todas las comodidades esenciales de LuxSur.",
      orderIndex: 0,
      isActive: true
    },
    {
      id: "suites",
      name: "Suites",
      description: "Suites de alto confort, decoración boutique y ambientes espaciosos.",
      orderIndex: 1,
      isActive: true
    },
    {
      id: "familiar",
      name: "Familiar",
      description: "Alojamiento con camas múltiples ideal para grupos familiares y estadías compartidas.",
      orderIndex: 2,
      isActive: true
    },
    {
      id: "ejecutiva",
      name: "Ejecutiva",
      description: "Espacios de tranquilidad y conectividad diseñados para viajeros de negocios.",
      orderIndex: 3,
      isActive: true
    },
    {
      id: "presidencial",
      name: "Presidencial",
      description: "La máxima experiencia de lujo y exclusividad de LuxSur Hotel Boutique.",
      orderIndex: 4,
      isActive: true
    }
  ]
};

// Asegurar directorio de datos
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function getLocalData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.users || parsed.users.length === 0) {
        parsed.users = INITIAL_DATA.users;
      }
      if (!parsed.categories || parsed.categories.length === 0) {
        parsed.categories = INITIAL_DATA.categories;
        saveLocalData(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error leyendo local_cache.json:', e.message);
  }
  saveLocalData(INITIAL_DATA);
  return INITIAL_DATA;
}

export function saveLocalData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error guardando local_cache.json:', e.message);
  }
}
