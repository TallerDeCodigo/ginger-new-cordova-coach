
/*** Attempt to get chat methods in to order ***/
	window.chatCore = [];

	chatCore.isInitialized = false;
	chatCore.token = null;

	chatCore.init = function(elCoach){
		console.log("Initializing instant messaging api");
		if(chatCore.isInitialized)
			return this;
		chatCore.access = 	{ 	
							email: elCoach.mail, 
							password: elCoach.chatPassword
						};
		QB.createSession( chatCore.access,  function(err, res) {

								if (res) {
									chatCore.token 		= res.token;
									chatCore.user_id 	= res.user_id;
									chatCore.obj 		= res;
									chatCore.isInitialized = true;
									return res;
								}
						} );
		return this;
	};

	chatCore.connectToChat = function(elCoach) {
		 
		// mergeUsers([{user: user}]);

		QB.chat.connect({ 	
							email: elCoach.mail, 
							password: elCoach.chatPassword
						}, 
						 function(err, roster) {

								// app.keeper.setItem('idSender', user.id);

								if (err) {
									console.log(err);
								} else {
									console.log(roster);

									// retrieveChatDialogs();
								
									// setupAllListeners();
								
									// setupMsgScrollHandler();
								}
						});
	}

	
	chatCore.clickSendMessage = function() {

		console.log('click send message');
		var currentText = $('#chat-message').val().trim();
		console.log(currentText);
		if (currentText.length === 0)
			return false;

		// $('#chat-message').val('').focus();
		$('#chat-message').val('').focus();
		chatCore.sendMessage(currentText, null);
		$('#container').scrollTop($('#container').prop('scrollHeight'));
	}

	chatCore.sendMessage = function( text, attachmentFileId ) {

		var msg = {
			type 		: currentDialog.type === 3 ? 'chat' : 'groupchat',
			body 		: text,
			extension 	: {
							save_to_history: 1,
						},
			senderId 	: currentUser.id,
			markable 	: 1
		};

		if(attachmentFileId !== null){
			msg["extension"]["attachments"] = [{id: attachmentFileId, type: 'photo'}];
		}

		if (currentDialog.type === 3) {
			opponentId = QB.chat.helpers.getRecipientId(currentDialog.occupants_ids, currentUser.id);
			QB.chat.send(opponentId, msg);

			if(attachmentFileId === null){
				showMessage(currentUser.id, msg);
			} else {
				showMessage(currentUser.id, msg, attachmentFileId);
			}
		} else {
			QB.chat.send(currentDialog.xmpp_room_jid, msg);
		}

		clearTimeout(isTypingTimerId);
		isTypingTimeoutCallback();

		dialogsMessages.push(msg);
	}

	chatCore.fetchUnreadCount = function(){

		setTimeout(function(){

			if(chatCore.isInitialized){
				// mergeUsers([{user: elCoach}]);
				QB.chat.dialog.list( null, function(err, resDialogs) {
					
					if (err)
						console.log(err);
					console.log(resDialogs);
					var occupantsIds = [];
					var i = 0;
					resDialogs.items.forEach(function(item, i, arr) {

						var dialogId = item._id;
						dialogs[dialogId] = item;
						var user_id = item.user_id;
						var unread_count = item.unread_messages_count;
						var $foundElement = $('*[data-chatid="'+user_id+'"]');
						var exists_in_list = $foundElement.length;

						$foundElement.addClass('active')
									  .data('chatid', dialogId);
					
						$foundElement.find('.mensajes')
											 .text(unread_count)
											 .on('click', function(e){
												console.log($(e.currentTarget).data('dialogid'));
												return app.render_chat_dialog(null, $(e.currentTarget).data('dialogid'));
											 });
						$foundElement.find('.chat_unread')
									  .attr('data-dialogid', item._id);
					});
					app.hideLoader();
				});
				return;
			}
			return;
		}, 420);
	};

	chatCore.fetchDialogList = function(){

		if(!chatCore.isInitialized)
			chatCore.init(window._coach);

		QB.chat.dialog.list( null, function(err, resDialogs) {
			var i = 0;
			if (err) 
				return console.log(err);

			if(resDialogs){

				resDialogs.items.forEach(function(item, i, arr) {
					console.log(item);
					var dialogId 		= item._id;
					dialogs[dialogId] 	= item;
					var user_id 		= item.user_id;
					var unread_count 	= item.unread_messages_count;
					var $foundElement 	= $('*[data-chatId="'+user_id+'"]');
					var exists_in_list 	= $foundElement.length;
					// $foundElement.addClass('active')
					// 				.find('.mensajes')
					// 								 .text(unread_count)
					// 								 .on('click', function(e){
					// 									return app.render_chat_dialog(null, $(e.currentTarget).data('dialogid'));
					// 								});
				});
				resDialogs.header_title = "Chat";
				console.log(resDialogs);
				return app.render_template('chat-contacts', '.chat-container', resDialogs);
			}

		});
		return false;
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

				joinToNewDialogAndShow(createdDialog);

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



	chatCore.createNewDialog = function()  {
		var usersIds = [];
		var usersNames = [];

		// $('#users_list .users_form.active').each(function(index) {


			var qbUser = localStorage.getItem('idQBOX');

			qbUser = qbUser.split('-');
			qbUser = qbUser[0].replace('"',''); 

			console.log(qbUser);
			//usersIds[0] = qbUser[0];

			// var Coach = JSON.parse(localStorage.getItem('user'));
			// var aux = Coach.jid;
			// var qCoach = aux.split('-');

			usersIds[0] = qbUser;
			//usersIds[1] = qCoach[0];
		// });

		//$("#add_new_dialog").modal("hide");
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

		// create a dialog
		//
		console.log("Creating a dialog with params: " + JSON.stringify(params));

		QB.chat.dialog.create(params, function(err, createdDialog) {
			if (err) {
				console.log(err);
			} else {
				console.log("Dialog " + createdDialog._id + " created with users: " + dialogOccupants);

				// save dialog to local storage
				var dialogId = createdDialog._id;
				dialogs[dialogId] = createdDialog;

				currentDialog = createdDialog;

				chatCore.joinToNewDialogAndShow(createdDialog);    //create dialog es un itemDialog

				chatCore.notifyOccupants(createdDialog.occupants_ids, createdDialog._id, 1);

				triggerDialog(createdDialog._id);

				//$('a.users_form').removeClass('active');

			}
		});
	}

	chatCore.joinToNewDialogAndShow = function(itemDialog) {

		var dialogId = itemDialog._id;
		var dialogName = itemDialog.name;
		var dialogLastMessage = itemDialog.last_message;
		var dialogUnreadMessagesCount = itemDialog.unread_messages_count;
		var dialogIcon = getDialogIcon(itemDialog.type);

		// join if it's a group dialog
		if (itemDialog.type != 3) {
			QB.chat.muc.join(itemDialog.xmpp_room_jid, function() {
				 console.log("Joined dialog: " + dialogId);
			});
			opponentLogin = null;
		} else {
			opponentId = QB.chat.helpers.getRecipientId(itemDialog.occupants_ids, currentUser.id);
			opponentLogin = getUserLoginById(opponentId);
			dialogName = chatName = 'Dialog -  with ' + dialogName + 'with id '+opponentId;
		}

		// show it
		var dialogHtml = buildDialogHtml(dialogId, dialogUnreadMessagesCount, dialogIcon, dialogName, dialogLastMessage);
		$('#dialogs-list').prepend(dialogHtml);
	}

	chatCore.notifyOccupants = function(dialogOccupants, dialogId, notificationType) {

		dialogOccupants.forEach(function(itemOccupanId, i, arr) {
			if (itemOccupanId != currentUser.id) {
				var msg = {
					type: 'chat',
					extension: {
						notification_type: notificationType,
						dialog_id: dialogId
					}
				};

				QB.chat.sendSystemMessage(itemOccupanId, msg);
			}
		});
	}


	chatCore.triggerDialog = function(dialogId){

		console.log("Hay que repetir la escena de Santos Protones Milhouse");
		console.log(JSON.stringify(dialogId));
		console.log(JSON.stringify(dialogs));
		console.log(JSON.stringify(dialogs[dialogId]));
		retrieveChatMessages(dialogs[dialogId], null);
		var kids = $('#dialogs-list').children();
		kids.removeClass('active').addClass('inactive');

		// select
		$('#'+dialogId).removeClass('inactive').addClass('active');

		$('.list-group-item.active .badge').text(0).delay(250).fadeOut(500);

		$('#messages-pool').html('');

		$('#dialogs-list').hide();
		$('#messages-pool').show();
		$('.menu-bar').hide();
		$('.escribir').show();

		// $('#messages-pool').scrollTop($('#messages-pool').prop('scrollHeight'));
		$('#mensaje-chat').focus();
		setTimeout(function() {
			$('#mensaje-chat').focusout();
			$('h2.titulo').trigger('click');
		}, 1000);
		setTimeout(function() {
			$('#mensaje-chat').focusout();
			$('h2.titulo').trigger('click');
		}, 2000);
		setTimeout(function() {
			$('#mensaje-chat').focusout();
			$('h2.titulo').trigger('click');
		}, 3000);
		setTimeout(function() {
			$('#mensaje-chat').focusout();
			$('h2.titulo').trigger('click');
		}, 3000);
		setTimeout(function() {
			$('#messages-pool').css('opacity','1');
			$('.escribir').css('opacity','1');
		}, 3000);

		// window.scrollTo(0,0);
		
	}


	function mergeUsers(usersItems){
	  var newUsers = {};
	  usersItems.forEach(function(item, i, arr) {
		newUsers[item.user.id] = item.user;
	  });
	  users = $.extend(users, newUsers);
	}


	function setupAllListeners() {
	  QB.chat.onDisconnectedListener    = onDisconnectedListener;
	  QB.chat.onReconnectListener       = onReconnectListener;
	  QB.chat.onMessageListener         = onMessage;
	  QB.chat.onSystemMessageListener   = onSystemMessageListener;
	  QB.chat.onDeliveredStatusListener = onDeliveredStatusListener;
	  QB.chat.onReadStatusListener      = onReadStatusListener;
	  setupIsTypingHandler();
	}

	// reconnection listeners
	function onDisconnectedListener(){
	  console.log("onDisconnectedListener");
	}

	function onReconnectListener(){
	  console.log("onReconnectListener");
	}

	chatCore.submit_handler = function(form) {
		return false;
	}
