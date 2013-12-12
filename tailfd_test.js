tailfd = require('tailfd').tail;

for(var v = 0; v < 5; v++) {
/*
	watcher = tailfd('/tmp/t'+v, function(line, tailinfo) {
		console.log("tail: ", line, tailinfo, "v", v);
	});
*/
watcher = tailfd('/tmp/t'+v, (function(line, tailinfo) {
		return function(line, tailinfo) {
			console.log("line=", line, "tailinfo=", tailinfo, "v=", v);
		};
	}(v)));

}
