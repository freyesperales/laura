/**
 * LAURA DIGITAL AGENCY - Configuration File
 * Centralized configuration for easy content management
 * Version: 1.0.0 - PRECIOS EN UF CHILE
 */

window.LAURA_CONFIG = {
  // Company Information
  company: {
    name: 'LAURA',
    fullName: 'LAURA Digital Agency',
    tagline: 'Transformamos tu negocio digital con inteligencia artificial y un toque humano',
    description: 'Agencia digital especializada en desarrollo web, ciberseguridad, marketing digital y consultoría. Optimizamos procesos con IA para hacer crecer tu negocio.',
    email: 'francisco@laura.lat',
    phone: '+56 9 9996 8482',
    address: 'Santiago, Chile',
    website: 'https://laura.lat',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/in/frppr/',
      twitter: '#',
      instagram: '#',
      youtube: '#'
    }
  },

// Reemplaza TODO el arreglo 'services' en tu archivo /assets/js/config.js

services: [
    {
      id: 'web-development',
      title: 'Desarrollo Web a Medida',
      icon: 'fas fa-code',
      description: 'Construimos la plataforma digital que tu negocio necesita para crecer, desde landing pages que convierten hasta sistemas complejos.',
      features: [
        'Diseño UI/UX centrado en el usuario',
        'Desarrollo con tecnologías modernas y rápidas',
        'E-commerce y soluciones de pago integradas',
        'Optimización para máxima velocidad (Core Web Vitals)',
        'Panel de administración 100% intuitivo'
      ],
      cta: 'Ver Planes de Desarrollo',
      plans: [
        {
          id: 'web-spark',
          name: 'Plan Landing Page',
          subtitle: 'La página de ventas perfecta',
          price: '$197 USD', // PRECIO AJUSTADO
          popular: false,
          features: [
            'Landing page de hasta 5 secciones',
            'Diseño 100% responsive y moderno',
            'Formulario de contacto y conexión a WhatsApp',
            'Configuración de Google Analytics',
            'Entrega en 7 días hábiles'
          ],
          cta: 'Contratar Landing Page'
        },
        {
          id: 'web-fusion',
          name: 'Plan Sitio Web Profesional',
          subtitle: 'Tu presencia digital completa',
          price: '$497 USD', // PRECIO AJUSTADO
          popular: true,
          features: [
            '<strong>Todo lo del Plan Landing Page, y además:</strong>',
            'Sitio web de hasta 10 páginas',
            'Integración con Blog o Portafolio',
            'Panel para autogestionar contenido',
            'SEO técnico inicial para Google'
          ],
          cta: 'Contratar Sitio Web'
        },
        {
          id: 'web-quantum',
          name: 'Plan Desarrollo a Medida',
          subtitle: 'Soluciones web complejas',
          price: 'Desde $997 USD', // PRECIO AJUSTADO
          popular: false,
          features: [
            '<strong>Todo lo del Plan Profesional, y además:</strong>',
            'Funcionalidades E-commerce avanzadas',
            'Integraciones con sistemas externos (API)',
            'Área de clientes o membresías',
            'Arquitectura pensada para escalar'
          ],
          cta: 'Cotizar Desarrollo a Medida'
        }
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Ciberseguridad para PYMES',
      icon: 'fas fa-shield-alt',
      description: 'Protegemos tus operaciones y la confianza de tus clientes con soluciones de seguridad prácticas y efectivas.',
      features: [
        'Auditorías de vulnerabilidades (Pentesting)',
        'Implementación de Firewalls y Sistemas de Detección',
        'Monitoreo continuo de amenazas 24/7',
        'Planes de respuesta rápida ante incidentes',
        'Capacitación en ciberseguridad para equipos'
      ],
      cta: 'Ver Planes de Seguridad',
      plans: [
        {
          id: 'security-shield',
          name: 'Plan Seguridad Esencial',
          subtitle: 'El blindaje indispensable',
          price: '$97 USD', // PRECIO AJUSTADO
          popular: false,
          features: [
            'Análisis de vulnerabilidades inicial',
            'Configuración de Firewall de Aplicaciones (WAF)',
            'Instalación de Certificado SSL Premium',
            'Guía de políticas de seguridad'
          ],
          cta: 'Contratar Seguridad Esencial'
        },
        {
          id: 'security-fortress',
          name: 'Plan Seguridad Gestionada',
          subtitle: 'Protección proactiva y continua',
          price: '$397 USD', // PRECIO AJUSTADO
          popular: true,
          features: [
            '<strong>Todo lo del Plan Esencial, y además:</strong>',
            'Monitoreo de seguridad 24/7',
            'Reportes mensuales de estado de seguridad',
            'Soporte para incidentes menores',
            'Actualizaciones de seguridad periódicas'
          ],
          cta: 'Contratar Seguridad Gestionada'
        },
        {
          id: 'pyme-segura',
          name: 'Programa CISO Virtual',
          subtitle: 'Tu Director de Seguridad externo',
          price: 'Desde $997 USD', // PRECIO AJUSTADO
          popular: false,
          features: [
            '<strong>Todo lo del Plan Gestionado, y además:</strong>',
            'Rol de CISO (Director de Seguridad) externo',
            'Pentesting trimestral con reporte ejecutivo',
            'Plan y simulacros de respuesta a incidentes',
            'Asesoría en cumplimiento normativo (Compliance)'
          ],
          cta: 'Contratar CISO Virtual'
        }
      ]
    },
    {
      id: 'digital-marketing',
      title: 'Marketing Digital Inteligente',
      icon: 'fas fa-chart-line',
      description: 'Atraemos a los clientes correctos y aumentamos tus ventas con estrategias de marketing basadas en datos e IA.',
      features: [
        'Estrategia de Contenidos y SEO',
        'Gestión Profesional de Redes Sociales',
        'Campañas de Publicidad en Google y Meta Ads',
        'Email Marketing y flujos automatizados',
        'Reportes de rendimiento claros y accionables'
      ],
      cta: 'Ver Planes de Marketing',
      plans: [
        {
          id: 'marketing-launch',
          name: 'Plan Básico de Contenidos',
          subtitle: 'Visibilidad constante en redes',
          price: '$197 USD/mes', // PRECIO AJUSTADO
          popular: false,
          features: [
            'Gestión de 2 redes sociales',
            '12 publicaciones mensuales',
            'Diseño gráfico para posts',
            'Reporte de alcance y engagement'
          ],
          cta: 'Contratar Plan Básico'
        },
        {
          id: 'marketing-amplify',
          name: 'Plan de Crecimiento Digital',
          subtitle: 'Atraer y convertir clientes',
          price: '$397 USD/mes', // PRECIO AJUSTADO
          popular: true,
          features: [
            '<strong>Todo lo del Plan Básico, y además:</strong>',
            'Gestión de campañas de publicidad (hasta $500 de inversión)',
            'Estrategia y optimización SEO On-Page',
            'Un artículo de blog mensual (optimizado)',
            'Dashboard de resultados en tiempo real'
          ],
          cta: 'Contratar Plan Crecimiento'
        },
        {
          id: 'marketing-dominate',
          name: 'Plan de Liderazgo de Mercado',
          subtitle: 'Estrategia integral y dominante',
          price: '$797 USD/mes', // PRECIO AJUSTADO
          popular: false,
          features: [
            '<strong>Todo lo del Plan Crecimiento, y además:</strong>',
            'Estrategia de marketing 360°',
            'Gestión de campañas avanzadas (inversión ilimitada)',
            'Email marketing y automatización',
            'Reunión estratégica mensual'
          ],
          cta: 'Contratar Plan Liderazgo'
        }
      ]
    },
    {
      id: 'consulting',
      title: 'Consultoría Estratégica',
      icon: 'fas fa-lightbulb',
      description: 'Te damos la claridad y la hoja de ruta que necesitas para tomar las mejores decisiones y llevar tu negocio al siguiente nivel.',
      features: [
        'Diagnóstico y Roadmap de Transformación Digital',
        'Optimización de procesos con tecnología',
        'Implementación de IA en tu negocio',
        'Análisis de datos para toma de decisiones',
        'Asesoría en innovación y nuevos modelos de negocio'
      ],
      cta: 'Ver Opciones de Consultoría',
      plans: [
        {
          id: 'consulting-insights',
          name: 'Sesión de Diagnóstico',
          subtitle: 'Claridad y próximos pasos',
          price: '$297 USD', // PRECIO AJUSTADO
          popular: false,
          features: [
            'Sesión de 2 horas con un estratega senior',
            'Análisis de tu situación actual y competencia',
            'Identificación de 3 oportunidades clave',
            'Entrega de un plan de acción inmediato'
          ],
          cta: 'Agendar Diagnóstico'
        },
        {
          id: 'consulting-strategy',
          name: 'Proyecto de Estrategia Digital',
          subtitle: 'Tu hoja de ruta para crecer',
          price: '$997 USD', // PRECIO AJUSTADO
          popular: true,
          features: [
            '<strong>Todo lo de la Sesión de Diagnóstico, y además:</strong>',
            'Análisis de mercado y audiencia a fondo',
            'Definición de KPIs y métricas de éxito',
            'Documento de estrategia digital completo',
            'Plan de implementación a 6 meses'
          ],
          cta: 'Crear mi Estrategia'
        },
        {
          id: 'consulting-transformation',
          name: 'Asesoría de Transformación',
          subtitle: 'Tu socio estratégico mensual',
          price: 'Desde $2,997 USD', // PRECIO AJUSTADO
          popular: false,
          features: [
            '<strong>Todo lo del Proyecto de Estrategia, y además:</strong>',
            'Acompañamiento en la implementación',
            'Reuniones de seguimiento semanales',
            'Optimización continua de la estrategia',
            'Acceso prioritario a nuestro equipo de expertos'
          ],
          cta: 'Contratar Asesoría'
        }
      ]
    }
],

  // Features for About Section
  features: [
    {
      icon: 'fas fa-robot',
      title: 'IA que Potencia',
      description: 'Optimizamos cada proceso con inteligencia artificial para entregar resultados superiores en menor tiempo.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Toque Humano',
      description: 'Detrás de cada algoritmo hay un equipo apasionado que entiende tu negocio y tus objetivos únicos.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Resultados Medibles',
      description: 'Cada proyecto tiene KPIs claros y reportes transparentes que demuestran el impacto real en tu negocio.'
    }
  ],

  // Benefits/Why Choose Us
  benefits: [
    {
      icon: 'fas fa-tachometer-alt',
      title: 'Velocidad × IA',
      description: 'Entregamos proyectos 3x más rápido gracias a nuestros procesos automatizados con inteligencia artificial.'
    },
    {
      icon: 'fas fa-award',
      title: 'Calidad Garantizada',
      description: 'Cada proyecto pasa por controles de calidad automatizados y revisión humana experta.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Soporte Real',
      description: 'Soporte técnico especializado con respuesta inmediata y seguimiento personalizado.'
    }
  ],

  // Reemplaza el objeto 'pricingPlans' en tu archivo /assets/js/config.js

// En /assets/js/config.js, asegúrate de que este sea tu arreglo 'pricingPlans'

pricingPlans: [
    {
      id: 'starter',
      name: 'Plan Emprende',
      subtitle: 'Para startups y primeros pasos digitales',
      price: '$197 USD',
      popular: false,
      features: [
        'Landing page de alto impacto',
        'Diseño profesional y moderno',
        'Optimización para SEO inicial',
        'Integración con Analytics y WhatsApp'
      ],
      cta: 'Comenzar Proyecto',
      ctaType: 'secondary',
      whatsappMessage: '¡Hola! Me interesa el *Plan Emprende* de $197 USD para lanzar mi proyecto. ¿Podemos conversar?'
    },
    {
      id: 'growth',
      name: 'Plan Consolida',
      subtitle: 'La solución completa para PYMEs',
      price: '$497 USD',
      popular: true,
      features: [
        'Sitio web completo y autogestionable',
        'Blog o portafolio integrado',
        'Funcionalidades E-commerce',
        'Asesoría en transformación digital'
      ],
      cta: 'Acelerar Crecimiento',
      ctaType: 'primary',
      whatsappMessage: '¡Hola! Me interesa el *Plan Consolida* de $497 USD. Busco una solución web completa para mi PYME.'
    },
    {
      id: 'enterprise',
      name: 'Plan Lidera',
      subtitle: 'Soluciones a medida para empresas',
      price: 'Personalizado',
      popular: false,
      features: [
        'Desarrollo de software y aplicaciones web',
        'Integración con sistemas (API, ERP, CRM)',
        'Ciberseguridad de grado empresarial',
        'Consultoría y soporte prioritario 24/7'
      ],
      cta: 'Contactar para Cotización',
      ctaType: 'secondary',
      whatsappMessage: '¡Hola! Represento a una empresa y me interesa el *Plan Lidera*. Necesitamos una solución personalizada.'
    }
],
// En /assets/js/config.js, AÑADE este nuevo arreglo.

monthlyPlans: [
    {
      id: 'monthly-starter',
      name: 'Soporte Esencial',
      icon: '🚀',
      subtitle: 'Para mantener tu web segura y actualizada',
      price: '$97 USD/mes', // Precio mensual competitivo
      popular: false,
      features: [
        'Actualizaciones de seguridad semanales',
        'Copias de seguridad diarias',
        'Monitoreo de rendimiento básico',
        'Soporte técnico vía email'
      ],
      cta: 'Contratar Soporte',
      ctaType: 'secondary',
      whatsappMessage: '¡Hola! Me interesa el plan de Soporte Esencial de $97 USD/mes para mantener mi sitio web.'
    },
    {
      id: 'monthly-growth',
      name: 'Crecimiento Continuo',
      icon: '📈',
      subtitle: 'Para optimizar y crecer cada mes',
      price: '$297 USD/mes', // Precio mensual competitivo
      popular: true,
      features: [
        '<strong>Todo lo del Soporte Esencial, y además:</strong>',
        'Optimización SEO On-Page continua',
        'Un artículo de blog o landing page al mes',
        'Reporte de métricas y recomendaciones',
        'Reunión estratégica trimestral'
      ],
      cta: 'Impulsar Crecimiento',
      ctaType: 'primary',
      whatsappMessage: '¡Hola! Me interesa el plan de Crecimiento Continuo de $297 USD/mes para optimizar mi negocio.'
    },
    {
      id: 'monthly-enterprise',
      name: 'Socio Estratégico',
      icon: '🤝',
      subtitle: 'Tu equipo técnico y estratégico externo',
      price: 'Personalizado',
      popular: false,
      features: [
        '<strong>Todo lo de Crecimiento Continuo, y además:</strong>',
        'Desarrollo y mejoras a solicitud',
        'Consultoría estratégica proactiva',
        'Acceso prioritario a nuestro equipo',
        'Soporte dedicado 24/7'
      ],
      cta: 'Agendar Reunión',
      ctaType: 'secondary',
      whatsappMessage: '¡Hola! Me interesa su servicio de Socio Estratégico. Necesitamos un partner tecnológico a largo plazo.'
    }
],
  // Client Testimonials
  testimonials: [
    {
      id: 1,
      name: 'Claudia Marambio',
      position: 'Subgerente de tiendas abc',
      company: 'ABC',
      avatar: 'https://via.placeholder.com/50x50/667eea/ffffff?text=MG',
      rating: 5,
      quote: 'LAURA transformó completamente nuestro negocio digital. Su enfoque con IA nos permitió automatizar procesos y triplicar nuestras ventas online.'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      position: 'Director',
      company: 'InnovaCorp',
      avatar: 'https://via.placeholder.com/50x50/764ba2/ffffff?text=JP',
      rating: 5,
      quote: 'La seguridad de nuestros datos era crítica. El programa PYME Segura nos dio la tranquilidad que necesitábamos para crecer sin preocupaciones.'
    },
    {
      id: 3,
      name: 'Francisco Flores',
      position: 'CEO',
      company: 'Degu Medios',
      avatar: 'https://via.placeholder.com/50x50/10b981/ffffff?text=AM',
      rating: 5,
      quote: 'Su estrategia de marketing digital con IA nos ayudó a reducir costos de adquisición en un 60% mientras aumentábamos conversiones.'
    }
  ],

  // Client Logos
  clientLogos: [
    { name: 'Cliente 1', logo: 'https://via.placeholder.com/120x60/f8fafc/667eea?text=Cliente+1' },
    { name: 'Cliente 2', logo: 'https://via.placeholder.com/120x60/f8fafc/764ba2?text=Cliente+2' },
    { name: 'Cliente 3', logo: 'https://via.placeholder.com/120x60/f8fafc/10b981?text=Cliente+3' },
    { name: 'Cliente 4', logo: 'https://via.placeholder.com/120x60/f8fafc/8b5cf6?text=Cliente+4' },
    { name: 'Cliente 5', logo: 'https://via.placeholder.com/120x60/f8fafc/f59e0b?text=Cliente+5' },
    { name: 'Cliente 6', logo: 'https://via.placeholder.com/120x60/f8fafc/ef4444?text=Cliente+6' }
  ],

  // Contact Methods (CHILE)
  contactMethods: [
    {
      icon: 'fas fa-phone',
      title: 'Hablemos por teléfono',
      value: '+56 9 9996 8482',
      link: 'wa.me/+56999968482'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Escríbenos un email',
      value: 'francisco@laura.lat',
      link: 'mailto:francisco@laura.lat'
    },
    {
      icon: 'fas fa-clock',
      title: 'Respuesta garantizada',
      value: 'En menos de 2 horas hábiles',
      link: null
    }
  ],

  // Contact Form Fields
  contactForm: {
    fields: [
      {
        name: 'firstName',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Tu nombre',
        gridColumn: 'half'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'tu@email.com',
        gridColumn: 'half'
      },
      {
        name: 'company',
        label: 'Empresa',
        type: 'text',
        required: false,
        placeholder: 'Nombre de tu empresa',
        gridColumn: 'full'
      },
      {
        name: 'service',
        label: '¿Qué necesitas?',
        type: 'select',
        required: true,
        gridColumn: 'full',
        options: [
          { value: '', label: 'Selecciona un servicio' },
          { value: 'web', label: 'Desarrollo Web' },
          { value: 'security', label: 'Ciberseguridad' },
          { value: 'marketing', label: 'Marketing Digital' },
          { value: 'consulting', label: 'Consultoría' },
          { value: 'all', label: 'Solución integral' }
        ]
      },
      {
        name: 'message',
        label: 'Cuéntanos tu proyecto',
        type: 'textarea',
        required: true,
        placeholder: 'Describe tu proyecto, objetivos y timeline...',
        gridColumn: 'full'
      },
      {
        name: 'budget',
        label: 'Presupuesto estimado',
        type: 'select',
        required: false,
        gridColumn: 'full',
        options: [
            { value: '', label: 'Selecciona un rango' },
            { value: 'under-1000', label: 'Menos de $1,000 USD' },
            { value: '1000-3000', label: '$1,000 - $3,000 USD' },
            { value: '3000-7000', label: '$3,000 - $7,000 USD' },
            { value: '7000+', label: 'Más de $7,000 USD' }
          ]
      }
    ],
    submitText: 'Transformar mi negocio',
    privacyText: 'Al enviar este formulario, aceptas nuestra política de privacidad y recibirás información relevante sobre nuestros servicios.'
  },

  // Footer Configuration
  footer: {
    sections: [
      {
        title: 'LAURA',
        type: 'brand',
        content: {
          description: 'Agencia digital que combina inteligencia artificial con experiencia humana para transformar tu negocio y hacerlo crecer de manera sostenible.',
          socialLinks: true
        }
      },
      {
        title: 'Servicios',
        type: 'links',
        content: {
          links: [
            { text: 'Desarrollo Web', url: '#servicios' },
            { text: 'Ciberseguridad', url: '#servicios' },
            { text: 'Marketing Digital', url: '#servicios' },
            { text: 'Consultoría', url: '#servicios' },
            { text: 'PYME Segura', url: '#contacto' }
          ]
        }
      },
      {
        title: 'Empresa',
        type: 'links',
        content: {
          links: [
            { text: 'Sobre Nosotros', url: '#nosotros' },
            { text: 'Casos de Éxito', url: '#clientes' },
            { text: 'Blog', url: './blog.html' },
            { text: 'Contacto', url: '#contacto' },
            { text: 'Política de Privacidad', url: '/privacy' }
          ]
        }
      }
    ]
  },

  // Certifications
  certifications: [
    { name: 'ISO 27001', logo: 'https://via.placeholder.com/80x40/374151/ffffff?text=ISO+27001' },
    { name: 'Google Partner', logo: 'https://via.placeholder.com/80x40/374151/ffffff?text=Google' },
    { name: 'AWS', logo: 'https://via.placeholder.com/80x40/374151/ffffff?text=AWS' },
    { name: 'OpenAI', logo: 'https://via.placeholder.com/80x40/374151/ffffff?text=OpenAI' },
    { name: 'Microsoft', logo: 'https://via.placeholder.com/80x40/374151/ffffff?text=Microsoft' },
    { name: 'Shopify', logo: 'https://via.placeholder.com/80x40/374151/ffffff?text=Shopify' }
  ],

  // Hero Stats
  heroStats: [
    { target: 95, suffix: '%', label: 'Clientes satisfechos' },
    { target: 150, suffix: '+', label: 'Proyectos completados' },
    { target: 24, suffix: '/7', label: 'Soporte técnico' }
  ],

  // Animation Settings
  animations: {
    fadeInDelay: 100,
    counterDuration: 2000,
    floatingDuration: 3000,
    pulseDuration: 2000
  },

  // Performance Settings
  performance: {
    lazyLoadOffset: 100,
    debounceDelay: 250,
    preloadImages: [
      'https://via.placeholder.com/500x400/667eea/ffffff?text=LAURA+AI+Dashboard',
      'https://via.placeholder.com/600x500/f8fafc/667eea?text=Equipo+LAURA'
    ]
  },

  // SEO Configuration
  seo: {
    title: 'LAURA - Agencia Digital IA | Desarrollo Web, Ciberseguridad y Marketing Digital Chile',
    description: 'Agencia digital chilena especializada en desarrollo web, ciberseguridad, marketing digital y consultoría. Optimizamos procesos con IA para hacer crecer tu negocio.',
    keywords: 'agencia digital chile, desarrollo web santiago, ciberseguridad, marketing digital, inteligencia artificial, consultoría digital, PYME chile, automatización',
    ogImage: '.\assets\img\LOGO-AGENCIA-LAURA.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LAURA Digital Agency',
      url: 'https://laura.digital',
      logo: '.\assets\img\LOGO-AGENCIA-LAURA.webp',
      description: 'Agencia digital chilena especializada en desarrollo web, ciberseguridad, marketing digital y consultoría.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CL',
        addressLocality: 'Santiago'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+56999968482',
        contactType: 'customer service'
      }
    }
  },

  // Development Settings
  dev: {
    enableConsoleMessages: true,
    enablePerformanceMonitoring: true,
    enableErrorTracking: true
  }
};

