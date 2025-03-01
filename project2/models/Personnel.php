<?php 
 require_once '../config/Database.php';
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

//personnel database queries functions ends here *****************

    public function createPersonnel($data) {
        try{
            $query = "INSERT INTO " . $this->personnelTable . " 
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
            $stmt->execute();
            //check if anyrow was added
            if($stmt->rowCount() === 0){
                return false;//no row was affected
            }
            return true;
        }catch(Exception $e){
            //log the error and return false
            error_log("Falied to add personnel to database:" . $e->getMessage());
            return false;
        }

    }

    public function readPersonnel() {
        $query = "SELECT " 
        . $this->personnelTable . ".id, "
        . $this->personnelTable . ".firstName, "
        . $this->personnelTable . ".lastName, "
        . $this->personnelTable . ".jobTitle, "
        . $this->personnelTable . ".email, "
        . $this->personnelTable . ".departmentID, "
        . $this->departmentTable . ".name AS departmentName, "
        . $this->locationTable . ".name AS locationName 
        FROM " . $this->personnelTable . " 
        JOIN " . $this->departmentTable . " 
        ON " . $this->personnelTable . ".departmentID = " . $this->departmentTable . ".id 
        JOIN " . $this->locationTable . "
        ON " . $this->departmentTable . ".locationID = " . $this->locationTable . ".id
        ORDER BY " . $this->personnelTable . ".lastName ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } 

    public function readPersonnelByID($id){
        $query = "SELECT " 
        . $this->personnelTable . ".id, "
        . $this->personnelTable . ".firstName, "
        . $this->personnelTable . ".lastName, "
        . $this->personnelTable . ".jobTitle, "
        . $this->personnelTable . ".email, "
        . $this->personnelTable . ".departmentID 
        FROM " . $this->personnelTable . " 
        WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        // fetch single second  
        return $stmt->fetch(PDO::FETCH_ASSOC);
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


    public function searchPersonnel($searchValue) {
        if ($searchValue) {

        $query = "SELECT " 
        . $this->personnelTable . ".id, "
        . $this->personnelTable . ".firstName, "
        . $this->personnelTable . ".lastName, "
        . $this->personnelTable . ".jobTitle, "
        . $this->personnelTable . ".email, "
        . $this->personnelTable . ".departmentID, "
        . $this->departmentTable . ".name AS departmentName, "
        . $this->locationTable . ".name AS locationName 
        FROM " . $this->personnelTable . " 
        JOIN " . $this->departmentTable . " 
        ON " . $this->personnelTable . ".departmentID = " . $this->departmentTable . ".id 
        JOIN " . $this->locationTable . "
        ON " . $this->departmentTable . ".locationID = " . $this->locationTable . ".id 
        WHERE " . $this->personnelTable . ".firstName LIKE :searchValue 
        OR " . $this->personnelTable . ".lastName LIKE :searchValue 
        OR " . $this->personnelTable . ".jobTitle LIKE :searchValue 
        OR " . $this->personnelTable . ".email LIKE :searchValue 
        OR " . $this->departmentTable . ".name LIKE :searchValue
        OR " . $this->locationTable . ".name LIKE :searchValue 
        ORDER BY " . $this->personnelTable . ".lastName ASC";
            
            $stmt = $this->conn->prepare($query);
            $searchTerm = '%' . $searchValue . '%';
            $stmt->bindParam(':searchValue', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }


        public function searchPersonnelByFilters($departmentIDs, $locationIDs){
            $conditions = [];
            $params = [];
        
            if (!empty($departmentIDs)) {
                $placeholders = implode(',', array_fill(0, count($departmentIDs), '?'));
                $conditions[] = $this->personnelTable . ".departmentID IN ($placeholders)";
                $params = array_merge($params, $departmentIDs);
            }
        
            if (!empty($locationIDs)) {
                $placeholders = implode(',', array_fill(0, count($locationIDs), '?'));
                $conditions[] = $this->departmentTable . ".locationID IN ($placeholders)";
                $params = array_merge($params, $locationIDs);
            }
        
            $whereClause = !empty($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";
        
            $query = "SELECT " 
                . $this->personnelTable . ".id, "
                . $this->personnelTable . ".firstName, "
                . $this->personnelTable . ".lastName, "
                . $this->personnelTable . ".jobTitle, "
                . $this->personnelTable . ".email, "
                . $this->personnelTable . ".departmentID, "
                . $this->departmentTable . ".name AS departmentName, "
                . $this->departmentTable . ".locationID, "
                . $this->locationTable . ".name AS locationName 
                FROM " . $this->personnelTable . " 
                JOIN " . $this->departmentTable . " 
                ON " . $this->personnelTable . ".departmentID = " . $this->departmentTable . ".id 
                JOIN " . $this->locationTable . " 
                ON " . $this->departmentTable . ".locationID = " . $this->locationTable . ".id 
                $whereClause 
                ORDER BY " . $this->personnelTable . ".lastName ASC";
        
            $stmt = $this->conn->prepare($query);
        
            foreach ($params as $key => $value) {
                $stmt->bindValue($key + 1, $value, PDO::PARAM_INT);
            }
        
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
//personnel database queries functions ends here ********************



}

?>