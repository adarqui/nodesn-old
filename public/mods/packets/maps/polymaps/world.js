var polymaps_path = "/mods/packets/maps/polymaps/";

var po = org.polymaps;

//* Country name -> population (July 2010 Est.). *

var population = tsv(polymaps_path+"population.tsv")
    .key(function(l) { return l[1]; })
    .value(function(l) { return l[2].replace(/,/g, ""); })
    .map();

/*
*/
//* Country name -> internet users (2008). *
var internet = tsv(polymaps_path+"internet.tsv")
    .key(function(l) { return l[1]; })
    .value(function(l) { return l[2].replace(/,/g, ""); })
    .map();

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 40, lon: 0})
    .zoomRange([1, 4])
    .zoom(2)
    .add(po.interact());


map.add(po.geoJson()
    .url(polymaps_path+"world.json")
    .tile(false)
    .zoom(3)
    .on("load", load));

map.add(po.compass()
    .pan("none"));

map.add(po.arrow());
map.add(po.drag());
map.add(po.dblclick());
map.add(po.wheel());


map.container().setAttribute("class", "YlOrRd");



/*
tc = po.svg('g');
 loc = po.svg('circle')
 
 loc.setAttribute('r', 20); // set the radius for the circl
 tc.setAttribute('class', 'tweet-container')
 tc.appendChild(loc);    
console.log("map.container()", map.container(), "map", map);

loc.setAttribute('cx', 200);
loc.setAttribute('cy', 200);
*/


 loc = po.svg('circle')

 loc.setAttribute('r', 20); // set the radius for the circl

loc.setAttribute('cx', 100);
loc.setAttribute('cy', 100);


/*
var x = 
{"type":"FeatureCollection","features":[
	{"type":"Feature","geometry":
		{"type":"MultiPolygon","coordinates":
			[[[[74.92,37.24],[74.57,37.03],[72.56,36.82],[71.24,36.13],[71.65,35.42],[71.08,34.06],[69.91,34.04],[70.33,33.33],[69.51,33.03],[69.33,31.94],[66.72,31.21],[66.26,29.85],[62.48,29.41],[60.87,29.86],[61.85,31.02],[60.84,31.5],[60.58,33.07],[60.94,33.52],[60.51,34.14],[61.28,35.61],[62.72,35.25],[63.12,35.86],[64.5,36.28],[64.8,37.12],[66.54,37.37],[67.78,37.19],[69.32,37.12],[70.97,38.47],[71.59,37.9],[71.68,36.68],[73.31,37.46],[74.92,37.24]]]]},
			"properties":{"name":"Afghanistan"}},{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[19.44,41.02],[19.37,41.85],[19.65,42.62],[20.07,42.56],[20.59,41.88],[20.82,40.91],[20.98,40.86],[20.01,39.69],[19.29,40.42],[19.44,41.02]]]]}
]}};
*/


var fc = 
	{"type":"FeatureCollection",
	"features":[
/*
	{"type":"Feature","id":"a86umyz4agob","geometry":
		{"type":"Point","coordinates":[-0.143091100074173,51.5238027996595]},
		"properties":{"name":"The Green Man","type":"pub","osm_id":105.0,"OBJECTID":1}}
		,
	{"type":"Feature","id":"a86umyxnos8t","geometry":
		{"type":"Point","coordinates":[-0.135599099918466,51.5235441996052]},
		"properties":{"name":"The Jeremy Bentham","type":"pub","osm_id":108042.0,"OBJECTID":2}}
		,
	{"type":"Feature","id":"a86umzdcsj1s","geometry":
		{"type":"Point","coordinates":[-0.725178500387415,51.0350300000345]},
		"properties":{"name":"Kings Arms","type":"pub","osm_id":262706.0,"OBJECTID":3}}
		,
*/
	{"type":"Feature","id":"aoksofkasoff","geometry":
		{"type":"Point","coordinates":[110,32]},
		"properties":{"name":"China","type":"pub"}}
		,
	{"type":"Feature","id":"sdoksdoksdog","geometry":
		{"type":"Point","coordinates":[1,1]},
		"properties":{"name":"Florida","type":"pub"}}
		,
	]
};


console.log("OMG");
map.add(po.geoJson().features(fc.features).on("load", setFeatures));



console.log("derp", map.coordinateLocation([28,82]));
console.log("derp2", map.locationCoordinate([28,82]));

            var featurecollection = {
              "type": "FeatureCollection", 
              "features": [
                {"geometry": {
                    "type": "GeometryCollection", 
                    "geometries": [
/*
                        {
                            "type": "LineString", 
                            "coordinates": 
                                [[11.0878902207, 95.1602390564], 
                                [15.01953125, 98.1298828125]]
                        }, 
*/
/*
                        {
                            "type": "Polygon", 
                            "coordinates": 
                                [[[11.0878902207, 45.1602390564], 
                                  [14.931640625, 40.9228515625], 
                                  [0.8251953125, 41.0986328125], 
                                  [7.63671875, 48.96484375], 
                                  [11.0878902207, 45.1602390564]]]
                        },
*/
/*
                        {
                            "type":"Point", 
                            "coordinates":[0, 0]
                        },
*/
/*
                        {
                            "type":"Point", 
                            "coordinates":[100, 100]
                        },
*/
/*
{ "type": "MultiPoint",
  "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
  },
*/
/*
{ "type": "Polygon",
  "coordinates": [
    [ [200.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [250.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [200.8, 0.8], [100.2, 0.8], [50.2, 0.2] ]
    ]
 },
*/
/*
						{
							"type":"Circle",
							"coordinates":[200,200]
						},
*/
                    ]
                }, 
                "type": "Feature", 
                "properties": {}}
              ]
           };


/*
map.container(document.body.appendChild(po.svg("svg")))
.add(po.geoJson().features(featurecollection));
*/
//map.add(po.geoJson().features(featurecollection));
console.log("OMG");
map.add(po.geoJson().features(featurecollection.features).on("load", setFeatures));



function setFeatures(e){
console.log("o", e);
	for (var i = 0; i < e.features.length; i++) {
		var feature = e.features[i];
	console.log("feautrE", feature);
		feature.element.setAttribute("feat_name", feature.data.properties.name); //give the element an id
		feature.element.setAttribute("class", "pub_point"); //set css class for colours
		feature.element.setAttribute("r", "5"); //radius of svg circle.
/*
		feature.element.addEventListener("mousedown", function(e){  
				clickFeature(this, e);	
		}, false); 
*/
	}
}





var test = {
	Canada: {
		percent: 0.9,
	},
	China: {
		percent: 0.5,
	},
	Brazil: {
		percent: 0.2,
	},
};

function load(e) {
console.log("test", test, "e",e, e.features.length);
  for (var i = 0; i < e.features.length; i++) {
    var feature = e.features[i],

        n = feature.data.properties.name;

var z = test[n];

if(z == undefined)
	continue;

v = z.percent;

    n$(feature.element)
        .attr("class", isNaN(v) ? null : "q" + ~~(v * 9) + "-" + 9)
      .add("svg:title")
        .text(n + (isNaN(v) ? "" : ":  " + percent(v)));

  }
}


 
function percent(v) {
  return (v * 100).toPrecision(Math.min(2, 2 - Math.log(v) / Math.LN2)) + "%";
}
