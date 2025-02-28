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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown); // Handle any errors
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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown); // Handle any errors
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
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ' + textStatus, errorThrown); // Handle any errors
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
      error: function(jqXHR, textStatus, errorThrown) {
        reject('Error: ' + textStatus, errorThrown);
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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error details:', {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          responseText: jqXHR.responseText,
          textStatus: textStatus,
          errorThrown: errorThrown
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

  
  // Add a close button or mechanism to close the dropdown
  $(document).ready(function() {
    $('#dropdownDeptButton, #dropdownLocButton').on('show.bs.dropdown', function () {
      $('#filterModalPersonnel .custom-modal-height ').addClass('expanded-modal');
    });
  
    $('#filterModalPersonnel').on('hide.bs.modal', function () {
      $('#filterModalPersonnel .custom-modal-height ').removeClass('expanded-modal');
    });

    window.addEventListener('error', function(e) {
      if (e.message.includes("backdrop")) {
        e.preventDefault();
        return true;
      }
    }, true);

    document.addEventListener("DOMContentLoaded", function () {
      var filterModal = document.getElementById("filterModalPersonnel");
  
      if (filterModal) {
          var dropdownElements = [].slice.call(filterModal.querySelectorAll('.dropdown-toggle'));
          dropdownElements.map(function (dropdownToggleEl) {
              return new bootstrap.Dropdown(dropdownToggleEl);
          });
      }
  });
  });

  $(document).on('click', '#filterBtn', function() {
    fetchAllDepartment().then(departmentData => {
      populateFilterDepartment(departmentData);
    });

    fetchAllLocation().then(locationData => {
      populateFilterLocation(locationData)
    });

    $("#filterModalPersonnel").modal("show");

    $('#applyFilterBtn').on('click', function() {
        let selectedDeptIDs = [];
        let selectedLocIDs = [];

        $('.dept-checkbox:checked').each(function() {
            selectedDeptIDs.push($(this).val());
        });

        $('.loc-checkbox:checked').each(function() {
            selectedLocIDs.push($(this).val());
        });

        if (selectedDeptIDs.length === 0 && selectedLocIDs.length === 0) {
            $("#filterModalPersonnel").modal("hide");
            $("#notificationMessage").text("Please select at least one filter option.");
            $("#notificationModal").modal("show");
            return;
        }

        let filterData = JSON.stringify({
            type: "filterPersonnel",
            departmentIDs: selectedDeptIDs,
            locationIDs: selectedLocIDs
        });

        $("#personnelTableBody").empty();
        $('#filterModalPersonnel').modal('hide');

        $.ajax({
            url: "./../api/personnelAPI.php",
            method: "POST",
            contentType: "application/json",
            data: filterData,
            success: function(data) {
                populatePersonnelTable(data);
            },
            error: function(jqXHR) {
                try {
                    var response = JSON.parse(jqXHR.responseText);
                    if (response.message) {
                        $("#notificationMessage").text(response.message);
                    } else {
                        $("#notificationMessage").text("An unexpected error occurred.");
                    }
                } catch (e) {
                    $("#notificationMessage").text("An unexpected error occurred.");
                }
                $("#notificationModal").modal("show");
            }
        });
    });
});


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
$('#addPersonnelForm').on('submit', function (event) {
  event.preventDefault();

  $("#createPersonnelModal").modal("hide");

  let form = document.getElementById("addPersonnelForm");
  let formData = new FormData(form);

  let personnelData = {};
  formData.forEach((value, key)=>{
    personnelData[key] = value;
  });


  // Validate form data
  if (!personnelData.firstName || !personnelData.lastName || !personnelData.jobTitle || !personnelData.email || isNaN(personnelData.departmentID)) {
    // Show error message if any field is empty or invalid
    $("#notificationMessage").text("Please fill out all fields correctly.");
    $("#notificationModal").modal("show");
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
              $("#notificationMessage").text(data.message);
              $("#refreshBtnPersonnel").click();
              $("#notificationModal").modal("show");
              //reset the form
              $("#addPersonnelForm")[0].reset();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                $("#notificationMessage").text(response.message);
            } else {
                $("#notificationMessage").text("An unexpected error occurred.");
            }
        } catch (e) {
            $("#notificationMessage").text("An unexpected error occurred.");
        }     
        $("#notificationModal").modal("show");
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


//updating personnel by id function
$("#editPersonnelForm").on("submit", function (event) {
  event.preventDefault();

  $('#editPersonnelModal').modal('hide');

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
      // Show error message if any field is empty or invalid
      $("#notificationMessage").text("Please fill out all fields correctly.");
      $("#notificationModal").modal("show");
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
              $("#notificationMessage").text(data.message);
              $("#refreshBtn").click();
              $("#notificationModal").modal("show");

  
              //reset the form
              $("#editPersonnelForm")[0].reset();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                $("#notificationMessage").text(response.message);
            } else {
                $("#notificationMessage").text("An unexpected error occurred.");
            }
        } catch (e) {
            $("#notificationMessage").text("An unexpected error occurred.");
        }     
        $("#notificationModal").modal("show");
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

              $("#notificationMessage").text(data.message);
             
              $("#notificationModal").modal("show");
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                $("#notificationMessage").text(response.message);
            } else {
                $("#notificationMessage").text("An unexpected error occurred.");
            }
        } catch (e) {
            $("#notificationMessage").text("An unexpected error occurred.");
        }     
        $("#notificationModal").modal("show");
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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error details:', {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          responseText: jqXHR.responseText,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
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


