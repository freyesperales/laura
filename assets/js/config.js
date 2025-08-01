/**
 * LAURA DIGITAL AGENCY - Configuration File
 * Configuración centralizada restaurada y optimizada para UX global
 * Version: 2.2.0 - Fully Restored + Global Focus
 */

window.LAURA_CONFIG = {
  // Company Information - Enfoque Global
  company: {
    name: 'LAURA',
    fullName: 'LAURA Digital Agency',
    tagline: 'Transformamos tu negocio digital con inteligencia artificial y un toque humano',
    description: 'Agencia digital global especializada en desarrollo web, ciberseguridad, marketing digital y consultoría. Optimizamos procesos con IA para hacer crecer negocios en todo el mundo.',
    email: 'francisco@laura.lat',
    phone: '+56 9 9996 8482',
    whatsapp: '56999968482',
    address: 'Santiago, Chile',
    website: 'https://laura.lat',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/in/frppr/',
      twitter: '#',
      instagram: '#',
      youtube: '#'
    }
  },

  // Services - 3 ÁREAS PRINCIPALES RESTAURADAS
  services: [
    {
      id: 'marketing',
      title: 'Marketing Digital Inteligente',
      icon: 'fas fa-chart-line',
      description: 'Atraemos a los clientes correctos y multiplicamos tus ventas con estrategias de marketing basadas en datos e inteligencia artificial que generan resultados medibles.',
      features: [
        'Estrategia de Contenidos y SEO avanzado',
        'Google Ads y Meta Ads optimizados con IA',
        'Email Marketing y automatización inteligente',
        'Social Media Management profesional',
        'Analytics y reportes accionables'
      ],
      kpis: [
        '300% aumento en leads calificados',
        '60% reducción en costo por adquisición',
        '5x retorno de inversión publicitaria'
      ],
      cta: 'Ver Planes de Marketing',
      plans: [
        {
          id: 'marketing-starter',
          name: 'Marketing Básico',
          subtitle: 'Visibilidad constante en redes',
          price: '$297 USD/mes',
          popular: false,
          features: [
            'Gestión de 2 redes sociales principales',
            '12 publicaciones mensuales optimizadas',
            'Diseño gráfico profesional para posts',
            'Reportes de alcance y engagement',
            'Respuesta a comentarios y mensajes'
          ],
          cta: 'Comenzar Marketing'
        },
        {
          id: 'marketing-pro',
          name: 'Marketing Pro',
          subtitle: 'Crecimiento acelerado con IA',
          price: '$497 USD/mes',
          popular: true,
          features: [
            '<strong>Todo lo del Plan Básico, y además:</strong>',
            'Gestión completa de Google Ads',
            'Campañas de Meta Ads (Facebook/Instagram)',
            '1 artículo de blog mensual optimizado para SEO',
            'Email marketing automatizado',
            'Dashboard de resultados en tiempo real'
          ],
          cta: 'Acelerar Crecimiento'
        },
        {
          id: 'marketing-enterprise',
          name: 'Marketing Enterprise',
          subtitle: 'Dominio total del mercado',
          price: '$997 USD/mes',
          popular: false,
          features: [
            '<strong>Todo lo del Plan Pro, y además:</strong>',
            'Estrategia de marketing 360° personalizada',
            'Campañas avanzadas multicanal (ilimitado)',
            'Automatización completa de ventas',
            'Reunión estratégica semanal',
            'Manager dedicado para tu cuenta'
          ],
          cta: 'Dominar Mercado'
        }
      ]
    },
    {
      id: 'development',
      title: 'Desarrollo Web de Alto Impacto',
      icon: 'fas fa-code',
      description: 'Construimos plataformas digitales que no solo se ven increíbles, sino que convierten visitantes en clientes y generan resultados de negocio reales.',
      features: [
        'Diseño UI/UX centrado en conversión',
        'Desarrollo con tecnologías modernas y rápidas',
        'E-commerce y pasarelas de pago seguras',
        'Optimización Core Web Vitals y SEO',
        'Panel de administración 100% intuitivo'
      ],
      kpis: [
        '85% mejora en velocidad de carga',
        '40% aumento en conversiones móviles',
        '70% mejora en ranking SEO'
      ],
      cta: 'Ver Planes de Desarrollo',
      plans: [
        {
          id: 'web-maintenance',
          name: 'Mantenimiento Web',
          subtitle: 'Tu sitio siempre protegido y actualizado',
          price: '$197 USD/mes',
          popular: false,
          features: [
            'Mantenimiento completo del sitio web',
            'Actualizaciones de seguridad semanales',
            'Backups diarios automatizados',
            'Monitoreo de rendimiento 24/7',
            'Soporte técnico prioritario por email'
          ],
          cta: 'Proteger mi Web'
        },
        {
          id: 'web-optimization',
          name: 'Optimización Continua',
          subtitle: 'Mejora constante con IA',
          price: '$397 USD/mes',
          popular: true,
          features: [
            '<strong>Todo lo del Plan Mantenimiento, y además:</strong>',
            'Optimización continua de velocidad y SEO',
            'A/B testing de elementos clave',
            'Informes mensuales de performance',
            'Pequeñas mejoras y actualizaciones',
            'Consultoría técnica mensual'
          ],
          cta: 'Optimizar mi Web'
        },
        {
          id: 'web-evolution',
          name: 'Evolución Web',
          subtitle: 'Tu socio tecnológico mensual',
          price: '$697 USD/mes',
          popular: false,
          features: [
            '<strong>Todo lo del Plan Optimización, y además:</strong>',
            'Desarrollo de nuevas funcionalidades',
            'Integraciones con herramientas externas',
            'Rediseño de secciones según necesidad',
            'Llamada estratégica semanal',
            'Desarrollador dedicado para tu proyecto'
          ],
          cta: 'Evolucionar mi Web'
        }
      ]
    },
    {
      id: 'security',
      title: 'Ciberseguridad Empresarial',
      icon: 'fas fa-shield-alt',
      description: 'Protegemos tu activo digital más valioso: la confianza de tus clientes. Seguridad proactiva con IA que te permite dormir tranquilo sabiendo que tu negocio está protegido.',
      features: [
        'Auditorías de vulnerabilidades (Pentesting)',
        'Monitoreo continuo 24/7 con IA',
        'Backup automático y recuperación rápida',
        'Certificados SSL y cifrado avanzado',
        'Capacitación en ciberseguridad para equipos'
      ],
      kpis: [
        '99.9% uptime garantizado',
        '95% reducción en vulnerabilidades',
        '24/7 monitoreo automatizado con IA'
      ],
      cta: 'Ver Planes de Seguridad',
      plans: [
        {
          id: 'security-basic',
          name: 'Protección Básica',
          subtitle: 'Seguridad esencial para tu negocio',
          price: '$197 USD/mes',
          popular: false,
          features: [
            'Firewall básico y protección antimalware',
            'Backup semanal automatizado',
            'Certificado SSL premium incluido',
            'Monitoreo básico de uptime',
            'Soporte de seguridad por email'
          ],
          cta: 'Proteger mi Negocio'
        },
        {
          id: 'security-advanced',
          name: 'Seguridad Avanzada',
          subtitle: 'Protección empresarial completa',
          price: '$397 USD/mes',
          popular: true,
          features: [
            '<strong>Todo lo del Plan Básico, y además:</strong>',
            'Monitoreo de seguridad 24/7 con IA',
            'Backup diario con múltiples ubicaciones',
            'Auditorías mensuales de vulnerabilidades',
            'Respuesta rápida ante incidentes',
            'Reportes ejecutivos de seguridad'
          ],
          cta: 'Securizar mi Empresa'
        },
        {
          id: 'security-enterprise',
          name: 'CISO Virtual',
          subtitle: 'Tu Director de Seguridad externo',
          price: '$697 USD/mes',
          popular: false,
          features: [
            '<strong>Todo lo del Plan Avanzado, y además:</strong>',
            'CISO (Director de Seguridad) virtual dedicado',
            'Pentesting trimestral profesional',
            'Plan de respuesta y simulacros de incidentes',
            'Compliance y cumplimiento normativo',
            'Capacitación mensual del equipo'
          ],
          cta: 'Contratar CISO'
        }
      ]
    }
  ],

  // PROYECTOS ÚNICOS (Para planes de proyectos únicos)
  projectPlans: [
    {
      id: 'starter-project',
      name: 'Plan Starter',
      subtitle: 'Para emprendedores y nuevos negocios',
      price: '$497 USD',
      popular: false,
      features: [
        'Landing page optimizada para conversión',
        'Diseño responsive profesional',
        'Formularios de contacto integrados',
        'SEO básico y Google Analytics',
        'Entrega en 7 días hábiles'
      ],
      cta: 'Comenzar Proyecto',
      ctaType: 'secondary',
      whatsappMessage: '¡Hola! Me interesa el *Plan Starter* de $497 USD para lanzar mi proyecto. ¿Podemos conversar?'
    },
    {
      id: 'growth-project',
      name: 'Plan Growth',
      subtitle: 'Para PYMEs en expansión',
      price: '$997 USD',
      popular: true,
      features: [
        'Todo del Plan Starter',
        'Sitio web completo (hasta 10 páginas)',
        'E-commerce básico integrado',
        'Panel de administración intuitivo',
        '3 meses de soporte incluidos'
      ],
      cta: 'Acelerar Crecimiento',
      ctaType: 'primary',
      whatsappMessage: '¡Hola! Me interesa el *Plan Growth* de $997 USD. Busco una solución web completa para mi empresa.'
    },
    {
      id: 'enterprise-project',
      name: 'Plan Enterprise',
      subtitle: 'Para empresas líderes',
      price: 'Personalizado',
      popular: false,
      features: [
        'Todo del Plan Growth',
        'Desarrollo completamente personalizado',
        'Integraciones complejas (CRM, ERP, APIs)',
        'Ciberseguridad de grado empresarial',
        'Soporte prioritario y consultoría estratégica'
      ],
      cta: 'Agendar Reunión',
      ctaType: 'secondary',
      whatsappMessage: '¡Hola! Represento una empresa y me interesa el *Plan Enterprise*. ¿Podemos agendar una reunión?'
    }
  ],

  // Features for About Section - RESTAURADO
  features: [
    {
      icon: 'fas fa-robot',
      title: 'IA que Potencia',
      description: 'Optimizamos cada proceso con inteligencia artificial para entregar resultados superiores en menor tiempo, automatizando tareas repetitivas para que puedas enfocarte en hacer crecer tu negocio.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Toque Humano',
      description: 'Detrás de cada algoritmo hay un equipo apasionado que entiende tu negocio y objetivos únicos. La tecnología facilita, pero las personas conectan.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Resultados Medibles',
      description: 'Cada proyecto tiene KPIs claros y reportes transparentes que demuestran el impacto real en tu negocio. No prometemos magia, entregamos datos.'
    }
  ],

  // Benefits/Why Choose Us - RESTAURADO
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
      title: 'Soporte Global',
      description: 'Soporte técnico especializado con respuesta inmediata y seguimiento personalizado en cualquier zona horaria.'
    }
  ],

  // Hero Stats - RESTAURADO
  heroStats: [
    { target: 95, suffix: '%', label: 'Clientes satisfechos' },
    { target: 150, suffix: '+', label: 'Proyectos completados' },
    { target: 24, suffix: '/7', label: 'Soporte técnico' }
  ],

  // Contact Methods - ENFOQUE GLOBAL
