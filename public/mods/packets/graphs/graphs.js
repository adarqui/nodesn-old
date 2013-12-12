/*
 *
 * Graphs module
 *
 */
function modGraphs(x) {

	var self = this;

	self.name = "Graphs";
    self.socket = x.socket;
    self.config_client = x.config_client;

	self.config = {
		mod: "mod"+self.name,
		name: self.name,
		class: "mod"+self.name,
		html: "mod"+self.name+"_html",
		id_html: "#"+"mod"+self.name+"_html",
		html_click: "mod"+self.name+"_html_btn",
		h_req: "req_mod"+self.name,
		h_resp: "resp_mod"+self.name,

		navbar_layout:
			{ "navMenu" : {
				"navCentralGraphs" : {
					"menu"	: "CentralGraphs",
						"href"	: "#navCentralGraphs",
						"mod"	: "centralgraphs",
						"js"	: "/mods/" + "packets/graphs/centralgraphs/centralgraphs.js",
						"html"	: "/mods/" + "packets/graphs/centralgraphs/centralgraphs.html",
						"css"	: "/mods/" + "packets/graphs/centralgraphs/centralgraphs.css",
						"server": "/mods/" + "packets/graphs/centralgraphs/private/centralgraphs.js",
						"hidden": "false",
						},

				"navHighcharts"   : {
					"menu"  : "Highcharts",
						"href"  : "#navHighcharts",
						"mod"   : "highcharts",
						"js"    : "/mods/" + "packets/graphs/highcharts/highcharts.js",
						"html"  : "/mods/" + "packets/graphs/highcharts/highcharts.html",
						"css"   : "/mods/" + "packets/graphs/highcharts/highcharts.css",
						"server": "/mods/" + "packets/graphs/highcharts/private/highcharts.js",
						"hidden": "false",
						},
					}
			},
	};


	self.load = function() {

		//console.log("module loaded: Graphs");

		self.navbar = new CoreNavbar({
			socket: self.socket,
			html_base: "#modGraphs-tabs-",
			config_client: self.config_client,
			prefix: "modGraphs-tabs",
			navbar: "modGraphs-navbar_div",
			type: "tabs",
			}
		);

        var data = {};
        data.res_msg = self.config.navbar_layout;
        self.navbar.handle_resp(self, data);

/*
		$(self.config.id_html).html("<p>Hello! I'm a Graphs module");
		handlers.insert(self.config.h_resp, self.handle_resp);
*/

    // set the theme
    Highcharts.setOptions({
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                ]
            }
    ,
            borderWidth: 2,
            plotBackgroundColor: 'rgba(255, 255, 255, .9)',
            plotShadow: true,
            plotBorderWidth: 1
        },
        title: {
            style: { 
                color: '#000',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        subtitle: {
            style: { 
                color: '#666666',
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        xAxis: {
            gridLineWidth: 1,
            lineColor: '#000',
            tickColor: '#000',
            labels: {
                style: {
                    color: '#000',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }
            },
            title: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
    
                }                
            }
        },
        yAxis: {
            alternateGridColor: null,
            minorTickInterval: 'auto',
            lineColor: '#000',
            lineWidth: 1,
            tickWidth: 1,
            tickColor: '#000',
            labels: {
                style: {
                    color: '#000',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }
            },
            title: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }                
            }
        },
        legend: {
            itemStyle: {            
                font: '9pt Trebuchet MS, Verdana, sans-serif',
                color: 'black'
    
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            }
        },
        credits: {
            style: {
                right: '10px'
            }
        },
        labels: {
            style: {
                color: '#99b'
            }
        }
	});


	}

	self.unload = function() {
/*
		handlers.remove(self.config.h_resp, self.handle_resp);
*/
	}


	self.handle_click = function() {
		//console.log(self.config.mod+"clicked");
	}


	self.handle_resp = function(self, data) {
	}


	self.load();
}
