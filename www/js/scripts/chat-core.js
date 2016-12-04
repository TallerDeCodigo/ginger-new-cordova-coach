
/*** Attempt to get chat methods in to order ***/
	window.chatCore = [];

	chatCore.isInitialized 	= false;
	chatCore.token 			= null;
	chatCore.user_id 		= null;
	chatCore.currentUser 	= null;
	chatCore.opponentId 	= null;
	chatCore.currentDialog 	= null;
	chatCore.dialogs 		= [];
	chatCore.occupantsIds 	= [];
	chatCore.QBApp = {
					appId: 20019,
					authKey: 'wX-b8q-hSn3AArS',
					authSecret: 'aCyMHpfYQNNZD8K'
				};

	chatCore.config = {
					chatProtocol: {
						active: 2
					},
					debug: {
						mode: 1,
						file: null
					}
				};

	chatCore.init = function(elCoach){

		console.log("Initializing instant messaging api");
		if(chatCore.isInitialized)
			return this;

		/* INIT QUICKBLOX */
		QB.init(chatCore.QBApp.appId, chatCore.QBApp.authKey, chatCore.QBApp.authSecret, chatCore.config);

		chatCore.access = 	{ 	
								email: 		elCoach.mail, 
								password: 	elCoach.chatPassword
							};
		QB.createSession( chatCore.access,  function(err, res) {
								if(err)
									return app.toast("Can't connect to chat service, if the problem persists contact support");

								if (res) {
									chatCore.token 			= res.token;
									chatCore.user_id 		= res.user_id;
									chatCore.obj 			= res;
									chatCore.isInitialized 	= true;
									chatCore.currentUser 	= elCoach;
									app.keeper.setItem('idSender', res.user_id);
									chatCore.connectToChat(elCoach);
									return res;
								}
						} );
		return this;
	};

	chatCore.connectToChat = function(elCoach) {

		console.log("Spin dialing...");
		var params 	= {jid: elCoach.jid, password: elCoach.chatPassword};
		QB.chat.connect(params, 
						 function(err, roster) {

							if (err) {
								console.log(err);
							} else {
								console.log(roster);
								// retrieveChatDialogs();
								chatCore.setupAllListeners();						
								// setupMsgScrollHandler();
							}
						});
	}

	/**
	 * Trigger send message to dialog
	 */
	chatCore.clickSendMessage = function() {

		var currentText = $('#chat-message').val().trim();
		if (currentText.length === 0)
			return false;

		$('#chat-message').val('').focus();
		// $('#chat-message').val('');
		chatCore.submitMessage(currentText, null);
		$('#dialogs-list').scrollTop( $('#dialogs-list').prop('scrollTop')+25 );
	};

	/**
	 * Send message into chat dialog
	 * @param String text
	 * @param Int attachmentFileId
	 * @see currentDialog ()
	 */
	chatCore.submitMessage = function( text, attachmentFileId ) {
		
		currentUser 	= [];
		currentUser.id 	= app.keeper.getItem('idSender');
		var msg = {
					type 		: 'chat',
					body 		: text,
					extension 	: {
									save_to_history: 1,
								},
					senderId 	: currentUser.id,
					markable 	: 1
				};

		if(attachmentFileId)
			msg["extension"]["attachments"] = [{id: attachmentFileId, type: 'photo'}];

		/*** 1 to 1 chat ***/
		if (chatCore.currentDialog.type === 3) {

			chatCore.opponentId = QB.chat.helpers.getRecipientId( chatCore.currentDialog.occupants_ids, currentUser.id );
			QB.chat.send(chatCore.opponentId, msg);

			if(!attachmentFileId){
				chatCore.showMessage(chatCore.currentUser.id, msg);
			} else {
				chatCore.showMessage(chatCore.currentUser.id, msg, attachmentFileId);
			}
		} else {
			QB.chat.send(window._coach.jid, text);
		}

		// clearTimeout(isTypingTimerId);
		// isTypingTimeoutCallback();
		chatCore.dialogsMessages.push(msg);
	};

	chatCore.clickSendAttachments = function(inputFile) {

		app.showLoader();
		QB.content.createAndUpload({name: inputFile.name, file: inputFile, type: inputFile.type, size: inputFile.size, 'public': false}, function(err, response){
			if (err) {
				console.log(err);
			} else {

				var uploadedFile = response;
				chatCore.submitMessage('[attachment]', uploadedFile.id);
				$('input[type=file]').val('');
				app.hideLoader();
			}
		});
	};

	/**
	 * Fetch unread messages count
	 * TODO: Separate view changes from logic here
	 * @return void
	 */
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

						var dialogId 		= item._id;
						var user_id 		= item.user_id;
						var unread_count	= item.unread_messages_count;
						var $foundElement 	= $('*[data-chatid="'+user_id+'"]');
						var exists_in_list 	= $foundElement.length;

						chatCore.dialogs[dialogId] = item;
						item.occupants_ids.map(function(userId) {
							chatCore.occupantsIds.push(userId);
						});

						$foundElement.addClass('active')
									  .data('chatid', dialogId);
					
						$foundElement.find('.mensajes')
											 .text(unread_count)
											 .on('click', function(e){
												return app.render_chat_dialog(null, $(e.currentTarget).data('dialogid'));
											 });
						$foundElement.find('.chat_unread')
									  .attr('data-dialogid', item._id);
					});
					chatCore.occupantsIds 	= jQuery.unique(chatCore.occupantsIds);
					app.hideLoader();
				});
				return;
			}
			return;
		}, 420);
	};

	/**
	 * Fetch contact list (List of active chats)
	 * @see app.render_template, initContactListEvents
	 */
	chatCore.fetchContactList = function(){

		if(!chatCore.isInitialized)
			chatCore.init(window._coach);

		QB.chat.dialog.list( null, function(err, resDialogs) {
			var i = 0;
			var name = "Chat";
			if (err){
				app.hideLoader();
				return app.toast("Error: no fue posible consultar los mensajes.");
			}

			if(resDialogs){

				resDialogs.items.forEach(function(item, i, arr) {
				
					var dialogId = item._id;
					chatCore.dialogs[dialogId] = item;

					item.occupants_ids.map(function(userId) {
						chatCore.occupantsIds.push(userId);
					});
					var date = new Date(item.updated_at);
					// item.last_read 	= date.;
				});
				chatCore.occupantsIds 	= jQuery.unique(chatCore.occupantsIds);
				resDialogs.header_title = name;
				resDialogs.token 		= chatCore.token;
				console.log(resDialogs);
				app.render_template('chat-contacts', '.chat-container', resDialogs);
				initializeEvents();
				return chatCore.initContactListEvents();
			}

		});
		return false;
	};

	/**
	 * Initialize events for chat contact list
	 */
	chatCore.initContactListEvents = function(){

		$('.btnDialogs').click(function () {
			setTimeout(function(){
				app.showLoader();
			}, 420);
			var qbox_id 	= $(this).data('qbox');
			var gingerid 	= $(this).data('gingerid');
			var dialogId 		= $(this).data('dialog');
			app.keeper.setItem('idQBOX', qbox_id);
			app.keeper.setItem('idGinger', gingerid);
			chatCore.currentDialog = chatCore.dialogs[dialogId];
			chatCore.retrieveChatMessages(chatCore.currentDialog);
			$('#opponent_name').text(chatCore.currentDialog.name);
			$('.view').addClass('chat-dialog-messages');
			initializeEvents();
			return;
		});

		chatCore.dialogsMessages = $('#dialogs-list');
		console.log(chatCore);
	};


