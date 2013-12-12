if(typeof exports === 'undefined') exports = [];

/* consts/variables etc */
var STATE_NOP = function() { return 0; }
var STATE_UNAUTHENTICATED = function() { return 0; }
var STATE_AUTHENTICATED = function() { return 1; }

exports.STATE_NOP = STATE_NOP;
exports.STATE_UNAUTHENTICATED = STATE_UNAUTHENTICATED;
exports.STATE_AUTHENTICATED = STATE_AUTHENTICATED;



/* DB: nodejs, TABLE: ops */
var DB_OPS_OP_BOOT = function() { return 1; }
var DB_OPS_SUBOP_BOOT_STARTUP = function() { return 0; }
var DB_OPS_SUBOP_BOOT_SHUTDOWN = function() { return 1; }

exports.DB_OPS_OP_BOOT = DB_OPS_OP_BOOT;
exports.DB_OPS_SUBOP_BOOT_STARTUP = DB_OPS_SUBOP_BOOT_STARTUP;
exports.DB_OPS_SUBOP_BOOT_SHUTDOWN = DB_OPS_SUBOP_BOOT_SHUTDOWN;


/* PCAP DEFS */
var IP_PROTO_UDP = function() { return 17; }
var IP_PROTO_TCP = function() { return 6; }
exports.IP_PROTO_UDP = IP_PROTO_UDP;
exports.IP_PROTO_TCP = IP_PROTO_TCP;


/* CONFIG DEFS */
var CONFIG_PATH_MODS = function() { return "/mods/"; }
exports.CONFIG_PATH_MODS = CONFIG_PATH_MODS;



/* USER GROUPS */
var USER_GROUP_ADMIN = function() { return 0; }
var USER_GROUP_AGENT = function() { return 1; }
var USER_GROUP_GUEST = function() { return 2; }
exports.USER_GROUP_ADMIN = USER_GROUP_ADMIN;
exports.USER_GROUP_AGENT = USER_GROUP_AGENT;
exports.USER_GROUP_GUEST = USER_GROUP_GUEST;



/* STATE DEFS */
var STATE_NOTHING = function() { return 0; }
var STATE_CONNECT = function() { return 1; }
var STATE_CONNECTING = function() { return 2; }
var STATE_CONNECT_FAILED = function() { return 3; }
var STATE_DISCONNECT = function() { return 4; }
var STATE_RECONNECT = function() { return 5; }
var STATE_RECONNECTING = function() { return 6; }
var STATE_RECONNECT_FAILED = function() { return 7; }
var STATE_ERROR = function() { return 8; }

exports.STATE_NOTHING = STATE_NOTHING;
exports.STATE_CONNECT = STATE_CONNECT;
exports.STATE_CONNECTING = STATE_CONNECTING;
exports.STATE_CONNECT_FAILED = STATE_CONNECT_FAILED;
exports.STATE_DISCONNECT = STATE_DISCONNECT;
exports.STATE_RECONNECT = STATE_RECONNECT;
exports.STATE_RECONNECTING = STATE_RECONNECTING;
exports.STATE_ERROR = STATE_ERROR;



/* STORAGE */
var STORAGE_LOGIN_COOKIE = function() { return "nodesn_login_cookie"; }
exports.STORAGE_LOGIN_COOKIE = STORAGE_LOGIN_COOKIE;



/*
 * Authorization
 */
var AUTH_REQ = function() { return "req_auth"; }
var AUTH_RESP = function() { return "resp_auth"; }
exports.AUTH_REQ = AUTH_REQ;
exports.AUTH_RESP = AUTH_RESP;

var AUTH_RESP_OP_NEED_LOGIN = function() { return 1; }
exports.AUTH_RESP_OP_NEED_LOGIN = AUTH_RESP_OP_NEED_LOGIN;


/*
 * Same as above kinda, LOGIN
 */
