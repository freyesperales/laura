/**
 * Auto Cache Buster para LAURA Digital Agency
 * Se ejecuta al cargar cualquier página
 */

class LauraCacheBuster {
    constructor() {
        this.apiUrl = '/api/blog.php';
        this.checkInterval = 30000; // 30 segundos
        this.lastChecksum = localStorage.getItem('laura_blog_checksum') || '';
        
        this.init();
    }
    
    async init() {
        // Verificar cambios al cargar la página
        await this.checkForUpdates();
        
        // Verificar cambios periódicamente (solo en index)
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            setInterval(() => this.checkForUpdates(), this.checkInterval);
        }
    }
    
    async checkForUpdates() {
        try {
            const response = await fetch(`${this.apiUrl}?action=checksum&_t=${Date.now()}`);
            const data = await response.json();
            
            if (data.success && data.checksum) {
                const currentChecksum = data.checksum;
                
                // Si el checksum cambió, limpiar caches
                if (this.lastChecksum && this.lastChecksum !== currentChecksum) {
                    this.clearAllCaches();
                    this.reloadBlogContent();
                }
                
                // Actualizar checksum almacenado
                localStorage.setItem('laura_blog_checksum', currentChecksum);
                this.lastChecksum = currentChecksum;
            }
            
        } catch (error) {
            console.warn('CacheBuster: Error checking updates:', error);
        }
    }
    
    clearAllCaches() {
        // Limpiar localStorage del blog
        const blogKeys = Object.keys(localStorage).filter(key => key.startsWith('laura_blog_'));
        blogKeys.forEach(key => {
            if (key !== 'laura_blog_checksum') {
                localStorage.removeItem(key);
            }
        });
        
        // Limpiar cache del BlogHomeLoader si existe
        if (window.blogHomeLoader) {
            window.blogHomeLoader.cache = null;
            window.blogHomeLoader.cacheTimestamp = 0;
            window.blogHomeLoader.hasLoaded = false;
        }
        
        console.log('✅ Blog caches cleared - content updated');
    }
    
    reloadBlogContent() {
        // Recargar contenido del blog si estamos en index
        if (window.blogHomeLoader && typeof window.blogHomeLoader.refresh === 'function') {
            window.blogHomeLoader.refresh();
        }
    }
}

// Inicializar cache buster
document.addEventListener('DOMContentLoaded', () => {
    new LauraCacheBuster();
});