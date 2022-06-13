// var searchHistory = [];
var geoapify = "https://api.geoapify.com";
var geoapifyApiKey = "5f6f470ded3b4d53b71e4c9a2385246a";
var onecall = "https://api.openweathermap.org";
var onecallApiKey = "0b0775930b7defc71f282858d288d0c6";

var cityInputEl = document.querySelector("#city");
var cityFormEl = document.querySelector(".city-form");
var displayContainerEl = document.querySelector(".display-container");
var cityTitleEl = document.querySelector('.city-title');
var currentWeatherContainerEl = document.querySelector(".current-weather-container");
var forecastedWeatherContainerEl = document.querySelector(".forecasted-weather-container");
var fiveDayForecastContainerEl = document.querySelector(".five-day-forecast");
var searchHistoryContainerEl = document.querySelector(".search-history-container");
var searchedCityButtonEl = document.querySelector(".searched-city-btn");

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
             displayFiveDayForecastHeading();
            //  displaySearchHistory();
             //get forecasted weather data and assign variables
             for (var i = 1; i < 6; i++) {
                var forecastedTemp = data.daily[i].temp.day;
                var forecastedWind = data.daily[i].wind_speed;
                var forecastedHumidity = data.daily[i].humidity;
                var forecastedUnixDate = data.daily[i].dt;
                //convert Unix to a date through moment.js
                var forecastedDate = moment(forecastedUnixDate * 1000).format("L");
                var forecastedIcon = data.daily[i].weather[0].icon;
                var forecastedIconText = data.daily[i].weather[0].description;
                displayWeatherForecast(forecastedTemp, forecastedWind, forecastedHumidity, forecastedDate, forecastedIcon, forecastedIconText);
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
    currentWeatherContainerEl.classList = "current-weather-container";
     //clear old display content
     currentWeatherContainerEl.innerHTML = "";

    // get value from input element
    var city = cityInputEl.value.trim();
    var cityTitleArray = city.split(" ");
    for (var i=0; i < cityTitleArray.length; i++) {
        cityTitleArray[i] = cityTitleArray[i].charAt(0).toUpperCase() + cityTitleArray[i].slice(1).toLowerCase()
    };
    var cityTitle = cityTitleArray.join(" ");
    cityTitleEl.innerHTML = "<h2>" + cityTitle + " (" + currentDay + ")" + "<img src='https://openweathermap.org/img/w/" + currentWeatherIcon + ".png' class='current-weather-img' alt='" + currentWeatherIconText + "' /></h2>";
    currentWeatherContainerEl.appendChild(cityTitleEl);
    
    //load searchedCities (an array) from localStorage and turn strings back to objects
    var searchedCities = JSON.parse(localStorage.getItem("searched-cities")) || [];

    //add the individal cityTitle item to the array of searched cities
    searchedCities.push(cityTitle);
    //add updated array to local storage
    localStorage.setItem("searched-cities", JSON.stringify(searchedCities));

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
     currentUVIEl.innerHTML = "UV Index: ";

    // create a span element to hold UVI value
    var currentUVIValueEl = document.createElement("span");
    currentUVIValueEl.innerHTML = currentUVI;

    // append to container
    currentUVIEl.appendChild(currentUVIValueEl);
     //colour-code UVI
     if (currentUVI < 3) {
        currentUVIValueEl.classList = "favorable";
     } else if (3 <= currentUVI < 8) {
         currentUVIValueEl.classList = "moderate";
     } else if (currentUVI >= 8) {
         currentUVIValueEl.classList = "severe";
     }
     //append to the current weather container
     currentWeatherContainerEl.appendChild(currentUVIEl);
}; 

var displayFiveDayForecastHeading = function() {
    //clear old display content
    fiveDayForecastContainerEl.innerHTML = "";

    //clear old display content
    forecastedWeatherContainerEl.innerHTML = "";

    //create heading above cards
    var fiveDayForecastEl = document.createElement("h3");
    fiveDayForecastEl.innerHTML = "5-Day Forecast:";
    fiveDayForecastContainerEl.append(fiveDayForecastEl);
}

var displayWeatherForecast = function(forecastedTemp, forecastedWind, forecastedHumidity, forecastedDate, forecastedIcon, forecastedIconText) {

    //dynamically create card element to hold daily forecast content
    var forecastCardEl = document.createElement("div");
    forecastCardEl.classList = "card";

    //create an HTML tag for forecasted date
    var forecastedDateEl = document.createElement("h4");
    forecastedDateEl.classList = "forecasted-weather";
    forecastedDateEl.innerHTML = forecastedDate;
    //append to card
    forecastCardEl.appendChild(forecastedDateEl);

    //create an HTML tag for icon image
    var forecastedIconContainerEl = document.createElement("div");
    forecastedIconContainerEl.classList = "forecasted-weather";
    forecastedIconContainerEl.innerHTML = "<img src='https://openweathermap.org/img/w/" + forecastedIcon + ".png' class='forecasted-weather-img' alt='" + forecastedIconText + "' />";
    //append to card
    forecastCardEl.appendChild(forecastedIconContainerEl);

    //create an HTML tag for forecasted temp
    var forecastedTempEl = document.createElement("p");
    forecastedTempEl.classList = "forecasted-weather";
    forecastedTempEl.innerHTML = "Temp: " + forecastedTemp + " &degF";
    //append to card
    forecastCardEl.appendChild(forecastedTempEl);

    //create an HTML tag for forecasted wind
    var forecastedWindEl = document.createElement("p");
    forecastedWindEl.classList = "forecasted-weather";
    forecastedWindEl.innerHTML = "Wind: " + forecastedWind + " MPH";
    //append to card
    forecastCardEl.appendChild(forecastedWindEl);

    //create an HTML tag for forecasted humidity
    var forecastedHumidityEl = document.createElement("p");
    forecastedHumidityEl.classList = "forecasted-weather";
    forecastedHumidityEl.innerHTML = "Humidity: " + forecastedHumidity + "%";
    //append to card
    forecastCardEl.appendChild(forecastedHumidityEl);

    //append cards to container
    forecastedWeatherContainerEl.append(forecastCardEl);
}

var displaySearchHistory = function() {

    if (localStorage.length > 0) {
        //grab stored array of searched cities from localStorage
        var searchedCities = JSON.parse(localStorage.getItem("searched-cities"));
        console.log(searchedCities);
        //to sort from most-least recent searched
        var recentSearchedCities = searchedCities.reverse();
        //to remove any duplicates for final display version
        var filteredSearchedCities = [...new Set(recentSearchedCities)];

        //clear old display content
        searchHistoryContainerEl.innerHTML = "";

        //loop through searchedCities array to display array but...
        for (i=0; i < filteredSearchedCities.length; i++) {
            //...stop at index 9 to keep only the most recent 10 showing
            if (i>=10) {
                break;
            }
            searchHistoryContainerEl.innerHTML += "<button class='btn searched-city-btn'>" + filteredSearchedCities[i] + "</button>"
        };
    };
};

displaySearchHistory();

searchedCityButtonEl.addEventListener("click", getCityCoordinates(target.textContent))

  // add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);

