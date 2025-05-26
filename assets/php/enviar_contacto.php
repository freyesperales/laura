<?php
// enviar_contacto.php

// --- INICIO DE LA MODIFICACIÓN IMPORTANTE PARA SEGURIDAD ---
// Incluir el archivo de configuración seguro
// Ajusta la ruta absoluta a donde hayas colocado config_secure.php
// Esta ruta es un EJEMPLO, necesitas saber la ruta correcta en tu servidor FastComet
$configFile = '/home/tu_usuario_fastcomet/config/config_secure.php'; // ¡AJUSTA ESTA RUTA!

if (file_exists($configFile)) {
    require $configFile;
} else {
    error_log("Error Crítico: No se pudo encontrar el archivo de configuración segura: " . $configFile);
    http_response_code(500); // Internal Server Error
    // Considerar una respuesta JSON si es seguro que no ha habido output previo
    // header('Content-Type: application/json'); // Solo si no se ha enviado antes
    // echo json_encode(['success' => false, 'message' => 'Error interno del servidor (config).']);
    exit('Error interno del servidor. Contacte al administrador.');
}
// --- FIN DE LA MODIFICACIÓN IMPORTANTE PARA SEGURIDAD ---

// Incluir la librería PHPMailer
require 'PHPMailer/src/Exception.php'; // Asegúrate que la ruta a PHPMailer sea correcta
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Las variables de configuración ya no se definen aquí directamente.
// Se usan las constantes definidas en config_secure.php

header('Content-Type: application/json');

// 1. Validar el método de la petición (igual que antes)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

// 2. Leer y decodificar el cuerpo JSON de la petición (igual que antes)
$jsonPayload = file_get_contents('php://input');
$data = json_decode($jsonPayload, true);

if (json_last_error() !== JSON_ERROR_NONE || !$data) {
    echo json_encode(['success' => false, 'message' => 'Error en los datos recibidos (JSON inválido).']);
    exit;
}

// --- INICIO VERIFICACIÓN RECAPTCHA (USANDO CONSTANTE) ---
if (!isset($data['g-recaptcha-response'])) {
    echo json_encode(['success' => false, 'message' => 'Falta el token de reCAPTCHA.']);
    exit;
}
$recaptchaToken = $data['g-recaptcha-response'];

$recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
$recaptchaData = [
    'secret'   => RECAPTCHA_SECRET_KEY, // Usando la constante desde config_secure.php
    'response' => $recaptchaToken,
    'remoteip' => $_SERVER['REMOTE_ADDR']
];
// ...  lógica de reCAPTCHA ...
$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($recaptchaData),
    ],
];
$context  = stream_context_create($options);
$recaptchaResultJson = file_get_contents($recaptchaUrl, false, $context);

if ($recaptchaResultJson === FALSE) {
    error_log('reCAPTCHA verification request failed.');
    echo json_encode(['success' => false, 'message' => 'No se pudo verificar el reCAPTCHA. Inténtalo más tarde.']);
    exit;
}
$recaptchaResult = json_decode($recaptchaResultJson);

if (!$recaptchaResult->success || $recaptchaResult->score < 0.5 || $recaptchaResult->action !== 'contact_form_submit') {
    $logMessage = 'reCAPTCHA verification failed. Success: ' . ($recaptchaResult->success ? 'true' : 'false');
    if (isset($recaptchaResult->score)) $logMessage .= ', Score: ' . $recaptchaResult->score;
    if (isset($recaptchaResult->action)) $logMessage .= ', Action: ' . $recaptchaResult->action;
    if (isset($recaptchaResult->{'error-codes'})) $logMessage .= ', Error Codes: ' . json_encode($recaptchaResult->{'error-codes'});
    error_log($logMessage);
    echo json_encode(['success' => false, 'message' => 'Verificación anti-bot fallida.']);
    exit;
}
// --- FIN VERIFICACIÓN RECAPTCHA ---


