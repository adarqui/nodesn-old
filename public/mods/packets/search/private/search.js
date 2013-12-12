/*
 *
 * Search module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modSearch', function(data) {
			self.handle_req_modSearch({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modSearch = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modSearch");
		self.x_socket.emit('resp_modSearch', { res: rs });
	}



	self.handle_req_modSearch = function(x) {

		var data = x.data;
	
		console.log("handle_req_modSearch");

		self.resp_modSearch({ data: data });
	}


/* end */
self.load();
}
