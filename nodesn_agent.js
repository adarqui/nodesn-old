/*
 *
 * NODESN_AGENT - custom nodejs sniffer web service thing
 *
 * Andrew Darqui (adarq.org)
 */

/*
 *
 * Dependencies
 *
 */
var o = {
        misc        : require(__dirname + "/public/js/misc.js"),
        konst       : require(__dirname + "/public/js/konst.js"),
		agent		: require(__dirname + '/private/js/agent.js'),

		crypto		: require('crypto'),
        fs          : require('fs'),
        http        : require('https'),
        sys         : require('sys'),
		cproc		: require('child_process'),
        sock_io     : require('socket.io'),
		sock_io_client: require('socket.io-client'),
		os			: require('os'),
		os_utils	: require('os-utils'),
		tailfd		: require('tailfd').tail,

};

o.http.globalAgent.options.rejectUnauthorized = false;

var config = {	
	self		: this,

	sock_io_ap	: null,
	box_id		: 1000,

	argv		: {},
	CLIENTS		: {},
	app			: {},

	global_dir	: __dirname,
	mods		: o.konst.CONFIG_PATH_MODS(),

	file: {

		login_html	:	__dirname + "/views/login.html",
	},

	server_pulls: {

			"NULL" 		: { "path": __dirname + "/private/agent_mods/NULL/NULL.js" },
			"cpu"		: { "path": __dirname + "/private/agent_mods/cpu/cpu.js" },
			"profile"	: { "path": __dirname + "/private/agent_mods/profile/profile.js" },
			"snort"		: { "path": __dirname + "/private/agent_mods/snort/snort.js" },
			"logs"		: { "path": __dirname + "/private/agent_mods/logs/logs.js" },
			"network"	: { "path": __dirname + "/private/agent_mods/network/network.js" },
	},

	port		: 65500,

};

config.o = o;

/*
 * Parse a config file first
 */
config.o.fs.readFile(__dirname + "/etc/agent.conf", function(err, data) {
	if(err) {
		console.log("Unable to access "+__dirname+"/etc/agent.conf", err);
		process.exit(1);
	}

	data = data.toString();

	data = eval('{'+data+'}');

	console.log("agent_config", data, data.agent_config);

	config.agent_config = data;

	/* Fire off the agent */
	config.o.agent.load({b:config});
});



/* */
setInterval( function() { 
/*
	console.log("b.cli_sock", o.cli_sock);
	if(o.misc.isnull(o.cli_sock) == true) {
		config.o.agent.load({b:config});
	}
*/
}, 5000);

/* hello! */
