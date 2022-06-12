var getCityCoordinates = function(city) {
    // format the geoapify api url
    var geoapifyUrl = "https://api.geoapify.com/v1/geocode/search?city=" + city + "&apiKey=5f6f470ded3b4d53b71e4c9a2385246a";
  
    // make a get request to url
    fetch(geoapifyUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            var latitude = data.features[0].properties.lat;
            var longitude = data.features[0].properties.lon;
            console.log(latitude);
            console.log(longitude);
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

  var getWeatherData = function(latitude, longitude) {
    var onecallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid={API key}"
  }
