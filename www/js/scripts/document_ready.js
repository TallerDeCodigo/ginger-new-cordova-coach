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
				if( $(this).data('resource') == "home" )
					return app.render_home( $(this).attr('href') );

				if( $(this).data('resource') == "chat-contacts" )
					return app.render_chat( $(this).attr('href') );

				if( $(this).data('resource') == "user-list" )
					return app.render_user_list( $(this).attr('href') );

				if( $(this).data('resource') == "diet-list" )
					return app.render_coach_dietas( $(this).attr('href') );

				if( $(this).data('resource') == "finanzas" )
					return app.render_finances_view( $(this).attr('href') );

				if( $(this).data('resource') == "profile" )
					return app.render_myProfile( $(this).attr('href') );


				if( $(this).data('resource') == "create-diet" )
					return app.render_create_diet($(this).attr('href'));
				if( $(this).data('resource') == "duplicate-diet" )
					return app.render_duplicate_diet($(this).attr('href'));
				
				e.stopPropagation();
			});
		};
		initHooks();

		if( $('#scroller').length ){
			new Swipe(document.getElementById('scroller'));
			window.slider = new Swipe(document.getElementById('scroller'));
		}

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
				
				$('#upload_receipt').click(function(){
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


		if( $('.view').hasClass('copy-diet') ){

			$('#start_copying').click(function () {

				console.log('Copy diet from existing structure');
				var d_nombre 		= $('input[name="nombre"]').val();
				var d_comentario 	= $('input[name="comentario"]').val();

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

				var _newDiet = apiRH.cloneDiet(clone_params);
				if(_newDiet._id){

					app.keeper.removeItem('d_comentario');
					app.keeper.removeItem('d_nombre');
					app.keeper.setItem("dOperator", _newDiet._id);
					return app.render_diet_edition('dieta.html', 'clone');
				} else{
					return app.toast("Error clonando la dieta, por favor intenta nuevamente.");
				}

			});

		}//	END CLONE DIET


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
					chatCore.fetchUnreadCount(_coach);
				}
			}else{
				// Render template with new information
				var content = JSON.parse( app.keeper.getItem('temp-return') );
				app.render_template("user-list-content", ".insert_content", content);

				/*** Start chat updating process ***/
				chatCore.fetchUnreadCount(_coach);
			}

			

			setTimeout( function(){
				
				$('.notificaciones').on('click', function(){
						app.render_comingSoon('proximamente.html');
				});

				$('.usuario-item').click(function(e){
					setTimeout(function(){
						app.showLoader();
					}, 420);
					var gingerId = $(this).data("gingerid");
					app.keeper.setItem('user-selected', gingerId);
					if(!$(e.target).hasClass('mensajes notificaciones'))
						return app.render_clientProfile( 'usuario.html' );
				});

			}, 0);

			

		}
		

		/* Client profile */
		if( $('.view').hasClass('client-profile') ) {
			
			var clientId =  app.keeper.getItem('user-selected');
			var responsedata 	= apiRH.fetchClientProfile(clientId);
			if(responsedata){
				
				app.render_template("user-profile", ".view", responsedata);
				
				setTimeout( function(){
				
					$('#switch_diet').click(function(){
						var user_selected = app.keeper.getItem('user-selected');
						app.keeper.setItem('change_of_plan', true);
						return app.render_coach_dietas('lista-dietas.html');
					});
					app.hideLoader();
				}, 0);

			}
			

		}
		

		/* Chat list */
		if( $('.view').hasClass('dialog_detail') ) {
			
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
			
			var i = 0;
			var idDelete = null;
			var responsedata = [];
			var local_tmp = app.keeper.getItem('temp-return');
				local_tmp = (local_tmp != '') ? JSON.parse( local_tmp ) : null;
			var diff_stamps = (local_tmp) 	? (new Date().getTime() - local_tmp.return_stamp)/1000
											: 0;
			var flag = (local_tmp) ? true : false;
			
			app.keeper.removeItem('dietaEdit');

			var initDietActions = function(){

				/*** Dieta operations ***/
				$('.btn_copy').click(function (e) {
					app.keeper.setItem('dOperator', $(this).data('id'));
				});

				$('.btn_edit').click(function (e) {
					e.preventDefault();
					console.log("edit");
					app.keeper.setItem('dOperator', $(this).data('id'));
				});

				$('.btn_delete').click(function () {

					idDelete = $(this).data('id');
					if(!$('.overscreen4').is(':visible')){
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
						if(response){
							$('.each_diet_element[data-id='+idDelete+']').remove();
							app.keeper.removeItem('temp-return');
						}
						$('.overscreen4').hide();
						$('#blur').toggleClass('blurred');
					});

					$('#cancelar').click(function(){
						idDelete = null;
						$('.overscreen4').hide();
						$('#blur').toggleClass('blurred');
					});

			};

			if(!local_tmp || local_tmp.return !=  'diet-list' || (local_tmp.return ==  'diet-list' && diff_stamps >= 600) ){
				
				var diets = null;
				if( diets = apiRH.getDiets() ){

					flag = true;
					responsedata =  {
										return 		: 'diet-list',
										return_stamp: new Date().getTime(),
										diets 		: diets
									};
					app.render_template("diet-list-content", ".insert-content", responsedata);
					app.keeper.setItem('temp-return', JSON.stringify(responsedata));
					initDietActions();
				}
			}else{

				var content = JSON.parse( app.keeper.getItem('temp-return') );
				app.render_template("diet-list-content", ".insert-content", content);
				initDietActions();
			}

			$('.diet_element_hook').click( function(){

				var dietSelected = $(this).parent().data("id");
				console.log(dietSelected);
				var myClient = app.keeper.getItem('user-selected');
				if(!myClient)
					return false;
				$('#blur').toggleClass('blurred');
				if(!$('.overscreen5').is(':visible')){
					console.log('entra popup');
					$('.overscreen5').show();
					setTimeout(function() {$('.overscreen5').addClass('active');}, 200);
				} else {
					$('.overscreen5').removeClass('active');
					setTimeout(function() {$('.overscreen5').hide();}, 800);
				}

				$('#accept-assignation').click(function(){
					
					console.log('CLICK CHANGE: ' + dietSelected);
					if(!myClient || myClient == '')
						return app.toast("No has seleccionado un usuario para asignar la dieta");

					var params = {
									dieta : dietSelected,
									coach : _coach._id
								};

					if( apiRH.updateClientDiet(myClient, params) ){
						// app.keeper.removeItem('user-selected');
						app.keeper.removeItem('change_of_plan');
						app.toast("La dieta se ha actualizado")
						return app.render_clientProfile('usuario.html');
					}
					return app.render_clientProfile('usuario.html');
				});

				$('#cancel-assignation').click(function(){
					$('.overscreen5').hide().removeClass('active');;
					$('#blur').removeClass('blurred');
				});

			});
			
			
		} // END diet-list

		/*** CREATE NEW DIET ***/
		if( $('.view').hasClass('create-new-diet') ){

			$('#create_new_diet').click( function () {
				
				app.showLoader();
				var formData 			= app.getFormData('#create_diet_form');
				
				if( formData.diet_name.length < 4 )
					return app.toast("El nombre de la dieta debe ser mayor a 4 caracteres");

				if( formData.diet_comment.length < 4 )
					return app.toast("La descripción debe ser mayor a 4 caracteres");
				
				app.keeper.setItem('d_nombre', formData.diet_name);
				app.keeper.setItem('d_comentario', formData.diet_comment);

				return app.render_diet_edition( 'dieta.html', 'create' );
			});

		} // END create-new-diet


	////////////////////////////////////////////////////////////
	//  PLATILLOS FUNCTIONS
	////////////////////////////////////////////////////////////		
		if( $('.view').hasClass('dish-list') ){


			var platos_privados = apiRH.listDishes(0);

			var i = 0;
			$.each(platos_privados, function( key, value ) {
				$('.list-dish.private').append('<li class="platillo-item" data="'+ platos_privados[i]._id +'" descripcion="' +  platos_privados[i].descripcion + '" receta="' + platos_privados[i].receta + '" > <h2 class="hache" data="'+ platos_privados[i].descripcion +'">' + platos_privados[i].descripcion + '</h2><p class="description">' + platos_privados[i].receta + '</p></li>');
				i++;	
			});

			var platos_publicos = apiRH.listDishes(1);

			i = 0;
			$('.list-dish.public').html('');
			$.each(platos_publicos, function( key, value ) {
				$('.list-dish.public').append('<li class="platillo-item" data="'+ platos_publicos[i]._id +'"><h2 class="hache" data="'+ platos_publicos[i].descripcion +'" >' + platos_publicos[i].descripcion + '</h2><p class="description">' + platos_publicos[i].receta + '</p></li>');
				i++;	
			});

			$('li.platillo-item').click(function() {
				$('li.platillo-item').removeClass('active');
				$(this).addClass('active');
			});
			
			$(document).on('click', '.platillo-item', function() {

				var _id 		= $(this).attr('data');
				var data_name 	= $(this).find('.hache').html();
				var data_description = 	( $(this).find('p').html() != '') 
									 	? $(this).find('p').html() 
									 	: "Sin receta";
				// TODO: Replace with modal template loading		
				if(!$('.alert_meal_description').is(':visible')){
					
					$('.alert_meal_description').show();

					$(".accept").data('id', _id);

					$('#meal_name').html(data_name);
					$('#meal_description').html(data_description);
					setTimeout(function() {$('.alert_meal_description').addClass('active');}, 200);
					/*Anade el platillo a la lista de platillos en el dia*/
				} else {
					$('.alert_meal_description').removeClass('active');
					setTimeout(function() {$('.alert_meal_description').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');

			});

			$('#accept_add_dish').click(function(){
				
				app.keeper.setItem('idDishSelected', $(this).data('id') );
				app.keeper.setItem('desDishSelected', $(this).parent().parent().find('h5').html() );
				app.keeper.setItem('recetaDishSelected', $(this).parent().parent().find('p').html() );
				$('.alert_meal_description').hide();
				$('#blur').toggleClass('blurred');
				return app.render_diet_edition("dieta.html");
			});

			$('#cancel_add_dish').click(function(){
				$('.alert_meal_description').hide();
				$('#blur').toggleClass('blurred');
			});

			setTimeout(function(){
				app.hideLoader();
			}, 0);

		} // END DISH LIST


		if( $('.view').hasClass('workspace-diet') ){

			var idDelete;
			var diaDelete;
			var mealDelete;
			var workspace = {};

			console.log("Workspace dieta");

			$('#save_working_diet').click( function(){

				var response = null;
				var dieta_added = app.keeper.getItem('idDishSelected');
				var contador_platillos = ( !workspace.dish_count ) ?  app.keeper.getItem('contador_platillos') : parseInt(workspace.dish_count);

				console.log('Saving diet structure');
				console.log(dieta_added);
				console.log("contador :: "+contador_platillos);

				if( contador_platillos && contador_platillos >= 3 ){

						var myDietStructure = JSON.parse( app.keeper.getItem('dietaEdit') );
						console.log('ID DIETA DEFINIDO: ' + myDietStructure._id);
						
						if( myDietStructure._id ){

							response = apiRH.saveDiet(myDietStructure);
							console.log(response);
						}
						else{
							response = apiRH.makeDiet(myDietStructure);	
							console.log(response);
						}

						if(response){			
							if (app.keeper.getItem('proviene') == "lista") {
								app.keeper.removeItem('dietaEdit');
								app.keeper.removeItem('proviene');
								return app.render_coach_dietas('dietas.html');
							} else {
								app.keeper.removeItem('dietaEdit');
								return app.render_coach_dietas('dietas.html');
							}
						}
				}else {

					if(!$('.overscreen_error').is(':visible')){

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


			$('.ingred').click(function(){
				$(this).parent().find('.los_ing').toggle();
			});

			$('.delete').click(function () {
				idDelete = $(this).attr('data');
				diaDelete = $(this).parent().parent().parent().parent().parent().parent().attr('class');
				if ($(this).parent().parent().parent().hasClass('desayuno')) {mealDelete='desayuno'}
				if ($(this).parent().parent().parent().hasClass('snack1')) {mealDelete='snack1'}
				if ($(this).parent().parent().parent().hasClass('comida')) {mealDelete='comida'}
				if ($(this).parent().parent().parent().hasClass('snack2')) {mealDelete='snack2'}
				if ($(this).parent().parent().parent().hasClass('cena')) {mealDelete='cena'}
				console.log(idDelete+" "+diaDelete+" "+mealDelete);

				if(!$('.overscreen5').is(':visible')){
					console.log('entra popup');
					$('.overscreen5').show();
					setTimeout(function() {$('.overscreen5').addClass('active');}, 200);
				} else {
					$('.overscreen5').removeClass('active');
					setTimeout(function() {$('.overscreen5').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');
			});

			$('#aceptar').click(function(){
				console.log('aceptar borrar');

				var modify = JSON.parse(app.keeper.getItem('dietaEdit'));
				if(app.keeper.getItem('contador_platillos') ){
					var count_less = app.keeper.getItem('contador_platillos');
					count_less--;
					app.keeper.setItem('contador_platillos', count_less);
				}
				var contar, letoca;

				$.each( modify["estructura"][diaDelete][mealDelete], function( key, value ) {
					contar = key;
					$.each( value, function( key, value ) {
						$.each( value, function( key, value ) {
							if (key=="platillo" && value==idDelete) {
								letoca = contar;
							}
						});
					});
				});

				delete modify["estructura"][diaDelete][mealDelete][letoca];

				$('li.'+diaDelete+' .'+mealDelete+' .platillo[data='+idDelete+']').remove();

				app.keeper.setItem('dietaEdit', JSON.stringify(modify));

				$('.overscreen5').hide();
				$('#blur').toggleClass('blurred');
			});

			$('#cancelar').click(function(){
				console.log('cancelado');
				$('.overscreen5').hide();
				$('#blur').toggleClass('blurred');
			});

			$('.back').click(function(){

				app.keeper.removeItem('dietaEdit');
				if ( app.keeper.getItem('proviene') == 'lista' ) {
					app.keeper.removeItem('proviene');
					return app.render_coach_dietas('dietas.html');
				} else {
					if( app.keeper.getItem('contador_platillos') )
						app.keeper.removeItem('contador_platillos');
					return app.render_coach_dietas('dietas.html');
					// window.location.assign('dietas.html');
				}
			});

			

			/*
				CREATING A NEW DIET
			 */
			var dietaNew = {};
			/*** Pass this into a catalogue ***/
			var jsonNew = '{"nombre": "' +app.keeper.getItem('d_nombre') + '","descripcion":"' + app.keeper.getItem('d_comentario') + '", "estructura":{"domingo":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"lunes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"martes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"miercoles":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"jueves":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"viernes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"sabado":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}}},"perfil":{"sexo":0,"edad":0,"bmi":0,"objetivo":0}}';
			
			if( $('workspace-diet').hasClass('edit') != -1){
				app.keeper.setItem('contador_platillos', 1);
			}

			if( $('workspace-diet').hasClass('create') != -1 ){

				dietaNew = JSON.parse(jsonNew);
				app.keeper.setItem('contador_platillos', 0);
				app.keeper.setItem('dietaEdit', jsonNew);
				$('.platillo').hide();

			} else if ( app.keeper.getItem('idDishSelected') || app.keeper.getItem('dietaEdit') ) {

				dietaNew = JSON.parse( app.keeper.getItem('dietaEdit') );
				var dish_count = 0;
				var dish_selected = app.keeper.getItem('idDishSelected');

				// ADD DISH 'CALLBACK'
				if ( dish_selected ) {
					
					console.log("El dish selecto :: "+dish_selected);
					var i = 0;
					var rv = {};
					var guardar1 = [];
					var guardar2 = [];
					var week_day =  app.keeper.getItem('d_weekday');
					var meal_time = app.keeper.getItem('d_time');

					$.each( dietaNew["estructura"][week_day][meal_time], function( key, value ) {
						guardar1[i] = key;
						guardar2[i] = value;
						i++;
					});

					guardar1[i] = i;
					guardar2[i] = {"a":{"platillo": dish_selected,"descripcion": app.keeper.getItem('desDishSelected'),"receta": app.keeper.getItem('recetaDishSelected')}};
					for (var j = 0; j < guardar1.length; j++) {
						var agregar = j+1;
						rv[agregar] = guardar2[j];
					}
					dietaNew["estructura"][week_day][meal_time]= rv;
					app.keeper.setItem('dietaEdit', JSON.stringify(dietaNew));
					console.log(dietaNew);
					app.keeper.removeItem('idDishSelected');
					dish_count++;
					console.log(dish_count);
					app.keeper.setItem('contador_platillos', dish_count);
				}

				var referer = false;

				if (dietaNew._id) {

					var i 	= 0;
					var j 	= 0;
					var receta;
					var nombre_receta;
					var platillo_id;
					var comm_id;
					var ingredientes;
					var comments;
					var misPlatos 		= [];
					var loscomentarios 	= [];
					var comentarios 	= dietaNew.comentarios;
					var platillos 		= dietaNew.platillos;
					
					referer = true;
					app.keeper.setItem( 'contador_platillos', platillos.length );

					$.each( dietaNew.platillos, function( key, value ) {

						misPlatos[i] = [];
						$.each( value, function( key, value ) {

							if ( key == "_id" )
								misPlatos[i][0] = value;

							if ( key == "descripcion" )
								misPlatos[i][1] = value;

							if ( key == "receta" )
								misPlatos[i][2] = value;

							if ( key == "ingredientes" ) {

								var ingredientes_concat = '';
								$.each(value, function(key, value){
									if(value._id != null)
										ingredientes_concat = ingredientes_concat + value._id.nombre;
								});
								misPlatos[i][3] = ingredientes_concat;
							}

						});
						i++;
					});

					i = 0;
					$.each( dietaNew.comentarios, function( key, value ) {
						loscomentarios[i] = [];
						j = 0;
						$.each( value, function( key, value ) {
							loscomentarios[i][j] = value;
							j++;
						});
						i++;
					});

					for ( var i = 0; i < misPlatos.length; i++ ) {
						misPlatos[i][4] = "";
						for (var j = 0; j < loscomentarios.length; j++) {
							if ( misPlatos[i][0] == loscomentarios[j][2] && misPlatos[i][4] == "" ) {
								misPlatos[i][4]  = loscomentarios[j][1];
							}
						}
					}
					console.log(misPlatos);
					console.log(loscomentarios);
				} // Dieta new id

				$.each( dietaNew.estructura, function( key, value ) {

					if(key == "domingo"){ dia_prueba = 1; } else if (key == "lunes") {dia_prueba=2;} else if (key == "martes") {dia_prueba=3;} else if (key == "miercoles") {dia_prueba=4;} else if (key == "jueves") {dia_prueba=5;} else if (key == "viernes") {dia_prueba=6;} else if (key=="sabado") {dia_prueba=7;}
					
					var level_refer = '#toda_la_dieta li:nth-of-type('+dia_prueba+') ';
					
					$.each( value, function( key, value ) {
						// desayuno, snack, comida,...
						var sec_level_refer = level_refer+'.acc-content.'+key+' ';
						var i = 1;

						$.each( value, function( key, value ) {
							// tiempos (1,2,3..)
							// console.log(key + " :::: 0" +value);
							var third_level_ref = sec_level_refer+'div.platillo:nth-of-type('+i+')';
							i++;	
							$.each( value, function( key, value ) {

								$.each( value, function( key, value ) {

									// console.log(key + " :::: " +value);
									if ( key == "platillo" ) {

										$(third_level_ref).attr("data", value);
										$(third_level_ref + ' nav svg').attr("data", value);

										if(referer)
											for (var ii = 0; ii < misPlatos.length; ii++) {
												if (value == misPlatos[ii][0]) {

													$(third_level_ref).attr( "data", misPlatos[ii][0] );
													$(third_level_ref + ' nav svg').attr( "data", misPlatos[ii][0] );
													$(third_level_ref+' h5').html( misPlatos[ii][1] );
													
													if (misPlatos[ii][2] != '') {
														$(third_level_ref+' p.receta').html( misPlatos[ii][2] );
													} else {
														$(third_level_ref+'p.receta').hide();
													}
													if (misPlatos[ii][4] != '') {
														$(third_level_ref+' p.comentario').html(misPlatos[ii][4]);
													} else {
														$(third_level_ref+' p.comentario').hide();
													}

													if(misPlatos[ii][3] != ''){
														$(third_level_ref+' p.los_ing').html(misPlatos[ii][3]);
														console.log('plato '+ii+' sus ing '+misPlatos[ii][3]);
													}else{
														console.log("nones");
													}
													
												}
											}

									}

									if ( key == "descripcion" ) {
										$(third_level_ref+' h5').html(value);
									}

									if ( key == "receta" ) {

										$(third_level_ref+' p.receta').html(value);
										if (value == '')
											$(third_level_ref+' p.receta').hide();
									}

									if ( $(third_level_ref+' p.comentario').html() == "" )
										$(third_level_ref+' p.comentario').hide();


								});	

							});
						});
					});
				});

				$('.platillo').each(function() {
					if ($(this).attr('data') === undefined) {
					  $(this).remove();
					}
				});

			}else{

				var dieta = apiRH.fetchDiet( app.keeper.getItem('dOperator') );
				console.log('ID DIET: ' + dieta._id);
				app.keeper.setItem('dietaEdit', JSON.stringify(dieta));

				if(dieta){
					var comm_id;
					var platillo_id;
					var comentarios = dieta.comentarios;
					var comments;
					var platillos = dieta.platillos;
					var receta;
					var nombre_receta;
					var ingredientes;
					var misPlatos = [];
					var i = 0;

					$.each( dieta.platillos, function( key, value ) {
						
						misPlatos[i] = [];
						$.each( value, function( key, value ) {

							if (key=="_id")
								misPlatos[i][0]=value;

							if (key=="descripcion")
								misPlatos[i][1]=value;

							if (key=="receta")
								misPlatos[i][2]=value;

							if (key=="ingredientes") {
								
								var ing = ' ';
								$.each(value, function(key, value){
									if(value._id != null){
										ing = ing + value._id.nombre;
									}	
								});
								misPlatos[i][3] = ing;
							}

						});
						i++;
					});

					var loscomentarios = [];
					var i = 0;
					var j = 0;

					$.each( dieta.comentarios, function( key, value ) {
						loscomentarios[i]=[];
						j = 0;
						$.each( value, function( key, value ) {
							loscomentarios[i][j]=value;
							j++;
						});
						i++;
					});

					for (var i = 0; i < misPlatos.length; i++) {
						misPlatos[i][4] = "";
						for (var j = 0; j < loscomentarios.length; j++) {
							if (misPlatos[i][0]==loscomentarios[j][2]&&misPlatos[i][4]=="") {
								misPlatos[i][4]=loscomentarios[j][1];
							}
						}
					}

					var dieta_array = [];
					var dia_prueba=0;
					var dias = [];
					var arrDieta = dieta;

					$.each( dieta.estructura, function( key, value ) {

						if(key == "domingo"){dia_prueba=1;} else if (key=="lunes") {dia_prueba=2;} else if (key=="martes") {dia_prueba=3;} else if (key=="miercoles") {dia_prueba=4;} else if (key=="jueves") {dia_prueba=5;} else if (key=="viernes") {dia_prueba=6;} else if (key=="sabado") {dia_prueba=7;}
						
						var level_refer = '#toda_la_dieta li:nth-of-type('+dia_prueba+') ';
						$.each( value, function( key, value ) {
							// desayuno, snack, comida,...
							var sec_level_refer = level_refer+'.acc-content.'+key+' ';
							var i=1;
							$.each( value, function( key, value ) {

								var third_level_ref = sec_level_refer+'div.platillo:nth-of-type('+i+')';
								i++;	
								$.each( value, function( key, value ) {

									$.each( value, function( key, value ) {

										if (key == "platillo") {
											for (var i = 0; i < misPlatos.length; i++) {
												if (value==misPlatos[i][0]) {

													$(third_level_ref).attr("data", misPlatos[i][0]);
													
													$(third_level_ref + ' nav svg').attr("data", misPlatos[i][0]);

													$(third_level_ref+' h5').html(misPlatos[i][1]);
													
													if (misPlatos[i][2]!="") {
														$(third_level_ref+' p.receta').html(misPlatos[i][2]);
													}else {
														$(third_level_ref+'p.receta').hide();
													}
													
													if (misPlatos[i][4]!="") {
														$(third_level_ref+' p.comentario').html(misPlatos[i][4]);
													}else {
														$(third_level_ref+' p.comentario').hide();
													}
													
													if(misPlatos[i][3]!= ''){
														$(third_level_ref+' p.los_ing').html(misPlatos[i][3]);
														// console.log('plato '+i+' sus ing'+misPlatos[i][3]);
													}

												}
											}
										}

									});	

								});
							});
						});
					});

					$('.platillo').each(function() {
						if ($(this).attr('data') === undefined) {
						  $(this).remove();
						}
					});
				
			}//end if


		} // ?????????????????? check this out

			$('.add_dish').click(function(){
				
				app.keeper.setItem('d_time', $(this).attr('data'));
				app.keeper.setItem('d_weekday', $(this).data('weekday'));
				app.render_dish_list('platillos.html');
			});

			$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});
			$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});
			
		} // END workspace-diet


		$(window).on("load resize",function(){

			var ancho = document.documentElement.clientWidth;
			var alto = document.documentElement.clientHeight;

			$('.list-platos #scroller > ul > li').css("height",alto-148); 
			$('#toda_la_dieta > li').css("height",alto-100);
			$('.iosm #toda_la_dieta > li').css("height",alto-120);
		});


	});

};
