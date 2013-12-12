var b = {};

var load = function(x) {

	b = x.b;
}

var unload = function() {
}

var boot = function(x) {
	
	//console.log("uhg", b.o.konst.DB_OPS_OP_BOOT, b.o.konst.DB_OPS_SUBOP_STARTUP);

	/* SET PCAP FILTER STRING */
	get_filters(b.o.pcap_subs.pcap_init);

	b.mysql_c.query(
		"INSERT INTO ops VALUES(NULL, NULL, "
			+b.o.konst.DB_OPS_OP_BOOT()+
			", "
			+b.o.konst.DB_OPS_SUBOP_BOOT_STARTUP()+
			")", function(errors, rows, fields) {

    	//console.log(errors, rows, fields);
	});
}


var shutdown = function(x) {

	var b = x.b;

	b.mysql_c.query(
		"INSERT INTO ops VALUES(NULL, NULL, "
			+b.o.konst.DB_OPS_OP_BOOT()+
			", "
			+b.o.konst.DB_OPS_SUBOP_BOOT_SHUTDOWN()+
			")", function(errors, rows, fields) {
		//console.log(errors, rows, fields);
	});
}



var query = function(x) {

	var b = x.b;
	var str = x.str;

	/*
	 * Needed this, very important. Otherwise, when performing async cb's in loops,
	 * we weren't able to pull each value from the loop, we'd get the 'last value
	 */
	var args = x.args;

	b.mysql_c.query(str, function(errors, rows, fields) {
		//console.log("db.query:", errors, rows, fields);

		if(b.o.misc.isnull(x.cb) == false) {
			x.cb(x.xself, {errors: errors, rows: rows, fields: fields, args: args});
		}

		}
	);
}

exports.query = query;


var get_filters = function(cb) {

	b.mysql_c.query(
		"SELECT * FROM filters", function(errors, rows, fields) {
			//console.log("WTF", errors, rows, fields);

			if(b.o.misc.isnull(errors) == false) {
				//console.log("get_filters: errors: exiting");
				process.exit(0);
			}

			var l = false;
			for(var k in rows) {
				//console.log("WTF:", rows[k].text);
				if(l == false) {
					b.pcap.filter = b.pcap.filter + rows[k].text;
					l = true;
				}
				else {
					b.pcap.filter = b.pcap.filter + " and " + rows[k].text;
				}
			}

			//console.log("WTF:", b.pcap.filter);
			cb(b);
		}
	);
}

exports.get_filters = get_filters;



/*
var authenticate_user = function(x) {

	var b = x.b;
	var cb = x.cb;
	var user = x.user;
	var pass = x.pass;
	var cb_success = x.cb_success;
	var cb_failure = x.cb_failure;

	console.log("WTF", x);

	b.mysql_c.query("SELECT * FROM users WHERE user LIKE '" + user + "' LIMIT 1", 
		function(errors, rows, fields) {
			console.log("rows", rows);	

			if(rows) {
				var row = rows[0];

				if(pass == rows[0].pass) {
					cb_success();
				}
				else {
					cb_failure();
				}
			}	
			else {
				cb_failure();
			}
		}
	);

}
*/

exports.load = load;
exports.unload = unload;
exports.boot = boot;
exports.shutdown = shutdown;
//exports.authenticate_user = authenticate_user;
