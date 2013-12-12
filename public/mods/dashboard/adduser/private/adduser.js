/*
 *
 * AddUser module : Private
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

		self.x_socket.on('req_modAddUser', function(data) {
			self.handle_req_modAddUser({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modAddUser = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		//console.log("resp_modAddUser");
		self.x_socket.emit('resp_modAddUser', { res: rs, data: data });
	}


	self.handle_req_modAddUser = function(x) {

		var data = x.data;

		//console.log("handle_req_modAddUser", x);

		if(self.x_b.o.misc.isnull(data.host) == true) {
			return false;
		}

		var res = self.x_b.o.adduser.query(data.host, function(adduser_data) {
			console.log("handle_req_modadduser(2):", adduser_data);
			self.resp_modAddUser({ data: adduser_data });
		});
	}


	self.server_adduser = function(x) {
		/*
		 * Function for server to adduser
		 */
		
//		console.log("server_adduser", x);	

		console.log("ggg3", x.host);

		var res = self.x_b.o.adduser.query(x.host, function(adduser_data) {
			x.adduser_cb({data:adduser_data, x:x});
		});
		
	}

/* end */
self.load();
}
