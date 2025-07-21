/**
 * LAURA Blog System - Updated with PHP Backend Integration
 * Version: 2.0 - Production Ready
 */

class LAURABlogSystem {
    constructor() {
        this.posts = [];
        this.categories = new Set();
        this.currentCategory = 'all';
        this.currentPost = null;
        this.apiUrl = '/api/blog.php'; // Backend PHP API
        this.cache = new Map(); // Simple caching system
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
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
        
        // Search functionality (if search box exists)
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
            
            // Close mobile menu when clicking on links
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('mobile-open');
                    document.body.classList.remove('nav-open');
                });
            });
            
            // Close mobile menu when clicking outside
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
        const urlParams = new URLSearchParams(window.location.search);
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
        
        // Check URL parameters
        const categoryParam = urlParams.get('category');
        const postParam = urlParams.get('post');
        
        if (categoryParam && postParam) {
            this.showPost(categoryParam, postParam);
        } else if (categoryParam) {
            this.currentCategory = categoryParam;
            this.showIndex();
        } else {
            this.currentCategory = 'all';
            this.showIndex();
        }
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
            const response = await fetch(`${this.apiUrl}?action=structure`, {
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
            
        } catch (error) {
            console.error('Error loading blog structure:', error);
            this.showError('Error al cargar los artículos del blog. ' + error.message);
        }
    }
    
    processBlogStructure(structure) {
        this.posts = [];
        this.categories = new Set(['all']);
        
        Object.entries(structure).forEach(([category, posts]) => {
            this.categories.add(category);
            
            if (Array.isArray(posts)) {
                // Direct posts array
                posts.forEach(post => {
                    this.posts.push({
                        ...post,
                        category: category,
                        categoryLabel: this.getCategoryLabel(category)
                    });
                });
            } else {
                // Nested structure
                Object.entries(posts).forEach(([subcategory, subposts]) => {
                    if (Array.isArray(subposts)) {
                        subposts.forEach(post => {
                            this.posts.push({
                                ...post,
                                category: `${category}/${subcategory}`,
                                categoryLabel: this.getCategoryLabel(subcategory)
                            });
                        });
                    }
                });
            }
        });
        
        // Sort posts by date (newest first) and featured posts first
        this.posts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.date) - new Date(a.date);
        });
        
        console.log(`Loaded ${this.posts.length} posts in ${this.categories.size} categories`);
    }
    
    getCategoryLabel(category) {
        const labels = {
            'marketing-digital': 'Marketing Digital',
            'desarrollo-web': 'Desarrollo Web',
            'ciberseguridad': 'Ciberseguridad',
            'inteligencia-artificial': 'Inteligencia Artificial',
            'tendencias': 'Tendencias',
            'general': 'General',
            'noticias': 'Noticias'
        };
        
        // Handle nested categories
        const parts = category.split('/');
        const mainCategory = parts[parts.length - 1];
        
        return labels[mainCategory] || mainCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
        
        // Get unique base categories (without nested paths)
        const baseCategories = new Set();
        Array.from(this.categories).filter(cat => cat !== 'all').forEach(category => {
            const baseCat = category.split('/')[0];
            baseCategories.add(baseCat);
        });
        
        baseCategories.forEach(category => {
            filtersHTML += `<button class="filter-btn" data-category="${category}">${this.getCategoryLabel(category)}</button>`;
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
            : this.posts.filter(post => {
                const baseCat = post.category.split('/')[0];
                return baseCat === this.currentCategory || post.category === this.currentCategory;
            });
        
        let gridHTML = '';
        
        if (filteredPosts.length === 0) {
            gridHTML = `
                <div class="blog-empty" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No hay artículos en esta categoría</h3>
                    <p style="color: var(--text-secondary);">Prueba con otra categoría o vuelve más tarde.</p>
                </div>
            `;
        } else {
            filteredPosts.forEach(post => {
                const featuredClass = post.featured ? 'blog-card-featured' : '';
                gridHTML += `
                    <article class="blog-card ${featuredClass}" data-category="${post.category}" data-slug="${post.slug}">
                        ${post.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Destacado</div>' : ''}
                        <div class="blog-card-image">
                            <img src="${post.image}" alt="${post.title}" loading="lazy" 
                                 onerror="this.src='https://via.placeholder.com/400x200/e21e5c/ffffff?text=LAURA+Blog'">
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
                            ${post.author !== 'LAURA Digital Agency' ? `
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
        
        // Animate cards in
        this.animateCardsIn();
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
        
        // Re-render grid with animation
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
            
            // Check cache first
            const cacheKey = `post_${category}_${slug}`;
            const cached = this.getFromCache(cacheKey);
            
            let postContent = cached;
            
            if (!postContent) {
                // Load post content from API
                const response = await fetch(`${this.apiUrl}?action=post&category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.error || 'Post not found');
                }
                
                postContent = result.content;
                
                // Cache the content
                this.setCache(cacheKey, postContent);
            }
            
            // Find post metadata
            const post = this.posts.find(p => p.category === category && p.slug === slug) ||
                        this.posts.find(p => p.slug === slug); // Fallback to slug only
            
            if (!post) {
                throw new Error('Post metadata not found');
            }
            
            this.renderSinglePost(post, postContent);
            
            // Update URL
            history.pushState(null, '', `/blog#${category}/${slug}`);
            
            // Update page meta
            this.updatePageMeta(post);
            
            // Track post view
            this.trackEvent('blog_post_view', { 
                category: category, 
                slug: slug, 
                title: post.title 
            });
            
        } catch (error) {
            console.error('Error loading post:', error);
            this.showError('Error al cargar el artículo: ' + error.message);
        }
    }
    
    renderSinglePost(post, content) {
        const singleContainer = document.getElementById('blog-single');
        if (!singleContainer) return;
        
        // Clean content (remove HTML, head, body tags if present)
        const cleanContent = this.cleanPostContent(content);
        
        singleContainer.innerHTML = `
            <div class="blog-single-header">
                ${post.featured ? '<div class="featured-badge-single"><i class="fas fa-star"></i> Artículo Destacado</div>' : ''}
                <div class="blog-single-category">${post.categoryLabel}</div>
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
                    ${post.author !== 'LAURA Digital Agency' ? `
                        <div class="blog-single-author">
                            <i class="fas fa-user"></i>
                            <span>Por ${post.author}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="blog-single-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy"
                     onerror="this.style.display='none'">
            </div>
            
            <div class="blog-single-content">
                ${cleanContent}
            </div>
            
            <div class="blog-single-footer">
                ${post.tags && post.tags.length > 0 ? `
                    <div class="blog-tags">
                        <span class="tags-label">Etiquetas:</span>
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="blog-share">
                    <span class="share-label">Compartir:</span>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" target="_blank" class="share-btn linkedin">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                </div>
            </div>
            
            <div class="blog-navigation">
                <a href="#" class="blog-back-btn">
                    <i class="fas fa-arrow-left"></i>
                    Volver al Blog
                </a>
            </div>
        `;
        
        this.showSingle();
        
        // Setup copy-to-clipboard for code blocks
        this.setupCodeBlocks();
    }
    
    cleanPostContent(content) {
        // Remove DOCTYPE, html, head, body tags if present
        content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
        content = content.replace(/<html[^>]*>/gi, '');
        content = content.replace(/<\/html>/gi, '');
        content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
        content = content.replace(/<body[^>]*>/gi, '');
        content = content.replace(/<\/body>/gi, '');
        
        // Remove HTML comments (but keep blog metadata comments)
        content = content.replace(/<!--(?![\s\S]*BLOG_META)[\s\S]*?-->/g, '');
        
        return content.trim();
    }
    
    setupCodeBlocks() {
        // Add copy buttons to code blocks
        document.querySelectorAll('pre code').forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.innerHTML = '<i class="fas fa-copy"></i>';
            button.title = 'Copiar código';
            
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
            
            const pre = block.parentElement;
            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }
    
    updatePageMeta(post) {
        // Update page title
        document.title = `${post.title} - Blog LAURA Digital Agency`;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', post.excerpt);
        }
        
        // Update Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', post.title);
        }
        
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', post.excerpt);
        }
        
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute('content', post.image);
        }
        
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute('content', window.location.href);
        }
    }
    
    showIndex() {
        document.getElementById('blog-index').classList.remove('hidden');
        document.getElementById('blog-single').classList.add('hidden');
        
        // Reset page title and meta
        document.title = 'Blog - LAURA Digital Agency | Insights sobre Marketing Digital y Tecnología';
        
        // Reset meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Descubre las últimas tendencias en marketing digital, desarrollo web y ciberseguridad. Artículos expertos de LAURA Digital Agency.');
        }
        
        // Update URL if needed
        if (window.location.hash) {
            const url = this.currentCategory === 'all' ? '/blog' : `/blog#${this.currentCategory}`;
            history.pushState(null, '', url);
        }
    }
    
    showSingle() {
        document.getElementById('blog-index').classList.add('hidden');
        document.getElementById('blog-single').classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    showLoading() {
        document.getElementById('blog-loading').classList.remove('hidden');
        document.getElementById('blog-filters').classList.add('hidden');
        document.getElementById('blog-grid').classList.add('hidden');
    }
    
    hideLoading() {
        document.getElementById('blog-loading').classList.add('hidden');
    }
    
    showError(message) {
        const container = document.getElementById('blog-grid');
        if (!container) return;
        
        container.innerHTML = `
            <div class="blog-error" style="text-align: center; padding: 3rem; color: var(--error); grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${message}</p>
                <p>Por favor, intenta nuevamente más tarde.</p>
                <button onclick="location.reload()" class="btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-refresh"></i>
                    Intentar Nuevamente
                </button>
            </div>
        `;
        container.classList.remove('hidden');
        this.hideLoading();
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.currentCategory = 'all';
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
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No se encontraron resultados</h3>
                    <p style="color: var(--text-secondary);">Intenta con otros términos de búsqueda.</p>
                </div>
            `;
        } else {
            results.forEach(post => {
                gridHTML += `
                    <article class="blog-card" data-category="${post.category}" data-slug="${post.slug}">
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
    }
    
    highlightSearchTerm(text, term) {
        if (!term.trim()) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                ...data,
                event_category: 'blog',
                event_label: data.category || data.slug || data.query
            });
        }
        
        // Custom analytics
        if (window.LAURA_Analytics && typeof window.LAURA_Analytics.track === 'function') {
            window.LAURA_Analytics.track(event, {
                ...data,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
        }
        
        console.log(`📊 Blog event tracked: ${event}`, data);
    }
}

// Initialize blog system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new LAURABlogSystem();
        console.log('✅ LAURA Blog System initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing LAURA Blog System:', error);
    }
});