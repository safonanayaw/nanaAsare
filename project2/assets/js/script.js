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
            <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.departmentID}</td>
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

$(document).ready(function (){

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
      console.log(data);
      console.log(data.firstName);

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
          departmentDropdown.append(`<option value="${department.id}">${department.name}</option>`);
        });
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
      url: '/nanaAsare/project2/api/personnelAPI.php',
      method: 'POST',
      data: requestData,
      contentType: 'application/json',
      success: function(response) {
          console.log("Success response:", response);
          populatePersonnelData();
          
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
})

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
        console.log(data);
        populatePersonnelData();
        alert(`Personnel with ID: ${selectedPersonnelDeleteID} deleted successfully`);
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


// $("#searchInp").on("keyup", function () {
  
//     // your code
    
//   });
  
//   $("#refreshBtn").click(function () {
    
//     if ($("#personnelBtn").hasClass("active")) {
      
//       // Refresh personnel table
      
//     } else {
      
//       if ($("#departmentsBtn").hasClass("active")) {
        
//         // Refresh department table
        
//       } else {
        
//         // Refresh location table
        
//       }
      
//     }
    
//   });
  
//   $("#filterBtn").click(function () {
    
//     // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
//   });
  
//   $("#addBtn").click(function () {
    
//     // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
//   });
  
//   $("#personnelBtn").click(function () {
    
//     // Call function to refresh personnel table
    
//   });
  
//   $("#departmentsBtn").click(function () {
    
//     // Call function to refresh department table
    
//   });
  
//   $("#locationsBtn").click(function () {
    
//     // Call function to refresh location table
    
//   });
  
//   $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
//     $.ajax({
//       url:
//         "https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php",
//       type: "POST",
//       dataType: "json",
//       data: {
//         // Retrieve the data-id attribute from the calling button
//         // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
//         // for the non-jQuery JavaScript alternative
//         id: $(e.relatedTarget).attr("data-id") 
//       },
//       success: function (result) {
//         var resultCode = result.status.code;
  
//         if (resultCode == 200) {
          
//           // Update the hidden input with the employee id so that
//           // it can be referenced when the form is submitted
  
//           $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
//           $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
//           $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
//           $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
//           $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
//           $("#editPersonnelDepartment").html("");
  
//           $.each(result.data.department, function () {
//             $("#editPersonnelDepartment").append(
//               $("<option>", {
//                 value: this.id,
//                 text: this.name
//               })
//             );
//           });
  
//           $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
//         } else {
//           $("#editPersonnelModal .modal-title").replaceWith(
//             "Error retrieving data"
//           );
//         }
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         $("#editPersonnelModal .modal-title").replaceWith(
//           "Error retrieving data"
//         );
//       }
//     });
//   });
  
//   // Executes when the form button with type="submit" is clicked
  
//   $("#editPersonnelForm").on("submit", function (e) {
    
//     // Executes when the form button with type="submit" is clicked
//     // stop the default browser behviour
  
//     e.preventDefault();
  
//     // AJAX call to save form data
    
//   });
  