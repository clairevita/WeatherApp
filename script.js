let tempToday = $("#tempToday").val();

$("#citySearch").on("click", function(){

let citySelect = $("#cityText").val();
let weatherObj = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/weather?q=" + citySelect + "&units=imperial&appid=537cd7ed53d185cdc11391970f874bc7";
// prependBtn();

// function prependBtn(){
//     console.log(citySelect);
//     let newBtn = $("<button/>",
//     {
//         text: citySelect,
//         id: "historyBtn"
//      });
     

//      $("#searchedLocs").append(newBtn);




// }

$.ajax({
    url: weatherObj,
    method: "GET"
}).then(function(toDay){
    
 console.log(toDay);
 $("#cityName").text(toDay.name)
 $("#tempToday").text("Temperature: " + Math.round(toDay.main.temp) + "° F"); 
 $("#humidToday").text("Humidity: " + toDay.main.humidity + "%");
 $("#windToday").text("Wind Speed: " + Math.round(toDay.wind.speed) + " mi/h");
 
 
 let forecastOBJ = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/onecall?lat=" + toDay.coord.lat + "&lon=" + toDay.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=537cd7ed53d185cdc11391970f874bc7";

 $.ajax({
     url: forecastOBJ,
     method: "GET"
 }).then(function(foreCast){
    loading = false;
    console.log(foreCast);
    let now = new Date();

    $("#iconToday").attr("src", "http://openweathermap.org/img/wn/" + foreCast.current.weather[0].icon + "@2x.png")
    $("#uvToday").text("UV Index: " + Math.round(foreCast.daily[0].uvi));
    $("#cityName").text($("#cityName").text() + " (" + now.getMonth() + "/" + now.getDate() + "/" + now.getUTCFullYear() + ")") 
    for (i=1; i<6;i++){
        $("#date"+i).text(now.getMonth() + "/" + (parseInt(now.getDate())+i) + "/" + now.getUTCFullYear()); 
        $("#temp"+i).text("Temp: " + Math.round(foreCast.daily[i].temp.day) + "° F");
        $("#hum"+i).text("Humidity: " + Math.round(foreCast.daily[i].humidity) + "%");
        let iconLink = "http://openweathermap.org/img/wn/" + foreCast.daily[i].weather[0].icon + ".png";
        $("#icon"+i).attr("src", iconLink);
    }
 })


});

});




