let defaultCity = localStorage.getItem("default");
console.log(defaultCity);
let defaultPrint = false
window.onload = function(){
    if (!defaultPrint){
        printWeather(defaultCity);
        defaultPrint = true;
    }
}


$("#citySearch").on("click", function(){
    let input = $("#cityText").val();
    console.log(input);
    printWeather(input);
});
$(document).on("click", "#historyBtn", function(){
    
    let input = $(this).text();

    printWeather(input);
});

function prependBtn(input){
    
    let newBtn = $("<button/>",
    {
        text: input,
        id: "historyBtn",
        class: "my-1 btn btn-info"
     });
     
     $("#searchedLocs").prepend(newBtn);
}

function printWeather(input){
console.log(input);
let weatherObj = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=537cd7ed53d185cdc11391970f874bc7";

$.ajax({
    url: weatherObj,
    method: "GET"
}).then(function(toDay){
 console.log(toDay);

 $("#cityName").text(toDay.name)
 $("#tempToday").text("Temperature: " + Math.round(toDay.main.temp) + "° F"); 
 $("#humidToday").text("Humidity: " + toDay.main.humidity + "%");
 $("#windToday").text("Wind Speed: " + Math.round(toDay.wind.speed) + " mi/h");
 
 //Now that we've verified this is a place, we can prepend it as searched location button
 prependBtn(toDay.name);
 localStorage.removeItem("default")
 localStorage.setItem("default", toDay.name);

 let forecastOBJ = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/onecall?lat=" + toDay.coord.lat + "&lon=" + toDay.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=537cd7ed53d185cdc11391970f874bc7";

 $.ajax({
     url: forecastOBJ,
     method: "GET"
 }).then(function(foreCast){
    console.log(foreCast);
    let now = new Date();

    $("#iconToday").attr("src", "http://openweathermap.org/img/wn/" + foreCast.current.weather[0].icon + "@2x.png")
    $("#uvToday").text(Math.round(foreCast.daily[0].uvi));
    let rayChecker = Math.round(foreCast.daily[0].uvi);
    if (rayChecker<4){
        $("#uvToday").attr("style", "background-color: green")
    } else if ( rayChecker > 3 && rayChecker < 7){
        $("#uvToday").attr("style", "background-color: yellow")
    } else if (rayChecker > 6 && rayChecker < 10){
        $("#uvToday").attr("style", "background-color: orange")
    } else if (rayChecker > 9){
        $("#uvToday").attr("style", "background-color: red")
    }

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

}




