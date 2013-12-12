if(typeof exports === 'undefined') exports = [];

/*
 * This creates navbar's and/or pulls in modules
 */

function CoreNavbar(x) {

	var self = this;
	self.socket = x.socket;
	self.html_base = x.html_base;
	self.config_client = x.config_client;

	/*
	 * This is the main navbar container, usually a div etc
	 */
	self.navbar = x.navbar;
	self.navbar_id = '#'+self.navbar;

	/*
	 * Prefixes, such as "tabs", so the code can create #tabs-XXX etc
	 */
	self.prefix = x.prefix;
	self.prefix_id = '#'+self.prefix+'-';

	/*
	 * Types: tabs, accordion, none
	 */
	self.type = x.type;
	
/*
	self.prolog = cb_prologue;
	self.epilog = cb_epilogue;
*/
	self.vertical = x.vertical;

	self.load = function() {

		//console.log("errrr", self.config_client);

		handlers.insert(self, "resp_tabs_navbarResult", self.handle_resp);
	}

	self.unload = function() {
	}


	navbar_handle_pull = function(id, self) {

		var mod_id = Math.floor(Math.random() * 65535355);

		if(!id) return false;

		if(isnull($(id + "_container")) == true) {
			return false;
		}

		var nav = self.config_client.navbar[id];

		if(isnull(nav.html) || isnull(nav.css) || isnull(nav.js)) {
			return false;
		}

		//console.log("pulling", nav);

		if(nav.hidden == "false") {
		}

		/*
		 * PULL CSS
		 */
		var y = $.get(nav.css, function(data) {
			data = data.replace(/{MOD_ID}/g, mod_id);
			//console.log("GRRRRR", self.config_client.navbar);
			//self.config_client.navbar[id].css_data = data;

			$('head').append('' + '<style type="text/css" charset="utf-8">' + data + '</style>' + '');

			/*
			 * PULL HTML
			 */
			var x = $.get(nav.html, function(data) {
				data = data.replace(/{MOD_ID}/g, mod_id);
				
				//self.config_client.navbar[id].html_data = data;

				if(self.type == "tabs") {
					$(self.prefix_id + nav.mod).html(data);
				}
				else if(self.type == "accordion") {
					$(self.prefix_id + nav.mod + "-accordion").html(data);
					//console.log("poop2", self.prefix_id + nav.mod + "-accordion");
				}

				/*
				 * PULL JAVASCRIPT
				 */
				var z = $.getScript(nav.js, function(data) {

					//self.config_client.navbar[id].js_data = data;

					str = 'mod_' + nav.menu + '_' + mod_id + ' = new mod' + nav.menu + '({' +
						'nav_tab: "' + id + '", ' +
						'socket: socket,' +
						'mod_id: ' + mod_id + ',' +
						'config_client: self.config_client,' +
						'nav: nav' +
						'})';

					//console.log("GRAND", str);

					eval(str);
					//console.log("eval'd",str);
				});
			});
		});
	}


	self.handle_resp_accordion = function(self, data) {

		//console.log("derp5",data);

		var text_body = "";
		var text_tabs = '<div id="'+self.prefix+'">';
		var a_class = "";

		//console.log("derp4", self.config_client);

		self.config_client.navbar_layout = data.res_msg.navMenu;
		self.config_client.navbar = {};

		for(var x in data.res_msg.navMenu)  {

			//console.log("menu item:", data.res_msg.navMenu[x], x);

			data_x = data.res_msg.navMenu[x];

			a_idx = data_x.href.replace(/#/g, '');

			text_tabs =
				text_tabs + '<h3 id="'+self.prefix_id+'" class="'+self.prefix+'">'+data_x.mod+'</h3>';

			/* setup the linear navbar config */
			self.config_client.navbar[x] = data_x;
			//console.log("FUCK2");

			/* setup skeleton text body */
			text_tabs = text_tabs +
				'<div><p id="'+self.prefix+'-' + data_x.mod + '-accordion"></p></div>';

			/* pull the module in */
			if(data_x.pull == "false") {
				//console.log("DIDNT PULL");
			}
			else {
				navbar_handle_pull(x, self);
			}

			//console.log("poop", data_x.mod);
		}

		/* END TABS DIV */
		text_tabs = text_tabs + '</div>';

		$(self.navbar_id).html(text_tabs);

		//console.log("derp5");
		$(function() {
			$( "#"+self.prefix ).accordion();
		});
	}


	self.handle_resp_tabs = function(self, data) {
	
		//console.log("derp4", data);

		var text_body = "";
		var text_tabs = '<div id="'+self.prefix+'"><ul>';
		var a_class = "";

		self.config_client.navbar_layout = data.res_msg.navMenu;
		self.config_client.navbar = {};

		for(var x in data.res_msg.navMenu)  {

			//console.log("menu item:", data.res_msg.navMenu[x], x);

			data_x = data.res_msg.navMenu[x];

			a_idx = data_x.href.replace(/#/g, '');

			text_tabs = 
				text_tabs + '<li><a class="'+self.prefix+'" href="' + self.prefix_id + data_x.mod + '">' + data_x.mod + '</a>';

			/* setup the linear navbar config */
			self.config_client.navbar[x] = data_x;
			//console.log("FUCK2");

			text_tabs = text_tabs + '</li>';

			/* setup skeleton text body */
			text_body = text_body + 
				'<div id="'+self.prefix+'-' + data_x.mod + '">' + a_idx + '</div>';


			/* pull the module in */
			if(data_x.pull == "false") {
				//console.log("DIDNT PULL");
			}    
			else {
				navbar_handle_pull(x, self);
			}

			//console.log("poop", data_x.mod);
		}

		/* END MENU */
		text_tabs = text_tabs + '</ul>';

		/* END TABS DIV */
		text_tabs = text_tabs + text_body + '</div>';

		$(self.navbar_id).html(text_tabs);

		$(function() {
			$( "#"+self.prefix ).tabs();
		});

		if(self.vertical == true) {
			/* 
			 * THIS WILL MAKE TABS ON THE LEFT, VERTICAL
			 */
			$( "#"+self.prefix ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
			$( "#"+self.prefix+" li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

		}

/* FUNK */
/*
$("#"+self.prefix).addClass("ui-tabs-vertical ui-helper-clearfix");
$("#"+self.prefix+" li").removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
*/


		//console.log("navbar_handle_resp_tabs:", self.prefix, self.prefix_id, self.html_base);
	}


	self.handle_resp = function(xself, data) {
		//console.log("navbar: handle_resp", data, self.config_client);
		//console.log("navbar", self.config_client.navbar_pulled);
		if(data.res == "true" ) {
			/* this is the navbar sent from the server */
			self.config_client.navbar_raw = data.res_msg;
		}

		if(data.navbar_rid == undefined) {
			/* weird */
			data.navbar_rid = self.config_client.navbar_rid;
		}

		if(self.config_client.navbar_rid == 0) {
			self.config_client.navbar_rid = data.navbar_rid;
		}


		if(data.navbar_rid != self.config_client.navbar_rid) {
			//console.log("already connected", data, data.navbar_rid, self.config_client.navbar_rid);
			return false;
		}
/*
		if(self.config_client.navbar_pulled == 1) {
			 we've already connected before, no need to pull in the navbar & it's modules 
			//console.log("we've already connected before", self.config_client.navbar_pulled);
			return false;
		}
*/

		if(self.type == "tabs") {
			self.handle_resp_tabs(self,data);
		}
		else if(self.type == "accordion") {
			self.handle_resp_accordion(self,data);
		}

		self.config_client.navbar_pulled = 1;
	}



	self.load();
}

