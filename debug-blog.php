<?php
/**
 * LAURA Blog Debug Tool
 * Helps identify connection and file structure issues
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h1>🐛 LAURA Blog System Debug</h1>";
echo "<style>body{font-family:monospace;margin:20px;} .error{color:red;} .success{color:green;} .warning{color:orange;} pre{background:#f5f5f5;padding:10px;}</style>";

echo "<h2>1. 📁 Directory Structure Check</h2>";

// Check blog directory
$blogDir = __DIR__ . '/blog-posts';
echo "<strong>Blog directory:</strong> " . $blogDir . "<br>";

if (is_dir($blogDir)) {
    echo "<span class='success'>✅ Blog directory exists</span><br>";
    
    // List all directories and files
    echo "<h3>Directory Contents:</h3>";
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($blogDir),
        RecursiveIteratorIterator::SELF_FIRST
    );
    
    foreach ($iterator as $file) {
        if ($file->getFilename() !== '.' && $file->getFilename() !== '..') {
            $depth = str_repeat('&nbsp;&nbsp;', $iterator->getDepth());
            $type = $file->isDir() ? '📁' : '📄';
            $path = str_replace($blogDir, '', $file->getPathname());
            echo "{$depth}{$type} {$path}<br>";
        }
    }
} else {
    echo "<span class='error'>❌ Blog directory doesn't exist</span><br>";
    echo "Creating directory...<br>";
    if (mkdir($blogDir, 0755, true)) {
        echo "<span class='success'>✅ Directory created</span><br>";
    } else {
        echo "<span class='error'>❌ Failed to create directory</span><br>";
    }
}

echo "<hr>";

echo "<h2>2. 🔗 API Connection Test</h2>";

// Test API endpoints
$baseUrl = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']);
$apiUrl = $baseUrl . '/blog.php';

echo "<strong>API URL:</strong> {$apiUrl}<br>";

// Test structure endpoint
echo "<h3>Testing structure endpoint:</h3>";
$structureUrl = $apiUrl . '?action=structure';
echo "URL: {$structureUrl}<br>";

$context = stream_context_create([
    'http' => [
        'timeout' => 10,
        'method' => 'GET'
    ]
]);

$response = @file_get_contents($structureUrl, false, $context);

if ($response !== false) {
    echo "<span class='success'>✅ API responding</span><br>";
    $data = json_decode($response, true);
    if ($data) {
        echo "<strong>Response:</strong><br>";
        echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
    } else {
        echo "<span class='error'>❌ Invalid JSON response</span><br>";
        echo "<strong>Raw response:</strong><br>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    }
} else {
    echo "<span class='error'>❌ API not responding</span><br>";
    echo "<strong>Error:</strong> " . error_get_last()['message'] . "<br>";
}

echo "<hr>";

echo "<h2>3. 📄 HTML Files Analysis</h2>";

if (is_dir($blogDir)) {
    $htmlFiles = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($blogDir)
    );
    
    foreach ($iterator as $file) {
        if ($file->isFile() && in_array(strtolower($file->getExtension()), ['html', 'htm'])) {
            $relativePath = str_replace($blogDir . '/', '', $file->getPathname());
            $htmlFiles[] = [
                'path' => $relativePath,
                'fullPath' => $file->getPathname(),
                'size' => $file->getSize(),
                'modified' => date('Y-m-d H:i:s', $file->getMTime())
            ];
        }
    }
    
    if (!empty($htmlFiles)) {
        echo "<strong>Found " . count($htmlFiles) . " HTML files:</strong><br><br>";
        
        foreach ($htmlFiles as $file) {
            echo "<div style='border:1px solid #ddd; margin:10px 0; padding:10px;'>";
            echo "<strong>📄 {$file['path']}</strong><br>";
            echo "Size: {$file['size']} bytes | Modified: {$file['modified']}<br>";
            
            // Try to extract metadata
            $content = file_get_contents($file['fullPath']);
            if ($content) {
                // Extract title
                if (preg_match('/<meta\s+name=["\']blog-title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
                    echo "<span class='success'>✅ blog-title: " . htmlspecialchars($matches[1]) . "</span><br>";
                } else if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $content, $matches)) {
                    echo "<span class='warning'>⚠️ Using H1 as title: " . htmlspecialchars(strip_tags($matches[1])) . "</span><br>";
                } else {
                    echo "<span class='error'>❌ No title found</span><br>";
                }
                
                // Extract excerpt
                if (preg_match('/<meta\s+name=["\']blog-excerpt["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
                    echo "<span class='success'>✅ blog-excerpt found</span><br>";
                } else {
                    echo "<span class='warning'>⚠️ No blog-excerpt meta tag</span><br>";
                }
                
                // Extract date
                if (preg_match('/<meta\s+name=["\']blog-date["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $content, $matches)) {
                    echo "<span class='success'>✅ blog-date: " . htmlspecialchars($matches[1]) . "</span><br>";
                } else {
                    echo "<span class='warning'>⚠️ No blog-date meta tag</span><br>";
                }
                
                // Word count
                $wordCount = str_word_count(strip_tags($content));
                echo "Word count: {$wordCount}<br>";
                
            } else {
                echo "<span class='error'>❌ Cannot read file content</span><br>";
            }
            
            echo "</div>";
        }
    } else {
        echo "<span class='warning'>⚠️ No HTML files found in blog directory</span><br>";
    }
} else {
    echo "<span class='error'>❌ Cannot analyze files - directory doesn't exist</span><br>";
}

echo "<hr>";

echo "<h2>4. 🧪 Create Sample Blog for Testing</h2>";

if (isset($_GET['create_sample'])) {
    $sampleDir = $blogDir . '/marketing-digital';
    if (!is_dir($sampleDir)) {
        mkdir($sampleDir, 0755, true);
    }
    
    $sampleContent = '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="blog-title" content="Test: SEO Local para Empresas 2025">
    <meta name="blog-excerpt" content="Guía completa para posicionar tu empresa localmente en Google. Estrategias probadas y herramientas gratuitas.">
    <meta name="blog-date" content="' . date('Y-m-d') . '">
    <meta name="blog-author" content="Equipo LAURA">
    <meta name="blog-image" content="/assets/img/blog-default.webp">
    <meta name="blog-tags" content="seo, local, google, marketing, empresas">
    <meta name="blog-featured" content="false">
    <title>Test: SEO Local para Empresas 2025</title>
</head>
<body>
    <h1>Test: SEO Local para Empresas 2025</h1>
    
    <p><strong>El SEO local es fundamental para que tu empresa aparezca cuando los clientes buscan servicios cerca de ellos</strong>. En este artículo te mostramos cómo dominar Google My Business y aparecer en los primeros resultados.</p>
    
    <h2>¿Por qué es importante el SEO Local?</h2>
    
    <p>Las búsquedas locales representan el 46% de todas las búsquedas en Google. Esto significa que casi la mitad de tus clientes potenciales están buscando servicios "cerca de mí".</p>
    
    <ul>
        <li><strong>Visibilidad inmediata</strong>: Aparece cuando buscan en tu zona</li>
        <li><strong>Mayor conversión</strong>: Los usuarios locales compran más</li>
        <li><strong>Menos competencia</strong>: Solo compites con empresas de tu área</li>
    </ul>
    
    <h2>Estrategias de SEO Local</h2>
    
    <h3>1. Optimiza Google My Business</h3>
    
    <p>Tu perfil de Google My Business es lo más importante para el SEO local. Asegúrate de:</p>
    
    <ol>
        <li>Completar toda la información</li>
        <li>Añadir fotos de calidad</li>
        <li>Obtener reseñas genuinas</li>
        <li>Responder a todas las reseñas</li>
    </ol>
    
    <h3>2. Crea Contenido Local</h3>
    
    <p>Escribe sobre temas relevantes para tu comunidad local. Por ejemplo, si tienes una empresa en Santiago, escribe sobre "Mejores prácticas de marketing digital en Santiago".</p>
    
    <h2>Conclusión</h2>
    
    <p>El SEO local es una inversión que genera resultados a largo plazo. En <strong>LAURA Digital Agency</strong>, te ayudamos a posicionar tu empresa localmente con estrategias probadas.</p>
    
    <div style="background: linear-gradient(135deg, #e21e5c, #ff4081); color: white; padding: 2rem; border-radius: 12px; text-align: center; margin: 2rem 0;">
        <h3>¿Quieres aparecer primero en tu zona?</h3>
        <p>Te ayudamos a dominar el SEO local y atraer más clientes locales.</p>
        <a href="../index.html#contacto" style="display: inline-block; background: white; color: #e21e5c; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600;">
            Consulta Gratuita
        </a>
    </div>
</body>
</html>';
    
    $sampleFile = $sampleDir . '/test-seo-local-empresas-2025.html';
    file_put_contents($sampleFile, $sampleContent);
    
    echo "<span class='success'>✅ Sample blog created: {$sampleFile}</span><br>";
    echo "<a href='?'>🔄 Refresh to see the sample</a><br>";
} else {
    echo "<a href='?create_sample=1' style='background:#007cba;color:white;padding:10px;text-decoration:none;border-radius:5px;'>🧪 Create Sample Blog</a><br>";
}

echo "<hr>";

echo "<h2>5. 🌐 JavaScript Connection Test</h2>";

echo "<p>Open your browser's console and run this code to test the JavaScript connection:</p>";

echo "<pre>
// Test API connection from browser
fetch('/api/blog.php?action=structure')
    .then(response => response.json())
    .then(data => {
        console.log('✅ API working:', data);
    })
    .catch(error => {
        console.error('❌ API error:', error);
    });
</pre>";

echo "<hr>";

echo "<h2>6. 📋 Troubleshooting Checklist</h2>";

$checks = [
    'PHP version >= 7.4' => version_compare(PHP_VERSION, '7.4.0') >= 0,
    'JSON extension loaded' => extension_loaded('json'),
    'Blog directory writable' => is_writable($blogDir),
    'Cache directory exists' => is_dir(__DIR__ . '/cache'),
    'Cache directory writable' => is_writable(__DIR__ . '/cache') || mkdir(__DIR__ . '/cache', 0755, true),
];

foreach ($checks as $check => $result) {
    $icon = $result ? '✅' : '❌';
    $class = $result ? 'success' : 'error';
    echo "<div class='{$class}'>{$icon} {$check}</div>";
}

echo "<hr>";

echo "<h2>7. 🔧 Quick Fixes</h2>";

echo "<h3>If API is not responding:</h3>";
echo "<ul>";
echo "<li>Check that blog.php exists in /api/ directory</li>";
echo "<li>Verify web server has PHP enabled</li>";
echo "<li>Check file permissions (644 for PHP files)</li>";
echo "<li>Look at server error logs</li>";
echo "</ul>";

echo "<h3>If blogs appear without HTML:</h3>";
echo "<ul>";
echo "<li>Check that HTML files are in correct subdirectories</li>";
echo "<li>Verify file names match the slug in metadata</li>";
echo "<li>Ensure HTML files have proper meta tags</li>";
echo "<li>Check file permissions (644 for HTML files)</li>";
echo "</ul>";

echo "<h3>If JavaScript doesn't load blogs:</h3>";
echo "<ul>";
echo "<li>Open browser console and look for errors</li>";
echo "<li>Verify blog.js is loading correctly</li>";
echo "<li>Check network tab for failed API requests</li>";
echo "<li>Ensure DOM elements exist (blog-loading, blog-grid, etc.)</li>";
echo "</ul>";

echo "<hr>";
echo "<p><small>🕐 Debug run at: " . date('Y-m-d H:i:s') . "</small></p>";
?>