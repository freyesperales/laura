class CacheBuster {
    static getVersion() {
        // Genera versión basada en timestamp del build
        return Math.floor(Date.now() / (1000 * 60 * 30)); // 30 min intervals
    }
    
    static appendVersion(url) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${this.getVersion()}`;
    }
    
    static updateLinks() {
        // Auto-update CSS/JS links
        document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(el => {
            const attr = el.tagName === 'LINK' ? 'href' : 'src';
            if (el[attr] && el[attr].includes('/assets/')) {
                el[attr] = this.appendVersion(el[attr]);
            }
        });
    }
}

// Auto-ejecutar
CacheBuster.updateLinks();