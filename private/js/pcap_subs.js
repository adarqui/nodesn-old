/*
 *
 * PCAP SUB ROUTINES
 *
 */

/*
 * Config object
 */
var b = {};

var load = function(x) {

	b = x.b;
}

var unload = function() {
}

var pcap_pseudo = function(x) {
	var self	 = this;
	self.c 		 = null;

	/* saved summary query */
	self.summary = null;

	self.raw_pkt = null; 
	self.new_pkt = null;

	self.box_id  = null;
	self.iface   =null;
	self.pcap = {
		ts:		null,
		caplen:	null,
	};
	self.dns = {
		host:	null,
	};
	self.ip = {
		saddr: 	null,
		daddr: 	null,
		id:		null,
		v:		null,
		hl:		null,
		totl:	null,
		proto:	null,
		cksum:	null,
	};
	self.tcp = {
		sport:	null,
		dport:	null,
		flags:	null,
		seqno:	null,
		ackno:	null,
		opts:	null,
		len:	null,
		cksum:	null,
	};
	self.udp = {
		sport:	null,
		dport:	null,
		len  :	null,
		cksum:	null,
	};
	self.data = {
		data:	null,
		len:	null,
	};
	self.ip_data = {
		data:	null,
		len:	null,
	};

	self.build = function() {
		self.box_id = self.c.box_id;
		self.iface = self.c.pcap.iface;

		self.build_pcap(self.new_pkt.pcap_header);

		if(self.c.o.misc.isnull(self.new_pkt.link.ip) == false) {
			self.ip_build(self.new_pkt.link.ip);
		}

		if(self.c.o.misc.isnull(self.new_pkt.link.ip.tcp) == false) {
			//console.log("TCP", pkt.link.ip.tcp);
			self.tcp_build(self.new_pkt.link.ip.tcp);
		}

		if(self.c.o.misc.isnull(self.new_pkt.link.ip.udp) == false) {
			//console.log("UDP", pkt.link.ip.udp);
			self.udp_build(self.new_pkt.link.ip.udp);
		}
	};
	
	self.build_pcap = function(pcap_obj) {
		self.pcap.caplen		= pcap_obj.caplen;
		self.pcap.ts			= pcap_obj.time_ms;
	};

	self.ip_build = function(ip_obj) {
		self.ip.saddr	= ip_obj.saddr;
		self.ip.daddr	= ip_obj.daddr;
		self.ip.id		= ip_obj.identification;
		self.ip.v 		= ip_obj.version;
		self.ip.hl		= ip_obj.header_length;
		self.ip.totl	= ip_obj.total_length;
		self.ip.proto	= ip_obj.protocol;
		self.ip.cksum	= ip_obj.header_checksum;
	};

	self.tcp_build = function(tcp_obj) {
		self.tcp.sport = tcp_obj.sport;
		self.tcp.dport = tcp_obj.dport;
		self.tcp.flags = self.c.o.misc.mysql_real_escape_string(JSON.stringify(tcp_obj.flags));
		self.tcp.seqno = tcp_obj.seqno;
		self.tcp.ackno = tcp_obj.ackno;
		self.tcp.opts  = self.c.o.misc.mysql_real_escape_string(JSON.stringify(tcp_obj.options));
		self.tcp.len   = tcp_obj.header_bytes;
		self.tcp.cksum = tcp_obj.checksum;

		if(tcp_obj.data_bytes > 0) {
			self.data.data = tcp_obj.data.toString();
			self.data.len  = tcp_obj.data_bytes;
		}
	};

	self.udp_build = function(udp_obj) {
		self.udp.sport = udp_obj.sport;
		self.udp.dport = udp_obj.dport;
		self.udp.len   = udp_obj.length;
		self.udp.cksum = udp_obj.checksum;
		
		if(udp_obj.data_bytes > 0) {
			self.data.data = udp_obj.data.toString();
			self.data.len  = udp_obj.data_bytes;
		}
	};

	self.dns_build = function(obj) {
		/* obj = mysql summary row */
		self.dns.host = obj.dns_host;
	};

	self.data_build = function(p) {
	};

	self.dump = function() {
		//console.log(self.new_pkt, self.pcap, self.ip, self.tcp, self.udp, self.data);
	};


	self.insert_cap_summary_cb_save = function(xself, data) {

		//console.log("insert_cap_summary_save");

		if(self.c.o.misc.isnull(data.rows) == true) return false;

		//console.log("FUCKFUCK", data.rows);

		self.summary = data.rows[0];


		/*
		 * FILL IN UNPROCESSED FIELDS
		 *
		 *  self.dns etc
		 */
		self.dns_build(self.summary);

		/*
		 * MAJOR SUMMARY PROCESSING HAPPENS HERE
		 * 
		 *  we've pulled the summary row, now it's time to nmap, resolve, openvas, bgp, dns, etc
		 */

		if(self.c.o.misc.isnull(self.summary.dns_host) == true) {
			/*
			 * RUN DNS CALLBACKS
			 */
			self.c.o.pcap_subs.cb_dns({
				id: self.summary.id, dns_host: self.summary.dns_host, summary: self.summary
			});
			// ^^ takes care of whois_host //
		}

		if(self.c.o.misc.isnull(self.summary.whois_ip) == true) {
			/*
			 * RUN WHOIS CALLBACKS
			 */
			self.c.o.pcap_subs.cb_whois_ip({
				id: self.summary.id, ip: self.summary.ip_saddr, summary: self.summary
			});
		}

		if(self.c.o.misc.isnull(self.summary.xgeoip_asnum) == true) {
			/*
			 * RUN XGEOIP CALLBACKS
			 */
			self.c.o.pcap_subs.cb_xgeoip({
				id: self.summary.id, ip: self.summary.ip_saddr, summary: self.summary
			});
		}

		if(self.c.o.misc.isnull(self.summary.traceroute) == true) {
			/*
			 * RUN TRACEROUTE CALLBACKS
			 */
			self.c.o.pcap_subs.cb_traceroute({
				id: self.summary.id, ip: self.summary.ip_saddr, summary: self.summary
			});
		}

		if(self.c.o.misc.isnull(self.summary.nmap) == true) {
			/*
			 * RUN NMAP CALLBACKS 
			 */
			self.c.o.pcap_subs.cb_nmap({
				id: self.summary.id, ip: self.summary.ip_saddr, summary: self.summary,
			});
		}


		self.notify_clients_of_summary();
	}


	self.insert_cap_summary_cb = function(xself, data) {
		//console.log("insert_cap_summary_cb");

		if(self.c.o.misc.isnull(data.rows) == true) return false;

		/* TODO changedRows etc */
		var str = "SELECT * FROM cap_summary WHERE id = " + data.rows.insertId;
		
		return self.c.o.db.query(
			{ 
				b: self.c, 
				str: str, 
				cb: self.insert_cap_summary_cb_save, 
				xself: self,
		});
	};


	self.insert_cap_summary = function() {
		var str = self.get_mysql_cap_summary_string();
		return self.c.o.db.query({ b: self.c, str: str, cb: self.insert_cap_summary_cb, xself: self });
	};


	self.get_mysql_cap_summary_string = function() {
		var port = 0;

		if(self.ip.proto == self.c.o.konst.IP_PROTO_UDP()) {
			port = self.udp.dport;
		}
		else if(self.ip.proto == self.c.o.konst.IP_PROTO_TCP()) {
			port = self.tcp.dport;
		}
		//console.log("PORT.bleh", port, self.tcp.dport, self.udp.dport);

		var str = "INSERT INTO cap_summary VALUES ("
			// id
			+"NULL,"
			// box_id
			+self.c.box_id+","
			+"NULL,"
			+"'"+self.ip.saddr+"',"
			+"'"+self.ip.daddr+"',"
			+self.ip.proto+","
			+port+","
			+"1,"
			// whois_host
			+"NULL,"
			// whois_ip
			+"NULL,"
			// traceroute
			+"NULL,"
			// nmap
			+"NULL,"
			// openvas"
			+"NULL,"
			// bgp
			+"NULL,"
			// dns_host
			+"NULL,"
			// dns_txt
			+"NULL,"
			// xgeoip_asnum
			+"NULL,"
			// xgeoip_country
			+"NULL,"
			// xgeoip_country_code
			+"NULL,"
			// xgeoip_org
			+"NULL,"
			// xgeoip_city
			+"NULL,"
			// xgeoip_region
			+"NULL,"
			// xgeoip_postal
			+"NULL,"
			// xgeoip_continent
			+"NULL,"
			// xgeoip_timezone
			+"NULL,"
			// xgeoip_long
			+"NULL,"
			// xgeoip_lat
			+"NULL,"
			// xgeoip_metro_code
			+"NULL,"
			// xgeoip_dma_code
			+"NULL,"
			// xgeoip_area_code
			+"NULL"
			+") ON DUPLICATE KEY UPDATE cnt = (cnt + 1), ip_proto = "+self.ip.proto+", dport = "+port;
		//console.log(str);
		return str;
	};


	self.insert_cap_cb = function() {
		//console.log("insert_cap_cb");
	}


	self.insert_cap = function() {
		var str = self.get_mysql_cap_string();
		return self.c.o.db.query({ b: self.c, str: str, cb: self.insert_cap_cb, xself: self });
	};


	self.get_mysql_cap_string = function() {

		self.data.data = self.c.o.misc.mysql_real_escape_string(self.data.data);
		self.ip_data.data = self.c.o.misc.mysql_real_escape_string(self.ip_data.data);

		var str = "INSERT INTO nodesn.cap VALUES ("
				// id
			+"NULL,"
			+self.box_id+","
				// ts
			+"NULL,"
			+self.pcap.caplen+","
			+"'"+self.iface+"',"
			+"'"+self.ip.saddr+"',"
			+"'"+self.ip.daddr+"',"
				// id
			+self.ip.id+","
				// v
			+self.ip.v+","
				// hl
			+self.ip.hl+","
				// totl
			+self.ip.totl+","
			+self.ip.proto+","
				// cksum
			+self.ip.cksum+","
			+self.tcp.sport+","
			+self.tcp.dport+","
				// flags
			+"'"+self.tcp.flags+"',"
				// seqno
			+self.tcp.seqno+","
				// ackno
			+self.tcp.ackno+","
				// opts
			+"'"+self.tcp.opts+"',"
				// len
			+self.tcp.len+","
				// cksum
			+self.tcp.cksum+","
			+self.udp.sport+","
			+self.udp.dport+","
				// len
			+self.udp.len+","
				// cksum
			+self.udp.cksum+","
				// data
			+"'"+self.data.data+"',"
				// data_len
			+self.data.len+","
				// ip_data
			+"'"+self.ip_data.data+"',"
				// ip_data_len
			+self.ip_data.len
			+")";
		
		//console.log(str);
		return str;
	};



	self.notify_clients_of_summary = function() {
		var w = self.c.sock_io_app.sockets.sockets;

		for(var v in w) {
			var x = w[v];

			if(self.c.o.misc.isnull(x.a.Live) == true) {
				continue;
			}

			var the_config = x.a.Live.config;

			if(self.c.o.misc.isnull(the_config) == false) {
				//console.log("EMITTING.");
				if(the_config.summary == 1) {
					x.a.socket.emit(self.c.o.konst.LIVE_RESP(), {
							op: self.c.o.konst.LIVE_RESP_OP_CAPTURE(),
							op_sub: self.c.o.konst.LIVE_RESP_CAPTURE_SUMMARY(),
							cnt: self.c.pcap.pkt_cnt, sum: self.summary
						}
					);
				}
			}
		}
	}



	self.notify_clients_of_packet = function() {
		/*
		 * Clients can be:
		 *  stopped
		 *  playing
		 * 
		 *  capturing ALL packets
		 *  and/or
		 *  capturing SUMMARY packets
		 */
		var w = self.c.sock_io_app.sockets.sockets;

		for(var v in w) {
			var x = w[v];

			//console.log("uhg2", x.a);

			if(self.c.o.misc.isnull(x.a.Live) == true) {
				continue;
			}

			var the_config = x.a.Live.config;

//			console.log("THE_CONFIG", the_config);

			if(self.c.o.misc.isnull(the_config) == false) {
				//console.log("EMITTING.");
				if(the_config.full == 1) {
					x.a.socket.emit(self.c.o.konst.LIVE_RESP(), 
						{ 
							op: self.c.o.konst.LIVE_RESP_OP_CAPTURE(),
							op_sub: self.c.o.konst.LIVE_RESP_CAPTURE_FULL(),
							cnt: self.c.pcap.pkt_cnt, ip: self.ip, tcp: self.tcp, udp: self.udp 
						}
					);
				}
			}
		}
	};


	self.constructor = function(conf_a,raw_a) {
		self.c       = conf_a;
    	self.raw_pkt = raw_a;
    	self.new_pkt = self.c.o.pcap.decode.packet(self.raw_pkt);

		if(self.c.o.misc.isnull(self.new_pkt) == true) return false;

		self.build();
	}

	return self.constructor(x.b,x.raw);
}



