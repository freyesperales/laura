/**
 * =============================================================================
 * LAURA DIGITAL AGENCY - BLOG HOME LOADER
 * =============================================================================
 * Archivo: assets/js/blog-home.js
 * Descripción: Carga dinámica de artículos del blog en la página principal
 * Autor: LAURA Digital Agency
 * Versión: 1.0.0
 * =============================================================================
 */

class BlogHomeLoader {
    constructor() {
        // Configuración
        this.apiUrl = '/api/blog.php';
        this.maxPosts = 4; // Número máximo de posts a mostrar
        this.cacheTimeout = 300000; // 5 minutos en milliseconds
        
        // Estados
        this.isLoading = false;
        this.hasLoaded = false;
        this.cache = null;
        this.cacheTimestamp = 0;
        
        // Elementos DOM (se cargarán en init)
        this.elements = {};
        
        this.init();
    }

    /**
     * Inicializa el loader
     */
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLoader());
        } else {
            this.setupLoader();
        }
    }

    /**
     * Configura el loader una vez que el DOM está listo
     */
    setupLoader() {
        // Capturar elementos DOM
        this.cacheElements();
        
        // Verificar si los elementos existen
        if (!this.elements.container) {
            console.warn('BlogHomeLoader: Blog container not found');
            return;
        }

        // Configurar Intersection Observer para lazy loading
        this.setupIntersectionObserver();
        
        // Si la sección ya está visible, cargar inmediatamente
        this.checkInitialVisibility();
    }

    /**
     * Cachea elementos DOM para mejor performance
     */
    cacheElements() {
        this.elements = {
            container: document.getElementById('blog-home-container'),
            loading: document.getElementById('blog-home-loading'),
            grid: document.getElementById('blog-home-grid'),
            empty: document.getElementById('blog-home-empty'),
            error: document.getElementById('blog-home-error'),
            section: document.querySelector('#blog')
        };
    }

    /**
     * Configura Intersection Observer para cargar solo cuando sea visible
     */
    setupIntersectionObserver() {
        if (!this.elements.section || !('IntersectionObserver' in window)) {
            // Fallback: cargar inmediatamente si no hay soporte
            this.loadBlogPosts();
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasLoaded && !this.isLoading) {
                    this.loadBlogPosts();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(this.elements.section);
    }

    /**
     * Verifica si la sección ya está visible al cargar
     */
    checkInitialVisibility() {
        if (!this.elements.section) return;
        
        const rect = this.elements.section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !this.hasLoaded) {
            this.loadBlogPosts();
        }
    }

    /**
     * Verifica si el cache es válido
     */
    isCacheValid() {
        return this.cache && 
               this.cacheTimestamp && 
               (Date.now() - this.cacheTimestamp) < this.cacheTimeout;
    }

    /**
     * Carga los posts del blog desde la API
     */
    async loadBlogPosts() {
        if (this.isLoading) return;
        
        // Verificar cache válido
        if (this.isCacheValid()) {
            this.renderPosts(this.cache);
            this.showState('content');
            this.hasLoaded = true;
            return;
        }

        this.isLoading = true;
        this.showState('loading');

        try {
            const response = await this.fetchBlogData();
            const result = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            if (!result.success) {
                throw new Error(result.error || 'Error al cargar la estructura del blog');
            }

            const posts = this.processBlogStructure(result.data);
            
            if (posts.length === 0) {
                this.showState('empty');
            } else {
                // Actualizar cache
                this.cache = posts;
                this.cacheTimestamp = Date.now();
                
                this.renderPosts(posts);
                this.showState('content');
            }

            this.hasLoaded = true;

        } catch (error) {
            console.error('BlogHomeLoader: Error loading posts:', error);
            this.showState('error');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Realiza la petición a la API
     */
    async fetchBlogData() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout

        try {
            const response = await fetch(`${this.apiUrl}?action=structure&_t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Procesa la estructura del blog recibida de la API
     */
    processBlogStructure(structure) {
        const posts = [];

        try {
            Object.entries(structure).forEach(([category, items]) => {
                const categoryDisplay = this.getCategoryDisplayName(category);
                
                if (Array.isArray(items)) {
                    // Posts directos en la categoría
                    items.forEach(post => {
                        if (this.isValidPost(post)) {
                            posts.push(this.formatPost(post, category, categoryDisplay));
                        }
                    });
                } else if (typeof items === 'object') {
                    // Subcategorías
                    Object.entries(items).forEach(([subCategory, subItems]) => {
                        if (Array.isArray(subItems)) {
                            subItems.forEach(post => {
                                if (this.isValidPost(post)) {
                                    const fullCategory = `${category}/${subCategory}`;
                                    const subCategoryDisplay = this.getCategoryDisplayName(subCategory);
                                    posts.push(this.formatPost(post, fullCategory, subCategoryDisplay));
                                }
                            });
                        }
                    });
                }
            });

            // Ordenar por fecha (más reciente primero)
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Limitar número de posts
            return posts.slice(0, this.maxPosts);

        } catch (error) {
            console.error('BlogHomeLoader: Error processing blog structure:', error);
            return [];
        }
    }

    /**
     * Valida si un post tiene los campos necesarios
     */
    isValidPost(post) {
        return post && 
               typeof post === 'object' && 
               post.slug && 
               post.title;
    }

    /**
     * Formatea un post con todos los campos necesarios
     */
    formatPost(post, category, categoryDisplay) {
        return {
            slug: post.slug,
            title: this.sanitizeText(post.title),
            excerpt: this.sanitizeText(post.excerpt) || this.generateDefaultExcerpt(post.title),
            date: post.date || new Date().toISOString(),
            readTime: post.readTime || '3 min',
            image: post.image || null,
            category: category,
            categoryDisplay: categoryDisplay,
            fullUrl: this.buildPostUrl(category, post.slug)
        };
    }

    /**
     * Construye la URL completa del post
     */
    buildPostUrl(category, slug) {
        return `/blog/${category}/${slug}`;
    }

    /**
     * Genera excerpt por defecto si no existe
     */
    generateDefaultExcerpt(title) {
        return `Descubre más sobre ${title.toLowerCase()} en nuestro artículo completo.`;
    }

    /**
     * Sanitiza texto para prevenir XSS
     */
    sanitizeText(text) {
        if (!text || typeof text !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Obtiene el nombre de display para las categorías
     */
    getCategoryDisplayName(category) {
        const categoryMap = {
            'marketing-digital': 'Marketing Digital',
            'desarrollo-web': 'Desarrollo Web', 
            'ciberseguridad': 'Ciberseguridad',
            'general': 'General',
            'seo': 'SEO',
            'ia': 'Inteligencia Artificial',
            'ecommerce': 'E-commerce',
            'analytics': 'Analytics',
            'social-media': 'Social Media'
        };
        
        return categoryMap[category] || this.capitalizeWords(category.replace(/-/g, ' '));
    }

    /**
     * Capitaliza palabras
     */
    capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Obtiene el icono apropiado para cada categoría
     */
    getCategoryIcon(category) {
        const iconMap = {
            'marketing-digital': 'fas fa-chart-line',
            'desarrollo-web': 'fas fa-code',
            'ciberseguridad': 'fas fa-shield-alt',
            'general': 'fas fa-lightbulb',
            'seo': 'fas fa-search',
            'ia': 'fas fa-robot',
            'ecommerce': 'fas fa-shopping-cart',
            'analytics': 'fas fa-chart-bar',
            'social-media': 'fas fa-share-alt'
        };
        
        // Buscar por categoría exacta o por palabra clave
        const normalizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        return iconMap[category] || 
               iconMap[normalizedCategory] || 
               'fas fa-file-alt';
    }

    /**
     * Obtiene la clase CSS para el color de la categoría
     */
    getCategoryClass(category) {
        const baseCategory = category.split('/')[0]; // Solo la categoría principal
        return `blog-category-${baseCategory.replace(/[^a-z0-9]/gi, '')}`;
    }

    /**
     * Formatea fecha en español
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            
            // Verificar fecha válida
            if (isNaN(date.getTime())) {
                return 'Fecha no disponible';
            }
            
            return date.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });
        } catch (error) {
            console.warn('BlogHomeLoader: Error formatting date:', error);
            return 'Fecha no disponible';
        }
    }

    /**
     * Renderiza los posts en el grid
     */
    renderPosts(posts) {
        if (!this.elements.grid) return;

        try {
            const postsHTML = posts.map(post => this.createPostHTML(post)).join('');
            this.elements.grid.innerHTML = postsHTML;

            // Añadir event listeners después de renderizar
            this.addEventListeners();

        } catch (error) {
            console.error('BlogHomeLoader: Error rendering posts:', error);
            this.showState('error');
        }
    }

    /**
     * Crea el HTML para un post individual
     */
    createPostHTML(post) {
        const categoryIcon = this.getCategoryIcon(post.category);
        const categoryClass = this.getCategoryClass(post.category);
        
        return `
            <article class="blog-home-card" data-category="${post.category}" data-slug="${post.slug}">
                <div class="blog-home-card-image ${categoryClass}">
                    ${post.image ? 
                        `<img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'${categoryIcon}\\'></i>';">` : 
                        `<i class="${categoryIcon}"></i>`
                    }
                    <div class="blog-home-card-category">
                        ${post.categoryDisplay}
                    </div>
                </div>
                <div class="blog-home-card-content">
                    <div class="blog-home-card-meta">
                        <span class="blog-home-card-date">${this.formatDate(post.date)}</span>
                        <span class="blog-home-card-read-time">${post.readTime}</span>
                    </div>
                    <h3 class="blog-home-card-title">${post.title}</h3>
                    <p class="blog-home-card-excerpt">${post.excerpt}</p>
                    <div class="blog-home-card-footer">
                        <a href="${post.fullUrl}" class="blog-home-card-link" data-post-url="${post.fullUrl}">
                            Leer artículo
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Añade event listeners a los elementos
     */
    addEventListeners() {
        // Tracking de clics en artículos
        this.elements.grid.querySelectorAll('.blog-home-card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackPostClick(e.target.dataset.postUrl);
            });
        });

        // Hover effects para mejor UX
        this.elements.grid.querySelectorAll('.blog-home-card').forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });
    }

    /**
     * Maneja el hover de las cards
     */
    handleCardHover(e) {
        e.currentTarget.style.transform = 'translateY(-8px)';
    }

    /**
     * Maneja cuando se sale del hover
     */
    handleCardLeave(e) {
        e.currentTarget.style.transform = 'translateY(0)';
    }

    /**
     * Hace tracking de clics en posts
     */
    trackPostClick(postUrl) {
        try {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'blog_home_click', {
                    'event_category': 'Blog',
                    'event_label': postUrl,
                    'transport_type': 'beacon'
                });
            }

            // Custom analytics si existe
            if (typeof window.customAnalytics !== 'undefined') {
                window.customAnalytics.track('blog_home_click', {
                    url: postUrl,
                    timestamp: Date.now(),
                    section: 'home'
                });
            }

        } catch (error) {
            console.warn('BlogHomeLoader: Error tracking click:', error);
        }
    }

    /**
     * Controla la visibilidad de los diferentes estados
     */
    showState(activeState) {
        const states = ['loading', 'content', 'empty', 'error'];
        
        states.forEach(state => {
            const element = this.elements[state === 'content' ? 'grid' : state];
            if (element) {
                const shouldShow = state === activeState;
                element.classList.toggle('hidden', !shouldShow);
                
                // Mejorar accesibilidad
                element.setAttribute('aria-hidden', !shouldShow);
            }
        });
    }

    /**
     * Método público para refrescar el blog
     */
    refresh() {
        this.cache = null;
        this.cacheTimestamp = 0;
        this.hasLoaded = false;
        this.loadBlogPosts();
    }

    /**
     * Método público para obtener estadísticas
     */
    getStats() {
        return {
            hasLoaded: this.hasLoaded,
            isLoading: this.isLoading,
            cachedPosts: this.cache ? this.cache.length : 0,
            cacheValid: this.isCacheValid()
        };
    }
}

// Auto-inicializar el loader
let blogHomeLoader;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        blogHomeLoader = new BlogHomeLoader();
    });
} else {
    blogHomeLoader = new BlogHomeLoader();
}

// Exponer globalmente para debugging y uso externo
window.BlogHomeLoader = BlogHomeLoader;
window.blogHomeLoader = blogHomeLoader;