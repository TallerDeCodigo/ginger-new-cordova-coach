
/*** Attempt to get chat methods in to order ***/
	window.chatCore = [];

	chatCore.isInitialized = false;
	chatCore.token = null;
	chatCore.currentUser = null;

	chatCore.init = function(elCoach){
		console.log("Initializing instant messaging api");
		if(chatCore.isInitialized)
			return this;
		chatCore.access = 	{ 	
								email: elCoach.mail, 
								password: elCoach.chatPassword
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
									return res;
								}
						} );
		return this;
	};

	chatCore.connectToChat = function(elCoach) {
		 
		QB.chat.connect({ 	
							email: elCoach.mail, 
							password: elCoach.chatPassword
						}, 
						 function(err, roster) {

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

	chatCore.fetchContactList = function(){

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
				});
				resDialogs.header_title = "Chat";
				console.log(resDialogs);
				app.render_template('chat-contacts', '.chat-container', resDialogs);
				return chatCore.initContactListEvents();
			}

		});
		return false;
	};

	chatCore.initContactListEvents = function(){

		$('.btnDialogs').click(function () {

			var qbox_id 	= $(this).data('qbox');
			var gingerid 	= $(this).data('gingerid');
			var dialog 		= $(this).data('dialog');
			app.keeper.setItem('idQBOX', qbox_id);
			app.keeper.setItem('idGinger', gingerid);
			return chatCore.retrieveChatMessages(dialog);
			// chatCore.joinToNewDialogAndShow(dialogObject);
			// if ( qbox_id == $('.los_chats:nth-of-type(1)').data('qbox') ) {
			// 	console.log('ya existe');
			// } else {
			// 	chatCore.createNewDialog();
			// }
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

	chatCore.retrieveChatMessages = function(dialogId, beforeDateSent){
		var dialogsMessages = [];
		
		app.showLoader();
		var data = {header_title: "Chat"};
		app.render_template('chat-messages', '.chat-container', data);
		
		console.log('retrieveChatMessages');
		var params 	= 	{
							chat_dialog_id: dialogId,
							sort_desc: 'date_sent',
							limit: 25 // TODO: change to smaller limit as soon as we connect previous messages handler
						};
		console.log(params);

		/** if we would like to load the previous history **/
		if(beforeDateSent)
			params.date_sent = {lt: beforeDateSent};
		
		QB.chat.message.list(params, function(err, messages) {
			
				console.log(messages);
				if(! messages || messages.items.length === 0)
					return app.toast("No hay mensajes que mostrar");
				
				console.log("Render the view");
				app.render_template('dialog-messages', '#dialogs-list', messages);
			// 		messages.items.forEach(function(item, i, arr) {

			// 			dialogsMessages.splice(0, 0, item); 
			// 			//console.log(dialogsMessages.splice(0, 0, item));

			// 			console.log('>>>>' + JSON.stringify(item));

			// 			var messageId = item._id;
			// 			var messageText = item.message;
			// 			var messageSenderId = item.sender_id;

			// 			console.log('idMensaje ' + messageSenderId);
			// 			var messageDateSent = new Date(item.date_sent*1000);
			// 			// var messageSenderLogin = getUserLoginById(messageSenderId);
			// 			console.log(messageSenderId);


			// 			// send read status
			// 			if (item.read_ids.indexOf(currentUser.id) === -1) {
			// 				sendReadStatus(messageSenderId, messageId, currentDialog._id);
			// 			}

			// 			var messageAttachmentFileId = null;
			// 			if (item.hasOwnProperty("attachments")) {
			// 				if(item.attachments.length > 0) {
			// 					messageAttachmentFileId = item.attachments[0].id;
			// 				}
			// 			}

			// 			var messageHtml = buildMessageHTML(messageText, messageSenderId, messageDateSent, messageAttachmentFileId, messageId);
			// 			console.log(messageHtml);
			// 			$('#messages-pool').prepend(messageHtml);

			// 			// Show delivered statuses
			// 			if (item.read_ids.length > 1 && messageSenderId === currentUser.id) {
			// 				$('#delivered_'+messageId).fadeOut(100);
			// 				$('#read_'+messageId).fadeIn(200);
			// 			} else if (item.delivered_ids.length > 1 && messageSenderId === currentUser.id) {
			// 				$('#delivered_'+messageId).fadeIn(100);
			// 				$('#read_'+messageId).fadeOut(200);
			// 			}

			// 			if (i > 5) {$('body').scrollTop($('#messages-pool').prop('scrollHeight'));}
			// 		});
			// 	}
			// 	setTimeout(function(){
			// 		app.hideLoader();
			// 		$('body').scrollTop($('#messages-pool').prop('scrollHeight'));
			// 	}, 2400);
			// }else{
			// 	console.log(err);

		});
		
		// $(".load-msg").delay(100).fadeOut(500);
		// setTimeout(function(){ window.scrollTo(0,document.body.scrollHeight);  }, 1);
	};


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


	chatCore.setupAllListeners = function() {
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
