<?php
/**
 * LAURA DIGITAL AGENCY - Sistema de Versionado Automático
 * Genera versiones para CSS/JS y evita problemas de caché
 * Archivo: assets/php/versioner.php
 */

class LauraVersioner {
    private $versionFile = 'assets/versions.json';
    private $assetsDir = 'assets/';
    private $currentVersion;
    
    public function __construct() {
        $this->loadVersion();
    }
    
    /**
     * Carga la versión actual o genera una nueva
     */
    private function loadVersion() {
        if (file_exists($this->versionFile)) {
            $data = json_decode(file_get_contents($this->versionFile), true);
            $this->currentVersion = $data['version'] ?? $this->generateVersion();
        } else {
            $this->currentVersion = $this->generateVersion();
            $this->saveVersion();
        }
    }
    
    /**
     * Genera una nueva versión basada en timestamp y archivos
     */
    private function generateVersion() {
        $hash = md5(time() . $this->getFilesChecksum());
        return substr($hash, 0, 8);
    }
    
    /**
     * Obtiene checksum de todos los archivos CSS/JS
     */
    private function getFilesChecksum() {
        $files = [];
        $this->scanFiles($this->assetsDir, $files, ['css', 'js']);
        
        $checksum = '';
        foreach ($files as $file) {
            if (file_exists($file)) {
                $checksum .= filemtime($file);
            }
        }
        
        return $checksum;
    }
    
    /**
     * Escanea archivos recursivamente
     */
    private function scanFiles($dir, &$files, $extensions) {
        if (!is_dir($dir)) return;
        
        foreach (scandir($dir) as $item) {
            if ($item[0] === '.') continue;
            
            $path = $dir . $item;
            if (is_dir($path)) {
                $this->scanFiles($path . '/', $files, $extensions);
            } else {
                $ext = pathinfo($path, PATHINFO_EXTENSION);
                if (in_array($ext, $extensions)) {
                    $files[] = $path;
                }
            }
        }
    }
    
    /**
     * Guarda la versión actual
     */
    private function saveVersion() {
        $data = [
            'version' => $this->currentVersion,
            'timestamp' => time(),
            'date' => date('Y-m-d H:i:s')
        ];
        
        file_put_contents($this->versionFile, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    /**
     * Regenera versión (para usar después de cambios)
     */
    public function regenerateVersion() {
        $this->currentVersion = $this->generateVersion();
        $this->saveVersion();
        return $this->currentVersion;
    }
    
    /**
     * Obtiene la versión actual
     */
    public function getVersion() {
        return $this->currentVersion;
    }
    
    /**
     * Genera URL con versión
     */
    public function getVersionedUrl($url) {
        $separator = strpos($url, '?') !== false ? '&' : '?';
        return $url . $separator . 'v=' . $this->currentVersion;
    }
    
    /**
     * Genera todas las URLs versionadas para el HTML
     */
    public function getVersionedAssets() {
        return [
            'css' => $this->getVersionedUrl('/assets/css/main.css'),
            'js' => [
                'config' => $this->getVersionedUrl('/assets/js/config.js'),
                'components' => $this->getVersionedUrl('/assets/js/components.js'),
                'forms' => $this->getVersionedUrl('/assets/js/forms.js'),
                'blog-home' => $this->getVersionedUrl('/assets/js/blog-home.js'),
                'main' => $this->getVersionedUrl('/assets/js/main.js')
            ]
        ];
    }
    
    /**
     * API para obtener versiones (para JavaScript)
     */
    public function apiResponse() {
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        
        echo json_encode([
            'success' => true,
            'version' => $this->currentVersion,
            'assets' => $this->getVersionedAssets(),
            'timestamp' => time()
        ]);
    }
}

// Si se llama directamente como API
if (basename($_SERVER['PHP_SELF']) === 'versioner.php') {
    $action = $_GET['action'] ?? 'get';
    $versioner = new LauraVersioner();
    
    switch ($action) {
        case 'regenerate':
            $versioner->regenerateVersion();
            $versioner->apiResponse();
            break;
        case 'get':
        default:
            $versioner->apiResponse();
            break;
    }
}
?>