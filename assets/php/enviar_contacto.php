<?php
/**
 * LAURA DIGITAL AGENCY - Contact Form Handler
 * Procesa los formularios de contacto
 * Version: 2.0
 */

// Configuración
require_once 'config_secure.php';

// Headers para CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Obtener datos JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit();
}

// Validar campos requeridos
$required_fields = ['firstName', 'email', 'service', 'message'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Campo requerido: $field"]);
        exit();
    }
}

// Sanitizar datos
$firstName = filter_var($data['firstName'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$company = isset($data['company']) ? filter_var($data['company'], FILTER_SANITIZE_STRING) : 'No especificada';
$service = filter_var($data['service'], FILTER_SANITIZE_STRING);
$message = filter_var($data['message'], FILTER_SANITIZE_STRING);
$budget = isset($data['budget']) ? filter_var($data['budget'], FILTER_SANITIZE_STRING) : 'No especificado';
$timestamp = isset($data['timestamp']) ? $data['timestamp'] : date('c');

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit();
}

// Mapear servicios
$service_names = [
    'web' => 'Desarrollo Web',
    'security' => 'Ciberseguridad',
    'marketing' => 'Marketing Digital',
    'consulting' => 'Consultoría',
    'all' => 'Solución integral'
];
$service_name = isset($service_names[$service]) ? $service_names[$service] : $service;

// Preparar email
$to = CONTACT_EMAIL; // Definido en config_secure.php
$subject = "Nuevo contacto LAURA: $firstName - $service_name";

// Email HTML
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E11D48; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #666; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nuevo Contacto desde LAURA</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nombre:</div>
                <div class='value'>$firstName</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='field'>
                <div class='label'>Empresa:</div>
                <div class='value'>$company</div>
            </div>
            <div class='field'>
                <div class='label'>Servicio de interés:</div>
                <div class='value'>$service_name</div>
            </div>
            <div class='field'>
                <div class='label'>Presupuesto:</div>
                <div class='value'>$budget</div>
            </div>
            <div class='field'>
                <div class='label'>Mensaje:</div>
                <div class='value'>$message</div>
            </div>
            <div class='field'>
                <div class='label'>Fecha y hora:</div>
                <div class='value'>$timestamp</div>
            </div>
        </div>
        <div class='footer'>
            Este mensaje fue enviado desde el formulario de contacto de laura.lat
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . SENDER_EMAIL,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

// Enviar email
$mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Guardar en base de datos si está configurada
    if (defined('DB_ENABLED') && DB_ENABLED) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS
            );
            
            $stmt = $pdo->prepare("
                INSERT INTO contacts (name, email, company, service, budget, message, created_at)
                VALUES (:name, :email, :company, :service, :budget, :message, NOW())
            ");
            
            $stmt->execute([
                ':name' => $firstName,
                ':email' => $email,
                ':company' => $company,
                ':service' => $service,
                ':budget' => $budget,
                ':message' => $message
            ]);
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
        }
    }
    
    // Enviar notificación a Slack si está configurado
    if (defined('SLACK_WEBHOOK') && SLACK_WEBHOOK) {
        $slack_message = [
            'text' => "🎉 Nuevo contacto desde LAURA",
            'attachments' => [[
                'color' => '#E11D48',
                'fields' => [
                    ['title' => 'Nombre', 'value' => $firstName, 'short' => true],
                    ['title' => 'Email', 'value' => $email, 'short' => true],
                    ['title' => 'Empresa', 'value' => $company, 'short' => true],
                    ['title' => 'Servicio', 'value' => $service_name, 'short' => true],
                    ['title' => 'Presupuesto', 'value' => $budget, 'short' => true],
                    ['title' => 'Mensaje', 'value' => $message, 'short' => false]
                ]
            ]]
        ];
        
        $ch = curl_init(SLACK_WEBHOOK);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($slack_message));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente. Te contactaremos pronto.'
    ]);
} else {
    // Error al enviar
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
    ]);
}
?>