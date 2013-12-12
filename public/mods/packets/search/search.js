/*
 *
 * Search module
 *
 */
function modSearch(x) {

	self = this;

	var a = x.nav_tab;
	var b = x.socket;

	this.name = "Search";
	this.socket = b;

	this.config = {
		mod: "mod"+this.name,
		name: this.name,
		class: "mod"+this.name,
		html: "mod"+this.name+"_html",
		id_html: "#"+"mod"+this.name+"_html",
		html_click: "mod"+this.name+"_html_btn",
		h_req: "req_mod"+this.name,
		h_resp: "resp_mod"+this.name,
	};


	this.load = function() {

		console.log("module loaded: Search");

		$(this.config.id_html).html("<p>Hello! I'm a Search module");
		handlers.insert(this.config.h_resp, this.handle_resp);
		/*$("body").delegate(this.config.html_click, "click", this.config.handle_click);*/
	}

	this.unload = function() {
		handlers.remove(this.config.h_resp, this.handle_resp);
	}


	this.handle_click = function() {
		console.log(this.config.mod+"clicked");
	}


	this.handle_resp = function(self, data) {
	}


	this.load();
}