var log_packet = function(x) {
	/* Log a packet to the nodesn:cap table */

	var b = x.b;
	var raw_pkt = x.raw_pkt;

	var psh = new pcap_pseudo({ b: b, raw: raw_pkt });
	psh.dump();

	/*
 	* INSERT capture summary first: These are unique by: ip.saddr, ip.daddr, ip.proto, ip.dport
 	*/
	psh.insert_cap_summary();
	/*
 	* INSERT capture: there can be thousands of these
 	*/
	psh.insert_cap();

	b.pcap.pkt_cnt = b.pcap.pkt_cnt + 1;

	/*
	 * Nofication of each packet is done here. Notification of summary is done in ...summary_cb_save
	 */
	psh.notify_clients_of_packet();

	return true;
}

exports.log_packet = log_packet;



var pcap_init = function() {

	//console.log("PCAP_INIT", b.pcap.ifaces);

console.log("WTF", b.pcap);
sdfo
	for(var v in b.pcap.ifaces) {
		//console.log(b.pcap.ifaces[v]);

		pcap_session = b.o.pcap.createSession(b.pcap.ifaces[v], b.pcap.filter);

		//console.log("Listening on " + pcap_session.device_name);

		pcap_session.iface = b.pcap.ifaces[v];

		pcap_session.on('packet', function (raw_packet) {
    		b.o.pcap_subs.log_packet({ b: b, raw_pkt: raw_packet });
		});
	}
}

