/**
 * LAURA DIGITAL AGENCY - Main Application Module
 * Coordinates all modules and handles app-wide functionality
 * Version: 1.0.0
 */

window.LAURA_App = {
  
  // Application state
  state: {
    isInitialized: false,
    isMobileMenuOpen: false,
    currentSection: 'inicio',
    performanceMetrics: {},
    modules: []
  },

  /**
   * Initialize the application
   */
  init() {
    if (this.state.isInitialized) return;
    
    try {
      // Show loading spinner
      this.showLoadingSpinner();
      
      // Initialize core functionality
      this.setupNavigation();
      this.setupMobileMenu();
      this.setupPerformanceMonitoring();
      this.setupErrorHandling();
      this.setupAccessibility();
      this.setupSEO();
      this.setupKeyboardShortcuts();
      this.setupLazyLoading();
      
      // Progressive enhancement features
      this.setupServiceWorker();
      this.setupPWA();
      this.setupAnalytics();
      
      // Register modules
      this.registerModules();
      
      // Hide loading spinner when all content is loaded
      this.onContentLoaded();
      
      this.state.isInitialized = true;
      
      if (getConfig('dev.enableConsoleMessages')) {
        console.log('🚀 LAURA App initialized successfully');
        this.logPerformanceMetrics();
      }
      
    } catch (error) {
      console.error('❌ Error initializing LAURA App:', error);
      this.handleCriticalError(error);
    }
  },

  /**
   * Setup navigation functionality
   */
  setupNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Active section tracking
    this.setupSectionTracking();
    
    // Smooth scrolling (handled by animations module)
    // External link handling
    this.setupExternalLinks();
  },

  /**
   * Setup mobile menu functionality
   */
  setupMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#nav-menu') && !e.target.closest('#nav-toggle')) {
        this.closeMobileMenu();
      }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle?.classList.add('active');
    navMenu?.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
    
    this.state.isMobileMenuOpen = true;
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle?.classList.remove('active');
    navMenu?.classList.remove('mobile-open');
    document.body.style.overflow = '';
    
    this.state.isMobileMenuOpen = false;
  },

  /**
   * Setup section tracking for active navigation
   */
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
  },

  /**
   * Update active navigation link
   */
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
  },

  /**
   * Setup external links
   */
  setupExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      // Add external link attributes
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Add external link icon
      if (!link.querySelector('.external-icon')) {
        const icon = document.createElement('i');
        icon.className = 'fas fa-external-link-alt external-icon';
        icon.style.marginLeft = '0.25rem';
        icon.style.fontSize = '0.75rem';
        link.appendChild(icon);
      }
    });
  },

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    if (!getConfig('performance.enablePerformanceMonitoring')) return;

    // Measure initial load time
    window.addEventListener('load', () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.state.performanceMetrics.loadTime = loadTime;
      }

      // Measure DOM content loaded time
      if (performance.timing.domContentLoadedEventEnd) {
        const domLoadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        this.state.performanceMetrics.domLoadTime = domLoadTime;
      }
    });

    // Setup Core Web Vitals monitoring
    this.setupWebVitalsMonitoring();
  },

  /**
   * Setup Core Web Vitals monitoring
   */
  setupWebVitalsMonitoring() {
    // First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.state.performanceMetrics.fcp = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.state.performanceMetrics.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.state.performanceMetrics.fid = entry.processingStart - entry.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.state.performanceMetrics.cls = clsValue;
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    if (!getConfig('dev.enableErrorTracking')) return;

    // Global error handler
    window.addEventListener('error', (e) => {
      this.logError('JavaScript Error', e.error || e.message, {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      this.logError('Unhandled Promise Rejection', e.reason);
    });

    // Resource loading errors
    window.addEventListener('error', (e) => {
      if (e.target !== window) {
        this.logError('Resource Loading Error', `Failed to load: ${e.target.src || e.target.href}`);
      }
    }, true);
  },

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Skip to main content link
    this.createSkipLink();
    
    // Focus management
    this.setupFocusManagement();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Screen reader announcements
    this.setupAriaLive();
  },

  /**
   * Create skip to main content link
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link sr-only focus-visible';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-500);
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Focus visible utility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing');
    });
  },

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Escape key handler for modals/menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close mobile menu
        if (this.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      }
    });
  },

  /**
   * Setup ARIA live regions for announcements
   */
  setupAriaLive() {
    // Create announcement region
    const ariaLive = document.createElement('div');
    ariaLive.id = 'aria-live-region';
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    document.body.appendChild(ariaLive);
  },

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const ariaLive = document.getElementById('aria-live-region');
    if (ariaLive) {
      ariaLive.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        ariaLive.textContent = '';
      }, 1000);
    }
  },

  /**
   * Setup SEO enhancements
   */
  setupSEO() {
    // Add structured data
    this.addStructuredData();
    
    // Dynamic meta tags
    this.updateMetaTags();
    
    // Preload critical resources
    this.preloadCriticalResources();
  },

  /**
   * Add structured data for SEO
   */
  addStructuredData() {
    const structuredData = getConfig('seo.structuredData');
    if (!structuredData) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  },

  /**
   * Update meta tags dynamically
   */
  updateMetaTags() {
    // Update based on current section
    const updateMeta = () => {
      const currentSection = this.state.currentSection;
      let title = getConfig('seo.title');
      let description = getConfig('seo.description');

      // Customize based on section
      switch (currentSection) {
        case 'servicios':
          title = 'Servicios - ' + title;
          description = 'Desarrollo web, ciberseguridad, marketing digital y consultoría con IA.';
          break;
        case 'nosotros':
          title = 'Nosotros - ' + title;
          description = 'Conoce al equipo de LAURA Digital Agency y nuestra metodología con IA.';
          break;
        case 'clientes':
          title = 'Clientes - ' + title;
          description = 'Casos de éxito y testimonios de clientes satisfechos con LAURA.';
          break;
      }

      document.title = title;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content = description;
      }
    };

    // Update on section change
    const observer = new MutationObserver(() => {
      if (this.state.currentSection) {
        updateMeta();
      }
    });
  },

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    const preloads = [
      { href: './assets/css/main.css', as: 'style' },
      { href: './assets/images/hero-dashboard.jpg', as: 'image' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', as: 'style' }
    ];

    preloads.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  },

  /**
   * Register application modules
   */
  registerModules() {
    // Register modules for centralized management
    this.state.modules = [
      'LAURA_Components',
      'LAURA_Animations', 
      'LAURA_Forms'
    ];

    // Verify all modules are loaded
    const missingModules = this.state.modules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
      console.warn('⚠️ Missing modules:', missingModules);
    }
  },

  /**
   * Show loading spinner
   */
  showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.classList.remove('hidden');
    }
  },

  /**
   * Hide loading spinner
   */
  hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.classList.add('hidden');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (spinner.parentNode) {
          spinner.remove();
        }
      }, 300);
    }
  },

  /**
   * Handle when content is loaded
   */
  onContentLoaded() {
    // Set maximum timeout for loading
    const maxLoadTime = 3000; // 3 seconds max
    
    // Hide spinner after timeout regardless
    const timeoutId = setTimeout(() => {
      this.hideLoadingSpinner();
      document.body.classList.add('loaded');
      console.log('⏰ Loading completed by timeout');
    }, maxLoadTime);
    
    // Try to wait for images, but don't block
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
      // No images, hide immediately
      clearTimeout(timeoutId);
      this.hideLoadingSpinner();
      document.body.classList.add('loaded');
      return;
    }
    
    const imagePromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        // Set individual timeout for each image
        const imgTimeout = setTimeout(() => resolve(), 1500);
        
        if (img.complete || img.naturalWidth > 0) {
          clearTimeout(imgTimeout);
          resolve();
        } else {
          const onLoad = () => {
            clearTimeout(imgTimeout);
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = () => {
            clearTimeout(imgTimeout);
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
            resolve(); // Resolve even on error
          };
          
          img.addEventListener('load', onLoad);
          img.addEventListener('error', onError);
        }
      });
    });

    Promise.all(imagePromises).then(() => {
      clearTimeout(timeoutId);
      // Small delay to ensure smooth transition
      setTimeout(() => {
        this.hideLoadingSpinner();
        document.body.classList.add('loaded');
        console.log('✅ All content loaded successfully');
      }, 200);
    });
  },

  /**
   * Log performance metrics
   */
  logPerformanceMetrics() {
    console.group('📊 Performance Metrics');
    Object.entries(this.state.performanceMetrics).forEach(([key, value]) => {
      console.log(`${key}: ${Math.round(value)}ms`);
    });
    console.groupEnd();
  },

  /**
   * Log error
   */
  logError(type, message, details = {}) {
    console.error(`❌ ${type}:`, message, details);
    
    // Send to error tracking service (implement your preferred service)
    // Example: Sentry, LogRocket, etc.
    if (window.Sentry && typeof window.Sentry.captureException === 'function') {
      window.Sentry.captureException(new Error(`${type}: ${message}`), {
        extra: details
      });
    }
  },

  /**
   * Handle critical errors
   */
  handleCriticalError(error) {
    console.error('💥 Critical Error:', error);
    
    // Hide loading spinner
    this.hideLoadingSpinner();
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
      z-index: 9999;
      max-width: 400px;
    `;
    
    errorDiv.innerHTML = `
      <h3 style="color: #ef4444; margin-bottom: 1rem;">
        <i class="fas fa-exclamation-triangle"></i>
        Error de carga
      </h3>
      <p style="margin-bottom: 1.5rem; color: #6b7280;">
        Hubo un problema al cargar la página. Por favor, recarga e intenta nuevamente.
      </p>
      <button onclick="window.location.reload()" style="
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">
        Recargar página
      </button>
    `;
    
    document.body.appendChild(errorDiv);
  },

  /**
   * Scroll to top utility
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  /**
   * Show notification to user
   */
  showNotification(message, type = 'success', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; margin-left: auto; cursor: pointer;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-hide notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, duration);
  },

  /**
   * Lazy load images when they enter viewport
   */
  setupLazyLoading() {
    if (!window.IntersectionObserver) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  },

  /**
   * Setup service worker for offline functionality
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            if (getConfig('dev.enableConsoleMessages')) {
              console.log('✅ ServiceWorker registered:', registration.scope);
            }
          })
          .catch(error => {
            console.log('❌ ServiceWorker registration failed:', error);
          });
      });
    }
  },

  /**
   * Setup progressive web app features
   */
  setupPWA() {
    // Add to home screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button or banner if needed
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      if (getConfig('dev.enableConsoleMessages')) {
        console.log('✅ PWA installed successfully');
      }
      deferredPrompt = null;
    });
  },

  /**
   * Show PWA install prompt
   */
  showInstallPrompt() {
    // Create install prompt (customize as needed)
    const installBanner = document.createElement('div');
    installBanner.style.cssText = `
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      background: var(--primary-500);
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
    `;
    
    installBanner.innerHTML = `
      <div>
        <strong>¡Instala LAURA!</strong>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Accede más rápido desde tu escritorio</p>
      </div>
      <div>
        <button id="install-btn" style="background: white; color: var(--primary-500); border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-right: 0.5rem; cursor: pointer;">
          Instalar
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('install-btn').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          this.showNotification('¡Aplicación instalada correctamente!', 'success');
        }
        
        deferredPrompt = null;
        installBanner.remove();
      }
    });
  },

  /**
   * Setup analytics tracking
   */
  setupAnalytics() {
    // Track page views
    this.trackPageView();
    
    // Track user interactions
    this.setupInteractionTracking();
    
    // Track performance metrics
    this.trackPerformanceMetrics();
  },

  /**
   * Track page view
   */
  trackPageView() {
    const page = window.location.pathname;
    const title = document.title;
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href
      });
    }
    
    // Custom analytics
    if (window.LAURA_Analytics && typeof window.LAURA_Analytics.trackPageView === 'function') {
      window.LAURA_Analytics.trackPageView(page, title);
    }
  },

  /**
   * Setup interaction tracking
   */
  setupInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-primary, .btn-secondary, .service-cta')) {
        const buttonText = e.target.textContent.trim();
        const section = e.target.closest('section')?.id || 'unknown';
        
        this.trackEvent('button_click', {
          button_text: buttonText,
          section: section,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Track service plan selections
    document.addEventListener('click', (e) => {
      if (e.target.matches('.plan-cta')) {
        const planName = e.target.closest('.service-plan-card')?.querySelector('.plan-name')?.textContent;
        
        this.trackEvent('plan_selection', {
          plan_name: planName,
          timestamp: new Date().toISOString()
        });
      }
    });
  },

  /**
   * Track custom events
   */
  trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', eventName, parameters);
    }
    
    // Custom analytics
    if (window.LAURA_Analytics && typeof window.LAURA_Analytics.trackEvent === 'function') {
      window.LAURA_Analytics.trackEvent(eventName, parameters);
    }
    
    if (getConfig('dev.enableConsoleMessages')) {
      console.log(`📊 Event tracked: ${eventName}`, parameters);
    }
  },

  /**
   * Track performance metrics
   */
  trackPerformanceMetrics() {
    // Send performance data after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = this.state.performanceMetrics;
        
        if (Object.keys(metrics).length > 0) {
          this.trackEvent('performance_metrics', {
            ...metrics,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
          });
        }
      }, 2000);
    });
  },

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search (if implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('#blog-search-input, .search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to close modals/menus
      if (e.key === 'Escape') {
        // Close mobile menu
        if (this.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
        
        // Close service plans
        const servicePlans = document.getElementById('service-plans-container');
        if (servicePlans && !servicePlans.classList.contains('hidden')) {
          servicePlans.classList.add('hidden');
        }
      }
    });
  },

  /**
   * Check if mobile device
   */
  isMobile() {
    return window.innerWidth < 768;
  },

  /**
   * Destroy application
   */
  destroy() {
    // Cleanup modules
    this.state.modules.forEach(moduleName => {
      const module = window[moduleName];
      if (module && typeof module.destroy === 'function') {
        module.destroy();
      }
    });

    // Reset state
    this.state.isInitialized = false;
    this.state.modules = [];
    
    if (getConfig('dev.enableConsoleMessages')) {
      console.log('🧹 LAURA App destroyed');
    }
  }
};

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.LAURA_App.init();
  });
} else {
  window.LAURA_App.init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - pause non-essential operations
  } else {
    // Page is visible - resume operations
  }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  // Cleanup if necessary
});