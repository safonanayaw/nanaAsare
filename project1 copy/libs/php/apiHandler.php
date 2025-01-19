<?php
header("Content-Type: application/json");

if (isset($_GET['type'])) {
    
    $type = $_GET['type'];
        
    $apiKeyMap = [
        "opencage" => "e10b66b2bbf245bc81bf941871795c37",
        "openweather" => "044a55e0a3c4e7ee441f497bd3b09967",
        "geonames"=>"safoasare"
    ];
   
    switch ($type) {
        case "countryInfo":
            $countryCode = $_GET['countryCode'];
            $url = "https://restcountries.com/v3.1/alpha/$countryCode";
            break;

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

            case "wikipedia";
            $lat = $_GET['lat'];
            $lng = $_GET['lng'];
            $apiKey = $apiKeyMap["geonames"];
            $url = "http://api.geonames.org/findNearbyWikipediaJSON?lat=$lat&lng=$lng&username=$apiKey";
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