// creating department data****************************************************
$("#addDepartmentForm").on('submit', function(event) {
  event.preventDefault();//prevent the form from submitting
  $("#addDepartmentModal").modal("hide");
  

  let form = document.getElementById("addDepartmentForm");
  let formData = new FormData(form);

  let departmentData = {};
  formData.forEach((value, key) => {
    departmentData[key] = value;
  });


  //validate form data
  if(!departmentData.name || isNaN(departmentData.locationID)){
    //show error message if any fileds is empty
    $("#notificationMessage").text("Please fill out all fields correctly.");
    $("#notificationModal").modal("show");
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
              $("#notificationMessage").text(data.message);
              $("#refreshBtnDepartment").click();
              $("#notificationModal").modal("show");
              //reset the form after success
              $("#addDepartmentForm")[0].reset();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                $("#notificationMessage").text(response.message);
            } else {
                $("#notificationMessage").text("An unexpected error occurred.");
            }
        } catch (e) {
            $("#notificationMessage").text("An unexpected error occurred.");
        }     
        $("#notificationModal").modal("show");
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
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error details:', {
        status: jqXHR.status,
        statusText: jqXHR.statusText,
        responseText: jqXHR.responseText,
        textStatus: textStatus,
        errorThrown: errorThrown
      });
      
    }
  })
return selectedDepartmentlID;
});
  
$('#editDepartmentForm').on('submit', function(event) {
  event.preventDefault();


  let form = document.getElementById("editDepartmentForm");

  let departmentData = {};
  let formData = new FormData(form);
  formData.forEach((value, key)=>{
    departmentData[key] = value;
  });

  departmentData.id = selectedDepartmentlID;


  $('#editDepartmentModal').modal('hide');

    //validate form data
    if(!departmentData.name || isNaN(departmentData.locationID)){
      //show error message if any fileds is empty
      $("#notificationMessage").text("Please fill out all fields correctly.");
      $("#notificationModal").modal("show");
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
              $("#notificationMessage").text(data.message);
              $("#refreshBtnDepartment").click();
              $("#notificationModal").modal("show");
              $("#editDepartmentForm")[0].reset();
          } else {
              throw new Error("Unexpected response format");
          }
        },
        error: function(jqXHR) {
          try {
            var response = JSON.parse(jqXHR.responseText);
            if (response.message) {
                $("#notificationMessage").text(response.message);
            } else {
                $("#notificationMessage").text("An unexpected error occurred.");
            }
        } catch (e) {
            $("#notificationMessage").text("An unexpected error occurred.");
        }     
        $("#notificationModal").modal("show");
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
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error details:', {
        status: jqXHR.status,
        statusText: jqXHR.statusText,
        responseText: jqXHR.responseText,
        textStatus: textStatus,
        errorThrown: errorThrown
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

                $("#notificationMessage").text(data.message);
                $("#refreshBtnDepartment").click();
                $("#notificationModal").modal("show");
            } else {
                throw new Error("Unexpected response format");
            }
          },
          error: function(jqXHR) {
            try {
              var response = JSON.parse(jqXHR.responseText);
              if (response.message) {
                  $("#notificationMessage").text(response.message);
              } else {
                  $("#notificationMessage").text("An unexpected error occurred.");
              }
          } catch (e) {
              $("#notificationMessage").text("An unexpected error occurred.");
          }     
          $("#notificationModal").modal("show");
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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error details:', {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          responseText: jqXHR.responseText,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
        $("#departmentTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Department</h3>`);
      }
    });
  } else {
    populateDepartmentData();
  }
});


