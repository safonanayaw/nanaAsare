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
                            echo json_encode(["success" => true, "message" => "Employee entry deleted"]);
                        } else {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["success" => false,"message" => "Failed to delete employee"]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "ID parameter is required"]);
                    }
                    break;  

                    case 'checkDepartmentDeleteID':
                        if (isset($_GET['id'])) {
                            $id = $_GET['id'];
                            $result = $departmentModel->checkDepartmentDeleteID($id);
                            if ($result) {
                                echo json_encode(["success" => true, "message" => $result['result']]);
                            } else {
                                http_response_code(500); // Internal Server Error
                                echo json_encode(["success" => false, "message" => "Error fetching department data"]);
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
                            echo json_encode(["success" => true, "message" => "Department deleted"]);
                        } else  {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["success" => false, "message" => "Failed to delete department"]);
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

                case 'checkLocationDeleteID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $locationModel->checkLocationDeleteID($id);
                        if ($result) {
                            echo json_encode(["success" => true, "message" => $result['result']]);
                        } else {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["success" => false, "message" => "Error fetching department data"]);
                        }
                    } else {
                        http_response_code(400); // Bad Request
                        echo json_encode(["message" => "ID parameter is required"]);
                    }
                    break;

                case 'deleteLocationByID':
                    if (isset($_GET['id'])) {
                        $id = $_GET['id'];
                        $result = $locationModel->deleteLocationByID($id);
                        if ($result) {
                            echo json_encode(["success" => true, "message" => "Location deleted "]);
                        } else {
                            http_response_code(500); // Internal Server Error
                            echo json_encode(["success" => false, "message" => "Failed to delete location"]);
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
                    echo json_encode(["success" => true, "message" => "Employee entry added"]);   
                    }else{
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to add employee entry"]);
                    }
                    break;

                case 'createDepartment':
                    $result = $departmentModel->createDepartment($jsonData);
                    if($result){
                    echo json_encode(["success" => true, "message" => "Department entry added"]);   
                    }else{
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to add department entry"]);
                    }
                    break;

                case 'createLocation':
                    $result = $locationModel->createLocation($jsonData);
                    if($result){
                    echo json_encode(["success" => true, "message" => "Location entry added"]);   
                    }else{
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to add location entry"]);
                    }
                    break;

                case 'updatePersonnel':
                    $result = $personnelModel->updatePersonnel($jsonData);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "Employee entry updated"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to update employee, no changes made check entries again"]);
                    }
                    break;

                case 'updateDepartment':
                    $result = $departmentModel->updateDepartment($jsonData);
                    if ($result) {
                        echo json_encode(["success" => true, "message" => "Department updated "]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["success" => false, "message" => "Failed to update department, no changes made check entry again"]);
                    }
                    break;

            case 'updateLocation':
                $result = $locationModel->updateLocation($jsonData);
                if ($result) {
                    echo json_encode(["success" => true, "message" => "Location updated "]);
                } else {
                    http_response_code(500);
                    echo json_encode(["success" => false, "message" => "Failed to update location, no changes made check entry again"]);
                }
                break;

                case 'filterPersonnel':
                    if (isset($jsonData['departmentIDs']) || isset($jsonData['locationIDs'])) {
                        $departmentIDs = isset($jsonData['departmentIDs']) ? $jsonData['departmentIDs'] : [];
                        $locationIDs = isset($jsonData['locationIDs']) ? $jsonData['locationIDs'] : [];
                
                        // Convert to integers and ensure only one selection is used
                        $sanitizeDeptIDs = !empty($departmentIDs) ? [(int)$departmentIDs[0]] : [];
                        $sanitizeLocIDs = !empty($locationIDs) ? [(int)$locationIDs[0]] : [];
                
                        try {
                            $result = $personnelModel->searchPersonnelByFilters($sanitizeDeptIDs, $sanitizeLocIDs);
                            echo json_encode($result ?: ["success" => false, "message" => "No results found"]);
                        } catch (Exception $e) {
                            http_response_code(500);
                            echo json_encode(["message" => "Error occurred", "error" => $e->getMessage()]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Search parameter is required"]);
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