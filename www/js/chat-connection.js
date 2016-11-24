//"use strict";



function connectToChat(user) {
  var currentUser;
  console.log("Attempting to connect to chat api");

  QB.createSession({email: user.login, password: user.pass}, function(err, res) {

    console.log(user);

    currentUser = user;

    console.log("usr > "+user.login);
    console.log("pass > "+user.pass);

    console.log(res);
    if (res) {
      // save session token
      token = res.token;
      user.id = res.user_id;

      mergeUsers([{user: user}]);

      QB.chat.connect({userId: user.id, password: user.pass}, function(err, roster) {

        localStorage.setItem('idSender', user.id);

        if (err) {
          console.log(err);
        } else {

          console.log(roster);

          // setup scroll stickerpipe module
          //
          //setupStickerPipe();

          // load chat dialogs
          //
          retrieveChatDialogs();
          // setup message listeners
          //
          setupAllListeners();

          // setup scroll events handler
          //
          setupMsgScrollHandler();

        }
      });
    }
  });
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


// niceScroll() - ON
// $(document).ready(
//     function() {
//         $("html").niceScroll({cursorcolor:"#02B923", cursorwidth:"7", zindex:"99999"});
//         $(".nice-scroll").niceScroll({cursorcolor:"#02B923", cursorwidth:"7", zindex:"99999"});
//     }
// );
