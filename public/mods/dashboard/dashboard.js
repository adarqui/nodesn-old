/*
 *
 * Dashboard module
 *
 */
function modDashboard(x) {

	var self = this;

	self.name = "Dashboard";
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

/*
		geoipfix_click: "mod"+self.name+"_geoipfix_btn",
		id_geoipfix_click: "#mod"+self.name+"_geoipfix_btn",
*/
     navbar_layout:
            { "navMenu" : {
                    "navAddUser" : {
                        "menu"  : "AddUser",
                        "href"  : "#navAddUser",
                        "mod"   : "adduser",
                        "js"    : "/mods/" + "dashboard/adduser/adduser.js",
                        "html"  : "/mods/" + "dashboard/adduser/adduser.html",
                        "css"   : "/mods/" + "dashboard/adduser/adduser.css",
                        "server": "/mods/" + "dashboard/adduser/private/adduser.js",
                        "hidden": "false",
                        },
    			}
			},
	};


	self.load = function() {

		//console.log("module loaded: Dashboard");

/*
		$(self.config.id_html).html("<p>Hello! I'm a Dashboard module");*/

/*(		handlers.insert(CENTRALGRAPHS_RESP(), self.handle_resp);
		$("body").delegate(self.config.id_geoipfix_click, "click", self.handle_geoipfix_click);
*/

	     self.navbar = new CoreNavbar({
            socket: self.socket,
            html_base: "#modDashboard-tabs-",
            config_client: self.config_client,
            prefix: "modDashboard-tabs",
            navbar: "modDashboard-navbar_div",
            type: "tabs",
			vertical: true,
            }
        );

        var data = {};
        data.res_msg = self.config.navbar_layout;
        self.navbar.handle_resp(self, data);

	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		//console.log(self.config.mod+"clicked");
	}


	self.handle_resp = function(self, data) {

		//console.log("centralgraphs handle_resp", data);
	}

	self.load();
}