var LOGIN_REQ = function() { return "req_login"; }
var LOGIN_RESP = function() { return "resp_login"; }
exports.LOGIN_REQ = LOGIN_REQ;
exports.LOGIN_RESP = LOGIN_RESP;

var LOGIN_REQ_OP_AUTHENTICATE = function() { return 1; }
exports.LOGIN_REQ_OP_AUTHENTICATE = LOGIN_REQ_OP_AUTHENTICATE;

var LOGIN_RESP_OP_AUTHENTICATE = function() { return 1; }
exports.LOGIN_RESP_OP_AUTHENTICATE = LOGIN_RESP_OP_AUTHENTICATE;




/*
 * NAVBAR
 */
var NAVBAR_REQ = function() { return "req_navbar"; }
exports.NAVBAR_REQ = NAVBAR_REQ;

var NAVBAR_REQ_OP_NEED_NAVBAR = function() { return 1; }
exports.NAVBAR_REQ_OP_NEED_NAVBAR = NAVBAR_REQ_OP_NEED_NAVBAR;



/*
 * Packets/Live ops
 */
var LIVE_REQ = function() { return "req_live"; }
var LIVE_RESP = function() { return "resp_live"; }
exports.LIVE_REQ = LIVE_REQ;
exports.LIVE_RESP = LIVE_RESP;

var LIVE_REQ_OP_NONE = function() { return 0; }
var LIVE_REQ_OP_CAPTURE = function() { return 1; }
var LIVE_REQ_OP_STATE = function() { return 2; }
exports.LIVE_REQ_OP_NONE = LIVE_REQ_OP_NONE;
exports.LIVE_REQ_OP_CAPTURE = LIVE_REQ_OP_CAPTURE;
exports.LIVE_REQ_OP_STATE = LIVE_REQ_OP_STATE;

var LIVE_RESP_OP_NONE = function() { return 0; }
var LIVE_RESP_OP_CAPTURE = function() { return 1; }
var LIVE_RESP_OP_STATE = function() { return 2; }
exports.LIVE_RESP_OP_NONE = LIVE_RESP_OP_NONE;
exports.LIVE_RESP_OP_CAPTURE = LIVE_RESP_OP_CAPTURE;
exports.LIVE_RESP_OP_STATE = LIVE_RESP_OP_STATE;

// req subops
var LIVE_REQ_CAPTURE_FULL = function() { return 1; }
var LIVE_REQ_CAPTURE_SUMMARY = function() { return 2; }
var LIVE_REQ_CAPTURE_FULL_OFF = function() { return 3; }
var LIVE_REQ_CAPTURE_SUMMARY_OFF = function() { return 4; }
exports.LIVE_REQ_CAPTURE_FULL = LIVE_REQ_CAPTURE_FULL;
exports.LIVE_REQ_CAPTURE_SUMMARY = LIVE_REQ_CAPTURE_SUMMARY;
exports.LIVE_REQ_CAPTURE_FULL_OFF = LIVE_REQ_CAPTURE_FULL_OFF;
exports.LIVE_REQ_CAPTURE_SUMMARY_OFF = LIVE_REQ_CAPTURE_SUMMARY_OFF;

var LIVE_REQ_STATE_NONE = function() { return 0; }
var LIVE_REQ_STATE_PLAY = function() { return 1; }
var LIVE_REQ_STATE_STOP = function() { return 2; }
exports.LIVE_REQ_STATE_NONE = LIVE_REQ_STATE_NONE;
exports.LIVE_REQ_STATE_PLAY = LIVE_REQ_STATE_PLAY;
exports.LIVE_REQ_STATE_STOP = LIVE_REQ_STATE_STOP;


// resp subops
var LIVE_RESP_CAPTURE_FULL = function() { return 1; }
var LIVE_RESP_CAPTURE_SUMMARY = function() { return 2; }
exports.LIVE_RESP_CAPTURE_FULL = LIVE_RESP_CAPTURE_FULL;
exports.LIVE_RESP_CAPTURE_SUMMARY = LIVE_RESP_CAPTURE_SUMMARY;






