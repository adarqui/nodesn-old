/*
 *
 * Traceroute module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;
	self.bypass = x.bypass;


	self.load = function() {

		if(self.bypass == true) {
			return;
		}

		self.x_socket.on('req_modTraceroute', function(data) {
			self.handle_req_modTraceroute({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modTraceroute = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modTraceroute");
		self.x_socket.emit('resp_modTraceroute', { res: rs, data: data });
	}


	self.handle_req_modTraceroute = function(x) {


		if(x.bypass == true && self.x_b.o.misc.isnull(x.traceroute_cb) == true) {
			return false;
		}


		var data = x.data;

		if(x.bypass == true) {
			data.host = x.ip;
		}


		console.log("handle_req_modTraceroute", x);

		var res = self.x_b.o.traceroute.trace(data.host, function(errors, hops) {
			console.log("handle_req_modtraceroute(2):", errors, hops);


			if(errors = null) {
				hops = "ERROR";
			}


			if(x.bypass == true) {
				x.hops = hops;
				x.traceroute_cb(x);
			}

			else {
				self.resp_modTraceroute({ data: hops });
			}


		});
	}


	self.server_traceroute = function(x) {
		console.log("server traceroute");

		x.data = {};
		x.host = x.ip;
		x.bypass = true;
		self.handle_req_modTraceroute(x);

	}

/* end */
self.load();
}
