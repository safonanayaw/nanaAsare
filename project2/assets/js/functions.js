export function updateHeadDiv(searchBtnID = "searchBtn", refreshBtnID = "refreshBtn", filterBtnID = "filterBtn", addBtnID = "addBtn", addModalBtn = "#createPersonnelModal") {
    
    var defaultHeadDiv = document.getElementById("headDiv");
    defaultHeadDiv.innerHTML = "";

    
    var frag = document.createDocumentFragment();

    // Create the first div (search input)
    var colDiv = document.createElement("div");
    colDiv.className = "col";

    var searchInput = document.createElement("input");
    searchInput.id = searchBtnID;
    searchInput.className = "form-control mb-3";
    searchInput.placeholder = "search";

    colDiv.appendChild(searchInput);
    frag.appendChild(colDiv);

    // Create the second div (buttons)
    var btnContainerDiv = document.createElement("div");
    btnContainerDiv.className = "col-5 text-end me-2";

    var btnGroupDiv = document.createElement("div");
    btnGroupDiv.className = "btn-group";
    btnGroupDiv.setAttribute("role", "group");
    btnGroupDiv.setAttribute("aria-label", "buttons");

    // Create Refresh Button
    var refreshBtn = document.createElement("button");
    refreshBtn.id = refreshBtnID;
    refreshBtn.type = "button";
    refreshBtn.className = "btn btn-primary";

    var refreshIcon = document.createElement("i");
    refreshIcon.className = "fa-solid fa-refresh fa-fw";

    refreshBtn.appendChild(refreshIcon);
    btnGroupDiv.appendChild(refreshBtn);

    // Create Filter Button
    var filterBtn = document.createElement("button");
    filterBtn.id = filterBtnID;
    filterBtn.type = "button";
    filterBtn.className = "btn btn-primary";
    filterBtn.setAttribute("data-bs-toggle", "modal");
    filterBtn.setAttribute("data-bs-target", "#filterPersonnelModal");

    var filterIcon = document.createElement("i");
    filterIcon.className = "fa-solid fa-filter fa-fw";

    filterBtn.appendChild(filterIcon);
    btnGroupDiv.appendChild(filterBtn);

    // Create Add Button
    var addBtn = document.createElement("button");
    addBtn.id = addBtnID;
    addBtn.type = "button";
    addBtn.className = "btn btn-primary";
    addBtn.setAttribute("data-bs-toggle", "modal");
    addBtn.setAttribute("data-bs-target", addModalBtn);

    var addIcon = document.createElement("i");
    addIcon.className = "fa-solid fa-plus fa-fw";

    addBtn.appendChild(addIcon);
    btnGroupDiv.appendChild(addBtn);

    
    btnContainerDiv.appendChild(btnGroupDiv);
    frag.appendChild(btnContainerDiv);

   
    defaultHeadDiv.appendChild(frag);
}




export function populatePersonnelTable(data) {
  
  var tableBody = document.getElementById("personnelTableBody");
  tableBody.innerHTML = "";

  var frag = document.createDocumentFragment();

  try {
      if (Array.isArray(data)) {
          data.forEach(function(personnel) {
              // Create a new table row
              var row = document.createElement("tr");

              // First cell: First and Last Name
              var tdName = document.createElement("td");
              tdName.className = "align-middle text-nowrap";
              tdName.textContent = personnel.lastName + ", " + personnel.firstName;
              row.appendChild(tdName);

              // Second cell: Job Title
              var tdJob = document.createElement("td");
              tdJob.className = "align-middle text-nowrap d-none d-md-table-cell";
              tdJob.textContent = personnel.departmentName;
              row.appendChild(tdJob);

              // Third cell: Department Name
              var tdDept = document.createElement("td");
              tdDept.className = "align-middle text-nowrap d-none d-md-table-cell";
              tdDept.textContent = personnel.locationName;
              row.appendChild(tdDept);

              // Fourth cell: Email
              var tdEmail = document.createElement("td");
              tdEmail.className = "align-middle text-nowrap d-none d-md-table-cell";
              tdEmail.textContent = personnel.email;
              row.appendChild(tdEmail);

              // Fifth cell: Action Buttons
              var tdButtons = document.createElement("td");
              tdButtons.className = "text-end text-nowrap";

              // Create the edit button
              var editBtn = document.createElement("button");
              editBtn.type = "button";
              editBtn.className = "btn btn-primary btn-sm";
              editBtn.style.marginRight = "5px";
              editBtn.setAttribute("data-bs-toggle", "modal");
              editBtn.setAttribute("data-bs-target", "#editPersonnelModal");
              editBtn.setAttribute("data-id", personnel.id);

              var editIcon = document.createElement("i");
              editIcon.className = "fa-solid fa-pencil fa-fw";
              editBtn.appendChild(editIcon);

              tdButtons.appendChild(editBtn);

              // Create the delete button
              var deleteBtn = document.createElement("button");
              deleteBtn.type = "button";
              deleteBtn.className = "btn btn-primary btn-sm";
              deleteBtn.setAttribute("data-bs-toggle", "modal");
              deleteBtn.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
              deleteBtn.setAttribute("data-id", personnel.id);

              var deleteIcon = document.createElement("i");
              deleteIcon.className = "fa-solid fa-trash fa-fw";
              deleteBtn.appendChild(deleteIcon);

              tdButtons.appendChild(deleteBtn);

              // Append the button cell to the row
              row.appendChild(tdButtons);

              frag.appendChild(row);
          });
      } else {
          throw new TypeError("Invalid data format");
      }
  } catch (error) {
     
      return;
  }

  tableBody.appendChild(frag);
}


