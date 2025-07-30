<?php
/**
 * LAURA DIGITAL AGENCY - Build & Deploy Script
 * Automatiza optimización, versionado y despliegue
 * Uso: php build.php [action]
 */

class LauraBuildSystem {
    private $projectRoot;
    private $assetsDir;
    private $backupDir;
    private $config;
    
    public function __construct() {
        $this->projectRoot = __DIR__;
        $this->assetsDir = $this->projectRoot . '/assets';
        $this->backupDir = $this->projectRoot . '/backups';
        $this->loadConfig();
        
        if (!is_dir($this->backupDir)) {
            mkdir($this->backupDir, 0755, true);
        }
    }
    
    private function loadConfig() {
        $this->config = [
            'minify_css' => true,
            'minify_js' => true,
            'optimize_images' => false, // Requiere herramientas adicionales
            'generate_sourcemaps' => false,
            'clean_unused_files' => true,
            'backup_before_build' => true
        ];
    }
    
    /**
     * Ejecuta proceso completo de construcción
     */
    public function build() {
        $this->log("🚀 Iniciando proceso de build para LAURA...");
        
        try {
            if ($this->config['backup_before_build']) {
                $this->createBackup();
            }
            
            $this->cleanUnusedFiles();
            $this->optimizeCSS();
            $this->optimizeJS();
            $this->updateVersions();
            $this->optimizeForCloudflare();
            $this->generateManifest();
            
            $this->log("✅ Build completado exitosamente!");
            return true;
            
        } catch (Exception $e) {
            $this->log("❌ Error durante el build: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Optimizaciones específicas para Cloudflare
     */
    private function optimizeForCloudflare() {
        $this->log("🌐 Optimizando para Cloudflare...");
        
        // Generar archivo de configuración para Cloudflare Workers (opcional)
        $workerConfig = [
            'version' => $this->getBuildVersion(),
            'cache_rules' => [
                'assets' => 31536000, // 1 año
                'api' => 0, // Sin caché
                'html' => 3600 // 1 hora
            ],
            'compression' => true,
            'minification' => true
        ];
        
        file_put_contents(
            $this->projectRoot . '/cloudflare-worker-config.json',
            json_encode($workerConfig, JSON_PRETTY_PRINT)
        );
        
        // Crear reglas de Page Rules para Cloudflare
        $this->generateCloudflarePageRules();
        
        $this->log("✅ Optimización Cloudflare completada");
    }
    
    /**
     * Genera reglas sugeridas para Cloudflare Page Rules
     */
    private function generateCloudflarePageRules() {
        $rules = [
            [
                'pattern' => 'laura.lat/assets/*',
                'settings' => [
                    'cache_level' => 'cache_everything',
                    'edge_cache_ttl' => 31536000, // 1 año
                    'browser_cache_ttl' => 31536000
                ],
                'description' => 'Assets estáticos - caché agresivo'
            ],
            [
                'pattern' => 'laura.lat/api/*',
                'settings' => [
                    'cache_level' => 'bypass'
                ],
                'description' => 'APIs dinámicas - sin caché'
            ],
            [
                'pattern' => 'laura.lat/*.html',
                'settings' => [
                    'cache_level' => 'standard',
                    'edge_cache_ttl' => 14400, // 4 horas
                    'browser_cache_ttl' => 3600
                ],
                'description' => 'Páginas HTML - caché intermedio'
            ]
        ];
        
        file_put_contents(
            $this->projectRoot . '/cloudflare-page-rules.json',
            json_encode($rules, JSON_PRETTY_PRINT)
        );
    }
    
    /**
     * Crea backup antes del build
     */
    private function createBackup() {
        $this->log("📦 Creando backup...");
        
        $timestamp = date('Y-m-d_H-i-s');
        $backupPath = $this->backupDir . "/backup_{$timestamp}";
        
        if (!is_dir($backupPath)) {
            mkdir($backupPath, 0755, true);
        }
        
        // Backup de archivos críticos
        $criticalFiles = [
            'index.html',
            'assets/css/main.css',
            'assets/js/',
            'api/',
            '.htaccess'
        ];
        
        foreach ($criticalFiles as $file) {
            $source = $this->projectRoot . '/' . $file;
            $dest = $backupPath . '/' . $file;
            
            if (is_file($source)) {
                $this->copyFile($source, $dest);
            } elseif (is_dir($source)) {
                $this->copyDirectory($source, $dest);
            }
        }
        
        $this->log("✅ Backup creado en: $backupPath");
    }
    
    /**
     * Limpia archivos no utilizados
     */
    private function cleanUnusedFiles() {
        if (!$this->config['clean_unused_files']) return;
        
        $this->log("🧹 Limpiando archivos no utilizados...");
        
        $filesToRemove = [
            // Archivos temporales y logs
            'api/error_log',
            'assets/css/*.map', // Source maps si no se necesitan
            'assets/js/*.map',
            
            // Archivos de ejemplo (mantener blog-home.js y blog.js)
            'api/blog-posts/marketing/ejemplo-marketing.html',
            'api/blog-posts/desarrollo/ejemplo-desarrollo.html',
            
            // Archivos de desarrollo
            '*.tmp',
            '*.log',
            '.DS_Store',
            'Thumbs.db',
            
            // Backups antiguos (más de 30 días)
            'backups/backup_*'
        ];
        
        $removedCount = 0;
        foreach ($filesToRemove as $pattern) {
            if (strpos($pattern, '*') !== false) {
                // Es un patrón con wildcard
                $files = glob($this->projectRoot . '/' . $pattern);
                foreach ($files as $file) {
                    if (is_file($file)) {
                        // Para backups antiguos, verificar fecha
                        if (strpos($file, 'backup_') !== false) {
                            if (filemtime($file) < (time() - 30 * 24 * 3600)) {
                                unlink($file);
                                $removedCount++;
                                $this->log("  ➤ Eliminado backup antiguo: " . basename($file));
                            }
                        } else {
                            unlink($file);
                            $removedCount++;
                            $this->log("  ➤ Eliminado: " . str_replace($this->projectRoot . '/', '', $file));
                        }
                    }
                }
            } else {
                // Es un archivo específico
                $fullPath = $this->projectRoot . '/' . $pattern;
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                    $removedCount++;
                    $this->log("  ➤ Eliminado: $pattern");
                }
            }
        }
        
        $this->log("✅ Limpieza completada: $removedCount archivos eliminados");
    }
    
    /**
     * Optimiza archivos CSS
     */
    private function optimizeCSS() {
        if (!$this->config['minify_css']) return;
        
        $this->log("🎨 Optimizando CSS...");
        
        $cssFiles = glob($this->assetsDir . '/css/*.css');
        
        foreach ($cssFiles as $file) {
            $originalSize = filesize($file);
            $content = file_get_contents($file);
            
            // Minificación básica
            $optimized = $this->minifyCSS($content);
            
            // Crear versión minificada si es diferente
            $minFile = str_replace('.css', '.min.css', $file);
            file_put_contents($minFile, $optimized);
            
            $newSize = strlen($optimized);
            $savings = round((($originalSize - $newSize) / $originalSize) * 100, 2);
            
            $this->log("  ➤ " . basename($file) . ": {$originalSize}B → {$newSize}B ({$savings}% reducción)");
        }
        
        $this->log("✅ CSS optimizado");
    }
    
    /**
     * Optimiza archivos JavaScript
     */
    private function optimizeJS() {
        if (!$this->config['minify_js']) return;
        
        $this->log("⚡ Optimizando JavaScript...");
        
        $jsFiles = glob($this->assetsDir . '/js/*.js');
        
        foreach ($jsFiles as $file) {
            if (strpos($file, '.min.js') !== false) continue;
            
            $originalSize = filesize($file);
            $content = file_get_contents($file);
            
            // Minificación básica
            $optimized = $this->minifyJS($content);
            
            // Crear versión minificada
            $minFile = str_replace('.js', '.min.js', $file);
            file_put_contents($minFile, $optimized);
            
            $newSize = strlen($optimized);
            $savings = round((($originalSize - $newSize) / $originalSize) * 100, 2);
            
            $this->log("  ➤ " . basename($file) . ": {$originalSize}B → {$newSize}B ({$savings}% reducción)");
        }
        
        $this->log("✅ JavaScript optimizado");
    }
    
    /**
     * Actualiza versiones de archivos
     */
    private function updateVersions() {
        $this->log("🔄 Actualizando versiones...");
        
        require_once 'assets/php/versioner.php';
        $versioner = new LauraVersioner();
        $newVersion = $versioner->regenerateVersion();
        
        $this->log("✅ Nueva versión generada: $newVersion");
    }
    
    /**
     * Genera manifiesto de build
     */
    private function generateManifest() {
        $this->log("📄 Generando manifiesto...");
        
        $manifest = [
            'build_date' => date('c'),
            'build_version' => $this->getBuildVersion(),
            'files' => $this->scanAssets(),
            'optimizations' => [
                'css_minified' => $this->config['minify_css'],
                'js_minified' => $this->config['minify_js'],
                'images_optimized' => $this->config['optimize_images']
            ]
        ];
        
        file_put_contents(
            $this->projectRoot . '/assets/build-manifest.json',
            json_encode($manifest, JSON_PRETTY_PRINT)
        );
        
        $this->log("✅ Manifiesto generado");
    }
    
    /**
     * Minificación básica de CSS
     */
    private function minifyCSS($css) {
        // Remover comentarios
        $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
        
        // Remover espacios en blanco innecesarios
        $css = str_replace(["\r\n", "\r", "\n", "\t"], '', $css);
        $css = preg_replace('/\s+/', ' ', $css);
        $css = str_replace(['; ', ' {', '{ ', ' }', '} ', ', ', ': '], [';', '{', '{', '}', '}', ',', ':'], $css);
        
        return trim($css);
    }
    
    /**
     * Minificación básica de JavaScript
     */
    private function minifyJS($js) {
        // Remover comentarios de una línea
        $js = preg_replace('/\/\/.*$/m', '', $js);
        
        // Remover comentarios de múltiples líneas
        $js = preg_replace('/\/\*[\s\S]*?\*\//', '', $js);
        
        // Remover espacios en blanco extra
        $js = preg_replace('/\s+/', ' ', $js);
        
        return trim($js);
    }
    
    /**
     * Escanea assets para el manifiesto
     */
    private function scanAssets() {
        $files = [];
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->assetsDir)
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $relativePath = str_replace($this->projectRoot, '', $file->getPathname());
                $files[$relativePath] = [
                    'size' => $file->getSize(),
                    'modified' => $file->getMTime()
                ];
            }
        }
        
