// City autocomplete library.
autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */ (
        document.getElementById("searchBar")), {
           types: ["(cities)"],
           componentRestriction: {
               "country": "us"
           }
        }
);

function getMovies(spot){
    var movieUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=7511031905ab0e4a1ded716b077c3c47&language=en-US&page=1&region=US";
    $.ajax({
        url: movieUrl,
        method: "GET"
    }).done(function(movies){
        for(var i = 0; i < movies.results.length; i++){
            var id = movies.results[i].id;
            var title = movies.results[i].title;
            var poster = "https://image.tmdb.org/t/p/w184" + movies.results[i].poster_path;
            var showtime = ("https://www.google.com/#q=" + title + "+" + spot).replace(/ /g, "+").toLowerCase();
            var getTrailer = "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=7511031905ab0e4a1ded716b077c3c47&language=en-US";
            var videoID;
            $.ajax({
                url: getTrailer,
                method: "GET",
                async: false
            }).done(function(trailerVid){
                for(var x = 0; x < trailerVid.results.length; x++){
                    if(trailerVid.results[x].site.toLowerCase() === "youtube" && trailerVid.results[x].type.toLowerCase() === "trailer"){
                        videoID = trailerVid.results[x].key;
                    }
                }
            });

            var trailer = "https://youtube.com/embed/" + videoID + "?rel=0&wmode=transparent&showinfo=0";
            var mainDiv = $("<div class='col-lg-12 outputDivs' id='movieRow'></div>");
            var div = $("<div>");
            var img = $("<img>");
            var a1 = $("<a>");
            var a2 = $("<a>");
            var br = $("<br>");
            a1.attr({"href": showtime, "target": "_blank", "style": "display: block"});
            a2.attr({"data-src": trailer, "class": "youtube", "href": "#trailerBox", "style": "display: block"});
            a1.html("GET SHOWTIMES");
            a2.html("WATCH TRAILER");
            img.attr("src", poster);
            div.append(img);
            // div.append(br);
            div.append(a1);
            div.append(a2)
            div.css({"display": "inline-block", "width": "200px", "margin-right": "10px",});
            div.attr({"class": "poster-box"});
            $("#movieRow").append(div);
        }
        $('#movieRow').slick({
            infinte: false,
            slidesToShow: 6,
            slidesToScroll: 6,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
        $("#movieTop").prepend("<h3 class='sectionTitle'>Nowhere to go? Check out a movie instead.</h3>")
    });
}

function getFood(spot){
    $.ajax({
        url: ("https://maps.googleapis.com/maps/api/geocode/json?address=" + spot + "&key=AIzaSyDTEoYChJeb6F7OLCYNzdnST-GHbDzORK8"),
        method: "GET"
    }).done(function(geo){
        var cord = geo.results[0].geometry.location;
        var lat = cord.lat;
        var long = cord.lng;
        var city = geo.results[0].formatted_address.split(",");
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + long + "&collection_id=1",
            method: "GET",
            headers: {
                Accept : "text/plain; charset=utf-8",
                "Content-Type": "text/plain; charset=utf-8",
                "X-Zomato-API-Key": "20f3f83d17150c92b53b1f0cffd80760"
            }
        }).done(function(restaurants){
            var idxCheck = [];
            for(var i = 0; i < 3; i++){
                var index = Math.floor(Math.random() * parseInt(restaurants.results_shown));

                //Make sure same indexes are not selected
                while(idxCheck.indexOf(index) > -1){
                    index = Math.floor(Math.random() * parseInt(restaurants.results_shown));
                }

                idxCheck.push(index);

                var base = restaurants.restaurants[index].restaurant;
                var restName = base.name;
                var zomatoUrl = base.url;
                var restAdd = base.location.address;
                var restType = base.cuisines;
                var userRating = base.user_rating;

                if(base.featured_image === "") {
                    var restImg = "https://b.zmtcdn.com/images/placeholder_200.png";
                } else {
                    var restImg = base.featured_image;
                }
                var priceRange = "";
                for(var x = 0; x < base.price_range; x++){
                    priceRange += "$";
                }
                var emptyDollas = "";
                for(var y = 0; y < (4 - priceRange.length); y++){
                    emptyDollas += "$";
                }
                var div = $("<div>");
                var textDiv = $("<div>");
                var infoDiv = $("<div>");
                var scoreDiv = $("<div>");
                var scoreH5 = $("<h5>");
                var votesP = $("<p>");
                var cuisineP = $("<p>");
                var priceP = $("<p>");
                var addressP = $("<p>");
                var a = $("<a>");
                var img = $("<img>");

                img.attr({"src": restImg});
                img.css({"width": "345px", "height": "150px"})

                a.attr({"href": zomatoUrl, "target": "_blank"});
                a.css({"font-size": "18px", "font-weight": "bold"})
                a.html(restName);

                scoreH5.css({"background": "#" + userRating.rating_color, "color": "#fff", "display": "inline-block", "padding": "7px", "border": "1px solid " + userRating.rating_color, "border-radius": "10px", "font-weight": "bold"});
                scoreH5.html(userRating.aggregate_rating);

                votesP.html("&nbsp;Based on " + userRating.votes + " votes");
                votesP.css({"font-size": "12px", "color": "#7e7e7e", "display": "inline-block"});

                priceP.html("&nbsp; &nbsp; | &nbsp; &nbsp; Price Range: <span style='color: #41A700'>" + priceRange + "</span><span style='color: #CCCCCC'>" + emptyDollas + "</span>");
                priceP.css({"display": "inline-block"})

                scoreDiv.append(scoreH5, votesP, priceP);

                cuisineP.css({"font-style": "italic", "color": "#7e7e7e"})
                cuisineP.html(restType);

                addressP.html(restAdd);

                infoDiv.css({"margin-top": "7px"})
                infoDiv.append(a, cuisineP)

                div.css({"width": "349px", "display": "inline-block", "margin-right": "25px", "border": "2px solid #DFDFDF"})
                textDiv.append(infoDiv, addressP, scoreDiv);
                textDiv.css({"margin-left": "10px"})
                div.append(img, $("<br>"), textDiv);
                $("#foodRow").append(div);
            }
        });
        $("#foodTop").prepend("<h3 class='sectionTitle'>Grab a bite in a trending restaurant</h3>");
    });

}
function getWeather(cityName){
	$("#weather-info").html("");
    var APIkey = "6f58f13c3025088168db93c787df5115";
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" +cityName+ "&appid=" + APIkey,
        method: "GET"
    }).done(function(response){
        console.log(response.list);
        //Main Title Change
        var title_div = $("<h1 style='text-align:center'>Weather Forecast</h1>");
        var masterdiv = $("<div class='row' id='weather-info'></div>");

        //Get Weather for 6 different time slots and append to the master div
        for (var i=5;i<=10;i++){
            var innerdiv = $("<div class='col-sm-2'></div>");
            innerdiv.css("text-shadow","2px 2px 4px black")

            //Temperature in Degrees
            var a = $("<div class='row' style='text-align:center'></div>");
            var a_c = $("<span>");
            a_c.html(Math.floor((parseInt(response.list[i].main.temp)*(9/5)-459.67)).toString()+"&deg;");
            a.append(a_c);

            //Weather Icon
            var b = $("<div class='row' style='text-align:center'></div>");
            var b_c = $("<img>");
            // b.css()
            b_c.attr("src","http://openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png");
            b.append(b_c);

            //Description of Weather
            var c = $("<div class='row' style='text-align:center'></div>");
            var c_r = $("<span>");
            c_r.html(response.list[i].weather[0].description);
            c.append(c_r);

            //Time of Day
            var d = $("<div class='row' style='text-align:center'></div>");
            var d_r = $("<span>");
            var time_smith = moment(response.list[i].dt_txt).format("h:mm A")
            d_r.html(time_smith.toString());
            d.append(d_r);

            innerdiv.append(a).append(b).append(c).append(d);

            masterdiv.append(innerdiv);
        }

        //Update the weather info div with the

        $("#weather-info").replaceWith(masterdiv);
        $("#weather-info").prepend(title_div);
        $("#weather-info").css({"background-color":"#a0c6e8","color":"white","border":"10px #7B6DC0","background-image":"url(assets/images/weather.jpg)","background-size":"cover"});
        $("#weather-info").css("display","none");
        $("#weather-info").fadeIn();
        $("#weather-info").fadeIn("slow");
        $("#weather-info").fadeIn(3000);
    });
}