contactMethods: [
  {
    icon: 'fab fa-whatsapp',
    title: 'WhatsApp Global',
    value: '+56 9 9996 8482',
    link: 'https://wa.me/56999968482'
  },
  {
    icon: 'fas fa-envelope',
    title: 'Email',
    value: 'francisco@laura.lat',
    link: 'mailto:francisco@laura.lat'
  },
  {
    icon: 'fas fa-clock',
    title: 'Respuesta',
    value: 'En menos de 2 horas',
    link: null
  },
  {
    icon: 'fas fa-map-marker-alt', // Cambiar ícono
    title: 'Ubicación', // Cambiar título
    value: 'Santiago, Chile • Madrid, España', // Cambiar valor
    link: null
  }
],

  // Contact Form Fields - MEJORADO PARA ENFOQUE GLOBAL
  contactForm: {
    fields: [
      {
        name: 'name',
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
        name: 'country',
        label: 'País',
        type: 'text',
        required: false,
        placeholder: '¿Desde dónde nos escribes?',
        gridColumn: 'full'
      },
      {
        name: 'service',
        label: '¿Qué necesitas?',
        type: 'select',
        required: true,
        gridColumn: 'full',
        options: [
          { value: '', label: 'Selecciona una opción' },
          { value: 'marketing-monthly', label: '📈 Plan Mensual - Marketing Digital' },
          { value: 'development-monthly', label: '💻 Plan Mensual - Desarrollo Web' },
          { value: 'security-monthly', label: '🛡️ Plan Mensual - Ciberseguridad' },
          { value: 'integral-monthly', label: '🔄 Plan Mensual - Solución Integral' },
          { value: 'web-project', label: '🚀 Proyecto - Desarrollo Web' },
          { value: 'consultancy', label: '🎯 Consultoría y Estrategia' },
          { value: 'custom', label: '✨ Proyecto Personalizado' }
        ]
      },
      {
        name: 'message',
        label: 'Cuéntanos tu proyecto',
        type: 'textarea',
        required: true,
        placeholder: 'Describe tu proyecto, objetivos, timeline y presupuesto aproximado. Entre más detalles, mejor podremos ayudarte...',
        gridColumn: 'full'
      }
    ],
    submitText: 'Enviar Consulta Gratuita',
    privacyText: 'Al enviar este formulario, aceptas que contactemos contigo para brindarte una consultoría gratuita sobre tu proyecto.'
  },

  // Footer Configuration - ENFOQUE GLOBAL
  footer: {
    sections: [
      {
        title: 'LAURA',
        type: 'brand',
        content: {
          description: 'Agencia digital global que combina creatividad humana con inteligencia artificial para transformar negocios y crear soluciones que realmente funcionan en cualquier parte del mundo.',
          socialLinks: true
        }
      },
      {
        title: 'Servicios Globales',
        type: 'links',
        content: {
          links: [
            { text: 'Marketing Digital con IA', url: '#servicios' },
            { text: 'Desarrollo Web Moderno', url: '#servicios' },
            { text: 'Ciberseguridad Empresarial', url: '#servicios' },
            { text: 'Planes Mensuales', url: '#planes' }
          ]
        }
      },
      {
        title: 'Empresa',
        type: 'links',
        content: {
          links: [
            { text: '¿Qué es LAURA?', url: '#nosotros' },
            { text: 'Contacto Global', url: '#contacto' },
            { text: 'Google Partner', url: 'https://www.google.com/partners/agency?id=5572476115' },
            { text: 'Política de Privacidad', url: '#' }
          ]
        }
      }
    ]
  },