exports.load = load;
exports.unload = unload;
exports.pcap_init = pcap_init;












/* IMPORTANT CALLBACKS */

/*** NMAP ***/
/*** TRACEROUTE ***/
var cb_nmap_cb = function(x) {
    //console.log("cb_nmap_cb", x);


        var mysql_str = "";
        x.shell_data = JSON.stringify(x.shell_data);
        x.shell_data = b.o.misc.mysql_real_escape_string(x.shell_data);
        //mysql_str = 'UPDATE cap_summary SET nmap = nmap + "'+x.shell_data+'" where id = '+x.id;
		mysql_str = 'UPDATE cap_summary SET nmap = CONCAT(IFNULL(nmap,""), "'+x.shell_data+'") WHERE id = '+x.id;
        //console.log('MYSQL_STR', mysql_str);

        b.o.db.query({
                b: b,
                str: mysql_str,
                cb: function(errors, rows, fields) {
                                //console.log("added dns:", errors, rows);
                        },
                xself: this,
        });

}

exports.cb_nmap_cb = cb_nmap_cb;

var cb_nmap = function(x) {

    //console.log("cb_nmap", x.ip, x.summary.nmap);

        if(b.o.misc.isnull(x.summary.dns_host) == false || b.o.misc.isnull(x.summary.nmap) == false) {
                /* Only run nmap cb if nmap is null */
                return false;
        }

//      console.log("FUCKKKKKKKKKKKKKKKKKK");

        x.host = x.ip;
        x.nmap_cb = cb_nmap_cb;
		x.nmap_xml = true;
        b.o.sub_nmap.server_nmap(x);
}

