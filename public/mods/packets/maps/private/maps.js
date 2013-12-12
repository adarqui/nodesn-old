/*
 *
 * Maps module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modMaps', function(data) {
			self.handle_req_modMaps({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modMaps = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modMaps");
		self.x_socket.emit('resp_modMaps', { res: rs });
	}



	self.handle_req_modMaps = function(x) {

		var data = x.data;
	
		console.log("handle_req_modMaps");

		self.resp_modMaps({ data: data });
	}


/* end */
self.load();
}
