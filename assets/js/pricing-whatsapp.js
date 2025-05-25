/**
 * LAURA DIGITAL AGENCY - Pricing Section Fix
 * Sección de planes mejorada con WhatsApp integration
 */

// Actualizar la configuración de planes en config.js
window.LAURA_CONFIG.pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Para emprendedores',
    price: 'Desde 35 UF',
    icon: 'fas fa-rocket',
    popular: false,
    features: [
      'Landing page optimizada',
      'Seguridad básica',
      'Marketing inicial',
      'Consultoría estratégica'
    ],
    cta: 'Empezar proyecto',
    ctaType: 'secondary',
    whatsappMessage: '¡Hola! Me interesa el plan *Starter* desde 35 UF. Me gustaría conocer más detalles sobre qué incluye para emprendedores y cómo pueden ayudarme a comenzar mi proyecto digital.'
  },
  {
    id: 'growth',
    name: 'Growth',
    subtitle: 'Para PYMEs en crecimiento',
    price: 'Desde 95 UF',
    icon: 'fas fa-chart-line',
    popular: true,
    features: [
      'Sitio web completo + E-commerce',
      'Seguridad avanzada',
      'Marketing multicanal',
      'Transformación digital'
    ],
    cta: 'Acelerar crecimiento',
    ctaType: 'primary',
    whatsappMessage: '¡Hola! Estoy interesado en el plan *Growth* desde 95 UF. Mi empresa está en crecimiento y necesito una solución integral que incluya sitio web completo, e-commerce y marketing multicanal. ¿Podemos conversar sobre los detalles?'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Para empresas líderes',
    price: 'Personalizado',
    icon: 'fas fa-building',
    popular: false,
    features: [
      'Desarrollo personalizado',
      'Seguridad empresarial',
      'Marketing con IA avanzada',
      'Soporte dedicado 24/7'
    ],
    cta: 'Contactar',
    ctaType: 'secondary',
    whatsappMessage: '¡Hola! Represento una empresa establecida y me interesa el plan *Enterprise* personalizado. Necesitamos una solución empresarial completa con desarrollo personalizado, seguridad avanzada y soporte 24/7. ¿Podemos agendar una reunión para discutir nuestras necesidades específicas?'
  }
];

