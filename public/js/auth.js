/*
 * This handles client/server auth
 */

function CoreAuth(x) {

	var self = this;
	self.socket = x.socket;
	self.config_client = x.config_client;

	self.load = function() {

		console.log("coreAuth loaded");

		self.config_client.handlers.insert(self, AUTH_RESP(), self.handle_resp);
/*		self.config_client.handlers.insert(self, "resp_login", self.handle_resp); */
	}

	self.unload = function() {
	}


	self.handle_resp = function(selfx, data) {

		console.log("auth handle_resp");

		switch(data.op) {
			case AUTH_RESP_OP_NEED_LOGIN(): {
				console.log("auth need_login");
				self.handle_need(selfx, data);
				break;
			}
			default: {
				break;
			}
		}
	}


	self.handle_need = function(selfx, data) {
		console.log("handle_need",data);

		if(self.config_client.authenticated == STATE_AUTHENTICATED()) {
			self.config_client.login.load();
			return false;
		}

		data.data = replace_nl_with_br(data.data);
		console.log("handle_need", data.data);

		$("#login_stuff").html(data.data);
	}

/*
	self.handle_resp = function(selfx, data) {
		console.log("handle_resp");
	}
*/

	self.load();
}
