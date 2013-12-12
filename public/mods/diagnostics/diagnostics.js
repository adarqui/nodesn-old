/*
 *
 * Diagnostics module
 *
 */
function modDiagnostics(x) {

	var self = this;

	self.name = "Diagnostics";
	self.socket = x.socket;
	self.config_client = x.config_client;

	self.config = {
		mod: "mod"+self.name,
		name: self.name,
		class: "mod"+self.name,
		html: "mod"+self.name+"_html",
		id_html: "#"+"mod"+self.name+"_html",
		html_click: "mod"+self.name+"_html_btn",
		h_req: "req_mod"+self.name,
		h_resp: "resp_mod"+self.name,

		id_generate_click: "#mod"+self.name+"_generate_btn",
		id_geoipfix_click: "#mod"+self.name+"_geoipfix_btn",

		id_sum_claimed_xgeoip: "#mod"+self.name+"_html_summary_claimed_xgeoip",
		id_sum_unclaimed_xgeoip: "#mod"+self.name+"_html_summary_unclaimed_xgeoip",
     id_sum_claimed_whois: "#mod"+self.name+"_html_summary_claimed_whois",
        id_sum_unclaimed_whois: "#mod"+self.name+"_html_summary_unclaimed_whois",
     id_sum_claimed_dns: "#mod"+self.name+"_html_summary_claimed_dns",
        id_sum_unclaimed_dns: "#mod"+self.name+"_html_summary_unclaimed_dns",

     id_sum_claimed_traceroute: "#mod"+self.name+"_html_summary_claimed_traceroute",
        id_sum_unclaimed_traceroute: "#mod"+self.name+"_html_summary_unclaimed_traceroute",
     id_sum_claimed_nmap: "#mod"+self.name+"_html_summary_claimed_nmap",
        id_sum_unclaimed_nmap: "#mod"+self.name+"_html_summary_unclaimed_nmap",

     id_sum_claimed_bgp: "#mod"+self.name+"_html_summary_claimed_bgp",
        id_sum_unclaimed_bgp: "#mod"+self.name+"_html_summary_unclaimed_bgp",




		
	};


	self.load = function() {

		////console.log("module loaded: Diagnostics");

/*
		$(self.config.id_html).html("<p>Hello! I'm a Diagnostics module");
*/

		handlers.insert(self, DIAGNOSTICS_RESP(), self.handle_resp);

		$('body').delegate(self.config.id_generate_click, 'click', self.handle_generate_click);
		$("body").delegate(self.config.id_geoipfix_click, "click", self.handle_geoipfix_click);

		self.handle_generate_click();
	
		////console.log("FUCKME", DIAGNOSTICS_RESP());
	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		////console.log(self.config.mod+"clicked");
	}


	self.handle_generate_click = function() {
		////console.log("handle_generate_click");
		self.socket.emit(DIAGNOSTICS_REQ(), {
			op: DIAGNOSTICS_REQ_OP_GENERATE(),
			op_sub: DIAGNOSTICS_REQ_SUBOP_GENERATE_NONE(),
		});
	}

	self.handle_geoipfix_click = function() {
		////console.log("handle_geoip_click");
	}




	self.handle_resp = function(self, data) {

		////console.log("self.handle_resp");

		if(data.op != DIAGNOSTICS_RESP_OP_GENERATE()) { 
			return false;
		}


		switch(data.op_sub) {
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_UNCLAIMED(): {
				////console.log("xgeoip_unclaimed");
				$(self.config.id_sum_unclaimed_xgeoip).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_CLAIMED(): {
				////console.log("xgeoip_claimed");
				$(self.config.id_sum_claimed_xgeoip).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_UNCLAIMED(): {
				////console.log("dns_unclaimed");
				$(self.config.id_sum_unclaimed_dns).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_CLAIMED(): {
				////console.log("dns_claimed");
				$(self.config.id_sum_claimed_dns).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_UNCLAIMED(): {
				////console.log("whois_unclaimed");
				$(self.config.id_sum_unclaimed_whois).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_CLAIMED(): {
				//console.log("whois_claimed");
				$(self.config.id_sum_claimed_whois).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_UNCLAIMED(): {
				//console.log("traceroute_unclaimed");
				$(self.config.id_sum_unclaimed_traceroute).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_CLAIMED(): {
				//console.log("traceroute_d");
				$(self.config.id_sum_claimed_traceroute).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_UNCLAIMED(): {
				//console.log("nmap_unclaimed");
				$(self.config.id_sum_unclaimed_nmap).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_CLAIMED(): {
				//console.log("nmap_claimed");
				$(self.config.id_sum_claimed_nmap).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_UNCLAIMED(): {
				//console.log("bgp_unclaimed");
				$(self.config.id_sum_unclaimed_bgp).text(data.data);
				break;
			}
			case DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_CLAIMED(): {
				//console.log("bgp_claimed");
				$(self.config.id_sum_claimed_bgp).text(data.data);
				break;
			}
 

			default: {
				break;
			}
		}

	}

	self.handle_geoipfix_click = function() {
		//console.log("handle_geoipfix_click");

		self.socket.emit(DIAGNOSTICS_REQ(), {
			op: DIAGNOSTICS_REQ_OP_FIX(),
			op_sub: DIAGNOSTICS_REQ_SUBOP_FIX_XGEOIP(),
			}
		);

	}


	self.load();
}
