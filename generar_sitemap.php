<?php
// generar_sitemaps.php

function generate_sitemaps() {
    $baseUrl = 'https://www.laura.lat/'; // Reemplaza con tu dominio final

    // --- Sitemap Principal (Páginas Estáticas) ---
    $xml_main = new SimpleXMLElement('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

    // Página de Inicio
    $url_main = $xml_main->addChild('url');
    $url_main->addChild('loc', $baseUrl . 'index.php'); // Apunta a index.php
    $url_main->addChild('lastmod', date('Y-m-d'));
    $url_main->addChild('priority', '1.0');

    // Página de Blog
    $url_blog = $xml_main->addChild('url');
    $url_blog->addChild('loc', $baseUrl . 'blog.html');
    $url_blog->addChild('priority', '0.8');

    // Guarda el sitemap principal
    $xml_main->asXML('sitemap.xml');
    echo "sitemap.xml generado con éxito.<br>";


    // --- Sitemap del Blog (Artículos Dinámicos) ---
    $manifestPath = 'articles/manifest.json';
    if (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        
        $xml_blog = new SimpleXMLElement('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

        foreach ($manifest as $article) {
            $url_article = $xml_blog->addChild('url');
            $url_article->addChild('loc', $baseUrl . 'articles/' . $article['file']);
            $url_article->addChild('lastmod', $article['date']);
            $url_article->addChild('changefreq', 'monthly');
            $url_article->addChild('priority', '0.9');
        }

        // Guarda el sitemap del blog
        $xml_blog->asXML('sitemap-blog.xml');
        echo "sitemap-blog.xml generado con éxito.<br>";
    } else {
        echo "Advertencia: No se encontró articles/manifest.json. No se generó sitemap-blog.xml.<br>";
    }
}

// Ejecuta la función
generate_sitemaps();

?>