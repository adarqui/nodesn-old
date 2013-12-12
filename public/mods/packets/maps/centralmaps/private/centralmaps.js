/*
 *
 * CentralMaps module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on(self.x_b.o.konst.CENTRALGRAPHS_REQ(), function(data) {
			self.handle_req_modCentralMaps({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modCentralMaps = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modCentralMaps");
		self.x_socket.emit(self.x_b.o.konst.CENTRALGRAPHS_RESP(), { res: rs });
	}


	

	self.handle_req_modCentralMaps = function(x) {

		var data = x.data;
	
		console.log("handle_req_modCentralMaps");

/*
		self.resp_modCentralMaps({ data: data });
*/

		switch(data.op) {
			case self.x_b.o.konst.CENTRALGRAPHS_REQ_OP_GENERATE(): {
				self.handle_req_modCentralMaps_generate(data);
				break;
			}
			default: {
				break;
			}
		}

	}


	self.handle_req_modCentralMaps_generate = function(x) {

		console.log("modCentralMaps_generate", x);

		var begin = self.x_b.o.misc.mysql_real_escape_string(x.begin);
		var end = self.x_b.o.misc.mysql_real_escape_string(x.end);


		/*
		 * PULL COUNTRIES
		 */
		var mysql_strs = {};
		mysql_strs = {
			countries_str: {
				str: 
					"SELECT xgeoip_country_code, count(*) FROM cap_summary WHERE ts > '"
					+begin+
					"' AND ts < '"
					+end+
					"' GROUP BY xgeoip_country_code ORDER BY count(*)",
				op_sub: self.x_b.o.konst.CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES(),
				type: 'xgeoip_country_code',
			},
			protocols_str: {
				str:
					"SELECT ip_proto, count(*) FROM cap_summary WHERE ts > '"
					+begin+
					"' AND ts < '"
					+end+
					"' GROUP BY ip_proto ORDER BY count(*)",
				op_sub: self.x_b.o.konst.CENTRALGRAPHS_RESP_SUBOP_GENERATE_PROTOCOLS(),
				type: 'ip_proto',
			},
			dport_str: {
				str:
					"SELECT dport, count(*) FROM cap_summary WHERE ts > '"
					+begin+
					"' AND ts < '"
					+end+
					"' GROUP BY dport ORDER BY count(*)",
				op_sub: self.x_b.o.konst.CENTRALGRAPHS_RESP_SUBOP_GENERATE_DPORT(),
				type: 'dport',
			},
		};

		for(var v in mysql_strs) {

			var y = mysql_strs[v];

			self.x_b.o.db.query({
				b: self.x_b,
				str: y.str,
				cb: function(xself, data) {
						console.log("generate");

						if(xself.errors) {
							return false;
						}


var y_z = data.args;

						var new_rows = {};

						for(var kx in data.rows) { 
							console.log(data.rows[kx]); 
							new_rows[data.rows[kx][y_z.type]] = data.rows[kx]['count(*)'];
						}

						self.x_socket.emit(self.x_b.o.konst.CENTRALGRAPHS_RESP(), {
							op: self.x_b.o.konst.CENTRALGRAPHS_RESP_OP_GENERATE(),
							op_sub: y_z.op_sub,
							data: new_rows,
						});


					},
				args: y,
				xself: self,
			});

		}

	}



/* end */
self.load();
}
