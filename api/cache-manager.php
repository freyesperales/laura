<?php
/**
 * Cache Manager con File Watcher
 */

class CacheManager {
    private $cacheDir = __DIR__ . '/cache';
    private $blogDir = __DIR__ . '/../blog-posts';
    private $lastModifiedFile = __DIR__ . '/cache/.last_modified';
    
    public function shouldClearCache() {
        $currentHash = $this->getContentHash();
        $lastHash = $this->getLastHash();
        
        return $currentHash !== $lastHash;
    }
    
    private function getContentHash() {
        $files = $this->scanAllFiles($this->blogDir);
        $hashData = '';
        
        foreach ($files as $file) {
            $hashData .= $file . filemtime($file);
        }
        
        return md5($hashData);
    }
    
    private function scanAllFiles($dir, &$files = []) {
        if (!is_dir($dir)) return $files;
        
        foreach (scandir($dir) as $item) {
            if ($item[0] === '.') continue;
            
            $path = $dir . '/' . $item;
            if (is_dir($path)) {
                $this->scanAllFiles($path, $files);
            } elseif (pathinfo($path, PATHINFO_EXTENSION) === 'html') {
                $files[] = $path;
            }
        }
        
        return $files;
    }
    
    private function getLastHash() {
        return file_exists($this->lastModifiedFile) 
            ? file_get_contents($this->lastModifiedFile) 
            : '';
    }
    
    public function updateHash() {
        $currentHash = $this->getContentHash();
        file_put_contents($this->lastModifiedFile, $currentHash);
    }
    
    public function clearCache() {
        $files = glob($this->cacheDir . '/*.json');
        foreach ($files as $file) {
            @unlink($file);
        }
    }
}