/*
 * CentralGraphs ops
 */
var CENTRALGRAPHS_REQ = function() { return "req_centralgraphs"; }
var CENTRALGRAPHS_RESP = function() { return "resp_centralgraphs"; }
exports.CENTRALGRAPHS_REQ = CENTRALGRAPHS_REQ;
exports.CENTRALGRAPHS_RESP = CENTRALGRAPHS_RESP;

var CENTRALGRAPHS_REQ_OP_NONE = function() { return 0; }
var CENTRALGRAPHS_REQ_OP_GENERATE = function() { return 1; }
exports.CENTRALGRAPHS_REQ_OP_NONE = CENTRALGRAPHS_REQ_OP_NONE;
exports.CENTRALGRAPHS_REQ_OP_GENERATE = CENTRALGRAPHS_REQ_OP_GENERATE;

var CENTRALGRAPHS_RESP_OP_NONE = function() { return 0; }
var CENTRALGRAPHS_RESP_OP_GENERATE = function() { return 1; }
exports.CENTRALGRAPHS_RESP_OP_NONE = CENTRALGRAPHS_RESP_OP_NONE;
exports.CENTRALGRAPHS_RESP_OP_GENERATE = CENTRALGRAPHS_RESP_OP_GENERATE;

var CENTRALGRAPHS_REQ_SUBOP_NONE = function() { return 0; }
exports.CENTRALGRAPHS_REQ_SUBOP_NONE = CENTRALGRAPHS_REQ_SUBOP_NONE;

var CENTRALGRAPHS_REQ_SUBOP_GENERATE_NONE = function() { return 0; }
var CENTRALGRAPHS_REQ_SUBOP_GENERATE_COUNTRIES = function() { return 1; }
exports.CENTRALGRAPHS_REQ_SUBOP_GENERATE_NONE = CENTRALGRAPHS_REQ_SUBOP_GENERATE_NONE;
exports.CENTRALGRAPHS_REQ_SUBOP_GENERATE_COUNTRIES = CENTRALGRAPHS_REQ_SUBOP_GENERATE_COUNTRIES;

var CENTRALGRAPHS_RESP_SUBOP_GENERATE_NONE = function() { return 0; }
var CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES = function() { return 1; }
var CENTRALGRAPHS_RESP_SUBOP_GENERATE_PROTOCOLS = function() { return 2; }
var CENTRALGRAPHS_RESP_SUBOP_GENERATE_DPORT = function() { return 3; }
var CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES_NAME = function() { return 4; }
exports.CENTRALGRAPHS_RESP_SUBOP_GENERATE_NONE = CENTRALGRAPHS_RESP_SUBOP_GENERATE_NONE;
exports.CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES = CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES;
exports.CENTRALGRAPHS_RESP_SUBOP_GENERATE_PROTOCOLS = CENTRALGRAPHS_RESP_SUBOP_GENERATE_PROTOCOLS;
exports.CENTRALGRAPHS_RESP_SUBOP_GENERATE_DPORT = CENTRALGRAPHS_RESP_SUBOP_GENERATE_DPORT;
exports.CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES_NAME = CENTRALGRAPHS_RESP_SUBOP_GENERATE_COUNTRIES_NAME;





/*
 * NMAP
 */
var NMAP_REQ = function() { return "req_nmap"; }
var NMAP_RESP = function() { return "resp_nmap"; }
exports.NMAP_REQ = NMAP_REQ;
exports.NMAP_RESP = NMAP_RESP;


/*
 * Diagnostics
 */
var DIAGNOSTICS_REQ = function() { return "req_diagnostics"; }
var DIAGNOSTICS_RESP = function() { return "resp_diagnostics"; }
exports.DIAGNOSTICS_REQ = DIAGNOSTICS_REQ;
exports.DIAGNOSTICS_RESP = DIAGNOSTICS_RESP;

