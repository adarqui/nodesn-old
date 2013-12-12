/*
 *
 * Notes module
 *
 */
function modNotes(x) {

	var self = this;

	self.name = "Notes";
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

		//console.log("module loaded: Notes");

		handlers.insert(self, NOTES_RESP(), self.handle_resp);

$('body').delegate('#notes_save', 'click', self.handle_save);
$('body').delegate('#notes_cancel', 'click', self.handle_cancel);
$('body').delegate('.notes_note', 'click', self.handle_edit);
$('body').delegate('.notes_note_delete', 'click', self.handle_edit_delete);

		/*$("body").delegate(self.config.html_click, "click", self.config.handle_click);*/

/*
setTimeout(function() {   $('textarea.tinymce').tinymce({

                       // Location of TinyMCE script
                        script_url : '/js/tinymce/jscripts/tiny_mce/tiny_mce.js',

                        // General options
                        theme : "advanced",
                        plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

                        // Theme options
                        theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                        theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                        theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                        theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                        theme_advanced_toolbar_location : "top",
                        theme_advanced_toolbar_align : "left",
                        theme_advanced_statusbar_location : "bottom",
                        theme_advanced_resizing : true,

                        // Example content CSS (should be your site CSS)
                        content_css : "/js/tinymce/examples/css/content.css",

                        // Drop lists for link/image/media/template dialogs
                        template_external_list_url : "lists/template_list.js",
                        external_link_list_url : "lists/link_list.js",
                        external_image_list_url : "lists/image_list.js",
                        media_external_list_url : "lists/media_list.js",

                        // Replace values for the template plugin

                        // Replace values for the template plugin
                        template_replace_values : {
                                username : "Some User",
                                staffid : "991234"
                        }


}) }, 2000);
*/



/*
setTimeout(function() {
jQuery(function() {
    jQuery('.wymeditor').wymeditor();
});

}, 2000);
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

		switch(data.op) {
			case NOTES_OP_LIST(): {
				self.handle_resp_list(data);
				break;
			}
			case NOTES_OP_EDIT(): {
				self.handle_resp_edit(data);
				break;
			}
			case NOTES_OP_SAVE(): {
				self.handle_resp_save(data);
				break;
			}
			default: {
				break;
			}
		}

	}


	self.handle_resp_list = function(data) {
		console.log("resp_list", data);

		$('#notes_table_tbody').html('');

		for(var v in data.rows) {
			var row = data.rows[v];
			$('#notes_table_tbody').append(
				'<tr>'
					+'<td class="notes_note">'+row.id+'</td>'
					+'<td class="notes_note">'+data.user+'</td>'
					+'<td class="notes_note">'+row.title+'</td>'
					+'<td class="notes_note">'+row.ts+'</td>'
					+'<td class="notes_note">'+row.tags+'</td>'
					+'<td class="notes_note"><button class="notes_note_delete">delete</button></td>'
				+'</tr>');
		}
//		$('#notes_table').tablesorter();
	}


	self.handle_resp_edit = function(data) {
		console.log("resp_edit", data);

		self.note.id = data.row[0].id;
		self.note.user = data.user;
		self.note.title = data.row[0].title;
		self.note.body  = data.row[0].body;
		self.note.tags = data.row[0].tags;

		self.note_restore();

	}


	self.handle_resp_save = function(data) {
		self.note.id = data.id;
		$('#modNotes_id').attr('value', data.id);
	}



self.handle_save = function() {
	console.log("save");

	self.note_save();
	self.socket.emit(NOTES_REQ(), { op: NOTES_OP_SAVE(), note: self.note });

}



self.handle_edit = function(e) {
	console.log("edit", e);
	
	var k = e.target.parentElement.children[0].innerText;

	self.socket.emit(NOTES_REQ(), { op: NOTES_OP_EDIT(), id: k } );
}


self.handle_edit_delete = function(e) {
	/* this gives us 'id' */
	var k = e.target.parentElement.parentElement.children[0].innerText;
//	var ky = e.target.parentElement.parentElement;
	 console.log("eh..", k,  e);
	
	self.socket.emit(NOTES_REQ(), { op: NOTES_OP_DELETE(), id: k });
}


self.handle_cancel = function() {
	console.log("cance");

	self.note_clear();
}


self.note_clear = function() {
	$('#modNotes_id').val('');
	$('#modNotes_title').val('');
	$('#modNotes_body').val('');
	$('#modNotes_tags').val('');

	self.note.id = null;
	self.note.title = '';
	self.note.body = '';
	self.note.tags = '';
}

self.note_save = function() {
	self.note.id = $('#modNotes_id').val();
	if(self.note.id == '') self.note.id = null; 
	self.note.title = $('#modNotes_title').val();
	self.note.body = $('#modNotes_body').val();
	self.note.tags = $('#modNotes_tags').val();
}

self.note_restore = function() {
	$('#modNotes_id').val(self.note.id);
	$('#modNotes_title').val(self.note.title);
	$('#modNotes_body').val(self.note.body);
	$('#modNotes_tags').val(self.note.tags);
}


	self.load();
}
