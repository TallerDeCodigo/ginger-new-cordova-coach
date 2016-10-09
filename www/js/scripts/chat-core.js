
/*** Attempt to get chat methods in to order ***/
window.chatCore = [];

chatCore.fetchDialogList = function(elCoach){
		console.log("Oh Captain my Captain");
		QB.createSession({email: elCoach.mail, password: elCoach.chatPassword}, function(err, res) {

		    myCurrentUser = elCoach;

		    if (res) {
			    token = res.token;
			    myCurrentUser.id = res.user_id;

			    mergeUsers([{user: myCurrentUser}]);

		      	QB.chat.dialog.list(null, function(err, resDialogs) {
					if (err) {
						console.log(err);
					} else {
						var occupantsIds = [];
						var i = 0;
						resDialogs.items.forEach(function(item, i, arr) {
							var dialogId = item._id;
							dialogs[dialogId] = item;
							var user_id = item.user_id;
							var unread_count = item.unread_messages_count;
							console.log(user_id);
							var $foundElement = $('*[data-chatId="'+user_id+'"]');
							var exists_in_list = $foundElement.length;
							$foundElement.addClass('active');
							$foundElement.find('.mensajes').text(unread_count);
						});

					}
				});
		    }
		  });
		
	};

