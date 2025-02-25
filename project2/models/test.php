<?php
                // case 'filterPersonnel':
                //     if (isset($_GET['departmentIDs'])) {
                //         $departmentIDs = htmlspecialchars($_GET['departmentIDs']); // Sanitize input

                //         $sanitizeIDs = array_map('intval', $departmentIDs);
 
                //         $sanitizeIDs = array_unique($sanitizeIDs);

                //         if(empty($sanitizeIDs)){
                //             echo json_encode(["success" => false, "message" => "No department filter options provided"]);
                //             exit;
                //            }

                //         try {
                //             $result = $personnelModel->searchPersonnelByDepartmentIDs($sanitizeIDs);
                //             if ($result) {
                //                 echo json_encode($result);
                //             } else {
                //                 http_response_code(404); // Not Found
                //                 echo json_encode(["success" => false, "message" => "No results found"]);
                //             }
                //         } catch (Exception $e) {
                //             http_response_code(500); // Internal Server Error
                //             echo json_encode(["message" => "An error occurred while searching", "error" => $e->getMessage()]);
                //         }
                //     } else {
                //         http_response_code(400); // Bad Request
                //         echo json_encode(["message" => "Search parameter is required"]);
                //     }
                //     break;

?>