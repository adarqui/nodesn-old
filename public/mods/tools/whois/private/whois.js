/*
 *
 * Whois module : Private
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

		self.x_socket.on('req_modWhois', function(data) {
			self.handle_req_modWhois({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modWhois = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		//console.log("resp_modWhois");
		self.x_socket.emit('resp_modWhois', { res: rs, data: data });
	}


	self.handle_req_modWhois = function(x) {

		var data = x.data;

		//console.log("handle_req_modWhois", x);

		if(self.x_b.o.misc.isnull(data.host) == true) {
			return false;
		}

		var res = self.x_b.o.whois.query(data.host, function(whois_data) {
			console.log("handle_req_modwhois(2):", whois_data);
			self.resp_modWhois({ data: whois_data });
		});
	}


	self.server_whois = function(x) {
		/*
		 * Function for server to whois
		 */
		
//		console.log("server_whois", x);	

		console.log("ggg3", x.host);

		var res = self.x_b.o.whois.query(x.host, function(whois_data) {
			x.whois_cb({data:whois_data, x:x});
		});
		
	}

/* end */
self.load();
}
