/*
 *
 * Tools module : XGeoIP sub module
 *
 */

var modXGeoIP = function(opts) {

	var self = this;

	self.config_client = opts.config_client;

	self.name = "XGeoIP";
	self.category = "tools";

	self.socket = opts.socket;
	self.mod_id = opts.mod_id;
	//self.nav = opts.nav;
	self.queue_input = [];

	self.bulk_storage = {},

	self.config = {
    	mod: "mod"+self.name,
    	name: self.name,
    	class: "mod"+self.name,
    	html: "mod"+self.name+"_html",
		id_html: "#mod"+self.name+"_html",
    	nav_tab: "mod"+self.name+"-tabs-"+self.name.toLowerCase(),
		nav_tab_id: "#mod"+self.name+"-tabs-"+self.name.toLowerCase(),

    	h_req: "req_mod"+self.name,
    	h_resp: "resp_mod"+self.name,
	};

	self.str = {
		html: "#modXGeoIP_html",
    	input: "#modXGeoIP_html_div_input",
		input_input: "#modXGeoIP_html_div_input_input",
		input_send: "#modXGeoIP_html_div_input_send",

		input_bulk_ta: "#modXGeoIP_html_div_input_bulk_ta",
		input_bulk_send: "#modXGeoIP_html_div_input_bulk_send",

		output_bulk: "#modXGeoIP_html_div_output_bulk",
		output_bulk_table: "#modXGeoIP_html_div_output_bulk_table",

		output: "#modXGeoIP_html_div_output",
		output_host: "#modXGeoIP_html_div_output_host",
		output_table: "#modXGeoIP_html_div_output_table",
		output_country: "#modXGeoIP_html_div_output_country",
		output_name: "#modXGeoIP_html_div_output_name",
		output_org: "#modXGeoIP_html_div_output_org",

		output_city: "#modXGeoIP_html_div_output_city",
		output_city_region: "#modXGeoIP_html_div_output_city_region",
		output_city_postal_code: "#modXGeoIP_html_div_output_city_postal_code",
		output_city_latitude: "#modXGeoIP_html_div_output_city_latitude",
		output_city_longitude: "#modXGeoIP_html_div_output_city_longitude",
		output_city_continent_code: "#modXGeoIP_html_div_output_city_continent_code",
		output_city_time_zone: "#modXGeoIP_html_div_output_city_time_zone",

	};


	self.wrapid = function(str) {
    	str = str.replace(/#/g, '');
    	return '#' + self.mod_id + '_' + str;
	}


	self.wrapstrs = function() {
    	for (var v in self.str) {
        	self.str[v] = self.wrapid(self.str[v]);
    	}
	}


	self.load = function() {

		xxx_add(self);

/*
		$('body').delegate(self.str.nav_tab_id, 'click',
			function(data) { self.handle_nav_click(self, data); });
*/

    	$('body').delegate(self.str.input_input,'keydown',
			function(data) { self.handle_input(self, data); });

		$('body').delegate(self.str.input_send, 'click',
			function(data) { self.handle_click(self,data); });

		$('body').delegate(self.str.input_input, 'dblclick',
			function(data) { self.handle_dblclick(self, data); });


		/* bulk */
        $('body').delegate(self.str.input_bulk_send, 'click',
            function(data) { self.handle_bulk_click(self,data); });

        $('body').delegate(self.str.input_bulk_ta, 'dblclick',
            function(data) { self.handle_bulk_dblclick(self, data); });



/*
		$('body').delegate(self.str.html, 'click', function(data) { 
				$('#modXGeoIP_html_div_input_input').focus(); });
*/

    	handlers.insert(self, "resp_modXGeoIP", self.handle_resp);

		self.queue_input = new Queue( { max: 100, dups: false } );

		console.log("Module loaded: XGeoIP");
	}


	self.unload = function() {
    	$(self.str.input_input).unbind('keypress');
		$(self.str.input_send).unbind('click');	
	}


	self.central = function(opts) {
		/*
		 * This is used by central to coordinate tools
		 */
		
		$(self.str.input_input).val(opts.host);
		self.handle_click(self, null);
	}


	self.central_clear = function(opts) {
		/*
		 * This is used by central to clear data for every sub-tool
		 */
		self.handle_dblclick(self, null);
		self.handle_bulk_dblclick(self, null);
	}



	self.handle_resp = function(xself, data) {

		console.log("data", data);

/* bulk stuff */
		if(data.op == 'bulk' && data.host == 'done') {
			for(var v in self.bulk_storage) {
//				$(self.str.output_bulk).html('');
//				$(self.str.output_bulk).append('<p>'+JSON.stringify(self.bulk_storage[v])+'</p>');
				var host = self.bulk_storage[v];

				console.log("FUCK", host);

/*
host.country = {};
host.city = {};
host.org = {};
*/


/*
				if(isnull(host[country]) == true) { host.country = { res: {} } };
				if(isnull(host[city]) == true) { host.city = { res: {} } };
				if(isnull(host[org]) == true) { host.org = { res: {} }};
*/


                if(host.country == undefined) { host.country = { res: {} } };
                if(host.city == undefined) { host.city = { res: {} } };
                if(host.org == undefined) { host.org = { res: {} }};

				var country_code = host.country.res.country_code;
				var country_name = host.country.res.country_name;
				var org = host.org.res;
				var city = host.city.res.city;
				var region = host.city.res.region;
				var postal_code = host.city.res.postal_code;
				var latitude = host.city.res.latitude;
				var longitude = host.city.res.longitude;
				var continent_code = host.city.res.continent_code;
				var time_zone = host.city.res.time_zone;
				$(self.str.output_bulk_table).append(
					'<tr>'
					+'<td>'+country_code+'</td>'
					+'<td>'+country_name+'</td>'
					+'<td>'+org+'</td>'
					+'<td>'+city+'</td>'
					+'<td>'+region+'</td>'
					+'<td>'+postal_code+'</td>'
					+'<td>'+latitude+'</td>'
					+'<td>'+longitude+'</td>'
					+'<td>'+continent_code+'</td>'
					+'<td>'+time_zone+'</td>'
					+'</tr>'
				);
			}
			return true;
		}

		if(data.bulk == true) {
			if(isnull(self.bulk_storage[data.host])==true) {
				self.bulk_storage[data.host] = {};
			}
			self.bulk_storage[data.host][data.subop] = data;
//			$(self.str.output_bulk).append('<p>'+JSON.stringify(data)+'</p>');
			return true;
		}

/* end bulk stuff */

		if(data.mod_id != self.mod_id) { 
			console.log("modxgeoip mod_id != self mod_id", data); 
			return false; 
		}

		if(data.subop == 'country') {
			$(self.str.output_host).html(data.host)
			$(self.str.output_country).html(data.res.country_code3);
			$(self.str.output_name).html(data.res.country_name);
		}
		else if(data.subop == 'org') {
			$(self.str.output_org).html(data.res);
		}
		else if(data.subop == 'city') {
			$(self.str.output_city).html(data.res.city);
			$(self.str.output_city_region).html(data.res.region);
			$(self.str.output_city_postal_code).html(data.res.postal_code);
			$(self.str.output_city_latitude).html(data.res.latitude);
			$(self.str.output_city_longitude).html(data.res.longitude);
			$(self.str.output_city_continent_code).html(data.res.continent_code);
			$(self.str.output_city_time_zone).html(data.res.time_zone);
		}
	}


	self.handle_input_up = function(xself) {

		var dat = self.queue_input.up();

		$(self.str.input_input).attr('value',dat);
	}


	self.handle_input_down = function(xself) {

		var dat = self.queue_input.down();

		$(self.str.input_input).attr('value',dat);
	}


	self.output_empty = function(xself,data) {
		console.log("output_empty");
		$(self.str.output_host).html('');
		$(self.str.output_country).html('');
		$(self.str.output_name).html('');
		$(self.str.output_org).html('');
		//$(self.str.output_host).html('');
		$(self.str.output_city).html('');
		$(self.str.output_city_region).html('');
		$(self.str.output_city_postal_code).html('');
		$(self.str.output_city_latitude).html('');
		$(self.str.output_city_longitude).html('');
		$(self.str.output_city_continent_code).html('');
		$(self.str.output_city_time_zone).html('');
	}


	self.handle_input = function(xself, data) {
	
		e = data;
		var code = (e.keyCode ? e.keyCode : e.which);

		if (code == 13) { // user pressed enter
			self.handle_click(self,data);
		}
		else {
			/* handle up and down keys */
			up_and_down(self, e, code, self.handle_input_up, self.handle_input_down);
			self.output_empty(self,null);
		}
	}


	self.handle_dblclick = function(xself,data) {

		$(self.str.input_input).attr('value', '');

		self.output_empty(self,null);
	}


	
// bulk
 self.handle_bulk_dblclick = function(xself,data) {

		self.bulk_storage = {};

        $(self.str.input_bulk_ta).attr('value', '');

        self.output_empty(self,null);
   } 




// bulk
 self.handle_bulk_click = function(xself, data) {

        var inp, inp_array = [];

        inp = $(self.str.input_bulk_ta).val();
		
		inp_array = inp.split('\n');
        console.log("REQUESTING BULK!");
        self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', hosts: inp_array });
    }





	self.handle_nav_click = function(xself, data) {
	}



	self.handle_click = function(xself, data) {

		var inp;

		inp = $(self.str.input_input).val();

		self.queue_input.enqueue(inp);

		console.log("REQUESTING!");
		self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', host: inp });
	}


	self.load();
}
