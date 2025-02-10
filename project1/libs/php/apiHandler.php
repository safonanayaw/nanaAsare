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
        "newsdata" => "pub_6883601c7742417dfcec9e9cd37b3065eb2e8",
    ];
   
    switch ($type) {
        case "weatherInfo":
            $lat = $_GET['lat'];
            $lng = $_GET['lng'];
            $apiKey = $apiKeyMap["weatherApi"];
            $url = "http://api.weatherapi.com/v1/forecast.json?key=$apiKey&q=$lat,$lng&days=3&aqi=no&alerts=no";
            break;

        case "newsData";
            $countryCode = $_GET['countryCode'];
            $apiKey = $apiKeyMap["newsdata"];
            $url = "https://newsdata.io/api/1/latest?apikey=$apiKey&domain=bbc&country=$countryCode";
            break;

        case "geocode";
            $query = $_GET['query'];
            $apiKey = $apiKeyMap["opencage"];
            $url = "https://api.opencagedata.com/geocode/v1/json?q=$query&key=$apiKey";
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

            case "airport";
            $countryCode = $_GET['countryCode'];
            $apiKey = $apiKeyMap["geonames"]; 
            $url = "http://api.geonames.org/searchJSON?q=airport&maxRows=10&country=$countryCode&username=$apiKey";
            break;

            case "hotel";
            $countryCode = $_GET['countryCode'];
            $apiKey = $apiKeyMap["geonames"];
            $url = "http://api.geonames.org/searchJSON?q=hotel&maxRows=10&country=$countryCode&username=$apiKey";
            break;

            case "city";
            $countryCode = $_GET['countryCode'];
            $apiKey = $apiKeyMap["geonames"];
            $url = "http://api.geonames.org/searchJSON?q=city&maxRows=10&country=$countryCode&username=$apiKey";
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