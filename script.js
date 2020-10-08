//This checks local storage if the user has a default city. The last searched city is the default 
let defaultCity = localStorage.getItem("default");
console.log(defaultCity);
//This boolean helps us control the default city printing function
let defaultPrint = false;
//On window load, if the default city hasn't been printed yet, it populates the page content with the local storage input
window.onload = function() {
    if (!defaultPrint) {
        printWeather(defaultCity);
        defaultPrint = true;
    }
}

//#citySearch is the button which calls the weather api
$("#citySearch").on("click", function() {
    //#cityText is the input field next to the search button
    let input = $("#cityText").val();
    console.log(input);
    //We then send the input field text the user submitted to the API
    printWeather(input);
});

//This call back function is used for buttons in the search history
$(document).on("click", "#historyBtn", function() {
    //Since the button's text is determined by the API city value, we can use the button attribute as the input without any concern for failure to retrieve data
    let input = $(this).text();
    //We send the button text to the printWeather function for the API call
    printWeather(input);
});

function prependBtn(input) {
    //Here we are defining a new button value to be included into the serach history
    let newBtn = $("<button/>", {
        //We are giving it the object value directly from the API JSON.
        text: input,
        //This ID enables the callback function above to enable it to populate the screen on click
        id: "historyBtn",
        //This class makes it look nice. Thanks Bootstrap!
        class: "my-1 btn btn-info"
    });
    //This prepends it below the Search History nav text and above the last searched button
    $("#searchedLocs").prepend(newBtn);
}

//This function is how we populate the page, using an input from either of the button click functions.
function printWeather(input) {
    console.log(input);
    //This is our URL for populating the top area of the page
    let weatherObj = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=537cd7ed53d185cdc11391970f874bc7";

    //This ajax function gets the object variable specific to our URL
    $.ajax({
        url: weatherObj,
        method: "GET"
    }).then(function(toDay) {
        console.log(toDay);

        //Here we are populating..
        //The city name
        $("#cityName").text(toDay.name);
        //The day's temperature, rounded
        $("#tempToday").text("Temperature: " + Math.round(toDay.main.temp) + "° F");
        //The humidity for the day
        $("#humidToday").text("Humidity: " + toDay.main.humidity + "%");
        //And the rounded wind speed
        $("#windToday").text("Wind Speed: " + Math.round(toDay.wind.speed) + " mi/h");

        //Now that we've verified this is a place by receiving data, we can prepend it as searched location button in case the user wants to access it later
        prependBtn(toDay.name);
        //We are establishing this as the last searched city. If there was a previous search during their visit we wipe it first
        localStorage.removeItem("default")
        //Then set this as the default
        localStorage.setItem("default", toDay.name);

        //For the 5 day forecast we use a separate API call. We use the previous call's coordinates to define this URL
        let forecastOBJ = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/onecall?lat=" + toDay.coord.lat + "&lon=" + toDay.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=537cd7ed53d185cdc11391970f874bc7";
        //This is the the ajax function to retrieve the JSON for this API
        $.ajax({
            url: forecastOBJ,
            method: "GET"
        }).then(function(foreCast) {
            console.log(foreCast);
            //In order to get accurate date information, we can use the Javascript native day and date functionalites. Here we set the variable "now" as a date.
            let now = new Date();

            //Before we fill out the cards, under the <section> tag, there are some final details we need to resolve in the <main>
            //The icon for today can be retrieved, setting the src attribute to equal a custom png id
            $("#iconToday").attr("src", "http://openweathermap.org/img/wn/" + foreCast.current.weather[0].icon + "@2x.png")
            //The UVI data is also accessible in this API. Here we are rounding it for user-clarity.
            $("#uvToday").text(Math.round(foreCast.daily[0].uvi));
            //Per the requests of the assignment, we've assigned a highlight style attribute to the text span according the numeric value of the UV levels.
            let rayChecker = Math.round(foreCast.daily[0].uvi);
            if (rayChecker < 4) {
                $("#uvToday").attr("style", "background-color: green")
            } else if (rayChecker > 3 && rayChecker < 7) {
                $("#uvToday").attr("style", "background-color: yellow")
            } else if (rayChecker > 6 && rayChecker < 10) {
                $("#uvToday").attr("style", "background-color: orange")
            } else if (rayChecker > 9) {
                $("#uvToday").attr("style", "background-color: red")
            }
            // Here we are adding on the previously established date to the end of the title. 
            $("#cityName").text($("#cityName").text() + " (" + now.getMonth() + "/" + now.getDate() + "/" + now.getUTCFullYear() + ")")
            // For each card on the list, this loop sets all of the data necessary according to the API call
            for (i = 1; i < 6; i++) {
                //For the date, we simply add the index value to the date value to showcase the increment
                $("#date" + i).text(now.getMonth() + "/" + (parseInt(now.getDate()) + i) + "/" + now.getUTCFullYear());
                //The temperature
                $("#temp" + i).text("Temp: " + Math.round(foreCast.daily[i].temp.day) + "° F");
                //The humidty
                $("#hum" + i).text("Humidity: " + Math.round(foreCast.daily[i].humidity) + "%");
                //The icon link
                let iconLink = "http://openweathermap.org/img/wn/" + foreCast.daily[i].weather[0].icon + ".png";
                $("#icon" + i).attr("src", iconLink);
            }
        })
    });
}
