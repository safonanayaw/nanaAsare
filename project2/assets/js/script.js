function showLoader() {
  $("#preloader").addClass("active");
}
//hide loader
function hideLoader() {
  $("#preloader").removeClass("active");
}
showLoader();

//fetch and populate personnel data
function populatePersonnelData(){
  $("#searchInputAndBtns").empty();

  $("#searchInputAndBtns").html(`<div class="col-md-6 col-8">
    <input id="searchInpPersonnel" class="form-control searchInpPersonnel" placeholder="search">
  </div>
  <div class="col-md-6 col-4 text-end">
    <div class="btn-group btn-group-sm btn-group-md-normal" role="group" aria-label="buttons">
      <button id="refreshBtnPersonnel" type="button" class="btn btn-primary refreshBtnPersonnel">
        <i class="fa-solid fa-refresh fa-fw"></i>
      </button>
      <button id="filterBtnPersonnel" type="button" class="btn btn-primary filterBtnPersonnel">
        <i class="fa-solid fa-filter fa-fw"></i>
      </button>          
      <button id="addBtnPersonnel" type="button" class="btn btn-primary addBtnPersonnel" data-bs-toggle="modal" data-bs-target="#createPersonnelModal">
        <i class="fa-solid fa-plus fa-fw"></i>
      </button>
    </div>
  </div>`);

  $.ajax({
    url: './../api/personnelAPI.php',
    method: 'GET',
    dataType: 'json',
    data: {type: "getAllPersonnel"},
    success: function(data) {
      // Clear the existing table body
      $('#personnelTableBody').empty();

      // Iterate over the data and create table rows
      data.forEach(function(personnel) {
        var row = `
          <tr>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.id}</td>
            <td class="align-middle text-nowrap">${personnel.firstName}, ${personnel.lastName}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.jobTitle}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell" data-id="${personnel.departmentID}">${personnel.departmentName}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
            <td class="text-start text-nowrap">
              <button type="button" class="btn btn-primary btn-sm updatePersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button id="deletePersonnelBtn" type="button" class="btn deletePersonnelBtn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#personnelTableBody').append(row);
      });


    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ' + textStatus, errorThrown); // Handle any errors
    }
  });
}


//fetch and populate personnel data
function populateDepartmentData(){
  $.ajax({
    url: './../api/personnelAPI.php',
    method: 'GET',
    dataType: 'json',
    data: {type: "getDepartment"},
    success: function(data) {
      // Clear the existing table body
      $('#departmentTableBody').empty();

      // Iterate over the data and create table rows
      data.forEach(function(department) {
        var row = `
          <tr>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${department.id}</td>
            <td class="align-middle text-nowrap">${department.name}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${department.departmentLocation}</td>

            <td class="text-start text-nowrap">
              <button type="button" class="btn btn-primary btn-sm updateDepartmentBtn" data-bs-toggle="modal" data-bs-target="#UpdateDepartmentModal" data-id="${department.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
                <button id="deleteDepartmentBtn" type="button" class="btn deleteDepartmentBtn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${department.id}">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#departmentTableBody').append(row);
      });
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
      // Clear the existing table body
    
      $('#locationTableBody').empty();

      // Iterate over the data and create table rows
      data.forEach(function(location) {
        var row = `
          <tr>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${location.id}</td>
            <td class="align-middle text-nowrap">${location.name}</td>


            <td class="text-start text-nowrap">
              <button type="button" class="btn btn-primary btn-sm updateLocationBtn" data-bs-toggle="modal" data-bs-target="#UpdateLocationModal" data-id="${location.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button id="deleteLocationBtn" type="button" class="btn deleteLocationBtn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${location.id}">
              <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#locationTableBody').append(row);
      });
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

  //???????????????? add reloader spinner************???????
  // refresh btn for personnel
  $(document).on('click', '#refreshBtnPersonnel', function(){
    $("#personnelBtn").click();
  });

   // refresh btn for department
   $(document).on('click', '#refreshBtnDepartment', function(){
    $("#departmentsBtn").click();
  });

   // refresh btn for location
   $(document).on('click', '#refreshBtnLocation', function(){
    $("#locationsBtn").click();
  });

  //setTimeout for spinner when btn is clicked********
  $(document).on('click', '#personnelBtn',function(){

    showLoader();
    setTimeout(hideLoader, 1000);
  });
  
  $(document).on('click', '#departmentsBtn',function(){
    showLoader();
    setTimeout(hideLoader, 1000);
  });
  
  $(document).on('click', '#locationsBtn',function(){
    showLoader();
    setTimeout(hideLoader, 1000);
  });
  //setTimeout for spinner when btn is clicked********
  //???????????????? add reloader spinner************???????

  // show or hide search and btn container
  $("#personnelBtn").on('click', function(){
    populatePersonnelData();
    $("#searchInputAndBtns").empty();

    $("#searchInputAndBtns").html(`<div class="col-md-6 col-8">
        <input id="searchInpPersonnel" class="form-control searchInpPersonnel" placeholder="search">
      </div>
      <div class="col-md-6 col-4 text-end">
        <div class="btn-group btn-group-sm btn-group-md-normal" role="group" aria-label="buttons">
          <button id="refreshBtnPersonnel" type="button" class="btn btn-primary refreshBtnPersonnel">
            <i class="fa-solid fa-refresh fa-fw"></i>
          </button>
          <button id="filterBtnPersonnel" type="button" class="btn btn-primary filterBtnPersonnel">
            <i class="fa-solid fa-filter fa-fw"></i>
          </button>          
          <button id="addBtnPersonnel" type="button" class="btn btn-primary addBtnPersonnel" data-bs-toggle="modal" data-bs-target="#createPersonnelModal">
            <i class="fa-solid fa-plus fa-fw"></i>
          </button>
        </div>
      </div>`);

    // $(".searchInpPersonnel").show();
    // $(".filterBtnPersonnel").show();
    // $(".addBtnPersonnel").show();
    // $(".refreshBtnPersonnel").show();

  });


  $("#departmentsBtn").on('click', function(){
    populateDepartmentData();
    $("#searchInputAndBtns").empty();
    $("#searchInputAndBtns").html(`<div class="col-md-6 col-8">
          <input id="searchInpDepartment" class="form-control searchInputDepartment" placeholder="search">
        </div>
        <div class="col-md-6 col-4 text-end">
          <div class="btn-group btn-group-sm btn-group-md-normal" role="group" aria-label="buttons">
            <button id="refreshBtnDepartment" type="button" class="btn btn-primary refreshBtnDepartment">
              <i class="fa-solid fa-refresh fa-fw"></i>
            </button>
            <button id="filterBtnDepartment" type="button" class="btn btn-primary filterBtnDepartment">
              <i class="fa-solid fa-filter fa-fw"></i>
            </button>          
            <button id="addBtnDepartment" type="button" class="btn btn-primary addBtnDepartment" data-bs-toggle="modal" data-bs-target="#createDepartmentModal">
              <i class="fa-solid fa-plus fa-fw"></i>
            </button>
          </div>
        </div>`);

    $(".searchInputDepartment").show();
    $(".refreshBtnDepartment").show();
    $(".filterBtnDepartment").hide();
    $(".addBtnDepartment").show();


  });
  
  
  $("#locationsBtn").on('click', function(){
    populateLocationData();
    $("#searchInputAndBtns").empty();
    $("#searchInputAndBtns").html(`<div class="col-md-6 col-8">
          <input id="searchInpLocation" class="form-control searchInputLocation" placeholder="search">
        </div>
        <div class="col-md-6 col-4 text-end">
          <div class="btn-group btn-group-sm btn-group-md-normal" role="group" aria-label="buttons">
            <button id="refreshBtnLocation" type="button" class="btn btn-primary refreshBtnLocation">
              <i class="fa-solid fa-refresh fa-fw"></i>
            </button>
            <button id="filterBtnLocation" type="button" class="btn btn-primary filterBtnLocation">
              <i class="fa-solid fa-filter fa-fw"></i>
            </button>          
            <button id="addBtnLocation" type="button" class="btn btn-primary addBtnLocation" data-bs-toggle="modal" data-bs-target="#createLocationModal">
              <i class="fa-solid fa-plus fa-fw"></i>
            </button>
          </div>
        </div>`);

    $(".searchInpLocation").hide();
    $(".filterBtnLocation").hide();
    $(".addBtnLocation").show();
    $(".refreshBtnLocation").show();

  });


//populate department when add personnel btn is click
$(document).on('click', '#addBtnPersonnel', function(){

  fetchAllDepartment().then(departmentData => {

    let departmentDropdown = $("#createPersonnelDepartmentID");
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
$(document).on('click', '#createPersonnelBtn', function(event) {
  event.preventDefault();//prevent the form from submitting

  $("#createPersonnelModal").modal("hide");

  let personnelData = {
      firstName: $("#createPersonnelFirstName").val(),
      lastName: $("#createPersonnelLastName").val(),
      jobTitle: $("#createPersonnelJobTitle").val(),
      email: $("#createPersonnelEmailAddress").val(),
      departmentID: parseInt($("#createPersonnelDepartmentID").val())
  };

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
              $("#createPersonnelForm")[0].reset();
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
let selectedPersonnelID
$(document).on('click', '.updatePersonnelBtn', function() {
  selectedPersonnelID = $(this).data('id');

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
return selectedPersonnelID
});


//updating personnel by id function
$(document).on('click', '#updatePersonnelBtn', function(event) {
  event.preventDefault();

  $('#editPersonnelModal').modal('hide');
  let personnelData = {
      id: selectedPersonnelID,
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      departmentID: $("#editPersonnelDepartment").val()
  };

    // Validate form data
    if (!personnelData.firstName || !personnelData.lastName || !personnelData.jobTitle || !personnelData.email || isNaN(personnelData.departmentID)) {
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
              $("#refreshBtnPersonnel").click();
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
$(document).on('click', '.deletePersonnelBtn', function(){
  selectedPersonnelDeleteID = $(this).data('id');

  $('#confirmDeletePersonnelBtn').on('click', function(){
    $('#deletePersonnelModal').modal('hide');
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "deletePersonnelByID", id: selectedPersonnelDeleteID },
      success: function(data) {
          if (data.message) {
              $("#notificationMessage").text(data.message);
              $("#refreshBtnPersonnel").click();
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


$(document).on("keyup", ".searchInpPersonnel",function (event) {
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
        // Iterate over the data and create table rows
        data.forEach(function(personnel) {
          var row = `
                <tr>
                    <td class="align-middle text-nowrap d-none d-sm-table-cell">${personnel.id}</td>
                    <td class="align-middle text-nowrap">
                        <span>${personnel.firstName}, ${personnel.lastName}</span>
                        <div class="d-md-none small text-muted mt-1">
                            <div>${personnel.jobTitle}</div>
                            <div>${personnel.departmentName}</div>
                        </div>
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.jobTitle}</td>
                    <td class="align-middle text-nowrap d-none d-lg-table-cell" data-id="${personnel.departmentID}">${personnel.departmentName}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
                    <td class="text-end text-nowrap">
                        <button type="button" class="btn btn-primary btn-sm updatePersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn deletePersonnelBtn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </td>
                </tr>
          `;
          $('#personnelTableBody').append(row);
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
        $("#personnelTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Personnel</h3>`);
      }
    });
  } else {
    populatePersonnelData();
  }
});