function getEvents(city){
    var eventLimit = 5;
    var currentTime = moment().utc().format("YYYY-MM-DDTHH:mm:ss");
    var span = 24; //hours
    var endTime = moment().utc().add(span,"hours").format("YYYY-MM-DD");
    var queryURL = "https://api.seatgeek.com/2/events?";
    var clientID = "client_id=NzgwMTQ1M3wxNDk3MTIxNzA4LjE4";
    var datetime = "&datetime_utc.gte=" + currentTime + "&datetime_utc.lte=" + endTime;
    var eventRowLength = 6;
    $("#eventRow").empty();
    $("map").hide();

    var zipCode = "";
    var state = "";
    if (isNaN(parseInt(city)) === false) {
        zipCode = city;
        city = "";
    }
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
        cityJoined = cityStrArr.join("+");
        loc+="&venue.city=" + cityJoined;
    }
    if (zipCode !== "") {
        loc+="&venue.postal_code=" + zipCode;
    }
    var eventList = [];
    $.ajax({
        url: queryURL + clientID + datetime + loc,
        method: 'GET'
    }).done(function(response){
        console.log(response);
        var resEvents = response.events;
        if (resEvents.length === 0) {
            console.log("No Events");
            var noEvent = $("<h4>").addClass("noEvent");
            noEvent.css("color", "red")

            if (city !== "")
                noEvent.html("No events going on in " + city + " at this time :(<br> Grab a bite or go watch a movie, maybe?");

            else
                noEvent.html("No events going on in " + city + " at this time :(<br> Grab a bite or go watch a movie, maybe?");

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
            eventCont.append($("<h5>").addClass("eventTitle").html(eventList[i].title))
                .append($("<h5>").addClass("venueName").html(eventList[i].venue.name))
                .append($("<h5>").addClass("eventDate").html(eventList[i].date));

            var newImg = $("<img>");
            if (eventList[i].image === null) {
                newImg.attr("src", "https://lorempixel.com/output/city-q-g-200-200-4.jpg");
            }

            else {
                console.log(eventList[i].image);
                newImg.attr("src",eventList[i].image);
            }
            newImg.css({"width": "350px", "height": "200px"})
            eventCont.prepend(newImg);

            $("#eventRow").append(eventCont);

            if(eventList.length === eventLimit) {
                i = resEvents.length;
            }
        }
        $("#eventRow").slick({
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false
        });
    });
    $("#eventTop").prepend("<h3 class='sectionTitle'>Events happening near you</h3>");
}

