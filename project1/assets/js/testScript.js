function getEarthquake (north, south, east, west) {
    return new Promise((resolve, reject=>{
        $.ajax({
            url: apiUrl,
            method: "GET",
            data: {type: "earthquarkes", north: north, south: south, east: east, west: west},
            dataType: "json",
            success: function(response){
                if(response.earthquakes){
                    const earthQuakeData = response.earthquakes;
                    resolve({earthQuakeData});
                }else{
                    reject("no earthquake data found")
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                hideLoader();
                console.error("Error fetching earthquake data:", textStatus, errorThrown);
                reject("Failed to fetch earthquake data information.");
            },
        })
    })) 
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //geocode function
    function geoCode (query) {
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: apiUrl,
                method: "GET",
                data: { type: "geocode", query: query },
                dataType: "json",
                success: function(response) {
                    console.log(response);
                    if(response.results){
                        resolve({response});
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
    
            geoCode(searchValue).then(({response})=>{
                if(response.results){
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
                            // const countryName = countryList.find(country => country.code === SelectCountryCode);
                            const countryName = selectValue.components.country;
            
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
                                console.log(`country name: ${countryName}`);
                                return getGeocodeReverse(selectValue.geometry.lat, selectValue.geometry.lng);
                            }).then(({currencyCode})=>{
                                console.log(`selected country currency code: ${currencyCode}`);
                                dropdownGetExchangeRate(currencyCode);
                            });
            
                });
            
                    
                } else {
                    dropdown.append('<option value="">No matches found</option>');
                }
            }
        
            })        
    
        }
        });