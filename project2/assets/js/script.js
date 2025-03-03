import { updateHeadDiv, populatePersonnelTable, populateDepartmentTable, populateLocationTable, populateFilterDepartment, populateFilterLocation } from "./functions.js";

updateHeadDiv();



//fetch and populate personnel data
function populatePersonnelData(){
  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'GET',
      dataType: 'json',
      data: {type: "getAllPersonnel"},
      success: function(data) {
          populatePersonnelTable(data);
      },
      error: function(jqXHR) {
        console.error('Error: ' + jqXHR); 
      }
    });
};


//fetch and populate personnel data
function populateDepartmentData(){
    $.ajax({
      url: './../api/personnelAPI.php',
      method: 'GET',
      dataType: 'json',
      data: {type: "getDepartment"},
      success: function(data) {
        populateDepartmentTable(data);
      },
      error: function(jqXHR) {
        console.error('Error: ' + jqXHR); 
      }
    });
  }


//fetch and populate personnel data
function populateLocationData(){
  $.ajax({
    url: './../api/personnelAPI.php',
    method: 'GET',
    dataType: 'json',
    data: {type: "getLocation"},
    success: function(data) {

      populateLocationTable(data);
    },
    error: function(jqXHR, textStatus) {
      console.error('Error: ' + textStatus); // Handle any errors
    }
  });
}

// fetch personnel data and fill personnel table
populatePersonnelData();


//fetch department data and fill the department table;
populateDepartmentData();


//fetch location data and fill location table
populateLocationData();

//department data function
function fetchAllDepartment() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: './../api/personnelAPI.php',
      method: 'GET',
      data: {type: "getDepartment"},
      success: function(data) {
        resolve(data);
      },
      error: function(jqXHR, textStatus) {
        reject('Error: ' + textStatus);
      }
    });
  });
}


//location functions*****************************************
function fetchAllLocation() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: './../api/personnelAPI.php',
      method: 'GET',
      data: { type: "getLocation" },
      success: function(data) {
        resolve(data);
      },
      error: function(jqXHR, textStatus) {
        console.error('Error details:', {
          status: jqXHR.status,
          // statusText: jqXHR.statusText,
          // responseText: jqXHR.responseText,
          // textStatus: textStatus,
          // errorThrown: errorThrown
        });
        reject('Error: ' + textStatus + ', ' + errorThrown);
      }
    });
  });
}

