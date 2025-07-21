/**
 * LAURA DIGITAL AGENCY - Main Application (Optimized)
 * Simplified, performance-focused architecture
 * Version: 2.0.0
 */

class LauraApp {
  constructor() {
    this.state = {
      isInitialized: false,
      isMobileMenuOpen: false,
      currentSection: 'inicio'
    };
    
    this.init();
  }

  init() {
    if (this.state.isInitialized) return;
    
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    try {
      // Core functionality
      this.setupNavigation();
      this.setupServices();
      this.setupAnimations();
      this.setupForms();
      this.setupUtils();
      
      // Hide loader
      this.hideLoader();
      
      this.state.isInitialized = true;
      console.log('🚀 LAURA App initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing LAURA App:', error);
      this.hideLoader();
    }
  }

  // ========================================
  // NAVIGATION
  // ========================================
  setupNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (toggle && menu) {
      toggle.addEventListener('click', () => this.toggleMobileMenu());
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#nav-menu') && !e.target.closest('#nav-toggle')) {
          this.closeMobileMenu();
        }
      });
      
      // Close menu on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
      
      // Close menu on nav link click
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const navbarHeight = navbar?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Navbar scroll effect
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (navbar) {
            if (window.scrollY > 50) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
          }
          
          // Hide/show scroll indicator
          const scrollIndicator = document.querySelector('.scroll-indicator');
          if (scrollIndicator) {
            if (window.scrollY > 100) {
              scrollIndicator.classList.add('hidden');
            } else {
              scrollIndicator.classList.remove('hidden');
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Section tracking for active nav links
    this.setupSectionTracking();
  }

  toggleMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    toggle?.classList.add('active');
    menu?.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
    
    this.state.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    toggle?.classList.remove('active');
    menu?.classList.remove('mobile-open');
    document.body.style.overflow = '';
    
    this.state.isMobileMenuOpen = false;
  }

  setupSectionTracking() {
    if (!window.IntersectionObserver) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActiveNavLink(sectionId);
          this.state.currentSection = sectionId;
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  updateActiveNavLink(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ========================================
  // SERVICES
  // ========================================
  setupServices() {
    this.renderServices();
    this.setupServiceInteractions();
  }

  renderServices() {
    const container = document.querySelector('.services-grid');
    if (!container) return;

    const services = [
      {
        icon: 'fas fa-code',
        title: 'Desarrollo Web',
        description: 'Sitios web modernos, rápidos y optimizados que convierten visitantes en clientes.',
        features: [
          'Diseño responsive profesional',
          'Optimización SEO avanzada',
          'Carga ultrarrápida',
          'Panel de administración'
        ]
      },
      {
        icon: 'fas fa-chart-line',
        title: 'Marketing Digital',
        description: 'Estrategias de marketing digital que generan leads calificados y aumentan tus ventas.',
        features: [
          'Google Ads y Facebook Ads',
          'SEO y posicionamiento',
          'Email marketing',
          'Análisis y reportes'
        ]
      },
      {
        icon: 'fas fa-shield-alt',
        title: 'Ciberseguridad',
        description: 'Protección integral para tu negocio digital contra amenazas y vulnerabilidades.',
        features: [
          'Auditorías de seguridad',
          'Monitoreo 24/7',
          'Respaldo automático',
          'Certificados SSL'
        ]
      }
    ];

    container.innerHTML = services.map(service => `
      <div class="card service-card fade-in">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-description">${service.description}</p>
        <ul class="service-features">
          ${service.features.map(feature => `
            <li><i class="fas fa-check"></i> ${feature}</li>
          `).join('')}
        </ul>
        <button class="service-cta" onclick="scrollToSection('planes')">
          Ver Planes y Precios
        </button>
      </div>
    `).join('');

    // Make scrollToSection globally available
    window.scrollToSection = (sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = section.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    };
  }

  setupServiceInteractions() {
    // Add any additional service-specific interactions here
  }

  // ========================================
  // ANIMATIONS
  // ========================================
  setupAnimations() {
    this.setupFadeInAnimations();
    this.setupCounterAnimations();
  }

  setupFadeInAnimations() {
    if (!window.IntersectionObserver) {
      // Fallback for older browsers
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add delay for staggered animation
          const delay = index * 100;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      fadeInObserver.observe(el);
    });
  }

  setupCounterAnimations() {
    if (!window.IntersectionObserver) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => {
      counterObserver.observe(el);
    });
  }