// PLANES FILTRADOS POR ESPECIALIDAD
specialtyPlans: {
  marketing: {
    title: 'Marketing Digital',
    subtitle: 'Estrategias que generan leads y aumentan ventas',
    plans: [
      {
        id: 'marketing-consultoria',
        name: 'Consultoría Marketing',
        subtitle: 'Análisis completo y estrategia',
        price: '$297 USD',
        duration: '1 mes',
        popular: false,
        features: [
          'Auditoría completa de marketing actual',
          'Análisis de competencia y mercado',
          'Estrategia de contenidos personalizada',
          'Plan de implementación detallado',
          'Sesión de consultoría 1:1 (2 horas)'
        ],
        whatsappMessage: '¡Hola! Me interesa la *Consultoría de Marketing* de $297 USD. ¿Podemos conversar sobre mi estrategia digital?'
      },
      {
        id: 'marketing-basico',
        name: 'Marketing Básico',
        subtitle: 'Presencia constante y crecimiento',
        price: '$497 USD/mes',
        duration: '3 meses mínimo',
        popular: false,
        features: [
          'Gestión de 2 redes sociales',
          '12 publicaciones mensuales',
          'Diseño gráfico profesional',
          'Respuesta a comentarios',
          'Reporte mensual básico'
        ],
        whatsappMessage: '¡Hola! Me interesa el *Marketing Básico* de $497 USD/mes. ¿Podemos conversar sobre los detalles?'
      },
      {
        id: 'marketing-pro',
        name: 'Marketing Pro',
        subtitle: 'Crecimiento acelerado con IA',
        price: '$997 USD/mes',
        duration: 'Mensual',
        popular: true,
        features: [
          'Todo del plan básico',
          'Google Ads optimizado',
          'Facebook/Instagram Ads',
          'Email marketing automatizado',
          'Blog SEO (1 artículo/mes)',
          'Dashboard en tiempo real'
        ],
        whatsappMessage: '¡Hola! Me interesa el *Marketing Pro* de $997 USD/mes. ¿Podemos agendar una llamada?'
      }
    ]
  },
  development: {
    title: 'Desarrollo Web',
    subtitle: 'Sitios web que convierten y funcionan',
    plans: [
      {
        id: 'dev-consultoria',
        name: 'Consultoría Web',
        subtitle: 'Análisis técnico y recomendaciones',
        price: '$197 USD',
        duration: '1 mes',
        popular: false,
        features: [
          'Auditoría técnica completa',
          'Análisis de velocidad y SEO',
          'Recomendaciones de UX/UI',
          'Plan de optimización',
          'Informe técnico detallado'
        ],
        whatsappMessage: '¡Hola! Me interesa la *Consultoría Web* de $197 USD. ¿Podemos revisar mi sitio web?'
      },
      {
        id: 'dev-basico',
        name: 'Desarrollo Básico',
        subtitle: 'Sitio web profesional',
        price: '$697 USD',
        duration: '3 meses',
        popular: false,
        features: [
          'Diseño web responsive',
          'Hasta 5 páginas',
          'Formularios de contacto',
          'SEO básico',
          'Hosting por 1 año incluido'
        ],
        whatsappMessage: '¡Hola! Me interesa el *Desarrollo Básico* de $697 USD. ¿Podemos conversar sobre mi proyecto web?'
      },
      {
        id: 'dev-pro',
        name: 'Desarrollo Pro',
        subtitle: 'Plataforma completa optimizada',
        price: '$1,297 USD',
        duration: 'Proyecto completo',
        popular: true,
        features: [
          'Sitio web completo (hasta 10 páginas)',
          'Panel de administración',
          'E-commerce básico',
          'Integraciones (CRM, Analytics)',
          'Optimización avanzada',
          '6 meses de soporte incluido'
        ],
        whatsappMessage: '¡Hola! Me interesa el *Desarrollo Pro* de $1,297 USD. ¿Podemos agendar una reunión?'
      }
    ]
  },
  security: {
    title: 'Ciberseguridad',
    subtitle: 'Protección integral para tu negocio digital',
    plans: [
      {
        id: 'security-auditoria',
        name: 'Auditoría Seguridad',
        subtitle: 'Diagnóstico completo de vulnerabilidades',
        price: '$397 USD',
        duration: '1 mes',
        popular: false,
        features: [
          'Escaneo de vulnerabilidades',
          'Análisis de configuración',
          'Reporte de riesgos',
          'Plan de corrección',
          'Recomendaciones de seguridad'
        ],
        whatsappMessage: '¡Hola! Me interesa la *Auditoría de Seguridad* de $397 USD. ¿Podemos revisar mi infraestructura?'
      },
      {
        id: 'security-basico',
        name: 'Protección Básica',
        subtitle: 'Seguridad esencial',
        price: '$297 USD/mes',
        duration: '3 meses mínimo',
        popular: false,
        features: [
          'Firewall básico',
          'Backup semanal',
          'Monitoreo de uptime',
          'Certificado SSL',
          'Soporte por email'
        ],
        whatsappMessage: '¡Hola! Me interesa la *Protección Básica* de $297 USD/mes. ¿Podemos conversar sobre seguridad?'
      },
      {
        id: 'security-pro',
        name: 'Seguridad Pro',
        subtitle: 'Protección empresarial 24/7',
        price: '$697 USD/mes',
        duration: 'Mensual',
        popular: true,
        features: [
          'Monitoreo 24/7',
          'Backup diario automático',
          'Respuesta a incidentes',
          'Auditorías mensuales',
          'Soporte prioritario',
          'Reportes ejecutivos'
        ],
        whatsappMessage: '¡Hola! Me interesa la *Seguridad Pro* de $697 USD/mes. ¿Podemos agendar una llamada?'
      }
    ]
  }
},
  // Certifications - RESTAURADO
  certifications: [
    { name: 'Google Partner', logo: './assets/img/google-partner-badge.png' },
    { name: 'Meta Business Partner', logo: './assets/img/meta-partner-badge.png' },
    { name: 'Shopify Partner', logo: './assets/img/shopify-partner-badge.png' },
    { name: 'HubSpot Solutions Partner', logo: './assets/img/hubspot-partner-badge.png' },
    { name: 'Potenciado por Gemini', logo: './assets/img/gemini-partner-badge.png' }
  ],
