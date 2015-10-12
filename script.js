var map;
var home;
var layer1,layer2,layer3;


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
    zoom: 3,
    //basemap: "streets"
    basemap: "gray" //I think this looks nice
  });
  home = new HomeButton({map: map
  }, "HomeButton");
  home.startup();

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

  /*
  layer3 = new CSVLayer("", {  });
  var marker3 = new PictureMarkerSymbol("resources/markers/StaticIcon1.png", 20, 20);
  var renderer3 = new SimpleRenderer(marker3);
  layer2.setRenderer(renderer3);
  var template3 = new InfoTemplate("${type}", "${place}");
  layer2.setInfoTemplate(template3);
  map.addLayer(layer3);
   */

});

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

    $("#upArrow").click(function(){
        $("#footer").toggleClass("opened");
    });

    $("#slideLeft").click(function(){
        var div = $(this);
        div.animate({width: '45px'},"fast");
        div.animate({width: '50px'}, "fast");
        $("#timeline").animate({left: '+=215'});
    });
    $("#slideLeft").mouseenter(function(){
        $(this).css("opacity",1);
    });
    $("#slideLeft").mouseleave(function(){
        $(this).css("opacity",.2);
    });
    $("#slideRight").click(function(){
        var div = $(this);
        div.animate({width: '45px'},"fast");
        div.animate({width: '50px'}, "fast");
        $("#timeline").animate({left: '-=215'}, "slow");
    });
    $("#slideRight").mouseenter(function(){
        $(this).css("opacity",1);
    });
    $("#slideRight").mouseleave(function(){
        $(this).css("opacity",.2);
    });
});

function Shape(x, y, w, h, fill1, fill2, text, text2, text3) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill1 = fill1;
    this.fill2 = fill2;
    this.text = text;
    //Added text
    this.text2 =text2;
    this.text3 = text3;
}

function createBoxes() {
// get canvas element
    var elem = document.getElementById("timeline");
    var context;
// check if context exists
    if (elem.getContext) {

        var box = new Array("", "", "", "", "", "", "", "", "");

        // get method to read in "text" data - "TEST"
        // changed the background and color
        box[0] = new Shape(15, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Starting Point", "May 14th, 1833", "London");
        box[1] = new Shape(230, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Pass Through", "Blackheat", "Shooter's Hill");
        box[2] = new Shape(445, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Destination", "May 15th, 1833", "Calais");
        box[3] = new Shape(660, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Pass Through", "Larecouse", "St Omère");
        box[4] = new Shape(875, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Destination", "May 16th, 1833", "Cassel");
        box[5] = new Shape(1090, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Pass Through", "Baileul", "Armentières");
        box[6] = new Shape(1305, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Destination", "May 17th, 1833", "Lille");
        box[7] = new Shape(1520, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Pass Through", "Leuse", "Ath");
        box[8] = new Shape(1735, 15, 200, 200, "rgba(0,0,0,0.5)", "#FFF", "Destination", "May 18th, 1833", "Brussels");

        context = elem.getContext('2d');
        for (var i = 0; i < box.length; i++) {
            context.fillStyle = box[i].fill1;
            context.fillRect(box[i].x, box[i].y, box[i].w, box[i].h);
            context.fillStyle = box[i].fill2;
            context.font = "17px Arial";
            context.fillText(box[i].text, 50 + box[i].x, 40 + box[i].y);
            context.fillText(box[i].text2, 30 + box[i].x, 90 + box[i].y);
            context.fillText(box[i].text3, 30 + box[i].x, 120 + box[i].y);

            // text location = coordinates with equation (+box[i].x) and (+box[i].y)
        }
    }
}

/*function createLinks() {

    var canvas = document.getElementById('timeline');
    var context = canvas.getContext("2d");
    var Links = new Array();
    var box = new Array();
    var hoverLink;

    function drawLink(x, y, href, title) {
        var linkTitle = title,
            linkX = x,
            linkY = y,
            linkWidth = context.measureText(linkTitle).width,
            linkHeight = parseInt(context.font);

        context.font = "10.5px Arial";
        context.fillText(linkTitle, linkX, linkY);

        canvas.addEventListener("mousemove", on_mousemove, false);
        canvas.addEventListener("click", on_click, false);

        Links.push(x + ";" + y + ";" + linkWidth + ";" + linkHeight + ";" + href);
    }

    function on_mousemove (ev) {
        var x, y;
        // Get the mouse position relative to the canvas element
        if (ev.layerX || ev.layerX == 0) { // For Firefox
            x = ev.layerX;
            y = ev.layerY;
        }

        for (var i = Links.length - 1; i >= 0; i--) {
            var params = new Array();

            // Get link params back from array
            params = Links[i].split(";");

            var linkX = parseInt(params[0]),
                linkY = parseInt(params[1]),
                linkWidth = parseInt(params[2]),
                linkHeight = parseInt(params[3]),
                linkHref = params[4];

            // Check if cursor is in the link area
            if (x >= linkX && x <= (linkX + linkWidth) && y >= linkY && y <= (linkY + linkHeight)){
                document.body.style.cursor = "pointer";
                hoverLink = linkHref;
                break;
            }
            else {
                document.body.style.cursor = "";
                hoverLink = "";
            }
        };
    }

    function on_click(e) {
        if (hoverLink) {
            window.open(hoverLink);
        }
    }

    box[0] = new drawLink(45,190,"http://southeastern.edu/","MORE INFORMATION");
    box[1] = new drawLink(260,190,"http://southeastern.edu/","MORE INFORMATION");
    box[2] = new drawLink(475,190,"http://southeastern.edu/","MORE INFORMATION");
    box[3] = new drawLink(690,190,"http://southeastern.edu/","MORE INFORMATION");
    box[4] = new drawLink(905,190,"http://southeastern.edu/","MORE INFORMATION");
    box[5] = new drawLink(1120,190,"http://southeastern.edu/","MORE INFORMATION");
    box[6] = new drawLink(1335,190,"http://southeastern.edu/","MORE INFORMATION");
    box[7] = new drawLink(1550,190,"http://southeastern.edu/","MORE INFORMATION");
    box[8] = new drawLink(1765,190,"http://southeastern.edu/","MORE INFORMATION");

}*/