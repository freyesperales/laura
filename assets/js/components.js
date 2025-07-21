/**
 * LAURA DIGITAL AGENCY - Components Module
 * Dynamic component generation for scalable architecture
 * Version: 2.2.0 - Fully Restored + Enhanced
 */

window.LAURA_Components = {
  
  /**
   * Render Services Grid - 3 ÁREAS PRINCIPALES RESTAURADAS
   */
  renderServices() {
    const container = document.querySelector('.services-grid');
    if (!container) {
      console.log('❌ Services container not found');
      return;
    }

    console.log('🔧 Rendering 3 main service areas');
    this.updateServicesContainer(container);
  },
  
  /**
   * Update services container with interactive buttons
   */
  updateServicesContainer(container) {
    const services = getConfig('services', []);
    console.log('🔧 Rendering services:', services.length);
    
    container.innerHTML = services.map(service => `
      <div class="service-card card hover-lift fade-in" data-service="${service.id}">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-description">${service.description}</p>
        
        ${service.kpis ? `
          <div class="service-kpis">
            <div class="kpis-title">📊 Resultados promedio de nuestros clientes:</div>
            <ul class="kpis-list">
              ${service.kpis.map(kpi => `<li><i class="fas fa-chart-line"></i><strong>${kpi}</strong></li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <ul class="service-features">
          ${service.features.map(feature => `
            <li><i class="fas fa-check"></i>${feature}</li>
          `).join('')}
        </ul>
        
        <button class="service-cta btn btn-outline" type="button" data-service-id="${service.id}" onclick="showServicePlans('${service.id}')">
          ${service.cta}
        </button>
      </div>
    `).join('');

    console.log('✅ Services updated');
    
    // Make sure the functions are globally available
    this.ensureGlobalFunctions();
    
    // Add CSS for service cards
    this.addServiceStyles();
  },
  
  /**
   * Ensure global functions are available
   */
  ensureGlobalFunctions() {
    // Make showServicePlans globally available
    if (!window.showServicePlans) {
      window.showServicePlans = (serviceId) => {
        console.log('🎯 Global showServicePlans called with:', serviceId);
        this.showServicePlans(serviceId);
      };
      console.log('🔧 Global showServicePlans function created');
    }
    
    // Make selectPlan globally available
    if (!window.selectPlan) {
      window.selectPlan = (planId, planName) => {
        console.log('📋 Global selectPlan called with:', planId, planName);
        this.selectPlan(planId, planName);
      };
      console.log('🔧 Global selectPlan function created');
    }
    
    // Make scrollToContact globally available
    if (!window.scrollToContact) {
      window.scrollToContact = () => {
        console.log('📍 Global scrollToContact called');
        this.scrollToContact();
      };
      console.log('🔧 Global scrollToContact function created');
    }
  },
  
  /**
   * Show service plans dynamically - MEJORADO
   */
  showServicePlans(serviceId) {
    console.log('🎯 Showing plans for service:', serviceId);
    
    const services = getConfig('services', []);
    const service = services.find(s => s.id === serviceId);
    
    if (!service || !service.plans) {
      console.log('❌ Service not found or no plans:', serviceId);
      return;
    }

    const container = document.getElementById('service-plans-container');
    if (!container) {
      console.log('❌ Plans container not found');
      return;
    }
    
    const plansGrid = container.querySelector('.service-plans-grid');
    const title = container.querySelector('.service-plans-title');
    
    // Update title
    if (title) {
      title.textContent = `Planes Mensuales - ${service.title}`;
    }
    
    // Render professional pricing cards
    if (plansGrid) {
      plansGrid.innerHTML = service.plans.map((plan, index) => `
        <div class="pricing-card ${plan.popular ? 'popular' : ''}" data-plan="${plan.id}">
          ${plan.popular ? '<div class="popular-badge">Más Popular</div>' : ''}
          
          <div class="card-header">
            <div class="plan-icon">
              ${this.getServiceEmoji(serviceId)}
            </div>
            <h3 class="plan-name">${plan.name}</h3>
            <p class="plan-subtitle">${plan.subtitle}</p>
            <div class="plan-price">${plan.price}</div>
          </div>
          
          <div class="card-features">
            <ul class="features-list">
              ${plan.features.map(feature => `
                <li class="feature-item">
                  <i class="fas fa-check feature-check"></i>
                  <span>${feature}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div class="card-footer">
            <a href="${this.generateWhatsAppLink(serviceId, plan)}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="cta-btn ${plan.popular ? 'primary' : 'secondary'}">
              💬 ${plan.cta}
            </a>
          </div>
        </div>
      `).join('');
    }
    
    // Show container with smooth animation
    container.classList.remove('hidden');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      container.style.transition = 'all 0.5s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 50);
    
    // Scroll to plans
    setTimeout(() => {
      const offset = 100;
      const elementPosition = container.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }, 200);

    // Add professional pricing styles
    this.addProfessionalPricingStyles();
    
    console.log('✅ Professional plans rendered');
  },

  /**
   * Get service emoji based on service ID
   */
  getServiceEmoji(serviceId) {
    const emojis = {
      'marketing': '📈',
      'development': '💻',
      'security': '🛡️'
    };
    return emojis[serviceId] || '⭐';
  },

  /**
   * Generate WhatsApp link for plan
   */
  generateWhatsAppLink(serviceId, plan) {
    const basePhone = '56999968482';
    const serviceName = this.getServiceName(serviceId);
    
    const message = `¡Hola! Me interesa el plan *${plan.name}* de ${serviceName} (${plan.price}). ¿Podemos conversar sobre los detalles y próximos pasos?`;
    
    return `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Get service name for WhatsApp message
   */
  getServiceName(serviceId) {
    const names = {
      'marketing': 'Marketing Digital',
      'development': 'Desarrollo Web',
      'security': 'Ciberseguridad'
    };
    return names[serviceId] || 'LAURA';
  },

  /**
   * Handle plan selection and form pre-filling
   */
  selectPlan(planId, planName) {
    console.log('📋 Plan selected:', planId, planName);
    
    // Pre-fill contact form with selected plan
    const form = document.getElementById('contact-form');
    if (!form) {
      console.log('❌ Contact form not found - looking for alternatives');
      
      // Try alternative selectors
      const altForm = document.querySelector('form[name="contact"], .contact-form form, #contacto form');
      if (altForm) {
        console.log('✅ Found alternative contact form');
        this.fillContactForm(altForm, planId, planName);
      } else {
        console.log('❌ No contact form found');
      }
    } else {
      this.fillContactForm(form, planId, planName);
    }
    
    // Scroll to contact form
    this.scrollToContact();
    
    // Track plan selection
    this.trackPlanSelection(planId, planName);
  },
  
  /**
   * Fill contact form with plan information
   */
  fillContactForm(form, planId, planName) {
    console.log('📝 Filling contact form with:', planName);
    
    // Find service select dropdown
    const serviceSelects = [
      form.querySelector('select[name="service"]'),
      form.querySelector('select[name="servicio"]'),
      form.querySelector('select#service'),
      form.querySelector('select#servicio')
    ].filter(Boolean);
    
    if (serviceSelects.length > 0) {
      const serviceSelect = serviceSelects[0];
      console.log('📝 Found service select:', serviceSelect);
      
      // Map plan ID to service value
      let serviceValue = 'custom'; // default
      if (planId.includes('marketing')) serviceValue = 'marketing-monthly';
      else if (planId.includes('development') || planId.includes('web')) serviceValue = 'development-monthly';
      else if (planId.includes('security')) serviceValue = 'security-monthly';
      
      // Try to set the value
      const options = Array.from(serviceSelect.options);
      const matchingOption = options.find(option => 
        option.value === serviceValue || 
        option.textContent.toLowerCase().includes(serviceValue.split('-')[0])
      );
      
      if (matchingOption) {
        serviceSelect.value = matchingOption.value;
        console.log('✅ Service selected:', serviceValue);
      } else {
        console.log('⚠️ No matching service option found');
      }
    }
    
    // Find message textarea
    const textareas = [
      form.querySelector('textarea[name="message"]'),
      form.querySelector('textarea[name="mensaje"]'),
      form.querySelector('textarea#message'),
      form.querySelector('textarea#mensaje'),
      form.querySelector('textarea')
    ].filter(Boolean);
    
    if (textareas.length > 0) {
      const messageTextarea = textareas[0];
      console.log('📝 Found message textarea');
      
      if (!messageTextarea.value.trim()) {
        const message = `Hola! Estoy interesado en el plan ${planName}. 

Me gustaría conocer más detalles sobre:
- Tiempo de implementación
- Qué incluye exactamente el servicio
- Proceso de trabajo
- Siguiente paso para empezar

¡Gracias!`;
        
        messageTextarea.value = message;
        console.log('✅ Message pre-filled');
        
        // Add visual feedback
        messageTextarea.style.borderColor = '#e21e5c';
        messageTextarea.style.boxShadow = '0 0 8px rgba(226, 30, 92, 0.3)';
        
        setTimeout(() => {
          messageTextarea.style.borderColor = '';
          messageTextarea.style.boxShadow = '';
        }, 2000);
      }
    }
    
    // Show success notification
    this.showNotification(`Formulario actualizado con ${planName}`, 'success');
  },
  
  /**
   * Show notification to user
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10B981' : '#e21e5c'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-weight: 500;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },
  
  /**
   * Scroll to contact section
   */
  scrollToContact() {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const targetPosition = contactSection.offsetTop - navbarHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      console.log('📍 Scrolled to contact section');
    } else {
      console.log('❌ Contact section not found');
    }
  },

  /**
   * Render Featured Blog Articles
   */
  renderBlogArticles() {
    const container = document.querySelector('.blog-grid');
    if (!container) return;

    // Featured articles
    const featuredArticles = [
      {
        id: 'ia-transformacion-digital-2025',
        title: 'IA y Transformación Digital: Tendencias 2025',
        excerpt: 'Descubre cómo la inteligencia artificial está revolucionando los negocios y qué esperar en los próximos meses.',
        category: 'Inteligencia Artificial',
        readTime: '5 min',
        image: 'https://via.placeholder.com/400x200/e21e5c/ffffff?text=IA+2025',
        author: 'Equipo LAURA',
        date: '2025-01-15',
        featured: true
      },
      {
        id: 'ciberseguridad-pymes-guia-completa',
        title: 'Ciberseguridad para PYMEs: Guía Completa',
        excerpt: 'Todo lo que necesitas saber para proteger tu empresa de las amenazas digitales más comunes en 2025.',
        category: 'Ciberseguridad',
        readTime: '8 min',
        image: 'https://via.placeholder.com/400x200/764ba2/ffffff?text=Seguridad+PYME',
        author: 'Equipo LAURA',
        date: '2025-01-10',
        featured: true
      },
      {
        id: 'marketing-digital-ia-resultados',
        title: 'Marketing Digital + IA = Resultados Exponenciales',
        excerpt: 'Casos reales de cómo nuestros clientes multiplicaron sus conversiones usando marketing impulsado por IA.',
        category: 'Marketing Digital',
        readTime: '6 min',
        image: 'https://via.placeholder.com/400x200/10b981/ffffff?text=Marketing+IA',
        author: 'Equipo LAURA',
        date: '2025-01-05',
        featured: true
      }
    ];
    
    container.innerHTML = featuredArticles.map(article => `
      <article class="blog-card hover-lift fade-in">
        <div class="blog-image">
          <img src="${article.image}" alt="${article.title}" loading="lazy"
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlMjFlNWMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFydMOtY3VsbzwvdGV4dD48L3N2Zz4='">
          <div class="blog-category">${article.category}</div>
        </div>
        <div class="blog-content">
          <h3 class="blog-title">${article.title}</h3>
          <p class="blog-excerpt">${article.excerpt}</p>
          <div class="blog-meta">
            <div class="blog-author">
              <i class="fas fa-user"></i>
              <span>${article.author}</span>
            </div>
            <div class="blog-read-time">
              <i class="fas fa-clock"></i>
              <span>${article.readTime}</span>
            </div>
          </div>
          <a href="./blog.html#${article.id}" class="blog-read-more">
            Leer artículo <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `).join('');

    this.addBlogStyles();
  },

  /**
   * Render Features List (About Section)
   */
  renderFeatures() {
    const container = document.querySelector('.features-list');
    if (!container) return;

    const features = getConfig('features', []);
    
    container.innerHTML = features.map(feature => `
      <div class="feature-item">
        <div class="feature-icon">
          <i class="${feature.icon}"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">${feature.title}</h4>
          <p class="feature-description">${feature.description}</p>
        </div>
      </div>
    `).join('');
  },

  /**
   * Render Benefits Grid
   */
  renderBenefits() {
    const container = document.querySelector('.benefits-grid');
    if (!container) return;

    const benefits = getConfig('benefits', []);
    
    container.innerHTML = benefits.map(benefit => `
      <div class="card hover-lift fade-in">
        <div class="benefit-content">
          <div class="benefit-icon">
            <i class="${benefit.icon}"></i>
          </div>
          <h3 class="benefit-title">${benefit.title}</h3>
          <p class="benefit-description">${benefit.description}</p>
        </div>
      </div>
    `).join('');
  },

  /**
   * Render Contact Methods
   */
  renderContactMethods() {
    const container = document.querySelector('.contact-methods');
    if (!container) return;

    const methods = getConfig('contactMethods', []);
    
    container.innerHTML = methods.map(method => `
      <div class="contact-method">
        <div class="contact-icon">
          <i class="${method.icon}"></i>
        </div>
        <div class="contact-details">
          <p class="contact-title">${method.title}</p>
          ${method.link ? 
            `<a href="${method.link}" class="contact-value">${method.value}</a>` :
            `<p class="contact-value">${method.value}</p>`
          }
        </div>
      </div>
    `).join('');
  },

  /**
   * Render Contact Form
   */
  renderContactForm() {
    const container = document.querySelector('.contact-form');
    if (!container) {
      console.log('❌ Contact form container not found');
      return;
    }

    const formConfig = getConfig('contactForm', {});
    const fields = formConfig.fields || [];
    
    container.innerHTML = `
      ${fields.map(field => this.renderFormField(field)).join('')}
      <div class="form-group">
        <button type="submit" class="btn-primary form-submit">
          <i class="fas fa-paper-plane"></i>
          <span>${formConfig.submitText || 'Enviar mensaje'}</span>
        </button>
      </div>
      <p class="form-privacy">${formConfig.privacyText || ''}</p>
    `;
    
    console.log('✅ Contact form rendered');
  },

  /**
   * Render Individual Form Field
   */
  renderFormField(field) {
    const gridClass = field.gridColumn === 'half' ? 'form-group' : 'form-group form-group-full';
    
    let inputHTML = '';
    
    switch (field.type) {
      case 'textarea':
        inputHTML = `<textarea 
          name="${field.name}" 
          id="${field.name}"
          class="form-textarea"
          ${field.required ? 'required' : ''}
          placeholder="${field.placeholder || ''}"
          rows="4"
        ></textarea>`;
        break;
        
      case 'select':
        inputHTML = `<select 
          name="${field.name}" 
          id="${field.name}"
          class="form-select"
          ${field.required ? 'required' : ''}
        >
          ${field.options.map(option => 
            `<option value="${option.value}">${option.label}</option>`
          ).join('')}
        </select>`;
        break;
        
      default:
        inputHTML = `<input 
          type="${field.type}" 
          name="${field.name}" 
          id="${field.name}"
          class="form-input"
          ${field.required ? 'required' : ''}
          placeholder="${field.placeholder || ''}"
        >`;
    }
    
    return `
      <div class="${gridClass}">
        <label for="${field.name}" class="form-label">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        ${inputHTML}
      </div>
    `;
  },

  /**
   * Render Footer Content
   */
  renderFooter() {
    const container = document.querySelector('.footer-content');
    if (!container) return;

    const footerConfig = getConfig('footer', {});
    const sections = footerConfig.sections || [];
    
    container.innerHTML = sections.map(section => {
      if (section.type === 'brand') {
        return this.renderFooterBrand(section);
      } else if (section.type === 'links') {
        return this.renderFooterLinks(section);
      }
      return '';
    }).join('');
  },

  /**
   * Render Footer Brand Section
   */
  renderFooterBrand(section) {
    const company = getConfig('company', {});
    const socialMedia = company.socialMedia || {};
    
    return `
      <div class="footer-section footer-brand">
        <div class="footer-logo">
          <img src="./assets/img/logo.svg" alt="LAURA Logo" class="footer-logo-svg">
        </div>
        <p class="footer-description">${section.content.description}</p>
        ${section.content.socialLinks ? `
          <div class="social-links">
            <a href="${socialMedia.linkedin}" class="social-link" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="${socialMedia.twitter}" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="${socialMedia.instagram}" class="social-link" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Render Footer Links Section
   */
  renderFooterLinks(section) {
    return `
      <div class="footer-section">
        <h4 class="footer-title">${section.title}</h4>
        <ul class="footer-links">
          ${section.content.links.map(link => `
            <li><a href="${link.url}" class="footer-link" ${link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${link.text}</a></li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  /**
   * Track plan selection
   */
  trackPlanSelection(planId, planName) {
    if (window.LAURA_Forms && typeof window.LAURA_Forms.trackFormSubmission === 'function') {
      window.LAURA_Forms.trackFormSubmission('plan_selection', {
        planId: planId,
        planName: planName,
        timestamp: new Date().toISOString()
      });
    }
    
    // Google Analytics tracking if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'plan_selected', {
        'plan_id': planId,
        'plan_name': planName,
        'event_category': 'pricing'
      });
    }
    
    console.log('📊 Plan selection tracked:', planId);
  },
/**
 * Initialize Specialty Filters System
 */
initSpecialtyFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const plansContainer = document.getElementById('filtered-plans');
  
  if (!plansContainer) return;
  
  // Event listeners para filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const specialty = btn.getAttribute('data-specialty');
      
      // Actualizar estados de botones
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Renderizar planes
      this.renderSpecialtyPlans(specialty);
    });
  });
  
  // Cargar planes iniciales (marketing)
  this.renderSpecialtyPlans('marketing');
},

