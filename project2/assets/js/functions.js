export function updateHeadDiv(searchBtnID = "searchBtn", refreshBtnID = "refreshBtn", filterBtnID = "filterBtn", addBtnID = "addBtn", addModalBtn = "#createPersonnelModal") {
    // Get and clear the existing container
    var defaultHeadDiv = document.getElementById("headDiv");
    defaultHeadDiv.innerHTML = "";

    // Create a DocumentFragment
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

    // Append the button group to its container
    btnContainerDiv.appendChild(btnGroupDiv);
    frag.appendChild(btnContainerDiv);

    // Append the fragment to the actual DOM element
    defaultHeadDiv.appendChild(frag);
}




export function populatePersonnelTable(data) {
    // Get and clear the existing table body
    var tableBody = document.getElementById("personnelTableBody");
    tableBody.innerHTML = "";

    var frag = document.createDocumentFragment();
  

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
      
      // Append the complete row to the DocumentFragment
      frag.appendChild(row);
    });
  
    // Append the entire DocumentFragment to the table body
    tableBody.appendChild(frag);
  };


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
      
      // Append the complete row to the DocumentFragment
      frag.appendChild(row);
    });

    // Append the entire DocumentFragment to the table body in one operation
    tableBody.appendChild(frag);

};

export function populateLocationTable(data){

    var tableBody = document.getElementById("locationTableBody");
    tableBody.innerHTML = "";


    var frag = document.createDocumentFragment();

    // Iterate over the data and create table rows
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

    // Append the actions cell to the row
    row.appendChild(tdActions);

    // Append the complete row to the DocumentFragment
    frag.appendChild(row);
    });

    // Append the entire DocumentFragment to the table body
    tableBody.appendChild(frag);
}

export function populateFilterDepartment(data){

    let departmentFilterDropdown = document.getElementById("selectDepartmentOption");
    departmentFilterDropdown.innerHTML = '';

    // Create a DocumentFragment for departments
    let departmentFrag = document.createDocumentFragment();

    data.forEach(department => {
        // Create list item
        let li = document.createElement("li");

        // Create form-check div
        let div = document.createElement("div");
        div.className = "form-check";

        // Create input checkbox
        let input = document.createElement("input");
        input.className = "form-check-input dept-checkbox";
        input.type = "checkbox";
        input.value = department.id;
        input.id = "dept" + department.id;

        // Create label
        let label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = "dept" + department.id;
        label.textContent = department.name;

        // Append input and label to div
        div.appendChild(input);
        div.appendChild(label);

        // Append div to list item
        li.appendChild(div);

        // Append list item to DocumentFragment
        departmentFrag.appendChild(li);
    });

    // Append the DocumentFragment to the dropdown
    departmentFilterDropdown.append(departmentFrag);

}

export function populateFilterLocation(data){
    let locationFilterDropdown = document.getElementById("selectLocationOption");
        locationFilterDropdown.innerHTML = '';

        // Create a DocumentFragment for locations
        let locationFrag = document.createDocumentFragment();

        data.forEach(location => {
            // Create list item
            let li = document.createElement("li");

            // Create form-check div
            let div = document.createElement("div");
            div.className = "form-check";

            // Create input checkbox
            let input = document.createElement("input");
            input.className = "form-check-input loc-checkbox";
            input.type = "checkbox";
            input.value = location.id;
            input.id = "loc" + location.id;

            // Create label
            let label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = "loc" + location.id;
            label.textContent = location.name;

            // Append input and label to div
            div.appendChild(input);
            div.appendChild(label);

            // Append div to list item
            li.appendChild(div);

            // Append list item to DocumentFragment
            locationFrag.appendChild(li);
        });

        // Append the DocumentFragment to the dropdown
        locationFilterDropdown.append(locationFrag);
}
