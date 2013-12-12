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

	//console.log("WTF3", self.config_client);

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



	self.poly = {};
	self.poly.polymaps_path = "/mods/packets/maps/polymaps/";
	self.poly.po = org.polymaps;
	self.poly.map = {};
	self.poly.e = {};



	self.load = function() {

		//console.log("module loaded: Polymaps");

		xxx_add(self);

/*
		$(self.config.id_html).html("<p>Hello! I'm a Polymaps module");
*/
		handlers.insert(self, CENTRALGRAPHS_RESP(), self.handle_resp);

		self.poly.map = self.poly.po.map()
			.container(document.getElementById("modPolymaps_map").appendChild(self.poly.po.svg("svg")))
			.center({lat: 120, lon: -95})
			.zoomRange([1, 4])
			.zoom(1)
			.add(self.poly.po.interact());

		self.poly.map.add(self.poly.po.geoJson()
			.url(self.poly.polymaps_path+"world.json")
			.tile(false)
			.zoom(3)
			.on("load", self.poly.load));

		self.poly.map.add(self.poly.po.compass()
			.pan("none"));

//		self.poly.map.container().setAttribute("class", "YlOrRd");
		self.poly.map.container().setAttribute("class", "Reds");


	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		//console.log(self.config.mod+"clicked");
	}


	self.central = function(data) {

		self.handle_resp(self, data);

	}

	self.handle_resp = function(xself, data) {

		//console.log("polymaps handle_resp");

		if(data.op != CENTRALGRAPHS_RESP_OP_GENERATE()) {
			return false;
		}


		switch(data.op_sub) {
			case CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES_NAME(): {
				self.handle_resp_generate_countries_name(data);
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



	self.handle_resp_generate_countries_name = function(data) {
		//console.log("polymaps, handle_resp_generate_countries_name",data);

		/*
		 * Set this for when polymaps reloads the data, when you're dragging the map
		 */
		self.poly.countries_name = data.data;


		var opts = self.simple_kv({
			data: data.data
		});

		//console.log("polymaps, WTF", opts.max, opts.kv, opts);


		for (var i = 0; i < self.poly.e.features.length; i++) {
			var feature = self.poly.e.features[i],

			n = feature.data.properties.name;

			var z = opts.kv[n];

			if(z == undefined) {
				continue;
			}

			v = z;

//console.log("feature",feature);
////console.log("class", isNaN(v) ? null : "q" + (~~(v * 9)+1) + "-" + 9);

			n$(feature.element)
			.attr("class", isNaN(v) ? null : "q" + (~~(v * 9)+2) + "-" + 9)
			.add("svg:title")
			.text(n + (isNaN(v) ? "" : ":  " + self.percent(v)));
		}

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

		//console.log("handle_resp_generate_protocols",data);
		
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
		//console.log("handle_resp_generate_dport",data);
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


	self.simple_kv = function(opts) {

		var formatted_data = {};
		var cc_tot = 0;
		for(var v in opts.data) {
			cc_tot = cc_tot + opts.data[v];
		}

		for(var v in opts.data) {
			formatted_data[v] = (opts.data[v] / cc_tot);
		}

		var opts_new = {
			max: cc_tot,
			kv: formatted_data,
		};

		return opts_new;
	}

	
	self.simple_pie = function(opts) {
	}



	self.poly.load = function(e) {
		self.poly.e = e;

		if(self.poly.countries_name) {
			self.handle_resp_generate_countries_name({data:self.poly.countries_name});		
		}

	}

	self.percent = function(v) {
		return (v * 100).toPrecision(Math.min(2, 2 - Math.log(v) / Math.LN2)) + "%";
	}


	self.load();
}
