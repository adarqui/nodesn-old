/*
 *
 * Packets module
 *
 */

function modPackets(x) {

	var self = this;

	self.name = "Packets";
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
					"navLive"	: {
						"menu"	: "Live",
						"href"	: "#navLive",
						"mod"	: "live",
						"js"	: "/mods/" + "packets/live/live.js",
						"html"	: "/mods/" + "packets/live/live.html",
						"css"	: "/mods/" + "packets/live/live.css",
						"server": "/mods/" + "packets/live/private/live.js",
						"hidden": "false",
						},
					"navSearch"	: {
						"menu"	: "Search",
						"href"	: "#navSearch",	
						"mod"	: "search",
						"js"	: "/mods/" + "packets/search/search.js",
						"html"	: "/mods/" + "packets/search/search.html",
						"css"	: "/mods/" + "packets/search/search.css",
						"server": "/mods/" + "packets/search/private/search.js",
						"hidden": "false",
						},
					"navGraphs"	: {
						"menu"	: "Graphs",
						"href"	: "#navGraphs",
						"mod"	: "graphs",
						"js"	: "/mods/" + "packets/graphs/graphs.js",
						"html"	: "/mods/" + "packets/graphs/graphs.html",
						"css"	: "/mods/" + "packets/graphs/graphs.css",
						"server": "/mods/" + "packets/graphs/private/graphs.js",
						"hidden": "false",
						},
					"navMaps"	: {
						"menu"	: "Maps",
						"href"	: "#navMaps",
						"mod"	: "maps",
						"js"	: "/mods/" + "packets/maps/maps.js",
						"html"	: "/mods/" + "packets/maps/maps.html",
						"css"	: "/mods/" + "packets/maps/maps.css",
						"server": "/mods/" + "packets/maps/private/maps.js",
						"hidden": "false",
						},
					},
			},

		};


	self.load = function() {

		self.navbar = new CoreNavbar({
			socket: self.socket,
			html_base: "#modPackets-tabs-",
			config_client: self.config_client,
			prefix: "modPackets-tabs",
			navbar: "modPackets-navbar_div",
			type: "tabs",
			}
		);

		var data = {};
		data.res_msg = self.config.navbar_layout;
		self.navbar.handle_resp(self, data);

		//console.log("Module loaded: Packets");
	}


	self.unload = function() {
	}


	self.handle_click = function() {
	}


	self.handle_resp = function(self, data) {
	}


	self.load();
}
