var b = {};

var load = function(x) {

    b = x.b;

	boot();

}

exports.load = load;

var unload = function() {
}

exports.unload = unload;


var boot = function() {

	console.log("boot");

	b.cli_sock = b.o.sock_io_client.connect("https://"+b.agent_config.monitor_host+":"+b.agent_config.monitor_port, b.agent_config.connect_options);

	console.log("b.cli_sock", b.cli_sock);

	b.cli_sock.a = {};
	b.connected = 0;

	b.cli_sock.on('connect', function(data) {
		console.log("connected", data, b.connected);

		server_pulls();
	});

	b.cli_sock.on('disconnect', function(data) {
		console.log("disconnect");
		server_pulls_unload();
	});

	b.cli_sock.on('error', function(data) {
		console.log("error",data);
/* http://stackoverflow.com/questions/12599914/retry-socket-io-connection-if-client-page-loads-and-server-is-down */
		b.cli_sock.socket.reconnect();
	});

	b.cli_sock.on('reconnect', function(data) {
		console.log("reconnect");
	});

	b.cli_sock.on('reconnecting', function(data) {
		console.log("reconnecting");
	});

	b.cli_sock.on('connecting', function(data) {
		console.log("connecting");
	});

	b.cli_sock.on(b.o.konst.AUTH_RESP(), function(data) {
		console.log("auth_req", data);
		switch(data.op) {
			case b.o.konst.AUTH_RESP_OP_NEED_LOGIN(): {
				agent_authenticate();		
				break;
			}
			default: {
				break;
			}
		}
	});

	b.cli_sock.on(b.o.konst.LOGIN_RESP(), function(data) {
		console.log("login_resp", data);

		switch(data.op) {

			case b.o.konst.LOGIN_RESP_OP_AUTHENTICATE(): {
				console.log("authentication response");

				if(data.res == true) {
					console.log("AUTHENTICATION SUCCESS");

/*
 * Since we've authenticated, send info
 */
					b.cli_sock.a.profile.emit_profile();



				}
				else {
					console.log("AUTHENTICATION FAILURE");
					process.exit(0);
				}
			}

		}
	
	});
}



agent_authenticate = function() {

	console.log("agent_authenticate");

	var auth = {
		op: b.o.konst.LOGIN_REQ_OP_AUTHENTICATE(),
		user: b.agent_config.agent_user,
		pass: b.agent_config.agent_pass,
		cookie: '',
	};

	b.cli_sock.emit(b.o.konst.LOGIN_REQ(), auth);
	
}



server_pulls = function() {

	console.log("server_pulls");

	for(var v in b.server_pulls) {
		console.log("path", b.server_pulls[v].path);

		x = require(b.server_pulls[v].path);
		x = new x({b:b, socket: b.cli_sock});

		console.log("x=", x);
		eval("b.cli_sock.a." + v + "=x;");

	}
}


server_update = function() {
}


server_pulls_unload = function() {
	for(var v in b.cli_sock.a) {
		console.log("v", b.cli_sock.a[v]);
		b.cli_sock.a[v].unload();
	}
}