$(document).ready(function (){

  
// refresh btn for tables start************
  $(document).on('click', '#refreshBtn', function(){
    $("#personnelBtn").click();
  });

  $(document).on('click', '#refreshBtnDepartment', function(){
    $("#departmentsBtn").click();
  });

  $(document).on('click', '#refreshBtnLocation', function(){
    $("#locationsBtn").click();
  });
  // refresh btn for tables ends************


  // show or hide search and btn container
  $("#personnelBtn").on('click', function(){
    populatePersonnelData();
    updateHeadDiv();
    $("#filterBtn").attr("disabled", false);
  });


  $("#departmentsBtn").on('click', function(){
    populateDepartmentData();
    updateHeadDiv("searchBtnDepartment", "refreshBtnDepartment", "filterBtnDepartment", "addBtnDepartment", "#addDepartmentModal");
    $("#filterBtnDepartment").attr("disabled", true);
  });
  
  
  $("#locationsBtn").on('click', function(){
    populateLocationData();
    updateHeadDiv("searchBtnLocation", "refreshBtnLocation", "filterBtnLocation", "addBtnLocation", "#addLocationModal");
    $("#filterBtnLocation").attr("disabled", true);
  });

  

  $(document).ready(function() {

    window.addEventListener('error', function(e) {
      if (e.message.includes("backdrop")) {
        e.preventDefault();
        return true;
      }
    }, true);
  });


$(document).ready(function () {
  let departmentData = [];
  let locationData = [];

  // Show filter modal and handle filter values when filter modal is closed
  $("#filterPersonnelModal").on("show.bs.modal", function () {

    var currentDepartmentSelect = $("#filterPersonnelByDepartment").val();
    var currentLocationSelect = $("#filterPersonnelByLocation").val();


    fetchAllDepartment().then(data => {
        departmentData = data;
        populateFilterDepartment(departmentData);


        $("#filterPersonnelByDepartment").val(currentDepartmentSelect);
    });

    fetchAllLocation().then(data => {
        locationData = data;
        populateFilterLocation(locationData);


        $("#filterPersonnelByLocation").val(currentLocationSelect);
    });
  });

  // Fetch and populate departments and locations
  fetchAllDepartment().then(data => {
      departmentData = data;
      populateFilterDepartment(departmentData);
  });

  fetchAllLocation().then(data => {
      locationData = data;
      populateFilterLocation(locationData);
  });

  // Function to handle filtering logic
  function fetchFilteredData() {
      const selectedDeptID = $("#filterPersonnelByDepartment").val();
      const selectedLocID = $("#filterPersonnelByLocation").val();


      // Check if both are "All"
      if (selectedDeptID === "All" && selectedLocID === "All") {

          return;
      }

      // Prepare filter data
      const filterData = JSON.stringify({
          type: "filterPersonnel",
          departmentIDs: selectedDeptID !== "All" ? [selectedDeptID] : [],
          locationIDs: selectedLocID !== "All" ? [selectedLocID] : []
      });

      // Clear table and hide modal
      $("#personnelTableBody").empty();
      // $("#filterPersonnelModal").modal("hide");


      // Send AJAX request
      $.ajax({
          url: "./../api/personnelAPI.php",
          method: "POST",
          contentType: "application/json",
          data: filterData,
          success: populatePersonnelTable,
          error: handleFilterError
      });
  }

  // Error handler for AJAX
  function handleFilterError(jqXHR) {
      try {
          const response = JSON.parse(jqXHR.responseText);
          console.log(response.message || "An error occurred.");
      } catch (e) {
        console.log("An unexpected error occurred.");
      }
  }

  // Department change handler
  $("#filterPersonnelByDepartment").off("change").on("change", function () {
      const selectedDeptID = $(this).val();
      
      if (selectedDeptID && selectedDeptID !== "All") {
          // Reset location to "All" when department is selected
          $("#filterPersonnelByLocation").val("All");
      }
      fetchFilteredData(); // Trigger filter automatically
  });

  // Location change handler
  $("#filterPersonnelByLocation").off("change").on("change", function () {
      const selectedLocID = $(this).val();
      
      if (selectedLocID && selectedLocID !== "All") {
          // Reset department to "All" when location is selected
          $("#filterPersonnelByDepartment").val("All");
      }
      fetchFilteredData(); // Trigger filter automatically
  });

  // Show modal when filter button is clicked
  $(document).on("click", "#filterBtn", function () {
      // Reset filters to "All" when modal opens
      $("#filterPersonnelByDepartment").val("All");
      $("#filterPersonnelByLocation").val("All");
      $("#filterModalPersonnel").modal("show");
  });
});
// the filter modal is not showing the correct values after a filter has already been set; fixing this should only involve adding four lines of code:

// In the filter modal show.bs.modal event, first store the current values of the selects e.g.       

// var currentfilterDepartmentSelect = $('#filterDepartmentSelect').val(); 
// var currentfilterLocationSelect = $('#filterLocation').val(); 

// Clear down the options, retrieve the data and rebuild the selects 

// Restore the selects to the stored values e.g. 

// $('#filterDepartmentSelect').val(currentfilterDepartmentSelect); 
// $('#filterLocation').val(currentfilterLocationSelect);
// personnel filter ends here**********************************************************



//populate department when add personnel btn is click
$(document).on('click', '#addBtn', function(){

  fetchAllDepartment().then(departmentData => {

    let departmentDropdown = $("#addPersonnelDepartment");
    departmentDropdown.empty();
    departmentDropdown.append(`<option disabled value="">Select department</option>`); 

    // Iterate over the department data and append options
    departmentData.forEach(department => {
      departmentDropdown.append(`<option value="${department.id}">${department.name}</option>`);
    });
  })
  .catch(error => {
    console.error(error);
  });
});

// adding personnel data****************************************************
$("#createPersonnelModal").on("hide.bs.modal", function(){
//reset the form
$("#addPersonnelForm")[0].reset();
});

$('#addPersonnelForm').on('submit', function (event) {
  event.preventDefault();

  let form = document.getElementById("addPersonnelForm");
  let formData = new FormData(form);

  let personnelData = {};
  formData.forEach((value, key)=>{
    personnelData[key] = value;
  });


  // Validate form data
  if (!personnelData.firstName || !personnelData.lastName || !personnelData.jobTitle || !personnelData.email || isNaN(personnelData.departmentID)) {
    // return if any field is empty or invalid

    return; // Stop further execution
  }


  let requestData = JSON.stringify({ 
      type: "createPersonnel", 
      ...personnelData 
  });


  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(data) {
          if (data.message) {
            $("#createPersonnelModal").modal("hide");
            $("#refreshBtnPersonnel").click();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {

            } else {

            }
        } catch (e) {
            console.log("An unexpected error occurred.");
        }     
      }
  });
});


