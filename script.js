var map;
require(["esri/map", "dojo/domReady!"], function(Map) {
  map = new Map("mapDiv", {
    center: [1.868956,50.9518855],
    zoom: 7,
    basemap: "streets"
  });
});