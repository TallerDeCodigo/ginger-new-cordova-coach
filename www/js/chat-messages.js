var currentDialog = {};
var opponentId;

var dialogsMessages = [];

// submit form after press "ENTER"
function submit_handler(form) {
	return false;
}

function setupMsgScrollHandler() {
	var msgWindow = $('.col-md-8 .list-group.pre-scrollable');
	var msgList = $('#messages-pool');

	msgList.scroll(function() {
		if (msgWindow.scrollTop() == msgWindow.height() - msgList.height()){

			var dateSent = null;
			if(dialogsMessages.length > 0){
				dateSent = dialogsMessages[0].date_sent;
			}
			retrieveChatMessages(currentDialog, dateSent);
		}
	});
}

// on message listener
//
function onMessage(userId, msg) {

	// check if it's a mesasges for current dialog
	//
	if (isMessageForCurrentDialog(userId, msg.dialog_id)){
		dialogsMessages.push(msg);

		if (msg.markable === 1) {
			sendReadStatus(userId, msg.id, msg.dialog_id);
		}

		// сheck if it's an attachment
		//
		var messageAttachmentFileId = null;
		if (msg.extension.hasOwnProperty("attachments")) {
			if(msg.extension.attachments.length > 0) {
				messageAttachmentFileId = msg.extension.attachments[0].id;
			}
		}

		showMessage(userId, msg, messageAttachmentFileId);
	}
	// Here we process the regular messages
	//
	updateDialogsList(msg.dialog_id, msg.body);
}

function sendReadStatus(userId, messageId, dialogId) {
	var params = {
		messageId: messageId,
		userId: userId,
		dialogId: dialogId
	};
	QB.chat.sendReadStatus(params);
}

function onDeliveredStatusListener(messageId) {
	$('#delivered_'+messageId).fadeIn(200);
}

function onReadStatusListener(messageId) {
	$('#delivered_'+messageId).fadeOut(100);
	$('#read_'+messageId).fadeIn(200);
}

function retrieveChatMessages(dialog, beforeDateSent){
	$('.escribir').show();
	console.log('retrieveChatMessages');
	console.log(dialog);
	var params = {chat_dialog_id: dialog._id,
										 sort_desc: 'date_sent',
												 limit: 10};

	// if we would like to load the previous history
	if(beforeDateSent !== null){
		params.date_sent = {lt: beforeDateSent};
	}else{
		
		currentDialog = dialog;
		console.log("Current dialog");
		console.log(currentDialog);
		dialogsMessages = [];
	}

	QB.chat.message.list(params, function(err, messages) {
		if (messages) {

			console.log(messages);

			if(messages.items.length === 0) {
				$("#no-messages-label").removeClass('hide');
			} else {

				$("#no-messages-label").addClass('hide');

				messages.items.forEach(function(item, i, arr) {

					dialogsMessages.splice(0, 0, item); 
					//console.log(dialogsMessages.splice(0, 0, item));

					console.log('>>>>' + JSON.stringify(item));

					var messageId = item._id;
					var messageText = item.message;
					var messageSenderId = item.sender_id;

					console.log('idMensaje ' + messageSenderId);
					var messageDateSent = new Date(item.date_sent*1000);
					// var messageSenderLogin = getUserLoginById(messageSenderId);
					console.log(messageSenderId);


					// send read status
					if (item.read_ids.indexOf(currentUser.id) === -1) {
						sendReadStatus(messageSenderId, messageId, currentDialog._id);
					}

					var messageAttachmentFileId = null;
					if (item.hasOwnProperty("attachments")) {
						if(item.attachments.length > 0) {
							messageAttachmentFileId = item.attachments[0].id;
						}
					}

					var messageHtml = buildMessageHTML(messageText, messageSenderId, messageDateSent, messageAttachmentFileId, messageId);
					console.log(messageHtml);
					$('#messages-pool').prepend(messageHtml);

					// Show delivered statuses
					if (item.read_ids.length > 1 && messageSenderId === currentUser.id) {
						$('#delivered_'+messageId).fadeOut(100);
						$('#read_'+messageId).fadeIn(200);
					} else if (item.delivered_ids.length > 1 && messageSenderId === currentUser.id) {
						$('#delivered_'+messageId).fadeIn(100);
						$('#read_'+messageId).fadeOut(200);
					}

					if (i > 5) {$('body').scrollTop($('#messages-pool').prop('scrollHeight'));}
				});
			}
			setTimeout(function(){
				app.hideLoader();
				$('body').scrollTop($('#messages-pool').prop('scrollHeight'));
			}, 2400);
		}else{
			console.log(err);
		}

	});
	
	$(".load-msg").delay(100).fadeOut(500);
	// setTimeout(function(){ window.scrollTo(0,document.body.scrollHeight);  }, 1);
}//end retrieveChatMessages


