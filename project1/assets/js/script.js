$(document).ready(function () {
    //api call directory          
    const apiUrl = "libs/php/apiHandler.php";

    //declaring marker, circle, zoom
    let marker, circle, zoom, lat, lng, openCageData, description, userCountryCode;
    //opencage response array
    let openCageCountryList = [];
    let openCageUse = false;

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
            console.log(countryList);
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

    // Country Information easyButton
    countryInfoBtn = L.easyButton("fa-globe fa-xl", function (btn, map) {
        $("#countryInfoModal").modal("show");
    });
    countryInfoBtn.addTo(map);

    // Weather Information easyButton
const weatherInfoBtn = L.easyButton("fa-cloud-sun fa-xl", function (btn, map) {
    $("#weatherInfoModal").modal("show");
  });
  weatherInfoBtn.addTo(map);

    // Weather Information easyButton
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

                    console.log(currencyCode);
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

    // function getCountryInfo(countryCode){
    //     showLoader();
    //     return new Promise((resolve, reject) => {
            
    //         $.ajax({
    //             url: apiUrl,
    //             method: "GET",
    //             data: { type: "countryInfo", countryCode: countryCode },
    //             dataType: "json",
    //             success: function (response) {
    //                 console.log(response);
    //                 if (response && response.length > 0) {
    //                 userCountry = response[0];
    //                 console.log(userCountry);
    //                 resolve(response[0]);
    //                 console.log(response[0]);
    //                 } else {
    //                 reject("Country info not found.");
    //                 }
    //             },
    //             error: function () {
    //                 hideLoader();
    //                 reject("Failed to fetch country info.");
    //             },
    //             });
    //     });
    // }



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

                        console.log(`base currencyCode: ${baseCode}`);
                        console.log(`base unit: ${baseUnit}`);

                        console.log(`target USD code: ${targetCode}`);
                        console.log(`target unit: ${targetUnit}`);

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

                        console.log(`base currencyCode: ${baseCode}`);
                        console.log(`base unit: ${baseUnit}`);

                        console.log(`target USD code: ${targetCode}`);
                        console.log(`target unit: ${targetUnit}`);

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
                console.log(`base currency data: `, response);
               
               console.log(`base code now: ${baseCurrencyCode}`);
            //    get target currency unit from select curency ojject
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
        console.log(`current base unit, ${currentBaseUnit}`);
        console.log(typeof(currentBaseUnit));
        
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
        console.log(`current target unit, ${currentTargetUnit}`);
        console.log(typeof(currentTargetUnit));
        
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

    // $(document).ready(function() {
    //     // Add an event listener for the input event
    //     $('#targetCurrencyAmountInput').on('input', function() {
    //         // Get the value of the input element
    //         const inputValue = $(this).val();
            
    //         // Perform any action with the input value (e.g., log to console)
    //         console.log(`Input Value: ${inputValue}`);
            
    //         // Example: Update another element with the input value
    //         $('#output').text(`Entered Amount: ${inputValue}`);
    //     });
    // });

    // function getWikipediaInfo(countryName){
    //     // showLoader();
    //     return new Promise((resolve, reject)=>{
    //         $.ajax({
    //             url: apiUrl, // Ensure apiUrl is correctly defined
    //             method: "GET",
    //             data: { type: "wikipedia", countryName: countryName },
    //             dataType: "json",
    //             success: function (wikiResponse) {
    //                 if (wikiResponse && wikiResponse.geonames && wikiResponse.geonames.length > 0) {
    //                     const wikiInfo = wikiResponse.geonames[0];
    //                     const wikiUrl = `https://${wikiInfo.wikipediaUrl}`;
    //                     console.log(`wiki info `, wikiInfo.summary);
    //                     console.log(wikiResponse);
    //                     $("#wikipediaInfo").text(wikiInfo.summary);
    //                     $("#wikipediaLink").attr("href", wikiUrl);
    
    //                     resolve(wikiResponse.geonames[0]);
    //                 } else {
    //                     reject("No Wikipedia information found.");
    //                 }
    //             },
    //             error: function (jqXHR, textStatus, errorThrown) {
    //                 hideLoader();
    //                 console.error("Error fetching Wikipedia information:", textStatus, errorThrown);
    //                 reject("Failed to fetch Wikipedia information.");
    //             },
    //         });
    //     });
    // }

    function getWikipediaInfo(countryName) {
        // showLoader();
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "wikipedia", countryName: countryName},
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

    //weather api call
    function getWeatherInfo(lat, lng){
        // showLoader();
        return new Promise((resolve, reject)=> {
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: {type: "weather", lat: lat, lng: lng},
                dataType: "json",
                success: function (response){
                    const weatherInfo = response;
                    if(weatherInfo){
                        resolve(weatherInfo); 
                    }else{
                        reject("No weather info found");
                    }
                    // $("#weatherInfo").text(JSON.stringify(weatherInfo, null, 2));
                    $("#temparatureMod").text(`${weatherInfo.main.temp} °C`);

                    $("#weatherLocation").text(` ${weatherInfo.name}`);
                    console.log(`${weatherInfo.coord.lat}, ${weatherInfo.coord.lon}`)
                    $("#weatherCoordinates").text(`Latitude: ${weatherInfo.coord.lat}, Longitude: ${weatherInfo.coord.lon}`);

                    $("#weatherDesc").text(`${weatherInfo.weather[0].main}, ${weatherInfo.weather[0].description}`);

                    $("#temparatureLay").text(`${weatherInfo.main.temp} °C`);

                    $("#tempFeelsLike").text(`${weatherInfo.main.feels_like}°C`);

                    $("#minTemp").text(`${weatherInfo.main.temp_min}°C`);

                    $("#maxTemp").text(`${weatherInfo.main.temp_max}°C`);

                    $("#tempPressure").text(`${weatherInfo.main.pressure}hPa`);

                    $("#tempHumidity").text(`${weatherInfo.main.humidity}%`);

                    $("#tempVisibility").text(`${weatherInfo.visibility} m`);

                    $("#windSpeed").text(`${weatherInfo.wind.speed} m/s`);

                    $("#windDirection").text(`${weatherInfo.wind.deg}°`);

                    $("#windCloud").text(`${weatherInfo.clouds.all}%`);
                    
                    //convert unix time to human readable
                    const sunRiseDate = new Date(weatherInfo.sys.sunrise * 10000);
                    const sunRiseTime = sunRiseDate.toLocaleTimeString();

                    const sunSetDate = new Date(weatherInfo.sys.sunset * 10000);
                    const sunSetTime = sunSetDate.toLocaleTimeString();
                    if(sunRiseTime){
                        $("#sunRise").text(`${sunRiseTime} UTC`);
                    }

                    if(sunSetTime){
                        $("#sunSet").text(`${sunSetTime} UTC`);
                    }
 
                },
                error: function(){
                    hideLoader();
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




    // point of interest marker clusters functions
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

            console.log(`user countryName`, countryName);
            console.log(`user currency`, currencyCode);
            //wikipedia info function
            getWikipediaInfo(countryName);

            baseSelect = false;
            //user currency info
            getUserExchangeRate(currencyCode);
            
            //return country Info fxn
            return getCountryInfo(userCountryCode);

            
        }).then((userCountry) =>{
            console.log("Country Info:", userCountry);
            const country = userCountry;
            
            //modal and layout info
            restModalAndLayoutInfo(country);

            //weather info function
            getWeatherInfo(lat, lng);




            

        }).catch((error) => {
            console.log("Error in chain", error);
        }).finally(()=>{
            hideLoader();
        })


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

    console.log(searchValue);
    const dropdown = $("#countryDropdown");
    dropdown.empty();
    dropdown.append('<option value="">Select from searched below...</option>');

    
    let matchFound = false;
    
    // Check against the country list
    countryList.forEach(country => {
        const countryCode = country.code;
        const countryName = country.name.toLowerCase();
        if (countryName.includes(searchValue) || countryCode.toLowerCase().includes(searchValue)) {
            dropdown.append(`<option value="${countryCode}">${countryName.toUpperCase()} (${countryCode})</option>`);

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

                    //search openCage for the selected country Info
                    const selectValue = openCageCountryList.find(result => result.components["ISO_3166-1_alpha-2"] === SelectCountryCode);

                    //search countryList array for matching country code and countryName
                    const countryName = countryList.find(country => country.code === SelectCountryCode);

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
                        //calling weather function
                        getWeatherInfo(selectValue.geometry.lat, selectValue.geometry.lng);

                        //calling wikipedia function
                        getWikipediaInfo(countryName);
                        return getGeocodeReverse(selectValue.geometry.lat, selectValue.geometry.lng);
                    }).then(({currencyCode})=>{
                        console.log(`selected country currency code: ${currencyCode}`);
                        dropdownGetExchangeRate(currencyCode);
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
        const countryCode = $(this).val();

        console.log(countryCode)
        
        if(openCageUse) return;

        if(!countryCode) return ;

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
            
            //calling weather function
            getWeatherInfo(country.latlng[0], country.latlng[1]);

            //getting country currency code
            getGeocodeReverse(country.latlng[0], country.latlng[1]).then(({currencyCode})=>{
                console.log(`dropdown country currency code: ${currencyCode}`);
                dropdownGetExchangeRate(currencyCode);
            })

            //calling wikipedia function
            getWikipediaInfo(country.name.common);
            console.log(country.name.common);


            //set manual selection true and stop geolocation updates
            isManualSelection = true;
            stopGeolocation();
            
        });

    });

        
});
