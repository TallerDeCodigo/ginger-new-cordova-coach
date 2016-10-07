
/*** Attempt to get chat methods in to order ***/
console.log("Hey Chat core");
window.chatCore = [];

chatCore.fetchDialogList = function(elCoach){
		QB.createSession({email: elCoach.mail, password: elCoach.chatPassword}, function(err, res) {

		    myCurrentUser = elCoach;
		    console.log("current "+JSON.stringify(myCurrentUser));

		    console.log("usr > "+myCurrentUser.mail);
		    console.log("pass > "+myCurrentUser.chatPassword);

		    console.log(res);
		    if (res) {
			    // save session token
			    token = res.token;

			    console.log(' TOKEN ' + token);

			    myCurrentUser.id = res.user_id;

			    console.log('LOG ID: ' + myCurrentUser.id);
			    mergeUsers([{user: myCurrentUser}]);

		      	QB.chat.dialog.list(null, function(err, resDialogs) {
					if (err) {
						console.log(err);
					} else {
						console.log(resDialogs);
						// repackage dialogs data and collect all occupants ids
						var occupantsIds = [];
						var i = 0;
						var nombre_del_usuario = myCurrentUser.id;
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