// sending messages after confirmation
function clickSendMessage() {

	console.log('click send message');
	var currentText = $('#mensaje-chat').val().trim();
	console.log(currentText);
	if (currentText.length === 0)
		return;

	$('#mensaje-chat').val('').focus();
	sendMessage(currentText, null);
	$('#container').scrollTop($('#container').prop('scrollHeight'));
}

function clickSendAttachments(inputFile) {

	QB.content.createAndUpload({name: inputFile.name, file: inputFile, type: inputFile.type, size: inputFile.size, 'public': false}, function(err, response){
		if (err) {
			console.log(err);
		} else {

			$('#progress').fadeOut(400, function() {
				$('.input-group-btn_change_load').removeClass('visibility_hidden');
			});
			var uploadedFile = response;
			sendMessage('[attachment]', uploadedFile.id);
			$('input[type=file]').val('');
		}
	});
}

// send text or attachment
function sendMessage(text, attachmentFileId) {

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

// show messages in UI
function showMessage(userId, msg, attachmentFileId) {
	// add a message to list
	var userLogin = getUserLoginById(userId);
	var messageHtml = buildMessageHTML(msg.body, userId, new Date(), attachmentFileId, msg.id);

	$('#messages-pool').append(messageHtml);

	// scroll to bottom
	var mydiv = $('#messages-pool');
	console.log("Scrollheight ::: "+mydiv.prop('scrollHeight'));
	mydiv.scrollTop(mydiv.prop('scrollHeight'));
}


// show typing status in chat or groupchat
function onMessageTyping(isTyping, userId, dialogId) {
	showUserIsTypingView(isTyping, userId, dialogId);
}

// start timer after keypress event
var isTypingTimerId;
function setupIsTypingHandler() {
	QB.chat.onMessageTypingListener = onMessageTyping;

	$("#message_text").focus().keyup(function(){

		if (typeof isTypingTimerId === 'undefined') {

			// send 'is typing' status
			sendTypingStatus();

			// start is typing timer
			isTypingTimerId = setTimeout(isTypingTimeoutCallback, 5000);
		} else {

			// start is typing timer again
			clearTimeout(isTypingTimerId);
			isTypingTimerId = setTimeout(isTypingTimeoutCallback, 5000);
		}
	});
}

// delete timer and send 'stop typing' status
function isTypingTimeoutCallback() {
	isTypingTimerId = undefined;
	sendStopTypinStatus();
}

// send 'is typing' status
function sendTypingStatus() {
	if (currentDialog.type == 3) {
		QB.chat.sendIsTypingStatus(opponentId);
	} else {
		QB.chat.sendIsTypingStatus(currentDialog.xmpp_room_jid);
	}
}

// send 'stop typing' status
function sendStopTypinStatus() {
	if (currentDialog.type == 3) {
		QB.chat.sendIsStopTypingStatus(opponentId);
	} else {
		QB.chat.sendIsStopTypingStatus(currentDialog.xmpp_room_jid);
	}
}

// show or hide typing status to other users
function showUserIsTypingView(isTyping, userId, dialogId) {
	if(isMessageForCurrentDialog(userId, dialogId)){

		if (!isTyping) {
			$('#'+userId+'_typing').remove();
		} else if (userId != currentUser.id) {
			var userLogin = getUserLoginById(userId);
			var typingUserHtml = buildTypingUserHtml(userId, userLogin);
			$('#messages-pool').append(typingUserHtml);
		}

		// scroll to bottom
		var mydiv = $('#messages-pool');
		mydiv.scrollTop(mydiv.prop('scrollHeight'));
	}
}

// filter for current dialog
function isMessageForCurrentDialog(userId, dialogId) {
	var result = false;
	if (dialogId == currentDialog._id || (dialogId === null && currentDialog.type == 3 && opponentId == userId)) {
		result = true;
	}
	return result;
}
