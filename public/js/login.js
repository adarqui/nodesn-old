var CoreLogin = function (opts) {

	var self = this;

	self.name = "Login";
	self.socket = opts.socket;
	self.config_client = opts.config_client;

	self.config = {
		mod: "mod"+self.name,
		name: self.name,
		class: "mod"+self.name,
		html: "login_html",

		h_req: "req_mod"+self.name,
		h_resp: "resp_mod"+self.name,
	};
	


	self.load = function() {

		self.config_client.login = self;

		$('#login_html_form_login').click(function() { 
			self.form_login(self); 
		});
	
		self.form_div_show();
		handlers.insert(self, LOGIN_RESP(), self.handle_resp);
		self.req_login_cookie(self);
	}


	self.reload = function() {
		self.req_login_cookie(self);
	}


	self.unload = function() {
	 	$('#login_html_form_login').unbind('click');
	}




	self.req_login_cookie = function(xself){ 
		var cook = localStorage.getItem(STORAGE_LOGIN_COOKIE());
		if(!cook) return false;
		//console.log("ookie ok..", cook, STORAGE_LOGIN_COOKIE());
		cook = JSON.parse(cook);
		data = { op: LOGIN_REQ_OP_AUTHENTICATE(), user: cook.user, pass: "null", cookie: cook.cookie };
		socket.emit(LOGIN_REQ(), data);
	}



	self.handle_resp = function(xself, data) {
		switch(data.op) {
			case LOGIN_RESP_OP_AUTHENTICATE(): {
				self.handle_resp_login_authenticate(xself, data);
				break;
			}
			default: {
				break;
			}
		}
	}



	self.handle_resp_login_authenticate = function(xself, data) {

		//console.log("resp_login_authenticationResult", data);

		if(data.res == true) {
        	// match
			//self.form_div_hide([main_stuff_div_show]);

			self.config_client.authenticated = STATE_AUTHENTICATED();

			self.form_div_hide();
			self.config_client.user = data.user;
			//console.log("config_client.user", config_client.user);

/*
			if(self.config_client.navbar_pulled == 0) {
				self.socket.emit('req_need_navbar', { hi: "hello" });
			}
*/

			console.log("config_client", self.config_client);
			if(self.config_client.nomore == false) {
				console.log("ok..");
				self.socket.emit(NAVBAR_REQ(), { 
					op: NAVBAR_REQ_OP_NEED_NAVBAR(), 
					hi: "hello" 
				});
				self.config_client.nomore = true;
			}
    

			if(self.config_client.user.cookie.length > 0) {
				var cookie = { 
							'uid' : self.config_client.user.uid,
							'user' : self.config_client.user.user,
							'cookie' : self.config_client.user.cookie
				};

				localStorage.setItem(STORAGE_LOGIN_COOKIE(), JSON.stringify(cookie));
			}
		}
		else if(data.res == false ) {
        	// fail
			self.form_div_shake();
		}
	}


	self.form_div_show = function() {
    	$('#login_html_form_div').show('bounce', null, 1000, function() { } );
    	$('#login_html_form_username').focus();
	}

	self.form_div_hide = function(fns) {
    	//console.log("HIDING");
    	$('#login_html_form_div').hide('drop', null, 1000, function() { for(var v in fns) { fns[v]();  }} );
    	$('#login_html_form_username').attr('value', '');
    	$('#login_html_form_password').attr('value', '');
    	return false;
	}

	self.form_div_shake = function() {
    	$('#login_html_form_div').effect('shake', null, 1000, function() { } );
    	$('#login_html_form_password').attr('value', '');
	}

	self.form_login = function(xself) {
    	u = $('#login_html_form_username').val();
    	p = $('#login_html_form_password').val();
    	if(!u || !p) return false;
    	if(u.length <= 0 || p.length <= 0) return false;

    	//console.log("emitting", u, p);


		var data = { op: LOGIN_REQ_OP_AUTHENTICATE(), user: u, pass: p, cookie: '' };
    	self.socket.emit(LOGIN_REQ(), data);
	}

self.load();
}


$(document).ready(function() {
	login = new CoreLogin({
		socket: self.config_client.socket,
		config_client: self.config_client,
	});

	
});
