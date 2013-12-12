/*
 *
 * network module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;

	self.interval = 5;
	self.copy_of_profile = null;

	self.interfaces = {};
	self.interfaces_index = 0;

	self.load = function() {

		console.log("network loaded!");

		self.x_socket.on(self.x_b.o.konst.NETWORK_REQ(), function(data) {
			self.handle_req_modnetwork({data:data});
		});

		self.timer = setInterval(self.timer, self.interval * 1000);
	}


	self.update = function(x) {
/*
		console.log("updated");
		self.x_b = x.b;
		self.x_socket = b.cli_sock;
*/
	}


	self.unload = function() {

		/*
		 * WE __MUST__ REMOVE ALL TIMERS & EVENT LISTENERS
		 */

		clearInterval(self.timer);

		self.x_socket.removeListener(self.x_b.o.konst.NETWORK_REQ(), function() 
			{ console.log("NETWORK_REQ REMOVED"); 
		});

	}


	self.resp_modnetwork = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modnetwork");
		self.x_socket.emit('resp_modnetwork', { res: rs });
	}



	self.handle_req = function(x) {

		/* USER CAN CONTROL POLLING INTERVALS ETC */
		var data = x.data;
	
		console.log("handle_req_modnetwork");

//		self.resp_modnetwork({ data: data });
	}


	self.timer = function() {
		console.log("timer!");

/*
		var networks = self.x_b.o.os.networks();

		console.log(networks);
*/

/*
		self.x_b.o.os_utils.networkUsage(function(data) {
			console.log("networkusage", data);
		});

		self.x_b.o.os_utils.networkFree(function(data) {
			console.log("networkfree", data);
		});
*/

		if(self.copy_of_profile == null && self.x_b.cli_sock.a.profile.profile != null) {
//			self.copy_of_profile = ofkao;
			/*
			 * BUILD OUR NETWORK INTERFACES PROFILE
			 */
			self.copy_of_profile = self.x_b.cli_sock.a.profile.profile;

			var i = 0;
			for ( var v in self.copy_of_profile.interfaces) {
				if(v.indexOf(':') > 0) {
					continue;
				}

				self.interfaces[v] = {
					name: v,
					rxA: 0,
					rxB: 0,
					txA: 0,
					txB: 0,
					index: i,
				};

				/* INTERFACE INDEX FOR GRAPHS */
				i = i+ 1;
			}
	
		}


		//console.log("fm", fm, "tm", tm,  "loadavg1", l1, "loadavg5", l5, "loadavg15", l15, "uptime", su);
		console.log("copy_of_profile", self.copy_of_profile, self.copy_of_profile.platform);

		if(self.copy_of_profile.platform.match(/linux/i) == true) {
			console.log("NOT LINUX");
			return false;
		}



             self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
                    op: self.x_b.o.konst.AGENTS_RESP_OP_NETWORK(),
                    op_sub: self.x_b.o.konst.AGENTS_RESP_SUBOP_NETWORK_BANDWIDTH(),
                    data: self.interfaces,
                });


		self.interface_index++;

		
		for(var v in self.interfaces) {
			var iface = self.interfaces[v];
			console.log("/sys/class/net/"+v+"/statistics/rx_bytes" , iface);
			self.x_b.o.fs.readFile("/sys/class/net/"+v+"/statistics/rx_bytes", (function(err, data) {
				var z = iface;
				return function(err, data) {

					if(err) {
					}

					data = data.toString = parseInt(data);

					z.rxA = z.rxB;
					z.rxB = data;

					console.log("iface2", z);
				}
			}(iface)));
		}

		for(var y in self.interfaces) {
			var iface = self.interfaces[y];
			self.x_b.o.fs.readFile("/sys/class/net/"+y+"/statistics/tx_bytes", (function(err, data) {
				var z = iface;
				return function(err, data) {
					if(err) {
					}
					data = data.toString = parseInt(data);
					z.txA = z.txB;
					z.txB = data;
			
				}
			}(iface)));
		}


	}


/* end */
self.load();
}
