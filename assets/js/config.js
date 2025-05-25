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

  // Services Configuration with specific plans (PRECIOS EN UF)
  services: [
    {
      id: 'web-development',
      title: 'Creamos tu presencia digital',
      icon: 'fas fa-code',
      description: 'Sitios web y aplicaciones que convierten visitantes en clientes, optimizados con IA para máximo rendimiento.',
      features: [
        'Landing pages de alta conversión',
        'E-commerce personalizado',
        'Aplicaciones web escalables'
      ],
      cta: 'Explorar opciones',
      plans: [
        {
          id: 'web-spark',
          name: 'SPARK Web',
          subtitle: 'Landing page profesional',
          price: '10 UF',
          popular: false,
          features: [
            'Landing page optimizada (5 secciones)',
            'Diseño responsive mobile-first',
            'Formulario de contacto integrado',
            'SSL e integración de analytics',
            'Performance score >85'
          ],
          deliverables: 'Entrega en 7 días',
          cta: 'Crear mi landing'
        },
        {
          id: 'web-fusion',
          name: 'FUSION Web',
          subtitle: 'Sitio web completo',
          price: '30 UF',
          popular: true,
          features: [
            'Sitio web corporativo (hasta 15 páginas)',
            'E-commerce básico (hasta 50 productos)',
            'Panel de administración intuitivo',
            'Integración con redes sociales',
            'SEO técnico implementado'
          ],
          deliverables: 'Entrega en 20 días',
          cta: 'Construir mi sitio'
        },
        {
          id: 'web-quantum',
          name: 'QUANTUM Web',
          subtitle: 'Desarrollo personalizado',
          price: '60 UF',
          popular: false,
          features: [
            'Desarrollo web personalizado',
            'E-commerce avanzado (productos ilimitados)',
            'Integraciones con APIs externas',
            'Dashboard analytics personalizado',
            'Arquitectura escalable empresarial'
          ],
          deliverables: 'Entrega en 45 días',
          cta: 'Solicitar cotización'
        }
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Protegemos tu futuro',
      icon: 'fas fa-shield-alt',
      description: 'Seguridad digital empresarial con monitoreo 24/7 y nuestro programa exclusivo PYME Segura.',
      features: [
        'Auditorías de vulnerabilidades',
        'Monitoreo continuo',
        'Programa PYME Segura'
      ],
      cta: 'Proteger mi negocio',
      plans: [
        {
          id: 'security-shield',
          name: 'SHIELD Security',
          subtitle: 'Protección básica',
          price: '10 UF',
          popular: false,
          features: [
            'Auditoría básica de vulnerabilidades',
            'Implementación de firewall básico',
            'Configuración de backups seguros',
            'Certificado SSL premium',
            'Guía de buenas prácticas'
          ],
          deliverables: 'Setup en 7 días',
          cta: 'Asegurar básico'
        },
        {
          id: 'security-fortress',
          name: 'FORTRESS Security',
          subtitle: 'Protección avanzada',
          price: '50 UF',
          popular: true,
          features: [
            'Auditoría completa de seguridad',
            'WAF avanzado implementado',
            'Monitoreo de amenazas 24/7',
            'Plan de respuesta a incidentes',
            'Capacitación del equipo'
          ],
          deliverables: 'Implementación en 30 días',
          cta: 'Fortalecer seguridad'
        },
        {
          id: 'pyme-segura',
          name: 'PYME SEGURA',
          subtitle: 'Programa integral exclusivo',
          price: '80 UF',
          popular: false,
          features: [
            'Auditoría integral + resolución',
            'Certificado de seguridad digital',
            'Seguimiento trimestral por 12 meses',
            'Respuesta inmediata a incidentes',
            'Compliance empresarial'
          ],
          deliverables: 'Programa completo en 8 semanas',
          cta: 'Unirse a PYME Segura'
        }
      ]
    },
    {
      id: 'digital-marketing',
      title: 'Amplificamos tu marca',
      icon: 'fas fa-chart-line',
      description: 'Marketing digital con IA que encuentra tu audiencia perfecta y maximiza tu ROI automáticamente.',
      features: [
        'Contenido visual profesional',
        'Gestión inteligente de RRSS',
        'Automatización con IA'
      ],
      cta: 'Hacer crecer mi marca',
      plans: [
        {
          id: 'marketing-launch',
          name: 'LAUNCH Marketing',
          subtitle: 'Despegue digital',
          price: '20 UF/mes',
          popular: false,
          features: [
            'Sesión fotográfica (4 horas/mes)',
            'Contenido para RRSS (15 posts/mes)',
            'Gestión de 2 plataformas sociales',
            'Community management básico',
            'Reportes mensuales básicos'
          ],
          deliverables: 'Inicio inmediato',
          cta: 'Lanzar marca'
        },
        {
          id: 'marketing-amplify',
          name: 'AMPLIFY Marketing',
          subtitle: 'Crecimiento acelerado',
          price: '30 UF/mes',
          popular: true,
          features: [
            'Sesión audiovisual de 12 horas + videos',
            'Gestión de 4 plataformas sociales',
            'Estrategia de contenido personalizada',
            'Estrategia SEO Básica',
            'Dashboard de métricas personalizado'
          ],
          deliverables: 'Estrategia en 48h',
          cta: 'Amplificar resultados'
        },
        {
          id: 'marketing-dominate',
          name: 'DOMINATE Marketing',
          subtitle: 'Liderazgo total',
          price: '40 UF/mes',
          popular: false,
          features: [
            'Producción audiovisual y fotográfica profesional',
            'IA personalizada para contenido',
            'Influencer marketing management',
            'Estrategia SEO avanzada',
            'Estrategia omnicanal completa'
          ],
          deliverables: 'Lanzamiento en 1 semana',
          cta: 'Dominar mercado'
        }
      ]
    },
    {
      id: 'consulting',
      title: 'Estrategia que funciona',
      icon: 'fas fa-lightbulb',
      description: 'Consultoría digital personalizada que transforma tu visión en resultados medibles y sostenibles.',
      features: [
        'Transformación digital',
        'Optimización de procesos',
        'Implementación de IA'
      ],
      cta: 'Obtener consultoría',
      plans: [
        {
          id: 'consulting-insights',
          name: 'INSIGHTS Consulting',
          subtitle: 'Diagnóstico estratégico',
          price: '42 UF',
          popular: false,
          features: [
            'Auditoría digital inicial completa',
            'Análisis de competencia detallado',
            'Roadmap estratégico de 6 meses',
            '2 sesiones de seguimiento',
            'Recomendaciones priorizadas'
          ],
          deliverables: 'Informe en 10 días',
          cta: 'Obtener insights'
        },
        {
          id: 'consulting-strategy',
          name: 'STRATEGY Consulting',
          subtitle: 'Implementación guiada',
          price: '125 UF',
          popular: true,
          features: [
            'Consultoría estratégica integral',
            'Metodologías ágiles implementadas',
            'Plan de transformación digital',
            'Acompañamiento mensual (6 meses)',
            'Optimización continua de procesos'
          ],
          deliverables: 'Plan ejecutivo en 2 semanas',
          cta: 'Transformar estrategia'
        },
        {
          id: 'consulting-transformation',
          name: 'TRANSFORMATION Consulting',
          subtitle: 'Cambio organizacional',
          price: '330 UF+',
          popular: false,
          features: [
            'Transformación digital completa',
            'Change management profesional',
            'Tecnologías disruptivas implementadas',
            'Capacitación ejecutiva y operativa',
            'Acompañamiento por 12 meses'
          ],
          deliverables: 'Transformación en 90 días',
          cta: 'Revolucionar empresa'
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

  // Pricing Plans (PRECIOS EN UF)
  pricingPlans: [
    {
      id: 'starter',
      name: 'Starter',
      subtitle: 'Para emprendedores',
      price: 'Desde 10 UF',
      popular: false,
      features: [
        'Landing page optimizada',
        'Seguridad básica',
        'Marketing inicial',
        'Consultoría estratégica'
      ],
      cta: 'Empezar proyecto',
      ctaType: 'secondary'
    },
    {
      id: 'growth',
      name: 'Growth',
      subtitle: 'Para PYMEs en crecimiento',
      price: 'Desde 20 UF',
      popular: true,
      features: [
        'Sitio web completo + E-commerce',
        'Seguridad avanzada',
        'Marketing multicanal',
        'Transformación digital'
      ],
      cta: 'Acelerar crecimiento',
      ctaType: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'Para empresas líderes',
      price: 'Personalizado',
      popular: false,
      features: [
        'Desarrollo personalizado',
        'Seguridad empresarial',
        'Marketing con IA avanzada',
        'Soporte dedicado 24/7'
      ],
      cta: 'Contactar',
      ctaType: 'secondary'
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
          { value: '20-50uf', label: '20 - 50 UF' },
          { value: '50-100uf', label: '50 - 100 UF' },
          { value: '100-200uf', label: '100 - 200 UF' },
          { value: '200uf+', label: '200 UF+' }
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
    ogImage: 'https://via.placeholder.com/1200x630/667eea/ffffff?text=LAURA+Digital+Agency+Chile',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LAURA Digital Agency',
      url: 'https://laura.digital',
      logo: 'https://via.placeholder.com/200x100/667eea/ffffff?text=LAURA',
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