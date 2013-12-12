/*
 *
 * Google module
 *
 */

function modGoogle(x) {

	var self = this;

	self.socket = x.socket;
	self.category = "tools";

	self.config_client = x.config_client;
	self.name = "Google";

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
		html: "#modGoogle_html",
		input: "#modGoogle_html_div_input",
		input_input: "#modGoogle_html_div_input_input",
		input_send: "#modGoogle_html_div_input_send",
		output: "#modGoogle_html_div_output",
		output_data: "#modGoogle_html_div_output_data",
	}



	self.load = function() {

/*
		$("body").delegate("#modGoogle_html_main_btn", "click", self.handle_click);
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
			$('#modGoogle_html_div_input_input').focus(); });
*/

        handlers.insert(self, "resp_modGoogle", self.handle_resp);

        self.queue_input = new Queue( { max: 100, dups: false } );

        console.log("Module loaded: Google");
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
		console.log("Google handle_click");

		var inp;

		inp = $(self.str.input_input).val();

		self.queue_input.enqueue(inp);

		console.log("REQUESTING!");
		self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', host: inp });
	}


	self.handle_resp = function(self, data) {

		if(data.mod_id != self.mod_id) {
			console.log("modxgeoip mod_id != self mod_id", data);
			return false;
		}

		/* Remove \n's and replace with <br/>'s */
/*
		data.data = data.data.replace(/[\r\n]/g,"<br/>");
		$(self.str.output_data).html(data.data);
*/
		
		var links = data.data;

		var body = {};
		body = '<table><tr><td>Link</td><td>Description</td></tr>';

		for(var i in links) {
			links[i].link = links[i].description.split(' ')[0];
			body = body + 
				'<tr><td><a target="_blank" href="http://'+links[i].link+'">'+links[i].title+'</a></td>' +
				'<td>'+links[i].description+'</td>';
		}
		body = body + '</table>';

		$(self.str.output_data).html(body);

		console.log("got response!", body, data);
	}


	self.handle_input_up = function(self) {

		var dat = self.queue_input.up();

		$(self.str.input_input).attr('value',dat);
	}


	self.handle_input_down = function(self) {

		var dat = self.queue_input.down();

		$(self.str.input_input).attr('value',dat);
	}


	self.output_empty = function(self,data) {
		$(self.str.output_data).attr('value','');
    }


	self.handle_input = function(self, data) {

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


	self.handle_dblclick = function(self,data) {

		$(self.str.input_input).attr('value', '');
	}



/* end */
self.load();
}
