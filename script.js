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

console.log(jsonData);





require(["esri/map",
    "esri/layers/FeatureLayer",
    "esri/tasks/FeatureSet",
    "esri/dijit/Search",
    "esri/dijit/HomeButton",
	"esri/dijit/BasemapLayer",//adds basemap to layer
    "esri/dijit/Basemap",
	"esri/layers/CSVLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "dojo/domReady!"
], function(Map, FeatureLayer , FeatureSet, Search, HomeButton, BasemapLayer, Basemap, CSVLayer, PictureMarkerSymbol, SimpleRenderer, InfoTemplate) {
  map = new Map("mapDiv", {
    center: [1.868956,50.9518855],
    zoom: 3,
    //basemap: "streets"
    basemap: "gray" //I think this looks nice
  });
  home = new HomeButton({map: map
  }, "HomeButton");
  home.startup();

   /* var myFeatureSet = new FeatureSet(jsonData);

    console.log(myFeatureSet);

    var mylayerDefinition = {
        "geometryType": "esriGeomtryPoint",
        "fields": [
            {
                "name" : "Name",
                "type": "esriFieldTypeOID",
                "alias" : "Name"
            }
        ]
    };

    console.log(mylayerDefinition);

    var featureCollection = {
        layerDefinition : mylayerDefinition,
        featureSet : myFeatureSet
    };

    console.log(featureCollection);

    var featureLayer = new FeatureLayer(featureCollection,{
        mode : FeatureLayer.MODE_ONDEMAND

    });

    map.addLayer(featureLayer);

    console.log(featureLayer);

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


  layer2 = new CSVLayer("Ruskin_Stuff.csv", {  });
  var marker2 = new PictureMarkerSymbol("resources/markers/StaticIcon2.png", 20, 20);
  var renderer2 = new SimpleRenderer(marker2);
  layer2.setRenderer(renderer2);
  var template2 = new InfoTemplate("${type}", "${place}");
  layer2.setInfoTemplate(template2);
  map.addLayer(layer2);



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

        var rect = document.getElementById("container").getBoundingClientRect();
        console.log(rect.left);
        if(rect.left > 0){
            $("#container").animate({left: "+=" + 20},"fast");
            $("#container").animate({left: "-=" + 30},"fast");
            $("#container").animate({left: "+=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container").animate({left: "+=" + ((window.innerWidth-110)/6)});
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

        var rect = document.getElementById("container").getBoundingClientRect();
        console.log(rect.left);
        if(rect.right < window.innerWidth-30){
            $("#container").animate({left: "-=" + 20},"fast");
            $("#container").animate({left: "+=" + 30},"fast");
            $("#container").animate({left: "-=" + 10},"fast");
        }else{
            div.animate({width: '25px'},"fast");
            div.animate({width: '30px'}, "fast");
            $("#container").animate({left: "-=" + ((window.innerWidth-110)/6)});
        }
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
        elementbox.style.width = ((window.innerWidth-110)/6)-40 +"px";
    }

    var size =  (((window.innerWidth-110)/6))*(i);
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

