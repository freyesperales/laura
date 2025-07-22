<?php
function renderBlogTemplate($content, $title = '', $meta = []) {
    $defaultMeta = [
        'description' => 'Blog de LAURA Digital Agency',
        'keywords' => 'marketing digital, desarrollo web, ciberseguridad',
        'image' => '/assets/img/blog-default.webp'
    ];
    
    $meta = array_merge($defaultMeta, $meta);
    
    return <<<HTML
<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title} - LAURA Digital Agency</title>
    <meta name="description" content="{$meta['description']}">
    <meta name="keywords" content="{$meta['keywords']}">
    <link rel="canonical" href="https://laura.lat/blog">
    <link rel="icon" type="image/png" href="./assets/img/favicon-laura-agency.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="./assets/css/main.css">
</head>
<body>
    <!-- Navigation include -->
    <?php include 'includes/nav.php'; ?>
    
    <!-- Content -->
    {$content}
    
    <!-- Footer include -->
    <?php include 'includes/footer.php'; ?>
    
    <!-- Scripts -->
    <script src="./assets/js/main.js"></script>
</body>
</html>
HTML;
}
?>