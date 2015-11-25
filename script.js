var map;
var home;
var layer1,layer2,layer3;
var s;
var features = [];
var graphic;
var popupTemplate;
var featureLayer;
var mapHash;


var dojoConfig = {
    parseOnLoad: true
};
var jsonData;

$.ajax({
    dataType: "json",
    url: "GeoJsonData/AllPoints.json",
    async: false,
    success: function(data){jsonData = data}
});

require(["esri/map",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/request",
    "dojo/on",
	"dojo/ready",
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
], function(Map, FeatureLayer , Extent, SpatialReference,  esriRequest, on, ready, array, FeatureSet, Point, SpatialReference, Graphic, GraphicsLayer, SimpleMarkerSymbol, Search, PopupTemplate, HomeButton, BasemapLayer, Basemap, CSVLayer, PictureMarkerSymbol, SimpleRenderer, InfoTemplate) {
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

    featureLayer = new FeatureLayer(featureCollection,{
        id:"RuskinLayer",
        mode: FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"]
    });

	map.on("layers-add-result",function(evt){

		requestData();
        searchBar()
	});


	map.addLayers([featureLayer]);


    map.on("click",function(evt){
        buscar("London");
    });

   function requestData(){
        var requestHandle = esriRequest({
            url: "GeoJsonData/AllPoints.json",
			handleAs: "json",
			timeout: 0,			
            callbackParamName: "jsoncallback"
        });
        requestHandle.then(requestSucceeded, requestFailed);
		
    }

    function requestSucceeded(response, io) {
        //loop through the items and add to the feature layer
        array.forEach(response.features, function(item) {
            var attr = {};
			attr["properties"] = item.properties;
            //pull in any additional attributes if required

            var geometry = new Point(item.geometry.coordinates[0], item.geometry.coordinates[1]);
            var template = new InfoTemplate("Point Information","City Name: "+ item.properties.City_Names.toString() + "</br>" + "Latitude: " + item.properties.y_latitude + "</br>" + "Longitude: " + item.properties.x_longitude);
            graphic = new Graphic(geometry,null,null,template);
            features.push(graphic);


        });
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

        function searchBar() {

        s = new Search({
            enableButtonMode: true, //this enables the search widget to display as a single button
            enableLabel: false,
            enableInfoWindow: true,
            showInfoWindowOnSelect: false,
            map: map,
            //sources: [],
            zoomScale: 5000000
        }, "search");

        var sources = s.get("sources");


        sources.push({

            featureLayer: jsonData,
            infoTemplate: popupTemplate,
            enableSuggestions: true,
            placeholder: "Calais",
            enableLabel: false,
            searchFields: ["properties.City_Names"],
            //displayField: "properties.City_Names".toString(),
            outFields: ["*"],
            name: "Ruskin",
            maxSuggestions: 2,
            exactMatch: false

        });


        //Set the sources above to the search widget
        s.set("sources", sources);

        console.log(sources);

        s.startup();

    }

    /*
    mapHash = {};
    var myKey;

    for(i= 0 ; i< jsonData.features.length; i++){

        myKey = jsonData.features[i].properties.City_Names;
        mapHash[myKey] = jsonData.features[i].properties;

    }

    function buscar(text) {

        console.log("hi");
        //console.log(mapHash);

        //var text = $("#myText").val();
        var Xlongitude = mapHash[text].x_longitude;
        var Ylatitude = mapHash[text].y_latitude;

        var extent = new Extent(Xlongitude, Ylatitude, Xlongitude, Ylatitude, new SpatialReference({wkid: 4326}));
        map.setExtent(extent);
        map.setLevel(8);

    }
    */


});






$(document).ready(function(){

    /*
    $("#mapDiv").trigger(function(load){
        console.log("hi");
        $("#submit").clik(function(event){
            console.log("here");
            event.preventDefault()
            buscar();
        });
    });
    */


    $("#layer1").click(function(){
        if (layer1.visible == true){
            layer1.hide();
        }else{
            layer1.show();
        }
    });

    $("#layer2").click(function(){
        if (featureLayer.visible == true){
            featureLayer.hide();
        }else{
            featureLayer.show();
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

    $("#submit").mouseenter(function(){
        $(this).css("opacity",.5);
    });

    $("#submit").mouseleave(function(){
        $(this).css("opacity",1);
    });

    $("#upArrow").click(function(){

        $("i").toggleClass("fa-arrow-down");
        $("#footer").toggleClass("opened");
        $("#buttonContainer").toggle();

    });

    $("#timebutton1").click( function() {
        setVisibleContainer(1);
    });

    $("#timebutton2").click( function() {
        setVisibleContainer(2);
    });

    $("#timebutton3").click( function() {
        setVisibleContainer(3);
    });

    $("#slideLeft").click(function(){
        var div = $(this);
        var cont = getVisibleContainer();
        var rect = document.getElementById(cont).getBoundingClientRect();
        if(rect.left > 0){
            $("#"+cont).animate({left: "+=" + 20},"fast");
            $("#"+cont).animate({left: "-=" + 30},"fast");
            $("#"+cont).animate({left: "+=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#"+cont).animate({left: "+=" + ((window.innerWidth-110)/5)});
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
        var cont = getVisibleContainer();
        var rect = document.getElementById(cont).getBoundingClientRect();
        if(rect.right < window.innerWidth-30){
            $("#"+cont).animate({left: "-=" + 20},"fast");
            $("#"+cont).animate({left: "+=" + 30},"fast");
            $("#"+cont).animate({left: "-=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#"+cont).animate({left: "-=" + ((window.innerWidth-110)/5)});
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
        if(document.getElementById("popup")) {
            closePopup();

        }
        createPopup(id);
        $("#footer").toggleClass("opened");
        $("i").toggleClass("fa-arrow-down");
        $("#buttonContainer").toggle();

    });

    $("#close").click(function(){
            $("#footer").show();
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
    var att = document.createAttribute("id");
    att.value = "popup";
    div.setAttributeNode(att);
    var node = document.createTextNode("Here is a new DIV. " + boxId );
    div.appendChild(node);
    var element = document.body;
    element.appendChild(div);

    var close = document.createElement("img");
    var att2 = document.createAttribute("id");
    att2.value = "close";
    close.setAttributeNode(att2);
    close.setAttribute("src", "resources/white_x_close.png");
    var popUp = document.getElementById("popup");
    popUp.appendChild(close);
    close.onclick = function(){closePopup()};
}

function closePopup(){

    var rem = document.getElementById("popup");
    document.body.removeChild(rem);
    $("#footer").toggleClass("opened");
    $("i").toggleClass("fa-arrow-down");
    $("#buttonContainer").toggle();

}

function getVisibleContainer(){
    if(document.getElementById("container1").style.display.valueOf().toString() == "block"){
        return "container1";
    }else if(document.getElementById("container2").style.display.valueOf().toString() == "block"){
        return "container2";
    }else{
        return "container3";
    }
}

function setVisibleContainer(num) {
    switch (num) {
        case(1):
            $("#container1").show();
            $("#container2").hide();
            $("#container3").hide();
            $("#timebutton1").css({"background":"#3B5786","border-bottom-color":"#3B5786"});
            $("#timebutton2").css({"background":"#2f456a","border-bottom-color":"#2f456a"});
            $("#timebutton3").css({"background":"#2f456a","border-bottom-color":"#2f456a"});
            break;
        case(2):
            $("#container2").show();
            $("#container1").hide();
            $("#container3").hide();
            $("#timebutton2").css({"background":"#3B5786","border-bottom-color":"#3B5786"});
            $("#timebutton1").css({"background":"#2f456a","border-bottom-color":"#2f456a"});
            $("#timebutton3").css({"background":"#2f456a","border-bottom-color":"#2f456a"});
            break;
        case(3):
            $("#container3").show();
            $("#container1").hide();
            $("#container2").hide();
            $("#timebutton3").css({"background":"#3B5786","border-bottom-color":"#3B5786"});
            $("#timebutton1").css({"background":"#2f456a","border-bottom-color":"#2f456a"});
            $("#timebutton2").css({"background":"#2f456a","border-bottom-color":"#2f456a"});
            break;
    }
}