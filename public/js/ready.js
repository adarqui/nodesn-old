var socket;
var config_client = {};
config_client.navbar_layout = {};


$(document).ready(function() {


	config_client = {
		state: STATE_NOTHING(),
		authenticated: STATE_UNAUTHENTICATED(),
		navbar_pulled: 0,
		errors: 0,
//		tools: {},
		navbar_rid: 0,
		nomore: false,
	};

	//console.log("document.ready");

/*
    $('body').delegate('.navbar', 'click', navbar_handle_click);
*/

	socket = io.connect(null);
	config_client.socket = socket;

/*
	socket.on('resp_packet', function() {
		//console.log("fuck");
	});
*/


	handlers = new CoreHandlers(socket);
	config_client.handlers = handlers;

	auth = new CoreAuth({
		socket: socket,
		config_client: config_client,
	});
	config_client.auth = auth;
	

	navbar = new CoreNavbar({
		socket: socket,
		html_base: "#tabs-",
		config_client: config_client,
		prefix: "tabs",
		navbar: "navbar_div",
		type: "tabs",
		}
	);
	config_client.navbar = navbar;


/*
	handlers.insert(navbar, "resp_tabs_navbarResult", navbar.handle_resp);
*/


	state = new CoreState({
		socket: socket,
		config_client: config_client,
	});
	config_client.state = state;


	/*
	 * IMPORTANT SOCKET EVENTS
	 *
	 *  we need to know our status at all times
	 */
/*
	handlers.insert(state, 'connect', state.connect);
	handlers.insert(state, 'disconnect', state.disconnect);
	handlers.insert(state, 'connect_failed', state.connect_failed);
	handlers.insert(state, 'reconnect', state.reconnect);
	handlers.insert(state, 'reconnecting', state.reconnecting);
	handlers.insert(state, 'reconnect_failed', state.reconnect_failed);
	handlers.insert(state, 'error', state.error);
*/

});
