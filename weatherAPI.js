const APIKey = "&appid=75b2fbaa50f250eede1bc522d3103ae4";

const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

const citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

const timeDay = moment();

$(document).ready(function() {
  let city = citiesArray[citiesArray.length - 1];
  fiveDay(city);
  citySearch(city);
});

function citySearch(city) {
  $(".city").empty();
  $(".temp").empty();
  $(".humidity").empty();
  $(".wind").empty();
  $(".uvIndex").empty();

  let citySearch = queryURL + city + APIKey;
  console.log(citySearch);

  $.ajax({
    url: citySearch,
    method: "GET",
  }).then(function(response) {
    let cityInfo = response.name;
    console.log(cityInfo);

    let dateInfo = response.dt;
    console.log(dateInfo);
    let currentDate = moment.unix(dateInfo).formomentat("L");
    console.log("current date" + currentDate);

    let iconDummy = "https://openweathermap.org/img/wn/";
    let iconPng = "@2x.png";
    let iconWeather = response.weather[0].icon;
    let iconUrl = iconDummy + iconWeather + iconPng;
    console.log(iconUrl);
    let iconImg = $("<img>");
    iconImg.attr("src", iconUrl);
    $(".city").append(cityInfo + " ");
    $(".city").append(currentDate + " ");
    $(".city").append(iconImg);

    console.log(response.main.temp);
    let K = response.main.temp;
    console.log(K);
    let F = ((K - 273.15) * 1.8 + 32).toFixed(0);
    console.log(F);
    $(".temp").append("Temperature: " + F + " °F");

    let humidityInfo = response.main.humidity;
    $(".humidity").append("Humidity: " + humidityInfo + "%");

    console.log(response.wind.speed);
    let oldSpeed = response.wind.speed;
    console.log(oldSpeed);
    let newSpeed = (oldSpeed * 2.2369).toFixed(2);
    $(".wind").append("Wind Speed: " + newSpeed + " MPH");

    let lon = response.coord.lon;
    let lat = response.coord.lat;

    uvIndex(lon, lat);
  });
}

function uvIndex(lon, lat) {
  // SEARCHES
  let indexURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=75b2fbaa50f250eede1bc522d3103ae4&lat=";
  let middle = "&lon=";
  let indexSearch = indexURL + lat + middle + lon;
  console.log(indexSearch);

  $.ajax({
    url: indexSearch,
    method: "GET",
  }).then(function(response) {
    let uvFinal = response.value;

    $(".uvIndex").append("UV Index: ");
    let uvBtn = $("<button>").text(uvFinal);
    $(".uvIndex").append(uvBtn);

    if (uvFinal < 3) {
      uvBtn.attr("class", "uvGreen");
    } else if (uvFinal < 6) {
      uvBtn.attr("class", "uvYellow");
    } else if (uvFinal < 8) {
      uvBtn.attr("class", "uvOrange");
    } else if (uvFinal < 11) {
      uvBtn.attr("class", "uvRed");
    } else {
      uvBtn.attr("class", "uvPurple");
    }
  });
}

function renderButtons() {
  $(".list-group").empty();

  for (let i = 0; i < citiesArray.length; i++) {
    let a = $("<li>");

    a.addClass("cityName");
    a.addClass("list-group-item");

    a.attr("data-name", citiesArray[i]);

    a.text(citiesArray[i]);

    $(".list-group").append(a);
  }

  $(".cityName").on("click", function(event) {
    event.preventDefault();

    let city = $(this).data("name");
    console.log("prev searched city" + city);

    fiveDay(city);

    citySearch(city);
  });
}

