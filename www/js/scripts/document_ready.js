	/*      _                                       _                        _       
	 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
	 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
	 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
	 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
	 *                                                                         |___/ 
	 */
		
window.initializeEvents = function(){
	jQuery(document).ready(function($) {
		console.log("Initializing events");
		
		//-----------------------------
		//
		// Keyboard events for iOS
		//
		//-----------------------------
		var initialViewHeight = document.documentElement.clientHeight;
		var calculate = null;

		/*** Fix keyboard defaults ***/
		if(typeof Keyboard != 'undefined'){
			console.log("Keyboard not undefined");
			Keyboard.disableScrollingInShrinkView(false);
			Keyboard.shrinkView(false);
		}

		if($('#container').hasClass("chat")){
			/*** Fix keyboard chat specifics ***/
			if(typeof Keyboard != 'undefined'){
				Keyboard.disableScrollingInShrinkView(true);
				Keyboard.shrinkView(true);
			}
		}

		var fixWithKeyboard = function(){
			$('body').addClass("openkeyboard");
			if($('#container').hasClass("chat")){

				calculate = (!calculate) ? document.documentElement.clientHeight : calculate;			
				$('#container').animate({ height: calculate+"px"}, 240, 'swing', function(){
					$('.escribir').slideToggle('fast');
				});
				return;
			}
			
		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			
			$('.escribir').hide();
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			window.openKeyboard = false;
			$('body').removeClass("openkeyboard");
			$('body').scrollTop($('#messages-list').prop('scrollHeight'));
			$('.escribir').css('bottom', 0);
		});

		/* Hook soft links */
		$('.hook').on('click', function(e){
			e.preventDefault();
			if( $(this).data('resource') == "home" )
				return app.render_home($(this).attr('href'));
			if( $(this).data('resource') == "chat-contacts" )
				return app.render_chat($(this).attr('href'));
			if( $(this).data('resource') == "user-list" )
				return app.render_user_list($(this).attr('href'));
			if( $(this).data('resource') == "diet-list" )
				return app.render_coach_dietas($(this).attr('href'));
			if( $(this).data('resource') == "finanzas" )
				return app.render_finanzas($(this).attr('href'));
			if( $(this).data('resource') == "profile" )
				return app.render_myProfile($(this).attr('href'));


			if( $(this).data('resource') == "create-diet" )
				return app.render_create_diet($(this).attr('href'));
			

			e.stopPropagation();
		});

		if( $('.view').hasClass('finanzas') ){
			var hoy = new Date();

			console.log("MES: " + (hoy.getMonth() + 1));

			var month = hoy.getMonth();
			var dia = hoy.getDate();
			var pdia = 1;

			var totalAmount = 0;
			var totalDays 	= 0;
			
			console.log(dia);

			var responsedata = apiRH.getFinanzas( hoy.getMonth() + 1 );
			var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
			$('.mes').html(meses[month]);


			var finanzas = responsedata;
			console.log(finanzas);

			var i = 0;

			$.each(finanzas, function( key, value ){

				$('.record').append('<tr><td>' + finanzas[i].name + '</td><td>' + finanzas[i].days_since_subscription + '</td><td>' + finanzas[i].days_since_subscription + '</td><td>$' + number_format(finanzas[i].amount_this_month, 2) + '</td></tr>');	

				totalAmount = totalAmount + finanzas[i].amount_this_month;

				totalDays= totalDays+finanzas[i].days_since_subscription;

				console.log( totalAmount + ' - ' +  totalDays);
				i++;
			});


			//TOTALES
			$('.totalAcumulado').html(number_format(totalAmount,2));
			$('.total').html(totalDays);

			//FECHAS DE INICIO
			$('.inicio').html(pdia);
			$('.final').html(dia + ' de ' + meses[month] );

			$('.btn-gre').click(function(){
				console.log('Clicked upload receipt');
				app.get_file_from_device('receipt', 'gallery');
			});

			$('.btn_right').click(function(){
				month++;

				
				if(month > 11){
					month = 0;
				}
				$('.mes').html(meses[month]);
				console.log(meses[month] );

				responsedata = apiRH.getFinanzas(month + 1);
			});

			$('.btn_left').click(function(){
				month--;
				if(month < 0){
					month = 11;
				}
				$('.mes').html(meses[month]);
				console.log(meses[month] );

				responsedata = apiRH.getFinanzas(month + 1);

			});
			app.hideLoader();
		}//	END HAS CLASS FINANZAS


			/*Coach Profile*/



		if($('.view').hasClass('coach-profile')) {

			
			console.log(JSON.stringify(localStorage.getItem('user')));

			var pUser = JSON.parse(localStorage.getItem('user'));
			// $('.la_img').attr('src','https://gingerfiles.blob.core.windows.net/coaches/' + pUser._id + '.png');
			// $('.cpur').html(pUser.nombre + ' ' + pUser.apellido);
			// $('.bio-coach').html('<strong>'+pUser.frase+'</strong><br/><br/>'+pUser.bio);

			//CALCULO DE LA ESTRELLAS DE MIERDA
			var star = Math.round(pUser.rating);

			console.log(Math.round(star));

			var count = 5;

			for (var i = 0; i < star; i++) {
				$('.rate-stars').append('<img src="images/starh.svg">');
				console.log(i);
				
			};
			
			for (var x = 0; x < count - star; x++) {
				console.log('-' + x);
				$('.rate-stars').append('<img src="images/star.svg">');
			};


			var personalidades = pUser.personalidad;
			var separador = "";

			for(var p=0; p<personalidades.length; p++){

				console.log(personalidades.length);
				if(p == personalidades.length - 1){
					separador = "";

				}else{
					separador = ", ";
				}
				console.log(catalogues.coach_type[p]);
				$('#coach_type_perfil').append(catalogues.coach_type[p] + separador);
			}

			/* Log Out from the API */
			$('#logout').on('click', function(e){
				/* Requesting logout from server */
				//var response = apiRH.logOut({user_login : user, request_token : apiRH.get_request_token() });
				//if(response.success){

					if($('.overscreen2').is(':visible') ){

					}else{
						$('.overscreen2').addClass('active');
						$('.overscreen2').show();
						$('#blur').toggleClass('blurred');
					}

					
			});
			$('#accept').click(function(){
				//app.toast('Has cerrado la sesión, hasta pronto');
						localStorage.clear();
					window.location.assign('login.html');
					return;
				//}
				app.toast('No ha sido posible crear tu cuenta, inténtalo de nuevo por favor.');
				return;
			});

			$('.cancel').click(function(){
				$('.overscreen2').hide();
				$('#blur').toggleClass('blurred');
			});
	

			app.hideLoader();

		} // END CLASS coach-profile

		if($('.view').hasClass('has-chat-list') ){
				
				var userLog = JSON.parse(localStorage.getItem('user'));

				var loginfo = { login : userLog.mail, pass : userLog.chatPassword};
				connectToChat(loginfo);
				

				var responsedata = apiRH.getUsuarios();

				console.log(JSON.stringify(responsedata));

				var user = responsedata;

				//Loop the feed

				var i = 0;

				$.each(user, function( key, value ) {
					
					console.log(i + " - " + value);
					
					$('#contacts-list').append("<a class='btnDialogs' data='" + JSON.stringify(user[i].jid) + "'><li class='persona' ><div class='circle-frame'><img src='images/Icon-60@3x.png'></div><h5 style='margin-top:10px'>" + user[i].nombre + " " + user[i].apellido + "</h5></li>");

					i++;
				});


				$('.btnDialogs').click(function () {
					
					console.log($(this).attr('data'));

					localStorage.setItem('idQBOX', $(this).attr('data'));

					if ($(this).attr('data')==$('.los_chats:nth-of-type(1)').attr('data')) {
						console.log('ya existe');
					} else {
						createNewDialog();
					}

				});

				$('.attach').click(function(){
					$('input[name="galeria"]').trigger('click');

				});

				$('.list-group-item').click(function(){
					console.log("aqui ");
					$('#dialog-list').hide();$('.menu-bar').hide();$('.escribir').show();
				});

				$('.back').click(function(){

					if($('#messages-list').is(':visible') ){
						console.log('lista_chat visible');
						$('#dialogs-list').show();
						$('#messages-list').hide();
						$('.escribir').hide();
						$('.menu-bar').show();
					}else if($('.lista_chat').is(':visible') ) {
						app.render_home();
					}

				});

				$('#btn_contacts').click(function(){
					$('#dialogs-list').hide();
					$('#contacts-list').show();
				});

				$('#btn_chats').click(function(){
					$('#dialogs-list').show();
					$('#contacts-list').hide();
				});

				$('#mensaje-chat').focus(function() {
  					if(this.innerHTML=='Mensaje') {this.innerHTML='';}
				});

				app.hideLoader();
		}//end IF body has class

		/**
		 *
		 * Lista de Dietas de Coach
		 *
		 **/

		if( $('.view').hasClass('diet-list') ){
			
			// setTimeout(function(){
			// 	app.showLoader();
			// }, 0);
			//Request to Service
			var responsedata = apiRH.getDiets();

			//console.log(JSON.stringify(responsedata));
			var diet = responsedata;

			//Loop the feed
			var i = 0;

			$.each(diet, function( key, value ) {
				
				//console.log(i + " - " + value);
				
				var nombre = 'no-name';
				var descripcion = '';
				var _id = ''

				$.each(value, function( key, value ) 
				{

					if(key == 'nombre'){
						//console.log(value);
						nombre = value;
					}

					if(key == '_id'){
						//console.log(value);
						_id  = value;
					}

					if(key == 'descripcion'){
						//console.log(value);
						descripcion = value;
					}
					
				});

				// $('.list-diet').append('<li class="elemento-dieta" data="' + _id + '"><h2> ' + nombre + ' </h2><p>' + descripcion + '</p><nav><a href="copiar-dieta.html"><img class="btn_copy" data="' + _id + '" src="images/copy.png"></a><a href="dieta.html"><img class="btn_edit" data="' + _id + '" src="images/edit.png"></a><a><img class="btn_delete" data="' + _id + '" src="images/delete.png"></a></nav></li>');

				i++;
			});

			$('.btn_copy').click(function (e) {
				console.log('copy');
				var idDieta = $(this).attr('data');	
				localStorage.setItem("dOperator", idDieta);

			});

			$('.btn_edit').click(function () {
				
				var idDietax = $(this).attr('data');

				console.log('ID DIET: ' + idDietax);

				localStorage.setItem('dOperator', idDietax);


			});
			var idDelete;
			$('.btn_delete').click(function () {
				console.log('borrar');
				idDelete = $(this).attr('data');
				if(!$('.overscreen4').is(':visible')){
					console.log('entra popup');
					$('.overscreen4').show();
					setTimeout(function() {$('.overscreen4').addClass('active');}, 200);
				} else {
					$('.overscreen4').removeClass('active');
					setTimeout(function() {$('.overscreen4').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');
			});

				$('#aceptar').click(function(){
					console.log('aceptar borrar');
					
					var response = apiRH.deleteDiet(idDelete);
					console.log(response);
					console.log(idDelete);
					if(response){
						console.log('DELETE OK: ' + response);
						$('li.elemento-dieta[data='+idDelete+']').remove();
					}

					$('.overscreen4').hide();
					$('#blur').toggleClass('blurred');

				});

				$('#cancelar').click(function(){
					console.log('cancelado');
					$('.overscreen4').hide();
					$('#blur').toggleClass('blurred');
				});

		}

	});

}