var clickEvents = {
    vidModal: function(){
        $('#trailerBox .modal-body').html('');
        $(document).on("click", ".youtube", function(evt){
            evt.preventDefault();
            var vidSrc = $(this).attr("data-src");
            var iframe = $("<iframe>");
            iframe.css({"width": "854px", "height": "480px"});
            iframe.attr({"scrolling": "no", "allowtransparency": "true", "allowfullscreen": "true", "src": vidSrc, "frameborder": "0"});
            $("#trailerBox .modal-body").html(iframe);
            $("#trailerBox").on("show.bs.modal", function(){
                var modalBody = $(this).find('.modal-body');
                var modalDialog = $(this).find('.modal-dialog');
                var newModalWidth = 854 + parseInt(modalBody.css("padding-left")) + parseInt(modalBody.css("padding-right"));
                newModalWidth += parseInt(modalDialog.css("padding-left")) + parseInt(modalDialog.css("padding-right"));
                newModalWidth += 'px';
                $(this).find('.modal-dialog').css('width', newModalWidth);
            });
            $("#trailerBox").modal();
        });
        // Hide modal on close
        $('#trailerBox').on('hidden.bs.modal', function () {
            $('#trailerBox .modal-body').html('');
        });
    },

    startSearch: function(){
        $("#start").on("click", function(evt){
            evt.preventDefault();
            $(".outputDivs").empty();
            $(".sectionTitle").remove();

            var cityZip = $("#searchBar").val().trim();

            //Take only city/zip for Seatgeek
            var cityZipArr = cityZip.split(", ");
            var cityOrZip = cityZipArr[0];

            $.ajax({
                url: ("https://maps.googleapis.com/maps/api/geocode/json?address=" + cityOrZip + "&key=AIzaSyDTEoYChJeb6F7OLCYNzdnST-GHbDzORK8"),
                method: "GET"
            }).done(function(geo){
                var check = geo.results[0];
                if(cityZip === ""){
                    // does nothing ¯\_(ツ)_/¯
                } else if(check === undefined){
                    $("#weather-info").empty(); // don't know why, but this needs to be explicitly done.
                    $("#msgs").html("<h3>Please enter a valid city or zip!</h3>")
                    $(".outputDivs").empty();
                    $(".sectionTitle").remove();
                } else {
                    $("#msgs").empty()
                    try {
                        $("#movieRow").slick("unslick");
                    } catch (e) {}
                    try {
                        $("#eventRow").slick("unslick");
                    } catch (e) {}
                    getWeather(cityZip);
                    getEvents(cityOrZip);
                    getFood(cityZip);
                    getMovies(cityZip);
                }
            });
        });
    }
}

$(document).ready(function(){
    clickEvents.startSearch();
    clickEvents.vidModal();
});
