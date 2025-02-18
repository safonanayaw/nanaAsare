<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/Database.php';
require_once '../models/Personnel.php';

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $personnelModel = new Personnel($db);

    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $jsonData = null;
    if ($requestMethod === 'POST') {
        $jsonData = json_decode(file_get_contents("php://input"), true);
        $type = isset($jsonData['type']) ? $jsonData['type'] : '';
    } elseif($requestMethod === 'GET') {
        $type = isset($_GET['type']) ? $_GET['type'] : '';
    }

    error_log("Request Method: " . $requestMethod);
    error_log("Raw Input: " . file_get_contents("php://input"));
    if ($jsonData) {
        error_log("Decoded JSON: " . print_r($jsonData, true));
    }
    error_log("Type: " . $type);

    switch ($requestMethod) {
        case 'GET':
            switch ($type) {
                case 'getAllPersonnel':
                    $result = $personnelModel->readPersonnel();
                    echo json_encode($result);
                    break;

                case 'getPersonnelByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $personnelModel->readPersonnelByID($id);
                        echo json_encode($result);
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "ID parameter is required"]);
                    }
                    break;

                    case 'deletePersonnelByID':
                        if (isset($_GET['id'])) {
                            $id = $_GET['id'];
                            $result = $personnelModel->deletePersonnelByID($id);
                            if ($result) {
                                echo json_encode(["message" => "Personnel deleted successfully"]);
                            } else {
                                http_response_code(500); // Internal Server Error
                                echo json_encode(["message" => "Failed to delete personnel"]);
                            }
                        } else {
                            http_response_code(400); // Bad Request
                            echo json_encode(["message" => "ID parameter is required"]);
                        }
                        break;  

                case 'getDepartment':
                    $result = $personnelModel->readDepartment();
                    echo json_encode($result);
                    break;

                default:
                    http_response_code(400); // Bad Request
                    echo json_encode(["message" => "Invalid type parameter"]);
                    break;
            }
            break;

        case 'POST':
            if ($jsonData === null) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
                break;
            }

            switch ($type) {
                case 'createPersonnel':
                    $query = "INSERT INTO personnel (firstName, lastName, email, departmentID) VALUES (?, ?, ?, 1)";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$jsonData['firstName'], $jsonData['lastName'], $jsonData['email']]);
                    echo json_encode(["message" => "Personnel added successfully"]);
                    break;

                case 'updatePersonnel':
                    $result = $personnelModel->updatePersonnel($jsonData);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "Personnel updated successfully"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to update personnel"]);
                    }
                    break;

                default:
                    http_response_code(400);
                    echo json_encode(["message" => "Invalid type parameter"]);
                    break;
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
    exit; // Ensure no further output is sent
}