techStack: [
    { name: 'Google Analytics & Ads', logo: './assets/img/google-logo.png' },
    { name: 'Power BI', logo: './assets/img/powerbi-logo.png' },
    { name: 'Asana', logo: './assets/img/asana-logo.png' },
    { name: 'Claude AI', logo: './assets/img/claude-logo.png' },
    { name: 'Firebase', logo: './assets/img/firebase-logo.png' },
    { name: 'cPanel', logo: './assets/img/cpanel-logo.png' },
    { name: 'GTmetrix', logo: './assets/img/gtmetrix-logo.png' },
    { name: 'Meta Business', logo: './assets/img/meta-logo.png' }
],
 

  // Animation Settings - RESTAURADO
  animations: {
    fadeInDelay: 100,
    counterDuration: 2000,
    floatingDuration: 3000,
    pulseDuration: 2000
  },

  // Performance Settings - RESTAURADO
  performance: {
    lazyLoadOffset: 100,
    debounceDelay: 250,
    preloadImages: [
      './assets/img/ICONO-LAURA-AGENCIA-SEGURIDAD.webp'
    ]
  },

  // SEO Configuration - OPTIMIZADO PARA ENFOQUE GLOBAL
  seo: {
    title: 'LAURA Digital Agency | Desarrollo Web, Marketing Digital y Ciberseguridad con IA para Empresas Globales',
    description: 'Agencia digital especializada en transformar negocios globalmente con desarrollo web, marketing digital y ciberseguridad. Soluciones potenciadas con IA para empresas de todos los tamaños.',
    keywords: 'agencia digital, desarrollo web, marketing digital, ciberseguridad, inteligencia artificial, planes mensuales, consultoría digital, proyectos globales',
    ogImage: './assets/img/LOGO-AGENCIA-LAURA.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LAURA Digital Agency',
      url: 'https://laura.lat',
      logo: './assets/img/LOGO-AGENCIA-LAURA.webp',
      description: 'Agencia digital global especializada en desarrollo web, ciberseguridad, marketing digital y consultoría.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CL',
        addressLocality: 'Santiago'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+56999968482',
        contactType: 'customer service'
      },
      areaServed: 'Worldwide'
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

// Render SVG Icon utility - RESTAURADO
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
    `
  };
  
  return icons[iconType] || icons['code-svg'];
};

