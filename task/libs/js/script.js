$(document).ready(function () {
    const apiUrl = "libs/php/getData.php";

    // Fetch Country Info
    $("#fetchCountryInfo").on("click", function () {
        const countryCode = $("#countryCode").val();
        $.ajax({
            url: apiUrl,
            method: "GET",
            data: {
                type: "countryInfo",
                country: countryCode
            },
            dataType: "json",
            success: function (response) {
                $("#countryInfoOutput").text(JSON.stringify(response, null, 2));
            },
            error: function () {
                alert("Failed to fetch country info");
            }
        });
    });

    // Fetch Timezone Info
    $("#fetchTimezoneInfo").on("click", function () {
        const lat = $("#lat").val();
        const lng = $("#lng").val();
        $.ajax({
            url: apiUrl,
            method: "GET",
            data: {
                type: "timezone",
                lat: lat,
                lng: lng
            },
            dataType: "json",
            success: function (response) {
                $("#timezoneInfoOutput").text(JSON.stringify(response, null, 2));
            },
            error: function () {
                alert("Failed to fetch timezone info");
            }
        });
    });

    // Fetch Earthquake Info
    $("#fetchEarthquakeInfo").on("click", function () {
        const north = $("#north").val();
        const south = $("#south").val();
        const east = $("#east").val();
        const west = $("#west").val();
        $.ajax({
            url: apiUrl,
            method: "GET",
            data: {
                type: "earthquake",
                north: north,
                south: south,
                east: east,
                west: west
            },
            dataType: "json",
            success: function (response) {
                $("#earthquakeInfoOutput").text(JSON.stringify(response, null, 2));
            },
            error: function () {
                alert("Failed to fetch earthquake info");
            }
        });
    });
});
