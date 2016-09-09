   /*     _                        _     _           _   
	*    / \   _ __  _ __     ___ | |__ (_) ___  ___| |_ 
	*   / _ \ | '_ \| '_ \   / _ \| '_ \| |/ _ \/ __| __|
	*  / ___ \| |_) | |_) | | (_) | |_) | |  __/ (__| |_ 
	* /_/   \_\ .__/| .__/   \___/|_.__// |\___|\___|\__|
	*         |_|   |_|               |__/               
	*/

	var app = {
		app_context: this,
			// Application Constructor
		initialize: function() {


			// 1) Request background execution
			// cordova.plugins.backgroundMode.enable();

			// // 2) Now the app runs ins background but stays awake
			// cordova.plugins.backgroundMode.onactivate = function () {
			//     setInterval(function () {
			//         cordova.plugins.notification.badge.increase();
			//         cordova.plugins.backgroundMode.setDefaults({ color: 'FF0000' });
			//     }, 1000);
			// };

			// // 3) App is back to foreground
			// cordova.plugins.backgroundMode.ondeactivate = function () {
			//     cordova.plugins.notification.badge.clear();
			// };

			this.bindEvents();
			/* Initialize API request handler */
			window.apiRH = new requestHandlerAPI().construct(app);

			//console.log('token');
			
			var is_login = apiRH.has_token();

			var is_client = localStorage.getItem('customerId');

			var is_current = localStorage.getItem('valido');

			//console.log(is_login);

			/* IMPORTANT to set requests to be syncronous */
			/* TODO test all requests without the following code 'cause of deprecation */
			$.ajaxSetup({
				 async: false
			});

			window.loggedIn = false;
			this.ls 		= window.localStorage;
			if(is_login)
				loggedIn = true;
	
			/* Check if has a valid token */
			//var response = apiRH.has_valid_token();

			if(is_login){
				
				//console.log('You okay, now you can start making calls');
				/* Take the user to it's timeline */

				var is_home = window.is_home;
				

				if(is_home){
					return;
				}else{
					if(!is_home)
						return;
					else	
						window.location.assign('index.html?filter_feed=all');
				}	
				return;
			}else{
				if(window.is_login){
					return;
				}else{
					window.location.assign('login.html');
					return;
				}
				
			}
			/* Copiado de ondeviceready ----- QUITAR ----- */
			// var backButtonElement = document.getElementById("backBtn");
			// if(backButtonElement)
			// 	backButtonElement.addEventListener("click", app.onBackButton, false);
			
			/* Requesting passive token if no token is previously stored */
			//console.log("Token::: "+apiRH.request_token().get_request_token());
		},
		registerCompiledPartials: function() {
			console.log("Register pre compiled partials");
			/* Add files to be loaded here */
			var filenames = ['header', 'history_header', 'history_header_nouser', 'search_header', 'feed_chunk', 'sidemenu', 'sidemenu_logged', 'footer', 'subheader', 'dom_assets'];
			
			filenames.forEach(function (filename) {
					//Handlebars.registerPartial(filename, Handlebars.templates[filename]);
			});
		},
		registerTemplate : function(name) {
			$.ajax({
				url : 'views/' + name + '.hbs',
				success : function(response) {
						if (Handlebars.templates === undefined)
							Handlebars.templates = {};
					Handlebars.templates[name] = Handlebars.compile(response);
				}
			});
			return;
		},
		registerHelpers : function() {
			Handlebars.registerHelper('if_eq', function(a, b, opts) {
				if (a == b) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			});
			Handlebars.registerHelper('if_module', function(a, b, opts) {
				if (a%b == 0) {
					return opts.fn(this);
				} else {
					return opts.inverse(this);
				}
			});
			return;
		},
		bindEvents: function() {
			document.addEventListener('deviceready', app.onDeviceReady, false);
			document.addEventListener('mobileinit', app.onDMobileInit, false);
		},
		onBackButton: function(){
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
		        // IOS DEVICE
		        history.go(-1);
		    } else if (userAgent.match(/Android/i)) {
		        // ANDROID DEVICE
		        navigator.app.backHistory();
		    } else {
		        // EVERY OTHER DEVICE
		        history.go(-1);
		    }
		    console.log("BAck");
		},

		// deviceready Event Handler
		onDeviceReady: function() {
			app.receivedEvent('deviceready');




			/*   ___    _         _   _     
			*  / _ \  / \  _   _| |_| |__  
			* | | | |/ _ \| | | | __| '_ \ 
			* | |_| / ___ \ |_| | |_| | | |
			*  \___/_/   \_\__,_|\__|_| |_|
			*/                              




			try{
				OAuth.initialize('F_A1PBTm8Vv9WtuftE8CuTqNV7g');
				console.log("Initialized Oauth");
			}
			catch(err){
				app.toast("Oauth error ocurred");
				console.log('OAuth initialize error: ' + err);
			}
			var backButtonElement = document.getElementById("backBtn");
			if(backButtonElement)
				backButtonElement.addEventListener("click", app.onBackButton, false);
			return;
		},

		// deviceready Event Handler
		onMobileInit: function() {
			app.receivedEvent('mobileinit');
			console.log("mobileinit");
		},
		// Update DOM on a Received Event
		receivedEvent: function(id) {
			if(id == 'deviceready' && typeof navigator.splashscreen != 'undefined'){
				navigator.splashscreen.hide();
			}
		},
		getJsonCatalogue: function(catalogue_name) {
			var response = $.getJSON('compiled/catalogues/'+catalogue_name+'.json');
			return JSON.parse(response.responseText);
		},
		gatherEnvironment: function(optional_data, history_title) {
			/* Gather environment information */
			var meInfo 	= apiRH.ls.getItem('me');
			var logged 	= apiRH.ls.getItem('me.logged');
			var parsed 	= {me: JSON.parse(meInfo), logged_user: JSON.parse(logged)};
			
			if(optional_data){
				parsed['data'] = optional_data;
				//return parsed;
			}
			if(history_title)
				parsed['header_title'] = history_title;
			return parsed;

		},
		getUrlVars: function() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
				vars[key] = value;
			});
			return vars;
		},
		/* Returns the values in a form as an associative array */
		/* IMPORTANT: Does NOT include password type fields */
		getFormData: function (selector) {
			return $(selector).serializeJSON();
		},
		isObjEmpty: function (obj) {

				if (obj == null) return true;
				if (obj.length > 0)    return false;
				if (obj.length === 0)  return true;

				for (var key in obj) 
					if (hasOwnProperty.call(obj, key)) return false;
				return true;
		},
		render_home : function(){
			app.showLoader();
			$(document).ready(function(){
				return app.hideLoader();
			});
		},
		render_chat : function(){
			return app.showLoader();
		},								
		render_create_user : function(){

			/* Send header_title for it renders history_header */
			var data = app.gatherEnvironment(null, "Create account");
			var template = Handlebars.templates['create_account'];

			$('.main').html( template(data) );
			setTimeout(function(){
				app.hideLoader();
			}, 2000);
		},
		render_settings : function(){
			/* Send header_title for it renders history_header */
			$.getJSON(api_base_url+user+'/me/')
			 .done(function(response){
				var data = app.gatherEnvironment(response, "Account settings");
				console.log(data);
				/* Get printers and models from catalogue */
				data.printers = app.getJsonCatalogue("pModels");
				var parent_count = Object.keys(app.getJsonCatalogue("pModels")).length;
				var this_brand = null;
				data.printer_brands = [];
				data.printer_models = [];
				for(var i = 0; i < parent_count; i++){
					this_brand = Object.keys(data.printers)[i];
					data.printer_brands.push(this_brand);
					var level_count = data.printers[this_brand].length;
					data.printer_models[this_brand] =  [];
					for(var j = 0; j<level_count; j++ ){
						var this_model = data.printers[this_brand];
						data.printer_models[this_brand].push(this_model[j]);
					}
				}
				window.printers_global = data.printer_models;
				var template = Handlebars.templates['settings'];
				$('.main').html( template(data) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			})
			  .fail(function(err){
				console.log(err);
			});
		},
		render_notifications : function(){
			/* Send header_title for it renders history_header */
			var data = app.gatherEnvironment(null, "Notifications");
			data.notifications_active = true;

			var template = Handlebars.templates['notifications'];
			$('.main').html( template(data) );
			setTimeout(function(){
				app.hideLoader();
			}, 2000);
		},
		render_dashboard : function(){
			$.getJSON(api_base_url+user+'/dashboard/')
			 .done(function(response){
				/* Send header_title for it renders history_header */
				var data = app.gatherEnvironment(response, "Dashboard");
				var template = Handlebars.templates['dashboard'];
				$('.main').html( template(data) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			})
			  .fail(function(err){
				console.log(JSON.stringify(err));
			});
		},
		render_maker : function(maker_id){
			$.getJSON(api_base_url+user+'/maker/'+maker_id)
			 .done(function(response){
				/* Send header_title for it renders history_header */
				var data = app.gatherEnvironment(response, "Maker profile");

				var template = Handlebars.templates['maker'];
				$('.main').html( template(data) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			})
			  .fail(function(err){
				console.log(err);
			});
		},
		render_taxonomy : function(term_id, tax_name, targetSelector, templateName ){
			$.getJSON(api_base_url+'content/taxonomy/'+tax_name+'/'+term_id)
			 .done(function(response){
			 	console.log(response);
				/* Send header_title for it renders history_header */
				var header_title = (tax_name == 'design-tools') ? 'Made with: '+response.name : response.name;
				var data = app.gatherEnvironment(response, header_title);

				var template = Handlebars.templates[templateName];
				$(targetSelector).html( template(data) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			})
			  .fail(function(err){
				console.log(err);
			});
		},
		render_direct_photo : function(){
			//app.registerTemplate('direct_photo');
			var data = app.gatherEnvironment(null, "Advanced search");
			var template = Handlebars.templates['direct_photo'];

			$('.main').html( template(data) );
			setTimeout(function(){
				app.hideLoader();
			}, 2000);

		},
		render_select_printer : function(ref_id, printer_id){
			/*** Make purchase action ***/
			var response = apiRH.makeRequest(user+'/purchase/'+ref_id, {printer_id: printer_id});
			if(response){
				// $context.addClass('read');
				var data = app.gatherEnvironment(null, "Printing in progress...");

				var template = Handlebars.templates['select_printer'];
				$('.main').html( template(data) );
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
				return;
			}
		},
		locate_printer_here : function(){
			var onSuccess = function(position) {
		        var data = {latitude: position.coords.latitude, longitude: position.coords.longitude}
		        var response = apiRH.makeRequest('user/'+user+"/location/" , data);
				console.log("response"+JSON.stringify(response));
				if(!response.success){
					app.hideLoader();
					app.toast('Sorry, There was an error saving your location');
					return false;
				}
		        app.hideLoader();
		        app.toast("Your current position is now registered as a printer location");
				return;
		    };

		    var onError = function(error) {
		        app.toast("There was a problem while getting your location, please check your GPS settings and try again.");
		    };
		    navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 300000, timeout:10000, enableHighAccuracy : true});
		},

		

		/*
			CAMARA LLAMADO DE LA FUCNION EN EL API SDK
		*/


		get_file_from_device: function(destination, source)
		{
			apiRH.getFileFromDevice(destination, source);		
		},
		showLoader: function(){
			$('#spinner').show();
		},
		hideLoader: function(){
			$('#spinner').hide();
		},
		toast: function(message, bottom){
			try{
				if(!bottom){
					window.plugins.toast.showLongCenter(message);
				}else{
					window.plugins.toast.showLongBottom(message);
				}
			}
			catch(err){
				console.log('Toasting error: ' + JSON.stringify(err)); // imprime esto con un JSON vacio
				alert(message);
			}
			return;
		},

		/** INIT GINGER SERVICES REQUEST **/
		/* ---- TRACKING ACTIVITY USERS ---- */
		/* @param type: [ 'peso', 'animo', 'brazo', 'pierna', 'cintura', 'cadera', 'pecho', 'agua', 'ejercicio', 'recorrido', 'caminar', 'correr', 'pesas', 'cross' ],  //0..9 */

		register_activity: function(type, magnitude, client_id, coach_id){

			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data : {
					'tipo' : type,
					'magnitud' : magnitude,
					'cliente' : client_id,
					'coach' : coach_id
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});
		},  //END REGISTER ACTIVITY

		update_perfil: function(sexo,peso,pesoDeseado,personalidad,objetivo,ejercicio,edad,fechaNaciemiento,codigoPostal,comentarios,nombre,restricciones,estatura){
			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data : {
					'sexo' : sexo,
					'peso' : peso,
					'pesoDeseado' : pesoDeseado,
					'personalidad' : personalidad,
					'objetivo' : objetivo,
					'ejercicio' : ejercicio,
					'edad' : edad,
					'fechaNacimiento' : fechaNaciemiento,
					'cp' : codigoPostal,
					'comentarios' : comentarios,
					'nombre' : nombre,
					'restricciones' : restricciones,
					'estatura' : estatura
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});

		},//END UPDATE PERFIL



		update_platillo: function(plato, fecha, comida, platillo){
			var req = {
				method: 'post',
				url: api_base_url + 'tables/consumo/',	//definitr tabla
				headers:{
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data: {
					'plato': dishID,
					'fecha': fecha,
					'comida': comida,
					'platillo': platillo
				}
			}

			$http(req).success(function(response){
				console.log(response);	
			});
		},


		get_diet: function(dietId)
		{
			var req = {
				method : 'GET',
				url : api_base_url + 'tables/dieta/' + dietId,  //definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}

			$.ajax({
			  type: 'GET',
			  headers: req.headers,
			  url:  req.url,
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				localStorage.setItem('dieta', response);
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});

			//console.log(result);
			return result;
		},//END GET DIET
		
		restaFechas: function(f1,f2)
		{
			var aFecha1 = f1.split('-'); 
			var aFecha2 = f2.split('/'); 
			var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
			var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]); 
			var dif = fFecha2 - fFecha1;
			var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
			return dias;
		}
	};	

