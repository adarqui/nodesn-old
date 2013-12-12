/*
 *
 * Chat module
 *
 */
function modChat(x) {

	var self = this;

	self.name = "Chat";
	self.socket = x.socket;
	self.config_client = x.config_client;

    self.queue_input = [];


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
		input: "#modChat_layout_south_input",
	}

	self.load = function() {

		handlers.insert(self, CHAT_RESP(), self.handle_resp);

        $('body').delegate(self.str.input,'keydown',
            function(data) { self.handle_input(self, data); });

        $('body').delegate(self.str.input, 'dblclick',
            function(data) { self.handle_dblclick(self, data); });

		self.queue_input = new Queue( { max: 100, dups: false } );

		setTimeout(function() {
			$('#modChat_layout').layout();
		}, 2000);

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
			case CHAT_OP_JOIN(): {
				self.handle_resp_join(data);
				break;
			}
			case CHAT_OP_MSG(): {
				self.handle_resp_msg(data);
				break;
			}
			case CHAT_OP_LIST(): {
				self.handle_resp_list(data);
				break;
			}
			case CHAT_OP_PART(): {
				self.handle_resp_part(data);
				break;
			}
			default: {
				break;
			}
		}

	}


	self.handle_resp_part = function(data) {
		console.log("part..", data);

		$('#modChat_layout_center_list').append('<li>'+data.user.user+' has parted</li>');

        if(data.user.gid != 1) {

            $('#modChat_layout_east_list > li').each(function(elm) {
                console.log("east:", this);
                if($(this).text() == data.user.user) { $(this).remove(); }
            });

        }
        else {

            $('#modChat_layout_west_list > li').each(function(elm) {
                console.log("west:", this);
                if($(this).text() == data.user.user) { $(this).remove(); }
            });
        }

	}

	self.handle_resp_join = function(data) {
		console.log("join..", data);
		$('#modChat_layout_center_list').append('<li>'+data.user.user+' has joined</li>');

		/* handle east list */
		var tog = 0;
		if(data.user.gid != 1) {

			$('#modChat_layout_east_list > li').each(function(elm) {
				console.log("east:", this);
				if($(this).text() == data.user.user) { tog = 1; }
			});

			if(tog == 0) {
				$('#modChat_layout_east_list').append('<li>'+data.user.user+'</li>');
			}
			tog = 0;
		}
		else {

			$('#modChat_layout_west_list > li').each(function(elm) {
				console.log("west:", this);
				if($(this).text() == data.user.user) { tog = 1; }
			});
			
			if(tog == 0) {
				$('#modChat_layout_west_list').append('<li>'+data.user.user+'</li>');
			}
			tog = 0;
			
		}


	}

	self.handle_resp_list = function(data) {
		console.log("list.." ,data);
		$('#modChat_layout_east_list').empty();
		$('#modChat_layout_west_list').empty();
		for(var v in data.users) {
			var user = data.users[v];
			if(user.gid == 1) {
				$('#modChat_layout_west_list').append('<li>'+data.users[v].user+'</li>');
			}
			else {
				$('#modChat_layout_east_list').append('<li>'+data.users[v].user+'</li>');
			}
		}
	}

	self.handle_resp_msg = function(data) {
		console.log("msg: ", data);
		$('#modChat_layout_center_list').append('<li>'+data.user.user+": "+data.msg+'</li>');
	}







    self.handle_input_up = function(xself) {

        var dat = self.queue_input.up();

console.log("up.. ", dat);

        $(self.str.input).attr('value',dat);
    }


    self.handle_input_down = function(xself) {

        var dat = self.queue_input.down();

console.log("down..", dat);

        $(self.str.input).attr('value',dat);
    }



    self.handle_input = function(xself, data) {

        e = data;
        var code = (e.keyCode ? e.keyCode : e.which);

		console.log("self.str.input", self.str.input, $(self.str.input), $(self.str.input).val());
        if (code == 13) { // user pressed enter
 /*           self.handle_click(self,data); */
//			$('#modChat_layout_center_list').append('<li>hi '+$(self.str.input).val()+'</li>');
			var inp = $(self.str.input).val();
			self.socket.emit(CHAT_REQ(), { 
				op: CHAT_OP_MSG(),
				msg: inp,
			});
			self.queue_input.enqueue(inp);
			self.handle_dblclick();
        }
        else {
            /* handle up and down keys */
            up_and_down(self, e, code, self.handle_input_up, self.handle_input_down);
        }
    }


    self.handle_dblclick = function(xself,data) {

        $(self.str.input).attr('value', '');
    }








	self.load();
}
