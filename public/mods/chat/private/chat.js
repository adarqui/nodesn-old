/*
 *
 * Chat module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;
	self.x_bypass = x.bypass;


	self.load = function() {


		if(self.x_bypass == true) {

/* add a special handler */
		     self.x_socket.a.connection.connect_handlers['chat_join'] = {
            	run: self.connect_handler
        	}

             self.x_socket.a.connection.disconnect_handlers['chat_part'] = {
                run: self.disconnect_handler
            }



			return false;
		}

		self.x_socket.on(self.x_b.o.konst.CHAT_REQ(), function(data) {
			self.handle_req_modChat({data:data});
		});

/* notify everyone on chat that new user logged in */
		setTimeout(function() {
			self.handle_req_modChat_list(null);
		}, 1000);

	}


	self.connect_handler = function() {

		console.log("CHAT HANDLER");
		setTimeout(function() {
//			self.handle_req_modChat({ data: {op: self.x_b.o.konst.CHAT_OP_LIST() } });

         	self.x_b.o.misc.notify({
                	b: self.x_b,
                	resp: self.x_b.o.konst.CHAT_RESP(),
                	data: {
						op: self.x_b.o.konst.CHAT_OP_JOIN(),
						user:  {
							user: self.x_socket.a.connection.user.user,
							gid: self.x_socket.a.connection.user.gid,
						},
					},
                	type: [self.x_b.o.konst.USER_GROUP_ADMIN(), self.x_b.o.konst.USER_GROUP_GUEST()],
           	});

		}, 1000);

	}




    self.disconnect_handler = function() {

        console.log("CHAT HANDLER: DISCONNECT");
            self.x_b.o.misc.notify({
                    b: self.x_b,
                    resp: self.x_b.o.konst.CHAT_RESP(),
                    data: {
                        op: self.x_b.o.konst.CHAT_OP_PART(),
                        user:  {
                            user: self.x_socket.a.connection.user.user,
                            gid: self.x_socket.a.connection.user.gid,
                        },
                    },
                    type: [self.x_b.o.konst.USER_GROUP_ADMIN(), self.x_b.o.konst.USER_GROUP_GUEST()],
            });

    }





	self.unload = function() {
	}


	self.resp_modChat = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		
		console.log("resp_modChat");
		self.x_socket.emit(self.x_b.o.konst.CHAT_RESP(), { res: rs });
	}



	self.handle_req_modChat = function(x) {

		var data = x.data;

		console.log("handle_req_modChat", x);

		switch(data.op) {
			case self.x_b.o.konst.CHAT_OP_LIST(): {
				self.handle_req_modChat_list(data);
				break;
			}
			case self.x_b.o.konst.CHAT_OP_MSG(): {
				self.handle_req_modChat_msg(data);
				break;
			}
			default: {
				break;
			}
		}

//		self.resp_modChat({ data: data });
	}

	self.handle_req_modChat_msg = function(data) {

            self.x_b.o.misc.notify({
                b: self.x_b,
                resp: self.x_b.o.konst.CHAT_RESP(),
                data:  {
                    op: self.x_b.o.konst.CHAT_OP_MSG(),
                    user: {
						user: self.x_socket.a.connection.user.user,
						gid: self.x_socket.a.connection.user.gid,
					},
					msg: data.msg,
                },
                type: [self.x_b.o.konst.USER_GROUP_ADMIN(), self.x_b.o.konst.USER_GROUP_GUEST()],
            });


		var str_safe = self.x_b.o.misc.mysql_real_escape_string(data.msg);
		self.x_b.o.db.query({
			str: "INSERT INTO chat VALUES(NULL, "
				+"'"+self.x_socket.a.connection.user.user+"'"
				+",'"+str_safe+"'"
				+", null)",
			xself: self,
			b: self.x_b,
		});
			
			
 
	}



	self.handle_req_modChat_list = function(data) {

		 var sockets = self.x_b.sock_io_app.sockets.sockets;

		var i = 0, users = {};
	    for(var v in sockets) {

        	var socket = sockets[v];

			users[i] = { 
				user: socket.a.connection.user.user,
				gid: socket.a.connection.user.gid,
			}
			i++;
		}

			console.log("USERS", users);

/*
            self.x_b.o.misc.notify({
                b: self.x_b,
                resp: self.x_b.o.konst.CHAT_RESP(),
                data:  {
                    op: self.x_b.o.konst.CHAT_OP_LIST(),
                    users: users,
                },
                type: [self.x_b.o.konst.USER_GROUP_ADMIN(), self.x_b.o.konst.USER_GROUP_GUEST()],
            });
*/
			self.x_socket.emit(self.x_b.o.konst.CHAT_RESP(), { 
				op: self.x_b.o.konst.CHAT_OP_LIST(),
				users: users,
			});
	}


/* end */
self.load();
}
