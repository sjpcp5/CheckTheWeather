
// This is our API key.
const APIKey = "&appid=75b2fbaa50f250eede1bc522d3103ae4";

// Here we are building the URL we need to query the database
const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

// array to add cities to, to be grabbed from after search
const citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();


// on loading


$(document).ready(function() {
	let city = citiesArray[citiesArray.length - 1];
	fiveDay(city);
	citySearch(city);
});

function citySearch(city) {
	// clear out previous city data
	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvIndex").empty();

	let citySearch = queryURL + city + APIKey;
	console.log(citySearch);

	// ajax for searching for new city to display
	$.ajax({
		url: citySearch,
		method: "GET"
	}).then(function(response) {
		// * Display the following under current weather conditions:

		//  line one
		//   * City
		let cityInfo = response.name;
		console.log(cityInfo);
		//   * Date
		let dateInfo = response.dt;
		console.log(dateInfo);
		let currentDate = moment.unix(dateInfo).format("L");
		console.log("current date" + currentDate);
		//   * Icon image (visual representation of weather conditions)
		// Where are we pulling the icons from and how
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

		// line two
		//   * Temperature
		// Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
		console.log(response.main.temp);
		let K = response.main.temp;
		console.log(K);
		let F = ((K - 273.15) * 1.8 + 32).toFixed(0);
		console.log(F);
		$(".temp").append("Temperature: " + F + " °F");

		// line three
		//   * Humidity
		let humidityInfo = response.main.humidity;
		$(".humidity").append("Humidity: " + humidityInfo + "%");

		// line four
		//   * Wind speed
		// To convert from meters per second to Miles Per Hour
		console.log(response.wind.speed);
		let oldSpeed = response.wind.speed;
		console.log(oldSpeed);
		let newSpeed = (oldSpeed * 2.2369).toFixed(2);
		$(".wind").append("Wind Speed: " + newSpeed + " MPH");

		//   * UV index
		// PULL LON/LAT INFO REPONSE.COORD.LON AND RESPONSE.COORD.LAT
		let lon = response.coord.lon;
		let lat = response.coord.lat;

		// SEND OVER TO uvIndex()
		uvIndex(lon, lat);
	});
}


/*  * Create multiple functions within your application to
 handle the different parts of the dashboard:
 * UV index


Recieves lateral and longitude location */

function uvIndex(lon, lat) {
	// SEARCHES
	let indexURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=8c9bb7e0eeb10862d148cd62de471c05&lat=";
	let middle = "&lon=";
	let indexSearch = indexURL + lat + middle + lon;
	console.log(indexSearch);

	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function(response) {
		let uvFinal = response.value;

		// should be able to compare float to the numbers, try it out
		// then append button with uvFinal printed to it
		$(".uvIndex").append("UV Index: ");
		let uvBtn = $("<button>").text(uvFinal);
		$(".uvIndex").append(uvBtn);
		// then style uvFinal button with below
		if (uvFinal < 3) {
			// IF RETURN IS 0-2 SYLE GREEN
			uvBtn.attr("class", "uvGreen");
		} else if (uvFinal < 6) {
			// IF 3-5 STYLE YELLOW
			uvBtn.attr("class", "uvYellow");
		} else if (uvFinal < 8) {
			// IF 6-7 STYLE ORANGE
			uvBtn.attr("class", "uvOrange");
		} else if (uvFinal < 11) {
			// IF 8-10 STYLE RED
			uvBtn.attr("class", "uvRed");
		} else {
			// IF 11+ STYLE VIOLET
			uvBtn.attr("class", "uvPurple");
		}
	});
}



/* Render buttons and searched city's information */



function renderButtons() {
	// Deleting the buttons prior to adding new movies
	$(".list-group").empty();

	// Looping through the array of cities
	for (let i = 0; i < citiesArray.length; i++) {
		// Then dynamicaly generating buttons for each
		let a = $("<li>");
		// Adding a class
		a.addClass("cityName");
		a.addClass("list-group-item");
		// Adding a data-attribute
		a.attr("data-name", citiesArray[i]);
		// Providing the initial button text
		a.text(citiesArray[i]);
		// Adding the button to the buttons-view div
		$(".list-group").append(a);
	}

	$(".cityName").on("click", function(event) {
		event.preventDefault();

		let city = $(this).data("name");
		console.log("prev searched city" + city);

		//give city info to five day forcast cards as well
		fiveDay(city);
		//pull up the information display
		citySearch(city);
	});
}
/* 

* Include a 5-Day Forecast below the current weather conditions.
Each day for the 5-Day Forecast should display the following:
  * Date
  * Icon image (visual representation of weather conditions)
  * Temperature
  * Humidity
*/

function fiveDay(city) {
	let fiveFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
	let fiveURL = fiveFront + city + APIKey;
	console.log(fiveURL);

	//clear out previous data
	$(".card-text").empty();
	$(".card-title").empty();

	$.ajax({
		url: fiveURL,
		method: "GET"
	}).then(function(response) {
		//dates
		let dateOne = moment
			.unix(response.list[1].dt)
			.utc()
			.format("L");
		$(".dateOne").append(dateOne);
		let dateTwo = moment
			.unix(response.list[9].dt)
			.utc()
			.format("L");
		$(".dateTwo").append(dateTwo);
		let dateThree = moment
			.unix(response.list[17].dt)
			.utc()
			.format("L");
		$(".dateThree").append(dateThree);
		let dateFour = moment
			.unix(response.list[25].dt)
			.utc()
			.format("L");
		$(".dateFour").append(dateFour);
		let dateFive = moment
			.unix(response.list[33].dt)
			.utc()
			.format("L");
		$(".dateFive").append(dateFive);

		//icon
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

		//temp
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

		//humidity
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


// Events


$("#add-city").on("click", function(event) {
	event.preventDefault();

	//line that grabs input from the textbox
	let city = $("#city-input")
		.val()
		.trim();

	//push new city into the Array
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

	// add to local storage
	localStorage.setItem("cities", JSON.stringify(citiesArray));

	//give city info to five day forcast cards as well
	fiveDay(city);

	// search for the city
	citySearch(city);

	// then setting up a button that is created for each city searched for
	renderButtons();
});

renderButtons();