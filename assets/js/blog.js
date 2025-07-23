/**
 * LAURA Blog System - Complete Fixed Version
 * Reads HTML files from folders, not JSON
 * Version: 2.1 - Production Ready
 */

class LAURABlogSystem {
    constructor() {
        this.posts = [];
        this.categories = new Set();
        this.currentCategory = 'all';
        this.currentPost = null;
        this.apiUrl = './api/blog.php';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        // Pagination
        this.currentPage = 1;
        this.postsPerPage = 9;
        this.totalPages = 1;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.parseURL();
        this.loadBlogStructure();
        this.setupNavigation();
    }
    
    setupEventListeners() {
        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleCategoryFilter(e.target);
            }
        });
        
        // Blog card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.blog-card')) {
                e.preventDefault();
                const card = e.target.closest('.blog-card');
                const category = card.dataset.category;
                const slug = card.dataset.slug;
                this.showPost(category, slug);
            }
        });
        
        // Back button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-back-btn') || e.target.closest('.blog-back-btn')) {
                e.preventDefault();
                this.showIndex();
            }
        });
        
        // Browser back/forward
        window.addEventListener('popstate', (e) => {
            this.parseURL();
        });
        
        // Search functionality
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.debounce(this.handleSearch.bind(this), 300)(e.target.value);
            });
        }
    }
    
    setupNavigation() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('mobile-open');
                document.body.classList.toggle('nav-open');
            });
            
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('mobile-open');
                    document.body.classList.remove('nav-open');
                });
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('mobile-open');
                    document.body.classList.remove('nav-open');
                }
            });
        }
        
        // Navbar scroll effect
        let ticking = false;
        const navbar = document.getElementById('navbar');
        
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
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    parseURL() {
        const hash = window.location.hash.substring(1);
        
        if (hash) {
            const [category, post] = hash.split('/');
            if (category && post) {
                this.currentPost = { category, slug: post };
                this.showPost(category, post);
                return;
            } else if (category && category !== 'all') {
                this.currentCategory = category;
                this.showIndex();
                return;
            }
        }
        
        this.currentCategory = 'all';
        this.showIndex();
    }
    
    async loadBlogStructure() {
        try {
            this.showLoading();
            
            // Check cache first
            const cacheKey = 'blog_structure';
            const cached = this.getFromCache(cacheKey);
            
            if (cached) {
                this.processBlogStructure(cached);
                this.renderBlogIndex();
                return;
            }
            
            // Fetch from API
            const response = await fetch(`${this.apiUrl}?action=structure&_t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to load blog structure');
            }
            
            // Cache the result
            this.setCache(cacheKey, result.data);
            
            this.processBlogStructure(result.data);
            this.renderBlogIndex();
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading blog structure:', error);
            this.showError('Error al cargar los artículos del blog. ' + error.message);
        }
    }
    
    processBlogStructure(structure) {
        this.posts = [];
        this.categories = new Set(['all']);
        
        // Process structure recursively
        this.extractPostsFromStructure(structure, '');
        
        // Sort posts by date (newest first) and featured posts first
        this.posts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.date) - new Date(a.date);
        });
        
        console.log(`Loaded ${this.posts.length} posts in ${this.categories.size - 1} categories`);
    }
    
    extractPostsFromStructure(structure, basePath) {
        Object.entries(structure).forEach(([key, value]) => {
            const currentPath = basePath ? `${basePath}/${key}` : key;
            
            if (Array.isArray(value)) {
                // Array of posts
                value.forEach(post => {
                    if (this.isValidPost(post)) {
                        this.posts.push(this.formatPost(post, currentPath));
                    }
                });
            } else if (value && typeof value === 'object') {
                if (value.posts && Array.isArray(value.posts)) {
                    // Direct posts in structure
                    value.posts.forEach(post => {
                        if (this.isValidPost(post)) {
                            this.posts.push(this.formatPost(post, currentPath));
                        }
                    });
                } else {
                    // Continue recursion
                    this.extractPostsFromStructure(value, currentPath);
                }
            }
        });
    }
    
    isValidPost(post) {
        return post && 
               typeof post === 'object' && 
               post.slug && 
               post.title &&
               post.slug.trim().length > 0 &&
               post.title.trim().length > 0;
    }
    
    formatPost(post, categoryPath) {
        // Add category to set
        const baseCategory = categoryPath.split('/')[0];
        this.categories.add(baseCategory);
        
        return {
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || `Descubre más sobre ${post.title.toLowerCase()} en nuestro artículo completo.`,
            date: post.date || new Date().toISOString(),
            readTime: post.readTime || '5 min',
            image: post.image || '/assets/img/blog-default.webp',
            category: baseCategory,
            categoryPath: categoryPath,
            categoryLabel: this.getCategoryLabel(baseCategory),
            author: post.author || 'LAURA Team',
            tags: post.tags || [],
            featured: post.featured || false
        };
    }
    
    getCategoryLabel(category) {
        const labels = {
            'marketing-digital': 'Marketing Digital',
            'desarrollo-web': 'Desarrollo Web',
            'ciberseguridad': 'Ciberseguridad',
            'inteligencia-artificial': 'Inteligencia Artificial',
            'ia': 'Inteligencia Artificial',
            'tendencias': 'Tendencias',
            'general': 'General',
            'noticias': 'Noticias',
            'seo': 'SEO',
            'ecommerce': 'E-commerce'
        };
        
        return labels[category] || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    renderBlogIndex() {
        this.renderCategoryFilters();
        this.renderBlogGrid();
        this.hideLoading();
    }
    
    renderCategoryFilters() {
        const filtersContainer = document.getElementById('blog-filters');
        if (!filtersContainer) return;
        
        let filtersHTML = '<button class="filter-btn active" data-category="all">Todos los Artículos</button>';
        
        // Get unique categories
        const uniqueCategories = Array.from(this.categories).filter(cat => cat !== 'all').sort();
        
        uniqueCategories.forEach(category => {
            const count = this.posts.filter(p => p.category === category).length;
            filtersHTML += `<button class="filter-btn" data-category="${category}">${this.getCategoryLabel(category)} (${count})</button>`;
        });
        
        filtersContainer.innerHTML = filtersHTML;
        filtersContainer.classList.remove('hidden');
        
        // Update active filter
        this.updateActiveFilter();
    }
    
    updateActiveFilter() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
        });
    }
    
    renderBlogGrid() {
        const gridContainer = document.getElementById('blog-grid');
        if (!gridContainer) return;
        
        const filteredPosts = this.currentCategory === 'all' 
            ? this.posts 
            : this.posts.filter(post => post.category === this.currentCategory);
        
        // Calculate pagination
        this.totalPages = Math.ceil(filteredPosts.length / this.postsPerPage);
        this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
        
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);
        
        let gridHTML = '';
        
        if (postsToShow.length === 0) {
            gridHTML = `
                <div class="blog-empty" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--dark-text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--dark-text-primary); margin-bottom: 0.5rem;">No hay artículos en esta categoría</h3>
                    <p style="color: var(--dark-text-secondary);">Prueba con otra categoría o vuelve más tarde.</p>
                </div>
            `;
        } else {
            postsToShow.forEach(post => {
                const featuredClass = post.featured ? 'blog-card-featured' : '';
                gridHTML += `
                    <article class="blog-card ${featuredClass}" data-category="${post.categoryPath}" data-slug="${post.slug}">
                        ${post.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Destacado</div>' : ''}
                        <div class="blog-card-image">
                            <img src="${post.image}" alt="${post.title}" loading="lazy" 
                                 onerror="this.src='/assets/img/blog-default.webp'">
                            <div class="blog-card-category">${post.categoryLabel}</div>
                        </div>
                        <div class="blog-card-content">
                            <h2 class="blog-card-title">${post.title}</h2>
                            <p class="blog-card-excerpt">${post.excerpt}</p>
                            <div class="blog-card-meta">
                                <div class="blog-card-date">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>${this.formatDate(post.date)}</span>
                                </div>
                                <div class="blog-card-read-time">
                                    <i class="fas fa-clock"></i>
                                    <span>${post.readTime}</span>
                                </div>
                            </div>
                            ${post.author !== 'LAURA Team' ? `
                                <div class="blog-card-author">
                                    <i class="fas fa-user"></i>
                                    <span>${post.author}</span>
                                </div>
                            ` : ''}
                        </div>
                    </article>
                `;
            });
        }
        
        gridContainer.innerHTML = gridHTML;
        gridContainer.classList.remove('hidden');
        
        // Render pagination
        this.renderPagination();
        
        // Animate cards in
        this.animateCardsIn();
    }
    
    renderPagination() {
        const paginationContainer = document.getElementById('blog-pagination');
        if (!paginationContainer || this.totalPages <= 1) {
            if (paginationContainer) paginationContainer.classList.add('hidden');
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="window.blogSystem.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>`;
        }
        
        // Page numbers
        const maxVisible = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        if (start > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="window.blogSystem.goToPage(1)">1</button>`;
            if (start > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }
        
        for (let i = start; i <= end; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="window.blogSystem.goToPage(${i})">${i}</button>`;
        }
        
        if (end < this.totalPages) {
            if (end < this.totalPages - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="window.blogSystem.goToPage(${this.totalPages})">${this.totalPages}</button>`;
        }
        
        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="window.blogSystem.goToPage(${this.currentPage + 1})">
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
        paginationContainer.classList.remove('hidden');
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.renderBlogGrid();
        
        // Scroll to top
        const heroSection = document.querySelector('.blog-hero');
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    updateStats() {
        const totalPostsEl = document.getElementById('total-posts');
        const totalCategoriesEl = document.getElementById('total-categories');
        
        if (totalPostsEl) {
            totalPostsEl.textContent = this.posts.length;
        }
        
        if (totalCategoriesEl) {
            totalCategoriesEl.textContent = this.categories.size - 1; // -1 because 'all' doesn't count
        }
    }
    
    animateCardsIn() {
        const cards = document.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    handleCategoryFilter(button) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current category
        this.currentCategory = button.dataset.category;
        
        // Reset to first page
        this.currentPage = 1;
        
        // Re-render grid
        this.renderBlogGrid();
        
        // Update URL
        const url = this.currentCategory === 'all' ? '/blog' : `/blog#${this.currentCategory}`;
        history.pushState(null, '', url);
        
        // Track category filter usage
        this.trackEvent('blog_filter', { category: this.currentCategory });
    }
    
    async showPost(category, slug) {
        try {
            this.showLoading();
            
            // Find post metadata
            const post = this.posts.find(p => 
                (p.categoryPath === category || p.category === category) && p.slug === slug
            ) || this.posts.find(p => p.slug === slug);
            
            if (!post) {
                throw new Error('Post no encontrado');
            }
            
            // Load post content
            const postContent = await this.loadPostContent(post.categoryPath || post.category, slug);
            
            this.renderSinglePost(post, postContent);
            
            // Update URL
            history.pushState(null, '', `/blog#${post.categoryPath || post.category}/${slug}`);
            
            // Update page meta
            this.updatePageMeta(post);
            
            // Track post view
            this.trackEvent('blog_post_view', { 
                category: post.category, 
                slug: slug, 
                title: post.title 
            });
            
        } catch (error) {
            console.error('Error loading post:', error);
            this.showError('Error al cargar el artículo: ' + error.message);
        }
    }
    
        async loadPostContent(category, slug) {
            const postUrl = `./api/blog-posts/${category}/${slug}.html`;
        
        try {
            const response = await fetch(postUrl);
            if (response.ok) {
                const htmlContent = await response.text();
                return this.cleanPostContent(htmlContent);
            }
        } catch (error) {
            console.warn(`Could not load ${postUrl}:`, error);
        }
        
        // Fallback: try API
        try {
            const response = await fetch(`${this.apiUrl}?action=post&category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.content;
                }
            }
        } catch (error) {
            console.warn('API fallback failed:', error);
        }
        
        // Final fallback: placeholder content
        return this.getPlaceholderContent(category, slug);
    }
    
    getPlaceholderContent(category, slug) {
        const post = this.posts.find(p => p.slug === slug);
        const title = post ? post.title : slug.replace(/-/g, ' ');
        
        return `
            <h2>Introducción</h2>
            <p>Este es el contenido del artículo "<strong>${title}</strong>". En esta sección encontrarás información detallada sobre el tema.</p>
            
            <h2>¿Por qué es importante?</h2>
            <p>En <strong>LAURA Digital Agency</strong>, entendemos que ${category.replace(/-/g, ' ')} es fundamental para el éxito de tu negocio digital.</p>
            
            <blockquote>
                <p>"La transformación digital no es solo tecnología, es un cambio de mentalidad que permite a las empresas adaptarse y crecer en el mundo moderno."</p>
            </blockquote>
            
            <h2>Próximos pasos</h2>
            <p>Si quieres implementar estas estrategias en tu negocio, nuestro equipo está listo para ayudarte. Contáctanos para una consulta personalizada.</p>
            
            <div style="background: var(--dark-bg-card); border: 1px solid var(--color-accent); padding: 2rem; border-radius: 12px; text-align: center; margin: 2rem 0;">
                <h3 style="color: var(--color-accent); margin-bottom: 1rem;">¿Listo para transformar tu negocio?</h3>
                <p style="margin-bottom: 1.5rem;">Hablemos sobre cómo podemos ayudarte a alcanzar tus objetivos digitales.</p>
                <a href="../index.html#contacto" class="btn-primary">
                    Comenzar mi proyecto
                </a>
            </div>
        `;
    }
    
    cleanPostContent(content) {
        // Remove DOCTYPE, html, head, body tags if present
        content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
        content = content.replace(/<html[^>]*>/gi, '');
        content = content.replace(/<\/html>/gi, '');
        content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
        content = content.replace(/<body[^>]*>/gi, '');
        content = content.replace(/<\/body>/gi, '');
        
        // Remove comments but keep metadata
        content = content.replace(/<!--(?![\s\S]*BLOG_META)[\s\S]*?-->/g, '');
        
        return content.trim();
    }
    
    renderSinglePost(post, content) {
        const singleContainer = document.getElementById('blog-single');
        if (!singleContainer) return;
        
        singleContainer.innerHTML = `
            <div class="blog-single-header">
                ${post.featured ? '<div class="featured-badge-single"><i class="fas fa-star"></i> Artículo Destacado</div>' : ''}
                <div class="blog-single-category" style="background: var(--color-accent);">${post.categoryLabel}</div>
                <h1 class="blog-single-title">${post.title}</h1>
                <div class="blog-single-meta">
                    <div class="blog-single-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${this.formatDate(post.date)}</span>
                    </div>
                    <div class="blog-single-read-time">
                        <i class="fas fa-clock"></i>
                        <span>${post.readTime} de lectura</span>
                    </div>
                    <div class="blog-single-author">
                        <i class="fas fa-user"></i>
                        <span>${post.author}</span>
                    </div>
                </div>
            </div>
            
            <div class="blog-single-content">
                ${content}
            </div>
            
            <div class="blog-navigation">
                <a href="#" class="blog-back-btn">
                    <i class="fas fa-arrow-left"></i>
                    Volver al Blog
                </a>
                <a href="../index.html#contacto" class="btn-primary">
                    <i class="fas fa-envelope"></i>
                    Contactar
                </a>
            </div>
        `;
        
        this.showSingle();
    }
    
    updatePageMeta(post) {
        document.title = `${post.title} - Blog LAURA Digital Agency`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', post.excerpt);
        }
    }
    
    showIndex() {
        document.getElementById('blog-index')?.classList.remove('hidden');
        document.getElementById('blog-single')?.classList.add('hidden');
        
        document.title = 'Blog - LAURA Digital Agency';
        
        if (window.location.hash) {
            const url = this.currentCategory === 'all' ? '/blog' : `/blog#${this.currentCategory}`;
            history.pushState(null, '', url);
        }
    }
    
    showSingle() {
        document.getElementById('blog-index')?.classList.add('hidden');
        document.getElementById('blog-single')?.classList.remove('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    showLoading() {
        document.getElementById('blog-loading')?.classList.remove('hidden');
        document.getElementById('blog-filters')?.classList.add('hidden');
        document.getElementById('blog-grid')?.classList.add('hidden');
        document.getElementById('blog-pagination')?.classList.add('hidden');
    }
    
    hideLoading() {
        document.getElementById('blog-loading')?.classList.add('hidden');
    }
    
    showError(message) {
        const errorContainer = document.getElementById('blog-error');
        if (errorContainer) {
            const errorText = errorContainer.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
            errorContainer.classList.remove('hidden');
        }
        
        this.hideLoading();
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.currentCategory = 'all';
            this.currentPage = 1;
            this.renderBlogGrid();
            return;
        }
        
        const searchResults = this.posts.filter(post => {
            const searchText = `${post.title} ${post.excerpt} ${post.tags?.join(' ') || ''}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });
        
        this.renderSearchResults(searchResults, query);
        this.trackEvent('blog_search', { query: query, results: searchResults.length });
    }
    
    renderSearchResults(results, query) {
        const gridContainer = document.getElementById('blog-grid');
        if (!gridContainer) return;
        
        let gridHTML = `
            <div class="search-results-header" style="grid-column: 1 / -1; margin-bottom: 2rem; text-align: center;">
                <h3>Resultados de búsqueda para: "${query}"</h3>
                <p>${results.length} artículo${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}</p>
            </div>
        `;
        
        if (results.length === 0) {
            gridHTML += `
                <div class="blog-empty" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--dark-text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--dark-text-primary);">No se encontraron resultados</h3>
                    <p style="color: var(--dark-text-secondary);">Intenta con otros términos de búsqueda.</p>
                </div>
            `;
        } else {
            results.forEach(post => {
                gridHTML += `
                    <article class="blog-card" data-category="${post.categoryPath}" data-slug="${post.slug}">
                        <div class="blog-card-image">
                            <img src="${post.image}" alt="${post.title}" loading="lazy">
                            <div class="blog-card-category">${post.categoryLabel}</div>
                        </div>
                        <div class="blog-card-content">
                            <h2 class="blog-card-title">${this.highlightSearchTerm(post.title, query)}</h2>
                            <p class="blog-card-excerpt">${this.highlightSearchTerm(post.excerpt, query)}</p>
                            <div class="blog-card-meta">
                                <div class="blog-card-date">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>${this.formatDate(post.date)}</span>
                                </div>
                                <div class="blog-card-read-time">
                                    <i class="fas fa-clock"></i>
                                    <span>${post.readTime}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                `;
            });
        }
        
        gridContainer.innerHTML = gridHTML;
        
        // Hide pagination during search
        const paginationContainer = document.getElementById('blog-pagination');
        if (paginationContainer) {
            paginationContainer.classList.add('hidden');
        }
    }
    
    highlightSearchTerm(text, term) {
        if (!term.trim()) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Utility methods
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Fecha no disponible';
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    // Analytics tracking
    trackEvent(event, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                ...data,
                event_category: 'blog',
                event_label: data.category || data.slug || data.query
            });
        }
        
        console.log(`📊 Blog event tracked: ${event}`, data);
    }
    
    // Public methods
    refresh() {
        this.cache.clear();
        this.loadBlogStructure();
    }
}

// Initialize blog system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.blogSystem = new LAURABlogSystem();
        console.log('✅ LAURA Blog System initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing LAURA Blog System:', error);
    }
});

// Expose for debugging
window.LAURABlogSystem = LAURABlogSystem;