// adding personnel data ends**********************************************


//populate modal with personnel id data when updatePersonnelBtn is clicked

let selectedPersonnelID;
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  selectedPersonnelID = $(e.relatedTarget).attr("data-id");
  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getPersonnelByID", id: selectedPersonnelID},
    success: function (data) {

        let personnelDepartment = data.departmentID;

        $("#editPersonnelFirstName").val(data.firstName);
        $("#editPersonnelLastName").val(data.lastName);
        $("#editPersonnelJobTitle").val(data.jobTitle);
        $("#editPersonnelEmailAddress").val(data.email);
        
        fetchAllDepartment().then(departmentData => {

        let departmentDropdown = $("#editPersonnelDepartment");
        departmentDropdown.empty(); // Clear existing options
        departmentDropdown.append(`<option disabled value="">Select department</option>`); // Add default option

      // Iterate over the department data and append options
        departmentData.forEach(department => {
        departmentDropdown.append(`<option selected value="${department.id}">${department.name}</option>`);
        });
        //change department option to selected personnel
        $("#editPersonnelDepartment").val(personnelDepartment).change();
      })
      .catch(error => {
        console.error(error);
      });
    }
  })
});


$("#editPersonnelModal").on("hide.bs.modal", function(){
  //reset the form
  $("#editPersonnelForm")[0].reset();
})
//updating personnel by id function
$("#editPersonnelForm").on("submit", function (event) {
  event.preventDefault();

    let form = document.getElementById('editPersonnelForm');
    let formData = new FormData(form);

    // convert form data into json object
    let personnelData = {};
    formData.forEach((value, key) => {
      personnelData[key] = value;
    });


    personnelData.id = selectedPersonnelID;

    // Validate form data
    if (!personnelData.firstName || !personnelData.lastName || !personnelData.jobTitle || !personnelData.email || isNaN(parseInt(personnelData.departmentID))) {
      // return if any field is empty or invalid
      return; 
  }

  let requestData = JSON.stringify({ 
      type: "updatePersonnel", 
      ...personnelData 
  });
  

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(data) {
          if (data.message) {
              $('#editPersonnelModal').modal('hide');
              $("#refreshBtn").click();  
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                console.log(response.message);
            } else {
                console.log("An unexpected error occurred.");
            }
        } catch (e) {
            console.log("An unexpected error occurred.");
        }     
      }
  });
});


let selectedPersonnelDeleteID;
$("#areYouSurePersonnelModal").on("show.bs.modal", function (e) {
  selectedPersonnelDeleteID = $(e.relatedTarget).attr("data-id");
  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getPersonnelByID", id: selectedPersonnelDeleteID},
    success: function (data) {
      if(data){
              $('#areYouSurePersonnelID').val(data.id);
          $("#areYouSurePersonnelName").text(
            data.firstName +
              " " +
              data.lastName
          );
          $("#areYouSurePersonnelModal").modal("show");
      } else {
          $("#areYouSurePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
    }
  })
  return selectedPersonnelDeleteID;
});


$("#areYouSurePersonnelForm").on('submit', function(event){
  $("#areYouSurePersonnelModal").modal("hide");
  event.preventDefault();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "deletePersonnelByID", id: selectedPersonnelDeleteID },
      success: function(data) {
          if (data.message) {
              $("#refreshBtn").click();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                console.log(response.message);
            } else {
              console.log("An unexpected error occurred.");
            }
        } catch (e) {
          console.log("An unexpected error occurred.");
        }     
      }
    });

});


