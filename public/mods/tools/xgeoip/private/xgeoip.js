/*
 *
 * XGeoIP Module : private sub-module
 *
 */

module.exports = function(x) {

	var self = this;

//	console.log("FUCKING SOCKET", socket);

	//console.log("FUCKING SOCKET", self.x_socket);

	self.x_b = x.b;
	self.x_socket = x.socket;
	self.bypass = x.bypass;

	self.load = function(x) {

		if(self.bypass == true) {
			return;
		}

		self.x_socket.on('req_modXGeoIP', function(data) { 
			self.handle_req_modXGeoIP({data:data});
		});
	}



	self.unload = function() {
	}



	self.handle_req_modXGeoIP = function(x) {

		var data = x.data;


		if(self.x_b.o.misc.isnull(data.hosts) == false) {
			console.log("GEOIP HOSTS..");
			data.hosts.push('done');
			for( var v in data.hosts) {
				console.log(data.hosts[v]);
				self.handle_req_modXGeoIP_v4({bulk: true, host: data.hosts[v]} );
				if(data.hosts[v] == 'done') {
					setTimeout(function() { self.x_socket.emit('resp_modXGeoIP', { op: 'bulk', host: 'done' }); }, 2000);
				}
			}
		}

		if(self.x_b.o.misc.isnull(data.host) == true) { 
			return self.resp_error( { mod_id: data.mod_id, host: 'null' } ); 
		} 
	

		if(data.host.indexOf(":") > 0) {
			/* V6 */
		}
		else {
			/* V4 */
			self.handle_req_modXGeoIP_v4(data);
		}
	}

	
	self.handle_req_modXGeoIP_v4 = function(data) {
		/* if you pass cb: to this function, it runs in server mode */

		//console.log("XGEOIP", self.x_b.o.geoip);

		console.log(data);


		if(data.bypass == true && self.x_b.o.misc.isnull(data.xgeoip_cb) == true) {
			return false;
		}


		var org = new self.x_b.o.geoip.Org(self.x_b.global_dir + '/GeoIP-src/GeoIPASNum.dat');

		org.lookup(data.host, function(err,res) {

			//console.log("XGEOIP ORG", org, data.host, err, res);
			if(err) {
				console.log("err1: ", err);
			}

			if(data.bypass == true) {
				data.xgeoip_data_org = res;
				data.xgeoip_cb(data);	
			}
			else {
				if(res) {
					self.resp_result( { mod_id: data.mod_id, host: data.host, res: res, subop: 'org', bulk: data.bulk } );
				}
			}
		});


		var country = new self.x_b.o.geoip.Country(self.x_b.global_dir + '/GeoIP-src/GeoIP.dat');

		country.lookup(data.host, function(err,res) {

			//console.log("XGEOIP COUNTRY", country, data.host, err, res);
			if(err) {
				console.log("err2: ", err);
			}

			if(data.bypass == true) {
				data.xgeoip_data_country = res;
				data.xgeoip_cb(data);
			} 
			else {
				if(err) {
					self.resp_error({ mod_id: data.mod_id, host: data.host });
				}

				if(res) {
					self.resp_result({ mod_id: data.mod_id, host: data.host, res: res, subop: 'country', bulk: data.bulk });
				}
			}
		});


		var city = new self.x_b.o.geoip.City(self.x_b.global_dir + '/GeoIP-src/GeoLiteCity.dat');

/*
		var ed = self.x_b.o.geoip.check(self.x_b.global_dir + '/GeoIP-src/GeoLiteCity.dat');
		console.log("ED", ed);
*/

		city.lookup(data.host, function(err, res) {

			//console.log("XGEOIP CITY", city, data.host, err, res);
			if(err) {
				console.log("err3: ", err);
			}


			if(data.bypass == true) {
				data.xgeoip_data_city = res;
				data.xgeoip_cb(data);
			}
			else {
				if(err) {
					self.resp_error({ mod_id: data.mod_id, host: data.host });
				}

				if(res) {
					self.resp_result({ mod_id: data.mod_id, host: data.host, res: res, subop: 'city', bulk: data.bulk });
				}
			}
		});

	}


	self.resp_error = function(x) {

		var host = x.host;
		var mod_id = x.mod_id;

		self.x_socket.emit('resp_modXGeoIP', { op: 'e', mod_id: mod_id, host: host });
	}


	self.resp_result = function(x) {

		var host = x.host;
		var res = x.res;
		var subop = x.subop;
		var mod_id = x.mod_id;
		var bulk = x.bulk;

		self.x_socket.emit('resp_modXGeoIP', { 
			op: 'r', mod_id: mod_id, subop: subop, host: host, res: res , bulk: bulk,
		});
	}


	self.server_xgeoip = function(x) {
//		console.log("server_xgeoip",x);

		x.bypass = true;
		self.handle_req_modXGeoIP_v4(x);
	}

/* end */
self.load();
}
