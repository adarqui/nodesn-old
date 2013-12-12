/*
 *
 * AddUser module
 *
 */

function modAddUser(x) {


	var self = this;

	self.socket = x.socket;
	self.config_client = x.config_client;

	self.name = "AddUser";
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
		html: "#modAddUser_html",
		input: "#modAddUser_html_div_input",
		input_input: "#modAddUser_html_div_input_input",
		input_send: "#modAddUser_html_div_input_send",
		output: "#modAddUser_html_div_output",
		output_data: "#modAddUser_html_div_output_data",
	}



	self.form_obj = null;
	self.form = {};


self.load = function() {

	self.form = {
		_base: "modAddUser_form",
		_name: "adduser",
		_title: "Add a user or agent",
		groups: {
			details: {
				fields: {
					user: {
						type: "text",
					},
					pass: {
						type: "text",
					},
					ip: {
						type: "text",
					},
					type: {
						type: "select",
						selects: {
							USER:	{
							},
							AGENT:	{
							},
						},
					},
					clear: {
						type: "button",
						delegates: [
							['click',function(x) {
								x.me.clear();
								self.handle_click_clear(x.ev);
								}
							],
						],
						emit: false,
					},
					add: {
						type: "button",
						delegates: [
							['click',function(x) {
								x.me.validate();
								self.handle_click_add(x.ev);
								}
							],
						],
						emit: false,
					},
				},
			},
		},
	};


		self.form_obj = new FormObject({
			form:self.form
		});


/*
		$("body").delegate("#modAddUser_html_main_add", "click", self.handle_click_add);
*/
/*
		$("body").delegate("#modAddUser_form_details_clear", "click", self.handle_click_clear);
*/

		//xxx_add(self);

/*
     setTimeout( function() {
				self.update_policies();
            },
            2000,
        );
*/
		self.update_policies();

        handlers.insert(self, "resp_modAddUser", self.handle_resp);

        //console.log("Module loaded: AddUser");
	}



	self.unload = function() {
	}






	self.update_policies = function() {

		/* Dynamically add the policy radio buttons */
		console.log("murk pulled", self.config_client.navbar_raw);

		var policies = self.config_client.navbar_raw.policies;

		var radios = "";
		for(var v in policies) {
			console.log("murk", v, policies[v]);


			var field = {};
			field[v] = {
				type: 'radio',
				radios: {
					RWX: {
						},
					R: {
					},
					NONE: {
						checked: true,
					},
				},
			};

			self.form_obj.add.field({group: "policies", field: field, name: v});
					

			radios = radios 
				+'<div id="modAddUser_form_policies_'+v+'">'
				+'<p>'+v+'</p><p>'
+'<label for="modAddUser_form_policies_'+v+'_RWX">RWX</label>'
					+'<input type="radio" id="modAddUser_form_policies_'+v+'_RWX" name="modAddUser_form_policies_'+v+'" />'
+'<label for="modAddUser_form_policies_'+v+'_R">R</label>'
					+'<input type="radio" id="modAddUser_form_policies_'+v+'_R" _RWX" name="modAddUser_form_policies_'+v+'"/>'
+'<label for="modAddUser_form_policies_'+v+'_NONE">NONE</label>'
					+'<input type="radio" id="modAddUser_form_policies_'+v+'_NONE" checked _RWX" name="modAddUser_form_policies_'+v+'"/>'
				+'</p></div>';
		}

//		radios = radios + '</form>';

		$("#modAddUser_html_main_policies").html(radios);

/*
		for(var v in policies) {
			console.log("murk k2", $('#modAddUser_form_policies_'+v));
			$('#modAddUser_form_policies_'+v).buttonset();
		}
*/

		var str = self.form_obj.generate();
		console.log("omgomgomg", str);

	}






    self.handle_click_add = function() {

        var fields = self.form_obj.pull.emit();
        console.log("emit fields", fields);

        alert("add");
        //console.log("AddUser handle_click");

        //self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', host: inp });

        var policies = self.return_policies();

        console.log("policies", policies);
        policies.forEach(function(item) {
            console.log("policy",item);
        });


    }


    self.handle_click_clear = function() {
        alert("clear");
        console.log("policies");

        self.form_obj.clear();
    }







/*
	self.handle_click_add = function() {

		alert("add");
		//console.log("AddUser handle_click");

		//self.socket.emit(self.config.h_req, { mod_id: self.mod_id, op: 'q', host: inp });

		var policies = self.return_policies();

		console.log("policies", policies);
		policies.forEach(function(item) {
			console.log("policy",item);
		});


	}


	self.handle_click_clear = function() {
		alert("clear");
		console.log("policies");
	}
*/

	

	self.return_policies = function() {
		var policies = self.config_client.navbar_raw.policies;
		var ret=[];
		for(var v in policies) {
			ret.push(v);
		}
		return ret;
	}


	self.handle_resp = function(selfx, data) {

		if(data.mod_id != self.mod_id) {
			//console.log("modxgeoip mod_id != self mod_id", data);
			return false;
		}

		/* Remove \n's and replace with <br/>'s */
		/*data.data = data.data.replace(/[\r\n]/g,"<br/>");*/
		data.data = replace_nl_with_br(data.data);
		$(self.str.output_data).html(data.data);
	}



/* end */
self.load();
}
