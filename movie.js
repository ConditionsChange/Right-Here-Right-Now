var spot = "90247"
$.ajax({
    url: "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/json?query=parks+beaches+hiking+in+" + spot + "&key=AIzaSyBgIMrkz6SRkjQis476Nzkri4Be7YdEwts",
    method: "GET"
}).done(function(results){
    console.log(results)
});
$.ajax({
    url: "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyCjtO_Bu7RVtGcHrC1p6kbRHxYCRCJvrJc",
    method: "GET"
}).done(function(results){
    console.log(results)
})
