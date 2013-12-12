/*
 *
 * NODESN - custom nodejs sniffer web service thing
 *
 * Andrew Darqui (adarq.org)
 */

/* UNCOMMENT TO DEACTIVATE PROFILING */
//require('nodetime').profile();

/*
 *
 * Dependencies
 *
 */
var o = {
        misc        : require(__dirname + "/public/js/misc.js"),
        db          : require(__dirname + "/private/js/db.js"),
        boot        : require(__dirname + "/private/js/boot.js"),
        konst       : require(__dirname + "/public/js/konst.js"),
        pcap_subs   : require(__dirname + "/private/js/pcap_subs.js"),
        webserv     : require(__dirname + "/private/js/webserv.js"),
		crypto		: require('crypto'),
        pcap        : require('pcap'),
        express     : require('express'),
        ejs         : require('ejs'),
        fs          : require('fs'),
        http        : require('https'),
        mysql       : require('mysql'),
        sys         : require('sys'),
        sleep       : require('sleep'),
        geoip       : require('geoip'),
		whois		: require('whoisclient'),
		traceroute	: require('traceroute'),
		google		: require('google'),
		dns			: require('dns'),
		cproc		: require('child_process'),
		os			: require('os'),
        sock_io     : require('socket.io'),

		sub_xgeoip		: require(__dirname + "/public/mods/tools/xgeoip/private/xgeoip.js"),
		sub_whois		: require(__dirname + "/public/mods/tools/whois/private/whois.js"),
		sub_traceroute	: require(__dirname + "/public/mods/tools/traceroute/private/traceroute.js"),
		sub_nmap		: require(__dirname + "/public/mods/tools/NMAP/private/NMAP.js"),
};

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

	shared_server_pulls: {
     	chat : __dirname + "/public/mods/chat/private/chat.js",
	},

	server_pulls: {

/*			"login" : {  "path": global_dirname + "/public/mods/login/private/login.js" }, */
			"nav" 		: { "path": __dirname + "/public/mods/nav/private/nav.js" },

			"XGeoIP"	: { "path": __dirname + "/public/mods/tools/xgeoip/private/xgeoip.js" },
			"Whois"		: { "path": __dirname + "/public/mods/tools/whois/private/whois.js" },
			"Traceroute": { "path": __dirname + "/public/mods/tools/traceroute/private/traceroute.js" },
			"Google"	: { "path": __dirname + "/public/mods/tools/google/private/google.js" },
			"NMAP"		: { "path": __dirname + "/public/mods/tools/NMAP/private/NMAP.js" },
			"Central"	: { "path": __dirname + "/public/mods/tools/central/private/central.js" },

			"Live"		: { "path": __dirname + "/public/mods/packets/live/private/live.js" },
			"Search"	: { "path": __dirname + "/public/mods/packets/search/private/search.js" },
			"Graphs"	: { "path": __dirname + "/public/mods/packets/graphs/private/graphs.js" },
			"Maps"		: { "path": __dirname + "/public/mods/packets/maps/private/maps.js" },
			"CentralGraphs":{"path":__dirname + "/public/mods/packets/graphs/centralgraphs/private/centralgraphs.js" },
			"CentralMaps":{ "path": __dirname + "/public/mods/packets/maps/centralmaps/private/centralmaps.js" },
			"Agents"	: { "path": __dirname + "/public/mods/agents/private/agents.js" },
			"Diagnostics"  :{"path":__dirname + "/public/mods/diagnostics/private/diagnostics.js" },
			"Notes"		: { "path": __dirname + "/public/mods/notes/private/notes.js" },
			"Forum"		: { "path": __dirname + "/public/mods/forum/private/forum.js" },
			"Chat"		: { "path": __dirname + "/public/mods/chat/private/chat.js" },
			"Dashboard"	: { "path": __dirname + "/public/mods/dashboard/private/dashboard.js" },
			"AddUser"	: { "path": __dirname + "/public/mods/dashboard/adduser/private/adduser.js" },
			"NULL"		: { "path": __dirname + "/public/mods/NULL/private/NULL.js" },
	},

	mysql_host	: "localhost",
	mysql_user	: "nodesn",
	mysql_pass	: "cuFUVe3mbGXChfCq",
	mysql_c		: null,

	port		: 65500,

	ssl_options	: {
		key		: o.fs.readFileSync('keys/key.pem'),
		cert	: o.fs.readFileSync('keys/cert.pem')
	},

	pcap		: {
		ifaces	: {},
		filter	: "",
		pkt_cnt	: 0,
	},

};

config.o = o;

