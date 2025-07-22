<?php
/**
 * LAURA Digital Agency - Enhanced Blog API
 * Version: 2.2 - Robust error handling and debugging
 */

// Enable error reporting for debugging
if (isset($_GET['_debug'])) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'error' => 'Method not allowed',
        'debug' => isset($_GET['_debug']) ? ['method' => $_SERVER['REQUEST_METHOD']] : null
    ]);
    exit();
}

class LAURABlogAPI {
    
    private $blogDirectory;
    private $cacheDirectory;
    private $allowedExtensions = ['html', 'htm'];
    private $maxDepth = 3;
    private $cacheTime = 1800; // 30 minutes
    private $debug;
    
    public function __construct($blogDir = 'blog-posts') {
        $this->debug = isset($_GET['_debug']);
        $this->blogDirectory = $this->resolvePath($blogDir);
        $this->cacheDirectory = __DIR__ . '/cache';
        
        $this->createDirectories();
    }
    
    private function resolvePath($blogDir) {
        // Try multiple possible locations
        $possiblePaths = [
            __DIR__ . '/' . $blogDir,
            __DIR__ . '/../' . $blogDir,
            $_SERVER['DOCUMENT_ROOT'] . '/' . $blogDir
        ];
        
        foreach ($possiblePaths as $path) {
            if (is_dir($path)) {
                return $path;
            }
        }
        
        // Return first path for creation
        return $possiblePaths[0];
    }
    
    private function createDirectories() {
        if (!is_dir($this->blogDirectory)) {
            if (!mkdir($this->blogDirectory, 0755, true)) {
                $this->debugLog("Failed to create blog directory: {$this->blogDirectory}");
            } else {
                $this->debugLog("Created blog directory: {$this->blogDirectory}");
            }
        }
        
        if (!is_dir($this->cacheDirectory)) {
            if (!mkdir($this->cacheDirectory, 0755, true)) {
                $this->debugLog("Failed to create cache directory: {$this->cacheDirectory}");
            }
        }
    }
    
    private function debugLog($message) {
        if ($this->debug) {
            error_log("LAURA Blog API: " . $message);
        }
    }
    
