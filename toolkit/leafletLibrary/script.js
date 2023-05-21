(function(){
    'use strict';

    // creates the map and sets the location
    var map = L.map('map').setView([37.430759, -121.897507], 13);
    
    // adds in the map image from OpenStreetView
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href=""http://www.openstreetmap.org/copyright"">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker(
        [37.432405,-121.907045
    ], {
        color: 'orange'
    }).addTo(map)
    
    marker.bindPopup("<b>Milpitas Library</b><br>Best place for books, just like most libraries").openPopup();

    var popup = L.popup()
        .setLatLng([37.430759, -121.897507])
        .setContent("Welcome to Milpitas!")
        .openOn(map);

    var polygon = L.polygon( [
        [37.418019,-121.902481],
        [37.419490,-121.896765],
        [37.413201,-121.893160],
        [37.410936,-121.895692],
        [37.413689,-121.902096],
    ], {
         color: 'blue',
    }
       
    ).addTo(map);

    polygon.bindPopup("<b>Great Mall</b><br>The Milpitas highlight <br>A place to go when you don't have anything else to do").openPopup

    var marker2 = L.marker([37.432907,-121.899107], {
        color: 'orange',
    }).addTo(map);

    marker2.bindPopup("<b>Milpitas City Hall</b><br>It's a pretty nice place I think")

//     function onMapClick(e) {
//         popup 
//             .setLatLng(e.latlng)
//             .setContent("<b>Great Mall</b><br>The Milpitas highlight <br>A place to go when you don't have anything else to do")
//             .openOn(map)
            

// ;
//     }

//     polygon.on('click', onMapClick)
}());