$(document).on("keyup", "#searchBtn",function (event) {
  event.preventDefault();
  let searchValue = $(this).val();
  if (searchValue !== '') {
    $("#personnelTableBody").empty();
    // $("#departmentTableBody").empty();
    // $("#locationTableBody").empty();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "searchPersonnel", searchValue: searchValue },
      dataType: 'json', // Ensure the response is parsed as JSON
      success: function(data) {
        populatePersonnelTable(data);
      },
      error: function(jqXHR, textStatus) {

        $("#personnelTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Personnel</h3>`);
      }
    });
  } else {
    populatePersonnelData();
  }
});


//populate department location dropdown when add department btn is click
$(document).on('click', '#addBtnDepartment', function(){

  fetchAllLocation().then(locationData => {

    let locationDropdown = $("#addDepartmentLocation");
    locationDropdown.empty(); // Clear existing options
    locationDropdown.append(`<option disabled value="">Select Location</option>`); // Add default option

    // Iterate over the department data and append options
    locationData.forEach(location => {
      locationDropdown.append(`<option value="${location.id}">${location.name}</option>`);
    });
  })
  .catch(error => {
    console.error(error);
  });
});



$("#addDepartmentModal").on("hide.bs.modal", function(){
  //reset the form after success
  $("#addDepartmentForm")[0].reset();
})

// creating department data****************************************************
$("#addDepartmentForm").on('submit', function(event) {
  event.preventDefault();//prevent the form from submitting

  let form = document.getElementById("addDepartmentForm");
  let formData = new FormData(form);

  let departmentData = {};
  formData.forEach((value, key) => {
    departmentData[key] = value;
  });


  //validate form data
  if(!departmentData.name || isNaN(departmentData.locationID)){
    //return if any fileds is empty
    return;
  }

  let requestData = JSON.stringify({ 
      type: "createDepartment", 
      ...departmentData 
  });
  
  

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(data) {
          if (data.message) {
              $("#addDepartmentModal").modal("hide");
              $("#refreshBtnDepartment").click();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
              console.log(response.message);
            } else {
              console.log("An unexpected error occurred.");
            }
        } catch (e) {
          console.log("An unexpected error occurred.");
        }     
      }
  });
  
});




// updating department data****************************************************
//populate modal with deparment id data when editDepartmentBtn is clicked
let selectedDepartmentlID;
$('#editDepartmentModal').on("show.bs.modal", function (e) {
  selectedDepartmentlID = $(e.relatedTarget).attr("data-id");

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getDepartmentByID", id: selectedDepartmentlID},
    success: function (data) {
   
        let departmentLocation = data.locationID;

        $("#editDepartment").val(data.name);
        
        fetchAllLocation().then(locationData => {

        let locationDropdown = $("#editDepartmentLocation");
        locationDropdown.empty(); // Clear existing options
        locationDropdown.append(`<option disabled value="">Select department</option>`); // Add default option

      // Iterate over the location data and append options
        locationData.forEach(location => {
        locationDropdown.append(`<option selected value="${location.id}">${location.name}</option>`);
        });
        //change location option to selected department
        $("#editDepartmentLocation").val(departmentLocation).change();
      })
      .catch(error => {
        console.error(error);
      });


    },
    error: function(jqXHR, textStatus) {
      console.error('Error details:', {
        status: jqXHR.status,
        // statusText: jqXHR.statusText,
        // responseText: jqXHR.responseText,
        // textStatus: textStatus,
        // errorThrown: errorThrown
      });
      
    }
  })
return selectedDepartmentlID;
});
  

