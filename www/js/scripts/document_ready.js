/*      _                                       _                        _       
 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
 *                                                                         |___/ 
 */
		
window.initializeEvents = function(){
	jQuery(document).ready(function($) {

		console.log("Initializing DocReady v0.1");
		$('body').removeClass("preventEvents");
		
		window.initHooks = function(){
			console.log("Initializing hooks");
			/* Hook soft links */
			$('.hook').on('click', function(e){
				e.preventDefault();
				app.showLoader();
				if( $(this).data('resource') == "home" ){
					app.showLoader();
					return app.render_home( $(this).attr('href') );
				}
				if( $(this).data('resource') == "chat-contacts" ){
					app.showLoader();
					return app.render_chat( $(this).attr('href') );
				}
				if( $(this).data('resource') == "user-list" ){
					app.showLoader();
					return app.render_user_list( $(this).attr('href') );
				}
				if( $(this).data('resource') == "diet-list" ){
					app.showLoader();
					return app.render_coach_dietas( $(this).attr('href') );
				}
				if( $(this).data('resource') == "finanzas" ){
					app.showLoader();
					return app.render_finances_view( $(this).attr('href') );
				}
				if( $(this).data('resource') == "profile" ){
					app.showLoader();
					return app.render_myProfile( $(this).attr('href') );
				}


				if( $(this).data('resource') == "create-diet" )
					return app.render_create_diet($(this).attr('href'));
				if( $(this).data('resource') == "duplicate-diet" )
					return app.render_duplicate_diet($(this).attr('href'));
				

				e.stopPropagation();
			});
		};
		initHooks();

		
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
			Keyboard.shrinkView(false);
			Keyboard.disableScrollingInShrinkView(false);
		}

		if($('.view').hasClass("has-chat-list")){
			/*** Fix keyboard chat specifics ***/
			console.log("Keyboard has-chat-list");
			if(typeof Keyboard != 'undefined'){
				Keyboard.shrinkView(true);
				Keyboard.disableScrollingInShrinkView(true);
			}
		}

		var fixWithKeyboard = function(){
			console.log("Fixin keyboard");
			$('body').addClass("openkeyboard");
			if($('.view').hasClass("has-chat-list")){

				calculate = (!calculate) ? document.documentElement.clientHeight : calculate;
				console.log('calculate ::: '+calculate);		
				$('#container').animate({ height: calculate+"px"}, 240, 'swing', function(){
					$('.escribir').slideToggle('fast');
				});
				return;
			}
			
		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			console.log('keyboardDidShow');
			$('.escribir').hide();
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			console.log('keyboardDidHide');
			window.openKeyboard = false;
			$('body').removeClass("openkeyboard");
			$('body').scrollTop($('#messages-list').prop('scrollHeight'));
			$('.escribir').css('bottom', 0);
		});

		/*** Initializing chat api if not already did ***/
		if(!chatCore.isInitialized && loggedIn)
			chatCore.init(_coach);
		
		if($('.view').hasClass('login')){
			
			// setTimeout(function(){
			// 	$('#login_form').find('input').first().focus();
			// }, 0);

			if($('#login_form').length)
				$('#login_form').validate({
					rules:{
						mail:{
							required : true,
							email : true
						},
						pass : "required"
					},
					messages:{
						mail:{
							required:"Debes proporcionar un correo",
							email:"Proporciona un correo válido"
						},
						pass:"Este campo es requerido para acceder a tu cuenta"
					},
					submitHandler:function( form, event ){
						event.preventDefault();
						var data_login		= app.getFormData(form);
						var login_response 	= apiRH.loginNative(data_login);

						if(login_response){
							apiRH.headers['X-ZUMO-AUTH'] = login_response;
							var coachInfo = apiRH.getInfoCoach();
							if(coachInfo){
								var coachInfo 	= JSON.parse( app.keeper.getItem('user') );
								window._coach 	= (coachInfo) ? coachInfo : null;
								return app.render_home();
							}
							
						}else{
							app.toast("Ocurrió un error, por favor revisa que tus datos sean correctos.")
						}
					}
				});


		} //END login


		if( $('.view').hasClass('finanzas') ){

			window.adjustFinanzas = function(){

				var meses 	= catalogues.months;
				var todayObj 	= new Date();
				var base_month 	= todayObj.getMonth();
				var month 		= (!window.temp_month) ? todayObj.getMonth() : temp_month;

				

				$('.btn_right').removeClass('inactive');
				if(month == base_month)
					$('.btn_right').addClass('inactive');
				
				$('.btn-gre').click(function(){
					console.log( 'Clicked upload receipt' );
					app.get_file_from_device( 'receipt', 'gallery' );
				});

				$('.btn_right').click( function(){

					month++;
					month = (month > 11) ? 0 : month;
					window.temp_month = month;
					console.log(month);
					if(month == base_month)
						$(this).addClass('inactive');
					return app.renderFinancesContent(month);
				});

				$('.btn_left').click( function(){

					month--;
					month = (month < 0) ? 11 : month;
					window.temp_month = month;
					console.log(month);
					if(month != base_month)
						$('.btn_right').removeClass('inactive');
					return app.renderFinancesContent(month);
				});
				setTimeout(function(){
					/*** Fetch dynamic content ***/ 
					app.renderFinancesContent(month);
					// app.hideLoader();
				}, 1200);
			};
			adjustFinanzas();

		}//	END FINANZAS


		if( $('body').hasClass('copy-diet') ){

			$('#start_copying').click(function () {

				console.log('Copy diet from existing structure');
				var d_nombre 		= $('input[name="nombre"]').val();
				var d_comentario 	= $('input[name="comentario"]').val();

				// Pero bueno está bien
				app.keeper.setItem('d_nombre', d_nombre);
				app.keeper.setItem('d_comentario', d_comentario);

				if(d_nombre.length < 4)
					return app.toast("El nombre de la dieta debe ser mayor a 4 caracteres");

				if(d_comentario.length < 4)
					return app.toast("La descripción debe ser mayor a 4 caracteres");

				var clone_params = {
					"nombre" : 		app.keeper.getItem('d_nombre'),
					"descripcion" : app.keeper.getItem('d_comentario'),
					"id": 			app.keeper.getItem("dOperator")
				};

				var response = apiRH.cloneDiet(clone_params);
				if(response){

					var c_diet = response;
					app.keeper.removeItem('d_comentario');
					app.keeper.removeItem('d_nombre');
					app.keeper.setItem("dOperator", c_diet._id);
					//TODO: Render via templating engine
					window.location.assign('dieta.html');
				} else{
					return app.toast("Error clonando la dieta, por favor intenta nuevamente.");
				}

			});
		}


		/* User List */
		if( $('.view').hasClass('list-usuarios') ) {
			
			var response = [];
			var flag = false;

			var local_tmp = app.keeper.getItem('temp-return');
				local_tmp = (local_tmp != '') ? JSON.parse( local_tmp ) : null;
			var flag = (local_tmp) ? true : false;
			var diff_stamps = (local_tmp) 	? (new Date().getTime() - local_tmp.return_stamp)/1000
											: 0;

			if( !local_tmp || local_tmp.return !=  'user-list' || (local_tmp.return ==  'user-list' && diff_stamps >= 600) ){
				var diets = null;
				if(users = apiRH.getUsuarios()){

					responsedata =  {
										return 		: 'user-list',
										return_stamp: new Date().getTime(),
										users 		: users
									};
					app.keeper.setItem('temp-return', JSON.stringify(responsedata));
					flag = true;

					app.render_template("user-list-content", ".insert_content", responsedata);

					/*** Start chat updating process ***/
					return chatCore.fetchUnreadCount(_coach);
				}
			}else{
				// Render template with new information
				var content = JSON.parse( app.keeper.getItem('temp-return') );
				app.render_template("user-list-content", ".insert_content", content);

				/*** Start chat updating process ***/
				return chatCore.fetchUnreadCount(_coach);
			}
			setTimeout(function(){
				$('.notificaciones').on('click', function(){
						app.render_comingSoon('proximamente.html');
				});
			}, 1000);
			/*** Manually retry once ***/
			// if(!response.users)
			// 	response.users = apiRH.getUsuarios();

		}
		

		/* Chat list */
		if($('.view').hasClass('dialog_detail')) {
			
			if($('.view').hasClass('dialogLoad')){
				console.log("Trigger load chat content");
				if(!dialogNow)
					console.log("Too bad for you");
				triggerDialog(dialogNow);
			}

		}
		
		/*Coach Profile*/
		if($('.view').hasClass('coach-profile')) {

			/* Log Out from the API (Actually just delete local info, token is not affected) */
			/* TODO: Proper log out */
			$('#logout').on('click', function(e){
				if(!$('.overscreen2').is(':visible') ){
					$('.overscreen2').addClass('active');
					$('.overscreen2').show();
					$('#blur').toggleClass('blurred');
				}
			});

			$('#accept.logout').click(function(){
				app.keeper.clear();
				app.toast('Sesión cerrada ¡hasta pronto!');
				$('#blur').toggleClass('blurred');
				return app.render_login();
			});

			$('.cancel').click(function(){
				$('.overscreen2').hide();
				$('#blur').toggleClass('blurred');
			});
			app.hideLoader();

		} // END CLASS coach-profile

		if( $('.view').hasClass('has-chat-list') ){
				
				var loginfo = { login : _coach.mail, pass : _coach.chatPassword };
				connectToChat(loginfo);

				var users_response = [];
					users_response.users = apiRH.getUsuarios();
				console.log(users_response);
				app.render_template('chat-dialogs', '.insert_contacts', users_response);

				$('.btnDialogs').click(function () {
					
					app.keeper.setItem('idQBOX', $(this).attr('data'));
					if ($(this).attr('data') == $('.los_chats:nth-of-type(1)').attr('data')) {
						console.log('ya existe');
					} else {
						createNewDialog();
					}
				});

				$('.attach').click(function(){
					$('input[name="galeria"]').trigger('click');
				});

				$('.list-group-item').click(function(){

					$('#dialog-list').hide();
					$('.menu-bar').hide();
					$('.escribir').show();
				});

				$('.back').click(function(){

					if($('#messages-list').is(':visible') ){
						console.log('lista_chat visible');
						var event = new CustomEvent("keyboardDidHide", { "detail": "Forced hide keyboard event" });
						document.dispatchEvent(event);
						$('.escribir').hide();
						$('#dialogs-list').show();
						$('#messages-list').hide();
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

		} // END has-chat-list

		/**
		 *
		 * Lista de Dietas de Coach
		 *
		 **/

		if( $('.view').hasClass('diet-list') ){
	
			//Request to Service
			var i = 0;
			var idDelete = null;
			var responsedata = [];
			var local_tmp = app.keeper.getItem('temp-return');
				local_tmp = (local_tmp != '') ? JSON.parse( local_tmp ) : null;
			var diff_stamps = (local_tmp) 	? (new Date().getTime() - local_tmp.return_stamp)/1000
											: 0;
			var flag = (local_tmp) ? true : false;

			if(!local_tmp || local_tmp.return !=  'diet-list' || (local_tmp.return ==  'diet-list' && diff_stamps >= 600) ){
				console.log("Gonna get some data");
				var diets = null;
				if( diets = apiRH.getDiets() ){

					responsedata =  {
										return 		: 'diet-list',
										return_stamp: new Date().getTime(),
										diets 		: diets
									};
					console.log(responsedata);
					app.render_template("diet-list-content", ".insert-content", responsedata);
					app.keeper.setItem('temp-return', JSON.stringify(responsedata));
					flag = true;
				}
			}else{
				console.log("not getting data");
				// Render template with new information
				var content = JSON.parse( app.keeper.getItem('temp-return') );
				app.render_template("diet-list-content", ".insert-content", content);
				return;
			}

			var dietsContent = (!flag) ? responsedata : local_tmp;

			app.render_template("diet-list-content", ".insert-content", dietsContent);

			/*** Dieta operations ***/
			$('.btn_copy').click(function (e) {
				// var $context = $(this);
				// e.preventDefault();
				// console.log("copy");
				app.keeper.setItem('dOperator', $(this).data('id'));
				// console.log($context.attr('href'));
				// window.location.assign($context.attr('href'));
			});

			$('.btn_edit').click(function (e) {
				e.preventDefault();
				console.log("edit");
				app.keeper.setItem('dOperator', $(this).data('id'));
			});

			$('.btn_delete').click(function () {

				idDelete = $(this).data('id');
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

				$('#delete-diet').click(function(){

					var response = apiRH.deleteDiet(idDelete);
					console.log(response);
					if(response)
						$('li.elemento-dieta[data='+idDelete+']').remove();

					$('.overscreen4').hide();
					$('#blur').toggleClass('blurred');
				});

				$('#cancelar').click(function(){
					idDelete = null;
					$('.overscreen4').hide();
					$('#blur').toggleClass('blurred');
				});
			
			initHooks();
		} // END diet-list

		if($('.view').hasClass('create-new-diet')){

			$('.btn-gre').click(function () {
				app.showLoader();
				console.log('CREAR DIETA');

				var d_nombre 		= $('input[name="nombre"]').val();
				var d_comentario 	= $('input[name="cometario"]').val();

				app.keeper.setItem('d_nombre', d_nombre);
				app.keeper.setItem('d_comentario', d_comentario);
				d_nombre 		= app.keeper.getItem('d_nombre');
				d_comentario 	= app.keeper.getItem('d_comentario'); 

				console.log(d_nombre);
				console.log(d_comentario);

				if(d_nombre.length < 4)
					return;
				if(d_comentario.length < 4)
					return;

				//REQUEST TO GET DIET
				window.location.assign('dieta.html?method=create');
				
			});

		} // END create-new-diet


		$('.btn_add').click(function(){
			console.log('Saving diet structure');

			var dieta_added = app.keeper.getItem('idDishSelected');
			var contador_platillos = app.keeper.getItem('contador_platillos');
			console.log(dieta_added);
			console.log("contador :: "+app.keeper.getItem('contador_platillos'));
			if(app.keeper.getItem('contador_platillos') >= 3 ){

					var dieta = app.keeper.getItem('dietaEdit');
					
					console.log('ID DIETA DEFINIDO: ' +JSON.parse(dieta)._id);
					
					if(JSON.parse(dieta)._id){

						var response = apiRH.saveDiet(dieta);
						console.log(response);
					}
					else{
						var response = apiRH.makeDiet(dieta);	
					}

					if(response){			
		  				if (app.keeper.getItem('proviene') == "lista") {
		  					app.keeper.removeItem('dietaEdit');
		  					app.keeper.removeItem('proviene');
			 	 		window.location.assign('lista-dietas.html');
		        		} else {
		        			app.keeper.removeItem('dietaEdit');
			     		window.location.assign('dietas.html');
		        	 	}
		        	}
			}else {

				if(!$('.overscreen_error').is(':visible')){
					console.log('entra popup');
					$('.overscreen_error').show();
					setTimeout(function() {$('.overscreen_error').addClass('active');}, 200);
				} else {
					$('.overscreen_error').removeClass('active');
					setTimeout(function() {$('.overscreen_error').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');

				$('#aceptar_error').click(function(){
					$('.overscreen_error').hide();
					$('#blur').toggleClass('blurred');
				})
			}
		}); // END Save diet structure


	});

}
