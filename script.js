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
		//requestData();
	});
	map.addLayer([featureLayer]);
	
   /* function requestData(){
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
	*/

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

    $("#timebutton1").click( function() {
        $("#container1").show();
        $("#container2").hide();
        $("#container3").hide();

    });


    $("#timebutton2").click( function() {
        $("#container2").show();
        $("#container1").hide();
        $("#container3").hide();

    });

    $("#timebutton3").click( function() {
        $("#container3").show();
        $("#container1").hide();
        $("#container2").hide();

    });

    $("#slideLeft").click(function(){
        var div = $(this);
        var rect = document.getElementById("container1").getBoundingClientRect();
        if(rect.left > 0){
            $("#container1").animate({left: "+=" + 20},"fast");
            $("#container1").animate({left: "-=" + 30},"fast");
            $("#container1").animate({left: "+=" + 10},"fast");

        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container1").animate({left: "+=" + ((window.innerWidth-110)/5)});
        }
    });
    $("#slideLeft").click(function(){
        var div = $(this);
        var rect = document.getElementById("container2").getBoundingClientRect();
        if(rect.left > 0){
            $("#container2").animate({left: "+=" + 20},"fast");
            $("#container2").animate({left: "-=" + 30},"fast");
            $("#container2").animate({left: "+=" + 10},"fast");

        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container2").animate({left: "+=" + ((window.innerWidth-110)/5)});
        }
    });
    $("#slideLeft").click(function(){
        var div = $(this);
        var rect = document.getElementById("container3").getBoundingClientRect();
        if(rect.left > 0){
            $("#container3").animate({left: "+=" + 20},"fast");
            $("#container3").animate({left: "-=" + 30},"fast");
            $("#container3").animate({left: "+=" + 10},"fast");

        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container3").animate({left: "+=" + ((window.innerWidth-110)/5)});
        }
    });
    $("#slideLeft").mouseenter(function(){
        $(this).css("opacity",1);
    });
    $("#slideLeft").mouseleave(function(){
        $(this).css("opacity",.5);
    });
    $("#slideRight").click(function(){
        var div = $(this);
        var rect = document.getElementById("container1").getBoundingClientRect();
        if(rect.right < window.innerWidth-30){
            $("#container1").animate({left: "-=" + 20},"fast");
            $("#container1").animate({left: "+=" + 30},"fast");
            $("#container1").animate({left: "-=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container1").animate({left: "-=" + ((window.innerWidth-110)/5)});
        }
    });
    $("#slideRight").click(function(){
        var div = $(this);
        var rect = document.getElementById("container2").getBoundingClientRect();
        if(rect.right < window.innerWidth-30){
            $("#container2").animate({left: "-=" + 20},"fast");
            $("#container2").animate({left: "+=" + 30},"fast");
            $("#container2").animate({left: "-=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container2").animate({left: "-=" + ((window.innerWidth-110)/5)});
        }
    });
    $("#slideRight").click(function(){
        var div = $(this);
        var rect = document.getElementById("container3").getBoundingClientRect();
        if(rect.right < window.innerWidth-30){
            $("#container3").animate({left: "-=" + 20},"fast");
            $("#container3").animate({left: "+=" + 30},"fast");
            $("#container3").animate({left: "-=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container3").animate({left: "-=" + ((window.innerWidth-110)/5)});
        }
    });
    $("#slideRight").mouseenter(function(){
        $(this).css("opacity",1);
    });
    $("#slideRight").mouseleave(function(){
        $(this).css("opacity",.5);
    });

    $(".box").click(function(){
        var id = (this).getAttribute("id");
        console.log(id);
        createPopup(id);
    });


});

function createBoxes(container){
    var i;
    var element = document.getElementById("container"+container);

    for (i=0; i<8; i++) {

        var div = document.createElement("div");
        var att = document.createAttribute("class");
        var att2 = document.createAttribute("id");
        att.value = "box";
        att2.value = "box"+"-"+container + "-"+i;
        div.setAttributeNode(att);
        div.setAttributeNode(att2);
        var node = document.createTextNode("Here is a new DIV." + "box"+"-"+container + "-"+i);
        div.appendChild(node);
        element.appendChild(div);
        var elementbox = document.getElementById("box"+"-"+container + "-"+i);
        elementbox.style.width = ((window.innerWidth-110)/5)-40 +"px";
    }

    var size =  (((window.innerWidth-110)/5))*(i);
    element.style.width= size +"px";
}

function createPopup(boxId){
    //var box = document.getElementById(boxId);
    //var boxNum = box.substring(3);
    var div = document.createElement("div");
    var att = document.createAttribute("id")
    att.value = "popup";
    div.setAttributeNode(att);
    var node = document.createTextNode("Here is a new DIV. " + boxId );
    div.appendChild(node);
    //window.open("","","height=300, titlebar = no, resizable = no, menubar=no, scrollbars=no, toolbar=no, width=300");
    var element = document.body;
    element.appendChild(div);
}

