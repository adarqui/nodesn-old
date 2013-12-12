/*
 *
 * This does the https webserver handling & login/authentication
 *
 */

/*
 * The config object
 */
var b = {};

var load = function(x) {

	b = x.b;

}


var run = function() {
	//console.log(b);

	b.sock_io_app.sockets.on('connection', function(socket) {

		//console.log("OMGWTF4", socket);
		socket.b = b;
		var new_connection = new Connection({b:b, socket: socket});
		new_connection.handle_connection();
		}
	);

}


exports.load = load;
exports.run = run;


function Connection(x) {

	var self = this;

	self.b = x.b;
	self.socket = x.socket;
	self.user = {};

	self.handle_connection = function(socket) {

		//console.log("new connection!");

		self.socket.a = {};

		self.socket.a.connection = self;
		self.socket.a.connection.user.authenticated = self.b.o.konst.STATE_UNAUTHENTICATED();
		self.socket.a.socket = self.socket;

/* XXX IMPORTANT UNCOMMENT AFTER AUTH 
		self.server_pulls({socket:self.socket});	
*/

		self.need_login();

/*
		self.socket.on('req_login', function(data) {
			console.log("Connection: login");
			self.handle_req_login(data);
		});
*/

/*
		self.socket.on('req_login_authenticate', function(data) {
			console.log("Connection: login_authenticate");
			self.handle_req_login_authenticate(data);
		});
*/
		self.socket.on(self.b.o.konst.LOGIN_REQ(), function(data) {

			switch(data.op) {
				case self.b.o.konst.LOGIN_REQ_OP_AUTHENTICATE(): {
					self.handle_req_login_authenticate(data);
				}
				default: {
					break;
				}
			}

		});


		/*
		 * FIXME : make sure an unauthorized user CAN'T request the navbar or anything else, etc
		 */

		self.socket.on(self.b.o.konst.NAVBAR_REQ(), function(data) {
			//console.log("Connection: req_need_navbar");
			/*
			 *
			 * Assure user is authenticated, otherwise don't let them do anything
			 */

			if(data.op != self.b.o.konst.NAVBAR_REQ_OP_NEED_NAVBAR()) {
				return false;
			}

			if(self.socket.a && self.socket.a.connection && self.socket.a.connection.user) {

				if(self.socket.a.connection.user.authenticated == self.b.o.konst.STATE_AUTHENTICATED()) {

					self.server_pulls({socket:self.socket});
				}
			}




		});



		/****
		 * AGENT CALLBACKS, FOR SERVER TO RELAY
		 ****/

		self.socket.on(self.b.o.konst.AGENTS_RESP(), function(data) {
			//console.log("agents_resp", data);

			/*
			 * AS OF NOW, SIMPLY RELAY TO ALL GID 0 CLIENTS
			 */

			if(self.b.o.misc.isnull(self.socket.a) == true) {
				return false;
			}

			if(self.b.o.misc.isnull(self.socket.a.connection) == true) {
				return false;
			}


			if(data.op == self.b.o.konst.AGENTS_RESP_OP_PROFILE()) {
				
/*
				self.b.o.db.query({
					b: self.b,
					str: str,
					cb: self.insert_cap_summary_cb_save,
					xself: self,
				});
*/
				self.handle_agents_resp_op_profile(data);

			}


/*
			if(self.socket.a.connection == undefined) {
				return false;
			}
*/

//			console.log("WHAT THE FUCK". self.socket.a.connection);


/*
			if(data.op == self.b.o.konst.AGENTS_RESP_OP_PROFILE()) {
				self.socket.a.my_profile = data.data;	
				console.log("profile", self.socket.a.my_profile);
			}
*/

			data.user = { 
				user: self.socket.a.connection.user.user,
				uid: self.socket.a.connection.user.uid,
				gid: self.socket.a.connection.user.gid,
			};


			/*
			 * Notify admin's and guests's of the agent responses
			 */

			self.b.o.misc.notify({
				b: self.b,
				resp: self.b.o.konst.AGENTS_RESP(),
				data: data,
				type: [self.b.o.konst.USER_GROUP_ADMIN(), self.b.o.konst.USER_GROUP_GUEST()],
			});

		});





		self.socket.on('disconnect', function(data) {
			//console.log("Connection: disconnect");

			console.log("DISCONNECTING");

            if(self.socket.a && self.socket.a.connection && self.socket.a.connection.user) {


					console.log("d2");
                      /*
                     * run disconnection handlers, such as chat:part
                     */
                    for(var v in self.socket.a.connection.disconnect_handlers) {
                        var hdlr = self.socket.a.connection.disconnect_handlers[v];
                        hdlr.run();
                    }
 
			}


		});

		self.socket.on('error', function(data) {
			//console.log("Connection: error");
		});


	}



	self.handle_agents_resp_op_profile = function(x) {

/*
COUNT_ON_ROW', index: 0 } undefined undefined
agents_resp { op: 3,
  data:
   { hostname: 'serv',
     type: 'Linux',
     platform: 'linux',
     arch: 'x64',
     release: '2.6.32-5-amd64',
     uptime: 911402.765235163,
     totalmem: 6149439488,
     cpus: [ [Object], [Object], [Object], [Object] ],
     interfaces:
      { lo: [Object],
        eth0: [Object],
        'eth0:0': [Object],
        tun0: [Object],
        sit0: [Object],
        sit1: [Object] } } }
*/

		var data = x.data;

		for(var v in data) {
			if(typeof data[v] != "string") continue;

			data[v] = self.b.o.misc.mysql_real_escape_string(data[v]);
		}

		var str = "UPDATE users"
			+" SET host = '"+data.hostname+"',"
			+" profile_hostname = '"+data.hostname+"',"
			+" profile_type = '"+data.type+"',"
			+" profile_platform = '"+data.type+"',"
			+" profile_arch = '"+data.arch+"',"
			+" profile_release = '"+data.release+"',"
			+" profile_uptime = '"+data.uptime+"',"
			+" profile_totalmem = '"+data.totalmem+"',"
			+" profile_cpus = '"+JSON.stringify(data.cpus)+"',"
			+" profile_interfaces = '"+JSON.stringify(data.interfaces)+"'"
			+" WHERE user LIKE '"+self.socket.a.connection.user.user+"'"
			;

		//console.log("MYSQL_STR", str, self.socket.a.connection.user);

		self.b.o.db.query({
                b: self.b,
                str: str,
                cb: function() { //console.log("inserted"); 
				},
                xself: self,
		});

	}

	




	self.need_login = function(data) {
		//console.log("need_login");

		self.b.o.fs.readFile(self.b.file.login_html, function(error, file_data) {

			//console.log("error", error, "file_data", file_data);
		
			file_data = file_data.toString();

			if(!error) {
				self.socket.emit(self.b.o.konst.AUTH_RESP(), { 
					op: self.b.o.konst.AUTH_RESP_OP_NEED_LOGIN(),
					data: file_data 
				});
			}
		});
	}

	self.handle_req_login_authenticate = function(data) {

		//console.log("req_login_authenticate", data);

		var user = data.user;
		var pass = data.pass;
		var cookie = data.cookie;

		if(!user || !pass) {
			return false;
		}

		if(self.b.o.misc.isnull(user) == true) {
			//console.log("login_authenticate 1");
			self.resp_login_failure(self.socket);
			return false;
		}
		else if(self.b.o.misc.isnull(pass) == true) {
			//console.log("login_authenticate 2");
			self.resp_login_failure(self.socket);
			return false;
		}
	
		user = self.b.o.misc.mysql_real_escape_string(user);
		pass = self.b.o.misc.mysql_real_escape_string(pass);

		if(cookie) {
			cookie = self.b.o.misc.mysql_real_escape_string(cookie);
		}
		else { 
			cookie = {};
		}

		self.authenticate_user({
				user: user, pass: pass, cookie: cookie,
				cb_success: self.resp_login_success, cb_failure: self.resp_login_failure 
		});
	}


	self.resp_login_failure = function(/*x*/) {
		//console.log("resp_login_failure!");

		var data = {
			res: false,
		};

		data.op = self.b.o.konst.LOGIN_RESP_OP_AUTHENTICATE();
		self.socket.emit(self.b.o.konst.LOGIN_RESP(), data);

	}

	self.resp_login_success = function(/*x*/) {
		//console.log("resp_login_success!");

		var shacook = self.b.o.crypto.createHash('sha1');
		var valcook = shacook.update(b.o.misc.get_rand_bytes(256));
		valcook = shacook.digest('hex');

		self.user.cookie = valcook;
		var data = {
			res: true,
			user: {
				uid: self.user.uid,
				user: self.user.user,
				cookie: self.user.cookie,
			},
		};

/*
		self.b.mysql_c.query(
			"INSERT INTO users VALUES("
				+self.user.id+", '"
				+self.user.user+"','"
				+self.user.pass+"', "
				+self.user.uid+","
				+self.user.gid+",null,'"
				+self.user.cookie+"')"+
			" ON DUPLICATE KEY UPDATE cookie  = '"+valcook+"'", function(errors, results, fields) {
            	//console.log(errors,results,fields);
		});
*/

		self.b.mysql_c.query(
			"UPDATE users SET cookie = '"+valcook+"' WHERE user like '"+self.user.user+"'", 
			function(errors, results, fields) {
		});


/*
		self.socket.emit('resp_login_authenticationResult', data);
*/

		data.op = self.b.o.konst.LOGIN_RESP_OP_AUTHENTICATE();
		self.socket.emit(self.b.o.konst.LOGIN_RESP(), data);

		/*
		 * SPECIAL CALLBACKS, DIRECTLY AFTER SUCCESSFUL AUTHENTICATION
		 */
		if(self.b.o.misc.isnull(self.user.row.logs) == false) {

			/*
			 * SEND LOG FILE NAMES THAT ARE CONFIGURED TO BE MONITORED BY THE AGENT
			 */
			console.log("SENDING LOGS");

			var logs = { 
				op: self.b.o.konst.LOGS_REQ_OP_MONITOR(),
				data: self.user.row.logs,
			};

			self.socket.emit(self.b.o.konst.LOGS_REQ(), logs);
		}



				/* Setup connection handler stuff & do the shared pulls */
                 self.socket.a.connection.connect_handlers = {};
                    self.socket.a.connection.disconnect_handlers = {};
    
					self.shared_server_pulls();
                    console.log("NEW USER", self.socket.a.connection.user.user, self.socket.a.connection.connect_handlers);


                    /*
                     * run connection handlers, such as chat:join
                     */
                    for(var v in self.socket.a.connection.connect_handlers) {
                        var hdlr = self.socket.a.connection.connect_handlers[v];
                        hdlr.run();
					}



         /*
             * RUN ALL INITIAL INFORMATION CALLBACKS HERE
             * - inform client of profile information for each agent
             */

			/* PROFILE */
/*
            self.b.o.misc.socket_looper({
                x_b: self.b,
				my_socket: self.socket,
				notify_self: true,
                data: {},
                cb: function(x) {
                    console.log("omgfg fuckoff", x.socket.a.my_profile);
					x.socket.emit(self.b.o.konst.AGENTS_RESP(), { op: self.b.o.konst.AGENTS_RESP_OP_PROFILE(), data: x.socket.a.my_profile });
                }
            });
*/



	}


	self.authenticate_user = function(x) {

		var user = x.user;
		var pass = x.pass;
		var cookie = x.cookie;
		var cb_success = x.cb_success;
		var cb_failure = x.cb_failure;

		//console.log("WTF", x);

		self.b.mysql_c.query("SELECT * FROM users WHERE user LIKE '" + user + "' LIMIT 1",
			function(errors, rows, fields) {

				//console.log("rows", rows);

				if(rows.length > 0) {
				
					var row = rows[0];

					if(pass == row.pass || cookie == row.cookie) {
						self.user = {};
						self.user.authenticated = self.b.o.konst.STATE_AUTHENTICATED();
						self.user.id = row.id;
						self.user.user = row.user;
						self.user.pass = row.pass;
						self.user.uid = row.uid;
						self.user.gid = row.gid;
						self.user.ts = row.ts;
						self.user.cookie = row.cookie;
						self.user.row = row;
                	    cb_success(/*{b:b}*/);
	                }
                	else {
	                    cb_failure(/*{b:b}*/);
                	}
            	}
            	else {
                	cb_failure();
            	}
	        }
    	);
	}


	self.server_pulls = function() {

    	for(var v in self.b.server_pulls) {
        	//console.log("path", self.b.server_pulls[v].path);

			x = require(self.b.server_pulls[v].path);
			x = new x({b:b, socket: self.socket});

        	//console.log("x=", x);
        	eval("this.socket.a." + v + "=x;");
    	}
	}

	self.shared_server_pulls = function() {
		for(var v in self.b.shared_server_pulls) {
			x = require(self.b.shared_server_pulls[v]);
			x = new x({b:b, socket: self.socket, bypass: true});
		}
		eval("this.socket.b." + v + "=x;");
	}

}
