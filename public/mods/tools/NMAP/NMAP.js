/*
 *
 * NMAP module
 *
 */

function modNMAP(x) {

	var self = this;

	self.socket = x.socket;
	self.config_client = x.config_client;

	self.name = "NMAP";
	self.category = "tools";
	self.host = {};

	self.config = {
    	mod: "mod"+self.name,
    	name: self.name,
    	class: "mod"+self.name,
    	html: "mod"+self.name+"_html",
		id_html: "#mod"+self.name+"_html",
    	h_req: "req_mod"+self.name,
    	h_resp: "resp_mod"+self.name,
	};


	self.str = {
		html: "#modNMAP_html",
		input: "#modNMAP_html_div_input",
		input_input: "#modNMAP_html_div_input_input",
		input_send: "#modNMAP_html_div_input_send",
		output: "#modNMAP_html_div_output",
		output_data: "#modNMAP_html_div_output_data",
	}



	self.load = function() {

/*
		$("body").delegate("#modNMAP_html_main_btn", "click", self.handle_click);
*/
		xxx_add(self);


		$('body').delegate(self.str.input_input,'keydown',
			function(data) { self.handle_input(self, data); });

		$('body').delegate(self.str.input_send, 'click',
			function(data) { self.handle_click(self,data); });

		$('body').delegate(self.str.input_input, 'dblclick',
			function(data) { self.handle_dblclick(self, data); });

/*
		$('body').delegate(self.str.html, 'click', function(data) {
			$('#modNMAP_html_div_input_input').focus(); });
*/

        handlers.insert(self, NMAP_RESP(), self.handle_resp);

        self.queue_input = new Queue( { max: 100, dups: false } );

        console.log("Module loaded: NMAP");
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
	}


	self.handle_click = function() {
		console.log("NMAP handle_click");

		var inp;

		inp = $(self.str.input_input).val();

		self.queue_input.enqueue(inp);

		console.log("REQUESTING!");
/*
		self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', host: inp });
*/

		self.host = inp;

		self.socket.emit(NMAP_REQ(), {
			mod_id: self.mod_id,
			type: "poop",
			host: inp,
		});

	}


	self.handle_resp = function(selfx, data) {

		console.log("NMAP handle_resp", data);

		if(data.mod_id != self.mod_id) {
			console.log("modxgeoip mod_id != self mod_id", data);
			return false;
		}

		/* Remove \n's and replace with <br/>'s */
		/*data.data = data.data.replace(/[\r\n]/g,"<br/>");*/
		if(data.host != self.host) {
			/* MISMATCH */
			console.log("nmap mismatch", data.host, self.host);
			return false;
		}

		var orig = $(self.str.output_data).html();
		
		data.data = replace_nl_with_br(data.data);
		$(self.str.output_data).html(orig + data.data);


	}


	self.handle_input_up = function(selfx) {

		var dat = self.queue_input.up();

		$(self.str.input_input).attr('value',dat);
	}


	self.handle_input_down = function(selfx) {

		var dat = self.queue_input.down();

		$(self.str.input_input).attr('value',dat);
	}


	self.output_empty = function(selfx,data) {
		$(self.str.output_data).attr('value','');
    }


	self.handle_input = function(selfx, data) {

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


	self.handle_dblclick = function(selfx,data) {

		$(self.str.input_input).attr('value', '');
	}



/* end */
self.load();
}
