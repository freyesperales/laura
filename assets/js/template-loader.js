/**
 * LAURA Template Loader - Unifica diseños sin PHP
 */
class TemplateLoader {
    
    static init() {
        // Solo aplicar en páginas que lo necesiten
        if (this.needsTemplateLoad()) {
            this.loadCommonElements();
            this.syncActiveNav();
        }
    }
    
    static needsTemplateLoad() {
        // Detectar si es una página de artículo (sin nav completo)
        const currentPath = window.location.pathname;
        
        // Si está en blog-posts o es una página sin nav completo
        return currentPath.includes('/blog-posts/') || 
               !document.querySelector('nav.navbar') ||
               document.body.classList.contains('blog-article');
    }
    
    static loadCommonElements() {
        this.loadNavbar();
        this.loadFooter();
        this.loadWhatsAppBubble();
    }
    
    static loadNavbar() {
        // Solo cargar si no existe
        if (document.querySelector('nav.navbar')) return;
        
        const navHTML = `
            <nav class="navbar" id="navbar">
                <div class="container">
                    <div class="nav-content">
                        <div class="nav-brand">
                            <a href="/" title="Ir al inicio">
                                <img src="/assets/img/logo.svg" alt="LAURA Logo" class="main-logo-svg">
                            </a>
                        </div>
                        
                        <div class="nav-menu" id="nav-menu">
                            <a href="/index.html" class="nav-link">Inicio</a>
                            <a href="/index.html#servicios" class="nav-link">Servicios</a>
                            <a href="/index.html#nosotros" class="nav-link">¿Qué es LAURA?</a>
                            <a href="/index.html#planes" class="nav-link">Planes</a>
                            <a href="/blog.html" class="nav-link">Blog</a>
                            <a href="/index.html#contacto" class="btn-primary">Comenzar Proyecto</a>
                        </div>
                        
                        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                            <span class="hamburger"></span>
                            <span class="hamburger"></span>
                            <span class="hamburger"></span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        
        // Activar funcionalidad del menú móvil
        this.initMobileMenu();
    }
    
    static loadFooter() {
        // Solo cargar si no existe
        if (document.querySelector('footer')) return;
        
        const footerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <div class="footer-brand">
                                <img src="/assets/img/logo.svg" alt="LAURA Logo" class="footer-logo">
                            </div>
                            <p class="footer-description">
                                <strong>Transformando negocios globalmente</strong> con tecnología e IA.
                            </p>
                        </div>
                        
                        <div class="footer-section">
                            <h4 class="footer-title">Servicios</h4>
                            <ul class="footer-links">
                                <li><a href="/index.html#servicios" class="footer-link">Marketing Digital</a></li>
                                <li><a href="/index.html#servicios" class="footer-link">Desarrollo Web</a></li>
                                <li><a href="/index.html#servicios" class="footer-link">Ciberseguridad</a></li>
                                <li><a href="/index.html#planes" class="footer-link">Planes Mensuales</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4 class="footer-title">Empresa</h4>
                            <ul class="footer-links">
                                <li><a href="/index.html#nosotros" class="footer-link">¿Qué es LAURA?</a></li>
                                <li><a href="/blog.html" class="footer-link">Blog</a></li>
                                <li><a href="/index.html#contacto" class="footer-link">Contacto</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p class="copyright">
                            © 2025 LAURA Digital Agency. Transformando negocios globalmente con tecnología e IA.
                        </p>
                    </div>
                </div>
            </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
    
    static loadWhatsAppBubble() {
        // Solo cargar si no existe
        if (document.querySelector('.whatsapp-bubble')) return;
        
        const whatsappHTML = `
            <div class="whatsapp-bubble">
                <a href="https://wa.me/56999968482?text=¡Hola!%20Visité%20el%20blog%20de%20laura.lat%20y%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios." 
                   target="_blank" 
                   class="whatsapp-btn"
                   title="Chatea con nosotros">
                    <i class="fab fa-whatsapp"></i>
                </a>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', whatsappHTML);
    }
    
    static syncActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (currentPath.includes('/blog')) {
                if (link.href.includes('/blog')) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    static initMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }
}

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    TemplateLoader.init();
});

// Exponer globalmente
window.TemplateLoader = TemplateLoader;