    public function handleRequest() {
        try {
            $action = $_GET['action'] ?? 'structure';
            
            $this->debugLog("Handling action: {$action}");
            
            switch ($action) {
                case 'structure':
                    return $this->getBlogStructure();
                    
                case 'post':
                    $category = $_GET['category'] ?? '';
                    $slug = $_GET['slug'] ?? '';
                    return $this->getSinglePost($category, $slug);
                    
                case 'clear-cache':
                    return $this->clearCache();
                    
                case 'health':
                    return $this->getHealthCheck();
                
                case 'checksum':
                    return $this->getContentChecksum();
                    
                default:
                    throw new Exception("Unknown action: {$action}");
            }
            
        } catch (Exception $e) {
            $this->debugLog("Error in handleRequest: " . $e->getMessage());
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
    
    private function getHealthCheck() {
        return $this->successResponse([
            'php_version' => PHP_VERSION,
            'blog_directory' => $this->blogDirectory,
            'blog_dir_exists' => is_dir($this->blogDirectory),
            'blog_dir_readable' => is_readable($this->blogDirectory),
            'cache_dir_exists' => is_dir($this->cacheDirectory),
            'cache_dir_writable' => is_writable($this->cacheDirectory),
            'extensions' => [
                'json' => extension_loaded('json'),
                'mbstring' => extension_loaded('mbstring')
            ]
        ]);
    }
    private function getContentChecksum() {
    try {
        $files = $this->getAllBlogFiles();
        $checksumData = '';
        
        foreach ($files as $file) {
            $checksumData .= $file . filemtime($file);
        }
        
        $checksum = md5($checksumData);
        
        return $this->successResponse([
            'checksum' => $checksum,
            'files_count' => count($files),
            'last_modified' => max(array_map('filemtime', $files))
        ]);
        
    } catch (Exception $e) {
        return $this->errorResponse('Error generating checksum: ' . $e->getMessage());
    }
}

private function getAllBlogFiles() {
    $files = [];
    $this->scanForFiles($this->blogDirectory, $files);
    return $files;
}

private function scanForFiles($dir, &$files) {
    if (!is_dir($dir)) return;
    
    foreach (scandir($dir) as $item) {
        if ($item[0] === '.') continue;
        
        $path = $dir . '/' . $item;
        if (is_dir($path)) {
            $this->scanForFiles($path, $files);
        } elseif (in_array(pathinfo($path, PATHINFO_EXTENSION), $this->allowedExtensions)) {
            $files[] = $path;
        }
    }
}
    private function getBlogStructure() {
        try {
            $this->debugLog("Getting blog structure from: {$this->blogDirectory}");
            
            if (!is_readable($this->blogDirectory)) {
                throw new Exception("Blog directory is not readable: {$this->blogDirectory}");
            }
            
            // Try cache first
            $cacheKey = 'blog_structure_v3';
            $cached = $this->getFromCache($cacheKey);
            
            if ($cached !== false && !$this->debug) {
                $this->debugLog("Returning cached structure");
                return $this->successResponse($cached, true);
            }
            
            // Scan directory
            $structure = $this->scanDirectory($this->blogDirectory);
            
            $this->debugLog("Scanned structure: " . json_encode(array_keys($structure)));
            
            // If empty, create sample structure
            if (empty($structure)) {
                $this->debugLog("Empty structure, creating sample");
                $structure = $this->createSampleStructure();
            }
            
            // Save to cache
            $this->saveToCache($cacheKey, $structure);
            
            return $this->successResponse($structure, false);
            
        } catch (Exception $e) {
            $this->debugLog("Error in getBlogStructure: " . $e->getMessage());
            return $this->errorResponse($e->getMessage());
        }
    }
    
    private function createSampleStructure() {
        // Create a sample blog if none exist
        $sampleDir = $this->blogDirectory . '/marketing-digital';
        if (!is_dir($sampleDir)) {
            mkdir($sampleDir, 0755, true);
        }
        
        $sampleContent = $this->getSampleBlogContent();
        $sampleFile = $sampleDir . '/ejemplo-marketing-digital-2025.html';
        
        if (!file_exists($sampleFile)) {
            file_put_contents($sampleFile, $sampleContent);
            $this->debugLog("Created sample blog: {$sampleFile}");
        }
        
        // Return structure for the sample
        return [
            'marketing-digital' => [
                [
                    'slug' => 'ejemplo-marketing-digital-2025',
                    'title' => 'Ejemplo: Marketing Digital para Empresas 2025',
                    'excerpt' => 'Este es un artículo de ejemplo para demostrar el funcionamiento del sistema de blog de LAURA Digital Agency.',
                    'date' => date('c'),
                    'readTime' => '5 min',
                    'image' => '/assets/img/blog-default.webp',
                    'author' => 'Equipo LAURA',
                    'tags' => ['marketing', 'digital', 'ejemplo'],
                    'featured' => false
                ]
            ]
        ];
    }
    
    private function getSampleBlogContent() {
        return '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="blog-title" content="Ejemplo: Marketing Digital para Empresas 2025">
    <meta name="blog-excerpt" content="Este es un artículo de ejemplo para demostrar el funcionamiento del sistema de blog de LAURA Digital Agency.">
    <meta name="blog-date" content="' . date('Y-m-d') . '">
    <meta name="blog-author" content="Equipo LAURA">
    <meta name="blog-image" content="/assets/img/blog-default.webp">
    <meta name="blog-tags" content="marketing, digital, ejemplo">
    <meta name="blog-featured" content="false">
    <title>Ejemplo: Marketing Digital para Empresas 2025</title>
</head>
<body>
    <h1>Ejemplo: Marketing Digital para Empresas 2025</h1>
    
    <p><strong>Este es un artículo de ejemplo creado automáticamente</strong> para demostrar que el sistema de blog de LAURA Digital Agency está funcionando correctamente.</p>
    
    <h2>¿Cómo funciona el sistema?</h2>
    
    <p>Nuestro sistema de blog lee automáticamente los archivos HTML de las carpetas y los muestra de forma dinámica. Esto permite:</p>
    
    <ul>
        <li><strong>Gestión simple</strong>: Solo necesitas agregar archivos HTML</li>
        <li><strong>SEO optimizado</strong>: Cada archivo tiene sus propios meta tags</li>
        <li><strong>Carga dinámica</strong>: No necesitas actualizar código</li>
        <li><strong>Categorización automática</strong>: Las carpetas son las categorías</li>
    </ul>
    
    <h2>Próximos pasos</h2>
    
    <p>Si ves este artículo, significa que el sistema está funcionando correctamente. Puedes:</p>
    
    <ol>
        <li>Eliminar este archivo de ejemplo</li>
        <li>Crear tus propios artículos usando el template</li>
        <li>Organizarlos en las carpetas de categorías</li>
    </ol>
    
    <p>En <strong>LAURA Digital Agency</strong> creamos soluciones digitales que realmente funcionan.</p>
    
    <div style="background: linear-gradient(135deg, #e21e5c, #ff4081); color: white; padding: 2rem; border-radius: 12px; text-align: center; margin: 2rem 0;">
        <h3>¿Listo para crear contenido de calidad?</h3>
        <p>Te ayudamos a desarrollar una estrategia de contenido que genere resultados reales.</p>
        <a href="../index.html#contacto" style="display: inline-block; background: white; color: #e21e5c; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600;">
            Comenzar Ahora
        </a>
    </div>
</body>
</html>';
    }
    
    private function scanDirectory($dir, $depth = 0, $category = '') {
        if ($depth > $this->maxDepth) {
            $this->debugLog("Max depth reached at: {$dir}");
            return [];
        }
        
        $structure = [];
        $files = @scandir($dir);
        
        if (!$files) {
            $this->debugLog("Cannot scan directory: {$dir}");
            return $structure;
        }
        
        $this->debugLog("Scanning directory: {$dir} (found " . count($files) . " items)");
        
        foreach ($files as $file) {
            // Skip hidden files and system files
            if ($file[0] === '.' || in_array($file, ['index.php', 'index.html', '.htaccess'])) {
                continue;
            }
            
            $filePath = $dir . '/' . $file;
            $currentCategory = $category ? $category . '/' . $file : $file;
            
            if (is_dir($filePath)) {
                $this->debugLog("Found directory: {$file}");
                // Subdirectory (category)
                $subStructure = $this->scanDirectory($filePath, $depth + 1, $currentCategory);
                
                if (!empty($subStructure)) {
                    if (isset($subStructure['posts'])) {
                        // Direct posts in subdirectory
                        $structure[$file] = $subStructure['posts'];
                    } else {
                        // Nested structure
                        $structure[$file] = $subStructure;
                    }
                }
                
            } else {
                // File - check if it's a blog post
                $fileInfo = pathinfo($file);
                $extension = strtolower($fileInfo['extension'] ?? '');
                
                if (in_array($extension, $this->allowedExtensions)) {
                    $this->debugLog("Processing HTML file: {$file}");
                    $postData = $this->extractPostMetadata($filePath, $fileInfo['filename']);
                    
                    if ($postData) {
                        if (!isset($structure['posts'])) {
                            $structure['posts'] = [];
                        }
                        $structure['posts'][] = $postData;
                        $this->debugLog("Added post: {$postData['title']}");
                    } else {
                        $this->debugLog("Failed to extract metadata from: {$file}");
                    }
                }
            }
        }
        
        return $structure;
    }
    
    private function extractPostMetadata($filePath, $slug) {
        try {
            if (!is_readable($filePath)) {
                $this->debugLog("File not readable: {$filePath}");
                return null;
            }
            
            $content = file_get_contents($filePath);
            
            if (!$content) {
                $this->debugLog("Empty content in: {$filePath}");
                return null;
            }
            
            $metadata = [
                'slug' => $slug,
                'title' => $this->extractTitle($content) ?: $this->generateTitleFromSlug($slug),
                'excerpt' => $this->extractExcerpt($content) ?: $this->generateExcerptFromContent($content),
                'date' => $this->extractDate($content, $filePath),
                'readTime' => $this->calculateReadTime($content),
                'image' => $this->extractImage($content, $slug),
                'author' => $this->extractAuthor($content),
                'tags' => $this->extractTags($content),
                'featured' => $this->extractFeatured($content),
                'lastModified' => filemtime($filePath),
                'filesize' => filesize($filePath)
            ];
            
            $this->debugLog("Extracted metadata for {$slug}: title='{$metadata['title']}', excerpt length=" . strlen($metadata['excerpt']));
            
            return $metadata;
            
        } catch (Exception $e) {
            $this->debugLog("Error extracting metadata from {$filePath}: " . $e->getMessage());
            return null;
        }
    }
    
    // All the extraction methods remain the same as before...
    private function extractTitle($content) {
        $patterns = [
            '/<meta\s+name=["\']blog-title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<h1[^>]*>(.*?)<\/h1>/is',
            '/<title[^>]*>(.*?)<\/title>/is'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $title = trim(strip_tags(html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8')));
                if (!empty($title) && $title !== 'Untitled') {
                    return $title;
                }
            }
        }
        
        return '';
    }
    
    private function extractExcerpt($content) {
        $patterns = [
            '/<meta\s+name=["\']blog-excerpt["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $excerpt = trim(html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8'));
                if (!empty($excerpt)) {
                    return $excerpt;
                }
            }
        }
        
        return '';
    }
    
