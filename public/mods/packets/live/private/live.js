/*
 *
 * Live module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;

	/* DEFAULTS */
	self.config = {
		full: 0,
		summary: 1,
		play_or_stop: self.x_b.o.konst.LIVE_REQ_OP_CAPTURE(),
	};

	self.load = function() {
/*

		self.x_socket.on('req_modpackets', function(data) {
			self.handle_req_modpackets({data:data});
		});
*/

		self.x_socket.on(self.x_b.o.konst.LIVE_REQ(), function(data) {
			self.handle_req(data);
		});
	}


	self.unload = function() {
	}


/*
	self.resp_modpackets = function(x) {

		var data = x.data;

		var rs = self.b.o.misc.get_rand_string2();

		console.log("resp_modpackets");
		self.socket.emit('resp_modpackets', { res: rs });
	}



	self.handle_req_modpackets = function(x) {

		var data = x.data;

		self.resp_modpackets({ data: data });
	}
*/

	self.handle_req = function(x) {
		console.log("live handle_req", x.op, x.op_sub, x, self.x_b.o.konst.LIVE_REQ_OP_CAPTURE());

		switch(x.op) {
			case self.x_b.o.konst.LIVE_REQ_OP_CAPTURE(): {
				self.handle_req_op_capture(x);
				break;
			}
			case self.x_b.o.konst.LIVE_REQ_OP_STATE(): {
				self.handle_req_op_state(x);
				break;
			}
			default: {
				console.log("default");
				break;
			}
		}
	}

	self.handle_req_op_capture = function(x) {
		
		console.log("handle_req_op_capture");

		switch(x.op_sub) {
			case self.x_b.o.konst.LIVE_REQ_CAPTURE_FULL(): {
				self.config.full = 1;
				break;
			}
			case self.x_b.o.konst.LIVE_REQ_CAPTURE_SUMMARY(): {
				self.config.summary = 1;
				break;
			}
			case self.x_b.o.konst.LIVE_REQ_CAPTURE_FULL_OFF(): {
				self.config.full = 0;
				break;
			}
			case self.x_b.o.konst.LIVE_REQ_CAPTURE_SUMMARY_OFF(): {
				self.config.summary = 0;
				break;
			}
			default: {
				break;
			}
		}	

	}

	self.handle_req_op_state = function(x) {
		console.log("handle_req_op_state");
	}


/* end */
self.load();
}
