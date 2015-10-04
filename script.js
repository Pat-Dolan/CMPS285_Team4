var map;
require(["esri/map", "esri/layers/FeatureLayer", "esri/dijit/Legend",
		 "dojo/_base/array", "dojo/parser", "dijit/layout/BorderContainer",
		 "dijit/layout/ContentPane", "dijit/layout/AccordionContainer",
		 "dojo/domReady!"], 
		 function(Map, FeatureLayer, Legend, arrayUtils, parser) {
			parser.parse();
			map = new Map("mapDiv", {
			center: [1.868956,50.9518855],
			zoom: 7,
			basemap: "streets"
		});
});
