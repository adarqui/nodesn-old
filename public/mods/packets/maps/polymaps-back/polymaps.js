/*
 *
 * Polymaps module
 *
 */
function modPolymaps(x) {

	var self = this;

	self.name = "Polymaps";
	self.category = "maps";

	self.socket = x.socket;
	self.config_client = x.config_client;

	console.log("WTF3", self.config_client);

	self.config = {
		mod: "mod"+self.name,
		name: self.name,
		class: "mod"+self.name,
		html: "mod"+self.name+"_html",
		id_html: "#"+"mod"+self.name+"_html",
		html_click: "mod"+self.name+"_html_btn",
		h_req: "req_mod"+self.name,
		h_resp: "resp_mod"+self.name,
	};


	self.load = function() {

		console.log("module loaded: Polymaps");

		xxx_add(self);

/*
		$(self.config.id_html).html("<p>Hello! I'm a Polymaps module");
		handlers.insert(self.config.h_resp, self.handle_resp);
*/

	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		console.log(self.config.mod+"clicked");
	}


	self.central = function(data) {

		self.handle_resp(self, data);

	}

	self.handle_resp = function(xself, data) {

		console.log("polymaps handle_resp");

		if(data.op != CENTRALGRAPHS_RESP_OP_GENERATE()) {
			return false;
		}


		switch(data.op_sub) {
			case CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES(): {
				self.handle_resp_generate_countries(data);
				break;
            }
/*
			case CENTRALGRAPHS_RESP_SUBOP_GENERATE_PROTOCOLS(): {
				self.handle_resp_generate_protocols(data);
				break;
			}
			case CENTRALGRAPHS_RESP_SUBOP_GENERATE_DPORT(): {
				self.handle_resp_generate_dport(data);
				break;
			}
*/
			default: {
				break;
			}
		}

	}



	self.handle_resp_generate_countries = function(data) {
		console.log("handle_resp_generate_countries",data);

		var opts = self.simple_array({
			data: data.data
		});

		console.log("WTF", opts.max, opts.array);

/*
		self.simple_pie({
			id		:	"polymaps_countries",
			array	:	opts.array,
			title	:	"Attackers ("+opts.max+") by: Country ("+opts.array.length+")",
			type	:	"Country",
		});
*/
	}

	self.handle_resp_generate_protocols = function(data) {

		console.log("handle_resp_generate_protocols",data);
		
		var opts = self.simple_array({
			data: data.data
		});

/*
		self.simple_pie({
			id		:	"polymaps_protocols",
			array	:	opts.array,
			title	:	"Attackers ("+opts.max+") by: Protocols ("+opts.array.length+")",
			type	:	"Protocol",
		});
*/
	}


	self.handle_resp_generate_dport = function(data) {
		console.log("handle_resp_generate_dport",data);
		var opts = self.simple_array({
			data: data.data
		});

/*
		self.simple_pie({
			id		:	"polymaps_dport",
			array	:	opts.array,
			title	:	"Attackers ("+opts.max+") by: Destination port ("+opts.array.length+")",
			type	:	"Port",
		});
*/
	}


	self.simple_array = function(opts) {

		var formatted_data = [];
		var cc_tot = 0;
		for(var v in opts.data) {
			cc_tot = cc_tot + opts.data[v];
		}

		for(var v in opts.data) {
			formatted_data.push([v, (opts.data[v] / cc_tot) * 100]);
		}

		var opts_new = {
			max: cc_tot,
			array: formatted_data,
		};

		return opts_new;
	}

	
	self.simple_pie = function(opts) {
	}



	self.load();
}
