/*
 *
 * Maps module
 *
 */
function modMaps(x) {

	var self = this;

	self.name = "Maps";
	self.category = "maps";

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
				"navCentralMaps" : {
					"menu"	: "CentralMaps",
						"href"	: "#navCentralMaps",
						"mod"	: "centralmaps",
						"js"	: "/mods/" + "packets/maps/centralmaps/centralmaps.js",
						"html"	: "/mods/" + "packets/maps/centralmaps/centralmaps.html",
						"css"	: "/mods/" + "packets/maps/centralmaps/centralmaps.css",
						"server": "/mods/" + "packets/maps/centralmaps/private/centralmaps.js",
						"hidden": "false",
						},

				"navPolymaps"   : {
					"menu"  : "Polymaps",
						"href"  : "#navPolymaps",
						"mod"   : "polymaps",
						"js"    : "/mods/" + "packets/maps/polymaps/polymaps.js",
						"html"  : "/mods/" + "packets/maps/polymaps/polymaps.html",
						"css"   : "/mods/" + "packets/maps/polymaps/polymaps.css",
						"server": "/mods/" + "packets/maps/polymaps/private/polymaps.js",
						"hidden": "false",
						},
					}
			},
	};


	self.load = function() {

		//console.log("module loaded: Maps");

		self.navbar = new CoreNavbar({
			socket: self.socket,
			html_base: "#modMaps-tabs-",
			config_client: self.config_client,
			prefix: "modMaps-tabs",
			navbar: "modMaps-navbar_div",
			type: "tabs",
			}
		);

        var data = {};
        data.res_msg = self.config.navbar_layout;
        self.navbar.handle_resp(self, data);

/*
		$(self.config.id_html).html("<p>Hello! I'm a Maps module");
		handlers.insert(self.config.h_resp, self.handle_resp);
*/

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
