// Declaring variables
var eventLimit = 6;

var currentTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss");
var span = 24; //hours
var endTime = moment().utc().add(span,"hours").format("YYYY-MM-DD");
console.log(currentTime);
console.log(endTime);

// var city = "Los+Angeles";
// var zipCode = ""
// var state = "CA";

// Query string
var queryURL = "https://api.seatgeek.com/2/events?";
var clientID = "client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4";
// var subject = "&q=sports"
var datetime = "&datetime_utc.gte=" + currentTime + "&datetime_utc.lte=" + endTime;


// loc = "&venue.state=" + state + 
// 	"&venue.city=" + city +
// 	"&venue.postal_code=" + zipCode;

// var venueState & venueCity

// https://api.seatgeek.com/2/events/739515?callback=fireEvent&client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4

$("#eventRow").slick({

});

$("#submit").on("click",function(event) {

	event.preventDefault();

	$("#eventRow").slick("unslick");
	$("#eventRow").empty();
	$("#map").hide();

	var city = $("#city").val().trim();
	var zipCode = $("#zip").val().trim();
	var state = $("#state").val().trim();

	console.log(city);
	console.log(state);
	console.log(zipCode);

	if (city === "" && zipCode === "" && state === "" ) {

		$("#error").html("At least one field is required");
		$("#error").show();
		return;
	}

	$("#error").hide();

	var loc = "";

	if (state !== "") {
		loc+="&venue.state=" + state;
	}

	if (city !== "") {
		cityStrArr = city.split(" ");
		city = cityStrArr.join("+");
		loc+="&venue.city=" + city;
	}

	if (zipCode !== "") {
		loc+="&venue.postal_code=" + zipCode;
	}

	var eventList = [];

	// Ajax call
	$.ajax({
		url: queryURL + clientID + datetime + loc,
		method: 'GET'
	}).done(function(response){
		console.log(queryURL + clientID + datetime + loc);
		console.log(response);
		var resEvents = response.events;

		if (resEvents.length === 0) {
			console.log("No Events");
			var noEvent = $("<p>").text("There were no events at this time").css("color","#ffffff");
			$("#eventRow").append(noEvent);
			return;
		}

		for (var i = 0; i < resEvents.length; i++) {

			eventList.push({
				title: resEvents[i].title,
				type: resEvents[i].type,
				venue: {
					name: resEvents[i].venue.name,
					address: resEvents[i].venue.address,
					cityStateZip: resEvents[i].venue.extended_address
				},
				date: moment(resEvents[i].datetime_local).format("ddd. DD MMMM YYYY hh:mm A"),
				image: resEvents[i].performers[0].image,
				url: resEvents[i].url
			});


			eventCont = $("<a>").addClass("event").attr("href",eventList[i].url).attr("target","_blank");
			eventCont.append($("<p>").addClass("eventTitle").text(eventList[i].title))
				// .append($("<p>").text(eventList[i].type))
				// .append($("<p>").text(eventList[i].address))
				// .append($("<p>").text(eventList[i].location))
				.append($("<p>").addClass("venueName").text(eventList[i].venue.name))
				.append($("<p>").addClass("eventDate").text(eventList[i].date));

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

			$("#eventRow").append(eventCont);

			if(eventList.length === eventLimit) {
				i = resEvents.length;
			}

			// $("#eventRow").slick("slickAdd","<div><h3>" + slideIndex + "</h3></div>");
			// slideIndex++;
		}

		$("#eventRow").slick({
			slidesToShow: 3,
			slidesToScroll: 3,
			infinite: false
		});

		console.log(eventList);
	});

});

$(document).on("click", ".event", function() {
	// console.log($(this).children(".venueName").text());
	var eventVenue = $(this).children(".venueName").text();
	var newSRC = "https://maps.google.com/maps?q=" + eventVenue + ", &t=&z=14&ie=UTF8&iwloc=&output=embed";
	$("#gmap_canvas").attr("src", newSRC);
	$("#map").show();
});



// for (var i = 0; i < eventList.length; i++)