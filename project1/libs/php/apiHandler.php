<?php
header('Content-Type: application/json; charset=utf-8');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if (isset($_GET['type'])) {
    
    $type = $_GET['type'];
        
    $apiKeyMap = [
        "opencage" => "e10b66b2bbf245bc81bf941871795c37",
        "openweather" => "044a55e0a3c4e7ee441f497bd3b09967",
        "geonames"=>"safoasare",
        "openexchange"=>"a11ea68a4ce946138a84c6a1047bd53d",
        "weatherApi" => "74067207a89c43e18ed185200253101",
    ];
   
    switch ($type) {
        case "weatherInfo":
            $lat = $_GET['lat'];
            $lng = $_GET['lng'];
            $apiKey = $apiKeyMap["weatherApi"];
            $url = "http://api.weatherapi.com/v1/forecast.json?key=$apiKey&q=$lat,$lng&days=3&aqi=no&alerts=no";
            break;

        case "geocode":
            $query = $_GET['query'];
            $apiKey = $apiKeyMap["opencage"];
            $url = "https://api.opencagedata.com/geocode/v1/json?q=$query&key=$apiKey";
            break;
            
            // case "wikipedia":
            //     $countryName = str_replace('_', ' ', $_GET['countryname']);
            //     $url = "https://en.wikipedia.org/api/rest_v1/page/summary/" . rawurlencode($countryName);
            //     $ch = curl_init();
            //     curl_setopt($ch, CURLOPT_URL, $url);
            //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            //     curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            //     curl_setopt($ch, CURLOPT_USERAGENT, 'countryExplorer/1.0');
            //     $response = curl_exec($ch);
            //     $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            //     curl_close($ch);
            
            //     // Debugging
            //     error_log("Raw Wikipedia Response: " . $response);
            //     header('Content-Type: application/json; charset=utf-8');
                
            //     if ($httpCode === 200) {
            //         // Decode and then re-encode to ensure clean JSON
            //         $decoded = json_decode($response);
            //         if (json_last_error() === JSON_ERROR_NONE) {
            //             // Direct output of the response without additional encoding
            //             echo $response;
            //         } else {
            //             // If response isn't valid JSON, send error
            //             echo json_encode([
            //                 'error' => 'Invalid Wikipedia response format',
            //                 'status' => $httpCode,
            //                 'message' => json_last_error_msg()
            //             ]);
            //         }
            //     } else {
            //         echo json_encode([
            //             'error' => 'Failed to fetch Wikipedia data',
            //             'status' => $httpCode
            //         ]);
            //     }
            //     break;

            case "geocodeReverse";
            $lat = $_GET['lat'];
            $lng = $_GET['lng'];
            $apiKey = $apiKeyMap["opencage"];
            $url = "https://api.opencagedata.com/geocode/v1/json?q=$lat%2C$lng&key=$apiKey";
            break;

            case "exchangeRate";
            $currency = $_GET['currency'];
            $url = "https://api.exchangerate-api.com/v4/latest/$currency";
            break;

            case "earthquarkes";
            $north = $_GET['north'];
            $south = $_GET['south'];
            $east = $_GET['east'];
            $west = $_GET['west'];
            $apiKey = $apiKeyMap["geonames"];
            $url = "http://api.geonames.org/earthquakesJSON?north=$north&south=$south&east=$east&west=$west&username=$apiKey";
            break;

            case "airport":
            $apiKey = $apiKeyMap["geonames"]; 
            $url = "http://api.geonames.org/searchJSON?q=airport&maxRows=1000&username=$apiKey";
            break;

        default:
            echo json_encode(["error" => "Invalid type"]);
            exit;
    }

    $response = file_get_contents($url);
    echo $response;

} else {
    echo json_encode(["error" => "No type specified"]);
}