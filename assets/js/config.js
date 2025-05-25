/**
 * LAURA DIGITAL AGENCY - Configuration File
 * Centralized configuration for easy content management
 * Version: 1.0.0
 */

window.LAURA_CONFIG = {
  // Company Information
  company: {
    name: 'LAURA',
    fullName: 'LAURA Digital Agency',
    tagline: 'Transformamos tu negocio digital con inteligencia artificial',
    description: 'Agencia digital especializada en desarrollo web, ciberseguridad, marketing digital y consultoría. Optimizamos procesos con IA para hacer crecer tu negocio.',
    email: 'hola@laura.digital',
    phone: '+34 900 123 456',
    address: 'Madrid, España',
    website: 'https://laura.digital',
    socialMedia: {
      linkedin: '#',
      twitter: '#',
      instagram: '#',
      youtube: '#'
    }
  },

  // Services Configuration with specific plans
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
          price: '€1,200',
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
          price: '€3,500',
          popular: true,
          features: [
            'Sitio web corporativo (hasta 15 páginas)',
            'E-commerce básico (hasta 50 productos)',
            'Panel de administración intuitivo',
            'Integración con redes sociales',
            'SEO técnico implementado'
          ],
          deliverables: 'Entrega en 15 días',
          cta: 'Construir mi sitio'
        },
        {
          id: 'web-quantum',
          name: 'QUANTUM Web',
          subtitle: 'Desarrollo personalizado',
          price: '€8,000+',
          popular: false,
          features: [
            'Desarrollo web personalizado',
            'E-commerce avanzado (productos ilimitados)',
            'Integraciones con APIs externas',
            'Dashboard analytics personalizado',
            'Arquitectura escalable empresarial'
          ],
          deliverables: 'Entrega en 30 días',
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
          price: '€800',
          popular: false,
          features: [
            'Auditoría básica de vulnerabilidades',
            'Implementación de firewall básico',
            'Configuración de backups seguros',
            'Certificado SSL premium',
            'Guía de buenas prácticas'
          ],
          deliverables: 'Setup en 3 días',
          cta: 'Asegurar básico'
        },
        {
          id: 'security-fortress',
          name: 'FORTRESS Security',
          subtitle: 'Protección avanzada',
          price: '€2,500',
          popular: true,
          features: [
            'Auditoría completa de seguridad',
            'WAF avanzado implementado',
            'Monitoreo de amenazas 24/7',
            'Plan de respuesta a incidentes',
            'Capacitación del equipo'
          ],
          deliverables: 'Implementación en 10 días',
          cta: 'Fortalecer seguridad'
        },
        {
          id: 'pyme-segura',
          name: 'PYME SEGURA',
          subtitle: 'Programa integral exclusivo',
          price: '€4,500',
          popular: false,
          features: [
            'Auditoría integral + resolución',
            'Certificado de seguridad digital',
            'Seguimiento trimestral por 12 meses',
            'Respuesta inmediata a incidentes',
            'Compliance empresarial'
          ],
          deliverables: 'Programa completo en 4 semanas',
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
          price: '€800/mes',
          popular: false,
          features: [
            'Sesión fotográfica (4 horas/mes)',
            'Contenido para RRSS (20 posts/mes)',
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
          price: '€1,500/mes',
          popular: true,
          features: [
            'Sesión mensual (6 horas) + videos',
            'Gestión de 4 plataformas sociales',
            'Estrategia de contenido personalizada',
            'Ads management profesional',
            'Dashboard de métricas en tiempo real'
          ],
          deliverables: 'Estrategia en 48h',
          cta: 'Amplificar resultados'
        },
        {
          id: 'marketing-dominate',
          name: 'DOMINATE Marketing',
          subtitle: 'Liderazgo total',
          price: '€3,000/mes',
          popular: false,
          features: [
            'Producción audiovisual profesional',
            'IA personalizada para contenido',
            'Influencer marketing management',
            'Growth hacking avanzado',
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
          price: '€1,500',
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
          price: '€4,500',
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
          price: '€12,000+',
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

  // Pricing Plans
  pricingPlans: [
    {
      id: 'starter',
      name: 'Starter',
      subtitle: 'Para emprendedores',
      price: 'Desde €1,200',
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
      price: 'Desde €3,500',
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
      name: 'María González',
      position: 'CEO',
      company: 'TechStart',
      avatar: './assets/images/testimonials/maria.jpg',
      rating: 5,
      quote: 'LAURA transformó completamente nuestro negocio digital. Su enfoque con IA nos permitió automatizar procesos y triplicar nuestras ventas online.'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      position: 'Director',
      company: 'InnovaCorp',
      avatar: './assets/images/testimonials/juan.jpg',
      rating: 5,
      quote: 'La seguridad de nuestros datos era crítica. El programa PYME Segura nos dio la tranquilidad que necesitábamos para crecer sin preocupaciones.'
    },
    {
      id: 3,
      name: 'Ana Martín',
      position: 'CMO',
      company: 'GrowthCo',
      avatar: './assets/images/testimonials/ana.jpg',
      rating: 5,
      quote: 'Su estrategia de marketing digital con IA nos ayudó a reducir costos de adquisición en un 60% mientras aumentábamos conversiones.'
    }
  ],

  // Client Logos
  clientLogos: [
    { name: 'Cliente 1', logo: './assets/images/clients/client-1.png' },
    { name: 'Cliente 2', logo: './assets/images/clients/client-2.png' },
    { name: 'Cliente 3', logo: './assets/images/clients/client-3.png' },
    { name: 'Cliente 4', logo: './assets/images/clients/client-4.png' },
    { name: 'Cliente 5', logo: './assets/images/clients/client-5.png' },
    { name: 'Cliente 6', logo: './assets/images/clients/client-6.png' }
  ],

  // Contact Methods
  contactMethods: [
    {
      icon: 'fas fa-phone',
      title: 'Hablemos por teléfono',
      value: '+34 900 123 456',
      link: 'tel:+34900123456'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Escríbenos un email',
      value: 'hola@laura.digital',
      link: 'mailto:hola@laura.digital'
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
          { value: '1-5k', label: '€1,000 - €5,000' },
          { value: '5-15k', label: '€5,000 - €15,000' },
          { value: '15-50k', label: '€15,000 - €50,000' },
          { value: '50k+', label: '€50,000+' }
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
            { text: 'Blog', url: '/blog' },
            { text: 'Contacto', url: '#contacto' },
            { text: 'Política de Privacidad', url: '/privacy' }
          ]
        }
      }
    ]
  },

  // Certifications
  certifications: [
    { name: 'ISO 27001', logo: './assets/images/certifications/iso-27001.png' },
    { name: 'Google Partner', logo: './assets/images/certifications/google-partner.png' },
    { name: 'AWS', logo: './assets/images/certifications/aws.png' },
    { name: 'OpenAI', logo: './assets/images/certifications/openai.png' },
    { name: 'Microsoft', logo: './assets/images/certifications/microsoft.png' },
    { name: 'Shopify', logo: './assets/images/certifications/shopify.png' }
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
      './assets/images/hero-dashboard.jpg',
      './assets/images/team-ai.jpg'
    ]
  },

  // SEO Configuration
  seo: {
    title: 'LAURA - Agencia Digital IA | Desarrollo Web, Ciberseguridad y Marketing Digital',
    description: 'Agencia digital especializada en desarrollo web, ciberseguridad, marketing digital y consultoría. Optimizamos procesos con IA para hacer crecer tu negocio.',
    keywords: 'agencia digital, desarrollo web, ciberseguridad, marketing digital, inteligencia artificial, consultoría digital, PYME, automatización',
    ogImage: './assets/images/og-image.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LAURA Digital Agency',
      url: 'https://laura.digital',
      logo: './assets/images/logo.png',
      description: 'Agencia digital especializada en desarrollo web, ciberseguridad, marketing digital y consultoría.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ES',
        addressLocality: 'Madrid'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+34900123456',
        contactType: 'customer service'
      }
    }
  },

  // Development Settings
  dev: {
    enableConsoleMessages: false,
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