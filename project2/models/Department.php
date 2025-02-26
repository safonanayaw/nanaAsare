<?php 
 require_once '../config/Database.php';
$database = new Database();
$db = $database->getConnection();

class Department{
    private $conn;
    private $personnelTable = 'personnel';
    private $departmentTable = 'department';
    private $locationTable = 'location';

    public function __construct($db) {
        $this->conn = $db;
    }



//  department db query functions***********************************
    public function createDepartment($data) {
        try{
            $query = "INSERT INTO " . $this->departmentTable . " 
            SET name = :name, 
                locationID = :locationID";

            $stmt = $this->conn->prepare($query);
            // Bind data and execute
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':locationID', $data['locationID']);
            //execute the query
            $stmt->execute();
            //check if anyrow was added
            if($stmt->rowCount() === 0){
                return false;//no row was affected
            }
            return true;
        }catch(Exception $e){
            //log the error and return false
            error_log("Falied to add department to database:" . $e->getMessage());
            return false;
        }

    }



    public function readDepartment(){
        $query = "SELECT " . $this->departmentTable . ".*, " . $this->locationTable . ".name AS departmentLocation 
        FROM " . $this->departmentTable . " 
        JOIN " . $this->locationTable . " 
        ON " . $this->departmentTable . ".locationID = " . $this->locationTable . ".id ORDER BY " . $this->departmentTable . ".id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function readDepartmentByID($id){
        $query = "SELECT * FROM " . $this->departmentTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        // fetch single row from db
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    public function updateDepartment($data) {
        try {
            $query = "UPDATE " . $this->departmentTable . " 
                     SET name = :name,
                    locationID = :locationID
                     WHERE id = :id";
                     
            $stmt = $this->conn->prepare($query);
            
            // Validate that required data exists
            if (!isset($data['id']) || !isset($data['name']) || !isset($data['locationID'])) {
                throw new Exception("Missing required fields");
            }
            
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':locationID', $data['locationID']);
            $stmt->bindParam(':id', $data['id']);
            $result = $stmt->execute();
            
            // Check if any rows were actually updated
            if ($stmt->rowCount() === 0) {
                return false; // No rows were updated
            }
            
            return true; // Update successful
            
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error updating department: " . $e->getMessage());
            return false;
        }
    }

    public function deleteDepartmentByID($id){
        try{
            //check if department is reference by any personnel
            $query = "SELECT COUNT(*) as count FROM " . $this->personnelTable . " WHERE departmentID = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if($result['count'] > 0){
                return false;
            }

            $query = "DELETE FROM " . $this->departmentTable . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
            
        }catch(Exception $e){
            error_log("Error deleting department", $e->getMessage());
            return false;
        }

    }


    public function searchDepartment($searchValue) {
        if ($searchValue) {

            $query = "SELECT " . $this->departmentTable . ".*, " .
            $this->locationTable . ".name AS departmentLocation 
            FROM " . $this->departmentTable . " 
            JOIN " . $this->locationTable . " 
            ON " . $this->departmentTable . ".locationID = " . $this->locationTable . ".id 
            WHERE " . $this->departmentTable . ".name LIKE :searchValue 
            OR " . $this->locationTable . ".name LIKE :searchValue ORDER BY " . $this->departmentTable . ".id ASC";
            
            $stmt = $this->conn->prepare($query);
            $searchTerm = '%' . $searchValue . '%';
            $stmt->bindParam(':searchValue', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

//  department db query functions***********************************

}

?>