$(document).ready(function () {
    //api call directory          
    const apiUrl = "libs/php/apiHandler.php";

    // Initialize marker cluster group globally
    const earthquakeMarkers = L.markerClusterGroup();
    let layerControlEarthQuake = null;

    //declaring marker, circle, zoom
    let marker, circle, zoom, lat, lng, openCageData, description, userCountryCode;
    let selectedCountryCode;
    let onFirstLoad = true;

    // Store fetched country data for searching
    let countryList = []; 
    
    //set user selecting location to false on app initial load
    let isManualSelection = false; 
    let watchId;

    //loading functions
    function showLoader() {
        $("#loading").removeClass("d-none");
        // console.log("Im loading");
    }
    
    function hideLoader() {
        $("#loading").addClass("d-none");
        // console.log("done loading");
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
            dropdown.empty(); // Clear existing options
            dropdown.append('<option value="">Select a country...</option>'); // Default option
    
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
            // console.log(countryList);
            return countryList;
        }catch(error){
            // alert("Failed to load country data. Please refresh the page and try again.");
            console.error(error);
        }
    }
    // call fxn to fetch countrylist data
    fetchAndPopulateCountryDropdown();

    var road = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var googleSat =  L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: "google satelite street map"
    });




    // Initialize Map
    const map = L.map('map',{
        layers: [road]
    }).setView([54.5, -4], 6);

    //basemap layer button
    var basemaps = {
        "googleSat": googleSat,
        "road": road
    };

    const overLayMaps = {
        "Airport": L.markerClusterGroup(),
        "Hotel": L.markerClusterGroup()
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
    const wikipediaBtn = L.easyButton("fa-newspaper fa-xl", function (btn, map) {
        $("#wikipediaModal").modal("show");
      });
      wikipediaBtn.addTo(map);


   // currency easyButton
    const currencyBtn = L.easyButton("fa-calculator fa-xl", function (btn, map) {
        $("#currencyInfoModal").modal("show");
      });
      currencyBtn.addTo(map);
      
    // Show loading indicator
    $("#loading").show();

    // Functions declaration start here *********************************************************


    // country border function
    //using geoJSON to draw country border
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
                //Add the new country border
                currentCountryBorder = L.geoJSON(country);
                currentCountryBorder.addTo(map);
                // map.fitBounds(currentCountryBorder.getBounds());
            }else{
                console.log("country not found in GeoJSON data.")
            };
        }
    catch(error){
        console.error(error.message);
        }
    };

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

                    // console.log(currencyCode);
                    if(lat && lng && description, countryName){
                        resolve({lat, lng, userCountryCode, description, countryName, currencyCode});
                        };

                    },
                    error: function(){
                        alert("falied to reverse geocode");
                    reject("Failed to reverse geocode for current user location");
                    },
                });
        });
    }



    //geocode function
    function geoCode (query) {
        return new Promise((resolve, reject)=>{
            const urlQuery = encodeURIComponent(query);
            // console.log(urlQuery);
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "geocode", query: urlQuery },
                dataType: "json",
                success: function(response) {
                    // console.log(response);
                    if(response.results){
                        const bounds = response.results[0].bounds;
                        // console.log(bounds);
                        resolve({response, bounds});
                    }else{
                        reject("no geoCode info found")
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    hideLoader();
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
                                            <input type="checkbox" id="earthquakeLayerCheckbox" checked>
                                            <span class="checkbox-text">Earthquake Layer</span>
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
                    hideLoader();
                    console.error("Error fetching earthquake data:", textStatus, errorThrown);
                    reject("Failed to fetch earthquake data information.");
                },
            });
        });
    }

   


    // Get airport data for all countries*******************************************
