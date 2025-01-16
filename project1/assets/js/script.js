$(document).ready(function () {
    const apiUrl = "libs/php/apiHandler.php";


    var road = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    });

    var googleSteets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: "google street map"
    });

    var googleSat =  L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: "google satelite street map"
    });


    // Initialize Map
    const map = L.map('map',{
        layers: [googleSteets]
    }).setView([54.5, -4], 6);

    //basemap layer button
    var basemaps = {
        "googleSteets": googleSteets,
        "googleSat": googleSat,
        "road": road,
        "Streets": streets,
    };

    layerControl = L.control.layers(basemaps).addTo(map);

    //info button
    infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
        $("#exampleModal").modal("show");
      });
      infoBtn.addTo(map);



    //**********getting user live location on app refresh****************

    //declaring marker, circle, zoom
    let marker, circle, zoom, lat, lng;
    
    let isManualSelection = false; //tracks is user has manually selected location
    let watchId;

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
        if(isManualSelection) return; //skip is manual location is active

        lat = position.coords.latitude;
        lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        // console.log(lat, lng);

        //clearing previous markers
        if(marker){
            map.removeLayer(marker);
            map.removeLayer(circle);
        }

        marker = L.marker([lat, lng]).addTo(map);
        circle = L.circle([lat, lng], {radius: accuracy }).addTo(map);
        marker.bindPopup(`Current location, (${lat},${lng}`).openPopup();

        //clearing current user zoom after location change
        if(!zoom){
            zoom = map.fitBounds(circle.getBounds());
        }
  
    }

    function userErrorLocation(err){
        if(err.code === 1){
            alert("Plese allow geolocation access")
        }else{
            alert("Cannot get current geolocation")
        }
    }