        return $files;
    }
    
    /**
     * Obtiene versión del build
     */
    private function getBuildVersion() {
        return date('Y.m.d.H.i');
    }
    
    /**
     * Copia archivo
     */
    private function copyFile($source, $dest) {
        $destDir = dirname($dest);
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }
        copy($source, $dest);
    }
    
    /**
     * Copia directorio recursivamente
     */
    private function copyDirectory($source, $dest) {
        if (!is_dir($dest)) {
            mkdir($dest, 0755, true);
        }
        
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $item) {
            $destPath = $dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName();
            
            if ($item->isDir()) {
                if (!is_dir($destPath)) {
                    mkdir($destPath, 0755, true);
                }
            } else {
                copy($item, $destPath);
            }
        }
    }
    
    /**
     * Log con timestamp
     */
    private function log($message) {
        echo "[" . date('H:i:s') . "] $message\n";
    }
    
    /**
     * Despliegue a producción
     */
    public function deploy() {
        $this->log("🚀 Iniciando despliegue...");
        
        // Aquí puedes agregar lógica específica de despliegue
        // Como sincronización con servidor, invalidación de CDN, etc.
        
        $this->log("✅ Despliegue completado");
    }
}

// Ejecución desde línea de comandos
if (php_sapi_name() === 'cli') {
    $action = $argv[1] ?? 'build';
    $builder = new LauraBuildSystem();
    
    switch ($action) {
        case 'build':
            $builder->build();
            break;
        case 'deploy':
            $builder->build() && $builder->deploy();
            break;
        default:
            echo "Uso: php build.php [build|deploy]\n";
    }
}
?>