// 3. Definir campos esperados y sus reglas de validación (igual que antes)
$expectedFields = [
    // ... (tu definición de $expectedFields) ...
    'firstName' => ['required' => true, 'maxLength' => 100],
    'email'     => ['required' => true, 'isEmail' => true, 'maxLength' => 254],
    'company'   => ['required' => false, 'maxLength' => 150],
    'service'   => ['required' => true, 'allowedValues' => ['web', 'security', 'marketing', 'consulting', 'all']],
    'message'   => ['required' => true, 'maxLength' => 5000],
    'budget'    => ['required' => false, 'allowedValues' => ['20-50uf', '50-100uf', '100-200uf', '200uf+','']]
];
// ... (resto de la validación de campos, igual que antes, $validatedData, $errors) ...
unset($data['g-recaptcha-response']); // Importante: quitar el token antes de validar campos del formulario
// ... (bucle foreach para validar campos) ...
$validatedData = [];
$errors = [];

foreach ($expectedFields as $fieldKey => $rules) {
    $value = isset($data[$fieldKey]) ? trim($data[$fieldKey]) : '';
    $sanitizedValue = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

    if ($rules['required'] && empty($sanitizedValue)) {
        $errors[$fieldKey] = ucfirst($fieldKey) . " es obligatorio.";
        continue;
    }
    if (!empty($sanitizedValue) && isset($rules['maxLength']) && mb_strlen($sanitizedValue, 'UTF-8') > $rules['maxLength']) {
        $errors[$fieldKey] = ucfirst($fieldKey) . " excede la longitud máxima de " . $rules['maxLength'] . " caracteres.";
    }
    if (isset($rules['isEmail']) && $rules['isEmail'] && !empty($sanitizedValue)) {
        if (!filter_var($sanitizedValue, FILTER_VALIDATE_EMAIL)) {
            $errors[$fieldKey] = "El formato de " . ucfirst($fieldKey) . " no es válido.";
        }
    }
    if (isset($rules['allowedValues']) && !empty($sanitizedValue)) {
        if (!in_array($sanitizedValue, $rules['allowedValues'])) {
            $errors[$fieldKey] = "El valor para " . ucfirst($fieldKey) . " no es válido.";
        }
    }
    $validatedData[$fieldKey] = $sanitizedValue;
}

if (!empty($errors)) {
    $firstErrorField = key($errors);
    $firstErrorMessage = $errors[$firstErrorField];
    echo json_encode(['success' => false, 'message' => "Error de validación: " . $firstErrorMessage, 'errors' => $errors]);
    exit;
}


// Mapeo de valores (igual que antes)
// ...
$serviceLabels = [ /*...*/ ]; $budgetLabels = [ /*...*/ ]; // (los mismos que antes)
$serviceDisplay = $serviceLabels[$validatedData['service']] ?? $validatedData['service'];
$budgetDisplay = $budgetLabels[$validatedData['budget']] ?? $validatedData['budget'];


// 4. Construir el cuerpo del email (igual que antes, usando $validatedData)
// ...
$asuntoEmail = "Nuevo Contacto Web (reCAPTCHA OK): " . $validatedData['firstName'] . ($validatedData['company'] ? " de " . $validatedData['company'] : "");
$cuerpoEmail = "Has recibido un nuevo mensaje de contacto (Verificado por reCAPTCHA v3):\n\n";
// ... (resto del cuerpo del email)


// 5. Enviar el correo usando PHPMailer (usando las CONSTANTES)
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP de Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = REMITENTE_EMAIL;         // Usando la constante
    $mail->Password = GMAIL_APP_PASSWORD;      // Usando la constante
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';

    // Remitente y Destinatario(s)
    $mail->setFrom(REMITENTE_EMAIL, REMITENTE_NOMBRE); // Usando constantes
    $mail->addAddress(DESTINATARIO_EMAIL, DESTINATARIO_NOMBRE); // Usando constantes
    $mail->addReplyTo($validatedData['email'], $validatedData['firstName']);

    // Contenido del email (igual que antes)
    $mail->isHTML(false);
    $mail->Subject = $asuntoEmail;
    $mail->Body    = $cuerpoEmail;

    $mail->send();
    echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.']);

} catch (Exception $e) {
    error_log("PHPMailer Error: {$mail->ErrorInfo} | User Data: " . json_encode($validatedData));
    echo json_encode(['success' => false, 'message' => 'El mensaje no pudo ser enviado. Por favor, inténtalo más tarde.']);
}
?>