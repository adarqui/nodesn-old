/*
 *
 * Forum module
 *
 */
function modForum(x) {

	var self = this;

	self.name = "Forum";
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


	self.note = {
		id: null,
		title: {},
		body: {},
		tags: {},
	};
		

	self.load = function() {

		//console.log("module loaded: Forum");

		handlers.insert(self, FORUM_RESP(), self.handle_resp);

/*
$('body').delegate('#notes_save', 'click', self.handle_save);
$('body').delegate('#notes_cancel', 'click', self.handle_cancel);
$('body').delegate('.notes_note', 'click', self.handle_edit);
$('body').delegate('.notes_note_delete', 'click', self.handle_edit_delete);
*/


	}

	self.unload = function() {
		handlers.remove(self.config.h_resp, self.handle_resp);
	}


	self.handle_click = function() {
		//console.log(self.config.mod+"clicked");
	}


	self.handle_resp = function(self, data) {

		console.log("notes resp");

/*
		switch(data.op) {
			case FORUM_OP_LIST(): {
				self.handle_resp_list(data);
				break;
			}
			case FORUM_OP_EDIT(): {
				self.handle_resp_edit(data);
				break;
			}
		}
*/

	}




	self.load();
}