// ___________________________________________________//

	chatCore.retrieveChatMessages = function(dialog, beforeDateSent){

		var dialogsMessages = [];
		var data = {header_title: "Chat"};
		app.render_template('chat-messages', '.chat-container', data, true);
		
		var params 	= 	{
							chat_dialog_id: dialog._id,
							sort_desc: 'date_sent',
							limit: 25 // TODO: change to smaller limit as soon as we connect previous messages handler
						};

		/** if we would like to load the previous history **/
		if(beforeDateSent)
			params.date_sent = {lt: beforeDateSent};
		
		QB.chat.message.list(params, function(err, response) {
			
			if(! response || response.items.length === 0)
				return app.toast("No hay mensajes que mostrar");

			setTimeout(function(){

				response.items.forEach(function(item, i, arr) {

					var messageId 		= item._id;
					var messageText 	= item.message;
					var messageSenderId = item.sender_id;
					var messageDateSent = new Date(item.date_sent*1000);
					item.sender = ( app.keeper.getItem('idSender') == item.sender_id )? 'outgoing' : 'incoming';  
					// if (item.read_ids.indexOf(currentUser.id) === -1) {
					// 	chatCore.sendReadStatus(messageSenderId, messageId, currentDialog._id);
					// }

					var messageAttachmentFileId = null;
					if (item.hasOwnProperty("attachments")) {
						if(item.attachments.length > 0) {
							item.has_attachments 	= true;
							item.message 			= "";
							item.attachmentFileId 	= item.attachments[0].id;
						}
					}

					// // Show delivered statuses
					// if (item.read_ids.length > 1 && messageSenderId === currentUser.id) {
					// 	$('#delivered_'+messageId).fadeOut(100);
					// 	$('#read_'+messageId).fadeIn(200);
					// } else if (item.delivered_ids.length > 1 && messageSenderId === currentUser.id) {
					// 	$('#delivered_'+messageId).fadeIn(100);
					// 	$('#read_'+messageId).fadeOut(200);
					// }

				});
				/*** Render messages list and init events ***/
				response.items.reverse();
				response.token = chatCore.token;
				app.render_template('dialog-messages', '#dialogs-list', response, true);

				setTimeout(function(){
					$('#dialogs-list').animate({ scrollTop : $('#dialogs-list').height()*20 } );
					return app.hideLoader();
				}, 800);

			}, 0);

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

		var dialogId 					= itemDialog._id;
		var dialogName 					= itemDialog.name;
		var dialogLastMessage 			= itemDialog.last_message;
		var dialogUnreadMessagesCount 	= itemDialog.unread_messages_count;
		var dialogIcon 					= getDialogIcon(itemDialog.type);
		var dialogTime 					= itemDialog.updated_at;

		/*** Join if it's a group dialog ***/
		if (itemDialog.type != 3) {
			QB.chat.muc.join(itemDialog.xmpp_room_jid, function() {
				 console.log("Joined dialog: " + dialogId);
			});
			opponentLogin = null;
		} else {
			opponentId 		= QB.chat.helpers.getRecipientId(itemDialog.occupants_ids, chatCore.currentUser.id);
			opponentLogin 	= getUserLoginById(opponentId);
			dialogName 		= chatName = 'Dialog -  with ' + dialogName + 'with id ' + opponentId;
			console.log(dialogName);
		}

		var dialogHtml = chatCore.buildDialogHtml(dialogId, dialogUnreadMessagesCount, dialogIcon, dialogName, dialogLastMessage, dialogTime);
		console.log(dialogHtml);
		// $('#dialogs-list').prepend(dialogHtml);
	}

	

	chatCore.sendReadStatus = function(userId, messageId, dialogId) {
		var params = {
			messageId: messageId,
			userId: userId,
			dialogId: dialogId
		};
		QB.chat.sendReadStatus(params);
	}


	chatCore.buildDialogHtml = function(dialogId, dialogUnreadMessagesCount, dialogIcon, dialogName, dialogLastMessage, dialogTime, opponentId) {
		// var UnreadMessagesCountShow = '<span class="badge">'+dialogUnreadMessagesCount+'</span>';
		// UnreadMessagesCountHide = '<span class="badge" style="display: none;">'+dialogUnreadMessagesCount+'</span>';
		var hora = dialogTime.slice(11,16) 
		var UnreadMessagesCountShow = '<div class="no-leido">';
		UnreadMessagesCountHide = '<div class="leido">';

		var isMessageSticker = ""; //stickerpipe.isSticker(dialogLastMessage);

		//var dialogHtml ='<a href="#" class="list-group-item inactive" id='+'"'+dialogId+'"'+' onclick="triggerDialog('+"'"+dialogId+"'"+')">'+(dialogUnreadMessagesCount === 0 ? UnreadMessagesCountHide : UnreadMessagesCountShow)+'<h4 class="list-group-item-heading">'+ dialogIcon+'&nbsp;&nbsp;&nbsp;' +'<span>'+dialogName+'</span>' +'</h4>'+'<p class="list-group-item-text last-message">'+(dialogLastMessage === null ?  "" : (isMessageSticker ? 'Sticker' : dialogLastMessage))+'</p>'+'</a>';
		
		var dialogHtml = '<a href="#" class="los_chats list-group-item inactive" id='+'"'+dialogId+'"'+' data="' + opponentId + '" onclick="triggerDialog('+"'"+dialogId+"'"+');" ><li class="persona"><div class="circle-frame"><img src="images/Icon-60@3x.png"></div><h5>'+dialogName+'</h5><p>'+(dialogLastMessage === null ?  "" : (isMessageSticker ? 'Sticker' : dialogLastMessage))+'</p>'+(dialogUnreadMessagesCount === 0 ? UnreadMessagesCountHide : UnreadMessagesCountShow)+hora+'</div></li><a/>';
		return dialogHtml;
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

	/**
	 * Setup all chat listeners
	 */
	chatCore.setupAllListeners = function() {

		QB.chat.onMessageListener         = chatCore.onMessage;
		// QB.chat.onDisconnectedListener    = chatCore.onDisconnectedListener;
		// QB.chat.onReconnectListener       = chatCore.onReconnectListener;
		// QB.chat.onSystemMessageListener   = chatCore.onSystemMessageListener;
		// QB.chat.onDeliveredStatusListener = chatCore.onDeliveredStatusListener;
		// QB.chat.onReadStatusListener      = chatCore.onReadStatusListener;
		// setupIsTypingHandler();
	};

	/**
	 * On message listener
	 * @param Int userId
	 * @param String msg
	 */
	chatCore.onMessage = function(userId, msg) {
		console.log("onMessage");
		console.log(msg);
		if (chatCore.isMessageForCurrentDialog(userId, msg.dialog_id)){
			dialogsMessages.push(msg);

			if (msg.markable === 1)
				sendReadStatus(userId, msg.id, msg.dialog_id);

			var messageAttachmentFileId = null;
			if (msg.extension.hasOwnProperty("attachments"))
				if(msg.extension.attachments.length > 0) {
					messageAttachmentFileId = msg.extension.attachments[0].id;
				}

			chatCore.showMessage(userId, msg, messageAttachmentFileId);
		}
	}

	chatCore.showMessage = function(userId, msg, attachmentFileId) {
		console.log(attachmentFileId);
		var userLogin = getUserLoginById(userId);
		var myData = 	{
							items: [
										{
											_id 			: msg.id,
											has_attachments	: (typeof attachmentFileId !== 'undefined' && attachmentFileId !== null) ? true : false,
											attachmentFileId: attachmentFileId,
											sender 			: ( app.keeper.getItem('idSender') == msg.senderId ) ? 'outgoing' : 'incoming',
											message 		: msg.body
										}
									],
							token: chatCore.token
						};
		console.log(myData);
		app.render_template('dialog-messages', '#dialogs-list', myData, false, true);
		setTimeout(function(){

			return $('#dialogs-list').scrollTop($('#dialogs-list').scrollTop()+500);
		}, 200);
	}

	/**
	 * Validate incoming message
	 * @param Int userId
	 * @param Int dialogId
	 * @return Boolean
	 */
	chatCore.isMessageForCurrentDialog = function(userId, dialogId) {
		var result = false;
		if (dialogId == chatCore.currentDialog._id || (dialogId === null && chatCore.currentDialog.type == 3 && chatCore.opponentId == userId)) {
			result = true;
		}
		return result;
	}

	/**
	 * Reconnection listeners
	 */
	chatCore.onDisconnectedListener = function(){
		console.log("onDisconnectedListener");
	};

	chatCore.onReconnectListener = function(){
		console.log("onReconnectListener");
	};


	/**
	 * Fake submit handler
	 */
	chatCore.submit_handler = function(form) {
		return false;
	};
