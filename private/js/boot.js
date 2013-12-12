/*
 *
 * Various boot functions. Mostly called from nodesn.js
 *
 */

/*
 * The config object 
 */
var b = {};

var load = function(x) {
	b = x.b;

	startup();
}

var unload = function() {
}

var startup = function() {

	boot_mysql();

	var console_log_orig = console.log;
		console.logx = function() {

		if(typeof arguments[0] === "string") {
			if(arguments[0].indexOf("debug") != -1) {
			return false;
			}
		}
	console_log_orig(config.port + ":", arguments);
	}

	process_argv_env();

	boot_express();

	boot_https_server();

}


var boot_mysql = function() {
	/*
 	*
 	* Initialize mysql
 	*
 	*/

	b.mysql_c = b.o.mysql.createConnection({
    	host: b.mysql_host,
    	database: b.mysql_user,
    	user: b.mysql_user,
    	password: b.mysql_pass,
	});

	b.mysql_c.connect();

	console.log(b.mysql_c);
}



var process_argv_env = function() {
	if(process.env.PORT) {
		b.config.port = process.env.PORT;
	}

	b.argv = process.argv;
	console.log(b.argv);
	if(b.argv.length > 2) {
		/* interfaces given on command line */
		b.pcap.ifaces = b.argv[2].split(" ");
	}

	if(b.argv.length > 3) {
		/* listen port for https server */
		b.port = b.argv[3];
	}

	console.dir(process);
}



var boot_express = function() {

	/*
	 *
	 * Initialize & Configure Express
	 *
	 */

	b.app = b.o.express();

	b.app.configure(function () {
		b.app.engine('html', b.o.ejs.renderFile);
		b.app.set('view engine', 'html');
		b.app.set('views', b.global_dir + '/views');
		b.app.use(b.o.express.static(b.global_dir + '/public'));
		b.app.get('/', function(req, res) { res.render('index'); });
	});


}


var boot_https_server = function() {

	/*
	 *
	 * Initialize the Server
	 *
	 */

	console.dir(process);

	var server = b.o.http.createServer(b.ssl_options,b.app)
		.listen(process.env.PORT || b.port);

	b.sock_io_app = b.o.sock_io.listen(server);

	b.o.webserv.load({b:b});
	b.o.webserv.run();
}



var shutdown = function(x) {
	var b = x.b;
	b.o.db.shutdown({b: b});
}

exports.load = load;
exports.unload = unload;
exports.startup = startup;
exports.shutdown = shutdown;
