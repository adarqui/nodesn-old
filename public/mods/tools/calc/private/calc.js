/*
 *
 * Calc module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;
	self.bypass = x.bypass;


	self.load = function() {

		//console.log("wtf");

		if(self.bypass == true) {
			return;
		}

		self.x_socket.on('req_modCalc', function(data) {
			self.handle_req_modCalc({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modCalc = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		//console.log("resp_modCalc");
		self.x_socket.emit('resp_modCalc', { res: rs, data: data });
	}


/* end */
self.load();
}