/*      _                                       _                        _       
 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
 *                                                                         |___/ 
 */
	jQuery(document).ready(function($) {
		/* 

			Create a new account the old fashioned way 

		*/

		if($('body').hasClass('coperfil') ){

			/* Log Out from the API */
			$('#logout').on('click', function(e){
				/* Requesting logout from server */
				//var response = apiRH.logOut({user_login : user, request_token : apiRH.get_request_token() });
				//if(response.success){

					if($('.overscreen2').is(':visible') ){

					}else{
						$('.overscreen2').addClass('active');
						$('.overscreen2').show();
						$('#container').toggleClass('blurred');
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
				$('#container').toggleClass('blurred');
			});
		}

		//-----------------------------
		//
		// Keyboard events for iOS
		//
		//-----------------------------
		console.log("Initializing events");
		var initialViewHeight = document.documentElement.clientHeight;

		var fixWithKeyboard = function(){

			Keyboard.disableScrollingInShrinkView(false);
			Keyboard.shrinkView(false);
			$(window).resize();
			$(document).resize();
			$('body').addClass("openkeyboard");
			if($('#container').hasClass("chat")){
				console.log("container has chat");
				// $('#container').addClass('conteclado');
				// $('#container').css('height',document.documentElement.clientHeight+"px");
				var calculate = document.documentElement.clientHeight-43;
				console.log(calculate);
				// $('#mensaje-chat').focus();
				// $('#container').scrollTop($('#container').prop("scrollHeight"));
				// $('body').scrollTop(0);
				// $('#messages-list').trigger("click");
				// $('.escribir').css('top',calculate+"px");
			}
		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			console.log('keyboard did show');
			// console.log(e));
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			console.log('keyboard did hide');
			window.openKeyboard = false;
			$('#container').removeClass('conteclado');
			$('body').removeClass("openkeyboard");
			$('#container').css('height', document.documentElement.clientHeight+"px");
			$('.escribir').css('top',"initial");
		});


// ----------------------------------------------------------------------

/*
	LOGIN WITHOUT FACEBOOK
							*/

	if($('#login_form').length)
		$('#login_form').validate({
			rules:{
				mail:{
					required:true,
					email:true
				},
				pass:"required"
			},
			messages:{
				mail:{
					required:"Debes proporcionar un correo",
					email:"Proporciona un correo válido"
				},
				pass:"Este campo es requerido para acceder a tu cuenta"
			},
			submitHandler:function(){
				var data_login	= app.getFormData("#login_form");

				console.log(data_login.mail);

				data_login.pass = $('#pass').val();


				//Login OK

				var responsedata = apiRH.loginNative(data_login);


				console.log(responsedata);
				
				//Dietas OK
				
				//var responsedata = apiRH.getDiets();

				//Usuarios OK

				//var responsedata = apiRH.getUsuarios();

				//Finanzas

				//var responsedata = apiRH.getFinanzas(1);

				//Platillos

				//var responsedata = apiRH.listDishes(1);

				//Ingredientes

				// var responsedata = apiRH.listIngredient();
				
				console.log("> "+ JSON.stringify(responsedata));

				if(responsedata){

					var coachInfo = apiRH.getInfoCoach();

					console.log(coachInfo);

				 	if(coachInfo)
				 		window.location.assign('index.html');
				 	
				 	return;
				}else{
					console.log('Error');
				}
			}
	}); //END VALIDATE


/*TARJETA DE CREDITO*/

	$('#send_fPago').on('click', function(){

		var  t_nombre   = $('input[name="nombre"]').val(); 
		var  t_card 	= $('input[name="card"]').val(); 
		var  t_mes  	= $('input[name="mes"]').val(); 
		var  t_ano 		= $('input[name="year"]').val(); 
		var  t_cvc 		= $('input[name="cvc"]').val(); 
		var  t_mail 	= $('input[name="mail"]').val(); 
		var  t_cupon 	= $('input[name="cupon"]').val(); 
		var  t_terms 	= $('input[name="terms"]').val(); 

		Conekta.setPublishableKey('key_C3MaVjaR7emXdiyRGTcbjFQ');
		
		var errorResponseHandler, successResponseHandler, tokenParams;

		tokenParams = {
		  "card": {
		    "number": t_card,
		    "name": t_nombre,
		    "exp_year": t_ano,
		    "exp_month": t_mes,
		    "cvc": t_cvc
		  }
		};

		successResponseHandler = function(token) 
		{
			var response = apiRH.makePayment(token.id);

			// Funcion de mensaje de bienvenida

			if(response){
				var coachId = localStorage.setItem('coachId');	
				var dietaId = localStorage.setItem('dietaId');
				var json = {
					"coach" : coachId,
					"dieta" : dietaId	
				};
				//Actualizamos Coach y Dieta para el Usuario
				var response = apiRH.updatePerfil(JSON);

				if(response)
					window.location.assign('dieta.html');
				else
					alert("Error al actualizar datos");
			}else{
				alert("Error al procesar tu pago");
			}
			return;
		};

		/* Después de recibir un error */

		errorResponseHandler = function(error) {
		  return console.log(error.message);  //error de conectividad
		  alert('Error al procesar tu pago');
		};

		/* Tokenizar una tarjeta en Conekta */

		Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);


	});//endCLICK

		//MARK NOTIFICATION AS READ
		$('.main').on('tap', '.each_notification a', function(e){
			e.preventDefault();
			var redirect = $(this).attr('href');
			var $context = $(this);
			if($context.hasClass('read')) return false;
			var context_id = $context.data('id');
			
			var response = apiRH.makeRequest(user+'/notifications/read/'+context_id);
			if(response){
				$context.addClass('read');
			}
			//window.location.assign(redirect);
			
		});

		/* Pagination Load more posts */
		$(document).on('tap', '#load_more_posts', function(e){
			e.preventDefault();
			var offset = $(this).data('page');
			app.get_user_timeline(offset);
			e.stopPropagation();
		});

		/* Pagination Load more search results */
		$(document).on('tap', '#load_more_results', function(e){
			e.preventDefault();
			var offset = $(this).data('page');
			var GET = app.getUrlVars();

			app.get_search_results(GET.searchbox, offset);
			e.stopPropagation();
		});


	});

