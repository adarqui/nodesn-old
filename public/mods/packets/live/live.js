/*
 *
 * Live module
 *
 */

function modLive(x) {

	var self = this;

	self.socket = x.socket;
	self.config_client = x.config_client;

	self.name = "Live";

	self.config = {
    	mod: "mod"+self.name,
    	name: self.name,
		name_lower: self.name.toLowerCase(),
    	class: "mod"+self.name,
    	html: "mod"+self.name+"_html",
		id_html: "#mod"+self.name+"_html",
		html_main: "mod"+self.name+"_html_main",
		id_html_main: "#mod"+self.name+"_html_main",
    	h_req: "req_mod"+self.name,
    	h_resp: "resp_mod"+self.name,

		full: 0,
		summary: 1,

		play: 1,
	};

	self.str = {
		html: "#modLive_html",
		toolbar: "#modLive_html_toolbar",
		main: "#modLive_html_main",

		cap_type: "#modLive_html_cap_type",
		toggle: "#modLive_html_toolbar_toggle",

		full: "#modLive_html_toolbar_full",
		summary: "#modLive_html_toolbar_summary",
	};


	self.load = function() {


		$("body").delegate(self.str.toggle, "click", self.handle_toggle_click);

		//console.log("LIVE_RESP", LIVE_RESP());
		handlers.insert(self, LIVE_RESP(), self.handle_resp);



		/* TOOLBAR STUFF */
		$('body').delegate(self.str.full, 'click', self.handle_full_click);
		$('body').delegate(self.str.summary, 'click', self.handle_summary_click);
	

	}


	self.unload = function() {
	}


	self.handle_full_click = function(ev) {
		//console.log("full_click ev", ev);
		
		var v = $(self.str.full).attr('checked');
		//console.log("xxx v", v);

		var ops = {};
		if(isnull(v) == false) {
			ops = {
			op: LIVE_REQ_OP_CAPTURE(),
			op_sub: LIVE_REQ_CAPTURE_FULL(),
			}
			self.config.full = 1;
		}
		else {
			ops = {
				op: LIVE_REQ_OP_CAPTURE(),
				op_sub: LIVE_REQ_CAPTURE_FULL_OFF(),
			}
			self.config.full = 0;
		}


		self.socket.emit(LIVE_REQ(), ops);
	}
	
	self.handle_summary_click = function(ev) {
		//console.log("summary_click ev", ev);
		var v = $(self.str.summary).attr('checked');
		//console.log("xxx v", v);


		var ops = {};
		if(isnull(v) == false) {
			ops = {
				op: LIVE_REQ_OP_CAPTURE(),
				op_sub: LIVE_REQ_CAPTURE_SUMMARY(),
				}
			self.config.summary = 1;
		}
		else {
			ops = {
				op: LIVE_REQ_OP_CAPTURE(),
				op_sub: LIVE_REQ_CAPTURE_SUMMARY_OFF(),
			}
			self.config.summary = 0;
		}

		self.socket.emit(LIVE_REQ(), ops);
	}


	self.handle_click = function() {
		//console.log("packets handle_click");
	}

	self.handle_toggle_click = function() {
		/*
		 * This pauses or resumes the capture stream
		 */

		//console.log("live toggle_click", $(self.str.toggle), $(self.str.toggle).html());

		if($(self.str.toggle).html() == 'play') {
			/*
			 * Resume
			 */
			
			$(self.str.toggle).html('stop');

			self.socket.emit(LIVE_REQ_STATE_PLAY, { 
				op: LIVE_REQ_OP_STATE(),
				subop: LIVE_REQ_STATE_PLAY(), 
				full: self.config.full, summary: self.config.summary
			});

			//console.log("play = 1");
			self.config.play = 1;
		}
		else {
			/*
			 * Stop
			 */
			$(self.str.toggle).html('play');

			self.socket.emit(LIVE_REQ(), {
				op: LIVE_REQ_OP_STATE(),
				subop: LIVE_REQ_STATE_STOP(), 
				full: self.config.full, summary: self.config.summary
			});

			//console.log("play = 0");
			self.config.play = 0;
		}
	}



    self.handle_resp = function(xself, data) {
        //console.log("live handle_resp", data);

        switch(data.op) {
            case LIVE_RESP_OP_CAPTURE(): {
                self.handle_resp_op_capture(xself, data);
                break;
            }
            default: {
                break;
            }
        }
    }



	self.handle_resp_op_capture = function(xself, data) {

		//console.log("live handle_resp_op_capture");
		switch(data.op_sub) {
			case LIVE_RESP_CAPTURE_FULL(): {
				self.handle_resp_op_capture_full(xself, data);
				break;
			}
			case LIVE_RESP_CAPTURE_SUMMARY(): {
				self.handle_resp_op_capture_summary(xself, data);
				break;
			}
			default:
			{
				break;
			}
		}
	}


	self.handle_resp_op_capture_full = function(xself, data) {
		//console.log("live handle_resp_op_capture_full", self.config);

		if(self.config.play == 0) {
			/*
			 * We don't want to process packets right now, enqueue them or drop
			 */
			return false;
		}

     var html_orig = $('#'+self.config.html_main).html();

/*
        //console.log("LMAOv2", data, self.config.html_main, html_orig + data + "<br/>");
        var data = "x("+data.cnt+")..."+data.ip.saddr +
                "..." + data.ip.daddr + "..." + data.ip.proto + "..." +
                data.tcp.dport + "..." + data.udp.dport + "..." + data.dns.host + "<br/>";
        $('#'+self.config.html_main).html(data + html_orig + "<br/>");
*/
        var data = "<p>x("+data.cnt+")..."+data.ip.saddr +
                "..." + data.ip.daddr + "..." + data.ip.proto + "..." +
                data.tcp.dport + "..." + data.udp.dport + "..." + data.dns.host + "</p>";
        $('#'+self.config.html_main).html(data + html_orig);
    
	}

	self.handle_resp_op_capture_summary = function(xself, data) {
		//console.log("live handle_resp_op_capture_summary");

		if(self.config.play == 0) {
			/*
			 * We don't want to process packets right now, enqueue them or drop
			 */
			return false;
		}

		var html_orig = $('#'+self.config.html_main).html();
/*
		var data = "("+data.cnt+")..."+data.sum.ip_saddr + 
				"..." + data.sum.ip_daddr + "..." + data.sum.ip_proto + "..." + data.sum.dport +
				"..." + data.sum.dns_host + "<br/>";
		$('#'+self.config.html_main).html(data + html_orig + "<br/>");
*/

     var data = "<p>("+data.cnt+")..."+data.sum.ip_saddr +
                "..." + data.sum.ip_daddr + "..." + data.sum.ip_proto + "..." + data.sum.dport +
                "..." + data.sum.dns_host + "</p>";
        $('#'+self.config.html_main).html(data + html_orig);

	}



/* end */
self.load();
}
