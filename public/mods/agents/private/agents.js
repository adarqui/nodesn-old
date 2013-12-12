/*
 *
 * Agents module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

/*
		self.x_socket.on('req_modAgents', function(data) {
			self.handle_req_modAgents({data:data});
		});
*/


/*
 * Gather a list of agents from the db, send them to the client
 */


		self.x_b.o.db.query({
			b: self.x_b,
			str: "SELECT * FROM users",
			cb: self.agents_notify,
			xself: self,
			}
		);
			

	}


	self.unload = function() {
	}


	self.agents_notify = function(xself, data) {

		console.log("agents_notify");

		if(data.errors) {
			console.log("agents_notify errors");
			return false;
		}
		

		/*
		 * Need a timeout, because client may not have loaded agents.js yet
		 */
		
		setTimeout( function() {

			/*
			 * ZERO OUT AUTH INFO
			 */
			for(var v in data.rows) {
				data.rows[v].cookie = '';
				data.rows[v].pass = '';
			}

			self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
				op: self.x_b.o.konst.AGENTS_RESP_OP_LIST(),
				data: data.rows,
				}
			)},
			2*1000
		);

	}


	self.resp_modAgents = function(x) {

		var data = x.data;
		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modAgents");
		self.x_socket.emit('resp_modAgents', { res: rs });
	}


	self.handle_req_modAgents = function(x) {

		var data = x.data;

		console.log("handle_req_modAgents");

		self.resp_modAgents({ data: data });
	}

/* end */
self.load();
}
