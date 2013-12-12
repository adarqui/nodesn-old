/* Misc routines */

if(typeof exports === 'undefined') exports = [];


/*
 * isnull()
 */
isnull = function(obj) {
	if(!obj) { return true; }
	if(typeof obj === 'undefined') { return true; }
	if(typeof obj == 'null') { return true; }
	if(obj == []) { return true; }
	return false;
}

exports.isnull = isnull;



/*
 * get_rand_bytes()
 */
get_rand_bytes = function(howMany) {
  var fs= require('fs');
  var bytes= new Buffer(howMany);
  var fd= fs.openSync('/dev/urandom', 'r');
  fs.readSync(fd, bytes, 0, howMany, null);
  fs.closeSync(fd)
  return bytes;
}

exports.get_rand_bytes = get_rand_bytes;




/*
 * get_rand_string2()
 */
var get_rand_string2 = function() {
	var t = Math.random().toString(36).substring(7);
	return t;
}

exports.get_rand_string2 = get_rand_string2;




/*
 * get_rand_string()
 */
var get_rand_string = function() {
	require('crypto').randomBytes(48, function(ex, buf) {
		var token = buf.toString('hex');
	});
}

exports.get_rand_string = get_rand_string;





/*
 * mysql_real_escape_string()
 */
mysql_real_escape_string = function(str) {

	if(isnull(str) == true) return false;

	return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
		switch(char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\"":
			case "'":
			case "\\":
			case "%":
				return "\\" + char;
		}
	});
}

exports.mysql_real_escape_string = mysql_real_escape_string;




/* 
 * queue routines, for input up/down also 
 */
var Queue = function(arg){
var self = this;
self.cur=0;
self.queue  = [];
self.offset = 0;
//var max = arg;
self.arg = arg;
self.config = {
	max: 100,
	/* false to disable back to back dups */
	dups: true
}

self.load = function() {

	//console.log("fucking shit", self.arg);

	if(isnull(self.arg) == true) return false;

	if(typeof self.arg.dups !== undefined) { 
		//console.log("dups"); 
		self.config.dups = self.arg.dups; 
	}
	if(self.arg.max !== undefined) { //console.log("max"); 
		self.config.max = self.arg.max; 
	}

	//console.log("config", self.config);
}

self.getElms = function() {
		return queue;
}

self.cleanElms = function() {
	self.cur = self.getLength();
	if(self.cur > self.config.max) {
		for(var v in self.cur - self.config.max) {
		self.queue.dequeue();
		}
	}
	return true;
}

self.getLength = function(){
	return (self.queue.length - self.offset);
}

self.isEmpty = function(){
	return (self.queue.length == 0);
}

self.enqueue = function(item){


	//console.log("enqueue", "peek", self.peek(), "peekhead", self.peekHead(), "item", item, self.getLength());

	//console.log("config",self.config);
	if((self.peekHead() == item) && self.config.dups == false)  
		{ self.cur = self.queue.length; return false; }

	self.queue.push(item);
	self.cur = self.queue.length;
}

self.dequeue = function(){
	if (self.queue.length == 0) return undefined;
	var item = self.queue[offset];
	if (++ self.offset * 2 >= self.queue.length){
		self.queue  = self.queue.slice(self.offset);
		self.offset = 0;
	}
	self.cur = self.queue.length;
	return item;
}

self.peek = function(){
	//console.log("queue offset=", self.offset);
	return (self.queue.length > 0 ? self.queue[self.offset] : undefined);
}

self.peekHead = function() {
	return (self.queue.length > 0 ? self.queue[self.queue.length - 1] : undefined);
}

self.up = function() {
	if(self.queue.length == 0) return undefined;
	
	/*if(self.cur >= self.queue.length) return self.queue[self.queue.length];  */
	//console.log("stuff", self.cur, self.queue.length);
	if(self.cur >= self.queue.length) return '';
	
	self.cur = self.cur + 1;
	return self.queue[self.cur];
}

self.down = function() { 
	if(self.queue.length == 0) return undefined;

/*	if(self.cur == 0) return self.queue[0]; */
	if(self.cur == 0) return '';

	self.cur = self.cur - 1;
	return self.queue[self.cur];
}


self.load();
}

exports.Queue = Queue;





/*
 * up_and_down()
 */
var up_and_down = function(s, e, code, cb_up, cb_down) {
	//console.log("up_and_down:", code);
	if(code == 38) {
		/* up */
		//e.preventDefault();
		cb_up(s,e);
	}
	else if(code == 40) {
		/* down */
		//e.preventDefault();
		cb_down(s,e);
	}
}