//populate department location dropdown when add department btn is click
$(document).on('click', '.addBtnDepartment', function(){

  fetchAllLocation().then(locationData => {

    let locationDropdown = $("#createDepartmentLocation");
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
$(document).on('click', '#createDepartmentBtn', function(event) {
  event.preventDefault();//prevent the form from submitting
  $("#createDepartmentModal").modal("hide");
  
  let departmentData = {
      name: $("#createDepartment").val(),
      locationID: parseInt($("#createDepartmentLocation").val())
  };

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
              $("#createDepartmentForm")[0].reset();
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
//populate modal with deparment id data when updatedepartmentBtn is clicked
let selectedDepartmentlID;
$(document).on('click', '.updateDepartmentBtn', function() {
  selectedDepartmentlID = $(this).data('id');

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getDepartmentByID", id: selectedDepartmentlID},
    success: function (data) {
   
        let departmentLocation = data.locationID;

        $("#updateDepartment").val(data.name);
        
        fetchAllLocation().then(locationData => {

        let locationDropdown = $("#updateDepartmentLocation");
        locationDropdown.empty(); // Clear existing options
        locationDropdown.append(`<option disabled value="">Select department</option>`); // Add default option

      // Iterate over the location data and append options
        locationData.forEach(location => {
        locationDropdown.append(`<option selected value="${location.id}">${location.name}</option>`);
        });
        //change location option to selected department
        $("#updateDepartmentLocation").val(departmentLocation).change();
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
  
$('#updateDepartmentBtn').on('click', function(event) {
  event.preventDefault();

  $('#UpdateDepartmentModal').modal('hide');
  let departmentData = {
      id: selectedDepartmentlID,
      name: $("#updateDepartment").val(),
      locationID: $("#updateDepartmentLocation").val()
  };

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
              $("#updateDepartmentForm")[0].reset();
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


$(document).on('click', '.deleteDepartmentBtn', function(){

  selectedDepartmentDeleteID = $(this).data('id');

  $('#confirmDeleteDepartmentBtn').on('click', function() {
    $('#deleteDepartmentModal').modal('hide');
    $.ajax({
        url: './../api/personnelAPI.php',
        type: "json",
        method: "GET",
        data: { type: "deleteDepartmentByID", id: selectedDepartmentDeleteID },
        success: function(data) {
            if (data.message) {
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
});

// searching department
$(document).on("keyup", ".searchInputDepartment",function (event) {
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

        // Iterate over the data and create table rows
        data.forEach(function(department) {
          var row = `
          <tr>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${department.id}</td>
            <td class="align-middle text-nowrap">${department.name}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${department.locationName}</td>

            <td class="text-start text-nowrap">
              <button type="button" class="btn btn-primary btn-sm updateDepartmentBtn" data-bs-toggle="modal" data-bs-target="#UpdateDepartmentModal" data-id="${department.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
                <button id="deleteDepartmentBtn" type="button" class="btn deletePersonnelBtn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${department.id}">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#departmentTableBody').append(row);
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
$(document).on("keyup", ".searchInputLocation",function (event) {
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

        // Iterate over the data and create table rows
        data.forEach(function(location) {
          var row = `
          <tr>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${location.id}</td>
            <td class="align-middle text-nowrap">${location.name}</td>


            <td class="text-start text-nowrap">
              <button type="button" class="btn btn-primary btn-sm updateLocationBtn" data-bs-toggle="modal" data-bs-target="#UpdateLocationModal" data-id="${location.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button id="deleteLocationBtn" type="button" class="btn deleteLocationBtn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${location.id}">
              <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#locationTableBody').append(row);
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
        $("#locationTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" in Location</h3>`);
      }
    });
  } else {
    populateLocationData();
  }
});
setTimeout(hideLoader, 2000);

});

