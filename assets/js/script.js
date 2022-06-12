var searchHistory = [];
var geoapify = "https://api.geoapify.com";
var geoapifyApiKey = "5f6f470ded3b4d53b71e4c9a2385246a";
var onecall = "https://api.openweathermap.org";
var onecallApiKey = "0b0775930b7defc71f282858d288d0c6";

var cityInputEl = document.querySelector("#city");
var cityFormEl = document.querySelector(".city-form");
var displayContainerEl = document.querySelector(".display-container");
var cityTitleEl = document.querySelector('.city-title');

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
              //grab data from first item in features array because they are ordered from highest to lowest popularity ranking
            var latitude = data.features[0].properties.lat;
            var longitude = data.features[0].properties.lon;
            //*IMPORTANT NOTE: YOU CAN GIVE LOCAL VARIABLES TO ANOTHER FUNCTION IF WITHIN THE LOCAL FUNCTION...YOU CALL THE OTHER FUNCTION AND PASS THE VARIABLES AS AN ARGUMENT 
            // call getWeatherData 
            getWeatherData(latitude, longitude);
            // localStorage.setItem("latitude", JSON.stringify(latitude));
            // localStorage.setItem("longitude", JSON.stringify(longitude));
          });
        } else {
          alert('Error: City Not Found');
        }
      })
      .catch(function(error) {
        alert('Unable to connect to server');
      });
  };

  var getWeatherData = function(latitude, longitude) {
      // format the onecall api url
    var onecallUrl =  onecall + "/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + onecallApiKey;
       // make a get request to url
       fetch(onecallUrl)
       .then(function(response) {
         // request was successful
         if (response.ok) {
             console.log(response);
           response.json().then(function(data) {
             console.log(data);
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
  
      // clear old content
      displayContainerEl.textContent = "";
      cityInputEl.value = "";
      displayCurrentWeather(city);
    } else {
      alert('Please enter a city');
    }
  };

  var displayCurrentWeather = function(city) {
    console.log(city);
    console.log(currentDay);
    cityTitleEl.textContent = city + " (" + currentDay + ")";
  
    // // loop over repos
    // for (var i = 0; i < repos.length; i++) {
    //   // format repo name
    //   var repoName = repos[i].owner.login + '/' + repos[i].name;
  
    //   // create a container for each repo
    //   var repoEl = document.createElement("a");
    //   repoEl.classList = "list-item flex-row justify-space-between align-center";
    //   repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
  
    //   // create a span element to hold repository name
    //   var titleEl = document.createElement('span');
    //   titleEl.textContent = repoName;
  
    //   // append to container
    //   repoEl.appendChild(titleEl);
  
    //   // create a status element
    //   var statusEl = document.createElement('span');
    //   statusEl.classList = 'flex-row align-center';
  
    //   // check if current repo has issues or not
    //   if (repos[i].open_issues_count > 0) {
    //     statusEl.innerHTML =
    //       "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    //   } else {
    //     statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    //   }
  
    //   // append to container
    //   repoEl.appendChild(statusEl);
  
    //   // append container to the dom
    //   repoContainerEl.appendChild(repoEl);
    // }
}; 

  // add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);


