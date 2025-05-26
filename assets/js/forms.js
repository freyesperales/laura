/**
 * LAURA DIGITAL AGENCY - Forms Module
 * Handles form validation, submission, and user interactions
 * Version: 1.0.0 - FIXED
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
      
      // Restore button
      submitBtn.innerHTML = originalContent;
      
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
    // --- INICIO DE LA MODIFICACIÓN ---
    try {
      const response = await fetch('./php/enviar_contacto.php', { // O la ruta correcta a tu script PHP
        method: 'POST',
        body: JSON.stringify(formData), // Enviamos los datos como JSON
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Si el servidor responde con un error (status no es 2xx)
        let errorMessage = 'Error del servidor. Intenta más tarde.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // No se pudo parsear el JSON de error, usar mensaje genérico
        }
        console.error('Server error:', response.status, response.statusText);
        return { success: false, message: errorMessage };
      }

      const result = await response.json();
      return result; // El script PHP debería devolver { success: true/false, message: "..." }

    } catch (error) {
      console.error('Error en la petición fetch:', error);
      return { success: false, message: 'Error de conexión. Por favor, revisa tu red e intenta nuevamente.' };
    }
    // --- FIN DE LA MODIFICACIÓN ---
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

      this.showSuccessMessage(form, '¡Gracias! Te has suscrito exitosamente.');
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
        .contact-form .form-group:nth-child(5),
        .contact-form .form-group:nth-child(6),
        .contact-form .form-group:nth-child(7) {
          grid-column: 1 / -1;
        }
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
      }
      
      .form-group-half {
        display: flex;
        flex-direction: column;
      }
      
      .field-error {
        color: var(--error, #ef4444);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      
      .form-input.error,
      .form-textarea.error,
      .form-select.error {
        border-color: var(--error, #ef4444);
      }
      
      .form-success {
        background-color: #f0fdf4;
        border: 1px solid #10b981;
        color: #065f46;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        grid-column: 1 / -1;
      }
      
      .form-error {
        background-color: #fef2f2;
        border: 1px solid #ef4444;
        color: #991b1b;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        grid-column: 1 / -1;
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