// creating location data****************************************************
$("#addLocationForm").on('submit', function(event) {
  event.preventDefault();//prevent the form from submitting

  $("#addLocationModal").modal("hide");
  let locationData = {};
   let form = document.getElementById("addLocationForm");
  let formData = new FormData(form);
  formData.forEach((value, key) => {
    locationData[key] = value;
  })
    //validate form data
    if(!locationData.name){
      //show error message if any fileds is empty
      $("#notificationMessage").text("Please fill out all fields correctly.");
      $("#notificationModal").modal("show");
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
            $("#notificationMessage").text(data.message);
            $("#refreshBtnLocation").click();
            $("#notificationModal").modal("show");
            $("#addLocationForm")[0].reset();
        } else {
            throw new Error("Unexpected response format");
        }
      },
      error: function(jqXHR) {
        try {
          var response = JSON.parse(jqXHR.responseText);
          if (response.message) {
              $("#notificationMessage").text(response.message);
          } else {
              $("#notificationMessage").text("An unexpected error occurred.");
          }
      } catch (e) {
          $("#notificationMessage").text("An unexpected error occurred.");
      }     
      $("#notificationModal").modal("show");
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
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error details:', {
        status: jqXHR.status,
        statusText: jqXHR.statusText,
        responseText: jqXHR.responseText,
        textStatus: textStatus,
        errorThrown: errorThrown
      });
      
    }
  })
return selectedLocationID;
});

$('#editLocationForm').on('submit', function(event) {
  event.preventDefault();

  let locationData = {};
  $('#editLocationModal').modal('hide');
  let form = document.getElementById("editLocationForm");
  let formData = new FormData(form);
  formData.forEach((value, key) => {
    locationData[key] = value;
  });

  locationData.id = selectedLocationID;

    //validate form data
    if(!locationData.name){
      //show error message if any fileds is empty
      $("#notificationMessage").text("Please fill out all fields correctly.");
      $("#notificationModal").modal("show");
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
            $("#notificationMessage").text(data.message);
            $("#refreshBtnLocation").click();
            $("#notificationModal").modal("show");
            // Reset the form field
            $("#editLocationForm")[0].reset();
        } else {
            throw new Error("Unexpected response format");
        }
      },
      error: function(jqXHR) {
        try {
          var response = JSON.parse(jqXHR.responseText);
          if (response.message) {
              $("#notificationMessage").text(response.message);
          } else {
              $("#notificationMessage").text("An unexpected error occurred.");
          }
      } catch (e) {
          $("#notificationMessage").text("An unexpected error occurred.");
      }     
      $("#notificationModal").modal("show");
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
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error details:', {
        status: jqXHR.status,
        statusText: jqXHR.statusText,
        responseText: jqXHR.responseText,
        textStatus: textStatus,
        errorThrown: errorThrown
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

                $("#notificationMessage").text(data.message);
                $("#refreshBtnLocation").click();
                $("#notificationModal").modal("show");
            } else {
                throw new Error("Unexpected response format");
            }
          },
          error: function(jqXHR) {
            try {
              var response = JSON.parse(jqXHR.responseText);
              if (response.message) {
                  $("#notificationMessage").text(response.message);
              } else {
                  $("#notificationMessage").text("An unexpected error occurred.");
              }
          } catch (e) {
              $("#notificationMessage").text("An unexpected error occurred.");
          }     
          $("#notificationModal").modal("show");
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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error details:', {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          responseText: jqXHR.responseText,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
        $("#locationTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Location</h3>`);
      }
    });
  } else {
    populateLocationData();
  }
});
});