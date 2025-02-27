import { updateHeadDiv, populatePersonnelTable, populateDepartmentTable, populateLocationTable } from "./functions.js";

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
  });


  $("#departmentsBtn").on('click', function(){
    populateDepartmentData();
    updateHeadDiv("searchBtnDepartment", "refreshBtnDepartment", "filterBtnDepartment", "addBtnDepartment", "#addDepartmentModal");
  });
  
  
  $("#locationsBtn").on('click', function(){
    populateLocationData();
    updateHeadDiv("searchBtnLocation", "refreshBtnLocation", "filterBtnLocation", "addBtnLocation", "#createLocationModal")
  });

  // personnel filter starts here**********************************************************

  $(document).on('click', '#filterBtn', function(){

    // fetch and populate department filter 
    fetchAllDepartment().then(departmentData => {
      let departmentFilterDropdown = $("#selectDepartmentOption");
      departmentFilterDropdown.empty();
      departmentData.forEach(department => {
        departmentFilterDropdown.append(`
            <li>
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${department.id}" id="option1">
                  <label class="form-check-label" for="option1">${department.name}</label>
              </div>
          </li>`
        )
      })
      
    }).catch(error => {
      console.error(error);
    });

    //fetch and populate location filter
    fetchAllLocation().then(locationData => {
      let locationFilterDropdown = $("#selectLocationOption");
      locationFilterDropdown.empty();
      locationData.forEach(location=>{
        locationFilterDropdown.append(`
          <li>
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${location.id}" id="option1">
                  <label class="form-check-label" for="option1">${location.name}</label>
              </div>
          </li>`
        )
      })
    }).catch(error => {
      console.error(error);
    });
    $("#filterModalPersonnel").modal("show");

    $('#applyFilterBtn').on('click', function() {
      // Get all selected options
      let selectedOptions = [];
      $('.dropdown-menu .form-check-input:checked').each(function() {
          selectedOptions.push($(this).val());
      });


      if (selectedOptions.length === 0) {
        $("#notificationMessage").text("Sorry No filter options checked, try again");
        $("#notificationModal").modal("show");
        return; // Stop further execution
    }

      let filterData = JSON.stringify({
        type: "filterPersonnel",
        departmentIDs: selectedOptions
      });
      $("#personnelTableBody").empty();
      // Close the modal
      $('#filterModalPersonnel').modal('hide');
      //fetch the personnel data base on filter options
      $.ajax({
        url: "./../api/personnelAPI.php",
        method: "POST",
        contentType: "application/json",
        data: filterData,
        success: function (data){
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
      })
  })
})

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

  console.log(personnelData);

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

    console.log(personnelData);

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

  console.log("department data",departmentData);


  // let departmentData = {
  //     name: $("#createDepartment").val(),
  //     locationID: parseInt($("#createDepartmentLocation").val())
  // };

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
  console.log("department data", departmentData);


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
  console.log("you click me ", selectedDepartmentDeleteID);
  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data: { type: "checkDepartmentDeleteID", id: selectedDepartmentDeleteID },
    success: function (data) {
      console.log(data);
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
  console.log("id to delete,", selectedDepartmentDeleteID)
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
$(document).on('click', '#createLocationBtn', function(event) {
  event.preventDefault();//prevent the form from submitting

  $("#createLocationModal").modal("hide");
  
  let locationData = {
      name: $("#createLocation").val()
  };

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
            $("#createLocationForm")[0].reset();
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
$(document).on('click', '.updateLocationBtn', function() {
  selectedLocationID = $(this).data('id');

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getLocationByID", id: selectedLocationID},
    success: function (data) {

        $("#updateLocation").val(data.name);
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

$('#updateLocationBtnConfirm').on('click', function(event) {
  event.preventDefault();

  $('#UpdateLocationModal').modal('hide');
  let locationData = {
      id: selectedLocationID,
      name: $("#updateLocation").val()
  };

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
            $("#updateLocationForm")[0].reset();
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

// deleting location 
$(document).on('click', '.deleteLocationBtn', function(){

  selectedLocationDeleteID = $(this).data('id');

  $('#confirmDeleteLocationBtn').on('click',function(){
    $('#deleteLocationModal').modal('hide');
    // location.reload();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "deleteLocationByID", id: selectedLocationDeleteID },
        success: function(data) {
          if (data.message) {
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

  })
});

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