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

    var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      }
    );



    // Initialize Map
    const map = L.map('map',{
        layers: [road]
    }).setView([54.5, -4], 6);

    //basemap layer button
    var basemaps = {
        "road": road,
        "Streets": streets,
        "Satellite": satellite,
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

    navigator.geolocation.watchPosition(userLocation, userErrorLocation);

    function userLocation(position){
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

    // const cordinates = userLocation()

    // console.log(cordinates.lat, cordinates.lng);

    let countryList = []; // Store fetched country data for searching

    // Fetch and Populate Country Dropdown
    $.ajax({
        url: "https://restcountries.com/v3.1/all",
        method: "GET",
        dataType: "json",
        success: function (response) {
            countryList = response; // Save country data for search functionality

            const dropdown = $("#countryDropdown");
            dropdown.empty(); // Clear existing options
            dropdown.append('<option value="">Select a country...</option>'); // Default option

            response.forEach(country => {
                const countryCode = country.cca2; // ISO 3166-1 alpha-2 code
                const countryName = country.name.common;
                dropdown.append(`<option value="${countryCode}">${countryName} (${countryCode})</option>`);

            });

        },
        error: function () {
            alert("Failed to load country list.");
        }
    });

    // Filter Dropdown on Search
    $("#countrySearch").on("input", function () {
        const searchValue = $(this).val().toLowerCase();
        const dropdown = $("#countryDropdown");
        dropdown.empty();
        dropdown.append('<option value="">Select from searched below...</option>');


        countryList.forEach(country => {
            const countryCode = country.cca2;
            const countryName = country.name.common.toLowerCase();
            

            if (countryName.includes(searchValue) || countryCode.toLowerCase().includes(searchValue)) {
                dropdown.append(`<option value="${countryCode}">${country.name.common} (${countryCode})</option>`);
            }
        });
    });

    //**************Listen and grab changes on the dropdown for weather info****************
    $("#countryDropdown").on("change", function(){
            //get the selected value
            const selectedValue = $(this).val();
            //selected coutry code
            console.log(selectedValue);
    
            if(selectedValue){
                const selectedCountry = countryList.find(country => country.cca2 === selectedValue);
    
            if(selectedCountry){
                    console.log("Country details:", selectedCountry.latlng);
    
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
                }
            }else{
                console.log("No country selected");
            }
        });

    // Fetch API Country Info on Dropdown Change
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


                //clearing 
                if(marker){
                    map.removeLayer(marker);
                    map.removeLayer(circle);
                }



                //add marker after selecting country on dropdown 
                marker = L.marker([country.latlng[0], country.latlng[1]]).addTo(map);
                //add pop up to selected country
                marker.bindPopup(`<b>Country:</b><br>${country.name.common}`).openPopup();

                map.setView([country.latlng[0], country.latlng[1]], 5);
                // console.log(countryList.latlng);



                const languages = Object.values(country.languages).join(", ");
                const currenciesDetail = Object.entries(country.currencies).map(([key, value]) =>{return `${value.name} (${value.symbol})`}).join(", ");
                const flagUrl = country.flags.png;

                $("#countryDetails").text(JSON.stringify(country, null, 2));
                $("#countryName").text(country.name.common);
                $("#officialName").text(country.name.nativeName.eng.official);
                $("#capitalName").text(country.capital[0]);
                $("#countryCode").text(country.cca2);
                $("#religion").text(country.region);
                $("#subRegion").text(country.subregion);
                $("#languages").text(languages);
                $("#currencies").text(currenciesDetail);
                $("#flag").html(`<img src=${flagUrl} alt="country Flag" style="width:20px;  height:20px;">`);


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