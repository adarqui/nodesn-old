/*
 *
 * profile module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;

	self.profile = {};


	self.load = function() {

		console.log("profile loaded!");

		self.x_socket.on(self.x_b.o.konst.PROFILE_REQ(), function(data) {
			self.handle_req_modprofile({data:data});
		});

/*
		self.timer = setInterval(self.timer, self.interval * 1000);
*/

//		self.emit_profile();
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

/*
		clearInterval(self.timer);
*/

		self.x_socket.removeListener(self.x_b.o.konst.PROFILE_REQ(), function() 
			{ console.log("PROFILE_REQ REMOVED"); 
		});

	}


	self.resp_modprofile = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modprofile");
		self.x_socket.emit('resp_modprofile', { res: rs });
	}



	self.handle_req = function(x) {

		/* USER CAN CONTROL POLLING INTERVALS ETC */
		var data = x.data;
	
		console.log("handle_req_modprofile");

//		self.resp_modprofile({ data: data });
	}


	self.emit_profile = function() {

/*
		var profiles = self.x_b.o.os.profiles();

		console.log(profiles);
*/

/*
		self.x_b.o.os_utils.profileUsage(function(data) {
			console.log("profileusage", data);
		});

		self.x_b.o.os_utils.profileFree(function(data) {
			console.log("profilefree", data);
		});
*/

		var profileinfo = {
			hostname: self.x_b.o.os.hostname(),
			type: self.x_b.o.os.type(),
			platform: self.x_b.o.os.platform(),
			arch: self.x_b.o.os.arch(),
			release: self.x_b.o.os.release(),
			uptime: self.x_b.o.os.uptime(),
			totalmem: self.x_b.o.os.totalmem(),
			cpus: self.x_b.o.os.cpus(),
			interfaces: self.x_b.o.os.networkInterfaces(),
		};

		self.profile = profileinfo;

		console.log("PROFILEINFO", profileinfo);

		//console.log("fm", fm, "tm", tm,  "loadavg1", l1, "loadavg5", l5, "loadavg15", l15, "uptime", su);
		self.x_socket.emit(self.x_b.o.konst.AGENTS_RESP(), {
			op: self.x_b.o.konst.AGENTS_RESP_OP_PROFILE(),
			data: profileinfo,
		});

	}


/* end */
self.load();
}