animateCounter(element) {
    const targetText = element.textContent.trim();
    let targetNumber = 0;
    let suffix = '';
    
    // Extraer número y sufijo
    const match = targetText.match(/^(\d+)(.*)$/);
    if (match) {
        targetNumber = parseInt(match[1]);
        suffix = match[2] || '';
    } else {
        return; // No hay número válido
    }
    
    if (isNaN(targetNumber)) return;

    let current = 0;
    const duration = 2000;
    const increment = targetNumber / (duration / 16);
    
    const updateCounter = () => {
        current += increment;
        
        if (current >= targetNumber) {
            element.textContent = targetNumber + suffix;
            return;
        }
        
        element.textContent = Math.ceil(current) + suffix;
        requestAnimationFrame(updateCounter);
    };
    
    // Iniciar contador en 0
    element.textContent = '0' + suffix;
    requestAnimationFrame(updateCounter);
}

  // ========================================
  // FORMS
  // ========================================
  setupForms() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission(form);
    });

    // Setup real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleFormSubmission(form) {
    try {
      // Validate form
      const validation = this.validateForm(form);
      if (!validation.isValid) {
        this.showValidationErrors(form, validation.errors);
        return;
      }

      // Get form data
      const formData = this.getFormData(form);
      
      // Show loading state
      const submitBtn = form.querySelector('.form-submit');
      const originalContent = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 1rem; height: 1rem; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span>Enviando...</span>
        </div>
      `;
      
      // Disable form
      this.setFormDisabled(form, true);

      // Create WhatsApp message
      const message = this.createWhatsAppMessage(formData);
      const whatsappUrl = `https://wa.me/56999968482?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      this.showSuccessMessage(form);
      this.resetForm(form);
      
      // Restore button
      submitBtn.innerHTML = originalContent;
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(form, 'Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      // Re-enable form
      this.setFormDisabled(form, false);
    }
  }

  createWhatsAppMessage(formData) {
    return `¡Hola! Soy ${formData.name} y me contacto desde laura.lat

📧 Email: ${formData.email}
🎯 Servicio: ${this.getServiceLabel(formData.service)}

💬 Mensaje:
${formData.message}

¡Espero tu respuesta!`;
  }

  getServiceLabel(serviceValue) {
    const services = {
      'web': 'Desarrollo Web',
      'marketing': 'Marketing Digital', 
      'security': 'Ciberseguridad',
      'all': 'Solución Integral'
    };
    return services[serviceValue] || serviceValue;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    const errors = [];
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
        errors.push({
          field: input.name,
          message: this.getFieldError(input)
        });
      }
    });

    return { isValid, errors };
  }

  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');

    // Clear previous errors
    this.clearFieldError(field);

    // Required validation
    if (isRequired && !value) {
      this.showFieldError(field, 'Este campo es obligatorio');
      return false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Introduce un email válido');
        return false;
      }
    }

    // Textarea minimum length
    if (field.tagName === 'TEXTAREA' && field.name === 'message' && value && value.length < 10) {
      this.showFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
      return false;
    }

    return true;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.id = `${field.name}-error`;
    
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector(`#${field.name}-error`);
    if (existingError) {
      existingError.remove();
    }
  }

  getFieldError(field) {
    const errorElement = field.parentNode.querySelector(`#${field.name}-error`);
    return errorElement ? errorElement.textContent : '';
  }

  showValidationErrors(form, errors) {
    errors.forEach(error => {
      const field = form.querySelector(`[name="${error.field}"]`);
      if (field) {
        this.showFieldError(field, error.message);
      }
    });

    // Focus first error field
    const firstErrorField = form.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }

  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  setFormDisabled(form, disabled) {
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
      input.disabled = disabled;
    });
  }

  resetForm(form) {
    form.reset();
    
    // Clear all errors
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    // Clear messages
    this.clearMessages(form);
  }

  showSuccessMessage(form, message = '¡Formulario enviado! Te contactaremos pronto.') {
    this.clearMessages(form);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
  }

  showErrorMessage(form, message) {
    this.clearMessages(form);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;
    
    form.insertBefore(errorDiv, form.firstChild);
  }

  clearMessages(form) {
    form.querySelectorAll('.form-success, .form-error').forEach(msg => msg.remove());
  }

  // ========================================
  // UTILITIES
  // ========================================
  setupUtils() {
    // Add CSS for form states
    this.addFormStyles();
    
    // Setup external links
    this.setupExternalLinks();
  }

  addFormStyles() {
    if (document.getElementById('form-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'form-styles';
    styles.textContent = `
      .field-error {
        color: var(--error);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      
      .form-input.error,
      .form-textarea.error,
      .form-select.error {
        border-color: var(--error);
      }
      
      .form-success {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid var(--success);
        color: #059669;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .form-error {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--error);
        color: #dc2626;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styles);
  }

  setupExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  hideLoader() {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
      loader.classList.add('hidden');
    }
  }

  // ========================================
  // PUBLIC METHODS
  // ========================================
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
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
  }
}

// Initialize the application
const app = new LauraApp();

// Export for global access if needed
window.LauraApp = app;


