/*
 *
 * Packets module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modPackets', function(data) {
			self.handle_req_modPackets({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modPackets = function(x) {

		var data = x.data;
		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modPackets");
		self.x_socket.emit('resp_modPackets', { res: rs });
	}


	self.handle_req_modPackets = function(x) {

		var data = x.data;

		console.log("handle_req_modPackets");

		self.resp_modPackets({ data: data });
	}

/* end */
self.load();
}
