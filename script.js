var map;
var home;
var layer1,layer2,layer3;
var s;


var dojoConfig = {
    parseOnLoad: true
};

var jsonData;

$.ajax({
    dataType: "json",
    url: "data.json",
    async: false,
    success: function(data){jsonData = data}
});

require(["esri/map",
    "esri/layers/FeatureLayer",
    "esri/request",
    "dojo/on",
    "dojo/_base/array",
    "esri/tasks/FeatureSet",
    "esri/geometry/Point",
    "esri/SpatialReference",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/dijit/Search",
    "esri/dijit/PopupTemplate",
    "esri/dijit/HomeButton",
    "esri/dijit/BasemapLayer",//adds basemap to layer
    "esri/dijit/Basemap",
    "esri/layers/CSVLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "dojo/domReady!"
], function(Map, FeatureLayer , Request, on, array, FeatureSet, Point, SpatialReference, Graphic, GraphicsLayer, SimpleMarkerSymbol, Search, PopupTemplate, HomeButton, BasemapLayer, Basemap, CSVLayer, PictureMarkerSymbol, SimpleRenderer, InfoTemplate) {
    map = new Map("mapDiv", {
        center: [1.868956,50.9518855],
        zoom: 3,
        //basemap: "streets"
        basemap: "gray" //I think this looks nice
    });
    home = new HomeButton({map: map
    }, "HomeButton");
    home.startup();

    var featureCollection = {
        "layerDefinition": null,
        "featureSet": {
            "features": [],
            "geometryType": "esriGeometryPoint"
        }
    };
    featureCollection.layerDefinition = {
        "geometryType": "esriGeometryPoint",
        "objectIdField": "ObjectID",
        "drawingInfo": {
            "renderer": {
                "type": "simple",
                "symbol": {
                    "type": "esriPMS",
                    "url": "resources/markers/StaticIcon1.png",
                    "contentType": "resources/markers/png",
                    "width": 15,
                    "height": 15
                }
            }
        },
        "fields": [{
            "name": "ObjectID",
            "alias": "ObjectID",
            "type": "esriFieldTypeOID"
        }, {
            "name": "description",
            "alias": "Description",
            "type": "esriFieldTypeString"
        }, {
            "name": "title",
            "alias": "Title",
            "type": "esriFieldTypeString"
        }]
    };

    var featureLayer = new FeatureLayer(featureCollection,{
        id:"RuskinLayer",
        mode: FeatureLayer.MODE_SNAPSHOT
    });
	
	map.on("load", function(){
		console.log("made it to the load function");
		requestData();
	});
	map.addLayer([featureLayer]);
	
    function requestData(){
		console.log("made it to request data");
        var requestHandle = esriRequest({
            url: "AllPoints.json",
			handleAs: "json",
			timeout: 0,			
            callbackParamName: "callback"
        });
		console.log("made it to past the handleEvent");
        requestHandle.then(requestSucceeded, requestFailed);
		
    }

    function requestSucceeded(response, io) {
        //loop through the items and add to the feature layer
        var features = [];
        array.forEach(response.features, function(item) {
            var attr = {};
			attr["description"] = item.description;
            //pull in any additional attributes if required

            var geometry = new Point(item.geometry.coordinates[0], item.geometry.coordinates[1]);

            var graphic = new Graphic(geometry);
            graphic.setAttributes(attr);
            features.push(graphic);
        });
		console.log("made it to the request success function");
        featureLayer.applyEdits(features, null, null);
    }

    function requestFailed(error) {
        console.log('failed');
    }


    /*basemap layer
     var layer = new BasemapLayer({
     url:"http:http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer"
     });
     var basemap = new Basemap({
     layers:[layer],
     title:"Ruskin's map",
     //thumbnailUrl: to show the image in thumbnail form in the gallery
     });
     basemapGallery.add(basemap);*/

//this CSV file will be our own
    layer1 = new CSVLayer("2.5_week.csv", {
        copyright: "USGS.gov"
    });
    var marker = new PictureMarkerSymbol("resources/markers/StaticIcon1.png", 20, 20);
    var renderer = new SimpleRenderer(marker);
    layer1.setRenderer(renderer);
    var template = new InfoTemplate("${type}", "${place}");
    layer1.setInfoTemplate(template);
    map.addLayer(layer1);


    /*layer2 = new CSVLayer("Ruskin_Stuff.csv", {  });
     var marker2 = new PictureMarkerSymbol("resources/markers/StaticIcon2.png", 20, 20);
     var renderer2 = new SimpleRenderer(marker2);
     layer2.setRenderer(renderer2);
     var template2 = new InfoTemplate("${type}", "${place}");
     layer2.setInfoTemplate(template2);
     map.addLayer(layer2);
     */


    s = new Search({
        enableButtonMode: true, //this enables the search widget to display as a single button
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
        map: map,
        sources: [],
        zoomScale : 5000000
    }, "search");

    var sources = s.get("sources");

    sources.push({

        CSVLayer: new CSVLayer("Ruskin_Stuff.csv", {  }),
        infoTemplate: new InfoTemplate("${type}", "${place}"),
        enableSuggestions: true,
        placeholder: "Spain",
        enableLabel: false,
        searchFields: ["place"],
        displayField: "place",
        name: "Ruskin",
        maxSuggestions: 2,
        exactMatch: false

    });
    //Set the sources above to the search widget
    s.set("sources", sources);

    s.startup();

});

