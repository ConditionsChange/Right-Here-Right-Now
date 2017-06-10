var queryURL = "https://api.seatgeek.com/2/events?";
var clientID = "client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4";
var subject = "&q=sports"

// https://api.seatgeek.com/2/events/739515?callback=fireEvent&client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4

$.ajax({
	url: queryURL + clientID + subject,
	method: 'GET'
}).done(function(response){
	console.log(response);
});