config.navbar_layout =
        { 
			"policies" : {
				"policy_dashboard"	: "0",
				"policy_packets"	: "0",
				"policy_tools"		: "0",
				"policy_diagnostics": "0",
				"policy_agent_profile"	: "0",
				"policy_agent_cpuinfo"	: "0",
				"policy_agent_snort"	: "0",
				"policy_agent_logs"		: "0",
				"policy_agent_network"	: "0",
				"policy_agent_shell"	: "0",
				"policy_agent_route"	: "0",
			},

				
			"navMenu" : {
				"navDashboard": {
					"menu": "Dashboard",
					"href": "#navDashboard",
					"mod": "dashboard",
					"js": config.mods + "/dashboard/dashboard.js",
					"html": config.mods + "/dashboard/dashboard.html",
					"css": config.mods + "/dashboard/dashboard.css",
					"server": config.mods + "/dashboard/private/dashboard.js",
					"hidden": "false",
					},
				"navPackets" : {
					"menu": "Packets",
					"href": "#navPackets",
					"mod": "packets",
					"js": config.mods + "/packets/packets.js",
					"html": config.mods + "/packets/packets.html",
					"css": config.mods + "/packets/packets.css",
					"server": config.mods + "/packets/private/packets.js",
					"hidden": "false",
                    },
				"navTools" : {
					"menu": "Tools",
					"href": "#navTools",
					"mod": "tools",
					"js": config.mods + "/tools/tools.js",
					"html": config.mods + "/tools/tools.html",
					"css": config.mods + "/tools/tools.css",
					"server": config.mods + "/tools/private/tools.js",
					"hidden": "false",
					},
				"navAgents" : {
					"menu" : "Agents",
					"href": "#navAgents",
					"mod": "agents",
					"js": config.mods + "/agents/agents.js",
					"html": config.mods + "/agents/agents.html",
					"css": config.mods + "/agents/agents.css",
					"server": config.mods + "/agents/private/agents.js",
					"hidden": "false",	
					},
                "navDiagnostics" : {
                    "menu": "Diagnostics",
                    "href": "#navDiagnostics",
                    "mod": "diagnostics",
                    "js": config.mods + "/diagnostics/diagnostics.js",
                    "html": config.mods + "/diagnostics/diagnostics.html",
                    "css": config.mods + "/diagnostics/diagnostics.css",
                    "server": config.mods + "/diagnostics/private/diagnostics.js",
                    "hidden": "false",
                    },
             "navNotes" : {
                    "menu": "Notes",
                    "href": "#navNotes",
                    "mod": "Notes",
                    "js": config.mods + "/notes/notes.js",
                    "html": config.mods + "/notes/notes.html",
                    "css": config.mods + "/notes/notes.css",
                    "server": config.mods + "/notes/private/notes.js",
                    "hidden": "false",
                    },
             "navForum" : {
                    "menu": "Forum",
                    "href": "#navForum",
                    "mod": "Forum",
                    "js": config.mods + "/forum/forum.js",
                    "html": config.mods + "/forum/forum.html",
                    "css": config.mods + "/forum/forum.css",
                    "server": config.mods + "/forum/private/forum.js",
                    "hidden": "false",
                    },

             "navChat" : {
                    "menu": "Chat",
                    "href": "#navChat",
                    "mod": "Chat",
                    "js": config.mods + "/chat/chat.js",
                    "html": config.mods + "/chat/chat.html",
                    "css": config.mods + "/chat/chat.css",
                    "server": config.mods + "/chat/private/chat.js",
                    "hidden": "false",
                    },
 
 
				"navNULL" : { 
					"menu": "NULL",
					"href": "#navNULL",
					"mod": "NULL",
					"js": config.mods + "/NULL/NULL.js",
					"html": config.mods + "/NULL/NULL.html",
					"css": config.mods + "/NULL/NULL.css",
					"server": config.mods + "/NULL/private/NULL.js",
					"hidden": "false",
					},
				},
	};

/* Load private mods */
config.o.sub_xgeoip = new config.o.sub_xgeoip({b: config, socket: null, bypass: true});
config.o.sub_whois = new config.o.sub_whois({b: config, socket: null, bypass: true});
config.o.sub_traceroute = new config.o.sub_traceroute({b: config, socket: null, bypass: true});
config.o.sub_nmap = new config.o.sub_nmap({b: config, socket: null, bypass: true});


config.o.boot.load({b:config});
config.o.pcap_subs.load({b:config});

/*
 *
 * Initialize mysql
 *
 */
config.o.db.load({b:config});
config.o.db.boot();

/* hello! */
