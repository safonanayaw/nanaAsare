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
      // console.log(data);
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
      console.log(data);
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
      console.log(data);
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

$("#locationsBtn").on('click', function(){
  console.log("location btn clicked");
})

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
    console.log("you clicked me personnel");
  });

   // refresh btn for department
   $(document).on('click', '#refreshBtnDepartment', function(){

    $("#departmentsBtn").click();
    console.log("you clicked me department");
  });

   // refresh btn for location
   $(document).on('click', '#refreshBtnLocation', function(){

    $("#locationsBtn").click();
    console.log("you clicked me location");
  });
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



$("#refreshBtn").on('click', function(){
  location.reload();
})

//populate department when add personnel btn is click
$(document).on('click', '#addBtnPersonnel', function(){
  console.log("create btn click");
  fetchAllDepartment().then(departmentData => {
    // console.log(departmentData); // Log the department data for debugging

    let departmentDropdown = $("#createPersonnelDepartmentID");
    departmentDropdown.empty(); // Clear existing options
    departmentDropdown.append(`<option disabled value="">Select department</option>`); // Add default option

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
  // console.log("Add Button clicked");
  $("#createPersonnelModal").modal("hide");

  let personnelData = {
      firstName: $("#createPersonnelFirstName").val(),
      lastName: $("#createPersonnelLastName").val(),
      jobTitle: $("#createPersonnelJobTitle").val(),
      email: $("#createPersonnelEmailAddress").val(),
      departmentID: parseInt($("#createPersonnelDepartmentID").val())
  };

  // Debug: Log the data being sent
  // console.log("Personnel Data before sending:", personnelData);

  let requestData = JSON.stringify({ 
      type: "createPersonnel", 
      ...personnelData 
  });
  
  // Debug: Log the final request data
  // console.log("Request data:", requestData);

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          // console.log("Success response:", response);
          // populatePersonnelData();
          //refresh the page after 
          location.reload();
        $("#personnelBtn").click();
          alert(`Personnel added successfully`);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error details:', {
              status: jqXHR.status,
              statusText: jqXHR.statusText,
              responseText: jqXHR.responseText,
              textStatus: textStatus,
              errorThrown: errorThrown
          });
          alert("Failed to add personnel. Check console for details.");
      }
  });
});
})

// adding personnel data****************************************************


//populate modal with personnel id data when updatePersonnelBtn is clicked
let selectedPersonnelID
$(document).on('click', '.updatePersonnelBtn', function() {
  selectedPersonnelID = $(this).data('id');
  console.log("I got click");
  console.log(selectedPersonnelID);

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getPersonnelByID", id: selectedPersonnelID},
    success: function (data) {

        let personnelDepartment = data.departmentID;

        console.log("personnel department", personnelDepartment);
        $("#editPersonnelFirstName").val(data.firstName);
        $("#editPersonnelLastName").val(data.lastName);
        $("#editPersonnelJobTitle").val(data.jobTitle);
        $("#editPersonnelEmailAddress").val(data.email);
        
        fetchAllDepartment().then(departmentData => {
        // console.log(departmentData); // Log the department data for debugging

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
  console.log("personnelID",selectedPersonnelID)
return selectedPersonnelID
});


//updating personnel by id function
$(document).on('click', '#updatePersonnelBtn', function(event) {
  event.preventDefault();
  console.log("Button clicked");
  $('#editPersonnelModal').modal('hide');
  let personnelData = {
      id: selectedPersonnelID,
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      departmentID: $("#editPersonnelDepartment").val()
  };

  // Debug: Log the data being sent
  console.log("Personnel Data before sending:", personnelData);
  console.log("Selected ID:", selectedPersonnelID);

  let requestData = JSON.stringify({ 
      type: "updatePersonnel", 
      ...personnelData 
  });
  
  // Debug: Log the final request data
  console.log("Request data:", requestData);

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          // populatePersonnelData();
        //refresh the page after 
        location.reload();
        $("#personnelBtn").click();
          alert(`Personnel with ID: ${selectedPersonnelID} updated successfully`);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error details:', {
              status: jqXHR.status,
              statusText: jqXHR.statusText,
              responseText: jqXHR.responseText,
              textStatus: textStatus,
              errorThrown: errorThrown
          });
          alert("Failed to update personnel. Check console for details.");
      }
  });
});


