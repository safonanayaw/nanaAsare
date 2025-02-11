

var road = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var googleSat =  L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: "google satelite street map"
});





$(document).ready(function () {
    $('body').show();

    // Loading functions
    let timer;

    // show loader
    showLoader();

    //api call directory
    setTimeout(() => {
        hideLoader();
    }, 4000); 
    


    function showLoader() {
        console.log("showLoader called");
        timer = setTimeout(() => {
            $("#preloader").addClass("active");
            console.log("I start loading");
        }, 2000);
    }

    function hideLoader() {
        console.log("hideLoader called");
        $("#preloader").removeClass("active");
        clearTimeout(timer);
        console.log("done loading");
        $('body').show();
    }
 
    const apiUrl = "libs/php/apiHandler.php";

    // Initialize marker cluster group globally
    const earthquakeMarkers = L.markerClusterGroup(
        {
            polygonOptions: {
                fillColor: "#fff",
                color: "#000",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              }
            }
    );
    let layerControlEarthQuake = null;

    //declaring marker
    let marker, lat, lng, openCageData, description, userCountryCode, userCountryCapital;
    let selectedCountryCode;
    let onFirstLoad = true;

    // Store fetched country data for searching
    let countryList = []; 
    
    //set user selecting location to false on app initial load
    let isManualSelection = false; 
    let watchId;



    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }

    //fetch country name for dropdown
    async function fetchAndPopulateCountryDropdown(){
        try {
            const response = await fetch("assets/data/countryBorders.json");
            if(!response.ok){
                throw new Error("Failed to fetch country data");
            }
            const data = await response.json();

            const dropdown = $("#countryDropdown");
            dropdown.empty(); 
            dropdown.append('<option value="">Select a country...</option>'); 
    
            data.features.forEach(feature => {
                if(feature.properties){
                const countryCode = feature.properties.iso_a2;
                const countryName = feature.properties.name;
                countryList.push({code: countryCode, name: countryName});
                dropdown.append();  
                }
            });

            countryList.sort((a,b) => a.name.localeCompare(b.name));
            countryList.forEach((country)=> {
                dropdown.append(`<option value="${country.code}">${country.name} (${country.code})</option>`)
            });
          
            return countryList;
        }catch(error){
            alert("Failed to load country data. Please refresh the page and try again.");
            console.error(error);
        }
    }
    // call fxn to fetch countrylist data
    fetchAndPopulateCountryDropdown();






    // Initialize Map
    const map = L.map('map',{
        layers: [road]
    }).setView([54.5, -4], 6);

    //basemap layer button
    var basemaps = {
        "road": road,
        "googleSat": googleSat
        
    };

    const overLayMaps = {
        "Airports": L.markerClusterGroup(
            {
                polygonOptions: {
                    fillColor: "#fff",
                    color: "#000",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                  }
                }
        ),
        "Hotels": L.markerClusterGroup(
            {
                polygonOptions: {
                    fillColor: "#fff",
                    color: "#000",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.5
                  }
                }
        ),
        "Cities": L.markerClusterGroup({
            polygonOptions: {
                fillColor: "#fff",
                color: "#000",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              }
            }
        )
    }

    layerControl = L.control.layers(basemaps, overLayMaps, {
        collapse: false
    }).addTo(map);

    //info button
    infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
            $("#exampleModal").modal("show");
        });
    infoBtn.addTo(map);

    // Country Information easyButton
    countryInfoBtn = L.easyButton("fa-globe fa-xl", function (btn, map) {
        $("#countryInfoModal").modal("show");
    });
    countryInfoBtn.addTo(map);

    // weather easyButton
    const weatherBtn = L.easyButton("fa-cloud-sun fa-xl", function (btn, map) {
        $("#weatherInfo").modal("show");
        });
        weatherBtn.addTo(map);

    // Wiki Information easyButton
    const wikipediaBtn = L.easyButton("fa-book fa-xl", function (btn, map) {
        $("#wikipediaModal").modal("show");
      });
      wikipediaBtn.addTo(map);


   // currency easyButton
    const currencyBtn = L.easyButton("fa-calculator fa-xl", function (btn, map) {
        $("#currencyInfoModal").modal("show");
      });
      currencyBtn.addTo(map);
      

      // news easyButton
      const newsBtn = L.easyButton("fa-newspaper fa-xl", function (btn, map) {
        $("#newsModal").modal("show");
      });
      newsBtn.addTo(map);
    // Show loading indicator
    $("#loading").show();

    // Functions declaration start here *********************************************************


    // country border function
    let currentCountryBorder = null;

    async function highlightCountryBorders(countryCode){
        try{
            const response = await fetch("assets/data/countryBorders.json");
            if(!response.ok){
                throw new Error("Failed to load GeoJSON country border file.");

            }
            const data = await response.json();
            const country = data.features.find(
            feature => feature.properties.iso_a2 === countryCode
                );
            if(country){
                if(currentCountryBorder){
                    map.removeLayer(currentCountryBorder);
                    }
                    const polygonOptions = {
                        fillColor: "#fff",
                        color: "#ff0000", 
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.5
                    };
                    // Add the new country border with the specified options
                    currentCountryBorder = L.geoJSON(country, { style: polygonOptions });
                currentCountryBorder.addTo(map);
                map.fitBounds(currentCountryBorder.getBounds());
            };
        }
    catch(error){
        console.error(error.message);
        }
    };

    // geocode function
    function getGeocodeReverse(lat, lng) {
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "geocodeReverse", lat: lat, lng: lng},
                dataType: "json",
                success: function (response){
                    openCageData = response.results;
                    userCountryCode = openCageData[0].components["ISO_3166-1_alpha-2"];
                    description = openCageData[0].formatted;
                    const countryNameoObject = countryList.find(country=> userCountryCode === country.code);
                    const countryName = countryNameoObject.name;
                    const currencyCode = openCageData[0].annotations.currency.iso_code

                    if(lat && lng && description, countryName){
                        resolve({lat, lng, userCountryCode, description, countryName, currencyCode});
                        };
                    },
                    error: function(){
                        alert("Failed to reverse geocode");
                    reject("Failed to reverse geocode for current user location");
                    },
                });
        });
    }



    //geocode function
    function geoCode (query) {
        return new Promise((resolve, reject)=>{
            const urlQuery = encodeURIComponent(query);
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "geocode", query: urlQuery },
                dataType: "json",
                success: function(response) {
                    if(response.results){
                        const bounds = response.results[0].bounds;
                        resolve({response, bounds});
                    }else{
                        reject("no geoCode info found")
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching geoCode:", textStatus, errorThrown);
                    reject("Failed to fetch geoCode information.");
                },
            })
        })
    }

    //country's earth quake data function
    function getEarthquake(north, south, east, west) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "earthquarkes", north: north, south: south, east: east, west: west },
                dataType: "json",
                success: function(response) {
                    if (response.earthquakes) {
                        const earthQuakeData = response.earthquakes;

                        // Clear existing markers
                        earthquakeMarkers.clearLayers();
                        
                        // Remove existing layer control if it exists
                        if (layerControlEarthQuake) {
                            layerControlEarthQuake.remove();
                            layerControlEarthQuake = null;
                        }

                        function getMarkerSize(magnitude) {
                            return Math.max(magnitude * 5, 8);
                        }

                        function getMarkerColor(magnitude) {
                            if (magnitude >= 6) return '#d32f2f';
                            if (magnitude >= 5) return '#f57c00';
                            return '#7cb342';
                        }

                        // Add new markers
                        earthQuakeData.forEach(quake => {
                            const size = getMarkerSize(quake.magnitude);
                            const color = getMarkerColor(quake.magnitude);
                            
                            const circleMarker = L.circleMarker([quake.lat, quake.lng], {
                                radius: size,
                                fillColor: color,
                                color: '#fff',
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });

                            const date = new Date(quake.datetime);
                            const formattedDate = date.toLocaleString();

                            const popupContent = `
                                <div class="earthquake-popup">
                                    <h3>Earthquake Details</h3>
                                    <p><span class="magnitude">Magnitude: ${quake.magnitude}</span></p>
                                    <p>Depth: ${quake.depth} km</p>
                                    <p>Date: ${formattedDate}</p>
                                    <p>Location: ${quake.lat.toFixed(4)}, ${quake.lng.toFixed(4)}</p>
                                    <p>ID: ${quake.eqid}</p>
                                </div>
                            `;

                            circleMarker.bindPopup(popupContent);
                            earthquakeMarkers.addLayer(circleMarker);
                        });

                        // Create custom control only if it doesn't exist
                        if (!layerControlEarthQuake) {
                            L.Control.LayerCheckbox = L.Control.extend({
                                onAdd: function(map) {
                                    const div = L.DomUtil.create('div', 'leaflet-control-layers-checkbox');
                                    div.innerHTML = `
                                        <label>
                                            <input type="checkbox" id="earthquakeLayerCheckbox" class="small-checkbox" checked>
                                            <span class="checkbox-text">Earthquake</span>
                                        </label>
                                    `;

                                    // Prevent map click events when interacting with the control
                                    L.DomEvent.disableClickPropagation(div);

                                    // Add event listener for checkbox
                                    const checkbox = div.querySelector('#earthquakeLayerCheckbox');
                                    checkbox.addEventListener('change', function(e) {
                                        if (e.target.checked) {
                                            map.addLayer(earthquakeMarkers);
                                        } else {
                                            map.removeLayer(earthquakeMarkers);
                                        }
                                    });

                                    return div;
                                }
                            });

                            layerControlEarthQuake = new L.Control.LayerCheckbox({
                                position: 'topright'
                            }).addTo(map);
                        }

                        // Ensure markers are added to map
                        if (!map.hasLayer(earthquakeMarkers)) {
                            map.addLayer(earthquakeMarkers);
                        }

                        resolve({ earthQuakeData });
                    } else {
                        reject("no earthquake data found");
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                    console.error("Error fetching earthquake data:", textStatus, errorThrown);
                    reject("Failed to fetch earthquake data information.");
                },
            });
        });
    }

   

    //get airprort Data for 
    function getAllAirportData(countryCode){
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "airport", countryCode: countryCode},
                dataType: "json",
                success: function(response){
                    if(response){
                        resolve(response);
                    }else{
                        reject("No current airport data found");
                    }
                }
            })
        })
    }
  
    var airportMarker = L.ExtraMarkers.icon({
        icon: 'fa-plane',
        iconColor:"black",
        markerColor: 'white',
        shape: 'square',
        prefix: 'fa'
      });
  // Add airport markers to the map
  async function addAirportsToMap(countryCode) {
    const selectAirportData = await getAllAirportData(countryCode);
    const airportData = selectAirportData.geonames;

    airportData.forEach(airport => {
        const popupContent = `
        <div class="earthquake-popup">
            <h3>Airport Details</h3>
            <p><span class="">Country Name: ${airport.countryName}</span></p>
            <p>Airport Name: ${airport.name}</p>
            <p>Coordinates: ${airport.lat}, ${airport.lng}</p>
        </div>
    `;
      const marker = L.marker([parseFloat(airport.lat), parseFloat(airport.lng)], {icon: airportMarker}).bindPopup(popupContent);
      overLayMaps["Airports"].addLayer(marker);
    });
  }

    // Event listener for "Airport" checkbox
    map.on('overlayadd', function(eventLayer) {
        if (eventLayer.name === 'Airports') {
        addAirportsToMap(selectedCountryCode);
        }
    });

    map.on('overlayremove', function(eventLayer) {
        if (eventLayer.name === 'Airports') {
        overLayMaps["Airports"].clearLayers();
        }
    });
    //******************************************************************************************/


     
     //***************function for hotel data *******************************************
    function getAllHotelData(countryCode) {
        return new Promise((resolve, reject)=> {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "hotel", countryCode: countryCode},
                dataType: "json",
                success: function(response){
                    if(response){
                        resolve(response);
                    }else{
                        reject("No current airport data found");
                    }
                }
            })
        })
    }

        
    var hotelMarker = L.ExtraMarkers.icon({
        icon: 'fa-hotel',
        markerColor: 'blue',
        shape: 'square',
        prefix: 'fa'
        });

    // Add hotel markers to the map
    async function addHotelsToMap(countryCode) {
        const selectHotelData = await getAllHotelData(countryCode);
        const hotelData = selectHotelData.geonames;

        hotelData.forEach(hotel => {
            const popupContent = `
            <div class="earthquake-popup">
                <h3>Hotel Details</h3>
                <p><span class="">Country Name: ${hotel.countryName}</span></p>
                <p>Hotel Name: ${hotel.name}</p>
                <p>Coordinates: ${hotel.lat}, ${hotel.lng}</p>
            </div>
        `;
        const marker = L.marker([parseFloat(hotel.lat), parseFloat(hotel.lng)], {icon: hotelMarker}).bindPopup(popupContent);
        overLayMaps["Hotels"].addLayer(marker);
        });
    }

    // Event listener for "Airport" checkbox
    map.on('overlayadd', function(eventLayer) {
        if (eventLayer.name === 'Hotels') {
        addHotelsToMap(selectedCountryCode);
        }
    });

    map.on('overlayremove', function(eventLayer) {
        if (eventLayer.name === 'Hotels') {
        overLayMaps["Hotels"].clearLayers();
        }
    });

    //****************************************************************************** */



     //***************function for city data *******************************************
     function getAllCitesData(countryCode) {
        return new Promise((resolve, reject)=> {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "city", countryCode: countryCode},
                dataType: "json",
                success: function(response){
                    if(response){
                        resolve(response);
                    }else{
                        reject("No current airport data found");
                    }
                }
            })
        })
    }

    // Creates a green marker with the city-icon
    var cityMarker = L.ExtraMarkers.icon({
        icon: 'fa-city',
        markerColor: 'green',
        shape: 'square',
        prefix: 'fa'
        });

    // Add city markers to the map
    async function addCitiesToMap(countryCode) {
        const selectCityData = await getAllCitesData(countryCode);
        const cityData = selectCityData.geonames;

        cityData.forEach(city => {
            const popupContent = `
            <div class="earthquake-popup">
                <h3>City Details</h3>
                <p><span class="">Country Name: ${city.countryName}</span></p>
                <p>City Name: ${city.name}</p>
                <p>Coordinates: ${city.lat}, ${city.lng}</p>
            </div>
        `;
        const marker = L.marker([parseFloat(city.lat), parseFloat(city.lng)], {icon: cityMarker}).bindPopup(popupContent);
        overLayMaps["Cities"].addLayer(marker);
        });
    }

    //   // Event listener for "Cities" checkbox
    map.on('overlayadd', function(eventLayer) {
        if (eventLayer.name === 'Cities') {
            addCitiesToMap(selectedCountryCode);
        }
    });

    map.on('overlayremove', function(eventLayer) {
        if (eventLayer.name === 'Cities') {
        overLayMaps["Cities"].clearLayers();
        }
    });

    //****************************************************************************** */

    function getCountryInfo(countryCode) {

    
        return fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch country info.");
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.length > 0) {
                    const userCountry = data[0];                    
                    return userCountry; 
                } else {
                    throw new Error("Country info not found.");
                }
            })
            .catch((error) => {
                console.error(error);
                throw error; 
            })
            .finally(() => {

            });
    }

    //function to get selected country currency info on dropdown
    let dropDowncurrencyList = {}
    function dropdownGetExchangeRate (currencyCode) { 
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "exchangeRate", currency: currencyCode},
                dataType: "json",
                success: function (response) {
                    if (response && response.rates) {
                        dropDowncurrencyList = response;
                        $("#currencyDate").text(`Date: ${response.date}`);

                        const baseCurrencyDropdown = $("#baseCurrency");

                        const targetCurrencyDropdown = $("#targetCurrency");
   
                        // Clear existing options
                        baseCurrencyDropdown.empty();

                            targetCurrencyDropdown.empty();

                            //getting the relative base USD currencyCode 
                                const targetCode = Object.keys(dropDowncurrencyList.rates).find((rateCode)=>{
                                return rateCode === "USD";
                            });

                            targetCurrencyDropdown.append(`<option value=${targetCode}>${targetCode}</option>`);

                            Object.keys(dropDowncurrencyList.rates).forEach(rateCode => {
                                targetCurrencyDropdown.append(`<option value="${rateCode}">${rateCode}</option>`);
    
                            });

                        const baseUnit = dropDowncurrencyList.rates[dropDowncurrencyList.base];

                        const targetUnit = dropDowncurrencyList.rates[targetCode];


                        $("#baseCurrencyAmountInput").val(baseUnit);

                        $("#targetCurrencyAmountInput").val(targetUnit);
                        const baseCode = dropDowncurrencyList.base;

                        // Populate dropdown with currency codes from the rates object
                        Object.keys(dropDowncurrencyList.rates).forEach(rateCode => {
                            if(rateCode === currencyCode){

                                baseCurrencyDropdown.append(`<option selected value="${rateCode}">${rateCode}</option>`);
                            }else{
                                baseCurrencyDropdown.append(`<option value="${rateCode}">${rateCode}</option>`);
                            }
                        });
    
                        resolve({response, baseCode, baseUnit, targetCode, targetUnit});
                    } else {
                        reject("No currency information found.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching currency:", textStatus, errorThrown);
                    reject("Failed to fetch currency information.");
                },
            });
        });
    }

    let currencyList = {};

    // get currencyExchange with currencyCode
    function getExchangeRate (currencyCode) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "exchangeRate", currency: currencyCode},
                dataType: "json",
                success: function (response) {
                    if (response && response.rates) {
                        currencyList = response;
                        
                        $("#currencyDate").text(`Date: ${response.date}`);
                        resolve({response});
                        // return currencyList;

                    } else {
                        reject("No currency information found.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error fetching currency:", textStatus, errorThrown);
                    reject("Failed to fetch currency information.");
                },
            });
        });
    }
    
    //user currency data 
    let userCurrencyList = {}
    function getUserExchangeRate (currencyCode) {
        if(!onFirstLoad) return;
        return new Promise((resolve, reject) => {

            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "exchangeRate", currency: currencyCode},
                dataType: "json",
                success: function (response) {
                    if (response && response.rates) {
                        userCurrencyList = response;
                        $("#currencyDate").text(`Date: ${response.date}`);

                        const baseCurrencyDropdown = $("#baseCurrency");

                        const targetCurrencyDropdown = $("#targetCurrency");

                       
                        // Clear existing options
                        baseCurrencyDropdown.empty();

                            targetCurrencyDropdown.empty();

                            //getting the relative base USD currencyCode 
                                const targetCode = Object.keys(userCurrencyList.rates).find((rateCode)=>{
                                return rateCode === "USD";
                            });

                            targetCurrencyDropdown.append(`<option value=${targetCode}>${targetCode}</option>`);

                            Object.keys(userCurrencyList.rates).forEach(rateCode => {
                                targetCurrencyDropdown.append(`<option value="${rateCode}">${rateCode}</option>`);
    
                            });

                    

                        const baseUnit = userCurrencyList.rates[userCurrencyList.base];

                        const targetUnit = userCurrencyList.rates[targetCode];


                        $("#baseCurrencyAmountInput").val(baseUnit);

                        $("#targetCurrencyAmountInput").val(targetUnit);
                        const baseCode = userCurrencyList.base;


                        // Populate dropdown with currency codes from the rates object
                        Object.keys(userCurrencyList.rates).forEach(rateCode => {
                            if(rateCode === currencyCode){

                                baseCurrencyDropdown.append(`<option selected value="${rateCode}">${rateCode}</option>`);
                            }else{
                                baseCurrencyDropdown.append(`<option value="${rateCode}">${rateCode}</option>`);
                            }
                            

                        });
    
                        resolve({response, baseCode, baseUnit, targetCode, targetUnit});
                        return countryList;


                    } else {
                        reject("No currency information found.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.error("Error fetching currency:", textStatus, errorThrown);
                    reject("Failed to fetch currency information.");
                },
            });
            onFirstLoad = false;
        });
    }



    // new function declaration
    function generateTableItem(article) {
        return `
          <table class="table table-borderless">
            <tr>
              <td rowspan="2" width="50%">
                <img class="img-fluid rounded" src="${article.image_url}" alt="${article.title}" title="${article.title}">
              </td>
              <td>
                <a href="${article.link}" class="fw-bold fs-6 text-black" target="_blank">${article.title}</a>
              </td>
            </tr>
            <tr>
              <td class="align-bottom pb-0">
                <p class="fw-light fs-6 mb-1">${article.source_name}</p>
                <p class="fw-light fs-6 mb-1">${article.description}</p>
              </td>
            </tr>
          </table>
          <hr>
        `;
      }

      function fetchCountryNews(countryCode){
        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            data: {type: "newsData", countryCode: countryCode},
            success: function(response){
                if(response.status === "success" && response.results && response.results.length > 0){
                    const allTableHtml = response.results.map(article => generateTableItem(article)).join('');
                    if(allTableHtml){
                        $("#newsTable").html(allTableHtml);
                    }     
                }else{
                    console.error("No results found or API status is not success.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.error("Error fetching newsData:", textStatus, errorThrown);
            },
        })
      }


    $("#targetCurrency").on("change", function(){
        const targetSelectCode = $(this).val();
        const baseCurrencyCode = $("#baseCurrency").val();
        //stop geoLocation watch
        stopGeolocation();

        if(targetSelectCode){
            getExchangeRate(baseCurrencyCode).then(({response}) => {
            //    get target currency unit from select curency object
                let targetCurrencyUnit = response.rates[targetSelectCode];
                targetCurrencyUnit = parseFloat(targetCurrencyUnit);

                let currentBaseUnit = $("#baseCurrencyAmountInput").val();
                currentBaseUnit = parseFloat(currentBaseUnit);

                if(currentBaseUnit){
                    const convertedTargetValue = currentBaseUnit * targetCurrencyUnit;
                    $("#targetCurrencyAmountInput").val(convertedTargetValue);
                }else{
                    $("#targetCurrencyAmountInput").val(targetCurrencyUnit);
                    $("#baseCurrencyAmountInput").val(1);
                }   
            })

        }
    });

    $("#baseCurrency").on("change", function(){
        const targetSelectCode = $(this).val();
        //stop geoLocation watch
        stopGeolocation();

        if(targetSelectCode){
            getExchangeRate(targetSelectCode).then(({response}) => {
               const targetCurrencyCode = $("#targetCurrency").val();
            
               //get target currency unit from select curency object
               const targetCurrencyUnit = response.rates[targetCurrencyCode];
                const currentBaseUnit = $("#baseCurrencyAmountInput").val();
                if(currentBaseUnit){
                    const convertedTargetValue = currentBaseUnit * targetCurrencyUnit;

                    $("#targetCurrencyAmountInput").val(convertedTargetValue);
                }else{

                    $("#baseCurrencyAmountInput").val(1);
                    $("#targetCurrencyAmountInput").val(targetCurrencyUnit);
                }       
            })

        }
    });

    $("#baseCurrencyAmountInput").on("input", function(){
        const currentBaseCode = $("#baseCurrency").val();
;

        let currentBaseUnit = $(this).val();
        //convert baseUnit to number
        currentBaseUnit = parseFloat(currentBaseUnit);
        
        const currentTargetCode = $("#targetCurrency").val();
        let currentTargetUnit = $("#targetCurrencyAmountInput").val();
        currentTargetUnit = parseFloat(currentTargetUnit);

        //checking if baseUnit is NaN
        if(isNaN(currentBaseUnit)){
            let UnitIntarget = $("#targetCurrencyAmountInput");
            UnitIntarget.val("");
        }

        getExchangeRate(currentBaseCode).then(({response})=>{
            if(response.rates){
              let relativeTargetUnit = response.rates[currentTargetCode];
                let newTargetValue = currentBaseUnit * relativeTargetUnit;
                $("#targetCurrencyAmountInput").val(newTargetValue);
            }   
        });
    })


    $("#targetCurrencyAmountInput").on("input", function(){
        const currentTargetCode = $("#targetCurrency").val();

        let currentTargetUnit = $(this).val();
        //convert baseUnit to number
        currentTargetUnit = parseFloat(currentTargetUnit);
        
        const currentBaseCode = $("#baseCurrency").val();

        let currentBaseUnit = $("#baseCurrencyAmountInput").val();
        currentBaseUnit = parseFloat(currentBaseUnit);

        //checking if targetUnit is NaN
        if(isNaN(currentTargetUnit)){
            let UnitInBase = $("#BaseCurrencyAmountInput");
            UnitInBase.val("");
        }

        getExchangeRate(currentTargetCode).then(({response})=>{
            if(response.rates){
              let relativeBaseUnit = response.rates[currentBaseCode];
                let newBaseValue = currentTargetUnit * relativeBaseUnit;
                $("#baseCurrencyAmountInput").val(newBaseValue);
            }
            
        });


    })



    function getWikipediaInfo(countryName) {
        const cleanCountryName = countryName.trim();
        const apiUrl = "https://en.wikipedia.org/w/api.php";
        
        //first get the main content
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {
                    action: "query",
                    format: "json",
                    prop: "extracts|info|sections",
                    titles: cleanCountryName,
                    exintro: 0,        // Get full content, not just intro
                    explaintext: 1,    // Get plain text, not HTML
                    exsectionformat: "plain",
                    redirects: 1,      // Follow redirects
                    origin: "*"        // Required for CORS
                },
                dataType: "json",
                beforeSend: function() {

                },
                success: function(response) {
                    try {
                        const pages = response.query.pages;
                        const pageId = Object.keys(pages)[0];
                        const pageData = pages[pageId];
                        if (pageId === "-1") {
                            reject("Page not found");
                            return;
                        }

                        // Construct the URL manually
                        const pageUrl = `https://en.wikipedia.org/?curid=${pageId}`;
        
                        // Get sections to fetch more content
                        getAdditionalSections(pageId, pageData)
                            .then(additionalContent => {
                                const fullContent = {
                                    mainContent: pageData.extract,
                                    // additionalContent: additionalContent,
                                    url: pageUrl
                                };
                                $("#wikipediaInfo").text(fullContent.mainContent + "\n\n");
                                $("#wikipediaLink").attr("href", fullContent.url);
                                resolve(fullContent);
                            })
                            .catch(error => {
                                // If additional sections fail, still return main content
                                const basicContent = {
                                    mainContent: pageData.extract,
                                    url: pageUrl
                                };
                                $("#wikipediaInfo").text(basicContent.mainContent);
                                $("#wikipediaLink").attr("href", basicContent.url);
                                resolve(basicContent);
                            });
    
                    } catch (e) {
                        console.error("Error processing response:", e);
                        reject("Failed to process Wikipedia response");
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("Failed to fetch Wikipedia data:", textStatus);
                    reject(`Failed to fetch Wikipedia information: ${textStatus}`);
                }
            });
        });
    }
    
    // Helper function to get additional sections
    function getAdditionalSections(pageId, initialData) {
        const apiUrl = "https://en.wikipedia.org/w/api.php";
        
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {
                    action: "query",
                    format: "json",
                    pageids: pageId,
                    prop: "extracts",
                    explaintext: 1,
                    exsectionformat: "plain",
                    origin: "*",
                    
                    rvsection: "geography|economy|history|culture|demographics",
                },
                dataType: "json",
                success: function(response) {
                    try {
                        const pages = response.query.pages;
                        const pageData = pages[pageId];
                        
                        if (pageData.extract) {
                            resolve(pageData.extract);
                        } else {
                            reject("");
                        }
                    } catch (e) {
                        console.error("Error getting additional sections:", e);
                        resolve("");
                    }
                },
                error: function() {
                    resolve(""); // Return empty string on error
                }
            });
        });
    }
    


    
    function getWeatherInfo(lat, lng) {
        $.ajax({
            url: apiUrl,
            method: "GET",
            data: { type: "weatherInfo", lat: lat, lng: lng },
            dataType: "json",
            success: function(response) {
                const weatherInfo = response;
    
                if (weatherInfo) {
                    $("#temparatureLay").text(`${parseInt(weatherInfo.current.temp_c)}°C`);
                    $("#temparatureMod").text(`${parseInt(weatherInfo.current.temp_c)}°C`);
                    $("#tempFeelsLike").text(`${parseInt(weatherInfo.current.feelslike_c)}°C`);
                    $("#todayImgIcon").html(`<img src="${weatherInfo.current.condition.icon}" class="mb-3 img-fluid" style="max-width: 40px;">`);

                    $("#weatherLocation").text(` ${weatherInfo.location.name}, ${weatherInfo.location.country}`);
                    $("#weatherCoordinates").text(`Latitude: ${weatherInfo.location.lat}, Longitude: ${weatherInfo.location.lon}`);
                    $("#weatherDesc").text(`${weatherInfo.current.condition.text}`);
                    
                    const dateStrTomorrow = weatherInfo.forecast.forecastday[1].date;
                    const dateStrNextDay = weatherInfo.forecast.forecastday[2].date;

                    function formatDate(dateString) {
                        const date = new Date(dateString);
                        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
                        const day = daysOfWeek[date.getDay()];
                        const dayOfMonth = date.getDate();
                        const month = date.getMonth() + 1; // Months is zero-based
                        const year = date.getFullYear();
                    
                        // Get the ordinal suffix for the day of the month
                        const ordinalSuffix = (n) => {
                            const s = ["th", "st", "nd", "rd"];
                            const v = n % 100;
                            return s[(v - 20) % 10] || s[v] || s[0];
                        };
                    
                        return `${day} ${dayOfMonth}${ordinalSuffix(dayOfMonth)}`;
                    }
                    const formattedDateTomorrow = formatDate(dateStrTomorrow)
                    $("#tomorrowDate").text(`${formattedDateTomorrow}`);
                    $("#tomorrowTemparatureLay").text(`${parseInt(weatherInfo.forecast.forecastday[1].day.maxtemp_c)}°C`);
                    $("#tomorrowTempFeelsLike").text(`${parseInt(weatherInfo.forecast.forecastday[1].day.mintemp_c)}°C`);
                    $("#tomorrowImgIcon").html(`<img src="${weatherInfo.forecast.forecastday[1].day.condition.icon}" class="mb-3 img-fluid" style="max-width: 40px;">`);
                    

                    const formattedDateNextDay = formatDate(dateStrNextDay);
                    $("#nextDayDate").text(`${formattedDateNextDay}`);
                    $("#nextTemparatureLay").text(`${parseInt(weatherInfo.forecast.forecastday[2].day.maxtemp_c)}°C`);
                    $("#nextTempFeelsLike").text(`${parseInt(weatherInfo.forecast.forecastday[2].day.mintemp_c)}°C`);
                    $("#nextDayImgIcon").html(`<img src="${weatherInfo.forecast.forecastday[2].day.condition.icon}" class="mb-3 img-fluid" style="max-width: 40px;">`);
                    
                    $("#footer").html(`Last updated ${weatherInfo.current.last_updated} Powered by <a href="https://www.weatherapi.com" class="text-success text-decoration-none">WeatherAPI.com</a>`);
                    
                } else {
                    console.error("No weather info found");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Failed to get user weather Info:", textStatus, errorThrown);
            }
        });
    }

    function restModalAndLayoutInfo(country){
        if(country){
            const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
            const currenciesDetail = country.currencies ? Object.entries(country.currencies).map(([key, value]) =>{return `${value.name} (${value.symbol})`}).join(", ") : "N/A";
            const flagUrl = country.flags ? country.flags.png : "N/A";
            const googleMaps = country.maps.googleMaps;
            const openStreetMaps = country.maps.openStreetMaps;

            
            //country info layout here *******************************************
            $("#flag").html(flagUrl ? `<img src=${flagUrl} alt="country Flag" class="mb-3 img-fluid" style="max-width: 200px;">` : "N/A");

            $("#countryDetails").text(JSON.stringify(country, null, 2));

            $("#officialName").text(country.name && country.name.nativeName && country.name.nativeName.eng ? `${country.name.nativeName.eng.official}` : `N/A`);

            $("#countryName").text(country.name ? `${country.name.common}` : `N/A`);

            $("#capitalName").text(country.capital ? `${country.capital[0]}` : `N/A`);

            $("#countryCode").text(country.cca2 ? `${country.cca2}` : `N/A`);
            
            $("#region").text(country.region ? `${country.region }`: `N/A`);
            $("#subRegion").text(country.subregion ? `${country.subregion}` : `N/A`);

            $("#languages").text(languages ? `${languages}`: `N/A`);
            $("#currencies").text(currenciesDetail ? `${currenciesDetail}`: `N/A`);
            const area = formatNumber(country.area);
            $("#area").text(area ? `${area} km²`: `N/A`);
            const population = formatNumber(country.population);
            $("#population").text(population ? `${population}`: `N/A`);

            $("#callingNumber").text(country.idd ? `${country.idd.root+country.idd.suffixes[0] }`: `N/A`);

            $("#unMember").text(country.unMember === true ? `Yes`: `No`);
            

            $("#googleMap").attr("href", googleMaps);
            $("#openStreetMap").attr("href", openStreetMaps);

            $("#coatOfArm").html(country.coatOfArms.png ? `<h4>Coat of Arms</h4> <img src=${country.coatOfArms.png} alt="country Flag" class="mb-3 img-fluid" style="max-width: 100px;"> `: "");
            //country info layout end here *******************************************

            
            // modal layout start here ******************************************
            $("#countryNameMod").text(country.name ? country.name.common : "N/A");
            $("#officialNameMod").text(country.name && country.name.nativeName && country.name.nativeName.eng ? country.name.nativeName.eng.official : "N/A");
            $("#capitalNameMod").text(country.capital ? country.capital[0] : "N/A");
            $("#countryCodeMod").text(country.cca2 ? country.cca2 : "N/A");
            $("#regionMod").text(country.region ? country.region : "N/A");
            $("#subRegionMod").text(country.subregion ? country.subregion : "N/A");
            $("#languagesMod").text(languages);
            $("#currenciesMod").text(currenciesDetail);
            $("#flagMod").html(flagUrl ? `<img src=${flagUrl} alt="country Flag" style="width:20px;  height:20px;">` : "N/A");


        };
    }


    //**********getting user live location on app refresh****************
    //start watching user location
    function startGeolocation (){
        navigator.geolocation.watchPosition(userLocation, userErrorLocation);
    }
    //stop watching user location
    function stopGeolocation (){

        if(watchId !== undefined){
         navigator.geolocation.clearWatch(watchId);   
        }     
    }

    function userLocation(position){

        if(isManualSelection) return; //skip if manual location is active
        if(!onFirstLoad) return;

        lat = position.coords.latitude;
        lng = position.coords.longitude;

        getGeocodeReverse(lat, lng).then(({lat, lng, userCountryCode, description, countryName, currencyCode}) => {
        // showLoader();//show loader while fetching user location

            // //clearing previous markers
            // if(marker){
            //     map.removeLayer(marker);

            // }
            // // update user location maker
            // marker = L.marker([lat, lng]).addTo(map);
            // marker.bindPopup(`<strong>Current location: <strong>${description}`).openPopup();

            $("#countryDropdown").val(userCountryCode).change();
            //get user country border
            highlightCountryBorders(userCountryCode); 
            //wikipedia info function
            getWikipediaInfo(countryName);

            //newsData
            fetchCountryNews(userCountryCode);
            

            baseSelect = false;
            //user currency info
            getUserExchangeRate(currencyCode);
            
            //geoCode to get earthquake areas
            geoCode(countryName).then(({response, bounds})=>{
                const north = bounds.northeast.lat;
                const south = bounds.southwest.lat;
                const east = bounds.northeast.lng;
                const west = bounds.southwest.lng;
                getEarthquake(north, south, east, west);
            });
            selectedCountryCode = userCountryCode;
            //return country Info fxn
            return getCountryInfo(userCountryCode);

            
        }).then((userCountry) =>{
            const country = userCountry;
            
            //modal and layout info
            restModalAndLayoutInfo(country);

            //weather info function
            getWeatherInfo(lat, lng);

        }).catch((error) => {
            console.error("Error in chain", error);
        }).finally(()=>{
            // hideLoader();
            onFirstLoad = false;
        })

        // return selectedCountryCode;
    };
    function userErrorLocation(err){
        if(err.code === 1){
            alert("Plese refresh page and allow geolocation access")
        }else{
            alert("Cannot get current geolocation")
        }
    }
//start geolocation tracking
startGeolocation();
//**********getting user live location on app refresh ends here****************

    // Fetch Country Info selected on Dropdown Change
    
    $("#countryDropdown").on("change", function () {
        showLoader();
        console.log("im after showLoader");
        const countryCode = $(this).val();

        if(!countryCode) return ;

        //clear previous airport markers
        overLayMaps["Airports"].clearLayers();

        //clear previous hotel markers
        overLayMaps["Hotels"].clearLayers();

        //clear previous cities markers
        overLayMaps["Cities"].clearLayers();

        // Uncheck the checkboxes in the Leaflet layer control
        uncheckLayerControlCheckboxes(["Airports", "Hotels", "Cities"]);

        function uncheckLayerControlCheckboxes(layers) {
            const checkboxes = document.querySelectorAll('input.leaflet-control-layers-selector');
            checkboxes.forEach(checkbox => {
                const label = checkbox.nextElementSibling;
                if (label && layers.includes(label.innerText.trim())) {
                    checkbox.checked = false;
                }
            });
        }
        
        //newsData
        fetchCountryNews(countryCode);

        getCountryInfo(countryCode).then((response) => {
            const country = response; 

            //clear marker if marker is !null
            if(marker){
                map.removeLayer(marker);
            }

            var capitalMarker = L.ExtraMarkers.icon({
                icon: 'fa-house',
                markerColor: 'yellow',
                shape: 'square',
                prefix: 'fa'
              });
            //add marker
            marker = L.marker([country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]], {icon: capitalMarker}).addTo(map);
            // add pop up to selected country                
            marker.bindPopup(`<b>Capital City:</b><br>${country.capital[0]} - ${country.name.common}`).openPopup();

            //hightlight selected country's border
            highlightCountryBorders(countryCode);  

            //modal and layout info
            restModalAndLayoutInfo(country);

            //geoCode to get earthquake areas
            geoCode(country.name.common).then(({response, bounds})=>{

                const north = bounds.northeast.lat;
                const south = bounds.southwest.lat;
                const east = bounds.northeast.lng;
                const west = bounds.southwest.lng;
                getEarthquake(north, south, east, west);
            });
            
            //calling weather function
            getWeatherInfo(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]);

            //getting country currency code
            getGeocodeReverse(country.latlng[0], country.latlng[1]).then(({currencyCode})=>{
                dropdownGetExchangeRate(currencyCode);
            })
            //calling wikipedia function
            getWikipediaInfo(country.name.common);
            //set manual selection true and stop geolocation updates
            isManualSelection = true;
            hideLoader();
            stopGeolocation();
            
        });
        
        return selectedCountryCode = countryCode;

    });
       
});
