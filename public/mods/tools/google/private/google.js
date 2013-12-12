/*
 *
 * Google module : Private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on('req_modGoogle', function(data) {
			self.handle_req_modGoogle({data:data});
		});
	}


	self.unload = function() {
	}


	self.resp_modGoogle = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		console.log("resp_modGoogle");
		self.x_socket.emit('resp_modGoogle', { res: rs, data: data });
	}


	self.handle_req_modGoogle = function(x) {

		var data = x.data;

		console.log("handle_req_modGoogle", x);

		self.x_b.o.google.resultsPerPage = 50;
		var res = self.x_b.o.google(data.host, function(error, next, links) {

			if(error) {
				console.error(error);
			}

/*
			for(var i = 0; i < links.length; i++) {
				console.log(links[i].title + ' - ' + links[i].link + ' - ' + links[i].description);
			}
*/
			console.log("links", links);

			self.resp_modGoogle({ data: links });

		});

	}

/* end */
self.load();
}
