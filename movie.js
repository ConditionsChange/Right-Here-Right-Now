//themoviedb.prg api
//key = 7511031905ab0e4a1ded716b077c3c47

function movieInfo(){
    var movieUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=7511031905ab0e4a1ded716b077c3c47&language=en-US&page=1&region=US";
    $.ajax({
        url: movieUrl,
        method: "GET"
    }).done(function(response){
        for(var i = 0; i < response.results.length; i++){
            var id = response.results[i].id;
            var title = response.results[i].title;
            var poster = "https://image.tmdb.org/t/p/w184" + response.results[i].poster_path;
            var showtime = ("https://www.google.com/#q=" + title).replace(/ /g, "+").toLowerCase();
            var getTrailer = "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=7511031905ab0e4a1ded716b077c3c47&language=en-US";
            var videoID;
            $.ajax({
                url: getTrailer,
                method: "GET",
                async: false
            }).done(function(resp){
                for(var x = 0; x < resp.results.length; x++){
                    if(resp.results[x].site.toLowerCase() === "youtube" && resp.results[x].type.toLowerCase() === "trailer"){
                        videoID = resp.results[x].key;
                    }
                }
            });

            var trailer = "https://youtube.com/embed/" + videoID + "?rel=0&wmode=transparent&showinfo=0";
            var div = $("<div>");
            var img = $("<img>");
            var a1 = $("<a>");
            var a2 = $("<a>");
            var br = $("<br>");
            a1.attr({"href": showtime, "target": "_blank"});
            a2.attr({"data-src": trailer, "class": "youtube", "href": "#trailerBox"});
            a1.html("GET SHOWTIMES");
            a2.html("WATCH TRAILER");
            img.attr("src", poster);
            div.append(img);
            div.append(br);
            div.append(a1);
            div.append(br);
            div.append(a2);
            div.css({"display": "inline-block", "width": "188px", "margin-right": "10px", "border": "2px solid #DFDFDF"});
            div.attr({"class": "poster-box"});
            $("#test").append(div);
        }
    });
}

movieInfo();
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
        // $("#trailerBox").css({"z-index": "9999", "position": "fixed", "top": "100px", "left": "0", "right": "0"})
    });
    $("#trailerBox").modal();
})

$('#trailerBox').on('hidden.bs.modal', function () {
	$('#trailerBox .modal-body').html('');
});
