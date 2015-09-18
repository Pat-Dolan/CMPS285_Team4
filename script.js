var map;
require(["esri/map", "dojo/domReady!"], function(Map) {
  map = new Map("mapDiv", {
	  /*geo coordinates go here*/
    center: [-3.404154999999946, 56.280513],
    zoom: 8,
    basemap: "streets"
  });
});
