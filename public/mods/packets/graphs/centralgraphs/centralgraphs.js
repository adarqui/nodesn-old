/*
 *
 * CentralGraphs module
 *
 */
function modCentralGraphs(x) {

	var self = this;

	self.name = "CentralGraphs";
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
	};

	self.str = {
		generate: "#modCentralGraphs_generate",
	};


	self.load = function() {

		console.log("module loaded: CentralGraphs",CENTRALGRAPHS_RESP());

/*
		$(self.config.id_html).html("<p>Hello! I'm a CentralGraphs module");
*/
		handlers.insert(self, CENTRALGRAPHS_RESP(), self.handle_resp);

		$(function() {
			$( "#modCentralGraphs_datepicker_begin" ).datetimepicker({
				showOn: "button",
				buttonImage: "/images/calendar.gif",
				buttonImageOnly: true,
				dateFormat: 'yy-mm-dd',
				timeFormat: 'hh:mm:ss',
			});

			$( "#modCentralGraphs_datepicker_end" ).datetimepicker({
				showOn: "button",
				buttonImage: "/images/calendar.gif",
				buttonImageOnly: true,
				dateFormat: 'yy-mm-dd',
				timeFormat: 'hh:mm:ss',
			});
		});

		$('body').delegate(self.str.generate, 'click', self.handle_generate_click);
	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		console.log(self.config.mod+"clicked");
	}


	self.handle_resp = function(self, data) {

		console.log("centralgraphs handle_resp");

		if(data.op != CENTRALGRAPHS_RESP_OP_GENERATE()) { 
			return false;
		}


/*
		switch(data.op_sub) {
			case CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES(): {
				self.handle_resp_generate_countries(data);
				break;
			}
			default: {
				break;
			}
		}
*/

	
		for(var v in self.config_client.graphs) {
			console.log("WTF");
			self.config_client.graphs[v].central(data);
		}

	}




	self.handle_generate_click = function() {

		console.log("handle_generate_click()");

		var begin = $('#modCentralGraphs_datepicker_begin').val();
		var end = $('#modCentralGraphs_datepicker_end').val();

/*
		var begin_date = mysqlTimeStampToDate(begin);
		var end_date = mysqlTimeStampToDate(end);
*/
		var begin_date = parse_date(begin);
		var end_date = parse_date(end);

		if(begin_date >= end_date) {
			alert("Incorrect date interval");
			return false;
		}

		if(begin_date < end_date) {
			console.log("1 <");
		}
		else {
			console.log("2 >");
		}

		console.log("ok", begin, end, "begin_date", begin_date, "end_date", end_date, end_date - begin_date, begin_date-end_date,typeof begin_date, typeof end_date);

		self.socket.emit(CENTRALGRAPHS_REQ(), {
			op: CENTRALGRAPHS_REQ_OP_GENERATE(),
			op_sub: CENTRALGRAPHS_REQ_SUBOP_NONE(),
			begin: begin,
			end: end,
		});


	}

	self.load();
}
