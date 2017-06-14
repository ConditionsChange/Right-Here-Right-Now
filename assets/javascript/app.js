// Declaring variables
var eventList = [];
var eventLimit = 7;

var currentTime = moment().utc().format("YY-MM-DD");
var span = 3; //days
var endTime = moment().utc().add(3,"days").format("YY-MM-DD");
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

	for (var i = 0; i < resEvents.length; i++) {

		eventList.push({
			title: resEvents[i].title,
			type: resEvents[i].type,
			address: resEvents[i].venue.address,
			location: resEvents[i].venue.extended_address,
			date: resEvents[i].datetime_local
		});

		if(eventList.length === eventLimit) {
			i = resEvents.length;
		}
	}
	
	console.log(eventList);
});