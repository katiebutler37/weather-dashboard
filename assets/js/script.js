var searchHistory = [];
var geoapify = "https://api.geoapify.com";
var geoapifyApiKey = "5f6f470ded3b4d53b71e4c9a2385246a";
var onecall = "https://api.openweathermap.org";
var onecallApiKey = "0b0775930b7defc71f282858d288d0c6";

var cityInputEl = document.querySelector("#city");
var cityFormEl = document.querySelector(".city-form");
var displayContainerEl = document.querySelector(".display-container");
var cityTitleEl = document.querySelector('.city-title');
var currentWeatherContainerEl = document.querySelector(".current-weather-container");

//Variable storing today's date
var currentDay = moment().format("L");

var getCityCoordinates = function(city) {
    // format the geoapify api url
    var geoapifyUrl =  geoapify + "/v1/geocode/search?city=" + city + "&apiKey=" + geoapifyApiKey;
  
    // make a get request to url
    fetch(geoapifyUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
              if (data.features.length > 0) {
              //grab data from first item in features array because they are ordered from highest to lowest popularity ranking
            var latitude = data.features[0].properties.lat;
            var longitude = data.features[0].properties.lon;
            //*IMPORTANT NOTE: YOU CAN GIVE LOCAL VARIABLES TO ANOTHER FUNCTION IF WITHIN THE LOCAL FUNCTION...YOU CALL THE OTHER FUNCTION AND PASS THE VARIABLES AS AN ARGUMENT 
            // call getWeatherData 
            getWeatherData(latitude, longitude);
            // localStorage.setItem("latitude", JSON.stringify(latitude));
            // localStorage.setItem("longitude", JSON.stringify(longitude));
              } else {
                alert('Error: City Not Found');
                // clear old content
                cityInputEl.value = "";
              }
          });
        } else {
          alert('Error: City Not Found');
          // clear old content
          cityInputEl.value = "";
        }
      })
      .catch(function(error) {
        alert('Error: Unable to connect to server');
        // clear old content
        cityInputEl.value = "";
      });
  };

  var getWeatherData = function(latitude, longitude) {
      // format the onecall api url
    var onecallUrl =  onecall + "/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + onecallApiKey;
       // make a get request to url
       fetch(onecallUrl)
       .then(function(response) {
         // request was successful
         if (response.ok) {
           response.json().then(function(data) {
               console.log(data);
               //get current weather data and assign variables
             var currentTemp = data.current.temp;
             var currentWind = data.current.wind_speed;
             var currentHumidity = data.current.humidity;
             var currentUVI = data.current.uvi;
             var currentWeatherIcon = data.current.weather[0].icon;
             var currentWeatherIconText = data.current.weather[0].description;

             displayCurrentWeather(currentTemp, currentWind, currentHumidity, currentUVI, currentWeatherIcon, currentWeatherIconText);
             //get forecasted weather data and assign variables
             for (var i = 1; i < 6; i++) {
                var forecastedTemp = data.daily[i].temp.day;
                var forecastedWind = data.daily[i].wind_speed;
                var forecastedHumidity = data.daily[i].humidity;
                var forecastedDate = data.daily[i].dt;
                var forcastedIcon = data.daily[i].weather[0].icon;
                var forcastedIconText = data.daily[i].weather[0].description;
                displayWeatherForecast(forecastedTemp, forecastedWind, forecastedHumidity, forecastedDate, forcastedIcon, forcastedIconText);
             }
           });
         } else {
           alert('Error: City Not Found');
         }
       })
       .catch(function(error) {
         alert('Unable to connect to server');
       });
  };

  var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var city = cityInputEl.value.trim();
  
    if (city) {
      getCityCoordinates(city);
      //call display function and pass city variable to function as an argument
    //   displayCurrentWeather(city);
    } else {
      alert('Please enter a city');
    }
  };

  var displayCurrentWeather = function(currentTemp, currentWind, currentHumidity, currentUVI, currentWeatherIcon, currentWeatherIconText) {
     //clear old display content
     currentWeatherContainerEl.innerHTML = "";

    // get value from input element
    var city = cityInputEl.value.trim();
    var cityTitleArray = city.split(" ");
    for (var i=0; i < cityTitleArray.length; i++) {
        cityTitleArray[i] = cityTitleArray[i].charAt(0).toUpperCase() + cityTitleArray[i].slice(1).toLowerCase()
    };
    var cityTitle = cityTitleArray.join(" ");
    cityTitleEl.innerHTML = cityTitle + " (" + currentDay + ")" + "<img src='https://openweathermap.org/img/w/" + currentWeatherIcon + ".png' class='current-weather-img' alt='" + currentWeatherIconText + "' />";
    currentWeatherContainerEl.appendChild(cityTitleEl);

    //clear old input from form
    cityInputEl.value = "";
  
    // create an HTML tag for temperature
    var currentTempEl = document.createElement("p");
    currentTempEl.classList = "current-weather";
    //write text content
    currentTempEl.innerHTML = "Temp: " + currentTemp + " &degF";
    //append to the current weather container
    currentWeatherContainerEl.appendChild(currentTempEl);

     // create an HTML tag for wind
     var currentWindEl = document.createElement("p");
     currentWindEl.classList = "current-weather";
     //write text content
     currentWindEl.innerHTML = "Wind: " + currentWind + " MPH";
     //append to the current weather container
     currentWeatherContainerEl.appendChild(currentWindEl);

    // create an HTML tag for humidity
    var currentHumidityEl = document.createElement("p");
    currentHumidityEl.classList = "current-weather";
    //write text content
    currentHumidityEl.innerHTML = "Humidity: " + currentHumidity + " %";
    //append to the current weather container
    currentWeatherContainerEl.appendChild(currentHumidityEl);

     // create an HTML tag for UVI
     var currentUVIEl = document.createElement("p");
     currentUVIEl.classList = "current-weather";
     //write text content
     currentUVIEl.innerHTML = "UV Index: <span class='uvi'>" + currentUVI + "</span>";
     //append to the current weather container
     currentWeatherContainerEl.appendChild(currentUVIEl);
}; 

var displayWeatherForecast = function(forecastedTemp, forecastedWind, forecastedHumidity, forecastedDate, forcastedIcon, forcastedIconText) {
    console.log(forecastedTemp);
    console.log(forecastedWind);
    console.log(forecastedHumidity);
    console.log(forecastedDate);
    console.log(forcastedIcon);
    console.log(forcastedIconText);
}

  // add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);


//   displayContainerEl.textContent = "";