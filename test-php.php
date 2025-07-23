<?php
// Verificar configuración PHP
echo "PHP Version: " . phpversion() . "\n";
echo "JSON Extension: " . (extension_loaded('json') ? 'OK' : 'MISSING') . "\n";
echo "File System: " . (is_readable(__DIR__) ? 'OK' : 'NO READ ACCESS') . "\n";
echo "Blog Directory: " . (is_dir(__DIR__ . '/blog-posts') ? 'EXISTS' : 'MISSING') . "\n";
?>