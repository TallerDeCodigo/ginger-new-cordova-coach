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
					return app.render_chat_container( $(this).attr('href') );

				if( $(this).data('resource') == "user-list" )
					return app.render_user_list( $(this).attr('href') );


				if( $(this).data('resource') == "finanzas" )
					return app.render_finances_view( $(this).attr('href') );
				
				if( $(this).data('resource') == "about" )
					return app.render_about( $(this).attr('href') );
				
				if( $(this).data('resource') == "support" )
					return app.render_support( $(this).attr('href') );

				if( $(this).data('resource') == "profile" )
					return app.render_myProfile( $(this).attr('href') );

				if( $(this).data('resource') == "chat-dialog" )
					return app.render_chat_dialog( $(this).attr('href') );

				if( $(this).data('resource') == "diet-workspace" )
					return app.render_diet_workspace( $(this).attr('href'), $(this).data('method'));

				if( $(this).data('resource') == "diet-list" )
					return app.render_coach_dietas( $(this).attr('href') );
				if( $(this).data('resource') == "create-diet" )
					return app.render_create_diet($(this).attr('href'));
				if( $(this).data('resource') == "duplicate-diet" )
					return app.render_duplicate_diet($(this).attr('href'));
				
				if( $(this).data('resource') == "dish-list" )
					return app.render_dish_list($(this).attr('href'));
				if( $(this).data('resource') == "create-dish" )
					return app.render_create_dish($(this).attr('href'));
				
				if( $(this).data('resource') == "ingredients-list" )
					return app.render_ingredients($(this).attr('href'));
				if( $(this).data('resource') == "create-ingredient" )
					return app.render_create_ingredient($(this).attr('href'));
				
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

		var fixWithKeyboard = function(){
			console.log("Fixin keyboard");
			console.log( document.documentElement.clientHeight);
			$('body').addClass("openkeyboard");
			if( $('.view').hasClass("chat-dialog-messages") ){

				calculate = (!calculate) ? document.documentElement.clientHeight : calculate;
				console.log('calculate ::: '+calculate);		
				$('#container').animate({ height: calculate+"px"}, 240, 'swing', function(){
					$('#dialogs-list').scrollTop($('#dialogs-list').scrollTop()+700);
				});
				return;
			}
			
		}

		/*** Fix keyboard for chat views ***/
		if($('.view').hasClass("chat-dialog-messages")){
			/*** Fix keyboard chat specifics ***/
			console.log("Keyboard shrinkView");
			if(typeof Keyboard != 'undefined'){
				Keyboard.shrinkView(true);
				Keyboard.disableScrollingInShrinkView(true);
			}
		}
		/*** Fix keyboard for login ***/
		if($('.view').hasClass("login")){
			/*** Fix keyboard chat specifics ***/
			console.log("Keyboard shrinkView");
			if(typeof Keyboard != 'undefined'){
				Keyboard.shrinkView(true);
				Keyboard.disableScrollingInShrinkView(false);
			}
		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			console.log('keyboardDidShow');
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			console.log('keyboardDidHide');
			window.openKeyboard = false;
			$('body').removeClass("openkeyboard");
			$('body').scrollTop($('#messages-pool').prop('scrollHeight'));
			$('.escribir').css('bottom', 0);
		});
		
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
								var _coach 	= JSON.parse( app.keeper.getItem('user') );
								window._coach 	= (_coach) ? _coach : null;
								return app.render_home();
							}
							
						}else{
							app.toast("Ocurrió un error, por favor revisa que tus datos sean correctos.")
						}
					}
				});


		} //END login


		if( $('.view').hasClass('finanzas') ){

			var meses 		= window.catalogues.months;
			var todayObj 	= new Date();
			var base_month 	= todayObj.getMonth();
			var month 		= (!window.temp_month) ? todayObj.getMonth() : temp_month;
			console.log(todayObj.getDate());
			
			window.adjustFinanzas = function(){
				
				$('#upload_receipt').click(function(){
					console.log( 'Clicked upload receipt' );
					app.get_file_from_device( 'receipt', 'gallery' );
				});
				
				app.renderFinancesContent(month);
				
				setTimeout(function(){
					console.log("setting events");
					$('.btn_right').removeClass('inactive');
					
					if(month == base_month)
						$('.btn_right').addClass('inactive');
					
					$('.btn_right').click( function(){

						setTimeout(function(){
							app.showLoader();
						}, 420);
						month++;
						month = (month > 11) ? 0 : month;
						window.temp_month = month;
						if(month == base_month)
							$(this).addClass('inactive');
						app.renderFinancesContent(month+1);
						return initializeEvents();
					});

					$('.btn_left').click( function(){

						setTimeout(function(){
							app.showLoader();
						}, 420);
						month--;
						month = (month < 0) ? 11 : month;
						window.temp_month = month;
						if(month != base_month)
							$('.btn_right').removeClass('inactive');
						app.renderFinancesContent(month+1);
						return initializeEvents();
					});
				}, 800);
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
					// app.keeper.setItem("dietaEdit", _newDiet);
					return app.render_diet_workspace('dieta.html', 'clone');
				} else{
					return app.toast("Error clonando la dieta, por favor intenta nuevamente.");
				}

			});

		}//	END CLONE DIET


		/* User List */
		if( $('.view').hasClass('list-usuarios') ) {
			
			var myFoo =  null;
			myFoo = app.pop_cache_slot('user-list');

			if( myFoo ){
				myFoo = (myFoo && myFoo != '') ? myFoo : null;
				var diff_stamps = (myFoo) 	
									? (new Date().getTime() - myFoo.stamp)/1000
									: 0;
				app.render_template("user-list-content", ".insert_content", myFoo.data);
			}

			if( !myFoo  || (typeof myFoo['user-list'] !==  'undefined' && diff_stamps >= 600) ){
				
				if(users = apiRH.getUsuarios()){

					myFoo =  {  users: users };
					console.log(myFoo);
					app.push_cache_slot('user-list', myFoo);
					app.render_template("user-list-content", ".insert_content", myFoo);
				}
			}

			/*** Start chat updating process ***/
			chatCore.fetchUnreadCount(_coach);


			setTimeout( function(){
				
				$('.notificaciones').on('click', function(){
						app.render_comingSoon('proximamente.html');
				});

				$('.usuario-item').click(function(e){
					if( $(e.target).hasClass('notificaciones') || $(e.target).hasClass('mensajes') )
						return false;
					app.showLoader();
					var gingerId = $(this).data("gingerid");
					app.keeper.setItem('carry-user', gingerId);
					return app.render_clientProfile( 'usuario.html' );
				});

			}, 0);

			

		}
		

		/* Client profile */
		if( $('.view').hasClass('client-profile') ) {
			
			var clientId 		= app.keeper.getItem('carry-user');
			var responsedata 	= apiRH.fetchClientProfile(clientId);

			if(responsedata)			
				app.render_template("user-profile", ".view", responsedata);
			
			setTimeout( function(){
			
				$('#switch_diet').click( function(){
					var user_selected = app.keeper.getItem('carry-user');
					app.keeper.setItem('change_of_plan', true);
					return app.render_coach_dietas('lista-dietas.html');
				});

				$('.back.hook').click( function(e){
					e.preventDefault();
					return app.render_user_list( $(this).attr('href') );
				});
				
			}, 200);
			
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


		if( $('.view').hasClass('chat-container') && !$('.view').hasClass('chat-dialog-messages') ){
			
			var loginfo = { login : _coach.mail, pass : _coach.chatPassword };

			if( !$('#contacts-list').length )
				return chatCore.fetchContactList();
		
		} // END CLASS chat-container
		

		if( $('.view').hasClass('chat-dialog-messages') ){
				console.log("Chat messages ese");
				$("#load-img").change(function(){
					var inputFile = $("input[type=file]")[0].files[0];
					
					return chatCore.clickSendAttachments(inputFile);
				});

		} // END chat-contact-list


		if( $('.view').hasClass('dialog_detail') ){
			
			console.log("Autoload data");

			setTimeout(function(){
				app.showLoader();
			}, 420);
			if(!window.dialogNow)
				return;
			chatCore.currentDialog = chatCore.dialogs[window.dialogNow];
			chatCore.retrieveChatMessages(chatCore.currentDialog);
			$('#opponent_name').text(chatCore.currentDialog.name);
			/*** Add class to fix keyboard ***/
			$('.view').removeClass('dialog_detail');
			$('.view').addClass('chat-dialog-messages');
			return initializeEvents();
		} // END CLASS 'chat-dialog-messages'


		/**** Coach diet list ****/
		if( $('.view').hasClass('diet-list') ){
			
			var myFoo =  null;
			var i = 0;
			var idDelete = null;
			var responsedata = [];

			myFoo = app.pop_cache_slot('diet-list');
			app.keeper.removeItem('dietaEdit');

			var initDietActions = function(){

				/*** Dieta operations ***/
				$('.btn_copy').click(function (e) {
					e.preventDefault();
					app.keeper.setItem('dOperator', $(this).data('id'));
					return app.render_duplicate_diet('copiar-dieta.html');
				});

				$('.btn_edit').click(function (e) {

					e.preventDefault();
					app.keeper.setItem('dOperator', $(this).data('id'));
					return app.render_diet_workspace('dieta.html', 'edit')
				});

				$('.btn_delete').click(function () {

					idDelete = $(this).data('id');
					if(!$('.overscreen4').is(':visible')){
						$('.overscreen4').show();
						setTimeout(function() { $('.overscreen4').addClass('active'); }, 200);
					} else {
						$('.overscreen4').removeClass('active');
						setTimeout(function() { $('.overscreen4').hide(); }, 800);
					}
					$('#blur').toggleClass('blurred');
				});

					$('#delete-diet').click(function(){

						var response = apiRH.deleteDiet(idDelete);
						if(response){
							$('.each_diet_element[data-id='+idDelete+']').remove();
							app.clean_cache_slot('diet-list');
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


			if( myFoo ){
				myFoo = (myFoo && myFoo != '') ? myFoo : null;
				console.log(myFoo.data);
				var diff_stamps = (myFoo) 	
									? (new Date().getTime() - myFoo.stamp)/1000
									: 0;
				app.render_template("diet-list-content", ".insert_content", myFoo.data);
			}

			if( !myFoo  || (typeof myFoo['diet-list'] !==  'undefined' && diff_stamps >= 600) ){
				var diets = null;
				if( diets = apiRH.getDiets() ){
					myFoo =  {  diets: diets };
					console.log(myFoo);
					app.push_cache_slot('diet-list', myFoo);
					app.render_template("diet-list-content", ".insert_content", myFoo);
				}
			}

			initDietActions();
			
			$('.diet_element_hook').click( function(){

				var dietSelected = $(this).parent().data("id");
				console.log(dietSelected);
				var myClient 	= app.keeper.getItem('carry-user');
				var myClient 	= (myClient && myClient !== "") ? myClient : null;
				var changePlan 	= app.keeper.getItem('change_of_plan');
				var changePlan 	= (changePlan && changePlan !== "") ? changePlan : null;

				/** TODO: Check view only method ***/
				if( !changePlan || !myClient ){
					app.keeper.setItem('dOperator', dietSelected);
					return app.render_diet_workspace('dieta.html', 'view-only');
				}

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
						// app.keeper.removeItem('carry-user');
						app.keeper.removeItem('change_of_plan');
						app.toast("La dieta se ha actualizado");
						$('#blur').removeClass('blurred');
						return app.render_clientProfile('usuario.html');
					}
					app.keeper.removeItem('change_of_plan');
					app.toast("No se pudo cambiar la dieta, intenta nuevamente.");
					$('#blur').removeClass('blurred');
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

				return app.render_diet_workspace( 'dieta.html', 'create' );
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
			
			$('.platillo-item').click( function() {

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
				return app.render_diet_workspace("dieta.html", "edit");
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
			$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});
			$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});
			
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
						app.keeper.removeItem('live_dishCount');
						if( myDietStructure._id ){

							response = apiRH.saveDiet(myDietStructure);
							if(!response){
								app.keeper.removeItem('dietaEdit');
								return app.toast("Hubo un error editando la dieta. No se guardaron los cambios.");
								// return app.render_coach_dietas('dietas.html');
							}
							app.clean_cache_slot('diet-list');
							app.toast("Se han guardado los cambios a la dieta.");
							return app.render_coach_dietas('dietas.html');
						}
						else{
							response = apiRH.makeDiet(myDietStructure);	
							if(response){
								app.keeper.removeItem('dietaEdit');
								app.toast("Tu dieta ha sido creada correctamente.");
								app.clean_cache_slot('diet-list');
								return app.render_coach_dietas('dietas.html');
							}
							return app.toast("Hubo un error creando tu dieta.");
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

			$(".acc-selector").click(function(){
				if ($(this).hasClass('ui-state-active')) {
					if ($(this).hasClass('desayuno')) {$(this).parent().parent().animate({scrollTop:0}, 300);}
					if ($(this).hasClass('snack1')) {$(this).parent().parent().animate({scrollTop:54}, 300);}
					if ($(this).hasClass('comida')) {$(this).parent().parent().animate({scrollTop:120}, 300);}
					if ($(this).hasClass('snack2')) {$(this).parent().parent().animate({scrollTop:184}, 300);}
					if ($(this).hasClass('cena')) {$(this).parent().parent().animate({scrollTop:248}, 300);}
				}
			});


			/*
				CREATING A NEW DIET
			 */
			var dietaNew = {};
			/*** Pass this into a catalogue ***/
			var jsonNew = '{"nombre": "' +app.keeper.getItem('d_nombre') + '","descripcion":"' + app.keeper.getItem('d_comentario') + '", "estructura":{"domingo":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"lunes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"martes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"miercoles":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"jueves":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"viernes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"sabado":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}}},"perfil":{"sexo":0,"edad":0,"bmi":0,"objetivo":0}}';
			
			if( $('.workspace-diet').hasClass('edit') ){
				app.keeper.setItem('contador_platillos', 1);
			}

			if( $('.workspace-diet').hasClass('create') ){
				console.log("create");
				dietaNew = JSON.parse(jsonNew);
				app.keeper.setItem('contador_platillos', 0);
				app.keeper.setItem('dietaEdit', jsonNew);
				$('.platillo').hide();

			} else if ( app.keeper.getItem('idDishSelected') || app.keeper.getItem('dietaEdit') ) {
				console.log("Edito modo");
				dietaNew = JSON.parse( app.keeper.getItem('dietaEdit') );
				console.log(dietaNew);
				var dish_selected = app.keeper.getItem('idDishSelected');
				var live_dish_count = ( (!dietaNew.platillos || !dietaNew.platillos.length) && app.keeper.getItem('live_dishCount') !== "") 
														? app.keeper.getItem('live_dishCount')
														: 0;
				console.log(live_dish_count);
				// ADD DISH 'CALLBACK'
				if ( dish_selected ) {
					
					console.log("El dish selecto :: "+dish_selected);
					var i = 0;
					var rv = {};
					var guardar1  = [];
					var guardar2  = [];
					var week_day  = app.keeper.getItem('d_weekday');
					var meal_time = app.keeper.getItem('d_time');
					if(!dietaNew["estructura"][week_day])
						dietaNew["estructura"][week_day] = [];
					$.each( dietaNew["estructura"][week_day][meal_time], function( key, value ) {
						guardar1[i] = key;
						guardar2[i] = value;
						console.log("key :: "+key+"value :: "+value);
						i++;
					});

					guardar1[i] = i;
					guardar2[i] = {"a":{"platillo": dish_selected,"descripcion": app.keeper.getItem('desDishSelected'),"receta": app.keeper.getItem('recetaDishSelected')}};
					// var elPlatillo = { _id: dish_selected, app.keeper.getItem('desDishSelected'), app.keeper.getItem('recetaDishSelected') ];
					// console.log(elPlatillo);
					for (var j = 0; j < guardar1.length; j++) {
						var agregar = j+1;
						rv[agregar] = guardar2[j];
					}
					dietaNew["estructura"][week_day][meal_time]= rv;
					// dietaNew["platillos"].push(elPlatillo);
					app.keeper.setItem('dietaEdit', JSON.stringify(dietaNew));
					console.log(dietaNew);
					app.keeper.removeItem('idDishSelected');
					live_dish_count++;
					console.log(live_dish_count);
					app.keeper.setItem('live_dishCount', live_dish_count);
					workspace.dish_count = live_dish_count;
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

				/*** Edit diet from OperatorId ***/
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

					app.keeper.setItem( 'contador_platillos', platillos.length );

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
								
								var ing = '';
								$.each(value, function(key, value){
									console.log(key);
									console.log(value);
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

						if(key == "domingo"){dia_prueba = 1;} else if (key == "lunes") {dia_prueba = 2;} else if (key == "martes") {dia_prueba=3;} else if (key=="miercoles") {dia_prueba=4;} else if (key=="jueves") {dia_prueba=5;} else if (key=="viernes") {dia_prueba=6;} else if (key=="sabado") {dia_prueba=7;}
						
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
													console.log(misPlatos[i][1]);
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
														console.log(misPlatos[i]);
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
					
				}//end if dieta

				app.hideLoader();
			}

			$('.add_dish').click(function(){
				console.log("Adding dish");
				app.keeper.setItem( 'd_time', $(this).data('time') );
				app.keeper.setItem( 'd_weekday', $(this).data('weekday') );
				app.render_dish_list('platillos.html');
			});

			
		} // END workspace-diet


		/*** INGREDIENTS LIST ***/
		if( $('.view').hasClass('ingredients') ){

			var i = 0;
			var j = 0;
			var picker;
			var almacen;
			var temp;
			var arrAux 		= [];
			var arrAux_id 	= [];
			var arrIng 		= [];
			var arrCantidad = [];
			var tipo_de_ingredientes = window.catalogues.tipo_de_ingredientes; 
			var myIngredients = apiRH.listIngredient();
			
			$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});

			$.each(myIngredients, function( key, value ) {

			   	$('.' + tipo_de_ingredientes[value.categoria] + '').append('<li><span class="cantidad"></span><span class="ingred-name" >'+ value.nombre +'</span><input type="checkbox" name="pan" value="'+ value.nombre +'" data="'+value._id+'"></li>');	
				j++;
			});

			$("#picker-up").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#picker-up").bind('mousedown', function(e){
				if (apiRH.clickTimer == null) {
		        	apiRH.clickTimer = setTimeout(function () {
			            apiRH.clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(apiRH.clickTimer);
			        apiRH.clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        return false;
			    }
				apiRH.timeout = setInterval(function(){
					picker = Number($("#picker-up").parent().parent().find('input').val());
					if (picker < 99) {
						picker=picker+1;
						$("#picker-up").parent().parent().find('input').val(picker.toFixed(0));
						$('input[name="picker"]').attr("value", picker);
					}
					return false;
				}, apiRH.timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			$("#picker-dw").bind('touchstart touchend', apiRH.stickyTouchHandler);
			$("#picker-dw").bind('mousedown', function(e){
				if (apiRH.clickTimer == null) {
		        	apiRH.clickTimer = setTimeout(function () {
			            apiRH.clickTimer = null;
			        }, 320)
			    } else {
			        clearTimeout(apiRH.clickTimer);
			        apiRH.clickTimer = null;
			        e.preventDefault();
			        e.stopPropagation();
			        return false;
			    }
				apiRH.timeout = setInterval(function(){
					picker = Number($("#picker-dw").parent().parent().find('input').val());
					if (picker>1) {
						picker=picker-1;
						$("#picker-dw").parent().parent().find('input').val(picker.toFixed(0));
						$('input[name="picker"]').attr("value", picker);
					}
					return false;
				}, apiRH.timer);
				return false;
			})
			 .bind('mouseup', apiRH.clearTimeoutLogic);

			$('input[type="checkbox"]').change(function(){
				
				// countChecked();
				var value 	= $(this).val();
				var aidi 	= $(this).attr("data");

				if( !$(this).is(':checked') ){

					arrCantidad.indexOf(aidi);
					console.log(arrCantidad.indexOf(aidi));
					$(this).parent().find('.cantidad').html('');
					$(this).parent().find('.cantidad').hide();	

				}else{
					temp = aidi;
					 arrAux.push(value);
					 arrCantidad.indexOf(aidi);
					 console.log(arrCantidad.indexOf(aidi));
					// arrAux_id.push(aidi);
					$('.overscreen2').show();
				}
				almacen = $(this).parent().find('.cantidad');					
			});

			$('.establish').click(function(){
				$('.overscreen2').hide();
				almacen.show();
				var v =  $('input[name=picker]').val();
				almacen.html(v);
				picker = 1;
				$('input[name=picker]').val('1');
				arrAux_id.push(temp);
				arrCantidad.push({id: temp, cantidad: v});
			});

			$('.add ').click(function(){

				if(!$('.overscreen5').is(':visible')){
					$('.overscreen5').show();
					setTimeout(function() {$('.overscreen5').addClass('active');}, 200);
				} else {
					$('.overscreen5').removeClass('active');
					setTimeout(function() {$('.overscreen5').hide();}, 800);
				}
				$('#blur').removeClass('blurred');
			});

			$('#aceptar').click(function(){
				arrAux = JSON.stringify(arrAux);
				arrAux_id = JSON.stringify(arrAux_id);
				console.log(arrAux+" "+arrAux_id );
				app.keeper.setItem('ingredientes', arrAux);
				app.keeper.setItem('aidi_ingrediente', arrAux_id);
				app.render_create_dish('crear-platillo.html');
			});

			$('#cancelar').click(function(){
				$('.overscreen5').hide();
				$('#blur').removeClass('blurred');
			});

			app.hideLoader();

		} // END Ingredients


		/* CREATE DISH */
		if( $('.view').hasClass('create-dish') ){

			var is_public;
			var has_name;
			var has_receta;
			var has_comentarios;
			var has_ingredients;
			var tiempo = app.keeper.getItem('d_time');
			
			$('.meal-name').removeClass('snack1');
			$('.meal-name').addClass(tiempo);

			$('.meal-name').find('h1').html(' + ' + tiempo);

			$('input[type="checkbox"]').click(function(){
				if($(this).val() == 1){
					$(this).attr("value", "0");
				}else{
					$(this).attr("value", "1");
				}
				is_public = $(this).val();
				console.log(is_public);
			});

			var ingredientes_list = app.keeper.getItem('ingredientes');

			console.log(ingredientes_list);
			if(!ingredientes_list ){
				console.log('no tiene ingredientes');
			}else{
				console.log('tiene ingredientes');
				$('#lista_de_ingredientes').html(JSON.parse(ingredientes_list).join(", ") );
			}

			/*
				MANDA LOS DATOS DE ESTA PANTALLA A LA SIGUIENTE.
			*/
			$('.ingred').click(function(){
				var is_public = $('input[name="public"]').val();
				console.log(is_public);
				is_public = (is_public == 1) ? true: false;
				console.log(is_public);

				if ( $(this).find('a').html() == "+" ) {
					$(this).find('a').html('-');
				}else{
					$(this).find('a').html('+');
				}

				app.keeper.setItem('_public', is_public);
				app.keeper.setItem('recipe_name', 	$('textarea[name="descripcion"]').val() );
				app.keeper.setItem('recipe_recipe', $('textarea[name="receta"]').val() );
				app.keeper.setItem('recipe_comment', $('textarea[name="comentario"]').val() );

				return app.render_ingredients('ingredientes.html');
			});//end click

			

			$('.add').click(function () {


				var arrIngredientes = app.keeper.getItem('aidi_ingrediente');

				is_public 			= $('input[type="checkbox"]').val();
				has_name 			= $('textarea[name="descripcion"]').val();
				has_receta 			= $('textarea[name="receta"]').val();
				has_comentarios 	= $('textarea[name="comentario"]').val();
				has_ingredients 	= JSON.parse(arrIngredientes);

				console.log(typeof has_ingredients);

				var sIngredientes = [];
				if(has_ingredients){

					for (var i = 0; i < has_ingredients.length; i++) {
						console.log(has_ingredients[i]);
						sIngredientes.push( { _id: has_ingredients[i] } );
						// if(i < has_ingredients.length-1)
						// else
						// 	$.extend( sIngredientes, { _id: has_ingredients[i] } )
						// 	sIngredientes = sIngredientes + '{"_id" : "'  + has_ingredients[i] + '"}';

					}
				}
				console.log('CADENA: ' + JSON.stringify(sIngredientes));

				console.log(is_public+" "+has_name+" "+ has_receta +" "+ has_comentarios +" "+ arrIngredientes);

				var json = {
					"descripcion" : has_name,
					"receta" : has_receta,
					"coach" : app.keeper.getItem('userId'),
					"autorizado" : 0,
					"publico" : is_public,
					"comentarios" : has_comentarios,
					"ingredientes" : sIngredientes
				};

				console.log('Id User ' + app.keeper.getItem('userId'));

				console.log(JSON.stringify(json));

				var response = apiRH.makeDish(json);
				console.log(response);
				if(response){
					app.keeper.removeItem('d_nombre');
					app.keeper.removeItem('d_comentario');
					app.keeper.removeItem('ingredientes');
					app.toast("Tu platillo se ha creado exitosamente")
					return app.render_dish_list('platillos.html');
				}
				else{
					app.toast('Error creando el platillo');
				}
				

			});//end click

				var _public = app.keeper.getItem('_public');
				var recipe_name = app.keeper.getItem('recipe_name');
				var recipe_recipe = app.keeper.getItem('recipe_recipe');
				var recipe_comment = app.keeper.getItem('recipe_comment');
			if(recipe_name != "" || recipe_name != null || recipe_name !== undefined){
				if (_public=="1") {
					$('input[type="checkbox"]').prop('checked', false);
				} else {
					$('input[type="checkbox"]').prop('checked', true);
				}
				$('textarea[name="descripcion"]').html(recipe_name);
				$('textarea[name="receta"]').html(recipe_recipe);
				$('textarea[name="comentario"]').html(recipe_comment);
				console.log(recipe_name +" "+ recipe_recipe +" "+ recipe_comment);
			}else{
				console.log('nimadres');
			}


		} // END create-dish

		/* CREATE INGREDIENT */
		if( $('.view').hasClass('create-ingredient') ){

			var i_nombre;
			var category 	= -1;
			var tipo 		= -1;	
			var medida 		= -1;
			
			$('.add').click(function(){

				if(!$('.overscreen5').is(':visible')){
					$('.overscreen5').show();
					setTimeout(function() {$('.overscreen5').addClass('active');}, 200);
				} else {
					$('.overscreen5').removeClass('active');
					setTimeout(function() {$('.overscreen5').hide();}, 800);
				}
			});

				$('#aceptar').click(function(){
					
					i_nombre 	= $('input[name="name_ingrediente"]').val();
					
					if(i_nombre.length < 2) 
						return;
					if(category == -1) 
						return;
					if(tipo == -1) 
						return;
					if(medida  == -1) 
						return;

					var new_Ingredient =  {	
								"nombre" 	: i_nombre,
								"categoria" : category,
								"tipo" 	 	: tipo,
								"contable" 	: medida
							};

					var response = apiRH.newIngredient(new_Ingredient);
					console.log(response);
					if(!response)
						return app.toast('Error creando ingrediente');
						
					return app.render_ingredients('ingredientes.html');	
				});

				$('#cancelar').click(function(){
					$('.overscreen5').hide();
				});

			$('.ing-category').click(function() {
				$('.ing-category').removeClass('active');
				$(this).addClass('active');
				category = $(this).attr('value');
			});

			$('.btn-state').click(function(){
				$('.btn-state').removeClass('active');
				$(this).addClass('active');
				tipo = $(this).attr('data');
			});

			$('.siono').click(function(){
				$('.siono').removeClass('active');
				$(this).addClass('active');
				medida = $(this).attr('data');
			});
			
		} // END create-ingredient


		$(window).on("load resize",function(){

			var ancho = document.documentElement.clientWidth;
			var alto = document.documentElement.clientHeight;

			$('.list-platos #scroller > ul > li').css("height",alto-148); 
			$('#toda_la_dieta > li').css("height",alto-100);
			$('.iosm #toda_la_dieta > li').css("height",alto-120);
		});


	});

};
