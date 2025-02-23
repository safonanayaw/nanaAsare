<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

require_once '../config/Database.php';
require_once '../models/Personnel.php';
require_once '../models/Department.php';
require_once '../models/Location.php';
header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $personnelModel = new Personnel($db);
    $departmentModel = new Department($db);
    $locationModel = new Location($db);

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
                        echo json_encode(["success" => false, "message" => "ID parameter is required"]);
                    }
                    break;

                case 'searchPersonnel':
                    if (isset($_GET['searchValue'])) {
                        $searchValue = htmlspecialchars($_GET['searchValue']); // Sanitize input
                        try {
                            $result = $personnelModel->searchPersonnel($searchValue);
                            if ($result) {
                                echo json_encode($result);
                            } else {
                                http_response_code(404); // Not Found
                                echo json_encode(["success" => false, "message" => "No results found"]);
                            }
                        } catch (Exception $e) {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["message" => "An error occurred while searching", "error" => $e->getMessage()]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "Search parameter is required"]);
                    }
                    break;

                case 'searchDepartment':
                    if (isset($_GET['searchValue'])) {
                        $searchValue = htmlspecialchars($_GET['searchValue']); // Sanitize input
                        try {
                            $result = $departmentModel->searchDepartment($searchValue);
                            if ($result) {
                                echo json_encode($result);
                            } else {
                                http_response_code(404); // Not Found
                                echo json_encode(["success" => false, "message" => "No results found"]);
                            }
                        } catch (Exception $e) {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["message" => "An error occurred while searching", "error" => $e->getMessage()]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "Search parameter is required"]);
                    }
                    break;

                case 'searchLocation':
                    if (isset($_GET['searchValue'])) {
                        $searchValue = htmlspecialchars($_GET['searchValue']); // Sanitize input
                        try {
                            $result = $locationModel->searchLocation($searchValue);
                            if ($result) {
                                echo json_encode($result);
                            } else {
                                http_response_code(404); // Not Found
                                echo json_encode(["success" => false, "message" => "No results found"]);
                            }
                        } catch (Exception $e) {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["message" => "An error occurred while searching", "error" => $e->getMessage()]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "Search parameter is required"]);
                    }
                    break;

                case 'deletePersonnelByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $personnelModel->deletePersonnelByID($id);
                        if ($result) {
                            echo json_encode(["success" => true, "message" => "Personnel deleted successfully"]);
                        } else {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["success" => false,"message" => "Failed to delete personnel"]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "ID parameter is required"]);
                    }
                    break;  

                case 'deleteDepartmentByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $departmentModel->deleteDepartmentByID($id);
                        if ($result) {
                            echo json_encode(["success" => true,"message" => "Department deleted successfully"]);
                        } else {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["success" => false,"message" => "Sorry cannot Delete this department, because is referrenced in personnel data."]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "ID parameter is required"]);
                    }
                    break; 

                case 'getDepartment':
                    $result = $departmentModel->readDepartment();
                    echo json_encode($result);
                    break;

                case 'getDepartmentByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $departmentModel->readDepartmentByID($id);
                        echo json_encode($result);
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["success" => false,"message" => "ID parameter is required"]);
                    }
                    break;

                case 'getLocation':
                    $result = $locationModel->readLocation();
                    if ($result !== false) {
                        header('Content-Type: application/json');
                        echo json_encode($result);
                    } else {
                        http_response_code(500); // Internal Server Error
                        echo json_encode(["success" => false,"message" => "Failed to fetch locations"]);
                    }
                    break;

                case 'getLocationByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $locationModel->readLocationByID($id);
                        echo json_encode($result);
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["success" => false,"message" => "ID parameter is required"]);
                    }
                    break;

                case 'deleteLocationByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $locationModel->deleteLocationByID($id);
                        if ($result) {
                            echo json_encode(["success" => true, "message" => "Location deleted successfully"]);
                        } else {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["message" => "Sorry cannot Delete this department, because is referrenced in department data."]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "ID parameter is required"]);
                    }
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
                    $result = $personnelModel->createPersonnel($jsonData);
                    if($result){
                    echo json_encode(["success" => true, "message" => "Personnel data added to database successfully"]);   
                    }else{
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to add personnel detail to database"]);
                    }
                    break;

                case 'createDepartment':
                    $result = $departmentModel->createDepartment($jsonData);
                    if($result){
                    echo json_encode(["success" => true, "message" => "Department data added to database successfully"]);   
                    }else{
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to add department detail to database"]);
                    }
                    break;

                case 'createLocation':
                    $result = $locationModel->createLocation($jsonData);
                    if($result){
                    echo json_encode(["success" => true, "message" => "Location data added to database successfully"]);   
                    }else{
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to add location detail to database"]);
                    }
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

                case 'updateDepartment':
                    $result = $departmentModel->updateDepartment($jsonData);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "department updated successfully"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to update personnel"]);
                    }
                    break;

                case 'updateLocation':
                    $result = $locationModel->updateLocation($jsonData);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "Location updated successfully"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to update location"]);
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
    // echo json_encode([
    //     "error" => $e->getMessage(),
    //     "file" => $e->getFile(),
    //     "line" => $e->getLine()
    // ]);
    exit; // Ensure no further output is sent
}