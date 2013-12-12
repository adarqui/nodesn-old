/*
 *
 * Diagnostics module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on(self.x_b.o.konst.DIAGNOSTICS_REQ(), function(data) {
			self.handle_req_modDiagnostics({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modDiagnostics = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modDiagnostics");
		self.x_socket.emit(self.x_b.o.konst.DIAGNOSTICS_RESP(), { res: rs });
	}



	self.handle_req_modDiagnostics = function(x) {

		var data = x.data;
	
		console.log("handle_req_modDiagnostics");

/*
		if(data.op == self.x_b.o.konst.DIAGNOSTICS_REQ_OP_GENERATE()) {
			self.handle_req_modDiagnostics_op_generate(data);		
		}
*/

		switch(data.op) {
			case self.x_b.o.konst.DIAGNOSTICS_REQ_OP_GENERATE(): {
				self.handle_req_modDiagnostics_op_generate(data);
				break;
			}
			case self.x_b.o.konst.DIAGNOSTICS_REQ_OP_FIX(): {
				self.handle_req_modDiagnostics_op_fix(data);
				break;
			}
			default: {
				break;
			}
		}

//		self.resp_modDiagnostics({ data: data });
	}


	self.handle_req_modDiagnostics_op_fix = function(x) {
		console.log("handle_req_modDiagnostics_op_fix",x);

		switch(x.op_sub) {
			case self.x_b.o.konst.DIAGNOSTICS_REQ_SUBOP_FIX_XGEOIP(): {
				self.handle_req_modDiagnostics_subop_fix_xgeoip(x);
				break;
			}
			default: {
				break;
			}
		}

		
	}



	self.handle_req_modDiagnostics_subop_fix_xgeoip = function(x) {
	
		var mysql_str = 
			"SELECT * from cap_summary WHERE xgeoip_asnum IS NULL";

			self.x_b.o.db.query({
				b: self.x_b,
				str: mysql_str, 
				cb: function(xself, data) {
						var rows = data.rows;
						for(var v in rows) {
							console.log("FUCK");
							xself.x_b.o.pcap_subs.cb_xgeoip({
								id: rows[v].id,
								ip: rows[v].ip_saddr,
								summary: rows[v],
							});	
						}
					},
				xself: self,
			});
			
/*
       self.c.o.pcap_subs.cb_xgeoip({
                id: self.summary.id, ip: self.summary.ip_saddr, summary: self.summary
            });
*/
	
	}




	self.handle_req_modDiagnostics_op_generate = function(x) {

		/*
		 * THIS ROUTINE generates the unclaimed/claimed stats for the diagnostics page
		 */
		console.log("handle_req_modDiagnostics_op_generate");

		var mysql_strs = { 
			xgeoip_unclaimed: { 
				str: "SELECT count(*) FROM cap_summary WHERE xgeoip_asnum IS NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_UNCLAIMED(),
			},
			xgeoip_claimed: {
				str: "SELECT count(*) FROM cap_summary WHERE xgeoip_asnum IS NOT NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_CLAIMED(),
			},
			dns_unclaimed: {
				str: "SELECT count(*) FROM cap_summary WHERE dns_host IS NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_UNCLAIMED(),
			},
			dns_claimed: {
				str: "SELECT count(*) FROM cap_summary WHERE dns_host IS NOT NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_CLAIMED(),
			},
			whois_unclaimed: {
				str: "SELECT count(*) FROM cap_summary WHERE whois_ip IS NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_UNCLAIMED(),
			},
			whois_claimed: {
				str: "SELECT count(*) FROM cap_summary WHERE whois_ip IS NOT NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_CLAIMED(),
			},
			traceroute_unclaimed: {
				str: "SELECT count(*) FROM cap_summary WHERE traceroute IS NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_UNCLAIMED(),
			},
			traceroute_claimed: {
				str: "SELECT count(*) FROM cap_summary WHERE traceroute IS NOT NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_CLAIMED(),
			},
			nmap_unclaimed: {
				str: "SELECT count(*) FROM cap_summary WHERE nmap IS NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_UNCLAIMED(),
			},
			nmap_claimed: {
				str: "SELECT count(*) FROM cap_summary WHERE nmap IS NOT NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_CLAIMED(),
			},
			bgp_unclaimed: {
				str: "SELECT count(*) FROM cap_summary WHERE bgp IS NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_UNCLAIMED(),
			},
			bgp_claimed: {
				str: "SELECT count(*) FROM cap_summary WHERE bgp IS NOT NULL",
				op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_CLAIMED(),
			},
    
		};



    



		for(var v in mysql_strs) {

			var y = mysql_strs[v];

			self.x_b.o.db.query({
				b: self.x_b,
				str: y.str,
				cb: function(xself, data) {

						if(data.errors) {
							return false;
						}

var y_z = data.args;

						var rows = data.rows;
						console.log(y_z.str, rows);
						var row = rows[0];
						console.log("omg",row);
						self.x_socket.emit(self.x_b.o.konst.DIAGNOSTICS_RESP(), {
								op: self.x_b.o.konst.DIAGNOSTICS_RESP_OP_GENERATE(),
								op_sub: y_z.op_sub,
								data: row['count(*)'], 
							}
						);
					},
				args: y,
				xself: self,
			});

		}


/*
		mysql_str = "SELECT count(*) FROM cap_summary WHERE xgeoip_asnum IS NOT NULL";

		self.x_b.o.db.query({
			b: self.x_b,
			str: mysql_str,
			cb: function(xself, data) {
					var rows = data.rows;
					var row = rows[0];
					self.x_socket.emit(self.x_b.o.konst.DIAGNOSTICS_RESP(), {
							op: self.x_b.o.konst.DIAGNOSTICS_RESP_OP_GENERATE(),
							op_sub: self.x_b.o.konst.DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_CLAIMED(),
							data: row['count(*)'],
						}
					);
				},
			xself: self,
		});


		mysql_str = "SELECT count(*) FROM cap_summary WHERE dns_host IS NULL";
*/

	}

/* end */
self.load();
}
