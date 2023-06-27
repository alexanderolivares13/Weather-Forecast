var searchButton = $(".btn-main");
var featuredButton = $(".featured-card-body");
var userValue = "";

var fetchCurrentWeather = function (userValue) {
  let apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userValue +
    ",us&units=imperial&appid=eeb8257b7635102394d6d47739f9033b";
  fetch(apiURL)
  // the function checks to make sure that the response is good, if it isn't it alerts the user to search for a correct City name
    .then(function (response) {
      if (response.status === 200) {
        fetch5dayWeather(userValue);
        localStorage.setItem("city", userValue);
      } else if (response.status !== 200) {
        alert("Please enter a valid City");
        return;
      }
      return response.json();
    })
    .then(function (currentWeather) {
      localStorage.setItem("currentWeather", JSON.stringify(currentWeather));
    });
};
// the 5 day forecast function will only run if the response from the first fetch function is good.
var fetch5dayWeather = function (userValue) {
  let apiURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userValue +
    ",us&units=imperial&appid=eeb8257b7635102394d6d47739f9033b";
  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (weeklyData) {
      localStorage.setItem("weeklyWeather", JSON.stringify(weeklyData));
      writeForecast();
      generateButton();
      $(".search-input").val("");
    });
};
// this function handles the creation of all elements displayed for the forecast. all of information in the 5 day forecast and current day forecast is dynamically generated.
const writeForecast = function () {
  now = dayjs().format("YYYY-MM-DD");
  let currentWeather = JSON.parse(localStorage.getItem("currentWeather"));
  let weeklyWeather = JSON.parse(localStorage.getItem("weeklyWeather"));
  // this variable is used to point to the 5 different cards used for the 5 day forecast, the integer is incremented by 1 to loop through all 5 cards
  let n = 0;
  //the following blocks of code in the for loop is used to write the 5 day forecast to the DOM. the variables are named to match the information that is being grabbed from the forecast data
  for (let i = 3; i < weeklyWeather.list.length; i = i + 8) {
    n++;
    
    let dateCreate = document.createElement("h5");
    dateCreate.setAttribute("class", "card-title forecast-title date");
    dateCreate.textContent = weeklyWeather.list[i].dt_txt.split(" ")[0];
    
    let iconCode = weeklyWeather.list[i].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
    let icon = document.createElement("img");
    icon.setAttribute("src", iconUrl);
   
    let descriptionCreate = document.createElement("h6");
    descriptionCreate.setAttribute("class", "forecast-title");
    descriptionCreate.textContent =
      weeklyWeather.list[i].weather[0].description;
   
    let tempCreate = document.createElement("h6");
    tempCreate.setAttribute("class", "forecast-title");
    tempCreate.textContent = "Temp: " + weeklyWeather.list[i].main.temp + " °F";
   
    let windCreate = document.createElement("h6");
    windCreate.setAttribute("class", "forecast-title");
    windCreate.textContent =
      "Wind: " + weeklyWeather.list[i].wind.speed + " mph";
    
    let humidityCreate = document.createElement("h6");
    humidityCreate.setAttribute("class", "forecast-title");
    humidityCreate.textContent =
      "Humidity: " + weeklyWeather.list[i].main.humidity + "%";
    // empty() is used to clear out the card and replace it with any new forecast data. the function will loop to clear out all 5 day cards
    $("#Day-" + n).empty();
    $("#Day-" + n).append(
      dateCreate,
      icon,
      descriptionCreate,
      tempCreate,
      windCreate,
      humidityCreate
    );
  }
  // out of the for loop, the remaining blocks of code are used to write the info for the current day forecast to the DOM. the variables are named to match the information that is being grabbed from the current day forecast data
  let currentCity = document.createElement("h5");
  currentCity.setAttribute("class", "card-title current-date");
  currentCity.textContent = currentWeather.name + " (" + now + ")";
  
  let iconCode = currentWeather.weather[0].icon;
  let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
  let icon = document.createElement("img");
  icon.setAttribute("src", iconUrl);
  
  let descriptionCreate = document.createElement("h6");
  descriptionCreate.textContent = currentWeather.weather[0].description;
  
  let tempCreate = document.createElement("h6");
  tempCreate.textContent = "Temp: " + currentWeather.main.temp + " °F";
  
  let windCreate = document.createElement("h6");
  windCreate.textContent = "Wind: " + currentWeather.wind.speed + " mph";
  
  let humidityCreate = document.createElement("h6");
  humidityCreate.textContent =
    "Humidity: " + currentWeather.main.humidity + "%";
  // empty() is used to clear out the card and replace it with any new weather data
  $(".city-container").empty();
  $(".city-container").append(
    currentCity,
    icon,
    descriptionCreate,
    tempCreate,
    windCreate,
    humidityCreate
  );
};
// this function grabs the city name that is saved to the local storage and creates a history of searched cities on the webpage, the city buttons are clickable and will run the function for the provided city name. the buttons are prepended to the parent div so that the most recent search is at the top.
const generateButton = function () {
  userValue = localStorage.getItem("city");
  buttonCreate = document.createElement("button");
  buttonCreate.setAttribute("class", "featured-city-btn");
  buttonCreate.setAttribute("value", userValue);
  buttonCreate.textContent = userValue.replace("+", " ");
  $(".featured-card-body").prepend(buttonCreate);
};
// the event listener for the search bar is set grab the value entered by the user and if the search bar is left blank then the function is killed. if the search bar is not blank then it proceeds to run the functions and try to getch the forecast data.
searchButton.on("click", function (event) {
  event.preventDefault();
  userValue = $(".search-input").val();
  if (userValue === ""){
    alert("Please enter a valid City");
    return;
  } else {
  userValue = userValue.toLowerCase();
  userValue = userValue.replace(" ", "+");
  fetchCurrentWeather(userValue);
}
});
// this button uses an event delegator to some bugs that were encountered, the event is being delegated to the parent container of the buttons in the search history, but is set to only listen to clicks on the buttons
featuredButton.on("click", ".featured-city-btn" ,function (event) {
  userValue = $(event.target).val();
  localStorage.setItem("city", userValue);
  fetchCurrentWeather(userValue);
  if (userValue !== "") {$(event.target).remove();}
});

// on page load it checks to see if there is any local storage for forecast data, if not then it sets a default city to help prevent having an empty webpage

if (localStorage.getItem("weeklyWeather")) {
  writeForecast();
} else if (!localStorage.getItem("weeklyWeather")) {
  userValue = "los+angeles";
  fetchCurrentWeather(userValue);
}

// on page load it checks to see if there is any local storage for the city name, if not then it sets a default city to help prevent having an empty webpage
if (localStorage.getItem("city")) {
  generateButton();
} else if (!localStorage.getItem("city")) {
  userValue = "los+angeles";
  localStorage.setItem("city", userValue);
}