function fiveDay(city) {
  let fiveFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
  let fiveURL = fiveFront + city + APIKey;
  console.log(fiveURL);

  $(".card-text").empty();
  $(".card-title").empty();

  $.ajax({
    url: fiveURL,
    method: "GET",
  }).then(function(response) {
    let dateOne = moment
      .unix(response.list[1].dt)
      .utc()
      .format("dddd, L");
    $(".dateOne").append(dateOne);
    let dateTwo = moment
      .unix(response.list[9].dt)
      .utc()
      .format("dddd, L");
    $(".dateTwo").append(dateTwo);
    let dateThree = moment
      .unix(response.list[17].dt)
      .utc()
      .format("dddd, L");
    $(".dateThree").append(dateThree);
    let dateFour = moment
      .unix(response.list[25].dt)
      .utc()
      .format("dddd, L");
    $(".dateFour").append(dateFour);
    let dateFive = moment
      .unix(response.list[33].dt)
      .utc()
      .format("dddd, L");
    $(".dateFive").append(dateFive);

    let iconOne = $("<img>");
    let iconOneSrc =
      "https://openweathermap.org/img/wn/" +
      response.list[4].weather[0].icon +
      "@2x.png";
    console.log("card Icon line 280" + iconOneSrc);
    iconOne.attr("src", iconOneSrc);
    $(".iconOne").append(iconOne);

    let iconTwo = $("<img>");
    let iconTwoSrc =
      "https://openweathermap.org/img/wn/" +
      response.list[12].weather[0].icon +
      "@2x.png";
    iconTwo.attr("src", iconTwoSrc);
    $(".iconTwo").append(iconTwo);

    let iconThree = $("<img>");
    let iconThreeSrc =
      "https://openweathermap.org/img/wn/" +
      response.list[20].weather[0].icon +
      "@2x.png";
    iconThree.attr("src", iconThreeSrc);
    $(".iconThree").append(iconThree);

    let iconFour = $("<img>");
    let iconFourSrc =
      "https://openweathermap.org/img/wn/" +
      response.list[28].weather[0].icon +
      "@2x.png";
    iconFour.attr("src", iconFourSrc);
    $(".iconFour").append(iconFour);

    let iconFive = $("<img>");
    let iconFiveSrc =
      "https://openweathermap.org/img/wn/" +
      response.list[36].weather[0].icon +
      "@2x.png";
    iconFive.attr("src", iconFiveSrc);
    $(".iconFive").append(iconFive);

    $(".tempOne").append("Temperature: ");
    $(".tempOne").append(
      tempAvg(
        response.list[2].main.temp,
        response.list[4].main.temp,
        response.list[6].main.temp
      )
    );
    $(".tempOne").append(" °F");

    $(".tempTwo").append("Temperature: ");
    $(".tempTwo").append(
      tempAvg(
        response.list[10].main.temp,
        response.list[12].main.temp,
        response.list[14].main.temp
      )
    );
    $(".tempTwo").append(" °F");

    $(".tempThree").append("Temperature: ");
    $(".tempThree").append(
      tempAvg(
        response.list[18].main.temp,
        response.list[20].main.temp,
        response.list[22].main.temp
      )
    );
    $(".tempThree").append(" °F");

    $(".tempFour").append("Temperature: ");
    $(".tempFour").append(
      tempAvg(
        response.list[26].main.temp,
        response.list[28].main.temp,
        response.list[30].main.temp
      )
    );
    $(".tempFour").append(" °F");

    $(".tempFive").append("Temperature: ");
    $(".tempFive").append(
      tempAvg(
        response.list[34].main.temp,
        response.list[36].main.temp,
        response.list[38].main.temp
      )
    );
    $(".tempFive").append(" °F");

    $(".humidityOne").append("Humidity: ");
    $(".humidityOne").append(
      humidityAvg(
        response.list[2].main.humidity,
        response.list[4].main.humidity,
        response.list[6].main.humidity
      )
    );
    $(".humidityOne").append("%");

    $(".humidityTwo").append("Humidity: ");
    $(".humidityTwo").append(
      humidityAvg(
        response.list[10].main.humidity,
        response.list[12].main.humidity,
        response.list[14].main.humidity
      )
    );
    $(".humidityTwo").append("%");

    $(".humidityThree").append("Humidity: ");
    $(".humidityThree").append(
      humidityAvg(
        response.list[18].main.humidity,
        response.list[20].main.humidity,
        response.list[22].main.humidity
      )
    );
    $(".humidityThree").append("%");

    $(".humidityFour").append("Humidity: ");
    $(".humidityFour").append(
      humidityAvg(
        response.list[26].main.humidity,
        response.list[28].main.humidity,
        response.list[30].main.humidity
      )
    );
    $(".humidityFour").append("%");

    $(".humidityFive").append("Humidity: ");
    $(".humidityFive").append(
      humidityAvg(
        response.list[34].main.humidity,
        response.list[36].main.humidity,
        response.list[38].main.humidity
      )
    );
    $(".humidityFive").append("%");
  });
}

function tempAvg(x, y, z) {
  let avgThree = (x + y + z) / 3.0;
  let avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
  return avgReturn;
}

function humidityAvg(x, y, z) {
  let avgHum = (x + y + z) / 3.0;
  return avgHum.toFixed(0);
}

$("#add-city").on("click", function(event) {
  event.preventDefault();

  let city = $("#city-input")
    .val()
    .trim();

  let containsCity = false;

  if (citiesArray != null) {
    $(citiesArray).each(function(x) {
      if (citiesArray[x] === city) {
        containsCity = true;
      }
    });
  }

  if (containsCity === false) {
    citiesArray.push(city);
  }

  localStorage.setItem("cities", JSON.stringify(citiesArray));

  fiveDay(city);

  citySearch(city);

  renderButtons();
});

renderButtons();
