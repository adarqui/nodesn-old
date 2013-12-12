/*
 *
 * NAV module : Private
 *
 */

module.exports = function(x) {

	
	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {
		console.log("nav.js loaded");  
		self.navbar_build_server();
	}



	self.unload = function() {
		console.log("unload");
	}


	self.navbar_build_server = function () {

		for(var v in self.x_b.navbar_layout) {
			console.log(self.x_b.navbar_layout[v]);
		}
		self.x_socket.emit('resp_tabs_navbarResult', { 
				res: 'true', 
				res_msg: self.x_b.navbar_layout ,
				navbar_rid: Math.random()
			}
		);

		return true;
	}

/* end */
self.load();
}
