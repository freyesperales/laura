/* ==========================================
 * LAURA DIGITAL AGENCY - Unified JavaScript
 * Versión: 2.2.0
 * Contiene: animations, components, forms, main
 * ========================================== */

/**
 * LAURA DIGITAL AGENCY - Animations Module
 * Handles all animations and interactive effects
 * Version: 2.2.0 - Restored + Enhanced
 */

window.LAURA_Animations = {

  // Animation state
  state: {
    observers: [],
    counters: new Set(),
    isInitialized: false
  },

  /**
   * Initialize all animations
   */
  init() {
    if (this.state.isInitialized) return;

    try {
      this.setupIntersectionObserver();
      this.setupTimelineAnimations();
      this.setupScrollAnimations();
      this.setupCounterAnimations();
      this.setupHoverEffects();
      this.setupSmoothScrolling();
      this.preloadCriticalImages();

      this.state.isInitialized = true;

      if (getConfig('dev.enableConsoleMessages')) {
        console.log('✅ Animations initialized successfully');
      }
    } catch (error) {
      console.error('❌ Error initializing animations:', error);
    }
  },

  /**
   * Setup Intersection Observer for fade-in animations
   */
  setupIntersectionObserver() {
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
          const delay = index * getConfig('animations.fadeInDelay', 100);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          fadeInObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
      fadeInObserver.observe(el);
    });

    this.state.observers.push(fadeInObserver);
  },
  /**
   * Setup timeline animations
   */
  setupTimelineAnimations() {
    if (!window.IntersectionObserver) {
      // Fallback para navegadores antiguos
      document.querySelectorAll('.step-card').forEach(el => el.classList.add('animate-in'));
      return;
    }

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Delay escalonado para animación secuencial
          const delay = index * 200;

          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, delay);

          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observar todos los step-cards
    document.querySelectorAll('.step-card').forEach(card => {
      timelineObserver.observe(card);
    });

    this.state.observers.push(timelineObserver);
  },
  /**
   * Setup scroll-based animations
   */
  setupScrollAnimations() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateNavbarOnScroll();
          this.updateParallaxElements();
          this.updateScrollIndicator();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttled scroll listener
    const throttledScroll = this.throttle(handleScroll, getConfig('performance.debounceDelay', 250));
    window.addEventListener('scroll', throttledScroll, {
      passive: true
    });
  },

  /**
   * Update navbar appearance on scroll
   */
  updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  },

  /**
   * Update parallax elements
   */
  updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('.floating');
    const scrollY = window.scrollY;

    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const rate = (scrollY - elementTop) * 0.05; // Reduced rate for smoother effect

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.style.transform = `translateY(${rate}px)`;
      }
    });
  },

  /**
   * Update scroll indicator visibility
   */
  updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      if (window.scrollY > 100) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    }
  },

  /**
   * Setup counter animations
   */
  setupCounterAnimations() {
    if (!window.IntersectionObserver) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.state.counters.has(entry.target)) {
          this.animateCounter(entry.target);
          this.state.counters.add(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(el => {
      // Store the original target value
      const targetText = el.textContent.trim();
      el.setAttribute('data-target', targetText);
      counterObserver.observe(el);
    });

    this.state.observers.push(counterObserver);
  },

  /**
   * Animate counter from 0 to target value
   */
  animateCounter(element) {
    const targetText = element.getAttribute('data-target') || element.textContent.trim();
    let targetNumber = 0;
    let suffix = '';
    let prefix = '';

    // Extract number and suffixes/prefixes
    const match = targetText.match(/^(\d+)(.*)$/);
    if (match) {
      targetNumber = parseInt(match[1]);
      suffix = match[2] || '';
    } else {
      // Handle special cases like "24/7"
      const specialMatch = targetText.match(/^(\d+)(\/\d+|[a-zA-Z%+x]+)$/);
      if (specialMatch) {
        targetNumber = parseInt(specialMatch[1]);
        suffix = specialMatch[2];
      } else {
        // If no number, exit
        return;
      }
    }

    if (isNaN(targetNumber) || targetNumber === 0) return;

    let current = 0;
    const duration = 2000; // 2 seconds
    const increment = targetNumber / (duration / 16); // 60fps

    const updateCounter = () => {
      current += increment;

      if (current >= targetNumber) {
        current = targetNumber;
        element.textContent = prefix + targetNumber + suffix;
        return;
      }

      element.textContent = prefix + Math.ceil(current) + suffix;
      requestAnimationFrame(updateCounter);
    };

    // Start animation
    element.textContent = prefix + '0' + suffix;
    requestAnimationFrame(updateCounter);
  },

  /**
   * Setup hover effects
   */
  setupHoverEffects() {
    // Add hover class to cards for CSS animations
    document.querySelectorAll('.hover-lift').forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('hovered');
      });

      element.addEventListener('mouseleave', () => {
        element.classList.remove('hovered');
      });
    });

    // Button hover effects with ripple
    document.querySelectorAll('.btn-primary, .btn-secondary, .service-cta').forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        this.createRippleEffect(e);
      });
    });
  },

  /**
   * Create ripple effect on button hover
   */
  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Remove existing ripple
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create new ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;

    // Add CSS animation if not exists
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
        .btn-primary, .btn-secondary, .service-cta {
          position: relative;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);
  },

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  },

  /**
   * Preload critical images for better performance
   */
  preloadCriticalImages() {
    const images = getConfig('performance.preloadImages', []);

    images.forEach(imageSrc => {
      const img = new Image();
      img.src = imageSrc;
    });
  },

  /**
   * Setup typewriter effect
   */
  setupTypewriterEffect() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const words = [
      'negocio', 'empresa', 'proyecto', 'idea',
      'startup', 'visión', 'marca', 'app'
    ];

    this.createTypewriterEffect(typewriterElement, words, {
      typeSpeed: 120,
      deleteSpeed: 80,
      pauseTime: 2500,
      deleteDelay: 800
    });
  },

  /**
   * Create typewriter effect
   */
  createTypewriterEffect(element, words, options = {}) {
    let currentWordIndex = 0;
    let currentText = '';
    let isDeleting = false;

    const typeSpeed = options.typeSpeed || 120;
    const deleteSpeed = options.deleteSpeed || 80;
    const pauseTime = options.pauseTime || 2500;
    const deleteDelay = options.deleteDelay || 800;

    const type = () => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        currentText = currentWord.substring(0, currentText.length - 1);
      } else {
        currentText = currentWord.substring(0, currentText.length + 1);
      }

      element.textContent = currentText;

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && currentText === currentWord) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        timeout = deleteDelay;
      }

      setTimeout(type, timeout);
    };

    type();
  },

  /**
   * Animate element entrance
   */
  animateIn(element, animation = 'fadeInUp') {
    return new Promise((resolve) => {
      element.classList.add('animate-in', animation);

      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        element.classList.remove('animate-in', animation);
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd);
    });
  },

  /**
   * Animate element exit
   */
  animateOut(element, animation = 'fadeOutDown') {
    return new Promise((resolve) => {
      element.classList.add('animate-out', animation);

      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        element.classList.remove('animate-out', animation);
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd);
    });
  },

  /**
   * Setup staggered animations for elements
   */
  setupStaggeredAnimations() {
    const staggeredElements = document.querySelectorAll('.stagger-animation');

    staggeredElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
    });
  },

  /**
   * Setup loading animations
   */
  setupLoadingAnimations() {
    // Hide loader after page is ready
    window.addEventListener('load', () => {
      const loader = document.getElementById('loader-overlay');
      if (loader) {
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.add('loaded');

          // Start entrance animations
          this.triggerEntranceAnimations();
        }, 500);
      }
    });
  },

  /**
   * Trigger entrance animations
   */
  triggerEntranceAnimations() {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 200);
    });
  },

  /**
   * Setup scroll progress indicator
   */
  setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
      z-index: 9999;
      transition: width 0.1s ease;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }, {
      passive: true
    });
  },

  /**
   * Utility: Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Utility: Debounce function
   */
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  /**
   * Clean up animations and observers
   */
  destroy() {
    // Disconnect all observers
    this.state.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });

    // Clear state
    this.state.observers = [];
    this.state.counters.clear();
    this.state.isInitialized = false;

    if (getConfig('dev.enableConsoleMessages')) {
      console.log('🧹 Animations cleaned up');
    }
  }
};

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.LAURA_Animations.init();
    window.LAURA_Animations.setupTypewriterEffect();
    window.LAURA_Animations.setupLoadingAnimations();
    window.LAURA_Animations.setupScrollProgress();
  });
} else {
  window.LAURA_Animations.init();
  window.LAURA_Animations.setupTypewriterEffect();
  window.LAURA_Animations.setupLoadingAnimations();
  window.LAURA_Animations.setupScrollProgress();
}


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
    const featuredArticles = [{
      id: 'ia-transformacion-digital-2025',
      title: 'IA y Transformación Digital: Tendencias 2025',
      excerpt: 'Descubre cómo la inteligencia artificial está revolucionando los negocios y qué esperar en los próximos meses.',
      category: 'Inteligencia Artificial',
      readTime: '5 min',
      image: 'https://via.placeholder.com/400x200/e21e5c/ffffff?text=IA+2025',
      author: 'Equipo LAURA',
      date: '2025-01-15',
      featured: true
    }, {
      id: 'ciberseguridad-pymes-guia-completa',
      title: 'Ciberseguridad para PYMEs: Guía Completa',
      excerpt: 'Todo lo que necesitas saber para proteger tu empresa de las amenazas digitales más comunes en 2025.',
      category: 'Ciberseguridad',
      readTime: '8 min',
      image: 'https://via.placeholder.com/400x200/764ba2/ffffff?text=Seguridad+PYME',
      author: 'Equipo LAURA',
      date: '2025-01-10',
      featured: true
    }, {
      id: 'marketing-digital-ia-resultados',
      title: 'Marketing Digital + IA = Resultados Exponenciales',
      excerpt: 'Casos reales de cómo nuestros clientes multiplicaron sus conversiones usando marketing impulsado por IA.',
      category: 'Marketing Digital',
      readTime: '6 min',
      image: 'https://via.placeholder.com/400x200/10b981/ffffff?text=Marketing+IA',
      author: 'Equipo LAURA',
      date: '2025-01-05',
      featured: true
    }];

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
      this.initSpecialtyFilters();
      this.renderSpecialtyPlans() // Añadir esta línea

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


