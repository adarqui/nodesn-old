/*
 *
 * Highcharts module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modHighcharts', function(data) {
			self.handle_req_modHighcharts({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modHighcharts = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modHighcharts");
		self.x_socket.emit('resp_modHighcharts', { res: rs });
	}



	self.handle_req_modHighcharts = function(x) {

		var data = x.data;
	
		console.log("handle_req_modHighcharts");

		self.resp_modHighcharts({ data: data });
	}


/* end */
self.load();
}