/*
 layer3 = new CSVLayer("", {  });
 var marker3 = new PictureMarkerSymbol("resources/markers/StaticIcon1.png", 20, 20);
 var renderer3 = new SimpleRenderer(marker3);
 layer2.setRenderer(renderer3);
 var template3 = new InfoTemplate("${type}", "${place}");
 layer2.setInfoTemplate(template3);
 map.addLayer(layer3);
 */



$(document).ready(function(){
    $("#layer1").click(function(){
        if (layer1.visible == true){
            layer1.hide();
        }else{
            layer1.show();
        }
    });

    $("#layer2").click(function(){
        if (layer2.visible == true){
            layer2.hide();
        }else{
            layer2.show();
        }
    });

    /*
     $("#layer3").click(function(){
     if (layer3.visible == true){
     layer3.hide();
     }else{
     layer3.show();
     }
     });
     */

    $("#upArrow").mouseenter(function(){
        $("i").css("opacity",1);
    });

    $("#upArrow").mouseleave(function(){
        $("i").css("opacity",.5);
    });
    $("#upArrow").click(function(){
        $("i").toggleClass("fa-arrow-down");
        $("#footer").toggleClass("opened");
    });

    $("#slideLeft").click(function(){
        var div = $(this);
        div.animate({width: '25px'},"fast");
        div.animate({width: '30px'}, "fast");
        $("#container").animate({left: "+=" + screen.width/6});
    });
    $("#slideLeft").mouseenter(function(){
        $(this).css("opacity",1);
    });
    $("#slideLeft").mouseleave(function(){
        $(this).css("opacity",.5);
    });
    $("#slideRight").click(function(){
        var div = $(this);
        div.animate({width: '25px'},"fast");
        div.animate({width: '30px'}, "fast");
        $("#container").animate({left: "-=" + screen.width/6}, "slow");
    });
    $("#slideRight").mouseenter(function(){
        $(this).css("opacity",1);
    });
    $("#slideRight").mouseleave(function(){
        $(this).css("opacity",.5);
    });
});

function createBoxes(){
    var i;
    var element = document.getElementById("container");

    for (i=0; i<8; i++) {

        var div = document.createElement("div");
        var att = document.createAttribute("class");
        var att2 = document.createAttribute("id");
        att.value = "box";
        att2.value = "box"+i;
        div.setAttributeNode(att);
        div.setAttributeNode(att2);
        var node = document.createTextNode("Here is a new DIV.");
        div.appendChild(node);
        element.appendChild(div);
        var elementbox = document.getElementById("box"+i);
        elementbox.style.width = screen.width/6-40 +"px";
    }

    var size =  (screen.width/6)*(i);
    element.style.width= size +"px";
}

/*function createPopup(){
 var box = document.getElementsByClassName("box");

 var div = document.createElement("div");
 var att = document.createAttribute("id")
 att.value = "popup";
 div.setAttributeNode(att);

 $(box).click(function () {
 document.getElementById('div#popup').style.display = 'block';
 });
 }*/

