/*
 *
 * Central module
 *
 */

function modCentral(x) {

	var self = this;

	self.socket = x.socket;
	self.config_client = x.config_client;
	self.name = "Central";

	self.tool_checkboxes = {};

	self.config = {
    	mod: "mod"+self.name,
    	name: self.name,
    	class: "mod"+self.name,
    	html: "mod"+self.name+"_html",
		id_html: "#mod"+self.name+"_html",

		nav_tab: "mod"+self.name+"-tabs-"+self.name.toLowerCase(),
		nav_tab_id: "#modTools-tabs-"+self.name.toLowerCase(),

    	h_req: "req_mod"+self.name,
    	h_resp: "resp_mod"+self.name,
	};


	self.str = {
		html: "#modCentral_html",
		input: "#modCentral_html_div_input",
		input_input: "#modCentral_html_div_input_input",
		input_send: "#modCentral_html_div_input_send",
/*
		output: "#modCentral_html_div_output",
		output_data: "#modCentral_html_div_output_data",
*/		list:	"#modCentral_html_div_list",
	}



	self.load = function() {

/*
		$("body").delegate("#modCentral_html_main_btn", "click", self.handle_click);
*/
/*
console.log("lucky", self.config.nav_tab_id);

		$('body').delegate(self.config.nav_tab_id, 'click',
			function(data) { self.handle_nav_click(self, data); });
*/

		setTimeout(self.handle_nav_click, 1000);


		$('body').delegate(self.str.input_input,'keydown',
			function(data) { self.handle_input(self, data); });

		$('body').delegate(self.str.input_send, 'click',
			function(data) { self.handle_click(self,data); });

		$('body').delegate(self.str.input_input, 'dblclick',
			function(data) { self.handle_dblclick(self, data); });

/*
		$('body').delegate(self.str.html, 'click', function(data) {
			$('#modCentral_html_div_input_input').focus(); });
*/

/*
        handlers.insert(self, "resp_modCentral", self.handle_resp);
*/

        self.queue_input = new Queue( { max: 100, dups: false } );

        console.log("Module loaded: Central");
	}


	self.unload = function() {
		$(self.str.input_input).unbind('keypress');
		$(self.str.input_send).unbind('click');
	}


	
	self.handle_nav_click = function() {

		var new_list = {};

			new_list = '<br/><div id="central-checkboxes">';

		for (var v in self.config_client.tools) {
			
			new_list = new_list + 
				'<div class="ui-checkbox"><input type="checkbox" name="'+self.name+'-'+v+'" id="'+self.name+'-'+v+'" value="set" checked>' +
				'<label for="'+self.name+'-'+v+'">'+v+'</label></div>';
					
/*
  <input type="checkbox" name="foo" value="bar" id="foo_bar">
  <label for="foo_bar">Bar</label>
*/

			self.tool_checkboxes[v] = v;

		}
		

		new_list = new_list + '</div>';


		$(self.str.list).html(new_list);


	/*	$("#central-checkboxes").buttonset(); */

		/* 
http://forum.jquery.com/topic/button-and-dialog-ui-state-focus-on-button-being-kept
http://osdir.com/ml/jquery-ui/2009-05/msg00268.html
*/

/*		.stopPropagation(); */

	}



	self.handle_click = function() {
		console.log("Central handle_click");

		var inp;

		inp = $(self.str.input_input).val();

		self.queue_input.enqueue(inp);

		console.log("REQUESTING!");
/*
		self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', host: inp });
*/


		console.log("self.config_client.tools", self.config_client.tools);			
		
/*
		for (var v in self.config_client.tools) {
				self.config_client.tools[v].central({host:inp});
		}	
*/

		for(var v in self.tool_checkboxes) {

			console.log("okok", v, $("#Central-"+v));
			if($("#Central-"+v).attr('checked')) {
				self.config_client.tools[v].central({host:inp});
			}
		}
	
	}


	self.handle_resp = function(selfx, data) {

		if(data.mod_id != self.mod_id) {
			console.log("modxgeoip mod_id != self mod_id", data);
			return false;
		}

		/* Remove \n's and replace with <br/>'s */
		/*data.data = data.data.replace(/[\r\n]/g,"<br/>");*/
		data.data = replace_nl_with_br(data.data);
		$(self.str.output_data).html(data.data);
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

		console.log("central dblclick");

		$(self.str.input_input).attr('value', '');

		for (var v in self.config_client.tools) {
			self.config_client.tools[v].central_clear();
		}

	}



/* end */
self.load();
}
