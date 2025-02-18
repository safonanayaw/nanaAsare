<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("../Personnel.php");

//initialize the database connection
$database = new Database();
$db = $database->getConnection();

//Initialze the personnel object
$personnel = new Personnel($db);

//create a new personnel record
$data = [
    'firstName' => 'John',
    'lastName' => 'Doe',
    'jobTitle' => 'Developer',
    'email' => 'nanayaw@gmail.com',
    'departmentID' => 1
];

if($personnel->createPersonnel($data)){
    echo "Personnel created successful";
}else{
    echo "Failed to create personnel";
}

$employees = $personnel->readPersonnel();
foreach($employees as $emp){
    echo "ID: " . $emp['id'] . "<br>";
    echo "First Name: " . $emp['firstName'] . "<br>";
    echo "Last Name: " . $emp['lastName'] . "<br>";
    echo "Job Title: " . $emp['jobTitle'] . "<br>";
    echo "Email: " . $emp['email'] . "<br>";
    echo "Department ID: " . $emp['departmentID'] . "<br><br>";
}
?>