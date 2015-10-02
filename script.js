var map;
var home;
require(["esri/map","esri/dijit/HomeButton", "dojo/domReady!"], function(Map, HomeButton) {
  map = new Map("mapDiv", {
    center: [1.868956,50.9518855],
    zoom: 7,
    basemap: "streets"
  });
  home = new HomeButton({
    map: map
  }, "HomeButton");
  home.startup();
});