$("#editDepartmentModal").on("hide.bs.modal", function(){
  //reset the form after success
  $("#editDepartmentForm")[0].reset();
})
$('#editDepartmentForm').on('submit', function(event) {
  event.preventDefault();

  let form = document.getElementById("editDepartmentForm");

  let departmentData = {};
  let formData = new FormData(form);
  formData.forEach((value, key)=>{
    departmentData[key] = value;
  });

  departmentData.id = selectedDepartmentlID;

    //validate form data
    if(!departmentData.name || isNaN(departmentData.locationID)){
      //return if any fileds is empty
      return;
    }


  let requestData = JSON.stringify({ 
      type: "updateDepartment",
      ...departmentData
  });
  

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(data) {
          if (data.message) {
              $('#editDepartmentModal').modal('hide');
              $("#refreshBtnDepartment").click();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
              console.log(response.message);
            } else {
              console.log("An unexpected error occurred.");
            }
        } catch (e) {
          console.log("An unexpected error occurred.");
        }     
      }
  });
});





let selectedDepartmentDeleteID;
$(document).on("click", ".deleteDepartmentBtn", function () {
  selectedDepartmentDeleteID = $(this).attr("data-id");
  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data: { type: "checkDepartmentDeleteID", id: selectedDepartmentDeleteID },
    success: function (data) {
      if (data.success) {
        if (data.message.count > 0) {
          $("#cantDeleteDeptName").text(data.message.departmentName);
          $("#personnelCount").text(data.message.count);
          $("#cantDeleteDepartmentModal").modal("show");
        } else {
          $("#areYouSureDeptName").text(data.message.departmentName);
          $("#areYouSureDeleteDepartmentModal").modal("show");
        }
      } else {
        console.error("Error: ", data.message);
      }
    },
    error: function (jqXHR, textStatus) {
      console.error('Error details:', {
        status: jqXHR.status,
        // statusText: jqXHR.statusText,
        // responseText: jqXHR.responseText,
        // textStatus: textStatus,
        // errorThrown: errorThrown
      });
    }
  });
  return selectedDepartmentDeleteID;
});


$("#deleteDepartmentForm").on('submit', function(event){
event.preventDefault();
    // $('#deleteDepartmentModal').modal('hide');
    $.ajax({
        url: './../api/personnelAPI.php',
        type: "json",
        method: "GET",
        data: { type: "deleteDepartmentByID", id: selectedDepartmentDeleteID },
        success: function(data) {
            if (data.success) {
                $("#refreshBtnDepartment").click();
            } else {
                throw new Error("Unexpected response format");
            }
          },
          error: function(jqXHR) {
            try {
              var response = JSON.parse(jqXHR.responseText);
              if (response.message) {
                console.log(response.message);
              } else {
                console.log("An unexpected error occurred.");
              }
          } catch (e) {
            console.log("An unexpected error occurred.");
          }     
          
        }
    });

});

// searching department
$(document).on("keyup", "#searchBtnDepartment",function (event) {
  event.preventDefault();
  let searchValue = $(this).val();
  if (searchValue !== '') {
    $("#departmentTableBody").empty();

    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "searchDepartment", searchValue: searchValue },
      dataType: 'json',
      success: function(data) {
        populateDepartmentTable(data);
      },
      error: function(jqXHR, textStatus) {

        $("#departmentTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Department</h3>`);
      }
    });
  } else {
    populateDepartmentData();
  }
});


// creating location data****************************************************
$("#addLocationModal").on("hide.bs.modal", function(){
  //reset the form after success
  $("#addLocationForm")[0].reset();
});

$("#addLocationForm").on('submit', function(event) {
  event.preventDefault();//prevent the form from submitting


  let locationData = {};
   let form = document.getElementById("addLocationForm");
  let formData = new FormData(form);
  formData.forEach((value, key) => {
    locationData[key] = value;
  })
    //validate form data
    if(!locationData.name){
      //return if any fileds is empty
      return;
    }



  let requestData = JSON.stringify({ 
      type: "createLocation", 
      ...locationData 
  });


  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(data) {
        if (data.message) {
            $("#addLocationModal").modal("hide");
            $("#refreshBtnLocation").click();
            
        } else {
            throw new Error("Unexpected response format");
        }
      },
      error: function(jqXHR) {
        try {
          var response = JSON.parse(jqXHR.responseText);
          if (response.message) {
            console.log(response.message);
          } else {
            console.log("An unexpected error occurred.");
          }
      } catch (e) {
        console.log("An unexpected error occurred.");
      }     
    }
  });
  
});


