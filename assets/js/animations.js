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
    window.addEventListener('scroll', throttledScroll, { passive: true });
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
    }, { threshold: 0.5 });

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
    }, { passive: true });
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