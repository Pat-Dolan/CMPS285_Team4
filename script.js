var map;
var home;
var csv;
var actual_JSON;
var canvas;
var ctx;

require(["esri/map",
    "esri/dijit/HomeButton",
    "esri/layers/CSVLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "dojo/domReady!"
], function(Map, HomeButton, CSVLayer, PictureMarkerSymbol, SimpleRenderer, InfoTemplate) {
  map = new Map("mapDiv", {
    center: [1.868956,50.9518855],
    zoom: 7,
    //basemap: "streets"
    basemap: "gray" //I think this looks nice
  });
  home = new HomeButton({map: map
  }, "HomeButton");
  home.startup();

//this CSV file will be our own
  csv = new CSVLayer("2.5_week.csv", {
      copyright: "USGS.gov"
  });
  var marker = new PictureMarkerSymbol("resources/markers/StaticIcon1.png", 20, 20);
  var renderer = new SimpleRenderer(marker);
  csv.setRenderer(renderer);
  var template = new InfoTemplate("${type}", "${place}");
  csv.setInfoTemplate(template);
  map.addLayer(csv);
});

$(document).ready(function(){
    $("#layer1").click(function(){
        if (csv.visible == true){
            csv.hide();
        }else{
            csv.show();
        }
    });
});


    function loadJSON(callback) {
console.log("here");
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'data.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {

                callback(xobj.responseText);

            }
        };
        xobj.send(null);
    }


    loadJSON(function(response) {
        actual_JSON = JSON.parse(response);

        console.log(actual_JSON);


    })


    function getValue(newValue){

    console.log(document.getElementById("range").innerHTML = newValue);

    var text =  getObjects(actual_JSON, "eventnumber", 1);

    document.getElementByID("test").innerHTML = text;

    console.log(getObjects(actual_JSON, "eventnumber", 1));

    }

    function getObjects(obj, key, val ) {

        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
                objects.push(obj);
            } else if (obj[i] == val && key == '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
        }
        return objects;

    }