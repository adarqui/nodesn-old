/*
 *
 * Tools module
 *
 */

function modTools(x) {

	var self = this;

	var a = x.nav_tab;

	self.name = "Tools";
	self.socket = x.socket;
	self.config_client = x.config_client;

	self.config = {
		mod: "mod"+self.name,
		name: self.name,
		class: "mod"+self.name,
		html: "mod"+self.name+"_html",
		id_html: "#mod"+self.name+"_html",
		h_req: "req_mod"+self.name,
		h_resp: "resp_mod"+self.name,

		navbar_layout:
			{ "navMenu" : {
					"navXGeoIP"	: {
						"menu"	: "XGeoIP",
						"href"	: "#navXGeoIP",
						"mod"	: "xgeoip",
						"js"	: "/mods/" + "tools/xgeoip/xgeoip.js",
						"html"	: "/mods/" + "tools/xgeoip/xgeoip.html",
						"css"	: "/mods/" + "tools/xgeoip/xgeoip.css",
						"server": "/mods/" + "tools/xgeoip/private/xgeoip.js",
						"hidden": "false",
						},
					"navWhois"	: {
						"menu"	: "Whois",
						"href"	: "#navWhois",
						"mod"	: "whois",
						"js"	: "/mods/" + "tools/whois/whois.js",
						"html"	: "/mods/" + "tools/whois/whois.html",
						"css"	: "/mods/" + "tools/whois/whois.css",
						"server": "/mods/" + "tools/whois/private/whois.js",
						"hidden": "false",
						},
					"navTraceroute" : {
						"menu"	: "Traceroute",
						"href"	: "#navTraceroute",
						"mod"	: "traceroute",
						"js"	: "/mods/" + "tools/traceroute/traceroute.js",
						"html"	: "/mods/" + "tools/traceroute/traceroute.html",
						"css"	: "/mods/" + "tools/traceroute/traceroute.css",
						"server": "/mods/" + "tools/traceroute/private/traceroute.js",
						"hidden": "false",
						},
					"navGoogle" : {
						"menu"	: "Google",
						"href"	: "#navGoogle",
						"mod"	: "google",
						"js"	: "/mods/" + "tools/google/google.js",
						"html"	: "/mods/" + "tools/google/google.html",
						"css"	: "/mods/" + "tools/google/google.css",
						"server": "/mods/" + "tools/google/private/google.js",
						"hidden": "false",
						},
					"navNMAP"   : {
						"menu"  : "NMAP",
						"href"  : "#navNMAP",
						"mod"   : "NMAP",
						"js"    : "/mods/" + "tools/NMAP/NMAP.js",
						"html"	: "/mods/" + "tools/NMAP/NMAP.html",
						"css"	: "/mods/" + "tools/NMAP/NMAP.css",
						"server": "/mods/" + "tools/NMAP/private/NMAP.js",
						"hidden": "false",
					},
					"navCalc"	: {
                     "menu"  : "Calc",
                        "href"  : "#navCalc",
                        "mod"   : "calc",
                        "js"    : "/mods/" + "tools/calc/calc.js",
                        "html"  : "/mods/" + "tools/calc/calc.html",
                        "css"   : "/mods/" + "tools/calc/calc.css",
                        "server": "/mods/" + "tools/calc/private/calc.js",
                        "hidden": "false",
                    },
    
					"navCentral": {
						"menu"	: "Central",
						"href"	: "#navCentral",
						"mod"	: "central",
						"js"	: "/mods/" + "tools/central/central.js",
						"html"	: "/mods/" + "tools/central/central.html",
						"css"	: "/mods/" + "tools/central/central.css",
						"server": "/mods/" + "tools/central/private/central.js",
						"hidden": "false",
						},
					},
			},
		};


	self.load = function() {

		self.navbar = new CoreNavbar({
			socket: self.socket,
			html_base: "#modTools-tabs-",
			config_client: self.config_client,
			prefix: "modTools-tabs",
			navbar: "modTools-navbar_div",
			type: "tabs",
			}
		);

		var data = {};
		data.res_msg = self.config.navbar_layout;
		self.navbar.handle_resp(self, data);

		//console.log("Module loaded: Tools");
	}


	self.unload = function() {
	}


	self.handle_click = function() {
	}


	self.handle_resp = function(self, data) {
	}


	self.load();
}