exports.cb_nmap = cb_nmap;







/*** TRACEROUTE ***/
var cb_traceroute_cb = function(x) {
	//console.log("cb_traceroute_cb", x);


        var mysql_str = "";
		x.hops = JSON.stringify(x.hops);
        x.hops = b.o.misc.mysql_real_escape_string(x.hops);
        mysql_str = 'UPDATE cap_summary SET traceroute = "'+x.hops+'" where id = '+x.id;
        //console.log('MYSQL_STR', mysql_str);

        b.o.db.query({
                b: b,
                str: mysql_str,
                cb: function(errors, rows, fields) {
                                //console.log("added dns:", errors, rows);
                        },
                xself: this,
        });

}

exports.cb_traceroute_cb = cb_traceroute_cb;


var cb_traceroute = function(x) {

	//console.log("cb_traceroute", x.ip, x.summary.traceroute);

        if(b.o.misc.isnull(x.summary.dns_host) == false || b.o.misc.isnull(x.summary.traceroute) == false) {
                /* Only run traceroute cb if traceroute is null */
                return false;
        }

//      console.log("FUCKKKKKKKKKKKKKKKKKK");

        x.host = x.ip;
        x.traceroute_cb = cb_traceroute_cb;
        b.o.sub_traceroute.server_traceroute(x);
}

