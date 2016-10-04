
/*** Attempt to get chat methods in to order ***/
console.log("Hey Chat core");
window.chatCore = [];

chatCore.fetchDialogList = function(){
		QB.createSession({email: _coach.mail, password: _coach.chat_password}, function(err, res) {

		    console.log(user);

		    currentUser = user;

		    console.log("usr > "+user.login);
		    console.log("pass > "+user.pass);

		    console.log(res);
		    if (res) {
			    // save session token
			    token = res.token;

			    console.log(' TOKEN ' + token);

			    user.id = res.user_id;

			    console.log('LOG ID: ' + user.id);
			    mergeUsers([{user: user}]);

		      	QB.chat.dialog.list(null, function(err, resDialogs) {
					if (err) {
						console.log(err);
					} else {
						console.log(resDialogs);
						// repackage dialogs data and collect all occupants ids
						var occupantsIds = [];
						var i = 0;
						var nombre_del_usuario = currentUser.id;
						var time;
						var hours;
						var minutes;
						

						resDialogs.items.forEach(function(item, i, arr) {
							var dialogId = item._id;
							dialogs[dialogId] = item;

							// join room
							if (item.type != 3) {
								QB.chat.muc.join(item.xmpp_room_jid, function() {
									 console.log("Joined dialog "+dialogId);
								});
							}

							item.occupants_ids.map(function(userId) {
								occupantsIds.push(userId);
							});
						});

					}
				});
		    }
		  });
		
	};