//start geolocation tracking
startGeolocation();


    // console.log(cordinates.lat, cordinates.lng);

    let countryList = []; // Store fetched country data for searching
    
    // Show loading indicator
    $("#loading").show();


    async function fetchAndPopulateCountryDropdown(){
        try {
            $("#loading").show();
            const response = await fetch("https://restcountries.com/v3.1/all");
            if(!response.ok){
                throw new Error("Failed to fetch country data");
            }
            const data = await response.json();
            countryList = data; //save response to countryList array
            const dropdown = $("#countryDropdown");
            dropdown.empty(); // Clear existing options
            dropdown.append('<option value="">Select a country...</option>'); // Default option
    
            data.forEach(country => {
                const countryCode = country.cca2; // ISO 3166-1 alpha-2 code
                const countryName = country.name.common;
                dropdown.append(`<option value="${countryCode}">${countryName} (${countryCode})</option>`);
            });

            // Hide loading indicator
            $("#loading").hide();
        }catch(error){
            // Hide loading indicator
            $("#loading").hide();
            alert("Failed to load country data. Please refresh the page and try again.");
            console.error(error);
        }
    }
    // call fxn to fetch countrylist data
    fetchAndPopulateCountryDropdown();

    // // Fetch and Populate Country Dropdown
    // $.ajax({
    //     url: "https://restcountries.com/v3.1/all",
    //     method: "GET",
    //     dataType: "json",
    //     success: function (response) {
    //         countryList = response; // Save country data for search functionality

    //         const dropdown = $("#countryDropdown");
    //         dropdown.empty(); // Clear existing options
    //         dropdown.append('<option value="">Select a country...</option>'); // Default option

    //         response.forEach(country => {
    //             const countryCode = country.cca2; // ISO 3166-1 alpha-2 code
    //             const countryName = country.name.common;
    //             dropdown.append(`<option value="${countryCode}">${countryName} (${countryCode})</option>`);

    //         });

    //     },
    //     error: function () {
    //         alert("Failed to load country data. Please refresh the page and try again.");
    //     }
    // });



    // ********************Filter Dropdown on Search**************************
    //opencase response array
    let openCageCountryList = [];


    $("#countrySearch").on("input", function () {
        const searchValue = $(this).val().toLowerCase();
        const dropdown = $("#countryDropdown");
        dropdown.empty();
        dropdown.append('<option value="">Select from searched below...</option>');
    
        let matchFound = false;
    
        // Check against the country list
        countryList.forEach(country => {
            const countryCode = country.cca2;
            // console.log(countryCode);
            const countryName = country.name.common.toLowerCase();
    
            if (countryName.includes(searchValue) || countryCode.toLowerCase().includes(searchValue)) {
                dropdown.append(`<option value="${countryCode}">${country.name.common} (${countryCode})</option>`);
                // console.log(countryCode);
                matchFound = true; // Mark that a match is found
            }
        });
    
        // If no match found, use OpenCage API
        if (!matchFound) {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "geocode", query: searchValue },
                dataType: "json",
                success: function (response) {
                    openCageCountryList = response.results;
                    // console.log(openCageCountryList);
                    // console.log(openCageCountryList);
        
                    
                    if (openCageCountryList && openCageCountryList.length > 0) {
                        openCageCountryList.forEach(result => {
                            const formatted = result.formatted;
                            const coords = result.geometry;
                            const countryCode = result.components["ISO_3166-1_alpha-2"];
                            
    
                            dropdown.append(`<option value="${countryCode}">${formatted} (Coordinates: ${coords.lat}, ${coords.lng})</option>`);
                            


                            // after selecting option navigate marker to coordinate of selected option
                            $("#countryDropdown").on("change", function(){
                                const selectCountry = $(this).val();
                                console.log(selectCountry);

                                const selectValue = openCageCountryList.find(result => result.components["ISO_3166-1_alpha-2"] === selectCountry);

                                const coord = selectValue.geometry;
                                const countryInfo = selectValue.formatted;

                                // //value selected from search option 
                                console.log(selectValue);

                                //clearing previous markers
                                if(marker){
                                map.removeLayer(marker);
                                map.removeLayer(circle);
                                };

                            //add marker after selecting country on dropdown 
                            marker = L.marker([coord.lat, coord.lng]).addTo(map);
                            //add pop up to selected country
                            marker.bindPopup(`<b>Country:</b><br>${countryInfo}`).openPopup();

                            map.setView([coord.lat, coord.lng], 15);



                            //wikipedia api call from searched dropdown options
                            $.ajax({
                            url: apiUrl,
                            method: "GET",
                            data: {type: "wikipedia", lat: coord.lat, lng: coord.lng},
                            dataType: "json",
                            success: function (wikiresponse){
                                console.log("Response:", wikiresponse);
                                // const selectedWikiInfo = wikiresponse.find()
                                if(wikiresponse && wikiresponse.geonames && wikiresponse.geonames.length > 0){
                                // const wikiInfo = wikiresponse.find(wiki => wikiresponse.geonames.countryCode === selectValue);
                                // console.log(wikiInfo);
                                const wikiInfo = wikiresponse.geonames[0];
                                const wikiUrl =`https://${wikiresponse.geonames[0].wikipediaUrl}`;

                                //update the wiki field in html
                                $("#wikipediaInfo").text(wikiInfo.summary);
                                //update the wikiUrl IN THE HTML
                                if(wikiUrl){
                                $("#wikipediaLink").attr("href", wikiUrl);
                                }
                                }else{
                                console.error("No wikipedia information found in the response");
                                $("#wikipediaInfo").text("Failed to load wikipedia information")
                                }
                             }
                            });
                            
                        });

                            //set manual selection flag to and stop geolocation updates
                            isManualSelection = true;
                            stopGeolocation();

                        });
                    } else {
                        dropdown.append('<option value="">No matches found</option>');
                    }
                },
                error: function () {
                    dropdown.append('<option value="">An error occured</option>');
                }
            });
        }
    });
    




    //**************Listen and grab changes on the dropdown for weather info****************
    $("#countryDropdown").on("change", function(){
            //get the selected value
            const countryCode = $(this).val();
            //selected coutry code
            console.log(countryCode);

            //using geoJSON to draw country border
            //setting country border in order to clear the previous border after new border



            let currentCountryBorder = null;
            let currentMarker = null;

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
                        console.log("Cleared the previous border");
                    }
                    //Add the new country border
                    currentCountryBorder = L.geoJSON(country);
                    currentCountryBorder.addTo(map);
                    map.fitBounds(currentCountryBorder.getBounds());
                }
            }
             catch(error){
                console.error(error.message);
            }
        }


            //executing country Border JSON function
            highlightCountryBorders(countryCode);
    
            if(countryCode){
                const selectedCountry = countryList.find(country => country.cca2 === countryCode);
                console.log(selectedCountry);

                            //clearing previous markers
                            if(marker){
                                map.removeLayer(marker);
                                map.removeLayer(circle);
                            };
                                
                            //add marker after selecting country on dropdown 
                            marker = L.marker([selectedCountry.latlng[0], selectedCountry.latlng[1]]).addTo(map);
                            //add pop up to selected country
                            marker.bindPopup(`<b>Country:</b><br>${selectedCountry.name.common}`).openPopup();
                                
                            map.setView([selectedCountry.latlng[0], selectedCountry.latlng[1]], 5);

                            console.log(selectedCountry.latlng[0], selectedCountry.latlng[1]);

                            
            

    
            if(selectedCountry){
                    // console.log("Country details:", selectedCountry);                       
                        $.ajax({
                            url: apiUrl,
                            method: "GET",
                            data: {type: "weather", lat: selectedCountry.latlng[0], lng: selectedCountry.latlng[1]},
                            dataType: "json",
                            success: function (response){
                                const weatherInfo = response;
                                $("#weatherInfo").text(JSON.stringify(weatherInfo, null, 2));
                                $("#temparature").text(`${weatherInfo.main.temp} °C`);
                            }
                        });

                        //wikipedia api call from dropdown options
                        $.ajax({
                            url: apiUrl,
                            method: "GET",
                            data: {type: "wikipedia", lat: selectedCountry.latlng[0], lng: selectedCountry.latlng[1]},
                            dataType: "json",
                            success: function (wikiresponse){
                            console.log("Response:", wikiresponse);
                            // const selectedWikiInfo = wikiresponse.find(wiki=> wiki.)
                            if(wikiresponse && wikiresponse.geonames && wikiresponse.geonames.length > 0){
                            const wikiInfo = wikiresponse.geonames[0];
                            const wikiUrl =`https://${wikiresponse.geonames[0].wikipediaUrl}`;
                            //update the wiki field in html
                            $("#wikipediaInfo").text(wikiInfo.summary);
                            //update the wikiUrl IN THE HTML
                            if(wikiUrl){
                            $("#wikipediaLink").attr("href", wikiUrl);
                            $("#wikipediaLink").html("Click to read more");
                            }
                            }else{
                            console.error("No wikipedia information found in the response");
                            $("#wikipediaInfo").text("Failed to load wikipedia information");
                                }
                            }
                        });
                    }


            }else{
                console.log("No country selected");
            }
        });

    // Fetch Country Info selected on Dropdown Change
    $("#countryDropdown").on("change", function () {
        const countryCode = $(this).val();
        if (!countryCode) return;

        // Show Loader
        $("#loading").removeClass("d-none");

        $.ajax({
            url: apiUrl,
            method: "GET",
            data: { type: "countryInfo", countryCode: countryCode },
            dataType: "json",
            success: function (response) {
                const country = response[0];
                
                if(country){

                const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
                const currenciesDetail = country.currencies ? Object.entries(country.currencies).map(([key, value]) =>{return `${value.name} (${value.symbol})`}).join(", ") : "N/A";
                const flagUrl = country.flags ? country.flags.png : "N/A";

                $("#countryDetails").text(JSON.stringify(country, null, 2));
                $("#countryName").text(country.name ? country.name.common : "N/A");
                $("#officialName").text(country.name && country.name.nativeName && country.name.nativeName.eng ? country.name.nativeName.eng.official : "N/A");
                $("#capitalName").text(country.capital ? country.capital[0] : "N/A");
                $("#countryCode").text(country.cca2 ? country.cca2 : "N/A");
                $("#religion").text(country.region ? country.region : "N/A");
                $("#subRegion").text(country.subregion ? country.subregion : "N/A");
                $("#languages").text(languages);
                $("#currencies").text(currenciesDetail);
                $("#flag").html(flagUrl ? `<img src=${flagUrl} alt="country Flag" style="width:20px;  height:20px;">` : "N/A");
                }

            //set manual selection flag to and stop geolocation updates
            isManualSelection = true;
            stopGeolocation();
            },
            error: function () {
                alert("Failed to fetch country info.");
            },
            complete: function () {
                $("#loading").addClass("d-none");
            }
        });

    });
});