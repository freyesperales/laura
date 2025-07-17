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
      // Setup validators first
      this.setupValidators();
      
      // Wait a bit for DOM to be fully ready
      setTimeout(() => {
        this.setupContactForm();
        this.setupFormValidation();
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

    return { isValid, errors };
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
      this.trackFormSubmission('newsletter', { email });

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
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
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