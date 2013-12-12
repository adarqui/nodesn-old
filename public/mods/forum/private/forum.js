/*
 *
 * Forum module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on(self.x_b.o.konst.FORUM_REQ(), function(data) {
			self.handle_req_modForum({data:data});
		});

/* respond with the current list of notes */
/*
		setTimeout(function() {
			self.handle_req_modForum({ data: {op: self.x_b.o.konst.FORUM_OP_LIST() } });
		}, 1000);
*/

	}


	self.unload = function() {
	}


	self.resp_modForum = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		
		console.log("resp_modForum");
		self.x_socket.emit(self.x_b.o.konst.FORUM_RESP(), { res: rs });
	}



	self.handle_req_modForum = function(x) {

		var data = x.data;

		console.log("handle_req_modForum", x);


		self.resp_modForum({ data: data });
	}



/* end */
self.load();
}
