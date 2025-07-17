// Reemplaza TODO el contenido de /assets/js/pricing-whatsapp.js con este código

document.addEventListener('DOMContentLoaded', () => {
  const pricingContainer = document.getElementById('pricing-plans-whatsapp');
  if (pricingContainer) {
    renderPricingPlans(pricingContainer);
  }
});

function renderPricingPlans(container) {
  // Verificamos si LAURA_Config y pricingPlans están disponibles.
  if (typeof LAURA_Config === 'undefined' || !LAURA_Config.pricingPlans) {
    console.error('Error: LAURA_Config.pricingPlans no está definido. Asegúrate de que config.js se cargue antes de este script.');
    container.innerHTML = '<p style="color: red; text-align: center;">Error al cargar los planes. Por favor, revise la configuración.</p>';
    return;
  }

  const plans = LAURA_Config.pricingPlans;
  
  container.innerHTML = plans.map(plan => `
    <div class="col-lg-4 col-md-6">
      <div class="pricing-card-whatsapp ${plan.popular ? 'popular' : ''}">
        ${plan.popular ? '<div class="popular-badge">MÁS POPULAR</div>' : ''}
        <h3 class="plan-name">${plan.name}</h3>
        <p class="plan-subtitle">${plan.subtitle}</p>
        <div class="plan-price">${plan.price}</div>
        <ul class="plan-features">
          ${plan.features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
        </ul>
        <a href="${generateWhatsAppLink(plan.whatsappMessage)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp ${plan.ctaType === 'primary' ? 'primary-btn-new' : 'secondary-btn-new'}">
          ${plan.cta}
        </a>
      </div>
    </div>
  `).join('');
}

function generateWhatsAppLink(message) {
  // Verificamos si LAURA_Config y el número de teléfono están disponibles.
  if (typeof LAURA_Config === 'undefined' || !LAURA_Config.contact || !LAURA_Config.contact.phone) {
    console.error('Error: El número de teléfono no está definido en LAURA_Config.contact.phone.');
    return '#';
  }
  const phone = LAURA_Config.contact.phone;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}