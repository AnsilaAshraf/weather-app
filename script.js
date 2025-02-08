const apiKey = '589d96b413e64e318f5125707211507'; // Get your API key from OpenWeatherMap
let currentCity = 'palakkad';

async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;
    
    if (!city) return;
    
    try {
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&key=${apiKey}&units=metric`);
        
        const response = await fetch( `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);

        const data = await response.json();

        displayWeather(data);


    } catch (error) {

    }
}

function displayWeather(data) {

    // console.log('data ')


    console.log(data.location);
    console.log(data.current);


    // console.log(data)
    document.getElementById('temperature').textContent = Math.round(data.current.temp_c);
    document.getElementById('location').textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph} k/h`;
    document.getElementById('clouds').textContent = `${data.clouds.all}%`;
    
    // Set weather icon
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = 'weather-icon fas';

    console.log("get data");
    console.log(data.weather[0].main);
    
    switch (data.weather[0].main) {
        case 'Clear':
            weatherIcon.classList.add('fa-sun');
            break;
        case 'Clouds':
            weatherIcon.classList.add('fa-cloud');
            break;
        case 'Rain':
            weatherIcon.classList.add('fa-cloud-rain');
            break;
        case 'Snow':
            weatherIcon.classList.add('fa-snowflake');
            break;
        default:
            weatherIcon.classList.add('fa-cloud');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`
                );
                const data = await response.json();
                
                if (response.ok) {

                    console.log("get the data from the server, get the location");
                    console.log(data);
                    displayWeather(data);
                    currentCity = data.name;
                }
            } catch (error) {
                showError("An error occurred. Please try again later.");
            }
        }, error => {
            showError("Unable to get your location. Please enable location services.");
        });
    } else {
        showError("Geolocation is not supported by your browser.");
    }

    console.log("get the location");
    
}

function openInMaps() {
    if (currentCity) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${currentCity}`);
    }
}

function showError(message) {
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.weather-app').appendChild(errorDiv);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add event listener for Enter key in search input
document.getElementById('city-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

// Initialize with user's location
getCurrentLocation(); 