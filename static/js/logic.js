var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data){
    createFeatures(data.features);
    console.log(data);
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJson(earthquakeData, {
        
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "black",
                weight: 0.75,
                opacity: 1,
                fillOpacity: 0.9
            });
        },

        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1IjoiaGJ1c3MiLCJhIjoiY2s3cnA4aWxpMDVvazNsbzV6bm90ZGN5eCJ9.NhqTxKT7yGUHDMpDIRlPvA"
        });

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [39.7392, -104.9903],
        zoom: 5,
        layers: [lightmap, earthquakes]
      });

      var legend = L.control({position: "bottomright"});

      legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];
      
          for (var i = 0; i < mags.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
                  mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
          }
          
          return div;
      };
          
      legend.addTo(myMap);

}

function getColor(magn) {
    switch (true) {
        case magn> 5:
          return "#FF4000";
        case magn> 4:
          return "#FF8000";
        case magn> 3:
          return "#FFBF00";
        case magn> 2:
          return "#FFFF00";
        case magn> 1:
          return "#BFFF00";
        default:
          return "#80FF00" ;
        }
}

function markerSize(earthquakes) {
    return earthquakes * 5;
  }
  