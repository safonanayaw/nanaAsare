<?php
header("Content-Type: application/json");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if (isset($_GET['type'])) {
    
    $type = $_GET['type'];
        
    $apiKeyMap = [
        "opencage" => "e10b66b2bbf245bc81bf941871795c37",
        "openweather" => "044a55e0a3c4e7ee441f497bd3b09967",
        "geonames"=>"safoasare",
        "openexchange"=>"a11ea68a4ce946138a84c6a1047bd53d"
    ];
   
    switch ($type) {
        // case "countryInfo":
        //     $countryCode = $_GET['countryCode'];
        //     $url = "https://restcountries.com/v3.1/alpha/$countryCode";
        //     break;

        case "weather":
            $lat = $_GET['lat'];
            $lng = $_GET['lng'];
            $apiKey = $apiKeyMap["openweather"];
            $url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lng&appid=$apiKey&units=metric";
            break;

        case "geocode":
            $query = $_GET['query'];
            $apiKey = $apiKeyMap["opencage"];
            $url = "https://api.opencagedata.com/geocode/v1/json?q=$query&key=$apiKey";
            break;
            
            case "wikipedia":
            $countryName = $_GET['countryname'];
            $url = "https://en.wikipedia.org/api/rest_v1/page/summary/$countryName";
            break;

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

        default:
            echo json_encode(["error" => "Invalid type"]);
            exit;
    }

    $response = file_get_contents($url);
    echo $response;

} else {
    echo json_encode(["error" => "No type specified"]);
}