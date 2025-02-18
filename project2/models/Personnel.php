<?php 
 require_once '/Applications/XAMPP/xamppfiles/htdocs/nanaAsare/project2/config/Database.php';
$database = new Database();
$db = $database->getConnection();

class Personnel{
    private $conn;
    private $personnelTable = 'personnel';
    private $departmentTable = 'department';
    private $locationTable = 'location';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createPersonnel($data) {
        $query = "INSERT INTO " . $this->table . " 
                 SET firstName = :firstName, 
                     lastName = :lastName,
                     jobTitle = :jobTitle,
                     email = :email,
                     departmentID = :departmentID";
        
        $stmt = $this->conn->prepare($query);
        // Bind data and execute
        $stmt->bindParam(':firstName', $data['firstName']);
        $stmt->bindParam(':lastName', $data['lastName']);
        $stmt->bindParam(':jobTitle', $data['jobTitle']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':departmentID', $data['departmentID']);
        //execute the query
        return $stmt->execute();
    }


    public function updatePersonnel($data) {
        try {
            $query = "UPDATE " . $this->personnelTable . "
                     SET firstName = :firstName,
                         lastName = :lastName,
                         jobTitle = :jobTitle,
                         email = :email,
                         departmentID = :departmentID
                     WHERE id = :id";
                     
            $stmt = $this->conn->prepare($query);
            
            // Validate that required data exists
            if (!isset($data['id']) || !isset($data['firstName']) || !isset($data['lastName']) || 
                !isset($data['jobTitle']) || !isset($data['email']) || !isset($data['departmentID'])) {
                throw new Exception("Missing required fields");
            }
            
            $stmt->bindParam(':firstName', $data['firstName']);
            $stmt->bindParam(':lastName', $data['lastName']);
            $stmt->bindParam(':jobTitle', $data['jobTitle']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':departmentID', $data['departmentID']);
            $stmt->bindParam(':id', $data['id']);
            
            $result = $stmt->execute();
            
            // Check if any rows were actually updated
            if ($stmt->rowCount() === 0) {
                return false; // No rows were updated
            }
            
            return true; // Update successful
            
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error updating personnel: " . $e->getMessage());
            return false;
        }
    }

    public function deletePersonnelByID($id){
        $query = "DELETE FROM " . $this->personnelTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }


    public function readDepartment(){
        $query = "SELECT * FROM " . $this->departmentTable;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function readPersonnel() {
        $query = "SELECT * FROM " . $this->personnelTable;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function readPersonnelByID($id){
        $query = "SELECT * FROM " . $this->personnelTable . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        // fetch single second  
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>