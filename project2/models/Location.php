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
            $query = "SELECT " . $this->locationTable . ".id, " . $this->locationTable . ".name 
          FROM " . $this->locationTable . " 
          ORDER BY " . $this->locationTable . ".name ASC";
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
        $query = "SELECT " . $this->locationTable . ".id, " . $this->locationTable . ".name 
          FROM " . $this->locationTable . " 
          WHERE id = :id";
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


public function checkLocationDeleteID($id){
    try{
        // Check and count if department is referenced by any personnel 
        $query = "SELECT l.name as locationName, COUNT(d.id) as count 
                    FROM " . $this->locationTable . " l 
                    LEFT JOIN " . $this->departmentTable . " d ON l.id = d.locationID 
                    WHERE l.id = :id 
                    GROUP BY l.name";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return ['result' => $result];

    } catch(Exception $e){
        error_log("Error fetching department data: " . $e->getMessage());
        return false;
    }
}

public function deleteLocationByID($id){
    try {
        // Proceed to delete the location
        $query = "DELETE FROM " . $this->locationTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (Exception $e) {
        // Log the exception
        error_log("Error deleting location: ", $e->getMessage());
        return false;
    }
}


public function searchLocation($searchValue) {
    if ($searchValue) {

        $query = "SELECT " . $this->locationTable . ".id, " . $this->locationTable . ".name 
          FROM " . $this->locationTable . " 
          WHERE " . $this->locationTable . ".name LIKE :searchValue 
          ORDER BY " . $this->locationTable . ".name ASC";
        
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