/**
 * Render Specialty Plans
 */
renderSpecialtyPlans(specialty) {
  const plansContainer = document.getElementById('filtered-plans');
  if (!plansContainer) return;
  
  const specialtyData = getConfig(`specialtyPlans.${specialty}`);
  if (!specialtyData) return;
  
  const plansHTML = `
    <div class="plans-header">
      <h3 class="plans-title">${specialtyData.title}</h3>
      <p class="plans-subtitle">${specialtyData.subtitle}</p>
    </div>
    <div class="plans-grid">
      ${specialtyData.plans.map(plan => `
        <div class="plan-card ${plan.popular ? 'popular' : ''}">
          ${plan.popular ? '<div class="plan-badge">Más Popular</div>' : ''}
          <div class="plan-header">
            <h4 class="plan-name">${plan.name}</h4>
            <p class="plan-subtitle">${plan.subtitle}</p>
            <div class="plan-price">${plan.price}</div>
            <div class="plan-duration">${plan.duration}</div>
          </div>
          <div class="plan-features">
            <ul>
              ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          <div class="plan-cta">
            <a href="${this.generateWhatsAppLink(plan.whatsappMessage)}" 
               target="_blank" 
               class="btn-plan ${plan.popular ? 'btn-primary' : 'btn-secondary'}">
              💬 Comenzar Ahora
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  plansContainer.innerHTML = plansHTML;
  
  console.log(`✅ ${specialty} plans rendered`);
},