// Utility function to get config values
window.getConfig = function(path, defaultValue = null) {
  return path.split('.').reduce((obj, key) => obj?.[key], window.LAURA_CONFIG) || defaultValue;
};

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.LAURA_CONFIG;
}

window.renderSVGIcon = function(iconType, className = 'icon-svg') {
  const icons = {
    'code-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="6" width="16" height="12" rx="2"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <circle cx="9" cy="11" r="1"/>
        <circle cx="15" cy="11" r="1"/>
        <path d="M9 14h6"/>
        <path d="M7 18v2"/>
        <path d="M17 18v2"/>
      </svg>
    `,
    'shield-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="12" height="14" rx="2"/>
        <path d="M6 4V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        <circle cx="10" cy="9" r="1"/>
        <circle cx="14" cy="9" r="1"/>
        <path d="M10 13h4"/>
        <rect x="8" y="15" width="8" height="2" rx="1"/>
      </svg>
    `,
    'trending-up-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="5" y="6" width="14" height="12" rx="2"/>
        <path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>
        <circle cx="9" cy="10" r="1"/>
        <circle cx="15" cy="10" r="1"/>
        <path d="M12 14v2"/>
        <path d="M10 14h4"/>
        <path d="M7 18h10"/>
      </svg>
    `,
    'lightbulb-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="5" width="12" height="13" rx="2"/>
        <path d="M6 5V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        <circle cx="10" cy="9" r="1"/>
        <circle cx="14" cy="9" r="1"/>
        <path d="M9 13h6"/>
        <rect x="8" y="16" width="8" height="2" rx="1"/>
      </svg>
    `,
    'cpu-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="7" y="6" width="10" height="12" rx="2"/>
        <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
        <circle cx="10" cy="10" r="1"/>
        <circle cx="14" cy="10" r="1"/>
        <rect x="9" y="13" width="6" height="1"/>
        <path d="M6 12h1"/>
        <path d="M17 12h1"/>
        <path d="M12 18v1"/>
      </svg>
    `,
    'heart-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
        <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        <circle cx="9" cy="10" r="1"/>
        <circle cx="15" cy="10" r="1"/>
        <path d="M9 14c0-1 1-2 3-2s3 1 3 2"/>
      </svg>
    `,
    'bar-chart-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="5" width="12" height="13" rx="2"/>
        <path d="M6 5V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        <circle cx="9" cy="9" r="1"/>
        <circle cx="15" cy="9" r="1"/>
        <rect x="8" y="12" width="2" height="4"/>
        <rect x="11" y="11" width="2" height="5"/>
        <rect x="14" y="13" width="2" height="3"/>
      </svg>
    `,
    'zap-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
        <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        <circle cx="9" cy="10" r="1"/>
        <circle cx="15" cy="10" r="1"/>
        <path d="M12 13l-2 2h4l-2-2z"/>
        <rect x="10" y="16" width="4" height="1"/>
      </svg>
    `,
    'award-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="5" width="12" height="13" rx="2"/>
        <path d="M6 5V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        <circle cx="9" cy="9" r="1"/>
        <circle cx="15" cy="9" r="1"/>
        <circle cx="12" cy="13" r="2"/>
        <path d="M10 16h4"/>
      </svg>
    `,
    'users-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="6" width="7" height="12" rx="1"/>
        <rect x="13" y="6" width="7" height="12" rx="1"/>
        <circle cx="7.5" cy="10" r="1"/>
        <circle cx="16.5" cy="10" r="1"/>
        <path d="M6 14h3"/>
        <path d="M15 14h3"/>
        <path d="M4 6V4a2 2 0 0 1 2-2h3"/>
        <path d="M20 6V4a2 2 0 0 1-2-2h-3"/>
      </svg>
    `,
    'brain-svg': `
      <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="12" height="16" rx="3"/>
        <circle cx="10" cy="9" r="1"/>
        <circle cx="14" cy="9" r="1"/>
        <path d="M9 13h6"/>
        <path d="M12 16v2"/>
        <path d="M8 18h8"/>
        <path d="M6 8h2"/>
        <path d="M16 8h2"/>
      </svg>
    `
  };
  
  return icons[iconType] || icons['brain-svg'];
};