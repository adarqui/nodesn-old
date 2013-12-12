/*
 *
 * NULL module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modNULL', function(data) {
			self.handle_req_modNULL({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modNULL = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modNULL");
		self.x_socket.emit('resp_modNULL', { res: rs });
	}



	self.handle_req_modNULL = function(x) {

		var data = x.data;
	
		console.log("handle_req_modNULL");

		self.resp_modNULL({ data: data });
	}


/* end */
self.load();
}
