<?php
header("Content-Type: application/json");

if (isset($_GET['type'])) {
    $type = $_GET['type'];
    $apiBase = "http://api.geonames.org/";
    $username = "safoasare";

    switch ($type) {
        case "countryInfo":
            $country = $_GET['country'];
            $url = $apiBase . "countryInfoJSON?country=" . $country . "&username=" . $username;
            break;
        case "timezone":
            $lat = $_GET['lat'];
            $lng = $_GET['lng'];
            $url = $apiBase . "timezoneJSON?lat=" . $lat . "&lng=" . $lng . "&username=" . $username;
            break;
        case "earthquake":
            $north = $_GET['north'];
            $south = $_GET['south'];
            $east = $_GET['east'];
            $west = $_GET['west'];
            $url = $apiBase . "earthquakesJSON?north=" . $north . "&south=" . $south . "&east=" . $east . "&west=" . $west . "&username=" . $username;
            break;
        default:
            echo json_encode(["error" => "Invalid type"]);
            exit;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
} else {
    echo json_encode(["error" => "No type specified"]);
}