    private function extractDate($content, $filePath) {
        $patterns = [
            '/<meta\s+name=["\']blog-date["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+name=["\']date["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+property=["\']article:published_time["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $date = $this->parseDate($matches[1]);
                if ($date) {
                    return $date;
                }
            }
        }
        
        return date('c', filemtime($filePath));
    }
    
    private function extractImage($content, $slug) {
        $patterns = [
            '/<meta\s+name=["\']blog-image["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+property=["\']og:image["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $imageUrl = trim($matches[1]);
                if (!empty($imageUrl) && $this->isValidImageUrl($imageUrl)) {
                    return $imageUrl;
                }
            }
        }
        
        return "/assets/img/blog-default.webp";
    }
    
    private function extractAuthor($content) {
        $patterns = [
            '/<meta\s+name=["\']blog-author["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+name=["\']author["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $author = trim($matches[1]);
                if (!empty($author)) {
                    return $author;
                }
            }
        }
        
        return 'Equipo LAURA';
    }
    
    private function extractTags($content) {
        $patterns = [
            '/<meta\s+name=["\']blog-tags["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i',
            '/<meta\s+name=["\']keywords["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $tags = trim($matches[1]);
                if (!empty($tags)) {
                    return array_map('trim', explode(',', $tags));
                }
            }
        }
        
        return [];
    }
    
    private function extractFeatured($content) {
        if (preg_match('/<meta\s+name=["\']blog-featured["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            return strtolower(trim($matches[1])) === 'true';
        }
        
        return false;
    }
    
    private function calculateReadTime($content) {
        $text = strip_tags($content);
        $wordCount = str_word_count($text);
        $readTime = ceil($wordCount / 200);
        
        if ($readTime <= 1) {
            return '1 min';
        } else {
            return $readTime . ' min';
        }
    }
    
    private function generateExcerptFromContent($content, $length = 160) {
        $text = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', '', $content);
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);
        
        if (mb_strlen($text, 'UTF-8') <= $length) {
            return $text;
        }
        
        $excerpt = mb_substr($text, 0, $length, 'UTF-8');
        $lastSpace = mb_strrpos($excerpt, ' ', 0, 'UTF-8');
        
        if ($lastSpace !== false && $lastSpace > ($length * 0.75)) {
            $excerpt = mb_substr($excerpt, 0, $lastSpace, 'UTF-8');
        }
        
        return $excerpt . '...';
    }
    
    private function generateTitleFromSlug($slug) {
        return ucwords(str_replace(['-', '_'], ' ', $slug));
    }
    
    private function parseDate($dateString) {
        $formats = [
            'c', 'Y-m-d\TH:i:sP', 'Y-m-d H:i:s', 'Y-m-d', 
            'd/m/Y', 'm/d/Y', 'j F Y', 'F j, Y'
        ];
        
        foreach ($formats as $format) {
            $date = DateTime::createFromFormat($format, $dateString);
            if ($date !== false) {
                return $date->format('c');
            }
        }
        
        $timestamp = strtotime($dateString);
        if ($timestamp !== false) {
            return date('c', $timestamp);
        }
        
        return null;
    }
    
    private function isValidImageUrl($url) {
        return !empty($url) && 
               (filter_var($url, FILTER_VALIDATE_URL) || $url[0] === '/') &&
               preg_match('/\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i', $url);
    }
    
    private function getSinglePost($category, $slug) {
        try {
            if (empty($category) || empty($slug)) {
                throw new Exception('Category and slug are required');
            }
            
            $possiblePaths = [
                $this->blogDirectory . '/' . $category . '/' . $slug . '.html',
                $this->blogDirectory . '/' . $category . '/' . $slug . '.htm',
            ];
            
            $content = null;
            $foundPath = null;
            
            foreach ($possiblePaths as $path) {
                if (file_exists($path) && is_readable($path)) {
                    $content = file_get_contents($path);
                    $foundPath = $path;
                    break;
                }
            }
            
            if (!$content) {
                throw new Exception("Post not found: {$category}/{$slug}");
            }
            
            $this->debugLog("Found post: {$foundPath}");
            
            return $this->successResponse([
                'content' => $content,
                'path' => $foundPath
            ]);
            
        } catch (Exception $e) {
            $this->debugLog("Error in getSinglePost: " . $e->getMessage());
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    
    // Cache and response methods remain the same...
    private function getFromCache($key) {
        $cacheFile = $this->cacheDirectory . '/' . md5($key) . '.json';
        
        if (!file_exists($cacheFile)) {
            return false;
        }
        
        $cacheAge = time() - filemtime($cacheFile);
        if ($cacheAge > $this->cacheTime) {
            @unlink($cacheFile);
            return false;
        }
        
        $cached = @file_get_contents($cacheFile);
        if (!$cached) {
            return false;
        }
        
        $data = json_decode($cached, true);
        return $data ?: false;
    }
    
    private function saveToCache($key, $data) {
        $cacheFile = $this->cacheDirectory . '/' . md5($key) . '.json';
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        return @file_put_contents($cacheFile, $json) !== false;
    }
    
    private function clearCache() {
        $cleared = 0;
        $files = glob($this->cacheDirectory . '/*.json');
        
        foreach ($files as $file) {
            if (@unlink($file)) {
                $cleared++;
            }
        }
        
        return $this->successResponse([
            'message' => 'Cache cleared successfully',
            'files_cleared' => $cleared
        ]);
    }
    
    private function successResponse($data, $cached = false) {
        $response = [
            'success' => true,
            'data' => $data,
            'cached' => $cached,
            'timestamp' => time()
        ];
        
        if ($this->debug) {
            $response['debug'] = [
                'blog_directory' => $this->blogDirectory,
                'cache_directory' => $this->cacheDirectory,
                'php_version' => PHP_VERSION
            ];
        }
        
        return $response;
    }
    
    private function errorResponse($message, $code = 500) {
        http_response_code($code);
        
        $response = [
            'success' => false,
            'error' => $message,
            'timestamp' => time()
        ];
        
        if ($this->debug) {
            $response['debug'] = [
                'blog_directory' => $this->blogDirectory,
                'blog_dir_exists' => is_dir($this->blogDirectory),
                'blog_dir_readable' => is_readable($this->blogDirectory)
            ];
        }
        
        return $response;
    }
}

// Execute API
try {
    $api = new LAURABlogAPI();
    $response = $api->handleRequest();
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error: ' . $e->getMessage(),
        'timestamp' => time(),
        'debug' => isset($_GET['_debug']) ? [
            'exception' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ] : null
    ], JSON_PRETTY_PRINT);
}
?>