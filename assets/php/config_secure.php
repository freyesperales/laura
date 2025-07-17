<?php
/**
 * LAURA DIGITAL AGENCY - Secure Configuration
 * IMPORTANTE: Este archivo debe estar fuera del directorio público
 * o protegido con .htaccess
 */

// Configuración de Email
define('CONTACT_EMAIL', 'francisco@laura.lat');
define('SENDER_EMAIL', 'noreply@laura.lat');
define('SENDER_NAME', 'LAURA Digital Agency');

// Configuración de Base de Datos (opcional)
define('DB_ENABLED', false); // Cambiar a true si tienes BD
define('DB_HOST', 'localhost');
define('DB_NAME', 'laura_db');
define('DB_USER', 'laura_user');
define('DB_PASS', 'secure_password_here');

// Configuración de Slack (opcional)
define('SLACK_WEBHOOK', ''); // URL del webhook de Slack si quieres notificaciones

// Configuración de Seguridad
define('RATE_LIMIT_ENABLED', true);
define('RATE_LIMIT_MAX_REQUESTS', 5); // Máximo de envíos por IP
define('RATE_LIMIT_TIME_WINDOW', 3600); // En segundos (1 hora)

// Configuración de reCAPTCHA (opcional)
define('RECAPTCHA_ENABLED', false);
define('RECAPTCHA_SITE_KEY', '');
define('RECAPTCHA_SECRET_KEY', '');

// Configuración de Timezone
date_default_timezone_set('America/Santiago');

// Configuración de errores (desactivar en producción)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Cambiar a 0 en producción
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Función para rate limiting
function checkRateLimit($ip) {
    if (!RATE_LIMIT_ENABLED) return true;
    
    $rate_limit_file = __DIR__ . '/rate_limit.json';
    $rate_limits = [];
    
    if (file_exists($rate_limit_file)) {
        $rate_limits = json_decode(file_get_contents($rate_limit_file), true);
    }
    
    $current_time = time();
    
    // Limpiar entradas antiguas
    foreach ($rate_limits as $key => $data) {
        if ($current_time - $data['timestamp'] > RATE_LIMIT_TIME_WINDOW) {
            unset($rate_limits[$key]);
        }
    }
    
    // Verificar límite para esta IP
    if (isset($rate_limits[$ip])) {
        if ($rate_limits[$ip]['count'] >= RATE_LIMIT_MAX_REQUESTS) {
            return false;
        }
        $rate_limits[$ip]['count']++;
    } else {
        $rate_limits[$ip] = [
            'count' => 1,
            'timestamp' => $current_time
        ];
    }
    
    // Guardar límites actualizados
    file_put_contents($rate_limit_file, json_encode($rate_limits));
    
    return true;
}

// Función para validar reCAPTCHA
function validateRecaptcha($response) {
    if (!RECAPTCHA_ENABLED) return true;
    
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $response
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $resultJson = json_decode($result, true);
    
    return $resultJson['success'] ?? false;
}

// Función para sanitizar entrada
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Función para logging
function logActivity($type, $data) {
    $log_file = __DIR__ . '/activity.log';
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $type,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    file_put_contents($log_file, json_encode($log_entry) . PHP_EOL, FILE_APPEND | LOCK_EX);
}
?>