exports.cb_traceroute = cb_traceroute;





/*** XGEOIP ***/
var cb_xgeoip_cb = function(x) {
	//console.log("cb_xgeoip_cb", x);

	var mysql_strs = {};

	var mysql_org_str = "";
	var mysql_country_str = "";
	var mysql_city_str = "";

	if(x.xgeoip_data_org) {
		//console.log(x.xgeoip_data_org);

		mysql_org_str = "UPDATE cap_summary SET ";

		var str = x.xgeoip_data_org.split(' ');
		var rest = "";
		var as = "";
		if(str.length > 0) {
			as = str[0];
			//console.log("as=", as);
		}
		if(str.length > 1) {
/*
			rest = str.splice(0,1);
			console.log("rest=", rest);
			rest = rest.replace(/,/g, ' ');
*/
		}

		mysql_org_str = mysql_org_str + ' xgeoip_asnum = "'+as+'", xgeoip_org = "'+x.xgeoip_data_org+'"';
	}

	if(x.xgeoip_data_country) {
		//console.log(x.xgeoip_data_country);

		mysql_country_str = "UPDATE cap_summary SET ";

/*
		for(var v in x.geoip_data_country) {
			if(x.geoip_data_country[v] == undefined) {
				x.geoip_data_contry[v] = null;
			}
		}
*/


		mysql_country_str = mysql_country_str
			+' xgeoip_country = "'+x.xgeoip_data_country.country_name+'"'
			+', xgeoip_country_code = "'+x.xgeoip_data_country.country_code+'"';
	}

	if(x.xgeoip_data_city) {
		//console.log(x.xgeoip_data_city);

		mysql_city_str = "UPDATE cap_summary SET ";

		/* sanitize */
/*
		for(var v in x.geoip_data_city) {
			if(x.geoip_data_city[v] == undefined) {
				x.geoip_data_city[v] = null;
			}
		}
*/

		if(b.o.misc.isnull(x.xgeoip_data_city.city) == true) {
			x.xgeoip_data_city.city = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.region) == true) {
			x.xgeoip_data_city.region = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.postal_code) == true) {
			x.xgeoip_data_city.postal_code = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.continent) == true) {
			x.xgeoip_data_city.continent = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.time_zone) == true) {
			x.xgeoip_data_city.time_zone = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.longitude) == true) {
			x.xgeoip_data_city.longitude = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.latitude) == true) {
			x.xgeoip_data_city.latitude = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.metro_code) == true) {
			x.xgeoip_data_city.metro_code = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.dma_code) == true) {
			x.xgeoip_data_city.dma_code = null;
		}
		if(b.o.misc.isnull(x.xgeoip_data_city.area_code) == true) {
			x.xgeoip_data_city.area_code = null;
		}

		mysql_city_str = mysql_city_str
			+' xgeoip_city = "'+x.xgeoip_data_city.city+'"'
			+', xgeoip_region = "'+x.xgeoip_data_city.region+'"'
			+', xgeoip_postal = '+x.xgeoip_data_city.postal_code
			+', xgeoip_continent = "'+x.xgeoip_data_city.continent+'"'
			+', xgeoip_timezone = "'+x.xgeoip_data_city.time_zone+'"'
			+', xgeoip_long = '+x.xgeoip_data_city.longitude
			+', xgeoip_lat = '+x.xgeoip_data_city.latitude
			+', xgeoip_metro_code = '+x.xgeoip_data_city.metro_code
			+', xgeoip_dma_code = '+x.xgeoip_data_city.dma_code
			+', xgeoip_area_code = '+x.xgeoip_data_city.area_code;



	}

	if(mysql_org_str.length > 0) {	
		mysql_org_str = mysql_org_str + ' WHERE ID = '+x.id;
		mysql_strs['org'] = mysql_org_str;		
	}

	if(mysql_country_str.length > 0) {
		mysql_country_str = mysql_country_str + ' WHERE ID = '+x.id;
		mysql_strs['country'] = mysql_country_str;
	}

	if(mysql_city_str.length > 0) {
		mysql_city_str = mysql_city_str + ' WHERE ID = '+x.id;
		mysql_strs['city'] = mysql_city_str;
	}

