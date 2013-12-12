/*
 *
 * Calc module
 *
 */

function modCalc(x) {

	var self = this;

	self.socket = x.socket;
	self.config_client = x.config_client;

	self.name = "Calc";
	self.category = "tools";

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
		html: "#modCalc_html",
		input: "#modCalc_html_div_input",
		input_input: "#modCalc_html_div_input_input",
		input_send: "#modCalc_html_div_input_send",
		output: "#modCalc_html_div_output",
		output_data: "#modCalc_html_div_output_data",
	}



	self.load = function() {
	}


	self.unload = function() {
	}


/* end */
self.load();
}
