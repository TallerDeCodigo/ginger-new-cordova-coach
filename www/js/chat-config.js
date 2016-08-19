// var responsedata = apiRH.getUsuarios();
// var user = responsedata;
// console.log(user);
// var i = 0;
// /*LLENA LA LISTA DE USUARIOS DEL CHAT */
// $.each(user, function( key, value ) {

//   $('.lista_chat').append(" <li class='persona' data='" + JSON.stringify(user[i]) + "'><div class='circle-frame'><img src='images/muestra.png'></div><h5>"+ user[i].nombre + ' ' + user[i].apellido +"</h5><p>Comí de más y ahora tengo dolor en mi hígado.</p><div class='no-leido'>12:06</div></li> ");

//   i++;
// });

/*
  INICIALIZA QUICKBLOX
*/


var QBApp = {
  appId: 20019,
  authKey: 'wX-b8q-hSn3AArS',
  authSecret: 'aCyMHpfYQNNZD8K'
};

var config = {
  chatProtocol: {
    active: 2
  },
  debug: {
    mode: 1,
    file: null
  }
};



/*
  DECLARA USUARIOS
*/

QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, config);




// Stickerpipe plugin en desuso


var config = {
  chatProtocol: {
    active: 2
  },
  debug: {
    mode: 1,
    file: null
  },
  stickerpipe: {
    elId: 'stickers_btn',

    apiKey: '847b82c49db21ecec88c510e377b452c',

    enableEmojiTab: false,
    enableHistoryTab: true,
    enableStoreTab: true,

    userId: null,

    priceB: '0.99 $',
    priceC: '1.99 $'
  }
};