/**
 * LAURA DIGITAL AGENCY - Forms Module
 * Handles form validation, submission, and user interactions
 * Version: 2.2.0 - Enhanced Global Focus
 */

window.LAURA_Forms = {

  // Form state management
  state: {
    forms: new Map(),
    validators: new Map(),
    isInitialized: false
  },

  /**
   * Initialize forms module
   */
    init() {
    if (this.state.isInitialized) return;
    try {
      this.setupValidators();
      setTimeout(() => {
        this.setupContactForm();
        // La línea que causaba el error ya no está aquí.
        this.setupFormInteractions();
        this.setupNewsletterForms();
        this.state.isInitialized = true;
        if (getConfig('dev.enableConsoleMessages')) {
          console.log('✅ Forms module initialized successfully');
        }
      }, 500);
    } catch (error) {
      console.error('❌ Error initializing forms:', error);
    }
  },

  /**
   * Setup form validators
   */
  setupValidators() {
    this.state.validators.set('required', {
      validate: (value) => value && value.trim().length > 0,
      message: 'Este campo es obligatorio'
    });

    this.state.validators.set('email', {
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Por favor, introduce un email válido'
    });

    this.state.validators.set('phone', {
      validate: (value) => {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(value);
      },
      message: 'Por favor, introduce un teléfono válido'
    });

    this.state.validators.set('minLength', {
      validate: (value, minLength = 10) => value && value.trim().length >= minLength,
      message: (minLength) => `Debe tener al menos ${minLength} caracteres`
    });
  },

  /**
   * Setup main contact form
   */
  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
      console.log('❌ Contact form not found, will retry...');
      // Retry after a delay
      setTimeout(() => {
        this.setupContactForm();
      }, 1000);
      return;
    }

    console.log('✅ Contact form found, setting up...');

    // Store form reference
    this.state.forms.set('contact', form);

    // Setup form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactFormSubmission(form);
    });

    // Setup real-time validation
    this.setupRealTimeValidation(form);

    // Add form styles
    this.addFormStyles();

    console.log('✅ Contact form setup complete');
  },

  /**
   * Handle contact form submission
   */
  async handleContactFormSubmission(form) {
    try {
      console.log('📝 Form submission started');

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
        <div class="loading-animation">
          <div class="loading-spinner"></div>
          <span>Enviando...</span>
        </div>
      `;

      // Disable form
      this.setFormDisabled(form, true);

      // Submit form (simulate successful submission for now)
      const result = await this.simulateFormSubmission(formData);

      if (result.success) {
        this.showSuccessMessage(form, '¡Gracias! Tu consulta ha sido enviada. Te contactaremos pronto.');
        this.resetForm(form);

        // Track conversion
        this.trackFormSubmission('contact', formData);

        // Generate WhatsApp link as backup
        this.showWhatsAppBackup(formData);
      } else {
        this.showErrorMessage(form, result.message || 'Error al enviar el formulario');
      }

      // Restore button
      submitBtn.innerHTML = originalContent;

    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(form, 'Error inesperado. Por favor, intenta nuevamente o contáctanos por WhatsApp.');
    } finally {
      // Re-enable form
      this.setFormDisabled(form, false);
    }
  },

  /**
   * Simulate form submission (replace with actual backend call)
   */
  async simulateFormSubmission(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For now, always return success
    // In production, replace this with actual form submission
    return {
      success: true,
      message: 'Formulario enviado correctamente'
    };
  },

  /**
   * Show WhatsApp backup option
   */
  showWhatsAppBackup(formData) {
    const whatsappMessage = this.generateWhatsAppMessage(formData);
    const whatsappLink = `https://wa.me/56999968482?text=${encodeURIComponent(whatsappMessage)}`;

    // Create WhatsApp backup notification
    const notification = document.createElement('div');
    notification.className = 'whatsapp-backup-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 120px;
      right: 20px;
      background: #25d366;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
      z-index: 10000;
      font-weight: 500;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 300px;
      text-align: center;
    `;

    notification.innerHTML = `
      <div style="margin-bottom: 0.5rem;">
        <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i>
      </div>
      <div style="font-size: 0.875rem; margin-bottom: 1rem;">
        También puedes contactarnos directamente por WhatsApp
      </div>
      <a href="${whatsappLink}" target="_blank" style="
        background: rgba(255,255,255,0.2);
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        display: inline-block;
      ">
        Abrir WhatsApp
      </a>
      <button onclick="this.parentElement.remove()" style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
      ">×</button>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 3000); // Show after 3 seconds

    // Remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 13000);
  },

  /**
   * Generate WhatsApp message from form data
   */
  generateWhatsAppMessage(formData) {
    let message = '¡Hola! Te escribo desde laura.lat\n\n';

    if (formData.name) message += `👤 Nombre: ${formData.name}\n`;
    if (formData.email) message += `📧 Email: ${formData.email}\n`;
    if (formData.company) message += `🏢 Empresa: ${formData.company}\n`;
    if (formData.country) message += `🌍 País: ${formData.country}\n`;
    if (formData.service) {
      const serviceLabels = {
        'marketing-monthly': '📈 Plan Mensual - Marketing Digital',
        'development-monthly': '💻 Plan Mensual - Desarrollo Web',
        'security-monthly': '🛡️ Plan Mensual - Ciberseguridad',
        'integral-monthly': '🔄 Plan Mensual - Solución Integral',
        'web-project': '🚀 Proyecto - Desarrollo Web',
        'consultancy': '🎯 Consultoría y Estrategia',
        'custom': '✨ Proyecto Personalizado'
      };
      message += `🎯 Servicio: ${serviceLabels[formData.service] || formData.service}\n`;
    }

    message += '\n💬 Mensaje:\n';
    if (formData.message) message += formData.message;

    message += '\n\n¿Podemos conversar sobre mi proyecto?';

    return message;
  },

  /**
   * Setup real-time validation
   */
  setupRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // Clear errors on input
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  },

  /**
   * Validate individual field
   */
  validateField(field) {
    const errors = [];
    const value = field.value.trim();
    const fieldName = field.name;
    const isRequired = field.hasAttribute('required');

    // Required validation
    if (isRequired && !value) {
      errors.push(this.state.validators.get('required').message);
    }

    // Type-specific validation
    if (value) {
      switch (field.type) {
        case 'email':
          if (!this.state.validators.get('email').validate(value)) {
            errors.push(this.state.validators.get('email').message);
          }
          break;
        case 'tel':
          if (!this.state.validators.get('phone').validate(value)) {
            errors.push(this.state.validators.get('phone').message);
          }
          break;
      }

      // Textarea minimum length
      if (field.tagName === 'TEXTAREA' && fieldName === 'message') {
        if (!this.state.validators.get('minLength').validate(value, 10)) {
          errors.push(this.state.validators.get('minLength').message(10));
        }
      }
    }

    // Show/hide errors
    if (errors.length > 0) {
      this.showFieldError(field, errors[0]);
      return false;
    } else {
      this.clearFieldError(field);
      return true;
    }
  },

  /**
   * Validate entire form
   */
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

    return {
      isValid,
      errors
    };
  },

  /**
   * Show field error
   */
  showFieldError(field, message) {
    // Clear existing error
    this.clearFieldError(field);

    // Add error class
    field.classList.add('error');

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.id = `${field.name}-error`;

    // Insert error message
    field.parentNode.appendChild(errorDiv);
  },

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector(`#${field.name}-error`);
    if (existingError) {
      existingError.remove();
    }
  },

  /**
   * Get field error message
   */
  getFieldError(field) {
    const errorElement = field.parentNode.querySelector(`#${field.name}-error`);
    return errorElement ? errorElement.textContent : '';
  },

  /**
   * Setup form interactions
   */
  setupFormInteractions() {
    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('input', () => {
        this.autoResizeTextarea(textarea);
      });
    });

    // Format phone numbers
    document.querySelectorAll('input[type="tel"]').forEach(input => {
      input.addEventListener('input', (e) => {
        this.formatPhoneNumber(e.target);
      });
    });

    // Capitalize company names
    document.querySelectorAll('input[name="company"]').forEach(input => {
      input.addEventListener('blur', (e) => {
        e.target.value = this.capitalizeWords(e.target.value);
      });
    });

    // Setup country suggestions
    this.setupCountrySuggestions();
  },

  /**
   * Setup country suggestions for global focus
   */
  setupCountrySuggestions() {
    const countryInput = document.querySelector('input[name="country"]');
    if (!countryInput) return;

    const countries = [
      'Chile', 'Argentina', 'Colombia', 'México', 'Perú', 'Ecuador', 'Uruguay', 'Paraguay',
      'España', 'Estados Unidos', 'Canadá', 'Brasil', 'Venezuela', 'Bolivia', 'Costa Rica',
      'Panamá', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'República Dominicana',
      'Puerto Rico', 'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Portugal', 'Australia'
    ];

    let suggestionsList = null;

    countryInput.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();

      // Remove existing suggestions
      if (suggestionsList) {
        suggestionsList.remove();
        suggestionsList = null;
      }

      if (value.length < 2) return;

      const filteredCountries = countries.filter(country =>
        country.toLowerCase().includes(value)
      ).slice(0, 5);

      if (filteredCountries.length > 0) {
        suggestionsList = document.createElement('div');
        suggestionsList.className = 'country-suggestions';
        suggestionsList.style.cssText = `
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        `;

        filteredCountries.forEach(country => {
          const suggestion = document.createElement('div');
          suggestion.textContent = country;
          suggestion.style.cssText = `
            padding: 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.2s ease;
          `;

          suggestion.addEventListener('mouseenter', () => {
            suggestion.style.backgroundColor = '#f8fafc';
          });

          suggestion.addEventListener('mouseleave', () => {
            suggestion.style.backgroundColor = '';
          });

          suggestion.addEventListener('click', () => {
            countryInput.value = country;
            suggestionsList.remove();
            suggestionsList = null;
          });

          suggestionsList.appendChild(suggestion);
        });

        // Position suggestions relative to input
        countryInput.parentNode.style.position = 'relative';
        countryInput.parentNode.appendChild(suggestionsList);
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!countryInput.contains(e.target) && suggestionsList) {
        suggestionsList.remove();
        suggestionsList = null;
      }
    });
  },

  /**
   * Setup newsletter forms
   */
  setupNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmission(form);
      });
    });
  },

  /**
   * Handle newsletter subscription
   */
  async handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!this.state.validators.get('email').validate(email)) {
      this.showFieldError(emailInput, 'Por favor, introduce un email válido');
      return;
    }

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <div class="loading-animation">
          <div class="loading-spinner"></div>
          <span>Suscribiendo...</span>
        </div>
      `;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.showSuccessMessage(form, '¡Gracias! Te has suscrito exitosamente a nuestro newsletter.');
      form.reset();

      // Track subscription
      this.trackFormSubmission('newsletter', {
        email
      });

      submitBtn.innerHTML = originalContent;

    } catch (error) {
      this.showErrorMessage(form, 'Error al suscribirse. Intenta nuevamente.');
    }
  },

  /**
   * Get form data as object
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  },

  /**
   * Set form disabled state
   */
  setFormDisabled(form, disabled) {
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
      input.disabled = disabled;
    });
  },

  /**
   * Reset form to initial state
   */
  resetForm(form) {
    form.reset();

    // Clear all errors
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

    // Clear messages
    this.clearMessages(form);
  },

  /**
   * Show success message
   */
  showSuccessMessage(form, message = '¡Mensaje enviado correctamente!') {
    this.clearMessages(form);

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;

    form.insertBefore(successDiv, form.firstChild);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.style.opacity = '0';
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.remove();
          }
        }, 300);
      }
    }, 8000);
  },

  /**
   * Show error message
   */
  showErrorMessage(form, message) {
    this.clearMessages(form);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;

    form.insertBefore(errorDiv, form.firstChild);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.style.opacity = '0';
        setTimeout(() => {
          if (errorDiv.parentNode) {
            errorDiv.remove();
          }
        }, 300);
      }
    }, 8000);
  },

  /**
   * Clear all messages
   */
  clearMessages(form) {
    form.querySelectorAll('.form-success, .form-error').forEach(msg => msg.remove());
  },

  /**
   * Auto-resize textarea
   */
  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  },

  /**
   * Format phone number
   */
  formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.startsWith('56')) {
      // Chilean format
      value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '+$1 $2 $3 $4');
    } else if (value.length >= 9) {
      // Generic format
      value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }

    input.value = value;
  },

  /**
   * Capitalize words
   */
  capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Track form submission (for analytics)
   */
  trackFormSubmission(formType, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        form_type: formType,
        form_data: JSON.stringify(data)
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: formType,
        content_category: 'form_submission'
      });
    }

    // Custom analytics
    if (window.LAURA_Analytics && typeof window.LAURA_Analytics.track === 'function') {
      window.LAURA_Analytics.track('form_submission', {
        type: formType,
        timestamp: new Date().toISOString(),
        data: data
      });
    }

    if (getConfig('dev.enableConsoleMessages')) {
      console.log(`📊 Form submission tracked: ${formType}`, data);
    }
  },

  /**
   * Show validation errors
   */
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
      firstErrorField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  },

  /**
   * Add form styles
   */
  addFormStyles() {
    if (document.getElementById('forms-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'forms-styles';
    styles.textContent = `
      .contact-form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        width: 100%;
      }
      
      @media (min-width: 768px) {
        .contact-form {
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .contact-form .form-group:nth-child(3),
        .contact-form .form-group:nth-child(4),
        .contact-form .form-group-full {
          grid-column: 1 / -1;
        }
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
      }
      
      .form-group-full {
        display: flex;
        flex-direction: column;
        grid-column: 1 / -1;
      }
      
      .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      
      .form-input.error,
      .form-textarea.error,
      .form-select.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
      
      .form-success {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid #10b981;
        color: #065f46;
        padding: 1rem;
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        grid-column: 1 / -1;
        transition: opacity 0.3s ease;
      }
      
      .form-error {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #991b1b;
        padding: 1rem;
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        grid-column: 1 / -1;
        transition: opacity 0.3s ease;
      }
      
      .loading-animation {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
      }
      
      .loading-spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .country-suggestions {
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
      }

      .country-suggestions::-webkit-scrollbar {
        width: 6px;
      }

      .country-suggestions::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      .country-suggestions::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      .whatsapp-backup-notification {
        font-family: var(--font-body);
      }
    `;
    document.head.appendChild(styles);
  },

  /**
   * Destroy forms module
   */
  destroy() {
    // Clear form references
    this.state.forms.clear();
    this.state.validators.clear();
    this.state.isInitialized = false;

    if (getConfig('dev.enableConsoleMessages')) {
      console.log('🧹 Forms module cleaned up');
    }
  }
};

// Initialize forms when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.LAURA_Forms.init();
  });
} else {
  window.LAURA_Forms.init();
}


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
      this.setupForms(); // ← Mantener esta
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

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

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

    const services = [{
      icon: 'fas fa-code',
      title: 'Desarrollo Web',
      description: 'Sitios web modernos, rápidos y optimizados que convierten visitantes en clientes.',
      features: [
        'Diseño responsive profesional',
        'Optimización SEO avanzada',
        'Carga ultrarrápida',
        'Panel de administración'
      ]
    }, {
      icon: 'fas fa-chart-line',
      title: 'Marketing Digital',
      description: 'Estrategias de marketing digital que generan leads calificados y aumentan tus ventas.',
      features: [
        'Google Ads y Facebook Ads',
        'SEO y posicionamiento',
        'Email marketing',
        'Análisis y reportes'
      ]
    }, {
      icon: 'fas fa-shield-alt',
      title: 'Ciberseguridad',
      description: 'Protección integral para tu negocio digital contra amenazas y vulnerabilidades.',
      features: [
        'Auditorías de seguridad',
        'Monitoreo 24/7',
        'Respaldo automático',
        'Certificados SSL'
      ]
    }];

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
    }, {
      threshold: 0.5
    });

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

    return {
      isValid,
      errors
    };
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


/**
 * LAURA DIGITAL AGENCY - Smart WhatsApp Integration
 * Se integra con tu formulario existente manteniendo tu diseño
 * Version: 1.0 - Compatible con config.js
 */

class LauraWhatsAppIntegration {
  constructor() {
    this.whatsappNumber = window.getConfig('company.whatsapp', '56999968482');
    this.init();
  }

  init() {
    // Esperar a que el DOM y config.js estén listos
    if (typeof window.LAURA_CONFIG === 'undefined') {
      setTimeout(() => this.init(), 100);
      return;
    }

    this.setupExistingForm();
    console.log('✅ LAURA WhatsApp Integration initialized');
  }

  /**
   * Integra con tu formulario existente
   */
  setupExistingForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
      console.log('⏳ Waiting for contact form...');
      setTimeout(() => this.setupExistingForm(), 500);
      return;
    }

    console.log('✅ Found existing contact form, integrating WhatsApp...');

    // Interceptar el envío del formulario existente
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleExistingFormSubmission(form);
    });

    // Cambiar el texto del botón existente
    this.updateSubmitButton(form);
  }

  /**
   * Actualiza el botón de envío existente
   */
  updateSubmitButton(form) {
    const submitBtn = form.querySelector('button[type="submit"], .form-submit, .btn-primary');
    if (submitBtn) {
      // Mantener el estilo existente, solo cambiar texto e ícono
      const originalText = submitBtn.textContent || submitBtn.innerHTML;

      if (!originalText.includes('WhatsApp')) {
        submitBtn.innerHTML = `
          <i class="fab fa-whatsapp"></i>
          Enviar por WhatsApp
        `;
      }
    }
  }

  /**
   * Maneja el envío del formulario existente
   */
  async handleExistingFormSubmission(form) {
    try {
      // Usar la validación existente si está disponible
      if (window.FormsManager && window.FormsManager.validateForm) {
        const validation = window.FormsManager.validateForm(form);
        if (!validation.isValid) {
          // Usar el sistema de errores existente
          window.FormsManager.showValidationErrors(form, validation.errors);
          return;
        }
      }

      // Obtener datos del formulario existente
      const formData = this.getFormDataFromExisting(form);

      // Mostrar loading usando el estilo existente
      this.showLoadingState(form);

      // Generar mensaje inteligente
      const whatsappMessage = this.generateIntelligentMessage(formData);

      // Simular delay para mejor UX (como lo tenías antes)
      setTimeout(() => {
        this.openWhatsApp(whatsappMessage);
        this.showSuccess(form);
        this.resetLoadingState(form);
      }, 800);

    } catch (error) {
      console.error('Error al procesar formulario:', error);
      this.showError(form, 'Error al procesar. Intenta nuevamente.');
      this.resetLoadingState(form);
    }
  }

  /**
   * Obtiene datos del formulario existente con mapeo inteligente
   */
  getFormDataFromExisting(form) {
    const formData = new FormData(form);
    const data = {};

    // Mapear campos del formulario existente
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    return {
      name: data.name || data.firstName || data.nombre || '',
      email: data.email || data.correo || '',
      company: data.company || data.empresa || '',
      country: data.country || data.pais || '',
      service: data.service || data.servicio || '',
      message: data.message || data.mensaje || ''
    };
  }

  /**
   * Detecta el servicio principal basado en selección y texto
   */
  detectPrimaryService(formData) {
    const {
      service,
      message
    } = formData;

    // Si hay servicio seleccionado, usar eso principalmente
    if (service) {
      if (service.includes('marketing')) return 'marketing';
      if (service.includes('development') || service.includes('web')) return 'development';
      if (service.includes('security')) return 'security';
      if (service.includes('consultancy') || service.includes('consulting')) return 'consulting';
      if (service.includes('integral')) return 'integral';
    }

    // Análisis de texto como backup
    const text = message.toLowerCase();
    const keywords = {
      marketing: ['marketing', 'ventas', 'clientes', 'publicidad', 'redes sociales', 'seo', 'ads'],
      development: ['página', 'sitio', 'web', 'aplicación', 'desarrollo', 'programar'],
      security: ['seguridad', 'protección', 'ciberseguridad', 'vulnerabilidad'],
      consulting: ['consultoría', 'estrategia', 'análisis', 'optimización']
    };

    let maxScore = 0;
    let detectedService = 'general';

    Object.entries(keywords).forEach(([serviceKey, words]) => {
      const score = words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
      if (score > maxScore) {
        maxScore = score;
        detectedService = serviceKey;
      }
    });

    return detectedService;
  }

  /**
   * Genera mensaje inteligente basado en tu config.js
   */
  generateIntelligentMessage(formData) {
    const {
      name,
      email,
      company,
      country,
      service,
      message
    } = formData;
    const detectedService = this.detectPrimaryService(formData);

    // Templates personalizados por servicio
    const serviceIntros = {
      marketing: "¡Hola! Me interesa potenciar mi marketing digital y multiplicar mis ventas.",
      development: "¡Hola! Necesito desarrollar/mejorar mi presencia web para hacer crecer mi negocio.",
      security: "¡Hola! Me preocupa la ciberseguridad de mi empresa y necesito protección profesional.",
      consulting: "¡Hola! Busco consultoría estratégica para optimizar y digitalizar mi negocio.",
      integral: "¡Hola! Necesito una solución integral que combine varios servicios digitales.",
      general: "¡Hola! Me interesa conocer cómo LAURA puede ayudarme a crecer digitalmente."
    };

    const intro = serviceIntros[detectedService] || serviceIntros.general;

    // Construir mensaje personalizado
    let whatsappMessage = `${intro}\n\n`;

    // Información personal
    whatsappMessage += `📋 *Mis datos:*\n`;
    whatsappMessage += `• Nombre: ${name}\n`;
    whatsappMessage += `• Email: ${email}\n`;
    if (company) whatsappMessage += `• Empresa: ${company}\n`;
    if (country) whatsappMessage += `• País: ${country}\n`;

    // Servicio seleccionado
    if (service) {
      const serviceNames = {
        'marketing-monthly': 'Plan Mensual - Marketing Digital',
        'development-monthly': 'Plan Mensual - Desarrollo Web',
        'security-monthly': 'Plan Mensual - Ciberseguridad',
        'integral-monthly': 'Plan Mensual - Solución Integral',
        'web-project': 'Proyecto - Desarrollo Web',
        'consultancy': 'Consultoría y Estrategia',
        'custom': 'Proyecto Personalizado'
      };

      whatsappMessage += `• Servicio: ${serviceNames[service] || service}\n`;
    }

    whatsappMessage += `\n`;

    // Mensaje del usuario
    if (message && message.trim()) {
      whatsappMessage += `💬 *Detalles del proyecto:*\n"${message}"\n\n`;
    }

    // Call to action personalizado
    whatsappMessage += `¿Podemos agendar una *consultoría gratuita* para ver exactamente cómo podemos ayudarte? 🚀`;

    return whatsappMessage;
  }

  /**
   * Abre WhatsApp con el mensaje
   */
  openWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Estados de loading usando tus estilos existentes
   */
  showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"], .form-submit, .btn-primary');
    if (submitBtn) {
      submitBtn.dataset.originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <svg style="width: 16px; height: 16px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.3"/>
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
          </svg>
          <span>Abriendo WhatsApp...</span>
        </div>
      `;
      submitBtn.disabled = true;
    }
  }

  resetLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"], .form-submit, .btn-primary');
    if (submitBtn && submitBtn.dataset.originalContent) {
      submitBtn.innerHTML = submitBtn.dataset.originalContent;
      submitBtn.disabled = false;
      delete submitBtn.dataset.originalContent;
    }
  }

  /**
   * Muestra éxito usando tu sistema existente
   */
  showSuccess(form) {
    // Usar el sistema de mensajes existente si está disponible
    if (window.FormsManager && window.FormsManager.showSuccessMessage) {
      window.FormsManager.showSuccessMessage(form, '¡Perfecto! Te hemos redirigido a WhatsApp con tu consulta personalizada. Responderemos en menos de 2 horas.');
    } else {
      // Fallback simple que respeta tu diseño
      this.showMessage(form, 'success', '¡Perfecto! Te hemos redirigido a WhatsApp con tu consulta personalizada.');
    }

    // Reset del formulario después de un momento
    setTimeout(() => form.reset(), 2000);
  }

  showError(form, message) {
    if (window.FormsManager && window.FormsManager.showErrorMessage) {
      window.FormsManager.showErrorMessage(form, message);
    } else {
      this.showMessage(form, 'error', message);
    }
  }

  /**
   * Sistema de mensajes simple que respeta tu diseño
   */
  showMessage(form, type, message) {
    // Remover mensajes existentes
    form.querySelectorAll('.whatsapp-message').forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `whatsapp-message ${type}`;
    messageDiv.style.cssText = `
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
      font-weight: 500;
      ${type === 'success' 
        ? 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);'
        : 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
      }
    `;
    messageDiv.textContent = message;

    form.insertBefore(messageDiv, form.firstChild);

    // Auto-hide después de 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) messageDiv.remove();
    }, 5000);
  }
}

