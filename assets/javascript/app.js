// Declaring variables
var eventList = [];
var eventLimit = 7;

// Query string
var queryURL = "https://api.seatgeek.com/2/events?";
var clientID = "client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4";
var subject = "&q=sports"

// https://api.seatgeek.com/2/events/739515?callback=fireEvent&client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4

// Ajax call
$.ajax({
	url: queryURL + clientID + subject,
	method: 'GET'
}).done(function(response){
	console.log(response);
	var resEvents = response.events;
	for (var i = 0; i < resEvents.length; i++) {
		eventList.push({
			title:resEvents[i].title,
			type:resEvents[i].type,
			address:resEvents[i].venue.address,
			location:resEvents[i].venue.extended_address,
			date:resEvents[i].datetime_local
		});

		if(eventList.length === eventLimit) {
			i = resEvents.length;
		}
	}
	
	console.log(eventList);
});