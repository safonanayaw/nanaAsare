function getGeocodeReverse(lat, lng) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: apiUrl,
        method: "GET",
        data: { type: "geocodeReverse", lat: lat, lng: lng },
        dataType: "json",
        success: function (response) {
          const openCageData = response.results;
          const userCountryCode = openCageData[0].components["ISO_3166-1_alpha-2"];
          const description = openCageData[0].formatted;
  
          if (lat && lng && description) {
            resolve({ lat, lng, userCountryCode, description });
          } else {
            reject("Reverse geocoding failed to return valid data.");
          }
        },
        error: function () {
          reject("Failed to reverse geocode for the current user location.");
        },
      });
    });
  }
  
  function getCountryInfo(userCountryCode) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: apiUrl,
        method: "GET",
        data: { type: "countryInfo", countryCode: userCountryCode },
        dataType: "json",
        success: function (response) {
          if (response && response.length > 0) {
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
  
  function getWikipediaInfo(lat, lng) {
    return new Promise((resolve, reject) => {
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
  
  // Chain the calls
  getGeocodeReverse(48.8566, 2.3522) // Replace with dynamic lat, lng
    .then(({ lat, lng, userCountryCode, description }) => {
      console.log(`Reverse Geocode Data: ${description}`);
      // Optionally update the map or UI here
      return getCountryInfo(userCountryCode);
    })
    .then((countryInfo) => {
      console.log("Country Info:", countryInfo);
      // Optionally update the UI with country information
      return getWikipediaInfo(countryInfo.latlng[0], countryInfo.latlng[1]); // Use country's coordinates
    })
    .then((wikiInfo) => {
      console.log("Wikipedia Info:", wikiInfo);
      const wikiUrl = `https://${wikiInfo.wikipediaUrl}`;
      $("#wikipediaInfo").text(wikiInfo.summary);
      $("#wikipediaLink").attr("href", wikiUrl);
    })
    .catch((error) => {
      console.error("Error in chain:", error);
    });
  
    // $.ajax({
        //     url: apiUrl,
        //     method: "GET",
        //     data: {type: "geocodeReverse", lat: lat, lng: lng},
        //     dataType: "json",
        //     success: function (response){
        //         openCageData = response.results;
        //         userCountryCode = openCageData[0].components["ISO_3166-1_alpha-2"];
        //         description = openCageData[0].formatted;

        //         if(lat && lng && description){
        //             marker = L.marker([lat, lng]).addTo(map);
        //             circle = L.circle([lat, lng], {radius: accuracy }).addTo(map);
        //             marker.bindPopup(`Current location: ${description}`).openPopup();
        
        //             //clearing current user zoom after location change
        //             if(!zoom){
        //             zoom = map.fitBounds(circle.getBounds());
        //             }
        //             //current user location country border
        //             highlightCountryBorders(userCountryCode);
        //             };


        //      },
        //      error: function(){
        //         console.log("Failed to reverse geocode for current user location");
        //      }
        //     });



        //     //current user's location weather and country info start here********************
        //     $.ajax({
        //         url: apiUrl,
        //         method: "GET",
        //         data: { type: "countryInfo", countryCode: userCountryCode },
        //         dataType: "json",
        //         success: function (response) {
        //             const country = response[0];
                    
        //         if(country){
        //         console.log(country);
        //         const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
        //         const currenciesDetail = country.currencies ? Object.entries(country.currencies).map(([key, value]) =>{return `${value.name} (${value.symbol})`}).join(", ") : "N/A";
        //         const flagUrl = country.flags ? country.flags.png : "N/A";
        //         const googleMaps = country.maps.googleMaps;
        //         const openStreetMaps = country.maps.openStreetMaps;
    
                
        //         //country info layout here *******************************************
        //         $("#flag").html(flagUrl ? `<h4>Country Flag</h4> <img src=${flagUrl} alt="country Flag" class="mb-3 img-fluid" style="max-width: 200px;">` : "N/A");
    
        //         $("#countryDetails").text(JSON.stringify(country, null, 2));
    
        //         $("#officialName").html(country.name && country.name.nativeName && country.name.nativeName.eng ? `<strong>Official Name: </strong>${country.name.nativeName.eng.official}` : `<strong>Official Name: </strong> N/A`);
    
        //         $("#countryName").html(country.name ? `<strong>Country Name: </strong> ${country.name.common}` : `<strong>Country Name: </strong> N/A`);
    
        //         $("#capitalName").html(country.capital ? `<strong>Capital: </strong>${country.capital[0]}` : `<strong>Capital: </strong> N/A`);
    
        //         $("#countryCode").html(country.cca2 ? `<strong>Country Code: </strong> ${country.cca2}` : `<strong>Country Code: </strong> N/A`);
                
        //         $("#region").html(country.region ? `<strong>Region: </strong> ${country.region }`: `<strong>Region: </strong> N/A`);
        //         $("#subRegion").html(country.subregion ? `<strong>Sub Region: </strong>${country.subregion}` : `<strong>Subregion: </strong> N/A`);
    
        //         $("#languages").html(languages ? `<strong>Language(s): </strong>${languages}`: `<strong>Language(s): </strong> N/A`);
        //         $("#currencies").html(currenciesDetail ? `<strong>Currencie(s): </strong>${currenciesDetail}`: `<strong>Currencie(s): </strong> N/A`);
    
        //         $("#area").html(country.area ? `<strong>Area: </strong>${country.area} km²`: `<strong>Area: </strong> N/A`);
    
        //         $("#population").html(country.population ? `<strong>Population: </strong>${country.population}`: `<strong>Population: </strong> N/A`);
    
        //         $("#timeZone").html(country.timezones[0] ? `<strong>Time Zone: </strong>${country.timezones[0]}`: `<strong>Timezones: </strong> N/A`);
    
        //         $("#callingNumber").html(country.idd ? `<strong>Calling Number: </strong>${country.idd.root+country.idd.suffixes[0] }`: `<strong>Calling Code: </strong> N/A`);
    
        //         $("#unMember").html(country.unMember === true ? `<strong>UN Member: </strong>Yes`: `<strong>UN Member: </strong> No`);
                
        //         $("#startOfWeek").html(country.startOfWeek ? `<strong>Start Week: </strong>${country.startOfWeek}`:  `<strong>Start Week: </strong> N/A`);
    
        //         $("#googleMap").attr("href", googleMaps);
        //         $("#openStreetMap").attr("href", openStreetMaps);
    
        //         $("#coatOfArm").html(country.coatOfArms.png ? `<h4>Coat of Arms</h4> <img src=${country.coatOfArms.png} alt="country Flag" class="mb-3 img-fluid" style="max-width: 100px;"> `: "");
        //         //country info layout end here *******************************************
    
                
        //         // modal layout start here ******************************************
        //         $("#countryNameMod").text(country.name ? country.name.common : "N/A");
        //         $("#officialNameMod").text(country.name && country.name.nativeName && country.name.nativeName.eng ? country.name.nativeName.eng.official : "N/A");
        //         $("#capitalNameMod").text(country.capital ? country.capital[0] : "N/A");
        //         $("#countryCodeMod").text(country.cca2 ? country.cca2 : "N/A");
        //         $("#regionMod").text(country.region ? country.region : "N/A");
        //         $("#subRegionMod").text(country.subregion ? country.subregion : "N/A");
        //         $("#languagesMod").text(languages);
        //         $("#currenciesMod").text(currenciesDetail);
        //         $("#flagMod").html(flagUrl ? `<img src=${flagUrl} alt="country Flag" style="width:20px;  height:20px;">` : "N/A");
        //         // modal layout ends here ******************************************

        //     };
        //         },
        //         error: function () {
        //             // alert("Failed to fetch country info.");
        //         },
        //     });
        //     //current user's location weather and country info ends here********************

        //     //wikipedia info
        //     $.ajax({
        //         url: apiUrl,
        //         method: "GET",
        //         data: {type: "wikipedia", lat: lat, lng:lng},
        //         dataType: "json",
        //         success: function (wikiresponse){
        //             console.log("Response:", wikiresponse);
        //             // const selectedWikiInfo = wikiresponse.find()
        //             if(wikiresponse && wikiresponse.geonames && wikiresponse.geonames.length > 0){
        //             // const wikiInfo = wikiresponse.find(wiki => wikiresponse.geonames.countryCode === selectValue);
        //             // console.log(wikiInfo);
        //             const wikiInfo = wikiresponse.geonames[0];
        //             const wikiUrl =`https://${wikiresponse.geonames[0].wikipediaUrl}`;

        //             //update the wiki field in html
        //             $("#wikipediaInfo").text(wikiInfo.summary);
        //             //update the wikiUrl IN THE HTML
        //             if(wikiUrl){
        //             $("#wikipediaLink").attr("href", wikiUrl);
        //             }
        //             }else{
        //             console.error("No wikipedia information found in the response");
        //             $("#wikipediaInfo").text("Failed to load wikipedia information")
        //             }
        //             }
        //         });