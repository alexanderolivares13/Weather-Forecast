var searchButton = $(".btn-main");
var featuredButton = $(".featured-city-btn");
var userValue = "";

var fetchCurrentWeather = function (userValue) {
  let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userValue + ",us&units=imperial&appid=eeb8257b7635102394d6d47739f9033b";
  fetch(apiURL)
    .then(function (response) {
      if (response.status === 200){
        fetch5dayWeather(userValue);
      }
      return response.json();
    })
    .then(function (currentWeather) {
      localStorage.setItem("currentWeather", JSON.stringify(currentWeather));
    })
} 

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
      location.reload();
    });
};

var writeForecast = function () {
let currentWeather = JSON.parse(localStorage.getItem("currentWeather"))
let weeklyWeather = JSON.parse(localStorage.getItem("weeklyWeather"))
let n = 0;
for (let i = 3; i < weeklyWeather.list.length; i = i + 8){
  n++;
  let dateCreate = document.createElement("h5");
  dateCreate.setAttribute("class", "card-title forecast-title date")
  dateCreate.textContent = weeklyWeather.list[i].dt_txt.split(" ")[0]
  let tempCreate = document.createElement("h6");
  tempCreate.setAttribute("class", "forecast-title")
  tempCreate.textContent = "Temp: " + weeklyWeather.list[i].main.temp + "°F";
  let windCreate = document.createElement("h6");
  windCreate.setAttribute("class", "forecast-title")
  windCreate.textContent = "Wind: " + weeklyWeather.list[i].wind.speed + " mph";
  let humidityCreate = document.createElement("h6");
  humidityCreate.setAttribute("class", "forecast-title")
  humidityCreate.textContent = "Humidity: " + weeklyWeather.list[i].main.humidity + "%";
  $("#Day-" + n).append(dateCreate, tempCreate, windCreate, humidityCreate);
}
}


searchButton.on("click", function (event) {
  event.preventDefault();
  userValue = $(".search-input").val();
  userValue = userValue.toLowerCase();
  userValue = userValue.replace(" ", "+");
  fetchCurrentWeather(userValue);
});
featuredButton.on("click", function(){
    userValue = $(this).val();
    console.log(userValue);
    fetchCurrentWeather(userValue);
})

if(localStorage.getItem("weeklyWeather")){
  writeForecast();
} else if (!localStorage.getItem("weeklyWeather")) {
  userValue = "los+angeles"
  fetchCurrentWeather(userValue);
}
console.log(JSON.parse(localStorage.getItem("currentWeather")));