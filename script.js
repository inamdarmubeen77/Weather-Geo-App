// Loader (hide on page load)
const main_loader_container = document.getElementById('main-loader-container');
const loader_container = document.querySelector('.loader-container');
const data_loader_container = document.getElementById('data_loader_container');
const loader = document.querySelector('.loader');
const body = document.body;

window.addEventListener('load', () => {

    body.classList.remove('loading');
    main_loader_container.classList.add('loader-hidden');
    main_loader_container.addEventListener('transitionend', () => {
        main_loader_container.remove();
    })

    data_loader_container.classList.add('loader-hidden');
    // data_loader_container.addEventListener('transitionend', () => {
    //     data_loader_container.removeChild(data_loader_container);
    // })

    getUserLocationOnLoad((userLocation) => {
        if (userLocation.length > 0) {
            setTimeout(() => {
                input_1.value = userLocation;   // Set input-1 value as user's location co-ordinates
                input_1_submit.click();         // Submit the form with that value
                input_1.value = "";             // Clear the input-1 value & make it blank again
            }, 2000);
        }
    });
});

// Get User Location with (PERMISSION)
function getUserLocationOnLoad(callback) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const onload_latitude = position.coords.latitude;
            const onload_longitude = position.coords.longitude;

            console.log(`(User granted location permission) Latitude: ${onload_latitude}, Longitude: ${onload_longitude}`);
            const userLocation = `${onload_latitude}, ${onload_longitude}`;
            callback(userLocation); // Call the callback with the location data
        },
            (error) => {
                console.error("Error getting user location: ", error);
                callback(""); // Call the callback with an empty string if there's an error
            });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(""); // Call the callback with an empty string if geolocation is not supported
    }
}

// Adjusting scroll height when it scrolls to an element
const navigationHeight = document.querySelector('.navbar').offsetHeight;
document.documentElement.style.setProperty('--scroll-padding', navigationHeight + 5 + 'px');

// Navbar (close nav on clicking any <a> links)
const navbar = document.querySelector('.navbar');
const nav_button = document.querySelector('.navbar-toggler');
const nav_div = document.getElementById('navbarSupportedContent');
const nav_links = document.querySelectorAll('.nav-link');

nav_links.forEach((nav_link) => {
    nav_link.addEventListener('click', () => {
        nav_button.classList.toggle('collapsed');
        nav_div.classList.toggle('show');
    });
});


// Main Input Box (on unfocus)
const input_1 = document.getElementById('input-1');
const input_1_label = document.querySelector('.input-1-label');
const input_1_form = document.getElementById('input-1-form')
const input_1_submit = document.getElementById('input-1-submit');
const input_expand = document.querySelector('.input-expand');

input_1.addEventListener('blur', () => {

    if ((input_1.value).length > 0) {
        input_1_label.style.top = "20%";
        input_1_label.style.fontSize = "calc(0.6em + 0.5vw)";
    }
    else if ((input_1.value).length < 1) {
        input_1_label.style.top = "";
        input_1_label.style.fontSize = "";
    }
})


// Get data (send/receive request)
const response_data = document.querySelector('.response-data');
const full_location = document.getElementById('full_location');
const resp_coordinates = document.getElementById('resp_coordinates');
const resp_weather_desc = document.getElementById('resp_weather_desc');
const resp_temperature = document.getElementById('resp_temperature');
const resp_wind_speed = document.getElementById('resp_wind_speed');
const resp_wind_deg = document.getElementById('resp_wind_deg');
const resp_wind_dir = document.getElementById('resp_wind_dir');
const weather_icon = document.getElementById('weather_icon');
const main_data = document.getElementById('main_data');
const display_error = document.getElementById('display_error');
const data_header = document.querySelector('.data-header');
const resp_timezone = document.getElementById('resp_timezone');
const resp_humidity = document.getElementById('resp_humidity');
const resp_precipitation = document.getElementById('resp_precipitation');
const wind_deg_arrow = document.querySelector('.wind-deg-arrow');
const data_counter = document.querySelector('.data-counter');


