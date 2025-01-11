<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Test file writing permissions
$testFile = 'test_permissions.txt';
try {
    file_put_contents($testFile, 'Test write');
    unlink($testFile); // Delete the test file
    $writeable = true;
} catch (Exception $e) {
    $writeable = false;
    echo json_encode(['success' => false, 'message' => 'Server error: Directory not writable']);
    exit;
}

$subscribers = [];
$subscribersFile = 'subscribers.json';

// Load existing subscribers
if (file_exists($subscribersFile)) {
    $subscribers = json_decode(file_get_contents($subscribersFile), true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    
    if ($email) {
        if (!in_array($email, $subscribers)) {
            $subscribers[] = $email;
            file_put_contents($subscribersFile, json_encode($subscribers));
            echo json_encode(['success' => true, 'count' => count($subscribers)]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Already subscribed']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['count' => count($subscribers)]);
}
?> 