let selectedPersonnelDeleteID;
$(document).on('click', '.deletePersonnelBtn', function(){
  console.log("delete btn click in personnel")
  selectedPersonnelDeleteID = $(this).data('id');
  console.log(selectedPersonnelDeleteID);


  $('#confirmDeletePersonnelBtn').on('click', function(){
    $('#deletePersonnelModal').modal('hide');
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "deletePersonnelByID", id: selectedPersonnelDeleteID },
      success: function(data) {
        // console.log(data);
        populatePersonnelData();
        alert(`Personnel with ID: ${selectedPersonnelDeleteID} deleted successfully`);
        //refresh the page after 
        location.reload();
        $("#personnelBtn").click();
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
    });

  })
});


$(document).on("keyup", ".searchInpPersonnel",function (event) {
  event.preventDefault();
  console.log("search btn clicked");
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
        // console.log(data);
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
  // $("#createDepartmentModal").empty();
  // console.log("create DEPARTMENT btn click");
  fetchAllLocation().then(locationData => {
    // console.log(departmentData); // Log the department data for debugging

    let locationDropdown = $("#createDepartmentLocation");
    locationDropdown.empty(); // Clear existing options
    locationDropdown.append(`<option disabled value="">Select department</option>`); // Add default option

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
  // console.log("Add Button clicked");
  $("#createDepartmentModal").modal("hide");
  
  let locationData = {
      name: $("#createDepartment").val(),
      locationID: parseInt($("#createDepartmentLocation").val())
  };



  let requestData = JSON.stringify({ 
      type: "createDepartment", 
      ...locationData 
  });
  
  // Debug: Log the final request data
  // console.log("Request data:", requestData);

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          // console.log("Success response:", response);
          // populatePersonnelData();
          //refresh the page after 
          // location.reload();
          $("#departmentsBtn").click();
          alert(`Department added successfully`);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error details:', {
              status: jqXHR.status,
              statusText: jqXHR.statusText,
              responseText: jqXHR.responseText,
              textStatus: textStatus,
              errorThrown: errorThrown
          });
          alert("Failed to add department. Check console for details.");
      }
  });
  
});




// updating department data****************************************************
//populate modal with deparment id data when updatedepartmentBtn is clicked
let selectedDepartmentlID;
$(document).on('click', '.updateDepartmentBtn', function() {
  selectedDepartmentlID = $(this).data('id');
  console.log("I got in department id:", selectedDepartmentlID);

  

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getDepartmentByID", id: selectedDepartmentlID},
    success: function (data) {
        // console.log(data);
        let departmentLocation = data.locationID;

        // console.log("department location", departmentLocation);
        $("#updateDepartment").val(data.name);
        
        fetchAllLocation().then(locationData => {
        // console.log(locationData); // Log the location data for debugging

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
  console.log("selectedDepartmentlID",selectedDepartmentlID);
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

  // Debug: Log the data being sent
  console.log("Department Data before sending:", departmentData);
  console.log("Selected ID:", selectedDepartmentlID);

  let requestData = JSON.stringify({ 
      type: "updateDepartment",
      ...departmentData
  });
  
  // Debug: Log the final request data
  console.log("Request data:", requestData);

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          
        //refresh the page after 
        $("#departmentsBtn").click();
          alert(`Department with ID: ${selectedDepartmentlID} updated successfully`);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error details:', {
              status: jqXHR.status,
              statusText: jqXHR.statusText,
              responseText: jqXHR.responseText,
              textStatus: textStatus,
              errorThrown: errorThrown
          });
          alert("Failed to update department. Check console for details.");
      }
  });
});


$(document).on('click', '.deletePersonnelBtn', function(){
  console.log("delete btn click in department")

  selectedDepartmentDeleteID = $(this).data('id');
  console.log(selectedDepartmentDeleteID);


  $('#confirmDeleteDepartmentBtn').on('click',function(){
    $('#deleteDepartmentModal').modal('hide');
    location.reload();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "deleteDepartmentByID", id: selectedDepartmentDeleteID },
      success: function(data) {
        // console.log(data);
        populateDepartmentData();
        alert(`Department with ID: ${selectedDepartmentDeleteID} deleted successfully`);
        
        //refresh the page after 
        location.reload();
        $("#departmentBtn").click();

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
    });

  })
});

