<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Disable error display development site
error_reporting(0);
ini_set('display_errors', 0);

// Define error constants
define('ERR_MISSING_TYPE', 'Missing required parameter: type');
define('ERR_INVALID_TYPE', 'Invalid request type');
define('ERR_MISSING_PARAMS', 'Missing required parameters');
define('ERR_INVALID_COORDINATES', 'Invalid coordinates');
define('ERR_API_FAILURE', 'API request failed');
define('ERR_INVALID_COUNTRY', 'Invalid country code');
define('ERR_INVALID_CURRENCY', 'Invalid currency code');

try {
    if (!isset($_GET['type'])) {
        throw new Exception(ERR_MISSING_TYPE, 400);
    }

    $type = $_GET['type'];
    $apiKeyMap = [
        "opencage" => "e10b66b2bbf245bc81bf941871795c37",
        "openweather" => "044a55e0a3c4e7ee441f497bd3b09967",
        "geonames" => "safoasare",
        "openexchange" => "a11ea68a4ce946138a84c6a1047bd53d",
        "weatherApi" => "74067207a89c43e18ed185200253101",
        "newsdata" => "pub_6883601c7742417dfcec9e9cd37b3065eb2e8",
    ];

    $url = '';
    $requiredParams = [];

    switch ($type) {
        case "weatherInfo":
            $requiredParams = ['lat', 'lng'];
            validateCoordinates($_GET['lat'], $_GET['lng']);
            $apiKey = getApiKey($apiKeyMap, "weatherApi");
            $url = "http://api.weatherapi.com/v1/forecast.json?key=$apiKey&q={$_GET['lat']},{$_GET['lng']}&days=3&aqi=no&alerts=no";
            break;

        case "newsData":
            $requiredParams = ['countryCode'];
            validateCountryCode($_GET['countryCode']);
            $apiKey = getApiKey($apiKeyMap, "newsdata");
            $url = "https://newsdata.io/api/1/latest?apikey=$apiKey&domain=bbc&country={$_GET['countryCode']}";
            break;

        case "geocode":
            $requiredParams = ['query'];
            $apiKey = getApiKey($apiKeyMap, "opencage");
            $url = "https://api.opencagedata.com/geocode/v1/json?q=" . urlencode($_GET['query']) . "&key=$apiKey";
            break;

        case "geocodeReverse":
            $requiredParams = ['lat', 'lng'];
            validateCoordinates($_GET['lat'], $_GET['lng']);
            $apiKey = getApiKey($apiKeyMap, "opencage");
            $url = "https://api.opencagedata.com/geocode/v1/json?q={$_GET['lat']}%2C{$_GET['lng']}&key=$apiKey";
            break;

        case "exchangeRate":
            $requiredParams = ['currency'];
            validateCurrencyCode($_GET['currency']);
            $url = "https://api.exchangerate-api.com/v4/latest/{$_GET['currency']}";
            break;

        case "earthquakes":
            $requiredParams = ['north', 'south', 'east', 'west'];
            validateCoordinates($_GET['north'], $_GET['east']);
            validateCoordinates($_GET['south'], $_GET['west']);
            $apiKey = getApiKey($apiKeyMap, "geonames");
            $north = urlencode($_GET['north']);
            $south = urlencode($_GET['south']);
            $east = urlencode($_GET['east']);
            $west = urlencode($_GET['west']);
            $url = "http://api.geonames.org/earthquakesJSON?north=$north&south=$south&east=$east&west=$west&username=$apiKey";
            break;

        case "airport":
            $requiredParams = ['countryCode'];
            validateCountryCode($_GET['countryCode']);
            $apiKey = getApiKey($apiKeyMap, "geonames");
            $url = "http://api.geonames.org/searchJSON?q=airport&maxRows=10&country={$_GET['countryCode']}&username=$apiKey";
            break;

        case "hotel":
            $requiredParams = ['countryCode'];
            validateCountryCode($_GET['countryCode']);
            $apiKey = getApiKey($apiKeyMap, "geonames");
            $url = "http://api.geonames.org/searchJSON?q=hotel&maxRows=10&country={$_GET['countryCode']}&username=$apiKey";
            break;

        case "city":
            $requiredParams = ['countryCode'];
            validateCountryCode($_GET['countryCode']);
            $apiKey = getApiKey($apiKeyMap, "geonames");
            $url = "http://api.geonames.org/searchJSON?q=city&maxRows=10&country={$_GET['countryCode']}&username=$apiKey";
            break;

        default:
            throw new Exception(ERR_INVALID_TYPE, 400);
    }

    validateRequiredParams($requiredParams);
    $response = safeApiCall($url);
    echo $response;

} catch (Exception $e) {
    handleError($e->getMessage(), $e->getCode());
    exit;
}

/**
 * Validation functions
 */
function validateCoordinates($lat, $lng) {
    if (!is_numeric($lat) || !is_numeric($lng)) {
        throw new Exception(ERR_INVALID_COORDINATES, 400);
    }
}

function validateCountryCode($code) {
    if (!preg_match('/^[A-Z]{2}$/', $code)) {
        throw new Exception(ERR_INVALID_COUNTRY, 400);
    }
}

function validateCurrencyCode($code) {
    if (!preg_match('/^[A-Z]{3}$/', $code)) {
        throw new Exception(ERR_INVALID_CURRENCY, 400);
    }
}

function getApiKey($map, $service) {
    if (!isset($map[$service])) {
        error_log("Missing API key for service: $service");
        throw new Exception(ERR_API_FAILURE, 500);
    }
    return $map[$service];
}

function validateRequiredParams($params) {
    foreach ($params as $param) {
        if (!isset($_GET[$param]) || empty($_GET[$param])) {
            throw new Exception(ERR_MISSING_PARAMS . ": $param", 400);
        }
    }
}

/**
 * Safe API call handler
 */
function safeApiCall($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        $error = curl_error($ch);
        error_log("API call failed: $error - URL: $url");
        throw new Exception(ERR_API_FAILURE, 500);
    }
    
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode >= 400) {
        error_log("API returned error code: $httpCode - URL: $url");
        throw new Exception(ERR_API_FAILURE, 500);
    }
    
    curl_close($ch);
    return $response;
}

/**
 * Error handler
 */
function handleError($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message
    ]);
}