/**
 * Generate WhatsApp link
 */
generateWhatsAppLink(message) {
  const phone = getConfig('company.whatsapp', '56999968482');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
},
  /**
   * Add Service Card Styles
   */
  addServiceStyles() {
    if (document.getElementById('service-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'service-styles';
    styles.textContent = `
      .service-icon {
        width: 3.5rem;
        height: 3.5rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: white;
        font-size: 1.5rem;
        box-shadow: 0 8px 25px rgba(226, 30, 92, 0.3);
      }
      
      .service-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }
      
      .service-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .service-kpis {
        background: rgba(226, 30, 92, 0.05);
        border: 1px solid rgba(226, 30, 92, 0.2);
        border-radius: 0.75rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .kpis-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 0.75rem;
      }

      .kpis-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .kpis-list li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      .kpis-list li:last-child {
        margin-bottom: 0;
      }

      .kpis-list i {
        color: var(--primary);
        font-size: 0.75rem;
      }
      
      .service-features {
        list-style: none;
        margin-bottom: 1.5rem;
        padding: 0;
      }
      
      .service-features li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }
      
      .service-features i {
        color: #10b981;
      }
      
      .service-cta {
        color: var(--primary);
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: 2px solid var(--border);
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        cursor: pointer;
        font-size: 0.875rem;
        width: 100%;
        justify-content: center;
        margin-top: auto;
      }
      
      .service-cta:hover {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(226, 30, 92, 0.2);
      }
      
      .service-cta:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }

      .service-card {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * Add Professional Pricing Styles
   */
  addProfessionalPricingStyles() {
    if (document.getElementById('professional-pricing-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'professional-pricing-styles';
    styles.textContent = `
      .service-plans-container {
        margin-top: 4rem;
        padding: 4rem 0;
        background: linear-gradient(135deg, var(--bg-secondary) 0%, #f1f5f9 100%);
        border-radius: 1.5rem;
        position: relative;
        overflow: hidden;
      }
      
      .service-plans-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
      }
      
      .service-plans-header {
        text-align: center;
        margin-bottom: 3rem;
        position: relative;
        z-index: 2;
      }
      
      .service-plans-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-primary);
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .service-plans-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
      }
      
      .service-plans-grid {
        display: grid;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      @media (min-width: 768px) {
        .service-plans-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
      }
      
      .pricing-card {
        background: white;
        border-radius: 1.5rem;
        padding: 0;
        position: relative;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        border: 2px solid #f1f5f9;
        transition: all 0.4s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 520px;
      }
      
      .pricing-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 50px rgba(226, 30, 92, 0.15);
        border-color: var(--primary);
      }
      
      .pricing-card.popular {
        transform: scale(1.05);
        border-color: var(--primary);
        box-shadow: 0 15px 40px rgba(226, 30, 92, 0.2);
        z-index: 10;
      }
      
      .pricing-card.popular:hover {
        transform: scale(1.05) translateY(-10px);
        box-shadow: 0 25px 60px rgba(226, 30, 92, 0.25);
      }
      
      .popular-badge {
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 0 0 1rem 1rem;
        font-size: 0.875rem;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(226, 30, 92, 0.4);
        z-index: 5;
      }
      
      .card-header {
        text-align: center;
        padding: 3rem 2rem 2rem;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      }
      
      .popular .card-header {
        padding-top: 4rem;
      }
      
      .plan-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .plan-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }
      
      .plan-subtitle {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        font-size: 1rem;
        font-weight: 500;
      }
      
      .plan-price {
        font-size: 2rem;
        font-weight: 800;
        color: var(--primary);
        line-height: 1;
      }
      
      .card-features {
        padding: 2rem;
        flex-grow: 1;
      }
      
      .features-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      .feature-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        line-height: 1.6;
        color: var(--text-secondary);
      }
      
      .feature-item:last-child {
        margin-bottom: 0;
      }
      
      .feature-check {
        color: #10b981;
        font-size: 0.875rem;
        margin-top: 2px;
        margin-right: 0.75rem;
        flex-shrink: 0;
        width: 1rem;
        height: 1rem;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .card-footer {
        padding: 2rem;
        border-top: 1px solid #f1f5f9;
        margin-top: auto;
      }
      
      .cta-btn {
        width: 100%;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }
      
      .cta-btn.primary {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        color: white;
        box-shadow: 0 8px 25px rgba(226, 30, 92, 0.3);
      }
      
      .cta-btn.primary:hover {
        background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(226, 30, 92, 0.4);
      }
      
      .cta-btn.secondary {
        background: white;
        color: var(--primary);
        border: 2px solid var(--primary);
        box-shadow: 0 4px 15px rgba(226, 30, 92, 0.1);
      }
      
      .cta-btn.secondary:hover {
        background: var(--primary);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(226, 30, 92, 0.3);
      }

      .service-plans-actions {
        text-align: center;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid #e2e8f0;
      }

      .custom-needs-cta {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        border: 2px solid #f1f5f9;
        max-width: 600px;
        margin: 0 auto;
      }

      .custom-needs-cta h4 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: 1.25rem;
      }

      .custom-needs-cta p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .btn-custom-contact {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      }

      .btn-custom-contact:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * Add Blog Styles
   */
  addBlogStyles() {
    if (document.getElementById('blog-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'blog-styles';
    styles.textContent = `
      .blog-grid {
        display: grid;
        gap: 2rem;
        margin-bottom: 3rem;
      }
      
      @media (min-width: 768px) {
        .blog-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (min-width: 1024px) {
        .blog-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      .blog-card {
        background: white;
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid var(--border);
        transition: all 0.3s ease;
      }
      
      .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(226, 30, 92, 0.15);
      }
      
      .blog-image {
        position: relative;
        aspect-ratio: 2/1;
        overflow: hidden;
      }
      
      .blog-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.3s ease;
      }
      
      .blog-card:hover .blog-image img {
        transform: scale(1.05);
      }
      
      .blog-category {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .blog-content {
        padding: 1.5rem;
      }
      
      .blog-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        line-height: 1.3;
        color: var(--text-primary);
      }
      
      .blog-excerpt {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      .blog-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
      
      .blog-meta > div {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      
      .blog-read-more {
        color: var(--primary);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        text-decoration: none;
      }
      
      .blog-read-more:hover {
        color: var(--primary-dark);
        gap: 0.75rem;
      }
      
      .blog-actions {
        text-align: center;
      }
      
      .blog-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * VENTANA DE CÓDIGO ANIMADA ORIGINAL - RESTAURADA
   */
  createCodeAnimation() {
    const codeContent = `// Asistente Virtual Inteligente LAURA
import { ChatbotAI } from '@laura/ai-assistant';
import { DigitalTransformation } from '@laura/business-tools';

class LAURADigitalAgency {
  constructor() {
    this.ai = new ChatbotAI({
      model: 'laura-business-v4',
      language: 'es',
      globalReach: true,
      specialties: ['marketing', 'development', 'security']
    });
    this.transformation = new DigitalTransformation();
  }

  async transformBusiness(clientData) {
    // Analizar necesidades del cliente con IA
    const analysis = await this.ai.analyzeBusinessNeeds(clientData);
    const strategy = await this.ai.createStrategy(analysis);
    
    // Ejecutar transformación digital
    if (strategy.includes('marketing')) {
      this.transformation.launchMarketing(clientData.goals);
    }
    
    if (strategy.includes('development')) {
      this.transformation.buildPlatform(clientData.requirements);
    }
    
    if (strategy.includes('security')) {
      this.transformation.implementSecurity(clientData.assets);
    }
    
    return {
      success: true,
      growth: '300% average increase',
      timeframe: strategy.timeline,
      globalReady: true
    };
  }

  async globalExpansion(businessData) {
    // Preparar negocio para expansión global
    const marketAnalysis = await this.ai.analyzeGlobalMarkets();
    const localization = await this.transformation.localizeForMarkets(
      businessData, 
      marketAnalysis.opportunities
    );
    
    console.log('🌍 Ready for global expansion with LAURA');
    return localization;
  }
}

// Inicializar LAURA para transformación global
const laura = new LAURADigitalAgency();
console.log('🚀 LAURA Digital Agency - Transformando negocios globalmente');`;

    const lines = codeContent.split('\n');
    
    const codeHTML = `
        <div class="code-animation-container">
            <div class="code-window-wrapper">
                <div class="code-window">
                    <div class="code-header">
                        <div class="code-controls">
                            <span class="code-dot red"></span>
                            <span class="code-dot yellow"></span>
                            <span class="code-dot green"></span>
                        </div>
                        <div class="code-title">laura-digital-agency.js</div>
                    </div>
                    <div class="code-body">
                        <pre class="code-content"><code id="animated-code" class="language-javascript"></code></pre>
                        <div class="code-cursor"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const styles = `
        <style>
        .code-animation-container {
            width: 100%;
            height: 520px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-sizing: border-box;
            padding-bottom: 50px;
        }
        
        .code-window-wrapper {
            width: 95%;
            max-width: 1000px;
            height: calc(100% - 50px);
            position: relative;
            box-sizing: border-box;
        }

        .code-window {
            width: 100%;
            height: 100%;
            background: #1e1e1e;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            position: relative;
            box-sizing: border-box;
        }
        
        .code-header {
            background: #2d2d2d;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #3e3e3e;
            box-sizing: border-box;
        }
        
        .code-controls {
            display: flex;
            gap: 8px;
        }
        
        .code-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #3e3e3e;
        }
        
        .code-dot.red { background: #ff5f56; }
        .code-dot.yellow { background: #ffbd2e; }
        .code-dot.green { background: #27c93f; }
        
        .code-title {
            color: #999;
            font-size: 14px;
            font-family: 'Monaco', 'Consolas', monospace;
        }
        
        .code-body {
            flex: 1;
            padding: 20px;
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }
        
        .code-content {
            margin: 0;
            padding: 0;
            background: transparent;
            color: #d4d4d4;
            font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
            width: 100%;
            height: 100%; 
            display: block;
            box-sizing: border-box;
        }
        
        .code-cursor {
            position: absolute;
            width: 2px;
            height: 18px;
            background: #e21e5c;
            animation: blink 1s infinite;
            display: none;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* Syntax highlighting */
        .keyword { color: #569cd6; }
        .string { color: #ce9178; }
        .comment { color: #6a9955; }
        .function { color: #dcdcaa; }
        .number { color: #b5cea8; }
        .operator { color: #d4d4d4; }
        .class-name { color: #4ec9b0; }
        .property { color: #9cdcfe; }
        .punctuation { color: #d4d4d4; }
        
        @media (max-width: 768px) {
            .code-animation-container {
                height: 420px;
                padding-bottom: 30px;
            }
            
            .code-window-wrapper {
                width: 95%;
                height: calc(100% - 30px);
            }

            .code-window {
                width: 95%;
            }
            
            .code-content {
                font-size: 12px;
            }
        }
        </style>
    `;
    
    function highlightSyntax(code) {
        return code
            .replace(/\b(import|from|class|constructor|async|await|const|let|var|function|return|if|else|switch|case|default|new|this)\b/g, '<span class="keyword">$1</span>')
            .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="string">$1</span>')
            .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
            .replace(/\b(ChatbotAI|DigitalTransformation|LAURADigitalAgency)\b/g, '<span class="class-name">$1</span>')
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
            .replace(/\b(ai|transformation|model|language|globalReach|specialties|analysis|strategy|success|growth|timeframe|globalReady)\b/g, '<span class="property">$1</span>')
            .replace(/\b(transformBusiness|analyzeBusinessNeeds|createStrategy|launchMarketing|buildPlatform|implementSecurity|globalExpansion|analyzeGlobalMarkets|localizeForMarkets)\b/g, '<span class="function">$1</span>');
    }
    
    function animateCode() {
        const codeElement = document.getElementById('animated-code');
        const codeBody = document.querySelector('.code-body');
        if (!codeElement || !codeBody) return;
        
        let displayedCode = '';
        let currentLineIndex = 0;
        let currentChar = 0;
        
        function typeNextChar() {
            if (currentLineIndex >= lines.length) {
                setTimeout(() => {
                    currentLineIndex = 0;
                    currentChar = 0;
                    displayedCode = '';
                    codeElement.innerHTML = '';
                    typeNextChar();
                }, 3000);
                return;
            }
            
            const line = lines[currentLineIndex];
            
            if (currentChar < line.length) {
                displayedCode += line[currentChar];
                currentChar++;
            } else {
                displayedCode += '\n';
                currentLineIndex++;
                currentChar = 0;
            }
            
            codeElement.innerHTML = highlightSyntax(displayedCode);
            
            const lineHeight = parseFloat(getComputedStyle(codeElement).lineHeight);
            const maxVisibleLines = Math.floor(codeBody.clientHeight / lineHeight);
            
            if (currentLineIndex >= maxVisibleLines) {
                codeBody.scrollTop = (currentLineIndex - maxVisibleLines + 1) * lineHeight;
            }

            const delay = Math.random() * 50 + 20;
            setTimeout(typeNextChar, delay);
        }
        
        typeNextChar();
    }
    
    return {
        html: codeHTML,
        styles: styles,
        init: animateCode
    };
  },

  /**
   * Update About Section with Code Animation - RESTAURADO
   */
  updateAboutSection() {
    const aboutVisual = document.querySelector('.about-visual');
    if (!aboutVisual) return;
    
    const codeAnimation = this.createCodeAnimation();
    
    // Add styles
    if (!document.getElementById('code-animation-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'code-animation-styles';
        styleElement.innerHTML = codeAnimation.styles;
        document.head.appendChild(styleElement);
    }
    
    // Replace content
    aboutVisual.innerHTML = codeAnimation.html;
    
    // Start animation
    setTimeout(() => {
        codeAnimation.init();
    }, 500);
  },

  /**
   * Initialize all components
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderAll());
    } else {
      this.renderAll();
    }
  },

  /**
   * Render all components
   */
  renderAll() {
  try {
    this.renderServices();
    this.renderFeatures();
    this.renderBenefits();
    this.renderContactMethods();
    this.renderContactForm();
    this.renderFooter();
    this.renderBlogArticles();
    this.updateAboutSection();
    this.initSpecialtyFilters(); // Añadir esta línea
    
    if (getConfig('dev.enableConsoleMessages')) {
      console.log('✅ All components rendered successfully');
    }
  } catch (error) {
    console.error('❌ Error rendering components:', error);
  }
}
};

// Global functions for service interaction
window.selectPlan = function(planId, planName) {
  if (window.LAURA_Components && window.LAURA_Components.selectPlan) {
    window.LAURA_Components.selectPlan(planId, planName);
  }
};

window.scrollToContact = function() {
  if (window.LAURA_Components && window.LAURA_Components.scrollToContact) {
    window.LAURA_Components.scrollToContact();
  }
};



// Auto-initialize components
window.LAURA_Components.init();