// searching department
$(document).on("keyup", ".searchInputDepartment",function (event) {
  event.preventDefault();
  console.log("department search btn clicked");
  let searchValue = $(this).val();
  if (searchValue !== '') {
    $("#departmentTableBody").empty();
    // $("#departmentTableBody").empty();
    // $("#locationTableBody").empty();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "searchDepartment", searchValue: searchValue },
      dataType: 'json', // Ensure the response is parsed as JSON
      success: function(data) {
        // console.log(data);
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
  // console.log("Add Button clicked");
  $("#createLocationModal").modal("hide");
  
  let locationData = {
      name: $("#createLocation").val()
  };



  let requestData = JSON.stringify({ 
      type: "createLocation", 
      ...locationData 
  });
  
  // Debug: Log the final request data
  // console.log("Request data:", requestData);

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          // console.log("Success response:", response);
          // populatePersonnelData();
          //refresh the page after 
          // location.reload();
          $("#LocationBtn").click();
          alert(`Location added successfully`);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error details:', {
              status: jqXHR.status,
              statusText: jqXHR.statusText,
              responseText: jqXHR.responseText,
              textStatus: textStatus,
              errorThrown: errorThrown
          });
          alert("Failed to add department. Check console for details.");
      }
  });
  
});


// updating location data****************************************************
//populate modal with location id data when updatelocationBtn is clicked
let selectedLocationID;
$(document).on('click', '.updateLocationBtn', function() {
  selectedLocationID = $(this).data('id');
  console.log("btn clicked in location id:", selectedLocationID);

  

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data : {type: "getLocationByID", id: selectedLocationID},
    success: function (data) {
        // console.log(data);
        // let departmentLocation = data.id;

        // console.log("department location", departmentLocation);
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
  console.log("selectedLocationDeleteID",selectedLocationID);
return selectedLocationID;
});

$('#updateLocationBtnConfirm').on('click', function(event) {
  event.preventDefault();

  $('#UpdateLocationModal').modal('hide');
  let locationData = {
      id: selectedLocationID,
      name: $("#updateLocation").val()
  };

  // Debug: Log the data being sent
  console.log("Location Data before sending:", locationData);
  console.log("Selected ID:", selectedLocationID);

  let requestData = JSON.stringify({ 
      type: "updateLocation",
      ...locationData
  });
  
  // Debug: Log the final request data
  console.log("Request data:", requestData);

  $.ajax({
      url: './../api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          
        //refresh the page after 
        $("#locationBtn").click();
          alert(`Location with ID: ${selectedLocationID} updated successfully`);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error details:', {
              status: jqXHR.status,
              statusText: jqXHR.statusText,
              responseText: jqXHR.responseText,
              textStatus: textStatus,
              errorThrown: errorThrown
          });
          alert("Failed to update location. Check console for details.");
      }
  });
});

// deleting location 
$(document).on('click', '.deleteLocationBtn', function(){
  console.log("delete btn click in location")

  selectedLocationDeleteID = $(this).data('id');
  console.log(selectedLocationDeleteID);


  $('#confirmDeleteLocationBtn').on('click',function(){
    $('#deleteLocationModal').modal('hide');
    // location.reload();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "deleteLocationByID", id: selectedLocationDeleteID },
      success: function(data) {
        console.log(data);
        $("#locationBtn").click();
        alert(`Location with ID: ${selectedLocationDeleteID} deleted successfully`);
        
        //refresh the page after 
        
        

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
    });

  })
});

// searchng location
$(document).on("keyup", ".searchInputLocation",function (event) {
  event.preventDefault();
  console.log("Location search input active");
  let searchValue = $(this).val();
  console.log("search value",searchValue);
  if (searchValue !== '') {
    $("#locationTableBody").empty();
    // $("#departmentTableBody").empty();
    // $("#locationTableBody").empty();
    $.ajax({
      url: './../api/personnelAPI.php',
      method: "GET",
      data: { type: "searchLocation", searchValue: searchValue },
      dataType: 'json', // Ensure the response is parsed as JSON
      success: function(data) {
        // console.log(data);
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