exports.up_and_down = up_and_down;






/*
 * filter()
 */
var filter = function(str) {
        return str.replace(/\s(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, " <a href='$1' target='_blank'>$1</a>") ;
}







/*
 * replace_nl_with_br()
 */
var replace_nl_with_br = function(data) {
	return data.replace(/[\r\n]/g,"<br/>");	
}

exports.replace_nl_with_br = replace_nl_with_br;






/*
 * have_storage()
 */
var have_storage = function() {

	if (typeof(Storage) !== "undefined" && localStorage) { 
		return true;
	}
	return false;
}


exports.have_storage = have_storage;





/*
 * xxx_add : for central mods
 */
var xxx_add = function(obj) {
	//console.log("OBJ:", obj, obj.config_client);
	if(isnull(obj.config_client[obj.category]) == true) {
		obj.config_client[obj.category] = {};
	}

	obj.config_client[obj.category][obj.name] = obj;
}


var xxx_del = function(obj) {
	obj.config_client[obj.category][obj.name] = {};
}





/*
 * extract domain
 */
var extract_domain = function(host) {

	if(isnull(host) == true) {
		return null;
	}

	var delim = host.split('.');
	if(delim.length < 2) {
		return null;
	}

	var dom = delim[delim.length-2] + '.' + delim[delim.length-1];

	return dom;
}

exports.extract_domain = extract_domain;



/*
 * MYSQL DATE - found on stackoverflow
 */
function mysqlTimeStampToDate(timestamp) {
	//function parses mysql datetime string and returns javascript Date object
	//input has to be in this format: 2007-06-05 15:26:02
	var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
	var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
	return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
}

function parse_date(string) {
	var date = new Date();
	var parts = String(string).split(/[- :]/);

	date.setFullYear(parts[0]);
	date.setMonth(parts[1] - 1);
	date.setDate(parts[2]);
	date.setHours(parts[3]);
	date.setMinutes(parts[4]);
	date.setSeconds(parts[5]);
	date.setMilliseconds(0);

//	return date;
	//console.log("guh", date);
	return date.getTime();
}




/*
 * protect from dangerous strings when exec'n stuff
 */
function string_issafe(str) {
	if (! /^[a-zA-Z0-9.]+$/.test(str)) {
    	// Validation failed
		return false;
	}
	return true;
}

exports.string_issafe = string_issafe;




/*
 * SPECIAL SOCKET LOOPER 
 */
socket_looper = function(x) {

	/*
	 * x.cb
	 * x.x_b
	 * x.my_socket
	 */

	//console.log("omfg wtf2");

	var sockets = x.x_b.sock_io_app.sockets.sockets;

	for(var v in sockets) {

		var socket = sockets[v];

		if(x.notify_self != true) {
			if(x.my_socket == socket) {
				//console.log("omfg wtf44");
				continue;
			}
		}

		//console.log("omfg wtf3");

		x.cb({socket: socket, data: x.data});

	}

}

exports.socket_looper = socket_looper;



/*
 * SPECIAL NOTIFY FUNCTION
 */
    notify = function(zzz) {

		var x_b = zzz.b;
		var resp = zzz.resp;
		var data = zzz.data;
		var type = zzz.type;

        var w = x_b.sock_io_app.sockets.sockets;

        for(var v in w) {
            var x = w[v];

/*
            if(x_b.o.misc.isnull(x.a.Live) == true) {
                continue;
            }
*/

/*
            var the_config = x.a.Live.config;
*/

/*
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
*/
			
			var tog = 0;
			for(var z_type in type) {
				if(x.a.connection.user.gid == type[z_type]) {
					// Only relay info to the specified type..
					tog = 1;
					break;
			}
			}

			if(tog != 1) continue;

			x.a.socket.emit(resp, data);
//			//console.log("WTF...", x.a.connection.user);

        }
    }


exports.notify = notify;






/*
 * Basic live chart 
 */
basic_live_chart = function(x) {
        var ch = new Highcharts.Chart({
            chart: {
                renderTo: x.renderto, 
//              renderTo: 'fuckoff',
                type: 'spline',
                marginRight: 10,
/*
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
*/
            },
            title: {
                text: x.title, 
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
            series: /*[
			{
                name: x.series_name,
                data: []
            },
			{
				name: x.series_name,
				data: []
			},
			],
*/
			x.series,
        });


//w.chart.series[0].addPoint([2, 2], true, 0);

	return ch;
    }

exports.basic_live_chart = basic_live_chart;
