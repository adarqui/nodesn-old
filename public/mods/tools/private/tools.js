/*
 *
 * Tools module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modTools', function(data) {
			self.handle_req_modTools({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modTools = function(x) {

		var data = x.data;
		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modTools");
		self.x_socket.emit('resp_modTools', { res: rs });
	}


	self.handle_req_modTools = function(x) {

		var data = x.data;

		console.log("handle_req_modTools");

		self.resp_modTools({ data: data });
	}

/* end */
self.load();
}
