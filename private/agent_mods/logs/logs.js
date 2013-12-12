/*
 *
 * logs module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;
	self.watcher = {};


	self.load = function() {

		self.x_socket.on(self.x_b.o.konst.LOGS_REQ(), function(data) {
			self.handle_req({data:data});
		});

//		self.logs_alert_csv();
	}


	self.unload = function() {
		//self.watcher.close();

	}


	self.resp_modlogs = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modlogs");
		self.x_socket.emit('resp_modlogs', { res: rs });
	}



	self.handle_req = function(x) {

		console.log("logs handle_req",x, self.x_b.o.konst.LOGS_REQ_OP_MONITOR());

		x = x.data;
		
		switch(x.op) {
			case self.x_b.o.konst.LOGS_REQ_OP_MONITOR(): {
				self.handle_req_monitor(x);
				break;
			}
			default: {
				break;
			}
		}

	}


	self.handle_req_monitor = function(x) {

		console.log("handle_req_monitor");

		var data = x.data.split(',');
	
		console.log("handle_req_monitor", x);


		
		for(var v in data) {
/*
console.log("v = ", v);
     self.watcher[v] = self.x_b.o.tailfd(data[v], function(line,tailinfo) {
            console.log("handle_req_monitor, log data", line, tailinfo);
            self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
                op: self.x_b.o.konst.AGENTS_RESP_OP_LOGS(),
				file: "bleh",
                data: line,
       	     });

    	    });
*/

	self.watcher[v] = self.x_b.o.tailfd(data[v], (function(line, tailinfo) {
			var v_file = data[v];
			return function(line, tailinfo) {
				self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
					op: self.x_b.o.konst.AGENTS_RESP_OP_LOGS(),
					file: v_file,
					data: line,
				});
			}

		}(v)));

		}

//		self.resp_modlogs({ data: data });
	}


	self.logs_alert_csv = function() {

		console.log("logs_aert_csv");

		/*
		 * WATCH THIS FILE CONSTANTLY!
		 */
/*
		self.watcher = self.x_b.o.tailfd(self.x_b.agent_config.logs_alerts.file, function(data,tailinfo) {
			console.log("logs_alert_csv", data);

			self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
				op: self.x_b.o.konst.AGENTS_RESP_OP_LOGS(),
				data: data,
			});

			
		});
*/


	}

/* end */
self.load();
}
