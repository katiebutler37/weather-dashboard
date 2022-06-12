var searchHistory = [];
var geoapify = "https://api.geoapify.com";
var geoapifyApiKey = "5f6f470ded3b4d53b71e4c9a2385246a";
var onecall = "https://api.openweathermap.org";
var onecallApiKey = "0b0775930b7defc71f282858d288d0c6";

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
            console.log(latitude);
            console.log(longitude);
            localStorage.setItem("latitude", JSON.stringify(latitude));
            localStorage.setItem("longitude", JSON.stringify(longitude));
          });
        } else {
          alert('Error: City Not Found');
        }
      })
      .catch(function(error) {
        alert('Unable to connect to server');
      });
  };
  getCityCoordinates("Toronto");

var savedlLatitude = localStorage.getItem("latitude").trim();
var savedLongitude = localStorage.getItem("longitude").trim();

  var getWeatherData = function(savedLatitude, savedLongitude) {
      // format the onecall api url
    var onecallUrl =  onecall + "/data/2.5/onecall?lat=" + savedLatitude + "&lon=" + savedLongitude + "&appid=" + onecallApiKey;
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
  getWeatherData(savedlLatitude, savedLongitude);

