<?php
require_once '/Applications/XAMPP/xamppfiles/htdocs/nanaAsare/project2/models/Personnel.php';
require_once '/Applications/XAMPP/xamppfiles/htdocs/nanaAsare/project2/config/Database.php';


$database = new Database();
$db = $database->getConnection();
$PersonnelModel = new Personnel($db);

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    echo json_encode($PersonnelModel->readPersonnel());
}
?>