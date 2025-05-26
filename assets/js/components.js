/**
 * LAURA DIGITAL AGENCY - Components Module
 * Dynamic component generation for scalable architecture
 * Version: 1.0.0 - FIXED
 */

window.LAURA_Components = {
  
  /**
   * Render Services Grid
   */
  renderServices() {
    const container = document.querySelector('.services-grid');
    if (!container) {
      console.log('❌ Services container not found');
      return;
    }

    console.log('🔧 Rendering services');
    this.updateServicesContainer(container);
  },
  
  /**
   * Update services container with interactive buttons
   */
  updateServicesContainer(container) {
    const services = getConfig('services', []);
    console.log('🔧 Rendering services:', services.length);
    
    container.innerHTML = services.map(service => `
      <div class="card hover-lift fade-in service-card" data-service="${service.id}">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-description">${service.description}</p>
        ${service.kpis ? `
          <div class="service-kpis">
            <div class="kpis-title">📊 Resultados promedio:</div>
            <ul class="kpis-list">
              ${service.kpis.map(kpi => `<li><i class="fas fa-chart-line"></i>${kpi}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <ul class="service-features">
          ${service.features.map(feature => `
            <li><i class="fas fa-check"></i>${feature}</li>
          `).join('')}
        </ul>
        <button class="service-cta" type="button" data-service-id="${service.id}" onclick="showServicePlans('${service.id}')">
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
      let serviceValue = 'web'; // default
      if (planId.includes('web')) serviceValue = 'web';
      else if (planId.includes('security') || planId.includes('cyber')) serviceValue = 'security';
      else if (planId.includes('marketing')) serviceValue = 'marketing';
      else if (planId.includes('consulting')) serviceValue = 'consulting';
      
      // Try to set the value
      const options = Array.from(serviceSelect.options);
      const matchingOption = options.find(option => 
        option.value === serviceValue || 
        option.textContent.toLowerCase().includes(serviceValue)
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
        messageTextarea.style.borderColor = '#667eea';
        messageTextarea.style.boxShadow = '0 0 8px rgba(102, 126, 234, 0.3)';
        
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
      background: ${type === 'success' ? '#10B981' : '#667eea'};
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
   * Show service plans dynamically
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
      title.textContent = `Planes para ${service.title}`;
    }
    
    // Render professional pricing cards
    if (plansGrid) {
      plansGrid.innerHTML = service.plans.map((plan, index) => `
        <div class="pricing-card ${plan.popular ? 'popular' : ''} ${index === 0 ? 'first' : index === 2 ? 'last' : 'middle'}" data-plan="${plan.id}">
          ${plan.popular ? '<div class="popular-ribbon">Más Popular</div>' : ''}
          
          <div class="pricing-header">
            <div class="plan-icon">
              <i class="${service.icon}"></i>
            </div>
            <h3 class="plan-name">${plan.name}</h3>
            <p class="plan-subtitle">${plan.subtitle}</p>
            <div class="plan-price">
              <span class="price-amount">${plan.price}</span>
              ${plan.deliverables ? `<div class="price-note">${plan.deliverables}</div>` : ''}
            </div>
          </div>
          
          <div class="pricing-features">
            <ul class="features-list">
              ${plan.features.map(feature => `
                <li class="feature-item">
                  <i class="fas fa-check feature-check"></i>
                  <span>${feature}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div class="pricing-footer">
            <button class="plan-cta-btn ${plan.popular ? 'cta-popular' : 'cta-standard'}" 
                    onclick="selectPlan('${plan.id}', '${plan.name}')"
                    data-plan-id="${plan.id}">
              <span>${plan.cta}</span>
              <i class="fas fa-arrow-right"></i>
            </button>
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
        image: 'https://via.placeholder.com/400x200/667eea/ffffff?text=IA+2025',
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
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM2NjdlZWEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFydMOtY3VsbzwvdGV4dD48L3N2Zz4='">
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
   * Render Pricing Plans
   */
  renderPricing() {
    const container = document.querySelector('.pricing-grid');
    if (!container) return;

    const plans = getConfig('pricingPlans', []);
    
    container.innerHTML = plans.map(plan => `
      <div class="pricing-card ${plan.popular ? 'popular' : ''} hover-lift fade-in">
        ${plan.popular ? '<div class="popular-badge">Más Popular</div>' : ''}
        <div class="pricing-header">
          <h3 class="plan-name">${plan.name}</h3>
          <p class="plan-subtitle">${plan.subtitle}</p>
          <div class="plan-price">${plan.price}</div>
        </div>
        <ul class="plan-features">
          ${plan.features.map(feature => `
            <li><i class="fas fa-check"></i>${feature}</li>
          `).join('')}
        </ul>
        <button class="btn-${plan.ctaType} plan-cta" data-plan="${plan.id}">
          ${plan.cta}
        </button>
      </div>
    `).join('');

    this.addPricingStyles();
  },

  /**
   * Render Client Logos
   */
  renderClientLogos() {
    const container = document.querySelector('.clients-logos');
    if (!container) return;

    const clients = getConfig('clientLogos', []);
    
    container.innerHTML = clients.map(client => `
      <div class="client-logo hover-lift fade-in">
        <img src="${client.logo}" alt="${client.name}" loading="lazy" 
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmOGZhZmMiLz48dGV4dCB4PSI2MCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2N2VlYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7Y2xpZW50Lm5hbWV9PC90ZXh0Pjwvc3ZnPg=='">
      </div>
    `).join('');
  },

  /**
   * Render Testimonials
   */
  renderTestimonials() {
    const container = document.querySelector('.testimonials-grid');
    if (!container) return;

    const testimonials = getConfig('testimonials', []);
    
    container.innerHTML = testimonials.map(testimonial => `
      <div class="testimonial-card card fade-in">
        <div class="testimonial-rating">
          ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
        </div>
        <blockquote class="testimonial-quote">"${testimonial.quote}"</blockquote>
        <div class="testimonial-author">
          <img src="${testimonial.avatar}" alt="${testimonial.name}" 
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIgZmlsbD0iIzY2N2VlYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+JHt0ZXN0aW1vbmlhbC5uYW1lLmNoYXJBdCgwKX08L3RleHQ+PC9zdmc+'"
               loading="lazy">
          <div class="author-info">
            <p class="author-name">${testimonial.name}</p>
            <p class="author-position">${testimonial.position}, ${testimonial.company}</p>
          </div>
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
          <i class="fas fa-rocket"></i>
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
    const gridClass = field.gridColumn === 'half' ? 'form-group-half' : 'form-group';
    
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
          <div class="logo-icon">
            <i class="fas fa-brain"></i>
          </div>
          <span class="logo-text gradient-text">${company.name}</span>
        </div>
        <p class="footer-description">${section.content.description}</p>
        ${section.content.socialLinks ? `
          <div class="social-links">
            <a href="${socialMedia.linkedin}" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="${socialMedia.twitter}" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="${socialMedia.instagram}" class="social-link" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="${socialMedia.youtube}" class="social-link" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
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
            <li><a href="${link.url}" class="footer-link">${link.text}</a></li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  /**
   * Render Certifications
   */
  renderCertifications() {
    const container = document.querySelector('.certifications-grid');
    if (!container) return;

    const certifications = getConfig('certifications', []);
    
    container.innerHTML = certifications.map(cert => `
      <div class="certification-item">
        <img src="${cert.logo}" alt="${cert.name}" loading="lazy"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA4MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiMzNzQxNTEiLz48dGV4dCB4PSI0MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4ke2NlcnQubmFtZX08L3RleHQ+PC9zdmc+'">
      </div>
    `).join('');
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
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--space-6);
        color: white;
        font-size: var(--text-xl);
      }
      
      .service-title {
        font-size: var(--text-xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--space-4);
      }
      
      .service-description {
        color: var(--gray-600);
        margin-bottom: var(--space-6);
      }
      
      .service-features {
        list-style: none;
        margin-bottom: var(--space-6);
      }
      
      .service-features li {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-sm);
        color: var(--gray-500);
        margin-bottom: var(--space-2);
      }
      
      .service-features i {
        color: var(--success);
      }
      
      .service-cta {
        color: var(--primary-600);
        font-weight: var(--font-weight-semibold);
        transition: var(--transition-base);
        display: flex;
        align-items: center;
        gap: var(--space-2);
        background: none;
        border: none;
        padding: var(--space-2) 0;
        cursor: pointer;
        font-size: var(--text-base);
        width: 100%;
        justify-content: flex-start;
      }
      
      .service-cta:hover {
        color: var(--primary-700);
        transform: translateX(2px);
      }
      
      .service-cta:focus {
        outline: 2px solid var(--primary-500);
        outline-offset: 2px;
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
    margin-top: var(--space-16);
    padding: var(--space-16) 0;
    background: linear-gradient(135deg, var(--dark-bg-secondary) 0%, var(--dark-bg-tertiary) 100%);
    border-radius: var(--radius-2xl);
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
    background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-light) 50%, var(--color-accent) 100%);
  }
  
  .service-plans-header {
    text-align: center;
    margin-bottom: var(--space-12);
    position: relative;
    z-index: 2;
  }
  
  .service-plans-title {
    font-size: var(--text-3xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-4);
    color: var(--dark-text-primary);
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .service-plans-subtitle {
    font-size: var(--text-lg);
    color: var(--dark-text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .service-plans-grid {
    display: grid;
    gap: var(--space-6);
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }
  
  @media (min-width: 768px) {
    .service-plans-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-8);
    }
  }
  
  .pricing-card {
    background: var(--dark-bg-card);
    border-radius: var(--radius-2xl);
    padding: 0;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
    border: 2px solid var(--dark-border);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    transform: translateY(0);
  }
  
  .pricing-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); /* Valor original, se asocia al darkmode por el contexto. */
    border-color: var(--color-accent);
  }
  
  .pricing-card.popular {
    transform: scale(1.05) translateY(-10px);
    border-color: var(--color-accent);
    box-shadow: 0 25px 50px rgba(226, 30, 92, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
    z-index: 10;
  }
  
  .pricing-card.popular:hover {
    transform: scale(1.05) translateY(-15px);
    box-shadow: 0 30px 60px rgba(226, 30, 92, 0.4); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .popular-ribbon {
    position: absolute;
    top: 1rem;
    right: -2rem;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    color: white;
    padding: 0.5rem 3rem;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-bold);
    transform: rotate(45deg);
    box-shadow: 0 4px 8px rgba(226, 30, 92, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
    z-index: 5;
  }
  
  .pricing-header {
    text-align: center;
    padding: var(--space-8) var(--space-6) var(--space-6);
    background: linear-gradient(135deg, var(--dark-bg-secondary) 0%, var(--dark-bg-tertiary) 100%);
    position: relative;
  }
  
  .plan-icon {
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-4);
    color: white;
    font-size: var(--text-2xl);
    box-shadow: 0 8px 20px rgba(226, 30, 92, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .popular .plan-icon {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    box-shadow: 0 8px 20px rgba(226, 30, 92, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .plan-name {
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-2);
    color: var(--dark-text-primary);
  }
  
  .plan-subtitle {
    color: var(--dark-text-secondary);
    margin-bottom: var(--space-4);
    font-size: var(--text-base);
  }
  
  .plan-price {
    margin-bottom: var(--space-2);
  }
  
  .price-amount {
    font-size: var(--text-4xl);
    font-weight: var(--font-weight-extrabold);
    color: var(--dark-text-primary);
    display: block;
    line-height: 1;
  }
  
  .price-note {
    background: rgba(226, 30, 92, 0.1);
    color: var(--color-accent);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-semibold);
    display: inline-block;
    margin-top: var(--space-2);
    border: 1px solid rgba(226, 30, 92, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .popular .price-note {
    background: rgba(226, 30, 92, 0.1);
    color: var(--color-accent);
  }
  
  .pricing-features {
    padding: var(--space-6);
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
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    font-size: var(--text-base);
    line-height: 1.6;
    color: var(--dark-text-secondary);
  }
  
  .feature-item:last-child {
    margin-bottom: 0;
  }
  
  .feature-check {
    color: var(--success);
    font-size: var(--text-sm);
    margin-top: 2px;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .pricing-footer {
    padding: var(--space-6);
    border-top: 1px solid var(--dark-border);
  }
  
  .plan-cta-btn {
    width: 100%;
    padding: var(--space-4) var(--space-6);
    border: none;
    border-radius: var(--radius-xl);
    font-size: var(--text-base);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    position: relative;
    overflow: hidden;
  }
  
  .plan-cta-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }
  
  .plan-cta-btn:hover::before {
    left: 100%;
  }
  
  .cta-standard {
    background: var(--dark-bg-secondary);
    color: var(--dark-text-primary);
    border: 2px solid var(--dark-border);
  }
  
  .cta-standard:hover {
    background: var(--color-accent);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(226, 30, 92, 0.3); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .cta-popular {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(226, 30, 92, 0.4); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .cta-popular:hover {
    background: linear-gradient(135deg, var(--color-accent-dark) 0%, var(--color-accent) 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(226, 30, 92, 0.5); /* Valor original, se asocia al darkmode por el contexto. */
  }
  
  .service-plans-actions {
    text-align: center;
    margin-top: var(--space-12);
    padding-top: var(--space-8);
    border-top: 1px solid var(--dark-border);
  }
  
  .btn-custom-contact {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    padding: var(--space-4) var(--space-8);
    border-radius: var(--radius-2xl);
    font-size: var(--text-lg);
    font-weight: var(--font-weight-semibold);
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  }
  
  .btn-custom-contact:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.5);
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  }
  
  .btn-custom-contact:active {
    transform: translateY(-1px);
  }
  
  .btn-custom-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-base);
  }
  
  /* Responsive improvements */
  @media (max-width: 767px) {
    .pricing-card.popular {
      transform: none;
      margin-bottom: var(--space-4);
    }
    
    .pricing-card.popular:hover {
      transform: translateY(-5px);
    }
    
    .service-plans-grid {
      gap: var(--space-6);
    }
    
    .plan-price .price-amount {
      font-size: var(--text-3xl);
    }
  }
  
  /* Animation keyframes */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .pricing-card {
    animation: slideInUp 0.6s ease-out;
  }
  
  .pricing-card:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  .pricing-card:nth-child(3) {
    animation-delay: 0.2s;
  }
`;
document.head.appendChild(styles);;
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
        gap: var(--space-8);
        margin-bottom: var(--space-12);
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
        border-radius: var(--radius-2xl);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--gray-200);
        transition: var(--transition-base);
      }
      
      .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
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
        transition: var(--transition-base);
      }
      
      .blog-card:hover .blog-image img {
        transform: scale(1.05);
      }
      
      .blog-category {
        position: absolute;
        top: var(--space-3);
        left: var(--space-3);
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
        color: white;
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-full);
        font-size: var(--text-xs);
        font-weight: var(--font-weight-semibold);
      }
      
      .blog-content {
        padding: var(--space-6);
      }
      
      .blog-title {
        font-size: var(--text-xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--space-3);
        line-height: 1.3;
        color: var(--gray-800);
      }
      
      .blog-excerpt {
        color: var(--gray-600);
        line-height: 1.6;
        margin-bottom: var(--space-4);
      }
      
      .blog-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
        font-size: var(--text-sm);
        color: var(--gray-500);
      }
      
      .blog-meta > div {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }
      
      .blog-read-more {
        color: var(--primary-600);
        font-weight: var(--font-weight-semibold);
        display: flex;
        align-items: center;
        gap: var(--space-2);
        transition: var(--transition-base);
      }
      
      .blog-read-more:hover {
        color: var(--primary-700);
        gap: var(--space-3);
      }
      
      .blog-actions {
        text-align: center;
      }
      
      .blog-cta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-4) var(--space-8);
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * Add general styles for missing elements
   */
  addPricingStyles() {
    if (document.getElementById('pricing-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'pricing-styles';
    styles.textContent = `
      .popular-badge {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        font-weight: var(--font-weight-bold);
        box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
      }
      
      .feature-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: var(--text-lg);
        margin-bottom: var(--space-4);
      }
      
      .benefit-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: var(--text-2xl);
        margin-bottom: var(--space-6);
      }
    `;
    document.head.appendChild(styles);
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
      this.renderPricing();
      this.renderClientLogos();
      this.renderTestimonials();
      this.renderContactMethods();
      this.renderContactForm();
      this.renderFooter();
      this.renderCertifications();
      this.renderBlogArticles();
      
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
  // Pre-fill contact form with selected plan
  const form = document.getElementById('contact-form');
  if (form) {
    const serviceSelect = form.querySelector('select[name="service"]');
    const messageTextarea = form.querySelector('textarea[name="message"]');
    
    if (serviceSelect) {
      // Set the service type
      serviceSelect.value = planId.includes('web') ? 'web' : 
                            planId.includes('security') ? 'security' :
                            planId.includes('marketing') ? 'marketing' : 'consulting';
    }
    
    if (messageTextarea && !messageTextarea.value.trim()) {
      messageTextarea.value = `Estoy interesado en el plan ${planName}. Me gustaría conocer más detalles y recibir una cotización personalizada.`;
    }
  }
  
  // Scroll to contact form
  scrollToContact();
  
  // Track plan selection
  if (window.LAURA_Forms && typeof window.LAURA_Forms.trackFormSubmission === 'function') {
    window.LAURA_Forms.trackFormSubmission('plan_selection', {
      planId: planId,
      planName: planName,
      timestamp: new Date().toISOString()
    });
  }
};

window.scrollToContact = function() {
  const contactSection = document.getElementById('contacto');
  if (contactSection) {
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
    const targetPosition = contactSection.offsetTop - navbarHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

// Componente de código animado
window.LAURA_Components.createCodeAnimation = function() {
    // New chatbot code content
    const codeContent = `// Asistente Virtual Inteligente para Negocios
import { ChatbotAI } from '@laura/ai-chatbot';
import { CustomerEngagement } from '@laura/biz-tools';

class BusinessChatbot {
  constructor() {
    this.ai = new ChatbotAI({
      model: 'business-chat-v3',
      language: 'es',
      sentimentAnalysis: true
    });
    this.engagement = new CustomerEngagement();
  }

  async handleUserQuery(query, userContext) {
    // Procesar la intención del usuario con IA
    const intent = await this.ai.analyzeIntent(query);
    const response = await this.ai.generateResponse(intent, userContext);
    
    // Ejecutar acciones de negocio
    if (intent.type === 'product_inquiry') {
      this.engagement.provideProductInfo(response.data.product);
    } else if (intent.type === 'support_request') {
      this.engagement.createSupportTicket(userContext.id, response.data.details);
    }
    
    // Enviar respuesta al usuario
    return {
      message: response.text,
      action: response.action || 'display_message'
    };
  }

  async proactiveEngagement(visitorData) {
    // Identificar oportunidades para interactuar
    if (visitorData.timeOnPage > 60 && visitorData.scrollDepth > 0.5) {
      const suggestedTopic = await this.ai.suggestTopic(visitorData.history);
      return this.engagement.triggerProactiveChat(visitorData.id, suggestedTopic);
    }
    return null;
  }
}

// Inicializar y lanzar el asistente
const myChatbot = new BusinessChatbot();
console.log('🚀 Asistente Virtual LAURA operativo!');`;

    const lines = codeContent.split('\n');
    let currentLine = 0;
    let currentChar = 0;
    
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
                        <div class="code-title">business-chatbot.js</div>
                    </div>
                    <div class="code-body">
                        <pre class="code-content"><code id="animated-code" class="language-javascript"></code></pre>
                        <div class="code-cursor"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos para el componente
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
            padding-bottom: 50px; /* Slightly increased padding-bottom for a larger, softer shadow */
        }
        
        .code-window-wrapper {
            width: 95%;
            max-width: 1000px;
            height: calc(100% - 50px); /* Adjusted height to account for increased padding-bottom */
            position: relative;
            box-sizing: border-box;
        }

.code-window {
    width: 100%;
    height: 100%;
    background: #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    /* Refined shadow for more even distribution */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Changed values for a softer, more uniform shadow */
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
            background: #569cd6;
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
    
    // Function to apply syntax highlighting
    function highlightSyntax(code) {
        return code
            .replace(/\b(import|from|class|constructor|async|await|const|let|var|function|return|if|else|switch|case|default|new|this)\b/g, '<span class="keyword">$1</span>')
            .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="string">$1</span>')
            .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
            .replace(/\b(ChatbotAI|CustomerEngagement|BusinessChatbot)\b/g, '<span class="class-name">$1</span>')
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
            .replace(/\b(ai|engagement|model|language|sentimentAnalysis|query|userContext|intent|response|text|action|product|id|details|visitorData|timeOnPage|scrollDepth|suggestedTopic|history)\b/g, '<span class="property">$1</span>')
            .replace(/\b(handleUserQuery|analyzeIntent|generateResponse|provideProductInfo|createSupportTicket|proactiveEngagement|suggestTopic|triggerProactiveChat)\b/g, '<span class="function">$1</span>');
    }
    
    // Function to animate the code
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
};

// Actualizar la sección "Qué es LAURA" para usar el código animado
window.LAURA_Components.updateAboutSection = function() {
    const aboutVisual = document.querySelector('.about-visual');
    if (!aboutVisual) return;
    
    const codeAnimation = this.createCodeAnimation();
    
    // Agregar estilos
    if (!document.getElementById('code-animation-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'code-animation-styles';
        styleElement.innerHTML = codeAnimation.styles;
        document.head.appendChild(styleElement);
    }
    
    // Reemplazar contenido
    aboutVisual.innerHTML = codeAnimation.html;
    
    // Iniciar animación
    setTimeout(() => {
        codeAnimation.init();
    }, 500);
};

// Llamar a la actualización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.LAURA_Components.updateAboutSection();
    });
} else {
    window.LAURA_Components.updateAboutSection();
}

// Auto-initialize components
window.LAURA_Components.init();

