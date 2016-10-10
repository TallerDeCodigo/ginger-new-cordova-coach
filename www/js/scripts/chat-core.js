
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
							console.log(item);
							var $foundElement = $('*[data-chatId="'+user_id+'"]');
							var exists_in_list = $foundElement.length;

							$foundElement.addClass('active')
											.find('.mensajes')
															 .text(unread_count)
															 .on('click', function(e){
																console.log($(e.currentTarget).data('dialogid'));
																return app.render_chat_dialog(null, $(e.currentTarget).data('dialogid'));
															});
						});

					}
				});
			}
		  });
		
	};

	/*** Populate dialog once screen has loaded ***/
	chatCore.populateDialog = function(){

		var dialogName;
		var dialogOccupants;
		var dialogType;

		if (usersIds.length > 1) {
			if (usersNames.indexOf(currentUser.login) > -1) {
				dialogName = usersNames.join(', ');
			}else{
				dialogName = currentUser.login + ', ' + usersNames.join(', ');
			}
			dialogOccupants = usersIds;
			dialogType = 2;
		} else {
			dialogOccupants = usersIds;
			dialogType = 3;
		}

		var params = {
			type: dialogType,
			occupants_ids: dialogOccupants,
			name: dialogName
		};

		QB.chat.dialog.create(params, function(err, createdDialog) {
			if (err) {
			  console.log(err);
			} else {
				console.log("Dialog " + createdDialog._id + " created with users: " + dialogOccupants);

				// save dialog to local storage
				var dialogId = createdDialog._id;
				dialogs[dialogId] = createdDialog;

				currentDialog = createdDialog;

				joinToNewDialogAndShow(createdDialog);    //create dialog es un itemDialog

				notifyOccupants(createdDialog.occupants_ids, createdDialog._id, 1);

				triggerDialog(createdDialog._id);

				//$('a.users_form').removeClass('active');

			}
		  });
	};

	/*** Create Dialog instance ***/
	chatCore.createDialogInstance = function(){

		var usersIds = [];
		var usersNames = [];
		/*** TODO: Fetch this id from method as attribute ***/
		var qbUser = localStorage.getItem('idQBOX');
		qbUser = qbUser.split('-');
		qbUser = qbUser[0].replace('"',''); 
		usersIds[0] = qbUser;

		$('#add_new_dialog .progress').show();

		var dialogName;
		var dialogOccupants;
		var dialogType;

		if (usersIds.length > 1) {
		    if (usersNames.indexOf(currentUser.login) > -1) {
		      dialogName = usersNames.join(', ');
		    }else{
		      dialogName = currentUser.login + ', ' + usersNames.join(', ');
		    }
		    dialogOccupants = usersIds;
		    dialogType = 2;
		} else {
		    dialogOccupants = usersIds;
		    dialogType = 3;
		}

		var params = {
		    type: dialogType,
		    occupants_ids: dialogOccupants,
		    name: dialogName
		};

		console.log("Creating a dialog with params: " + JSON.stringify(params));

		QB.chat.dialog.create(params, function(err, createdDialog) {
		    if (err) {
		      console.log(err);
		    } else {
		      console.log("Dialog " + createdDialog._id + " created with users: " + dialogOccupants);

		      var dialogId = createdDialog._id;
		      dialogs[dialogId] = createdDialog;

		      currentDialog = createdDialog;

		      joinToNewDialogAndShow(createdDialog);

		      notifyOccupants(createdDialog.occupants_ids, createdDialog._id, 1);

		      triggerDialog(createdDialog._id);
		    }
		});
	};