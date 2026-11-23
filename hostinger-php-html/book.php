<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php#booking');
    exit;
}

$full_name = trim((string)($_POST['fullName'] ?? ''));
$mobile_number = trim((string)($_POST['mobileNumber'] ?? ''));
$guest_mode = trim((string)($_POST['guestMode'] ?? 'Solo Session'));
$preferred_service = trim((string)($_POST['preferredService'] ?? 'Swedish Massage'));
$preferred_date = trim((string)($_POST['preferredDate'] ?? date('Y-m-d')));
$preferred_time_24 = trim((string)($_POST['preferredTime'] ?? '16:00'));
$custom_time_note = trim((string)($_POST['customTimeNote'] ?? ''));
$apply_offer = isset($_POST['applyWelcomeOffer']) && $_POST['applyWelcomeOffer'] === '1';
$additional_message = trim((string)($_POST['additionalMessage'] ?? ''));

$digits = preg_replace('/\D+/', '', $mobile_number);
if (mb_strlen($full_name) < 2 || strlen($digits) < 10) {
    header('Location: index.php?booking_error=1#booking');
    exit;
}

$display_time = $custom_time_note !== '' ? $custom_time_note : date('g:i A', strtotime($preferred_time_24 ?: '16:00'));

$lines = [
    "Namaste {$spa_config['brand_name']} ({$spa_config['area']}),",
    "I would like to book an appointment:",
    "",
    "• Full Name: {$full_name}",
    "• Mobile Number: {$mobile_number}",
    "• Session Type: {$guest_mode}",
    "• Preferred Service: {$preferred_service}",
    "• Preferred Date: {$preferred_date}",
    "• Guest Preferred Time: {$display_time}",
    $apply_offer
        ? "• Privilege Offer: {$welcome_offer['offer_code']} (Website Welcome Offer)"
        : "• Privilege Offer: Standard Booking",
    $additional_message !== ''
        ? "• Additional Message: {$additional_message}"
        : "• Additional Message: None",
    "",
    "Please confirm slot availability on WhatsApp. Dhanyavaad!"
];

$whatsapp_url = build_whatsapp_url(implode("\n", $lines), $spa_config);
header('Location: ' . $whatsapp_url);
exit;
