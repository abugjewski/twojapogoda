window.addEventListener("load", () => {
    let long;
    let lat;

    const body = document.querySelector("body");
    const location = document.querySelector(".location");
    const currentTemperature = document.querySelector(".current-temperature");
    const hourTemperature = document.querySelector(".hour-temperature");
    const tomorrowTemperature = document.querySelector(".tomorrow-temperature");
    const currentSummary = document.querySelector(".current-summary");
    const hourSummary = document.querySelector(".hour-summary");
    const tomorrowSummary = document.querySelector(".tomorrow-summary");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = "https://cors-anywhere.herokuapp.com/";
            const api = `${proxy}https://api.darksky.net/forecast/4eeccb1b0367029f82cf504c23e547e6/${lat},${long}?lang=pl`;
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    const {temperature, summary, icon} = json.currently;
                    const {temperature : hourTemperatureData, summary : hourSummaryData, icon : hourIcon, } = json.hourly.data[1];
                    const {temperatureLow : tomorrowTemperatureLow, temperatureHigh : tomorrowTemperatureHigh, summary : tomorrowSummaryData, icon : tomorrowIcon} = json.daily.data[1];
                    console.log(json.daily.data[1]);

                    setBodyBg((temperature-32) * (5/9));
                    location.textContent = json.timezone;
                    setIcon(icon, document.querySelector(".icon"), "#2d2d2d");
                    currentTemperature.textContent = Math.floor((temperature-32) * (5/9)) + " °C";
                    currentSummary.textContent = summary;
                    setIcon(hourIcon, document.querySelector(".hour-icon"), "#6d6d6d");
                    hourTemperature.textContent = Math.floor((hourTemperatureData-32) * (5/9)) + " °C";
                    hourSummary.textContent = hourSummaryData;
                    setIcon(tomorrowIcon, document.querySelector(".tomorrow-icon"), "#6d6d6d");
                    tomorrowTemperature.textContent = Math.floor((((tomorrowTemperatureLow + tomorrowTemperatureHigh)/2)-32) * (5/9)) + " °C (śr.)";
                    tomorrowSummary.textContent = tomorrowSummaryData;
                })
    });
}

function setBodyBg(temp) {
    if (temp < 5) {
        body.classList.add("coldest-bg");
    } else if (temp > 5 && temp < 12) {
        body.classList.add("cold-bg");
    } else if (temp > 12 && temp < 20) {
        body.classList.add("finetemp-bg");
    } else {
        body.classList.add("hot-bg");
    }
}

function setIcon(icon, iconID, iconColor) {
    const skycons = new Skycons({color: iconColor});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}
});