// updating location data****************************************************
//populate modal with location id data when updatelocationBtn is clicked
let selectedLocationID;
$("#editLocationModal").on('show.bs.modal', function(e) {
  selectedLocationID = $(e.relatedTarget).attr('data-id');

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getLocationByID", id: selectedLocationID},
    success: function (data) {

        $("#editLocation").val(data.name);
    },
    error: function(jqXHR, textStatus) {
      console.error('Error details:', {
        status: jqXHR.status,
        // statusText: jqXHR.statusText,
        // responseText: jqXHR.responseText,
        // textStatus: textStatus,
        // errorThrown: errorThrown
      });
      
    }
  })
return selectedLocationID;
});


$("editLocationModal").on("hide.bs.modal", function(){
  // Reset the form after success
  $("#editLocationForm")[0].reset();
});
$('#editLocationForm').on('submit', function(event) {
  event.preventDefault();

  let locationData = {};

  let form = document.getElementById("editLocationForm");
  let formData = new FormData(form);
  formData.forEach((value, key) => {
    locationData[key] = value;
  });

  locationData.id = selectedLocationID;

    //validate form data
    if(!locationData.name){
      //return if any fileds is empty
      return;
    }

  let requestData = JSON.stringify({ 
      type: "updateLocation",
      ...locationData
  });

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(data) {
        if (data.message) {
            $('#editLocationModal').modal('hide');
            $("#refreshBtnLocation").click();
            
        } else {
            throw new Error("Unexpected response format");
        }
      },
      error: function(jqXHR) {
        try {
          var response = JSON.parse(jqXHR.responseText);
          if (response.message) {
          } else {
            console.log("An unexpected error occurred.");
          }
      } catch (e) {
        console.log("An unexpected error occurred.");
      }     
      
    }
  });
});

// ************************************* 

let selectedLocationDeleteID;
$(document).on("click", ".deleteLocationBtn", function () {
  selectedLocationDeleteID = $(this).attr("data-id");
  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data: { type: "checkLocationDeleteID", id: selectedLocationDeleteID },
    success: function (data) {
      if (data.success) {
        if (data.message.count > 0) {
          $("#cantDeleteLoctName").text(data.message.locationName);
          $("#locationCount").text(data.message.count);
          $("#cantDeleteLocationModal").modal("show");
        } else {
          $("#areYouSureLocName").text(data.message.locationName);
          $("#areYouSureDeleteLocationModal").modal("show");
        }
      } else {
        console.error("Error: ", data.message);
      }
    },
    error: function (jqXHR, textStatus) {
      console.error('Error details:', {
        status: jqXHR.status,
        // statusText: jqXHR.statusText,
        // responseText: jqXHR.responseText,
        // textStatus: textStatus,
        // errorThrown: errorThrown
      });
    }
  });
  return selectedLocationDeleteID;
});


$("#deleteLocationForm").on('submit', function(event){

event.preventDefault();
    // $('#deleteDepartmentModal').modal('hide');
    $.ajax({
        url: './../api/personnelAPI.php',
        type: "json",
        method: "GET",
        data: { type: "deleteLocationByID", id: selectedLocationDeleteID },
        success: function(data) {
            if (data.success) {

                $("#refreshBtnLocation").click();

            } else {
                throw new Error("Unexpected response format");
            }
          },
          error: function(jqXHR) {
            try {
              var response = JSON.parse(jqXHR.responseText);
              if (response.message) {
                console.log(response.message);
              } else {
                console.log("An unexpected error occurred.");
              }
          } catch (e) {
            console.log("An unexpected error occurred.");
          }     
         
        }
    });

});

// ************************************* 

// searchng location
$(document).on("keyup", "#searchBtnLocation",function (event) {
  event.preventDefault();

  let searchValue = $(this).val();

  if (searchValue !== '') {
    $("#locationTableBody").empty();

    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "searchLocation", searchValue: searchValue },
      dataType: 'json', // Ensure the response is parsed as JSON
      success: function(data) {
        
        populateLocationTable(data);
      },
      error: function(jqXHR, textStatus) {

        $("#locationTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Location</h3>`);
      }
    });
  } else {
    populateLocationData();
  }
});
});