// CSS para animación (se integra con tu main.css)
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Inicializar cuando todo esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LauraWhatsAppIntegration();
  });
} else {
  new LauraWhatsAppIntegration();
}

// Disponible globalmente si necesitas acceder
window.LauraWhatsAppIntegration = LauraWhatsAppIntegration;


/**
 * LAURA DIGITAL AGENCY - Icon Replacement System
 * Reemplaza automáticamente Font Awesome por SVG optimizados
 * Agregar al final de main.js
 */

class LauraIconSystem {
  constructor() {
    this.iconMap = {
      // Social Media
      'fab fa-whatsapp': 'whatsapp',
      'fab fa-linkedin-in': 'linkedin',
      'fab fa-twitter': 'twitter',
      'fab fa-instagram': 'instagram',

      // Contact & Utility
      'fas fa-envelope': 'envelope',
      'fas fa-clock': 'clock',
      'fas fa-map-marker-alt': 'map-marker',

      // Services
      'fas fa-code': 'code',
      'fas fa-chart-line': 'chart-line',
      'fas fa-shield-alt': 'shield',
      'fas fa-lightbulb': 'lightbulb',

      // Features
      'fas fa-award': 'award',
      'fas fa-handshake': 'handshake',
      'fas fa-brain': 'brain',
      'fas fa-check': 'check'
    };

    this.init();
  }

