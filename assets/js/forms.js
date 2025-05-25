/**
 * LAURA DIGITAL AGENCY - Forms Module
 * Handles form validation, submission, and user interactions
 * Version: 1.0.0
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
      this.setupContactForm();
      this.setupFormValidation();
      this.setupFormInteractions();
      this.setupNewsletterForms();
      
      this.state.isInitialized = true;
      
      if (getConfig('dev.enableConsoleMessages')) {
        console.log('✅ Forms module initialized successfully');
      }
    } catch (error) {
      console.error('❌ Error initializing forms:', error);
    }
  },

  /**
   * Setup main contact form
   */
  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Store form reference
    this.state.forms.set('contact', form);

    // Setup form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactFormSubmission(form);
    });

    // Setup real-time validation
    this.setupRealTimeValidation(form);

    // Setup form grid layout
    this.setupFormGrid(form);
  },

  /**
   * Handle contact form submission
   */
  async handleContactFormSubmission(form) {
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
      const removeLoading = window.LAURA_Animations.addLoadingAnimation(submitBtn, 'Enviando...');
      
      // Disable form
      this.setFormDisabled(form, true);

      // Submit form (simulate API call)
      const result = await this.submitContactForm(formData);
      
      if (result.success) {
        this.showSuccessMessage(form);
        this.resetForm(form);
        
        // Track conversion (if analytics available)
        this.trackFormSubmission('contact', formData);
      } else {
        this.showErrorMessage(form, result.message || 'Error al enviar el formulario');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(form, 'Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      // Re-enable form
      this.setFormDisabled(form, false);
    }
  },

  /**
   * Submit contact form data (replace with actual API call)
   */
  async submitContactForm(formData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful submission
        resolve({ success: true, message: 'Formulario enviado correctamente' });
        
        // For development, log the form data
        if (getConfig('dev.enableConsoleMessages')) {
          console.log('📧 Form submitted:', formData);
        }
      }, 2000);
    });
  },

  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Email validation
    this.state.validators.set('email', {
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Por favor, introduce un email válido'
    });

    // Phone validation
    this.state.validators.set('phone', {
      validate: (value) => {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
        return phoneRegex.test(value);
      },
      message: 'Por favor, introduce un teléfono válido'
    });

    // Required field validation
    this.state.validators.set('required', {
      validate: (value) => {
        return value && value.trim().length > 0;
      },
      message: 'Este campo es obligatorio'
    });

    // Minimum length validation
    this.state.validators.set('minLength', {
      validate: (value, minLength) => {
        return value && value.trim().length >= minLength;
      },
      message: (minLength) => `Mínimo ${minLength} caracteres`
    });
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

    // Uppercase company names
    document.querySelectorAll('input[name="company"]').forEach(input => {
      input.addEventListener('blur', (e) => {
        e.target.value = this.capitalizeWords(e.target.value);
      });
    });
  },

  /**
   * Setup form grid layout
   */
  setupFormGrid(form) {
    // Add CSS for form grid
    if (!document.getElementById('form-grid-styles')) {
      const styles = document.createElement('style');
      styles.id = 'form-grid-styles';
      styles.textContent = `
        .contact-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }
        
        @media (min-width: 768px) {
          .contact-form {
            grid-template-columns: 1fr 1fr;
          }
          
          .form-group:nth-child(3),
          .form-group:nth-child(4),
          .form-group:nth-child(5),
          .form-group:nth-child(6),
          .form-group:nth-child(7) {
            grid-column: 1 / -1;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .field-error {
          color: var(--error);
          font-size: var(--text-sm);
          margin-top: var(--space-1);
        }
        
        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: var(--error);
        }
        
        .form-success {
          background-color: #f0fdf4;
          border: 1px solid #10b981;
          color: #065f46;
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        
        .form-error {
          background-color: #fef2f2;
          border: 1px solid #ef4444;
          color: #991b1b;
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
      `;
      document.head.appendChild(styles);
    }
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
      const removeLoading = window.LAURA_Animations.addLoadingAnimation(submitBtn, 'Suscribiendo...');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.showSuccessMessage(form, '¡Gracias! Te has suscrito exitosamente.');
      form.reset();

      // Track subscription
      this.trackFormSubmission('newsletter', { email });

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
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
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
    
    if (value.startsWith('34')) {
      // Spanish format
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
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
    }
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