var DIAGNOSTICS_REQ_OP_GENERATE = function() { return 1; }
var DIAGNOSTICS_REQ_OP_FIX = function() { return 2; }
exports.DIAGNOSTICS_REQ_OP_GENERATE = DIAGNOSTICS_REQ_OP_GENERATE;
exports.DIAGNOSTICS_REQ_OP_FIX = DIAGNOSTICS_REQ_OP_FIX;

var DIAGNOSTICS_REQ_SUBOP_GENERATE_NONE = function() { return 0; }
exports.DIAGNOSTICS_REQ_SUBOP_GENERATE_NONE = DIAGNOSTICS_REQ_SUBOP_GENERATE_NONE;

var DIAGNOSTICS_REQ_SUBOP_FIX_XGEOIP = function() { return 1; }
exports.DIAGNOSTICS_REQ_SUBOP_FIX_XGEOIP = DIAGNOSTICS_REQ_SUBOP_FIX_XGEOIP;

var DIAGNOSTICS_RESP_OP_GENERATE = function() { return 1; }
exports.DIAGNOSTICS_RESP_OP_GENERATE = DIAGNOSTICS_RESP_OP_GENERATE;

var DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_CLAIMED = function() { return 1; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_UNCLAIMED = function() { return 2; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_CLAIMED = function() { return 3; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_UNCLAIMED = function() { return 4; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_CLAIMED = function() { return 5; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_UNCLAIMED = function() { return 6; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_CLAIMED = function() { return 7; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_UNCLAIMED = function() { return 8; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_CLAIMED = function() { return 9; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_UNCLAIMED = function() { return 10; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_CLAIMED = function() { return 11; }
var DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_UNCLAIMED = function() { return 12; }
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_CLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_CLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_UNCLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_XGEOIP_UNCLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_CLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_CLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_UNCLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_DNS_UNCLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_CLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_CLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_UNCLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_WHOIS_UNCLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_CLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_CLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_UNCLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_TRACEROUTE_UNCLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_CLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_CLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_UNCLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_NMAP_UNCLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_CLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_CLAIMED;
exports.DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_UNCLAIMED = DIAGNOSTICS_RESP_SUBOP_GENERATE_BGP_UNCLAIMED;


var DIAGNOSTICS_RESP_SUBOP_FIX_XGEOIP = function() { return 1; }
exports.DIAGNOSTICS_RESP_SUBOP_FIX_XGEOIP = DIAGNOSTICS_RESP_SUBOP_FIX_XGEOIP;





/*
 * AGENTS (server <-> js client)
 */
var AGENTS_REQ = function() { return "req_agents"; }
var AGENTS_RESP = function() { return "resp_agents"; }
exports.AGENTS_REQ = AGENTS_REQ;
exports.AGENTS_RESP = AGENTS_RESP;

var AGENTS_RESP_OP_LIST = function() { return 1; }
var AGENTS_RESP_OP_CPUINFO = function() { return 2; }
var AGENTS_RESP_OP_PROFILE = function() { return 3; }
var AGENTS_RESP_OP_SNORT = function() { return 4; }
var AGENTS_RESP_OP_LOGS = function() { return 5; }
var AGENTS_RESP_OP_NETWORK = function() { return 6; }
exports.AGENTS_RESP_OP_LIST = AGENTS_RESP_OP_LIST;
exports.AGENTS_RESP_OP_CPUINFO = AGENTS_RESP_OP_CPUINFO;
exports.AGENTS_RESP_OP_PROFILE = AGENTS_RESP_OP_PROFILE;
exports.AGENTS_RESP_OP_SNORT = AGENTS_RESP_OP_SNORT;
exports.AGENTS_RESP_OP_LOGS = AGENTS_RESP_OP_LOGS;
exports.AGENTS_RESP_OP_NETWORK = AGENTS_RESP_OP_NETWORK;

var AGENTS_RESP_SUBOP_NETWORK_BANDWIDTH = function() { return 1; }
exports.AGENTS_RESP_SUBOP_NETWORK_BANDWIDTH = AGENTS_RESP_SUBOP_NETWORK_BANDWIDTH;



/*
 * AGENTS CPU OPERATIONS
 */
var CPU_REQ = function() { return "req_cpu"; }
var CPU_RESP = function() { return "resp_cpu"; }
exports.CPU_REQ = CPU_REQ;
exports.CPU_RESP = CPU_RESP;


/*
 * AGENTS PROFILE OPERATIONS
 */
var PROFILE_REQ = function() { return "req_profile"; }
var PROFILE_RESP = function() { return "resp_profile"; }
exports.PROFILE_REQ = PROFILE_REQ;
exports.PROFILE_RESP = PROFILE_RESP;


/*
 * AGENTS SNORT OPERATIONS
 */
var SNORT_REQ = function() { return "req_snort"; }
var SNORT_RESP = function() { return "resp_snort"; }
exports.SNORT_REQ = SNORT_REQ;
exports.SNORT_RESP = SNORT_RESP;


/*
 * AGENTS LOG OPERATIONS
 */
var LOGS_REQ = function() { return "req_logs"; }
var LOGS_RESP = function() { return "resp_logs"; }
exports.LOGS_REQ = LOGS_REQ;
exports.LOGS_RESP = LOGS_RESP;

var LOGS_REQ_OP_MONITOR = function() { return 1; }
exports.LOGS_REQ_OP_MONITOR = LOGS_REQ_OP_MONITOR;


/*
 * AGENTS NETWORK OPERATIONS
 */
var NETWORK_REQ = function() { return "req_network"; }
var NETWORK_RESP = function() { return "resp_network"; }
exports.NETWORK_REQ = NETWORK_REQ;
exports.NETWORK_RESP = NETWORK_RESP;

var NETWORK_RESP_OP_BANDWIDTH = function() { return 1; }
exports.NETWORK_RESP_OP_BANDWIDTH = NETWORK_RESP_OP_BANDWIDTH;




/*
 * NOTES
 */
var NOTES_REQ = function() { return "req_notes"; }
var NOTES_RESP = function() { return "resp_notes"; }
exports.NOTES_REQ = NOTES_REQ;
exports.NOTES_RESP = NOTES_RESP;

var NOTES_OP_SAVE = function() { return 1; }
var NOTES_OP_LIST = function() { return 2; }
var NOTES_OP_EDIT = function() { return 3; }
var NOTES_OP_DELETE = function() { return 4; }
exports.NOTES_OP_SAVE = NOTES_OP_SAVE;
exports.NOTES_OP_LIST = NOTES_OP_LIST;
exports.NOTES_OP_EDIT = NOTES_OP_EDIT;
exports.NOTES_OP_DELETE = NOTES_OP_DELETE;



/* 
 * FORUM
 */
var FORUM_REQ = function() { return "req_forum"; }
var FORUM_RESP = function() { return "resp_forum"; }
exports.FORUM_REQ = FORUM_REQ;
exports.FORUM_RESP = FORUM_RESP;



/*
 * CHAT
 */
var CHAT_REQ = function() { return "req_chat"; }
var CHAT_RESP = function() { return "resp_chat"; }
exports.CHAT_REQ = CHAT_REQ;
exports.CHAT_RESP = CHAT_RESP;

var CHAT_OP_JOIN = function() { return 1; }
var CHAT_OP_LIST = function() { return 2; }
var CHAT_OP_MSG = function() { return 3; }
var CHAT_OP_PART = function() { return 4; }
exports.CHAT_OP_JOIN = CHAT_OP_JOIN;
exports.CHAT_OP_LIST = CHAT_OP_LIST;
exports.CHAT_OP_MSG = CHAT_OP_MSG;
exports.CHAT_OP_PART = CHAT_OP_PART;