// Función para generar enlaces de WhatsApp
function generateWhatsAppLink(message) {
  const phoneNumber = '56999968482';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Función mejorada para renderizar pricing
function renderImprovedPricing() {
  const container = document.querySelector('.pricing-grid');
  if (!container) return;

  const plans = window.LAURA_CONFIG.pricingPlans;
  
  container.innerHTML = plans.map(plan => `
    <div class="pricing-card-improved ${plan.popular ? 'popular' : ''} hover-lift fade-in" data-plan="${plan.id}">
      ${plan.popular ? '<div class="popular-badge-improved"><i class="fas fa-star"></i> Más Popular</div>' : ''}
      
      <div class="pricing-header-improved">
        <div class="plan-icon-improved">
          <i class="${plan.icon}"></i>
        </div>
        <h3 class="plan-name-improved">${plan.name}</h3>
        <p class="plan-subtitle-improved">${plan.subtitle}</p>
        <div class="plan-price-improved">${plan.price}</div>
      </div>
      
      <div class="pricing-features-improved">
        <ul class="plan-features-improved">
          ${plan.features.map(feature => `
            <li class="feature-item-improved">
              <i class="fas fa-check-circle feature-check-improved"></i>
              <span>${feature}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <div class="pricing-footer-improved">
        <a href="${generateWhatsAppLink(plan.whatsappMessage)}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="plan-cta-improved btn-${plan.ctaType}-improved">
          <i class="fab fa-whatsapp"></i>
          <span>${plan.cta}</span>
        </a>
      </div>
    </div>
  `).join('');

  // Agregar estilos mejorados
  addImprovedPricingStyles();
}

// Estilos mejorados para la sección de pricing
function addImprovedPricingStyles() {
  if (document.getElementById('improved-pricing-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'improved-pricing-styles';
  styles.textContent = `
    /* Pricing Grid Layout */
    .pricing-grid {
      display: grid;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    @media (min-width: 768px) {
      .pricing-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2.5rem;
      }
    }
    
    /* Pricing Card */
    .pricing-card-improved {
      background: white;
      border-radius: 1.5rem;
      padding: 0;
      position: relative;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      border: 2px solid #f1f5f9;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 500px;
    }
    
    .pricing-card-improved:hover {
      transform: translateY(-12px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }
    
    .pricing-card-improved.popular {
      transform: scale(1.05);
      border-color: #667eea;
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
      z-index: 10;
    }
    
    .pricing-card-improved.popular:hover {
      transform: scale(1.05) translateY(-12px);
      box-shadow: 0 25px 60px rgba(102, 126, 234, 0.25);
    }
    
    /* Popular Badge */
    .popular-badge-improved {
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 0 0 1rem 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      z-index: 5;
    }
    
    /* Pricing Header */
    .pricing-header-improved {
      text-align: center;
      padding: 3rem 2rem 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      position: relative;
    }
    
    .pricing-card-improved.popular .pricing-header-improved {
      padding-top: 4rem;
    }
    
    .plan-icon-improved {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: white;
      font-size: 2rem;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }
    
    .pricing-card-improved:hover .plan-icon-improved {
      transform: scale(1.1) rotate(5deg);
    }
    
    .pricing-card-improved.popular .plan-icon-improved {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
    }
    
    .plan-name-improved {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: #1e293b;
    }
    
    .plan-subtitle-improved {
      color: #64748b;
      margin-bottom: 1.5rem;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .plan-price-improved {
      font-size: 2.5rem;
      font-weight: 900;
      color: #667eea;
      line-height: 1;
    }
    
    .pricing-card-improved.popular .plan-price-improved {
      color: #ff6b6b;
    }
    
    /* Pricing Features */
    .pricing-features-improved {
      padding: 2rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .plan-features-improved {
      list-style: none;
      margin: 0;
      padding: 0;
      flex-grow: 1;
    }
    
    .feature-item-improved {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
      font-size: 1rem;
      line-height: 1.6;
      color: #475569;
    }
    
    .feature-item-improved:last-child {
      margin-bottom: 0;
    }
    
    .feature-check-improved {
      color: #10b981;
      font-size: 1.125rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }
    
    /* Pricing Footer */
    .pricing-footer-improved {
      padding: 2rem;
      border-top: 1px solid #f1f5f9;
      margin-top: auto;
    }
    
    .plan-cta-improved {
      width: 100%;
      padding: 1rem 2rem;
      border-radius: 1rem;
      font-size: 1.125rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      position: relative;
      overflow: hidden;
      border: none;
      cursor: pointer;
    }
    
    .plan-cta-improved::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    .plan-cta-improved:hover::before {
      left: 100%;
    }
    
    .btn-primary-improved {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .btn-primary-improved:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
    }
    
    .btn-secondary-improved {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
    }
    
    .btn-secondary-improved:hover {
      background: #667eea;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
    }
    
    .pricing-card-improved.popular .btn-primary-improved {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }
    
    .pricing-card-improved.popular .btn-primary-improved:hover {
      background: linear-gradient(135deg, #ff5252 0%, #e53e3e 100%);
      box-shadow: 0 15px 35px rgba(255, 107, 107, 0.5);
    }
    
    /* WhatsApp Icon Styling */
    .plan-cta-improved .fab.fa-whatsapp {
      font-size: 1.25rem;
      color: currentColor;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 767px) {
      .pricing-card-improved.popular {
        transform: none;
        margin-bottom: 2rem;
      }
      
      .pricing-card-improved.popular:hover {
        transform: translateY(-5px);
      }
      
      .plan-name-improved {
        font-size: 1.75rem;
      }
      
      .plan-price-improved {
        font-size: 2rem;
      }
      
      .plan-icon-improved {
        width: 4rem;
        height: 4rem;
        font-size: 1.5rem;
      }
      
      .pricing-header-improved {
        padding: 2.5rem 1.5rem 1.5rem;
      }
      
      .pricing-card-improved.popular .pricing-header-improved {
        padding-top: 3.5rem;
      }
    }
    
    /* Animation Keyframes */
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .pricing-card-improved {
      animation: slideInUp 0.8s ease-out;
    }
    
    .pricing-card-improved:nth-child(1) {
      animation-delay: 0.1s;
    }
    
    .pricing-card-improved:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .pricing-card-improved:nth-child(3) {
      animation-delay: 0.3s;
    }
    
    /* Accessibility */
    .plan-cta-improved:focus {
      outline: 3px solid rgba(102, 126, 234, 0.5);
      outline-offset: 2px;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .pricing-card-improved,
      .plan-icon-improved,
      .plan-cta-improved {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Función para inicializar la sección mejorada
function initImprovedPricing() {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderImprovedPricing);
  } else {
    renderImprovedPricing();
  }
}

// Sobrescribir el componente de pricing original
if (window.LAURA_Components && window.LAURA_Components.renderPricing) {
  window.LAURA_Components.renderPricing = renderImprovedPricing;
}

// Inicializar
initImprovedPricing();

// También agregar la función globalmente para uso manual
window.renderImprovedPricing = renderImprovedPricing;