
var vectorLayer = new ol.layer.Vector({
			  source: new ol.source.Vector({
				  url: 'geoJSON.json',
				  format: new ol.format.GeoJSON()
			  })
		  });
		  
var iconStyle = new ol.style.Style({
	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
		anchor: [0.1, 0],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels',
		opacity: 1.00,
		src: '/resources/markers/StaticIcon1.png'
	}))
});
vectorLayer.setStyle(iconStyle);

var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
		  vectorLayer
        ],
		target: 'map',
        view: new ol.View({
          center: ol.proj.transform([ 1.833333,50.95], 'EPSG:4326', 'EPSG:3857' ),
          zoom: 3
        })
      });