//	x.data = b.o.misc.mysql_real_escape_string(x.data);
//	mysql_str = 'UPDATE cap_summary SET whois_ip = "'+x.data+'" where id = '+x.x.id;
	//console.log("MYSQL_STRS", mysql_strs);
	
	for(var v in mysql_strs) {
		b.o.db.query({
			b: b,
			str: mysql_strs[v],
			cb: function(errors, rows, fields) {
					//console.log("added xgeoip:", errors, rows);
				},
			xself: this,
		});
	}

}


var cb_xgeoip = function(x) {
	//console.log("cb_xgeoip", x.ip, x.summary.xgeoip_ip);

	if(b.o.misc.isnull(x.summary.xgeoip_asnum) == false) {
		/* Only run xgeoip cb if xgeoip_asnum is null */
		return false;
	}

	//console.log("FUCKKKKKKKKKKKKKKKKKK");

	x.host = x.ip;
	x.xgeoip_cb = cb_xgeoip_cb;
	b.o.sub_xgeoip.server_xgeoip(x);
}

exports.cb_xgeoip = cb_xgeoip;


/*** WHOIS ***/
var cb_whois_ip_cb = function(x) {
//	console.log("cb_whois_ip_cb", x, x.data);

	var mysql_str = "";	

	x.data = b.o.misc.mysql_real_escape_string(x.data);
	mysql_str = 'UPDATE cap_summary SET whois_ip = "'+x.data+'" where id = '+x.x.id;
	//console.log("MYSQL_STR", mysql_str);
	b.o.db.query({
		b: b,
		str: mysql_str,
		cb: function(errors, rows, fields) {
				//console.log("added dns:", errors, rows);
			},
		xself: this,
	});

}

exports.cb_whois_ip_cb = cb_whois_ip_cb;

