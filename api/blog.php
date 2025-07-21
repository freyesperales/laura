<?php
/**
 * LAURA Digital Agency - Blog System Backend
 * Dynamic blog structure loader
 * Version: 1.0
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Security check - only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

class LAURABlogLoader {
    
    private $blogDirectory;
    private $allowedExtensions = ['html', 'htm'];
    private $maxDepth = 3; // Prevent infinite recursion
    
    public function __construct($blogDir = 'blog-posts') {
        $this->blogDirectory = __DIR__ . '/' . $blogDir;
        
        // Create blog directory if it doesn't exist
        if (!is_dir($this->blogDirectory)) {
            mkdir($this->blogDirectory, 0755, true);
        }
    }
    
    /**
     * Main method to get blog structure
     */
    public function getBlogStructure() {
        try {
            if (!is_readable($this->blogDirectory)) {
                throw new Exception('Blog directory is not readable');
            }
            
            $structure = $this->scanDirectory($this->blogDirectory);
            
            return [
                'success' => true,
                'data' => $structure,
                'timestamp' => time()
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'timestamp' => time()
            ];
        }
    }
    
    /**
     * Recursively scan directory for blog posts
     */
    private function scanDirectory($dir, $depth = 0, $category = '') {
        if ($depth > $this->maxDepth) {
            return [];
        }
        
        $structure = [];
        $files = scandir($dir);
        
        if (!$files) {
            return $structure;
        }
        
        foreach ($files as $file) {
            // Skip hidden files and current/parent directory
            if ($file[0] === '.') {
                continue;
            }
            
            $filePath = $dir . '/' . $file;
            
            if (is_dir($filePath)) {
                // It's a subdirectory (category)
                $subcategory = $category ? $category . '/' . $file : $file;
                $subStructure = $this->scanDirectory($filePath, $depth + 1, $subcategory);
                
                if (!empty($subStructure)) {
                    $structure[$file] = $subStructure;
                }
                
            } elseif (is_file($filePath) && $this->isValidFile($file)) {
                // It's a blog post file
                $postData = $this->parsePostFile($filePath, $file);
                
                if ($postData) {
                    if ($category) {
                        // File is in a subdirectory
                        if (!isset($structure[$category])) {
                            $structure[$category] = [];
                        }
                        $structure[$category][] = $postData;
                    } else {
                        // File is in root directory
                        if (!isset($structure['general'])) {
                            $structure['general'] = [];
                        }
                        $structure['general'][] = $postData;
                    }
                }
            }
        }
        
        return $structure;
    }
    
    /**
     * Check if file has valid extension
     */
    private function isValidFile($filename) {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array($extension, $this->allowedExtensions);
    }
    
    /**
     * Parse individual post file and extract metadata
     */
    private function parsePostFile($filePath, $filename) {
        try {
            $content = file_get_contents($filePath);
            
            if (!$content) {
                return null;
            }
            
            // Get file stats
            $stats = stat($filePath);
            $fileModified = $stats['mtime'];
            
            // Extract metadata from HTML comments or meta tags
            $metadata = $this->extractMetadata($content);
            
            // Generate slug from filename
            $slug = pathinfo($filename, PATHINFO_FILENAME);
            $slug = $this->sanitizeSlug($slug);
            
            // Default values
            $postData = [
                'slug' => $slug,
                'filename' => $filename,
                'title' => $metadata['title'] ?? $this->generateTitleFromSlug($slug),
                'excerpt' => $metadata['excerpt'] ?? $this->generateExcerpt($content),
                'date' => $metadata['date'] ?? date('Y-m-d', $fileModified),
                'modified' => date('Y-m-d H:i:s', $fileModified),
                'readTime' => $this->calculateReadTime($content),
                'image' => $metadata['image'] ?? $this->generatePlaceholderImage($slug),
                'author' => $metadata['author'] ?? 'LAURA Digital Agency',
                'tags' => $metadata['tags'] ?? [],
                'featured' => $metadata['featured'] ?? false
            ];
            
            return $postData;
            
        } catch (Exception $e) {
            error_log("Error parsing post file {$filePath}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Extract metadata from HTML content
     */
    private function extractMetadata($content) {
        $metadata = [];
        
        // Look for meta tags
        if (preg_match('/<meta\s+name=["\']blog-title["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['title'] = html_entity_decode($matches[1]);
        }
        
        if (preg_match('/<meta\s+name=["\']blog-excerpt["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['excerpt'] = html_entity_decode($matches[1]);
        }
        
        if (preg_match('/<meta\s+name=["\']blog-date["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['date'] = $matches[1];
        }
        
        if (preg_match('/<meta\s+name=["\']blog-image["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['image'] = $matches[1];
        }
        
        if (preg_match('/<meta\s+name=["\']blog-author["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['author'] = html_entity_decode($matches[1]);
        }
        
        if (preg_match('/<meta\s+name=["\']blog-tags["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['tags'] = array_map('trim', explode(',', $matches[1]));
        }
        
        if (preg_match('/<meta\s+name=["\']blog-featured["\']\s+content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
            $metadata['featured'] = filter_var($matches[1], FILTER_VALIDATE_BOOLEAN);
        }
        
        // Fallback to HTML title tag
        if (empty($metadata['title']) && preg_match('/<title[^>]*>([^<]*)<\/title>/i', $content, $matches)) {
            $metadata['title'] = html_entity_decode(trim($matches[1]));
        }
        
        // Look for HTML comments with metadata
        if (preg_match('/<!--\s*BLOG_META\s*(.*?)\s*-->/is', $content, $matches)) {
            $lines = explode("\n", $matches[1]);
            foreach ($lines as $line) {
                if (preg_match '/^([^:]+):\s*(.+)$/', trim($line), $lineMatches)) {
                    $key = trim(strtolower($lineMatches[1]));
                    $value = trim($lineMatches[2]);
                    
                    if ($key === 'tags') {
                        $metadata[$key] = array_map('trim', explode(',', $value));
                    } elseif ($key === 'featured') {
                        $metadata[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                    } else {
                        $metadata[$key] = $value;
                    }
                }
            }
        }
        
        return $metadata;
    }
    
    /**
     * Generate excerpt from content
     */
    private function generateExcerpt($content, $length = 160) {
        // Remove HTML tags
        $text = strip_tags($content);
        
        // Remove extra whitespace
        $text = preg_replace('/\s+/', ' ', trim($text));
        
        // Truncate
        if (strlen($text) > $length) {
            $text = substr($text, 0, $length);
            $lastSpace = strrpos($text, ' ');
            if ($lastSpace !== false) {
                $text = substr($text, 0, $lastSpace);
            }
            $text .= '...';
        }
        
        return $text;
    }
    
    /**
     * Calculate estimated reading time
     */
    private function calculateReadTime($content) {
        $text = strip_tags($content);
        $wordCount = str_word_count($text);
        $minutes = ceil($wordCount / 200); // Average reading speed: 200 WPM
        
        return $minutes . ' min';
    }
    
    /**
     * Generate title from slug
     */
    private function generateTitleFromSlug($slug) {
        $title = str_replace(['-', '_'], ' ', $slug);
        return ucwords($title);
    }
    
    /**
     * Sanitize slug
     */
    private function sanitizeSlug($slug) {
        $slug = strtolower(trim($slug));
        $slug = preg_replace('/[^a-z0-9\-_]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return trim($slug, '-');
    }
    
    /**
     * Generate placeholder image URL
     */
    private function generatePlaceholderImage($slug) {
        $colors = ['e21e5c', '10b981', '764ba2', 'f59e0b', '8b5cf6'];
        $color = $colors[crc32($slug) % count($colors)];
        
        $title = urlencode(ucwords(str_replace(['-', '_'], ' ', $slug)));
        return "https://via.placeholder.com/400x200/{$color}/ffffff?text={$title}";
    }
}

// Handle the request
try {
    $action = $_GET['action'] ?? 'structure';
    
    switch ($action) {
        case 'structure':
            $loader = new LAURABlogLoader();
            $result = $loader->getBlogStructure();
            break;
            
        case 'post':
            $category = $_GET['category'] ?? '';
            $slug = $_GET['slug'] ?? '';
            
            if (empty($category) || empty($slug)) {
                throw new Exception('Category and slug are required');
            }
            
            // Sanitize inputs
            $category = preg_replace('/[^a-zA-Z0-9\-_\/]/', '', $category);
            $slug = preg_replace('/[^a-zA-Z0-9\-_]/', '', $slug);
            
            $postPath = __DIR__ . '/blog-posts/' . $category . '/' . $slug . '.html';
            
            if (!file_exists($postPath) || !is_readable($postPath)) {
                throw new Exception('Post not found');
            }
            
            $content = file_get_contents($postPath);
            $result = [
                'success' => true,
                'content' => $content,
                'timestamp' => time()
            ];
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => time()
    ]);
}
?>