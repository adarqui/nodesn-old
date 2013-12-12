/*
 *
 * NMAP module : Private
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

		self.x_socket.on(self.x_b.o.konst.NMAP_REQ(), function(data) {
			self.handle_req_modNMAP({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modNMAP = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		//console.log("resp_modNMAP");
		self.x_socket.emit(self.x_b.o.konst.NMAP_RESP(), { res: rs, data: data, host: x.host });
	}


	self.handle_req_modNMAP = function(x) {

		var data = x.data;

		console.log("handle_req_modNMAP", x);

		if(x.bypass == true && self.x_b.o.misc.isnull(x.nmap_cb) == true) {
			return false;
		}

		if(x.bypass == true) {
			data.host = x.ip;
		}


		console.log("req_modNMAP 2");

/*
		var res = self.x_b.o.NMAP.query(data.host, function(NMAP_data) {
			console.log("handle_req_modNMAP(2):", NMAP_data);

			
			self.resp_modNMAP({ data: NMAP_data });
		});
*/

		if(self.x_b.o.misc.string_issafe(data.host) == false) {
			console.log("dangerous nmap string!");
			return false;
		}

		var nmap_str = "nmap --system-dns -T aggressive -P0 -A ";
		if(self.x_b.o.misc.isnull(x.nmap_xml) == false) {
			nmap_str = nmap_str + "-oX - ";
		}
		nmap_str = nmap_str + data.host;

		var res = self.x_b.o.cproc.exec(nmap_str);

		res.stdout.on('data', function(shell_data) {
			
			console.log("shell_data", shell_data);

			if(self.bypass == true) {
				x.shell_data = shell_data;
				x.nmap_cb(x);
			}
			else {
				self.resp_modNMAP({data: shell_data, host: data.host});
			}

		});

	}


	self.server_nmap = function(x) {
		/*
		 * Function for server to NMAP
		 */
		
//		console.log("server_NMAP", x);	

		console.log("server_nmap ggg3", x.host);

		x.data = {};
		x.host = x.ip;
		x.bypass = true;

		self.handle_req_modNMAP(x);
		
	}

/* end */
self.load();
}