  /**
   * Inicializa el sistema de iconos
   */
  init() {
    // Esperar a que el sprite SVG esté cargado
    if (document.getElementById('laura-icons')) {
      this.replaceAllIcons();
    } else {
      // Retry si el sprite no está listo
      setTimeout(() => this.init(), 100);
    }
  }

  /**
   * Reemplaza todos los iconos Font Awesome por SVG
   */
  replaceAllIcons() {
    console.log('🎨 LAURA Icons: Replacing Font Awesome with optimized SVG...');

    let replacedCount = 0;

    Object.entries(this.iconMap).forEach(([faClass, iconName]) => {
      const selector = `.${faClass.replace(/ /g, '.')}`;
      const elements = document.querySelectorAll(selector);

      elements.forEach(el => {
        const svgIcon = this.createSVGIcon(iconName, el);
        el.replaceWith(svgIcon);
        replacedCount++;
      });
    });

    console.log(`✅ LAURA Icons: Replaced ${replacedCount} Font Awesome icons with SVG`);

    // Opcional: remover Font Awesome CSS si ya no es necesario
    this.removeFontAwesome();
  }

  /**
   * Crea un elemento SVG icon
   */
  createSVGIcon(iconName, originalElement) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    // Configurar SVG
    svg.classList.add('icon', `icon-${iconName}`);
    svg.setAttribute('viewBox', '0 0 24 24');

