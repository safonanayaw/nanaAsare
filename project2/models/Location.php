<?php 
 require_once '../config/Database.php';
$database = new Database();
$db = $database->getConnection();

class Location{
    private $conn;
    private $personnelTable = 'personnel';
    private $departmentTable = 'department';
    private $locationTable = 'location';

    public function __construct($db) {
        $this->conn = $db;
    }

//Location database queries functions ends here *****************

    public function createLocation($data) {
        try{
            $query = "INSERT INTO " . $this->locationTable . " 
            SET name = :name";
   
            $stmt = $this->conn->prepare($query);
            // Bind data and execute
            $stmt->bindParam(':name', $data['name']);
            //execute the query
            $stmt->execute();
            //check if anyrow was added
            if($stmt->rowCount() === 0){
                return false;//no row was affected
            }
            return true;
        }catch(Exception $e){
            //log the error and return false
            error_log("Falied to add Location to database:" . $e->getMessage());
            return false;
        }

    }

    public function readLocation() {
        try {
            $query = "SELECT * FROM " . $this->locationTable;
            $stmt = $this->conn->prepare($query);
    
            // Execute the query and check for errors
            if ($stmt->execute()) {
                // Fetch all records
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if ($results) {
                    return $results;
                } else {
                    // Log if no results found
                    error_log("No locations found in table: " . $this->locationTable);
                    return [];
                }
            } else {
                // Log query error
                $errorInfo = $stmt->errorInfo();
                error_log("Query error: " . $errorInfo[2]);
                return false;
            }
        } catch (Exception $e) {
            // Log exception
            error_log("Exception occurred: " . $e->getMessage());
            return false;
        }
    }

    public function readLocationByID($id){
        $query = "SELECT * FROM " . $this->locationTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        // fetch single second  
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }



    public function updateLocation($data) {
        try {
            $query = "UPDATE " . $this->locationTable . "
                     SET name = :name
                     WHERE id = :id";
                     
            $stmt = $this->conn->prepare($query);
            
            // Validate that required data exists
            if (!isset($data['id']) || !isset($data['name'])) {
                throw new Exception("Missing required fields");
            }
            
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':id', $data['id']);
            
            $result = $stmt->execute();
            
            // Check if any rows were actually updated
            if ($stmt->rowCount() === 0) {
                return false; // No rows were updated
            }
            
            return true; // Update successful
            
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error updating location: " . $e->getMessage());
            return false;
        }
    }

    public function deleteLocationByID($id){
        $query = "DELETE FROM " . $this->locationTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }


    public function searchLocation($searchValue) {
        if ($searchValue) {

            $query = "SELECT * FROM " . $this->locationTable . " WHERE name LIKE :searchValue";
            
            $stmt = $this->conn->prepare($query);
            $searchTerm = '%' . $searchValue . '%';
            $stmt->bindParam(':searchValue', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }
//location database queries functions ends here ********************



}

?>