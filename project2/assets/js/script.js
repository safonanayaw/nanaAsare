//fetch and populate personnel data
function populatePersonnelData(){
  $.ajax({
    url: '/nanaAsare/project2/api/personnelAPI.php',
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
            <td class="text-end text-nowrap">
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
    url: '/nanaAsare/project2/api/personnelAPI.php',
    method: 'GET',
    dataType: 'json',
    data: {type: "getDepartment"},
    success: function(data) {
      // console.log(data);
      // Clear the existing table body
      $('#departmentTableBody').empty();

      // Iterate over the data and create table rows
      data.forEach(function(department) {
        var row = `
          <tr>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${department.id}</td>
            <td class="align-middle text-nowrap">${department.name}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${department.departmentLocation}</td>

            <td class="text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm updateDepartmentBtn" data-bs-toggle="modal" data-bs-target="#createDepartmentModal" data-id="${department.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
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

// $("#departments-tab-pane").on('click', function(){
//   populateDepartmentData();
// })


//fetch de[artment data and fill the department table;
populateDepartmentData();


//fetch personnel data and fill personnel table
populatePersonnelData();

//department data function
function fetchAllDepartment() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/nanaAsare/project2/api/personnelAPI.php',
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
      url: '/nanaAsare/project2/api/personnelAPI.php',
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
  //show or hide search and btn container
  $("#departmentsBtn").on('click', function(){
    $("#searchAndButttons").hide();
  });
  
  
  $("#personnelBtn").on('click', function(){
    $("#searchAndButttons").show();
  });
  
  $("#locationsBtn").on('click', function(){
    $("#searchAndButttons").hide();
  });



$("#refreshBtn").on('click', function(){
  location.reload();
})

//populate department when add personnel btn is click
$("#addBtn").on('click', function(){
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
  console.log("Add Button clicked");
  $("#createPersonnelModal").modal("hide");

  let personnelData = {
      firstName: $("#createPersonnelFirstName").val(),
      lastName: $("#createPersonnelLastName").val(),
      jobTitle: $("#createPersonnelJobTitle").val(),
      email: $("#createPersonnelEmailAddress").val(),
      departmentID: parseInt($("#createPersonnelDepartmentID").val())
  };

  // Debug: Log the data being sent
  console.log("Personnel Data before sending:", personnelData);

  let requestData = JSON.stringify({ 
      type: "createPersonnel", 
      ...personnelData 
  });
  
  // Debug: Log the final request data
  console.log("Request data:", requestData);

  $.ajax({
      url: '/nanaAsare/project2/api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          // populatePersonnelData();
          //refresh the page after 
          location.reload();
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
    url: '/nanaAsare/project2/api/personnelAPI.php',
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
$("#updatePersonnelBtn").on('click', function(event) {
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
      url: '/nanaAsare/project2/api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          // populatePersonnelData();
        //refresh the page after 
        location.reload();
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
  selectedPersonnelDeleteID = $(this).data('id');
  console.log(selectedPersonnelDeleteID);


  $('#confirmDeletePersonnelBtn').on('click', function(){
    $('#deletePersonnelModal').modal('hide');
    $.ajax({
      url: '/nanaAsare/project2/api/personnelAPI.php',
      method: "GET",
      data: { type: "deletePersonnelByID", id: selectedPersonnelDeleteID },
      success: function(data) {
        // console.log(data);
        populatePersonnelData();
        alert(`Personnel with ID: ${selectedPersonnelDeleteID} deleted successfully`);
        //refresh the page after 
        location.reload();
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


$("#searchInp").on("keyup", function (event) {
  event.preventDefault();

  let searchValue = $(this).val();
  if (searchValue !== '') {
    $("#personnelTableBody").empty();

    $.ajax({
      url: '/nanaAsare/project2/api/personnelAPI.php',
      method: "GET",
      data: { type: "search", searchValue: searchValue },
      dataType: 'json', // Ensure the response is parsed as JSON
      success: function(data) {
        // console.log(data);
        // Iterate over the data and create table rows
        data.forEach(function(personnel) {
          var row = `
            <tr>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.id}</td>
              <td class="align-middle text-nowrap">${personnel.firstName}, ${personnel.lastName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.jobTitle}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell" data-id="${personnel.departmentID}">${personnel.departmentName}</td>
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
        $("#personnelTableBody").html(`<h3 class="text-danger"> Sorry no results found for "${searchValue}" </h3>`);
      }
    });
  } else {
    populatePersonnelData();
  }
});





//populate modal with deparment id data when updatedepartmentBtn is clicked
let selectedDepartmentlID;
$(document).on('click', '.updateDepartmentBtn', function() {
  selectedDepartmentlID = $(this).data('id');
  console.log("I got in department id:", selectedDepartmentlID);

  $.ajax({
    url: '/nanaAsare/project2/api/personnelAPI.php',
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

  $('#createDepartmentModal').modal('hide');
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
      url: '/nanaAsare/project2/api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          
        //refresh the page after 
        location.reload();
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