input_1_form.addEventListener('submit', async function (event) {

    event.preventDefault();

    // Display Loader until data is fetched
    data_loader_container.classList.remove('loader-hidden');

    // Hiding the MAIN-DATA-DIV until data is fetched
    response_data.classList.add('hide');

    // Expand main response(data/error) tab
    input_expand.classList.add('input-1-main-div-expand');


    const city = input_1.value;
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=30`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a969c52006msh4cc0b8ea42a87d7p1e9e4cjsnca2d3118c697',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    try {

        //=============================================== Data Response Start ===============================================//


        const response = await fetch(url, options);
        const result = await response.json();

        // Assigning values to parameters
        full_location.innerHTML = `📌${result.location.name}, ${result.location.region}, ${result.location.country}`;
        resp_coordinates.innerHTML = `Latitude <b>${result.location.lat.toPrecision(5)}</b>, Longitude <b>${result.location.lon.toPrecision(5)}</b>`;
        resp_weather_desc.innerHTML = `${result.current.condition.text}`;
        resp_temperature.innerHTML = `${result.current.temp_c}°C / ${result.current.temp_f}°F`;
        resp_wind_speed.innerHTML = `${result.current.wind_kph}kph / ${result.current.wind_mph}mph`;
        resp_wind_deg.innerHTML = `${result.current.wind_degree}°`;
        wind_deg_arrow.style.rotate = `${result.current.wind_degree}deg`; // rotate arrow automatically
        resp_wind_dir.innerHTML = `(${result.current.wind_dir})`;
        weather_icon.src = result.current.condition.icon;
        resp_timezone.innerHTML = `${result.location.tz_id}`;
        resp_humidity.innerHTML = `${result.current.humidity}%`;
        resp_precipitation.innerHTML = `${result.current.precip_mm}mm / ${result.current.precip_in}in`;




        //=============================================== Weather Forecast ===============================================//




        // Get a reference to the container where you want to append the forecasts
        const container = document.getElementById("per-day-forecast");

        // Clear the existing forecast elements so they don't repeat on calling
        container.innerHTML = '';

        // Counter to identify how many iterations are consumed
        let dayCounter = 0;

        for (let i = 0; i < result.forecast.forecastday.length; i++) {
            // Create a div for the forecast
            const forecastDiv = document.createElement('div');
            forecastDiv.classList.add('per-day-forecast', 'row', 'text-center', 'm-3', 'd-flex', 'align-items-center', 'justify-content-around', 'text-muted');

            // Fill in the data for this forecast
            forecastDiv.innerHTML = `
                    <b class="col-md-3 forecast-date text-secondary p-2 fs-5">${dateFormat(result.forecast.forecastday[i].date, 'dd \n mm \n yyyy')}</b>
                    <div class="col-md-2 p-2">
                        <img class="forecast_weather_icon" src="${result.forecast.forecastday[i].day.condition.icon}" alt="forecast_weather_icon">
                    </div>
                    <div class="col-md weather-forecast-details p-2 pb-0">
                        <span>
                            Condition <b class="fs-5">${result.forecast.forecastday[i].day.condition.text}</b><br>
                            Temperature <b class="fs-5">${result.forecast.forecastday[i].day.avgtemp_c}</b>°c / <b class="fs-5">${result.forecast.forecastday[i].day.avgtemp_f}</b>°f<br>
                            Humidity <b class="fs-5">${result.forecast.forecastday[i].day.avghumidity}</b>% (percent)<br>
                            Precipitation <b class="fs-5">${result.forecast.forecastday[i].day.totalprecip_mm}</b>mm / <b class="fs-5">${result.forecast.forecastday[i].day.totalprecip_in}</b>in
                            </span>
                            </div>
                            <div class="col-md forecast_more_details p-2 pt-0">
                            <span>
                            Wind Speed <b class="fs-5">${result.forecast.forecastday[i].day.maxwind_kph}</b>kph / <b class="fs-5">${result.forecast.forecastday[i].day.maxwind_mph}</b>mph<br>
                            Max Temperature <b class="fs-5">${result.forecast.forecastday[i].day.maxtemp_c}</b>°c / <b class="fs-5">${result.forecast.forecastday[i].day.maxtemp_f}</b>°f<br>
                            Min Temperature <b class="fs-5">${result.forecast.forecastday[i].day.mintemp_c}</b>°c / <b class="fs-5">${result.forecast.forecastday[i].day.mintemp_f}</b>°f<br>
                            Timezone <b class="fs-5">${result.location.tz_id}</b>
                        </span>
                    </div>
                `;

            // Append the forecastDiv to the container
            container.appendChild(forecastDiv);

            // Count days to display in the header 'NOTE' according to iterations in this loop
            dayCounter++;
        }

        // Count days to display in the header 'NOTE' according to iterations in above loop
        data_counter.innerHTML = dayCounter;

        // window automatically scrolls to data when fetched
        location.href = '#response-data';

        // {display: none} the 'error-message div' to hide it
        display_error.classList.add('hide');

        // {display: block} the data-div to display the information
        main_data.classList.remove('hide');

        // {display: block} the data-header-h1 to display the Header
        data_header.classList.remove('hide');

        // {display: block} the div that transition into view from behind the input-box
        response_data.classList.remove('hide');

        // hide loader when data is fetched
        data_loader_container.classList.add('loader-hidden');
        // data_loader_container.addEventListener('transitionend', () => {
        //     data_loader_container.remove();
        // })

        setTimeout(() => {
            full_location.style.background = 'white';
            full_location.style.padding += '0.5em';
        }, 500)

        setTimeout(() => {
            full_location.style.background = '';
            full_location.style.padding = '';
        }, 1200)


        //=============================================== Data Response End ===============================================//


    } catch (err) {
        // print the error to console as well
        console.error(err);

        data_loader_container.classList.add('loader-hidden');
        // data_loader_container.addEventListener('transitionend', () => {
        //     data_loader_container.remove();
        // })
        display_error.classList.remove('hide'); // display the div containing error screen
        response_data.classList.add('hide'); // hide the whole div containing all data

        location.href = '#data_loader_container';
    }
})


// Format the date to DD-MM-YYYY
function dateFormat(inputDate, format) {
    const date = new Date(inputDate);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return format
        .replace("dd", String(date.getDate()).padStart(2, "0") + "\n")
        .replace("mm", months[date.getMonth()] + "\n")
        .replace("yyyy", String(date.getFullYear()))
        .replace("yy", String(date.getFullYear()).substr(-2));
}

// Updates the copyright year automatically so I don't have to do it manually
document.getElementById('copyrightYear').innerHTML = new Date().getFullYear();

// Flashes elements after scrolling to them for user attention
function flash(event) {

    const targetId = event.target.hash.substring(1); // Remove the '#' symbol
    if (targetId == 'body') { /* DO NOTHING */ }
    else {
        setTimeout(() => {
            document.getElementById(`${targetId}`).style.transition = 'none';
            document.getElementById(`${targetId}`).style.outline = '5px dashed red';
            document.getElementById(`${targetId}`).style.outlineOffset = '-5px';
        }, 800)

        setTimeout(() => {
            document.getElementById(`${targetId}`).style.transition = '';
            document.getElementById(`${targetId}`).style.outline = '';
            document.getElementById(`${targetId}`).style.outlineOffset = '';
        }, 1500)
    }
}

// Toggle visibility of the 'About' section
const disclaimer_popup = document.getElementById('disclaimer-popup');
const aboutButton = document.querySelector('.aboutButton');
const rotate_button = document.getElementById('rotate_button');

function toggleAboutSection() {
    if (disclaimer_popup.classList.contains('hide')) {
        disclaimer_popup.classList.remove('hide');
        rotate_button.style.transform = '';
        console.log('it is present');
    } else {
        disclaimer_popup.classList.add('hide');
        rotate_button.style.transform = 'rotate(-0.50turn)';
        console.log('not present');
    }
}