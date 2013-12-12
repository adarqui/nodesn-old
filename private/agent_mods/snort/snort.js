/*
 *
 * snort module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;
	self.watcher = null;


	self.load = function() {

		self.x_socket.on(self.x_b.o.konst.SNORT_REQ(), function(data) {
			self.handle_req_modsnort({data:data});
		});

		self.snort_alert_csv();
	}


	self.unload = function() {
		self.watcher.close();

	}


	self.resp_modsnort = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modsnort");
		self.x_socket.emit('resp_modsnort', { res: rs });
	}



	self.handle_req_modsnort = function(x) {

		var data = x.data;
	
		console.log("handle_req_modsnort");

		self.resp_modsnort({ data: data });
	}


	self.snort_alert_csv = function() {

		console.log("snort_aert_csv");

		/*
		 * WATCH THIS FILE CONSTANTLY!
		 */

		self.watcher = self.x_b.o.tailfd(self.x_b.agent_config.snort_alerts.file, function(data,tailinfo) {
			console.log("snort_alert_csv", data);

			self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
				op: self.x_b.o.konst.AGENTS_RESP_OP_SNORT(),
				data: data,
			});

			
		});


	}

/* end */
self.load();
}
