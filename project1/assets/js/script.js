$(document).ready(function () {
    //api call directory          
    const apiUrl = "libs/php/apiHandler.php";

    //declaring marker, circle, zoom
    let marker, circle, zoom, lat, lng, openCageData, description, userCountry, userCountryCode;
    //opencage response array
    let openCageCountryList = [];
    let openCageUse = false;

    console.log(`initial OC Value: ${openCageUse}`);

    // Store fetched country data for searching
    let countryList = []; 
    
    //set user selecting location to false on app initial load
    let isManualSelection = false; 
    let watchId;


    //fetch country name for dropdown
    async function fetchAndPopulateCountryDropdown(){
        try {
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

    // Show loading indicator
    $("#loading").show();

    // Functions declaration start here *********************************************************
    //populate dropdown with country info


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
                    console.log("Cleared the previous border");
                }
                //Add the new country border
                currentCountryBorder = L.geoJSON(country);
                currentCountryBorder.addTo(map);
                map.fitBounds(currentCountryBorder.getBounds());
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

                    if(lat && lng && description){
                        resolve({lat, lng, userCountryCode, description});
                        };

                    },
                    error: function(){
                    reject("Failed to reverse geocode for current user location");
                    },
                });
        });
    }

    function getCountryInfo(countryCode){
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "countryInfo", countryCode: countryCode },
                dataType: "json",
                success: function (response) {
                    if (response && response.length > 0) {
                    userCountry = response[0];
                    console.log(userCountry);
                    resolve(response[0]);
                    } else {
                    reject("Country info not found.");
                    }
                },
                error: function () {
                    reject("Failed to fetch country info.");
                },
                });
        });
    }

    function getWikipediaInfo(lat, lng){
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "wikipedia", lat: lat, lng: lng },
                dataType: "json",
                success: function (wikiResponse) {
                    if (wikiResponse && wikiResponse.geonames && wikiResponse.geonames.length > 0) {
                    resolve(wikiResponse.geonames[0]);
                    } else {
                    reject("No Wikipedia information found.");
                    }
                },
                error: function () {
                    reject("Failed to fetch Wikipedia information.");
                },
                });
        });
    }

    //weather api call
    function getWeatherInfo(lat, lng){
        return new Promise((resolve, reject)=> {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "weather", lat: lat, lng: lng},
                dataType: "json",
                success: function (response){
                    const weatherInfo = response;
                    if(weatherInfo){
                        console.logweatherInfo
                        resolve(weatherInfo); 
                    }else{
                        reject("No weather info found");
                    }
                    $("#weatherInfo").text(JSON.stringify(weatherInfo, null, 2));
                    // $("#temparature").text(`${weatherInfo.main.temp} °C`);
                },
                error: function(){
                    reject("Failed to get user weather Info");
                }
            });
        });
    };

    function restModalAndLayoutInfo(country){
        if(country){

            console.log(country);
            const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
            const currenciesDetail = country.currencies ? Object.entries(country.currencies).map(([key, value]) =>{return `${value.name} (${value.symbol})`}).join(", ") : "N/A";
            const flagUrl = country.flags ? country.flags.png : "N/A";
            const googleMaps = country.maps.googleMaps;
            const openStreetMaps = country.maps.openStreetMaps;

            
            //country info layout here *******************************************
            $("#flag").html(flagUrl ? `<h5>Country Flag</h5> <img src=${flagUrl} alt="country Flag" class="mb-3 img-fluid" style="max-width: 200px;">` : "N/A");

            $("#countryDetails").text(JSON.stringify(country, null, 2));

            $("#officialName").html(country.name && country.name.nativeName && country.name.nativeName.eng ? `<strong>Official Name: </strong>${country.name.nativeName.eng.official}` : `<strong>Official Name: </strong> N/A`);

            $("#countryName").html(country.name ? `<strong>Country Name: </strong> ${country.name.common}` : `<strong>Country Name: </strong> N/A`);

            $("#capitalName").html(country.capital ? `<strong>Capital: </strong>${country.capital[0]}` : `<strong>Capital: </strong> N/A`);

            $("#countryCode").html(country.cca2 ? `<strong>Country Code: </strong> ${country.cca2}` : `<strong>Country Code: </strong> N/A`);
            
            $("#region").html(country.region ? `<strong>Region: </strong> ${country.region }`: `<strong>Region: </strong> N/A`);
            $("#subRegion").html(country.subregion ? `<strong>Sub Region: </strong>${country.subregion}` : `<strong>Subregion: </strong> N/A`);

            $("#languages").html(languages ? `<strong>Language(s): </strong>${languages}`: `<strong>Language(s): </strong> N/A`);
            $("#currencies").html(currenciesDetail ? `<strong>Currencie(s): </strong>${currenciesDetail}`: `<strong>Currencie(s): </strong> N/A`);

            $("#area").html(country.area ? `<strong>Area: </strong>${country.area} km²`: `<strong>Area: </strong> N/A`);

            $("#population").html(country.population ? `<strong>Population: </strong>${country.population}`: `<strong>Population: </strong> N/A`);

            $("#timeZone").html(country.timezones[0] ? `<strong>Time Zone: </strong>${country.timezones[0]}`: `<strong>Timezones: </strong> N/A`);

            $("#callingNumber").html(country.idd ? `<strong>Calling Number: </strong>${country.idd.root+country.idd.suffixes[0] }`: `<strong>Calling Code: </strong> N/A`);

            $("#unMember").html(country.unMember === true ? `<strong>UN Member: </strong>Yes`: `<strong>UN Member: </strong> No`);
            
            $("#startOfWeek").html(country.startOfWeek ? `<strong>Start Week: </strong>${country.startOfWeek}`:  `<strong>Start Week: </strong> N/A`);

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



    //point of interest marker clusters functions
    // async function addMarkersFromGeoJSON(countryCode) {
    //     try {
    //         const response = await fetch("assets/data/markers.json");
    //         if (!response.ok) {
    //             throw new Error("Failed to load GeoJSON markers file.");
    //         }
    //         const data = await response.json();
    //         const country = data.features.find(feature => feature.properties.iso_a2 === countryCode);
    //         L.geoJSON(country, {
    //             pointToLayer: function (feature, latlng) {
    //                 return L.marker(latlng).bindPopup(`<b>${feature.properties.title}</b><br>${feature.properties.description}`);
    //             }
    //         }).addTo(map);
    //     } catch (error) {
    //         console.error("Error loading GeoJSON markers data:", error.message);
    //     }
    // }
// Functions declaration ends here *********************************************************





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

        lat = position.coords.latitude;
        lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        // console.log(lat, lng);

        //clearing previous markers
        if(marker){
            map.removeLayer(marker);
            map.removeLayer(circle);
        }


        getGeocodeReverse(lat, lng).then(({lat, lng, userCountryCode, description}) => {
            console.log(`Reverse Geocode Data: ${description}`);
            // update user location maker
            marker = L.marker([lat, lng]).addTo(map);
            circle = L.circle([lat, lng], {radius: accuracy }).addTo(map);
            marker.bindPopup(`Current location: ${description}`).openPopup();

            //clearing current user zoom after location change
            if(!zoom){
            zoom = map.fitBounds(circle.getBounds());
            }
            //current user location country border
            highlightCountryBorders(userCountryCode);

            //return country Info fxn
            return getCountryInfo(userCountryCode);

            
        }).then((userCountry) =>{
            console.log("Country Info:", userCountry);
            const country = userCountry;
            
            //modal and layout info
            restModalAndLayoutInfo(country);

            return getWikipediaInfo(country.latlng[0], country.latlng[1]);

        }).then((wikiInfo) => {
            console.log("Wikipedia Info:", wikiInfo);
            const wikiUrl = `https://${wikiInfo.wikipediaUrl}`;
            $("#wikipediaInfo").text(wikiInfo.summary);
            $("#wikipediaLink").attr("href", wikiUrl);

            return getWeatherInfo(lat, lng);

        }).then((weather)=>{
            $("#temparatureMod").text(`${weather.main.temp} °C`)
        }).catch((error) => {
            console.log("Error in chain", error);
        });


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



//********************Filter Dropdown on Search**************************


$("#countrySearch").on("input", function () {
    const searchValue = $(this).val().toLowerCase();
    const dropdown = $("#countryDropdown");
    dropdown.empty();
    dropdown.append('<option value="">Select from searched below...</option>');

    
    let matchFound = false;
    
    // Check against the country list
    countryList.forEach(country => {
        const countryCode = country.cca2;
        const countryName = country.name.common.toLowerCase();
        if (countryName.includes(searchValue) || countryCode.toLowerCase().includes(searchValue)) {
            dropdown.append(`<option value="${countryCode}">${country.name.common} (${countryCode})</option>`);

            matchFound = true; // Mark that a match is found
            openCageUse = false; // Mark that openCage is not used
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
                
        if (openCageCountryList && openCageCountryList.length > 0) {
            openCageUse = true; // Mark as openCage is used
            openCageCountryList.forEach(result => {
                const formatted = result.formatted;
                const coords = result.geometry;
                const countryCode = result.components["ISO_3166-1_alpha-2"];
                

                dropdown.append(`<option value="${countryCode}">${formatted} (Coordinates: ${coords.lat}, ${coords.lng})</option>`);
            });


                // after selecting option navigate marker to coordinate of option selected
                $("#countryDropdown").on("change", function(){
                    if(!openCageUse) return;
                        
                    console.log(`OC is Active, opencage was false, but is set to: ${openCageUse}`);
                   
                    const SelectCountryCode = $(this).val();
                    console.log(SelectCountryCode);

                    const selectValue = openCageCountryList.find(result => result.components["ISO_3166-1_alpha-2"] === SelectCountryCode);

                    const coord = selectValue.geometry;

                    const countryInfo = selectValue.formatted;

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

                    //executing country Border JSON function
                    highlightCountryBorders(SelectCountryCode);

                    map.setView([coord.lat, coord.lng], 15);

                    //set manual selection flag to and stop geolocation updates
                    isManualSelection = true;
                    stopGeolocation();

                    getCountryInfo(SelectCountryCode).then((response)=>{
                        const country = response;
                        restModalAndLayoutInfo(country);
                    });



                //wikipedia get request with searched value from dropdown options
                $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "wikipedia", lat: coord.lat, lng: coord.lng},
                dataType: "json",
                success: function (wikiresponse){
                    // console.log("Response:", wikiresponse);
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
    



    // Fetch Country Info selected on Dropdown Change
    
    $("#countryDropdown").on("change", function () {
        
        if(openCageUse) {
            console.log("nothing will execute again, dropdown without search ");
            console.log(`opencage is activated, openCage value is set to: ${openCageUse}`);
            return;
        }

        const countryCode = $(this).val();
        console.log(`opencage is false so I got executed, value is: ${openCageUse}`);
        if (!countryCode) return;

        //hightlight selected country's border
        highlightCountryBorders(countryCode);                             

        // Show Loader
        $("#loading").removeClass("d-none");
        getCountryInfo(countryCode).then((response)=>{
            const country = response; 
            console.log(country);

            //clear marker if marker is !null
            if(marker){
                map.removeLayer(marker);
                map.removeLayer(circle);
            }
            //add marker
            marker = L.marker([country.latlng[0], country.latlng[1]]).addTo(map);
            // add pop up to selected country                
            marker.bindPopup(`<b>Country:</b><br>${country.name.common}`).openPopup();
            //et country map view
            map.setView([country.latlng[0], country.latlng[1]], 5);


            //modal and layout info
            restModalAndLayoutInfo(country);


            //set manual selection true and stop geolocation updates
            isManualSelection = true;
            stopGeolocation();
            
        });

    });

        
});