    // Configurar use element
    use.setAttribute('href', `#icon-${iconName}`);
    svg.appendChild(use);

    // Copiar clases relevantes del elemento original
    if (originalElement) {
      const existingClasses = Array.from(originalElement.classList).filter(cls =>
        !cls.startsWith('fa') && cls !== 'fas' && cls !== 'fab'
      );
      svg.classList.add(...existingClasses);

      // Copiar atributos importantes
      if (originalElement.title) svg.setAttribute('title', originalElement.title);
      if (originalElement.style.cssText) svg.style.cssText = originalElement.style.cssText;
    }

    return svg;
  }

  /**
   * Helper para crear iconos programáticamente
   */
  static createIcon(iconName, className = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    svg.classList.add('icon', `icon-${iconName}`);
    if (className) svg.classList.add(...className.split(' '));
    svg.setAttribute('viewBox', '0 0 24 24');

    use.setAttribute('href', `#icon-${iconName}`);
    svg.appendChild(use);

    return svg;
  }

  /**
   * Helper para obtener HTML de icono como string
   */
  static getIconHTML(iconName, className = '') {
    return `<svg class="icon icon-${iconName} ${className}" viewBox="0 0 24 24"><use href="#icon-${iconName}"></use></svg>`;
  }

  /**
   * Remueve Font Awesome CSS (opcional)
   */
  removeFontAwesome() {
    const faLinks = document.querySelectorAll('link[href*="font-awesome"]');
    faLinks.forEach(link => {
      console.log('🗑️ LAURA Icons: Removing Font Awesome CSS:', link.href);
      link.remove();
    });
  }

  /**
   * Actualiza componentes dinámicos que usen iconos
   */
  updateDynamicComponents() {
    // Si tu proyecto carga componentes dinámicamente,
    // llama a esta función después de cargarlos
    this.replaceAllIcons();
  }
}

