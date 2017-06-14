// Declaring variables
var eventList = [];
var eventLimit = 10;

var currentTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss");
var span = 3; //days
var endTime = moment().utc().add(span,"days").format("YYYY-MM-DD");
console.log(currentTime);
console.log(endTime);

var city = "Los+Angeles";
var zipCode = ""
var state = "CA";

// Query string
var queryURL = "https://api.seatgeek.com/2/events?";
var clientID = "client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4";
// var subject = "&q=sports"
var datetime = "&datetime_utc.gte=" + currentTime + "&datetime_utc.lte=" + endTime;

var loc = "";

if (state !== "") {
	loc+="&venue.state=" + state;
}

if (city !== "") {
	loc+="&venue.city=" + city;
}

if (zipCode !== "") {
	loc+="&venue.postal_code=" + zipCode;
}

var eventRowLength = 5;

// loc = "&venue.state=" + state + 
// 	"&venue.city=" + city +
// 	"&venue.postal_code=" + zipCode;

// var venueState & venueCity

// https://api.seatgeek.com/2/events/739515?callback=fireEvent&client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4

// Ajax call
$.ajax({
	url: queryURL + clientID + datetime + loc,
	method: 'GET'
}).done(function(response){
	console.log(response);
	var resEvents = response.events;

	if (resEvents.length === 0) {
		console.log("No Events");
		return;
	}

	for (var i = 0; i < resEvents.length; i++) {

		eventList.push({
			title: resEvents[i].title,
			type: resEvents[i].type,
			address: resEvents[i].venue.address,
			location: resEvents[i].venue.extended_address,
			date: moment(resEvents[i].datetime_local).format("ddd. DD MMMM YYYY hh:mm A"),
			image: resEvents[i].performers[0].image,
			url: resEvents[i].url
		});

		// console.log(moment(eventList[i].date).format("DD MMMM YYYY"));


		eventCont = $("<a>").addClass("event").attr("href",eventList[i].url).attr("target","_blank");
		eventCont.append($("<p>").text(eventList[i].title))
			.append($("<p>").text(eventList[i].type))
			.append($("<p>").text(eventList[i].address))
			.append($("<p>").text(eventList[i].location))
			.append($("<p>").text(eventList[i].date));

		var newImg = $("<img>");
		if (eventList[i].image === null) {
			console.log("test");
			newImg.attr("src", "http://lorempixel.com/output/city-q-g-200-200-4.jpg");
		}

		else {
			console.log(eventList[i].image);
			newImg.attr("src",eventList[i].image);
		}

		eventCont.prepend(newImg);

		$("#test").append(eventCont);

		if(eventList.length === eventLimit) {
			i = resEvents.length;
		}
	}
	
	console.log(eventList);
});

// for (var i = 0; i < eventList.length; i++)