/*
 *
 * Central module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

/*
		self.x_socket.on('req_modCentral', function(data) {
			self.handle_req_modCentral({data:data});
		});
*/

	}


	self.unload = function() {
	}


/*
	self.resp_modCentral = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modCentral");
		self.x_socket.emit('resp_modCentral', { res: rs });
	}



	self.handle_req_modCentral = function(x) {

		var data = x.data;
	
		console.log("handle_req_modCentral");

		self.resp_modCentral({ data: data });
	}
*/



/* end */
self.load();
}
