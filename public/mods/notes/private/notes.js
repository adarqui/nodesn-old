/*
 *
 * Notes module : private
 *
 */

module.exports = function(x) {

	var self = this;

	self.x_b = x.b;
	self.x_socket = x.socket;


	self.load = function() {

		self.x_socket.on(self.x_b.o.konst.NOTES_REQ(), function(data) {
			self.handle_req_modNotes({data:data});
		});

/* respond with the current list of notes */
		setTimeout(function() {
			self.handle_req_modNotes({ data: {op: self.x_b.o.konst.NOTES_OP_LIST() } });
		}, 1000);

	}


	self.unload = function() {
	}


	self.resp_modNotes = function(x) {

		var data = x.data;

		var rs = self.x_b.o.misc.get_rand_string2();

		
		console.log("resp_modNotes");
		self.x_socket.emit(self.x_b.o.konst.NOTES_RESP(), { res: rs });
	}



	self.handle_req_modNotes = function(x) {

		var data = x.data;
		var note = x.data.note;	

		console.log("handle_req_modNotes", x);

		/*
		 * sanitize stuff
		 */

		switch(data.op) {
			case self.x_b.o.konst.NOTES_OP_SAVE(): {
	
				note.id = self.x_b.o.misc.mysql_real_escape_string(note.id);
				note.title = self.x_b.o.misc.mysql_real_escape_string(note.title);
				note.body = self.x_b.o.misc.mysql_real_escape_string(note.body);
				note.tags = self.x_b.o.misc.mysql_real_escape_string(note.tags);

				console.log("FUCK SAVING", "INSERT INTO notes VALUES("+(note.id == null ? "null" : note.id)+", "
                        +"'"+self.x_socket.a.connection.user.user+"'"
                        +","+self.x_socket.a.connection.user.id
                        +",'"+note.title+"',"
                        +"'"+note.body+"',"
                        +"'"+note.tags+"',"
						+"1,"
                        +"'NOW()') ON DUPLICATE KEY UPDATE title='"+note.title+"', body='"+note.body+"', tags='"+note.tags+"'"
 );


				self.x_b.o.db.query({
					str: "INSERT INTO notes VALUES("+note.id+", "
						+"'"+self.x_socket.a.connection.user.user+"'"
						+","+self.x_socket.a.connection.user.id
						+",'"+note.title+"',"
						+"'"+note.body+"',"
						+"'"+note.tags+"',"
						+"1,"
						+"'NOW()') ON DUPLICATE KEY UPDATE title='"+note.title+"', body='"+note.body+"', tags='"+note.tags+"'",
					b: self.x_b,
					xself: self,
					cb: self.save_cb
				})
				break;
			}
			case self.x_b.o.konst.NOTES_OP_LIST(): {
				console.log("LISTING");
				self.x_b.o.db.query({
					str: "SELECT * FROM notes WHERE user = '"+self.x_socket.a.connection.user.user+"' AND status = 1",
					xself: self,
					b: self.x_b,
					cb: self.list_cb
				});
				break;
			}
			case self.x_b.o.konst.NOTES_OP_EDIT(): {
				console.log("EDIT", "SELECT * FROM notes WHERE id = '"+data.id+"' AND user = '"+self.x_socket.a.connection.user.user+"'");
				self.x_b.o.db.query({
					str: "SELECT * FROM notes WHERE id = '"+data.id+"' AND user = '"+self.x_socket.a.connection.user.user+"'",
				xself: self,
				b: self.x_b,
				cb: self.edit_cb
				});
				break;
			}
			case self.x_b.o.konst.NOTES_OP_DELETE(): {

				console.log("DELETING", "UPDATE notes SET status = 0 WHERE id = "+data.id
                        +" AND user = '"+self.x_socket.a.connection.user.user+"'");

				self.x_b.o.db.query({
					str: "UPDATE notes SET status = 0 WHERE id = "+data.id
						+" AND user = '"+self.x_socket.a.connection.user.user+"'",
					xself: self,
					b: self.x_b,
					cb: self.delete_cb,
				});
				break;
			}
			default: {
				break;
			}
		}
				


		self.resp_modNotes({ data: data });
	}


 self.save_cb = function(xself, data) {
        console.log("save_cb: ", data);

		self.x_socket.emit(self.x_b.o.konst.NOTES_RESP(), {  op: self.x_b.o.konst.NOTES_OP_SAVE(), id: data.rows.insertId } );

		self.handle_req_modNotes( { data: { op: self.x_b.o.konst.NOTES_OP_LIST(), note: {} } });
    }


	self.delete_cb = function(xself, data) {
		console.log("delete_cb: ", data);
		self.handle_req_modNotes({ data: { op: self.x_b.o.konst.NOTES_OP_LIST(), note: {} } });
	}


	self.list_cb = function(xself, data) {
		
		console.log("list_cb: ", data);
		self.x_socket.emit(self.x_b.o.konst.NOTES_RESP(), { 
			op: self.x_b.o.konst.NOTES_OP_LIST(), 
			user: self.x_socket.a.connection.user.user,
			rows: data.rows 
		});
	} 


	self.edit_cb = function(xself, data) {
		console.log("edit_cb: ", data);
		self.x_socket.emit(self.x_b.o.konst.NOTES_RESP(), {
			op: self.x_b.o.konst.NOTES_OP_EDIT(),
			user: self.x_socket.a.connection.user.user,
			row: data.rows
		});
	}


/* end */
self.load();
}
