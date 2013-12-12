function CoreHandlers(a) {

	var self = this;

	//console.log("core handlers", a);

	self.socket_handlers =
		[
		];

	self.socket = a;

	self.set_socket = function(a) {
		self.socket = a;
	}

	self.load = function() {
	}

	self.unload = function() {
	}


	self.insert = function(xself, channel, handler) {

		if(isnull(channel) || isnull(handler)) return false;

		if(typeof self.socket === 'undefined') return false;

		self.socket_handlers[channel] = { ev: channel, handler: handler };	
		self.socket.on(channel, function(data) {handler(xself, data)});
	}


	self.remove = function(channel) {
		
		if(isnull(channel)) return false;

		//console.log("zzz handlers.remove", channel);

		if(isnull(self.socket_handlers[channel])) return false;

		if(typeof self.socket === 'undefined') return false;

		//console.log("zzz", self.socket_handlers[channel]);

		self.socket.removeListener(channel, self.socket_handlers[channel].handler);
		self.socket_handlers[channel] = { ev: channel, handler: function() { }};
		//self.socket.on(channel, function() {});
	}


self.load();
}
