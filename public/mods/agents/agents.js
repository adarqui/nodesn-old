/*
 *
 * Agents module
 *
 */

function modAgents(x) {

	var self = this;

	var a = x.nav_tab;

	self.name = "Agents";
	self.socket = x.socket;
	self.config_client = x.config_client;

	self.config = {
		mod: "mod"+self.name,
		name: self.name,
		class: "mod"+self.name,
		html: "mod"+self.name+"_html",
		id_html: "#mod"+self.name+"_html",
		h_req: "req_mod"+self.name,
		h_resp: "resp_mod"+self.name,

/*
		navbar_layout:
			{ "navMenu" : {
					"navTest"	: {
						"menu"	: "Agents",
						"href"	: "#navAgents",
						"mod"	: "xgeoip",
						"js"	: "/mods/" + "agents/xgeoip/xgeoip.js",
						"html"	: "/mods/" + "agents/xgeoip/xgeoip.html",
						"css"	: "/mods/" + "agents/xgeoip/xgeoip.css",
						"server": "/mods/" + "agents/xgeoip/private/xgeoip.js",
						"hidden": "false",
						},
					},
			},
*/
		};

	self.config.navbar_layout = { "navMenu" : { } };
	self.config.navbar_quick = {};
	self.config.shift = 60;
	self.config.current_agent = null;


	self.load = function() {

/*
		self.navbar = new CoreNavbar({
			socket: self.socket,
			html_base: "#modAgents-tabs-",
			config_client: self.config_client,
			prefix: "modAgents-tabs",
			navbar: "modAgents-navbar_div",
			type: "tabs",
			}
		);

		var data = {};
		data.res_msg = self.config.navbar_layout;
		self.navbar.handle_resp(self, data);

		console.log("Module loaded: Agents");
*/

		handlers.insert(self, AGENTS_RESP(), self.handle_resp);

		$.get(
			"/mods/agents/template.css", function(data) {

				//console.log("template.css", data);
				self.config.template_css = data;	
			}
		);

		$.get(
			"/mods/agents/template.html", function(data) {

				//console.log("template.html", data);
				self.config.template_html = data;
			}
		);
	

		$('body').delegate('.modAgents-tabs', 'click', function(ev) {
			/*
			 * KEEP TRACK OF THE CURRENT TAB
			 */
			//console.log('ev', ev, $(this).text());
			self.config.current_agent = $(this).text();
		});
	
	}


	self.unload = function() {
	}


	self.handle_click = function() {
	}


	self.handle_resp = function(xself, data) {
		console.log("agents handle_resp");
	//	alert(data);

		switch(data.op) {
			case AGENTS_RESP_OP_LIST(): {
				self.handle_resp_list(xself, data);
				break;
			}
			case AGENTS_RESP_OP_CPUINFO(): {
				self.handle_resp_cpuinfo(xself, data);
				break;
			}
			case AGENTS_RESP_OP_SNORT(): {
				self.handle_resp_snort(xself, data);
				break;
			}
			case AGENTS_RESP_OP_LOGS(): {
				self.handle_resp_logs(xself, data);
				break;
			}
			case AGENTS_RESP_OP_NETWORK(): {
				self.handle_resp_network(xself, data);
				break;
			}
/*
			case AGENTS_RESP_OP_PROFILE(): {
				self.handle_resp_profile(xself, data);
				break;
			}
*/
			default: {
				break;
			}
		}
	}


	self.handle_resp_profile = function(xself, data) {
		//console.log("handle_resp_profile", data);


		var v = self.config.navbar_quick[data.user];

		$("#navAgents_tabs_"+v.escaped+"_profile_user").text(data.user);

		$("#navAgents_tabs_"+v.escaped+"_profile_hostname").text(data.profile_hostname);
		$("#navAgents_tabs_"+v.escaped+"_profile_arch").text(data.profile_arch);
		$("#navAgents_tabs_"+v.escaped+"_profile_platform").text(data.profile_platform);
		$("#navAgents_tabs_"+v.escaped+"_profile_release").text(data.profile_release);
		$("#navAgents_tabs_"+v.escaped+"_profile_totalmem").text(data.profile_totalmem);
		$("#navAgents_tabs_"+v.escaped+"_profile_uptime").text(data.profile_uptime);
		$("#navAgents_tabs_"+v.escaped+"_profile_cpus").text(data.profile_cpus);
		$("#navAgents_tabs_"+v.escaped+"_profile_interfaces").text(data.profile_interfaces);

		//console.log("vvv", v, $("#navAgents_tabs_"+v.name+"_profile_user"));

//console.log("FUCK YOU", "#navAgents_tabs_"+v.escaped+"_profile_user");
		
	}


	self.handle_resp_network = function(xself, data) {
		//console.log("handle_resp_network", data);

		switch(data.op_sub) {
			case AGENTS_RESP_SUBOP_NETWORK_BANDWIDTH(): {
				self.handle_resp_network_bandwidth(xself, data);
				break;
			}
			default: {
				break;
			}

		}
	
	}


	self.network_bandwidth_clear_all = function(user) {
		//user.network.inc=0;
		for(var v in user.network.chart_bandwidth.series) {
			var series = user.network.chart_bandwidth.series[v];
			for(y in series.data) {
				series.data[y].remove(true);	
			}
			user.network.chart_bandwidth.redraw();
		}
	}



	self.network_bandwidth_clear = function(user, interface) {
			self.network_bandwidth_modify(user,interface,true);
	}

	self.network_bandwidth_show = function(user, interface) {
		self.network_bandwidth_modify(user, interface, false);
	}
		

	self.network_bandwidth_modify = function(user, interface, clear) {


		for(var v in user.network.chart_bandwidth.series) {
			//console.log("fuckfuckomg", v);
            var iface_name_graph = user.network.chart_bandwidth.series[v].name;
            var iface_name = iface_name_graph.split('_')[0];

            var series = user.network.chart_bandwidth.series[v];
			//console.log("fuckfuck111", series);
        //    user.network.chart_bandwidth.series[v].addPoint([user.network.inc, diff], true, shift)

/*
			for(var i = 0; i < series.data.length;i++) {
		//		series[i].remove(true);
				console.log("fuckfuck", series.data[i]);
				series.data[i].remove(true);
			}
*/
			if(series.name == interface && clear == true) {
				series.hide();
			}
			else if(series.name == interface && clear == false) {
				series.show();
			}
        }

	}











	self.handle_resp_network_bandwidth = function(xself, data) {


//		alert("bandwidth" + data);

		//console.log("network_bandwidth", data);


		var user = data.user.user;
		//console.log("user2=", user);
		user = self.config.navbar_quick[user];	

		//console.log("network bandwidth user=", user);

		if(user.network.chart_bandwidth == null) {
//			alert("null, creating chart");
			user.network.chart_bandwidth = {};

/*
[{
                name: "Bandwidth",
                data: [],
            }],
*/

			var series_defined = [];

			var cl = '<li class="ui-state-highlight emptyMessage">Active</li>';

			user.network.interfaces = {};
			for(var v in data.data) {

				/* this is for other gui menus */
				user.network.interfaces[v] = data.data[v].name;

				series_defined.push({ name: data.data[v].name+"_tx", data: [], txrx: "tx" });
				series_defined.push({ name: data.data[v].name+"_rx", data: [], txrx: "rx" });

			/*
			 * Also, build our connect-list here, for the interfaces
			 */

				//var cl = $("#navAgents_tabs_"+user.escaped+"_network_options_ifacesYES").html();
				cl = cl+ '<li class="ui-state-default">'+data.data[v].name+"_tx"+'</li>'
					+'<li class="ui-state-default">'+data.data[v].name+"_rx"+'</li>'
					;

			}


			/* builds the connect list */
			$("#navAgents_tabs_"+user.escaped+"_network_options_ifacesYES").html(cl);

			$("#navAgents_tabs_"+user.escaped+"_network_options_ifacesYES, #navAgents_tabs_"+user.escaped+"_network_options_ifacesNO").sortable({
				connectWith: ".navAgents_tabs_"+user.escaped+"_network_options_ifaces",
				dropOnEmpty: true,

				items: "li:not(.emptyMessage)",
				receive: function(event,ui) {
//					//console.log("fuckevent", event, "ui", ui);
//					if($('li:not(.emptyMessage)', ui.sender).length == 0) {
					//console.log("uiitem", ui.item, ui.parent, ui, ui.sender.context.id);
					if(ui.sender.context.id.indexOf('NO') > 0) {
// parent/? active/inactive? fuck

					//	$('li.emptyMessage', ui.sender).show();
						//console.log("ui_sender !", ui.sender, $(this).data(), ui.item, ui, ui.item.text());
						self.network_bandwidth_show(user,ui.item.text());
					}
					else {
					//	$('li.emptyMessage', ui.sender).hide();
						//console.log("ui_sender .", ui.sender, $(this).data(), ui.item, ui, ui.item.text());
						self.network_bandwidth_clear(user,ui.item.text());		
						//self.network_bandwidth_clear_all(user);
					}
				},

			}).disableSelection();

//			$(".navAgents_tabs_"+user.escaped+"_network_options_ifaces").sortable("option", "dropOnEmpty", false);

			//var k =$(".navAgents_tabs_"+user.escaped+"_network_options_ifaces").sortable("option", "items");


			self.network_charts(user, series_defined);

		}
		else {

/*
        for(var v in data.data) {
            console.log("v", v);
			var iface = data.data[v];
			console.log("iface", iface);
            var series = user.network.chart_bandwidth.series[iface.index];

            var shift = series.data.length > self.config.shift; // shift if the series is longer than sef.config.shift   

			var diff = data.data[v].txB - data.data[v].txA;
			console.log("diff", diff, data.data[v].txB, data.data[v].txA, iface.index);
            user.network.chart_bandwidth.series[iface.index].addPoint([user.network.inc, diff], true, shift)
//            user.network.inc = user.network.inc + 1;

        }
*/


		var yes_interfaces = {};
		$("ul#navAgents_tabs_"+user.escaped+"_network_options_ifacesYES > li").each(function() {
			yes_interfaces[$(this).html()] = "yes";
		});

		//console.log("yes_interfaces", yes_interfaces);

		for(var v in user.network.chart_bandwidth.series) {
//			var iface_name = data.data[user.network.chart_bandwidth.series[v].name];
			var iface_name_graph = user.network.chart_bandwidth.series[v].name;

			var iface_name = iface_name_graph.split('_')[0];

			if(data.data[iface_name].rxA == 0 || data.data[iface_name].txA == 0 /*|| yes_interfaces[iface_name_graph] != "yes"*/) {
				continue;
			}

			//console.log("iface_name", iface_name, "iface_name_graph", iface_name_graph);
			iface = data.data[iface_name];

		    var series = user.network.chart_bandwidth.series[v];

//            var shift = series.data.length > self.config.shift;
			var shift = user.network.inc > /*self.config.shift*/ 10;
//var shift = series.data.length > 20;

			//console.log("ok iface", iface);

//			if(user.network.chart_bandwidth.series[v].txrx == "tx") {
			if(iface_name_graph.indexOf("tx")>0) {
            	var diff = data.data[iface_name].txB - data.data[iface_name].txA;
            	//console.log("diff", diff, data.data[iface_name].txB, data.data[iface_name].txA, "shift", shift, "inc", user.network.inc);
			}
			else {
				var diff = data.data[iface_name].rxB - data.data[iface_name].rxA;
				//console.log("diff", diff, data.data[iface_name].rxB, data.data[iface_name].rxA, "shift", shift, "inc", user.network.inc);
			}


/* FORMULA FOR kb/s over 5 sec interval, need to send interval with data to make this formula work for intervals > or < than 5s */
			diff = diff * .2; diff = diff / 100;

            user.network.chart_bandwidth.series[v].addPoint([user.network.inc, diff], true, shift)

		}

		user.network.inc = user.network.inc + 1;


		}

		
	}


	self.handle_resp_logs = function(xself, data) {

		//console.log("handle_resp_logs", data);

		var user = self.config.navbar_quick[data.user.user];
		if(user == undefined) {
			return false;
		}

		var html = $("#navAgents_tabs_"+user.escaped+"_logs_data").html();
		html = "<p>"+data.file+":"+data.data+"</p>"+html;
		$("#navAgents_tabs_"+user.escaped+"_logs_data").html(html);
	}

		
	
	self.handle_resp_snort = function(xself, data) {

        //console.log('handle_resp_snort', data);

        var user = self.config.navbar_quick[data.user.user];
        if(user == undefined) {
            return false;
        }

		/* FIXME */
/*
		var html = $("#navAgents_tabs_"+user.escaped+"_snort_log").html();
		html = "<p>"+data.data+"</p>" + html;	
		$("#navAgents_tabs_"+user.escaped+"_snort_log").html(html);
*/

		var snort_line = $.csv.toArrays(data.data);
		var snort_line_new = snort_line[0][0] + " " + snort_line[0][4] + " " + snort_line[0][5] + " " + snort_line[0][6] + " " + snort_line[0][7] + " " + snort_line[0][8] + " " + snort_line[0][9];
		//console.log("snort_line_new", snort_line_new);
		//console.log("snort_line", snort_line);
        var html = $("#navAgents_tabs_"+user.escaped+"_snort_log").html();
        html = "<p>"+snort_line_new+"</p>" + html;   
        $("#navAgents_tabs_"+user.escaped+"_snort_log").html(html);
	
	}



	self.handle_resp_cpuinfo = function(xself, data) {
		//console.log('handle_resp_cpuinfo', data);

		var user = self.config.navbar_quick[data.user.user];
		if(user == undefined) {
			return false;
		}


		//console.log("user", user);
//		$("#navAgents_tabs_html_"+user.escaped).html("<p>"+data+"</p>");

//		var l1 = data.data.loadavg1;
		
		var graphs = {
			chart_freemem: {
				data: data.data.freemem,
			},
			chart_loadavg: {
				data: data.data.loadavg1,
			}
		};

		for(var v in graphs) {
			//console.log("v", v);
			var series = user.cpuinfo[v].series[0];
        	var shift = series.data.length > self.config.shift; // shift if the series is longer than sef.config.shift

			user.cpuinfo[v].series[0].addPoint([user.cpuinfo.inc, graphs[v].data], true, shift)
			user.cpuinfo.inc = user.cpuinfo.inc + 1;
		}
	}


	self.handle_resp_list = function(xself, data) {

		var data_orig = data;

		for(var v in data.data) {
			//console.log("resp_list ", data.data);

		
//		self.config.navbar_layout.navMenu.[data.data[v].user] = {

			var name = data.data[v].user;

			self.config.navbar_quick[name] = { 
				name: name,
				escaped: name.replace(/\./g, "\\."),
				cpuinfo: {
					chart_freemem: {},
					chart_loadavg: {},
					inc: 0,
				},
				network: {
					chart_bandwidth: null,
					interfaces: {},
					inc: 0,
				},
			};


			self.config.navbar_layout["navMenu"][data.data[v].user] =
                     {
                        "menu"  : data.data[v].user,
                        "href"  : "#nav"+data.data[v].user,
                        "mod"   : data.data[v].user,
                        "js"    : "/mods/" + "agents/obj/obj.js",
                        "html"  : "/mods/" + "agents/obj/obj.html",
                        "css"   : "/mods/" + "agents/obj/obj.css",
                        "server": "/mods/" + "agents/obj/private/obj.js",
                        "hidden": "false",
						"pull"	: "false",
			};
		}
		

		//console.log(self.config.navbar_layout);

        self.navbar = new CoreNavbar({
            socket: self.socket,
            html_base: "#modAgents-tabs-",
            config_client: self.config_client,
            prefix: "modAgents-tabs",
            navbar: "modAgents-navbar_div",
            type: "tabs",
            }
        );




        var new_data = {};
        new_data.res_msg = self.config.navbar_layout;
        self.navbar.handle_resp(self, new_data);

        //console.log("Module loaded: Agents");

		/*
		 * Fix the templates
		 */

		for(var v in self.config.navbar_quick) {

			/* REPLACE {MOD_ID} with v */
			var w = self.config.navbar_quick[v];

			//console.log("fark", w.name, w.escaped, self.config.template_html);

			var parsed_html = self.config.template_html.replace(/{MOD_ID}/g, w.name);

			//console.log("#modAgents-tabs-"+w.escaped, "parsed_html", parsed_html, $('#modAgents-tabs-'+w.escaped).html());

			$("#modAgents-tabs-"+w.escaped).html(parsed_html);

			$("#navAgents_tabs_"+w.escaped).tabs();

			//console.log("man wtf", $("#navAgents_tabs_"+w.escaped).html(), $("#navAgents_tabs_\\"+w.escaped).html(), "#navAgents_tabs_"+w.escaped);
    $( "#navAgents_tabs_"+w.escaped ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#navAgents_tabs_"+w.escaped+" li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

			/*
			 * CPUINFO CHARTS
			 */
			self.cpuinfo_charts(w);


		}

		/*
		 * ROUTE TAB
		 */
		self.page_route_setup(w);



        //console.log("UCKOFF", data.data);
        for(var v in data.data) {
            self.handle_resp_profile(self,data.data[v]);
        }


	}






	self.page_route_setup = function(user) {

		$(".navAgents_tabs_UNIQUE_route_menu").menu();

		//console.log("page_route_setup", $("#navAgents_tabs_"+user.escaped+"_route_menu_static_add"));

/*
		$('body').delegate(".navAgents_tabs_"+user.escaped+"_route_menu_static_add", 'click', function(ev) {

			//alert("fuck");
			ev.preventDefault();

			console.log("navAgents_...route_static_add",ev);

			$("#navAgents_tabs_UNIQUE_route_menu_static_add_popup").bPopup({
				fadeSpeed: 'slow',
				followSpeed: 1500,
				mediaColor: '#FF0066',
				positionStyle: 'fixed',
				position: [$(window).width()-600,20],
				modalClose: false,
				opacity: 0.4,
				});
*/
		$( "#navAgents_tabs_UNIQUE_route_menu_static_add_popup" ).dialog({
			autoOpen: false,
			height: 600,
			width: 600,
			modal: true,
			buttons: {
				"Save": function() {
					
				},
				"Cancel": function() {
					$(this).dialog('close');
				}
			}
		});
 


		$( ".navAgents_tabs_UNIQUE_route_menu_static_add" )
			.click(function() {
			$( "#navAgents_tabs_UNIQUE_route_menu_static_add_popup" ).dialog( "open" );

			/*
			 * LOAD CURRENT INFORMATION, interfaces etc
			 */
			var user = self.config.navbar_quick[self.config.current_agent];

			//console.log("current agent", self.config.current_agent,user);

			var sl = {};
			for(var v in user.network.interfaces) {
				sl = sl + '<option value="'+user.network.interfaces[v]+'">'+user.network.interfaces[v]+'</option>';	
			}
			$( "#route_static_interface" ).html(sl);

		});


		//console.log("/page_route_setup");

	}









	self.network_charts = function(w,series) {

		/*
		 * WE NEED SERIES DEFINED - it's all of the interfaces
		 */

		//console.log("w", w);
        w.network.chart_bandwidth = basic_live_chart({
            title: 'Live Bandwidth Monitor',
            series_name: 'Bandwidth',
            renderto: "navAgents_tabs_"+w.name+"_network_bandwidth",
            series: series
        });

	}




	self.cpuinfo_charts = function(w) {

/*
		var rend = "navAgents_tabs_"+w.name+"_cpuinfo_graph";
		console.log(rend, $('#'+rend).html());
*/

		w.cpuinfo.chart_freemem = basic_live_chart({
			title: 'Live Free Memory report',
			series_name: 'Free Memory',
			renderto: "navAgents_tabs_"+w.name+"_cpuinfo_freemem",
			series: [{
				name: "Free Memory",	
				data: [],
			}],
		});

		w.cpuinfo.chart_loadavg = basic_live_chart({
			title: 'Load Average',
			series_name: 'Load Average',
			renderto: "navAgents_tabs_"+w.name+"_cpuinfo_loadavg",
         series: [{
                name: "Load Average",
                data: [],
            }],

		});

/*
        w.cpuinfo.chart_freemem = new Highcharts.Chart({
            chart: {
                renderTo: rend,
                type: 'spline',
                marginRight: 10,
            },
            title: {
                text: 'Live free memory report'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
			series: [{
				name: "Random Data",
				data: []
			}],
        });
*/

    }


	self.load();
}
