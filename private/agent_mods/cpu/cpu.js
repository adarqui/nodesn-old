/*
 *
 * cpu module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;

	self.interval = 5;

	self.load = function() {

		console.log("cpu loaded!");

		self.x_socket.on(self.x_b.o.konst.CPU_REQ(), function(data) {
			self.handle_req_modcpu({data:data});
		});

		self.timer = setInterval(self.timer, self.interval * 1000);
	}


	self.update = function(x) {
/*
		console.log("updated");
		self.x_b = x.b;
		self.x_socket = b.cli_sock;
*/
	}


	self.unload = function() {

		/*
		 * WE __MUST__ REMOVE ALL TIMERS & EVENT LISTENERS
		 */

		clearInterval(self.timer);

		self.x_socket.removeListener(self.x_b.o.konst.CPU_REQ(), function() 
			{ console.log("CPU_REQ REMOVED"); 
		});

	}


	self.resp_modcpu = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modcpu");
		self.x_socket.emit('resp_modcpu', { res: rs });
	}



	self.handle_req = function(x) {

		/* USER CAN CONTROL POLLING INTERVALS ETC */
		var data = x.data;
	
		console.log("handle_req_modcpu");

//		self.resp_modcpu({ data: data });
	}


	self.timer = function() {
		console.log("timer!");

/*
		var cpus = self.x_b.o.os.cpus();

		console.log(cpus);
*/

/*
		self.x_b.o.os_utils.cpuUsage(function(data) {
			console.log("cpuusage", data);
		});

		self.x_b.o.os_utils.cpuFree(function(data) {
			console.log("cpufree", data);
		});
*/

		var cpuinfo = {
			freemem: self.x_b.o.os_utils.freemem(),
			totalmem: self.x_b.o.os_utils.totalmem(),
			loadavg1: self.x_b.o.os_utils.loadavg(1),
			loadavg5: self.x_b.o.os_utils.loadavg(5),
			loadavg15: self.x_b.o.os_utils.loadavg(15),
			uptime: self.x_b.o.os_utils.sysUptime(),
			freememPercentage: self.x_b.o.os_utils.freememPercentage(),
		};

		//console.log("fm", fm, "tm", tm,  "loadavg1", l1, "loadavg5", l5, "loadavg15", l15, "uptime", su);
		self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
			op: self.x_b.o.konst.AGENTS_RESP_OP_CPUINFO(),
			data: cpuinfo,
		});

	}


/* end */
self.load();
}
