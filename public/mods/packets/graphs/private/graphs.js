/*
 *
 * Graphs module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modGraphs', function(data) {
			self.handle_req_modGraphs({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modGraphs = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modGraphs");
		self.x_socket.emit('resp_modGraphs', { res: rs });
	}



	self.handle_req_modGraphs = function(x) {

		var data = x.data;
	
		console.log("handle_req_modGraphs");

		self.resp_modGraphs({ data: data });
	}


/* end */
self.load();
}
