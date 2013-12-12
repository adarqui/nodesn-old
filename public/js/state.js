//if(typeof exports === 'undefined') exports = [];

/*
 * This handles client state
 */

function CoreState(x) {

	var self = this;
	self.socket = x.socket;
	self.config_client = x.config_client;

	self.load = function() {

		//console.log("coreState loaded");

	/*
	 * IMPORTANT SOCKET EVENTS
	 *
	 *  we need to know our status at all times
	 */
	self.config_client.handlers.insert(self, 'connect', self.connect);
	self.config_client.handlers.insert(self, 'disconnect', self.disconnect);
	self.config_client.handlers.insert(self, 'connect_failed', self.connect_failed);
	self.config_client.handlers.insert(self, 'reconnect', self.reconnect);
	self.config_client.handlers.insert(self, 'reconnecting', self.reconnecting);
	self.config_client.handlers.insert(self, 'reconnect_failed', self.reconnect_failed);
	self.config_client.handlers.insert(self, 'error', self.error);

	}

	self.unload = function() {
	}


	self.connect = function(ev) {
		self.config_client.state = STATE_CONNECT();
		//console.log("yyy: connect");
	}

	self.connecting = function(ev) {
		self.config_client.state = STATE_CONNECTING();
		//console.log("yyy: connecting", self.config_client);
	}

	self.disconnect = function(ev) {
		//console.log("yyy: disconnect", self.config_client);
		self.config_client.state = STATE_DISCONNECT();

		/*
		 * Remove the navbar pull handler
		 */
		self.config_client.handlers.remove("resp_tabs_navbarResult");
	}

	self.connect_failed = function(ev) {
		self.config_client.state = STATE_CONNECT_FAILED();
		//console.log("yyy: connect_failed");
	}

	self.reconnect = function(ev) {
		self.config_client.state = STATE_RECONNECT();
		//console.log("yyy: reconnecting", self.config_client);
	}

	self.reconnecting = function(ev) {
		self.config_client.state = STATE_RECONNECTING();
		//console.log("yyy: reconnecting");
	}

	self.reconnect_failed = function(ev) {
		self.config_client.state = STATE_RECONNECT_FAILED();
		//console.log("yyy: reconnect_failed");
	}

	self.error = function(ev) {
		self.config_client.errors = this.config_client.errors + 1;
		//console.log("yyy: error");
	}

	self.load();
}