var cb_whois_host_cb = function(x) {
//	console.log("cb_whois_host_cb", x);

	var mysql_str = "";
	x.data = b.o.misc.mysql_real_escape_string(x.data);
	mysql_str = 'UPDATE cap_summary SET whois_host = "'+x.data+'" where id = '+x.x.id	;
	//console.log('MYSQL_STR', mysql_str);

	b.o.db.query({
		b: b,
		str: mysql_str,
		cb: function(errors, rows, fields) {
				//console.log("added dns:", errors, rows);
			},
		xself: this,
	});

}

exports.cb_whois_host_cb = cb_whois_host_cb;

var cb_whois_ip = function(x) {

//	console.log("cb_whois_ip", x.ip, x.summary.whois_ip);

	if(b.o.misc.isnull(x.summary.dns_host) == false || b.o.misc.isnull(x.summary.whois_ip) == false) {
		/* Only run whois cb if whois is null */	
		return false;
	}

//	console.log("FUCKKKKKKKKKKKKKKKKKK");

	x.host = x.ip;
	x.whois_cb = cb_whois_ip_cb;
	b.o.sub_whois.server_whois(x);
}

exports.cb_whois_ip = cb_whois_ip;


var cb_whois_host = function(x) {
	/*** this comes from cb_dns, so.. ***/
//	console.log("cb_whois_host", x);

/*
	if(b.o.misc.isnull(x.summary.dns_host) == false) {
		* Only run whois cb if dns_host is null *
		return false;
	}
*/
	if(b.o.misc.isnull(x.host) == true) {
		return false;
	}

	x.whois_cb = cb_whois_host_cb;
	b.o.sub_whois.server_whois(x);

}

exports.cb_whois_host = cb_whois_host;





/*** DNS ***/
var cb_dns = function(x) {
//	console.log("cb_dns:", x);

	if(b.o.misc.isnull(x.dns_host) == false) {
		/* Only run dns cb if dns_host is null */
		return false;
	}

	b.o.dns.reverse(x.summary.ip_saddr, function(err, domains) {
		//console.log("cb_dns reverse", err, domains);

		if(err) {
			/*throw err; */
		}


		var mysql_str = "";
		var host_str = "unknown";
		if(b.o.misc.isnull(domains) == true) {
			host_str = "unknown";
		} 
		else {
			if(domains.length == 0) {
				host_str = "unknown";
			}
			else {
				host_str = domains;
			}
		}

		//host_str = b.o.misc.mysql_real_escape_string(host_str);
		mysql_str = 'UPDATE cap_summary SET dns_host = "'+host_str+'" where id = '+x.id;

		b.o.db.query({
			b: b,
			str: mysql_str,
			cb: function(errors, rows, fields) {
					//console.log("added dns:", errors, rows);
				},
			xself: this,
		});

/*
Resolves a domain (e.g. 'google.com') into an array of the record types specified by rrtype. Valid rrtypes are 'A' (IPV4 addresses, default), 'AAAA' (IPV6 addresses), 'MX' (mail exchange records), 'TXT' (text records), 'SRV' (SRV records), 'PTR' (used for reverse IP lookups), 'NS' (name server records) and 'CNAME' (canonical name records).
*/

		if(host_str != "unknown") {
			/* ADD TXT RECORD */

			b.o.dns.resolve(domains[0], 'TXT',function(err, data) {
				//console.log("cb_dns txt resolve", domains[0], err, data);	

				if(err || b.o.misc.isnull(data) == true) {
					return false;
				}

				//console.log("FCK dns_txt", data);
				//data = b.o.misc.mysql_real_escape_string(data);
				mysql_str = 'UPDATE cap_summary SET dns_txt = "'+data+'" where id = '+x.id;

				b.o.db.query({
					b: b,
					str: mysql_str,
					cb: function(errors, rows, fields) {
							//console.log("added txt:", errors, rows);
						},
					xself: this,
				});
			});	
		}


		/* run whois_host on the reverse ip */
		x.host = host_str[0];
		x.host = b.o.misc.extract_domain(x.host);

		//console.log("x.host", x.host);
		cb_whois_host(x);

	});
}

exports.cb_dns = cb_dns;
