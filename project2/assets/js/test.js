let selectedPersonnelID; // Declare a variable to store the selected personnel ID

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  selectedPersonnelID = $(e.relatedTarget).attr("data-id"); // Store the data-id in the variable

  $.ajax({
    url: './../api/personnelAPI.php',
    method: "GET",
    data: { type: "getPersonnelByID", id: selectedPersonnelID },
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
          departmentDropdown.append(`<option value="${department.id}">${department.name}</option>`);
        });

        // Change department option to selected personnel
        $("#editPersonnelDepartment").val(personnelDepartment).change();
      })
      .catch(error => {
        console.error(error);
      });
    }
  });
});

$("#editPersonnelForm").on("submit", function (event) {
  event.preventDefault();

  $('#editPersonnelModal').modal('hide');

  // Create a FormData object from the form element
  let form = document.getElementById('editPersonnelForm');
  let formData = new FormData(form);

  // Convert FormData to JSON object
  let personnelData = {};
  formData.forEach((value, key) => {
    personnelData[key] = value;
  });

  // Use the stored selectedPersonnelID
  personnelData.id = selectedPersonnelID;

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

        // Reset the form
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