/**
 * Integración con tu config.js existente
 */
function updateConfigJSIcons() {
  // Actualizar función renderSVGIcon en config.js para usar el nuevo sistema
  if (window.renderSVGIcon) {
    const originalRenderSVGIcon = window.renderSVGIcon;

    window.renderSVGIcon = function(iconType, className = 'icon-svg') {
      // Mapear tus iconos custom existentes
      const customIconMap = {
        'code-svg': 'code',
        'shield-svg': 'shield',
        'trending-up-svg': 'chart-line',
        'award-svg': 'award',
        'users-svg': 'handshake',
        'brain-svg': 'brain'
      };

      const iconName = customIconMap[iconType];
      if (iconName) {
        return LauraIconSystem.getIconHTML(iconName, className);
      }

      // Fallback al sistema original si no encuentra el icono
      return originalRenderSVGIcon(iconType, className);
    };
  }
}

/**
 * Inicialización automática
 */
document.addEventListener('DOMContentLoaded', function() {
  // Crear instancia global
  window.lauraIconSystem = new LauraIconSystem();

  // Actualizar config.js
  updateConfigJSIcons();

  console.log('🎨 LAURA Icon System initialized');
});

// Export para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LauraIconSystem;
}

// Hacer disponible globalmente
window.LauraIconSystem = LauraIconSystem;

/**
 * FUNCIONES HELPER PARA USO FÁCIL
 */

// Crear icono rápido
window.createIcon = function(iconName, className = '') {
  return LauraIconSystem.createIcon(iconName, className);
};

// Obtener HTML de icono
window.getIconHTML = function(iconName, className = '') {
  return LauraIconSystem.getIconHTML(iconName, className);
};

// Reemplazar iconos en elemento específico
window.replaceIconsIn = function(element) {
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = element.innerHTML;

  // Aplicar reemplazo temporal
  window.lauraIconSystem.replaceAllIcons.call({
    iconMap: window.lauraIconSystem.iconMap,
    createSVGIcon: window.lauraIconSystem.createSVGIcon.bind(window.lauraIconSystem)
  });

  element.innerHTML = tempContainer.innerHTML;
};