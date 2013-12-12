/*
 *
 * Dashboard module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modDashboard', function(data) {
			self.handle_req_modDashboard({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modDashboard = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modDashboard");
		self.x_socket.emit('resp_modDashboard', { res: rs });
	}



	self.handle_req_modDashboard = function(x) {

		var data = x.data;
	
		console.log("handle_req_modDashboard");

		self.resp_modDashboard({ data: data });
	}


/* end */
self.load();
}
