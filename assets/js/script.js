var searchButton = $(".btn-main");
var featuredButton = $(".featured-city-btn");
var userValue = "";

var fetchCurrentWeather = function (userValue) {
  let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userValue + ",us&appid=eeb8257b7635102394d6d47739f9033b";
  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (currentWeather) {
      localStorage.setItem("currentWeather", JSON.stringify(currentWeather));
      console.log(currentWeather)
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
      console.log(weeklyData)
      $(".search-input").val("");
      
      for (let i = 3; i < weeklyData.list.length; i = i + 8){
      }
    });
};
// passing in the variable doesn't work here
searchButton.on("click", function (event) {
  event.preventDefault();
  userValue = $(".search-input").val();
  userValue = userValue.toLowerCase();
  userValue = userValue.replace(" ", "+");
  localStorage.setItem("city", userValue);
  console.log(userValue, "hello");
  fetchCurrentWeather(userValue);
  fetch5dayWeather(userValue);
});
// passing in the variable works here
featuredButton.on("click", function(){
    userValue = $(this).val();
    console.log(userValue);
    fetchCurrentWeather(userValue);
    fetch5dayWeather(userValue);
})