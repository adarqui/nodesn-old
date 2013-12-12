/*
 * arguments:
 *  x.form = form
 *
 */
function FormObject(x) {

	var self = this;

	self.x = x;
	self.config = {};
	self.config.templates = {
		text: {
			html: 
				'<p>'
				+'<label for="{FIELD_ID}">{FIELD_NAME}</label>"'
				+'<input id="{FIELD_ID}" name="{FIELD_ID}" type="text" />'
				+'</p>'
		},
		radio: {
			html_begin:
				'<div id="{FIELD_ID}">',
			html_element:
				'<label for="{RADIO_ID}">{RADIO_NAME}"</label>'
				+'<input type="radio" id="{RADIO_ID}" name="{FIELD_ID}" />',
			html_end:
				'</div>',
		},
		select: {
			html_begin:
				'<p>'
				+'<label for="{FIELD_ID}">{FIELD_NAME}</label>'
				+'<select id="{FIELD_ID}" name="{FIELD_ID}">',
			html_element:
				'<option value="{SELECT_NAME}">{SELECT_NAME}</option>',
			html_end:
				'</select>'
				+'</p>',
		},
		button: {
			html:
				'<p>'
				+'<input class="submit" id="{FIELD_ID}" name="{FIELD_ID}" value="{FIELD_NAME}"/>'
				+'<p>',
		},
	};

	self.load = function() {
		console.log("form.load");

		self.config.form = self.x.form,

		self.reload();
	}

//		var groups = self.groups.grab();

	self.reload = function() {
		/*
		 * Build our form internals
		 */
		var strings = {
			base: self.config.form._base,
			form: self.config.form._name,
			group: {},
			field: {},
		};


		var groups = self.config.form.groups;
		for(var v_group in groups) {
			strings.group = v_group;
			for(var v_fields in groups[v_group].fields) {
				strings.field = v_fields;
				var field = groups[v_group].fields[v_fields];

				if(field.set == 1) {
					continue;
				}

				field.id = 
					"#"+strings.base+"_"+strings.group+"_"+strings.field;

				/* process delegates */
console.log("OMG2", field.id, field.delegates);
				for(var v_delegates in field.delegates) {

console.log("OMG",field.id, v_delegates, field.delegates[v_delegates][1], $(field.id));
					$('body').delegate(
						field.id,
						field.delegates[v_delegates][0],
						(function(ev) {
						/*
						 * Very important, spent an hour on this.. forgot about the loop + callback issue
						 */
						var field_new = field;
						var v_delegates_new = v_delegates;
						console.log("uhg", field, v_delegates);
							/* self needed for special callbacks */
							return function(ev) {
								field_new.delegates[v_delegates_new][1]({me:self,ev:ev});
							}
						}(v_delegates, field)));
				
				}

				switch(field.type) {
					case 'text': {
						break;
					}
					case 'radio': {

						for(var v_radio in field.radios) {
							var radio = field.radios[v_radio];

							radio.id = field.id + '_' + v_radio;
						}
						break;
					}
					case 'select': {
						for(var v_select in field.selects) {
							var select = field.selects[v_select];
							select.id = field.id + '_' + v_select;
						}
						break;
					}
					default: {
						break;
					}
				}

				field.set = 1;

				strings.field = "";
			}
			strings.group = "";
		}


		console.log("form:", self.config.form);

		o = self.groups.fields();
//		console.log("ok..", o);

			
	}

	self.groups = function() {
	}

	self.groups.fields = function() {

		var o = {};
		
		for(var v_group in self.config.form.groups) {
			for(var v_fields in self.config.form.groups[v_group].fields) {
				o[v_fields] = self.config.form.groups[v_group].fields[v_fields];
			}
		}

	console.log("groups fields", self.config.form.groups,o);
	return o;
	}

	self.unload = function() {
	}

	self.validate = function() {
		console.log("form.validate");

		var fields = self.groups.fields();

	}

	self.add = function() {
	}

	self.add.group = function() {
	}

	self.add.field = function(x) {
		/*
		 * x.group	= the group to add too
		 * x.field	= the field to add to the group
		 * x.name	= the field name
		 */

		var group	= x.group
		var field	= x.field;
		//var name	= x.name;

		console.log("adding field", field);
		if(self.config.form.groups[group] == undefined) {
			console.log("fuck");
			self.config.form.groups[group] = {};
			self.config.form.groups[group].fields = {};
		}

		group = self.config.form.groups[group];

/*
		group.fields.push(field);
*/
		for(var v in field) {
			group.fields[v] = field[v];
		}

		self.reload();
	}

	self.pull = function() {
		var fields = self.groups.fields();
		for (var v in fields) {
			var field = fields[v];
			switch(field.type) {
				case 'text': {
					field.value = $(field.id).val();
					break;
				}
				case 'select': {
					field.value = $(field.id + " :selected").val();
					break;
				}
				case 'radio': {
					for(var v_radio in field.radios) {
						var radio = field.radios[v_radio];
						if($(radio.id).attr('checked')) {
							field.value = v_radio;
							break;
						}
					}
					break;	
				}
				default: {
					break;
				}
			}
		}
	return fields;
	}


	self.pull.emit = function() {
		console.log("form.pull");

		var fields = self.pull();
		var o = {};

		for(var v in fields) {
			var field = fields[v];
			switch(field.emit) {
				case false: {
					break;
				}
				default: {
					o[v] = field.value;
					break;
				}
			}
		}
	return o;
	}


	self.clear = function() {
		console.log("form.clear");

		var fields = self.groups.fields();

		for(var v in fields) {
			var field = fields[v];

			console.log("form.clear field:", field);
			switch(field.type) {
				case 'text': {
					$(field.id).attr('value', '');
					break;
				}
				case 'radio': {
					console.log("radio");

					for(var v_radio in field.radios) {
						var radio = field.radios[v_radio];
						console.log("FUCKOFF", radio);
						if(radio.checked == true) {
							$(radio.id).attr('checked', 'checked');
						}
					}
    
					break;
				}
				default: {
					break;
				}
			}
		}
	}




/*
 * CRAZY HTML GENERATING STUFF
 */

	self.generate = function() {
		/*
		 * generate the entire html form
		 */
		var form = self.config.form;

		var str = "";
		for(var v in form.groups) {
			str = str + self.generate.group({group:v}); 
		}

	return str;
	}

	self.generate.group = function(x) {
		/*
		 * x.group = the name of the group to generate
		 */
		var group = x.group;

		var str = "";
		for(var v in self.config.form.groups[group].fields) {
			var field = self.config.form.groups[group].fields[v];
			str = str + self.generate.group.field({group:group, field:v});
		}

	return str;
	}
	
	self.generate.group.field = function(x) {
		/*
		 * x.field = the name of the field to generate
		 * x.group = the name of the group which holds the field
		 */

		var field = x.field;
		var group = x.group;

		var str = "";

		var field = self.config.form.groups[group].fields[field];

		console.log("xxx", field, x.field, x.group);
		if(field[0] == '_') {
			// not a field, spacer/custom etc
		}
		else {
			// actual field
			switch(field.type) {
				case 'text': {
					str = self.config.templates.text.html;
					break;
				}
				case 'button': {
					str = self.config.templates.button.html;
					break;
				}
				case 'radio': {
					str = self.config.templates.radio.html_begin;
					for(var v in field.radios) {
						str = str + self.config.templates.radio.html_element;
					}
					str = str + self.config.templates.radio.html_end;
					break;
				}
				case 'select': {
					str = self.config.templates.select.html_begin;
					for(var v in field.selects) {
						str = str + self.config.templates.select.html_element;
					}
					str = str + self.config.templates.select.html_end;
					break;
				}
				default: {
					break;
				}
			}
		}

	return str;
	}

self.load();
}