export function populateDepartmentTable(data){

    var tableBody = document.getElementById("departmentTableBody");
    tableBody.innerHTML = "";

    // Create a DocumentFragment to hold the new rows
    var frag = document.createDocumentFragment();

    // Iterate over the data and create table rows
    data.forEach(function(department) {
      // Create a new table row
      var row = document.createElement("tr");
      
      // Create the first cell: department name
      var tdName = document.createElement("td");
      tdName.className = "align-middle text-nowrap";
      tdName.textContent = department.name;
      row.appendChild(tdName);
      
      // Create the second cell: department location
      var tdLocation = document.createElement("td");
      tdLocation.className = "align-middle text-nowrap d-none d-md-table-cell";
      tdLocation.textContent = department.departmentLocation;
      row.appendChild(tdLocation);
      
      // Create the third cell for action buttons
      var tdActions = document.createElement("td");
      tdActions.className = "align-middle text-end text-nowrap";
      
      // Create the edit button
      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-primary btn-sm";
      editBtn.style.marginRight = "5px";
      editBtn.setAttribute("data-bs-toggle", "modal");
      editBtn.setAttribute("data-bs-target", "#editDepartmentModal");
      editBtn.setAttribute("data-id", department.id); 

      var editIcon = document.createElement("i");
      editIcon.className = "fa-solid fa-pencil fa-fw";
      editBtn.appendChild(editIcon);
      tdActions.appendChild(editBtn);
      
      // Create the delete button
      var deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-primary btn-sm deleteDepartmentBtn";
    //   editBtn.setAttribute("data-bs-toggle", "modal");
    //   editBtn.setAttribute("data-bs-target", "");
      deleteBtn.setAttribute("data-id", department.id); 

      var deleteIcon = document.createElement("i");
      deleteIcon.className = "fa-solid fa-trash fa-fw";
      deleteBtn.appendChild(deleteIcon);
      tdActions.appendChild(deleteBtn);
      
      // Append the actions cell to the row
      row.appendChild(tdActions);
      

      frag.appendChild(row);
    });

    tableBody.appendChild(frag);

};

export function populateLocationTable(data){

    var tableBody = document.getElementById("locationTableBody");
    tableBody.innerHTML = "";


    var frag = document.createDocumentFragment();

    data.forEach(function(location) {
    // Create a new table row
    var row = document.createElement("tr");

    // First cell: location name
    var tdName = document.createElement("td");
    tdName.className = "align-middle text-nowrap";
    tdName.textContent = location.name;
    row.appendChild(tdName);

    // Second cell: action buttons
    var tdActions = document.createElement("td");
    tdActions.className = "align-middle text-end text-nowrap";

    // Create the edit button
    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-primary btn-sm";
    editBtn.style.marginRight = "5px";
    editBtn.setAttribute("data-id", location.id);
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#editLocationModal");
    var editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pencil fa-fw";
    editBtn.appendChild(editIcon);
    tdActions.appendChild(editBtn);

    // Create the delete button
    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-primary btn-sm deleteLocationBtn";
    deleteBtn.setAttribute("data-id", location.id);
    var deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash fa-fw";
    deleteBtn.appendChild(deleteIcon);
    tdActions.appendChild(deleteBtn);

    row.appendChild(tdActions);

    frag.appendChild(row);
    });

    tableBody.appendChild(frag);
}

export function populateFilterDepartment(data) {
  let departmentSelect = document.getElementById("filterPersonnelByDepartment");
  departmentSelect.innerHTML = "";

  // Create default option
  let defaultOption = document.createElement("option");
  defaultOption.value = "All";
  defaultOption.textContent = "All";
  departmentSelect.appendChild(defaultOption);

  data.forEach(department => {
      let option = document.createElement("option");
      option.value = department.id;
      option.textContent = department.name;
      departmentSelect.appendChild(option);
  });
}

export function populateFilterLocation(data) {
  let locationSelect = document.getElementById("filterPersonnelByLocation");
  locationSelect.innerHTML = "";

  // Create default option
  let defaultOption = document.createElement("option");
  defaultOption.value = "All";
  defaultOption.textContent = "All";
  locationSelect.appendChild(defaultOption);

  data.forEach(location => {
      let option = document.createElement("option");
      option.value = location.id;
      option.textContent = location.name;
      locationSelect.appendChild(option);
  });
}