async function getAllAirportData(countryCode) {
    try {
      const response = await fetch("assets/data/airportData.json");
      if (!response.ok) {
        throw new Error("Failed to load Airport Geo data");
      }
      const data = await response.json();
      const countryAirport = data.geonames.filter(airport => airport.countryCode === countryCode);
      return countryAirport;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }
  
    // Creates a red marker with the coffee icon
    var airportMarker = L.ExtraMarkers.icon({
        icon: 'fa-plane',
        markerColor: 'blue',
        shape: 'square',
        prefix: 'fa'
      });
  // Add airport markers to the map
  async function addAirportsToMap(countryCode) {
    const selectAirportData = await getAllAirportData(countryCode);


    selectAirportData.forEach(airport => {
        const popupContent = `
        <div class="earthquake-popup">
            <h3>Airport Details</h3>
            <p><span class="">Country Name: ${airport.countryName}</span></p>
            <p>Airport Name: ${airport.name}</p>
            <p>Location: ${airport.lat}, ${airport.lng}</p>
        </div>
    `;
      const marker = L.marker([parseFloat(airport.lat), parseFloat(airport.lng)], {icon: airportMarker}).bindPopup(popupContent);
      overLayMaps["Airport"].addLayer(marker);
    });
  }
  
//   // Event listener for "Airport" checkbox
map.on('overlayadd', function(eventLayer) {
    if (eventLayer.name === 'Airport') {
      addAirportsToMap(selectedCountryCode);
    }
  });

  map.on('overlayremove', function(eventLayer) {
    if (eventLayer.name === 'Airport') {
      overLayMaps["Airport"].clearLayers();
    }
  });
//******************************************************************************************/


     
     //***************function for hotel data *******************************************
    async function getAllHotelData(countryCode) {
        try {
        const response = await fetch("assets/data/hotelData.json");
        if (!response.ok) {
            throw new Error("Failed to load Hotel Geo data");
        }
        const data = await response.json();
        const countryHotel = data.geonames.filter(hotel => hotel.countryCode === countryCode);
        return countryHotel;
        } catch (error) {
        console.log(error.message);
        return [];
        }
    }

        // Creates a red marker with the coffee icon
        var hotelMarker = L.ExtraMarkers.icon({
            icon: 'fa-hotel',
            markerColor: 'blue',
            shape: 'square',
            prefix: 'fa'
          });

    // Add hotel markers to the map
    async function addHotelsToMap(countryCode) {
        const selectHotelData = await getAllHotelData(countryCode);


        selectHotelData.forEach(hotel => {
            const popupContent = `
            <div class="earthquake-popup">
                <h3>Hotel Details</h3>
                <p><span class="">Country Name: ${hotel.countryName}</span></p>
                <p>Hotel Name: ${hotel.name}</p>
                <p>Location: ${hotel.lat}, ${hotel.lng}</p>
            </div>
        `;
        const marker = L.marker([parseFloat(hotel.lat), parseFloat(hotel.lng)], {icon: hotelMarker}).bindPopup(popupContent);
        overLayMaps["Hotel"].addLayer(marker);
        });
    }

//   // Event listener for "Airport" checkbox
map.on('overlayadd', function(eventLayer) {
    if (eventLayer.name === 'Hotel') {
      addHotelsToMap(selectedCountryCode);
    }
  });

  map.on('overlayremove', function(eventLayer) {
    if (eventLayer.name === 'Hotel') {
      overLayMaps["Hotel"].clearLayers();
    }
  });

//****************************************************************************** */

    function getCountryInfo(countryCode) {
        // showLoader(); // Show loader while fetching data
    
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
                hideLoader(); // hide loader after processing
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
                        console.log(response.date);

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

                        // console.log(`base currencyCode: ${baseCode}`);
                        // console.log(`base unit: ${baseUnit}`);

                        // console.log(`target USD code: ${targetCode}`);
                        // console.log(`target unit: ${targetUnit}`);

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
                    hideLoader();
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
                        console.log(response.date);
                        resolve({response});
                        // return currencyList;

                    } else {
                        reject("No currency information found.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    hideLoader();
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

                        // console.log(response.date);

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

                        // console.log(`base currencyCode: ${baseCode}`);
                        // console.log(`base unit: ${baseUnit}`);

                        // console.log(`target USD code: ${targetCode}`);
                        // console.log(`target unit: ${targetUnit}`);

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
                    hideLoader();
                    console.error("Error fetching currency:", textStatus, errorThrown);
                    reject("Failed to fetch currency information.");
                },
            });
            onFirstLoad = false;
        });
    }

    $("#targetCurrency").on("change", function(){
        const targetSelectCode = $(this).val();
        const baseCurrencyCode = $("#baseCurrency").val();
        //stop geoLocation watch
        stopGeolocation();

        if(targetSelectCode){
            console.log(`select target currency code:${targetSelectCode}`);
            getExchangeRate(baseCurrencyCode).then(({response}) => {
                // console.log(`base currency data: `, response);
               
            //    console.log(`base code now: ${baseCurrencyCode}`);
            //    get target currency unit from select curency object
                let targetCurrencyUnit = response.rates[targetSelectCode];
                targetCurrencyUnit = parseFloat(targetCurrencyUnit);

                console.log(`taget unit in base response: ${targetCurrencyUnit}`);
                let currentBaseUnit = $("#baseCurrencyAmountInput").val();
                currentBaseUnit = parseFloat(currentBaseUnit);

                console.log({currentBaseUnit, targetCurrencyUnit, rate:response.rates})
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
            console.log(`select base currency code:${targetSelectCode}`);
            getExchangeRate(targetSelectCode).then(({response}) => {
                console.log(`base currency data: `, response);
               const targetCurrencyCode = $("#targetCurrency").val();
               console.log(`target code now: ${targetCurrencyCode}`);
            //    get target currency unit from select curency ojject
               const targetCurrencyUnit = response.rates[targetCurrencyCode];
                const currentBaseUnit = $("#baseCurrencyAmountInput").val();
                console.log({currentBaseUnit, targetCurrencyUnit, rate:response.rates})
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
        // console.log(`current base value, ${currentBaseCode}`);

        let currentBaseUnit = $(this).val();
        //convert baseUnit to number
        currentBaseUnit = parseFloat(currentBaseUnit);
        // console.log(`current base unit, ${currentBaseUnit}`);
        // console.log(typeof(currentBaseUnit));
        
        const currentTargetCode = $("#targetCurrency").val();
        // console.log(`current target code, ${currentTargetCode}`);
        let currentTargetUnit = $("#targetCurrencyAmountInput").val();
        currentTargetUnit = parseFloat(currentTargetUnit);
        // console.log(typeof(currentTargetUnit));

        // console.log(`current target unit, ${currentTargetUnit}`);
        //checking if baseUnit is NaN
        if(isNaN(currentBaseUnit)){
            let UnitIntarget = $("#targetCurrencyAmountInput");
            UnitIntarget.val("");
        }

        getExchangeRate(currentBaseCode).then(({response})=>{
            if(response.rates){
              let relativeTargetUnit = response.rates[currentTargetCode];
                console.log(`relative target unit: ${relativeTargetUnit}`);
                let newTargetValue = currentBaseUnit * relativeTargetUnit;
                $("#targetCurrencyAmountInput").val(newTargetValue);
            }   
        });


    })


    $("#targetCurrencyAmountInput").on("input", function(){
        const currentTargetCode = $("#targetCurrency").val();
        // console.log(`current base value, ${currentTargetCode}`);

        let currentTargetUnit = $(this).val();
        //convert baseUnit to number
        currentTargetUnit = parseFloat(currentTargetUnit);
        // console.log(`current target unit, ${currentTargetUnit}`);
        // console.log(typeof(currentTargetUnit));
        
        const currentBaseCode = $("#baseCurrency").val();
        // console.log(`current target code, ${currentBaseCode}`);

        let currentBaseUnit = $("#baseCurrencyAmountInput").val();
        currentBaseUnit = parseFloat(currentBaseUnit);
        // console.log(typeof(currentBaseUnit));

        // console.log(`current base unit, ${currentBaseUnit}`);
        //checking if targetUnit is NaN
        if(isNaN(currentTargetUnit)){
            let UnitInBase = $("#BaseCurrencyAmountInput");
            UnitInBase.val("");
        }

        getExchangeRate(currentTargetCode).then(({response})=>{
            if(response.rates){
              let relativeBaseUnit = response.rates[currentBaseCode];
                console.log(`relative target unit: ${relativeBaseUnit}`);
                let newBaseValue = currentTargetUnit * relativeBaseUnit;
                $("#baseCurrencyAmountInput").val(newBaseValue);
            }
            
        });


    })


    function getWikipediaInfo(countryName) {
        // showLoader();
        const urlCountryName = encodeURIComponent(countryName);
        // console.log(`wikipedia country name ${urlCountryName}`);
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "wikipedia", countryname: urlCountryName},
                dataType: "json",
                success: function (wikiResponse) {
                    if (wikiResponse && wikiResponse.extract) {
                        const wikiInfo = wikiResponse;
                        const wikiUrl = wikiInfo.content_urls.desktop.page;
                        console.log(`wiki info `, wikiInfo.extract);
                        console.log(wikiResponse);
                        $("#wikipediaInfo").text(wikiInfo.extract);
                        $("#wikipediaLink").attr("href", wikiUrl);
    
                        resolve(wikiInfo);
                    } else {
                        reject("No Wikipedia information found.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    hideLoader();
                    console.error("Error fetching Wikipedia information:", textStatus, errorThrown);
                    reject("Failed to fetch Wikipedia information.");
                },
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
                    console.log(weatherInfo);
                    $("#temparatureLay").text(`${weatherInfo.current.temp_c}°C`);
                    $("#tempFeelsLike").text(`${weatherInfo.current.feelslike_c}°C`);
                    $("#todayImgIcon").html(`<img src="${weatherInfo.current.condition.icon}" class="mb-3 img-fluid" style="max-width: 40px;">`);

                    $("#weatherLocation").text(` ${weatherInfo.location.name}, ${weatherInfo.location.country}`);
                    $("#weatherCoordinates").text(`Latitude: ${weatherInfo.location.lat}, Longitude: ${weatherInfo.location.lon}`);
                    $("#weatherDesc").text(`${weatherInfo.current.condition.text}`);
                    
                    const dateStrTomorrow = weatherInfo.forecast.forecastday[1].date;
                    const dateStrNextDay = weatherInfo.forecast.forecastday[2].date;

                    function formatDate(dateString) {
                        const date = new Date(dateString);
                        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
                    
                        return `${year}-${month.toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')} ${day} ${dayOfMonth}${ordinalSuffix(dayOfMonth)}`;
                    }
                    const formattedDateTomorrow = formatDate(dateStrTomorrow)
                    $("#tomorrowDate").text(`${formattedDateTomorrow}`);
                    $("#tomorrowTemparatureLay").text(`${weatherInfo.forecast.forecastday[1].day.maxtemp_c}°C`);
                    $("#tomorrowTempFeelsLike").text(`${weatherInfo.forecast.forecastday[1].day.mintemp_c}°C`);
                    $("#tomorrowImgIcon").html(`<img src="${weatherInfo.forecast.forecastday[1].day.condition.icon}" class="mb-3 img-fluid" style="max-width: 40px;">`);
                    

                    const formattedDateNextDay = formatDate(dateStrNextDay);
                    $("#nextDayDate").text(`${formattedDateNextDay}`);
                    $("#nextTemparatureLay").text(`${weatherInfo.forecast.forecastday[2].day.maxtemp_c}°C`);
                    $("#nextTempFeelsLike").text(`${weatherInfo.forecast.forecastday[2].day.mintemp_c}°C`);
                    $("#nextDayImgIcon").html(`<img src="${weatherInfo.forecast.forecastday[2].day.condition.icon}" class="mb-3 img-fluid" style="max-width: 40px;">`);
                    
                    $("#footer").html(`Last updated ${weatherInfo.current.last_updated} Powered by <a href="https://www.weatherapi.com" class="text-success text-decoration-none">WeatherAPI.com</a>`);
                    
                } else {
                    console.error("No weather info found");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                hideLoader();
                console.error("Failed to get user weather Info:", textStatus, errorThrown);
            }
        });
    }

    function restModalAndLayoutInfo(country){
        if(country){
            // console.log(country);
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

            $("#area").text(country.area ? `${country.area} km²`: `N/A`);

            $("#population").text(country.population ? `${country.population}`: `N/A`);

            $("#timeZone").text(country.timezones[0] ? `${country.timezones[0]}`: `N/A`);

            $("#callingNumber").text(country.idd ? `${country.idd.root+country.idd.suffixes[0] }`: `N/A`);

            $("#unMember").text(country.unMember === true ? `Yes`: `No`);
            
            $("#startOfWeek").text(country.startOfWeek ? `${country.startOfWeek}`:  `N/A`);

            $("#googleMap").attr("href", googleMaps);
            $("#openStreetMap").attr("href", openStreetMaps);

            $("#coatOfArm").text(country.coatOfArms.png ? `<h4>Coat of Arms</h4> <img src=${country.coatOfArms.png} alt="country Flag" class="mb-3 img-fluid" style="max-width: 100px;"> `: "");
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
        showLoader();//show loader while fetching user location

        lat = position.coords.latitude;
        lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        // console.log(lat, lng);

        //clearing previous markers
        if(marker){
            map.removeLayer(marker);
            map.removeLayer(circle);
        }


        getGeocodeReverse(lat, lng).then(({lat, lng, userCountryCode, description, countryName, currencyCode}) => {

            // update user location maker
            marker = L.marker([lat, lng]).addTo(map);
            circle = L.circle([lat, lng], {radius: accuracy }).addTo(map);
            marker.bindPopup(`<strong>Current location: <strong>${description}`).openPopup();

            //clearing current user zoom after location change
            if(!zoom){
            //get user country border
            highlightCountryBorders(userCountryCode);   
            zoom = map.fitBounds(circle.getBounds());
            }

            // console.log(`user countryName`, countryName);
            // console.log(`user currency`, currencyCode);
            //wikipedia info function
            getWikipediaInfo(countryName);
            

            baseSelect = false;
            //user currency info
            getUserExchangeRate(currencyCode);
            
            //geoCode to get earthquake areas
            geoCode(countryName).then(({response, bounds})=>{
                // console.log(bounds);
                const north = bounds.northeast.lat;
                const south = bounds.southwest.lat;
                const east = bounds.northeast.lng;
                const west = bounds.southwest.lng;
                getEarthquake(north, south, east, west);

                // console.log(`selected coordinates: north${north}, south: ${south}, east: ${east}, west: ${west}`);

            });
            selectedCountryCode = userCountryCode;
            //return country Info fxn
            return getCountryInfo(userCountryCode);

            
        }).then((userCountry) =>{
            // console.log("Country Info:", userCountry);
            const country = userCountry;
            
            //modal and layout info
            restModalAndLayoutInfo(country);

            //weather info function
            getWeatherInfo(lat, lng);

        }).catch((error) => {
            console.log("Error in chain", error);
        }).finally(()=>{
            hideLoader();
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
        const countryCode = $(this).val();

        if(!countryCode) return ;

        //clear previous airport markers
        overLayMaps["Airport"].clearLayers();

        //clear previous hotel markers
        overLayMaps["Hotel"].clearLayers();

        //hightlight selected country's border
        highlightCountryBorders(countryCode);                             

        getCountryInfo(countryCode).then((response) => {
            const country = response; 
            console.log(country);

            //clear marker if marker is !null
            if(marker){
                map.removeLayer(marker);
                map.removeLayer(circle);
            }
            //add marker
            marker = L.marker([country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]]).addTo(map);
            // add pop up to selected country                
            marker.bindPopup(`<b>Country:</b><br>${country.name.common}`).openPopup();
            //et country map view
            map.setView([country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]], 5);
            console.log(country);
            console.log(`coordinate: ${country.capitalInfo.latlng[0]}, ${country.capitalInfo.latlng[1]}`);


            //modal and layout info
            restModalAndLayoutInfo(country);

            //geoCode to get earthquake areas
            geoCode(country.name.common).then(({response, bounds})=>{
                console.log(bounds);
                const north = bounds.northeast.lat;
                const south = bounds.southwest.lat;
                const east = bounds.northeast.lng;
                const west = bounds.southwest.lng;
                getEarthquake(north, south, east, west);

                // console.log(`selected coordinates: north${north}, south: ${south}, east: ${east}, west: ${west}`);

            });
            
            //calling weather function
            getWeatherInfo(country.latlng[0], country.latlng[1]);

            //getting country currency code
            getGeocodeReverse(country.latlng[0], country.latlng[1]).then(({currencyCode})=>{
                console.log(`dropdown country currency code: ${currencyCode}`);
                dropdownGetExchangeRate(currencyCode);
            })
            //calling wikipedia function
            getWikipediaInfo(country.name.common);
            // console.log(country.name.common);
            //set manual selection true and stop geolocation updates
            isManualSelection = true;
            stopGeolocation();
            
        });
        return selectedCountryCode = countryCode;

    });
       
});