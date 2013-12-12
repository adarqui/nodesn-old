/*
 *
 * NULL module
 *
 */
function modNULL(x) {

	var self = this;

	self.name = "NULL";
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
	};


	self.load = function() {

		//console.log("module loaded: NULL");

		$(self.config.id_html).html("<p>Hello! I'm a NULL module");
		handlers.insert(self.config.h_resp, self.handle_resp);
		/*$("body").delegate(self.config.html_click, "click", self.config.handle_click);*/
	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		//console.log(self.config.mod+"clicked");
	}


	self.handle_resp = function(self, data) {
	}


	self.load();
}
