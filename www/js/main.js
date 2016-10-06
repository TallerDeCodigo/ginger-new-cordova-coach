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

			this.bindEvents();
			window.firstTime = true;

			/* Initialize API request handler */
			window.apiRH = new requestHandlerAPI().construct(app);
			//console.log('token');
			
			var is_login 	= apiRH.has_token();
			var is_client 	= localStorage.getItem('customerId');
			var is_current 	= localStorage.getItem('valido');

			window.cordova_full_path = "";

			/* IMPORTANT to set requests to be syncronous */
			/* TODO test all requests without the following code 'cause of deprecation */
			$.ajaxSetup({
				 async: false
			});

			/*** TODO: Get this shit into a catalogue ***/
			window.catalogues 						= [];
			window.catalogues.coach_type 			= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
			window.catalogues.restricciones 		= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
			window.catalogues.objetivo 				= [ 'adelgazar','detox','bienestar','rendimiento' ];
			window.catalogues.sex 					= [ 'Hombre', 'Mujer'];
			window.catalogues.tipo_de_ingredientes 	= [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];

			window.loggedIn = false;
			this.ls 		= window.localStorage;
	
			/* Check if has a valid token */

			if(is_login){
				
				console.log('You okay, now you can start making calls');
				loggedIn = true;
				var userinfo 	= JSON.parse(localStorage.getItem('user'));
					window._coach = (userinfo) ? userinfo : '';
				/* Take the user to it's timeline */
				var is_home = window.is_home;
				
				if(is_home){
					return;
				}else{
					if(!is_home){
						return;
					}else{
						window.location.assign('index.html?filter_feed=all');
					}	
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
				url : cordova_full_path+'views/' + name + '.hbs',
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
			window.cordova_full_path = (typeof(cordova) != 'undefined') 
									 ? cordova.file.applicationDirectory
									 : '';

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
			var meInfo 	= apiRH.ls.getItem('user');
			// var logged 	= apiRH.ls.getItem('me.logged');
			var parsed 	= {me: JSON.parse(meInfo)};
			
			if(optional_data){
				parsed['data'] = optional_data;
				//return parsed;
			}
			if(history_title)
				parsed['header_title'] = history_title;
			if(typeof(cordova_full_path) != 'undefined' && cordova_full_path != '')
				parsed['cordova_full_path'] = cordova_full_path+"www/";
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
		check_or_renderContainer : function(){
			/*** First time loading home ***/
			if(window.firstTime){
				console.log("Rendering first time");
				app.registerTemplate('container');
				var container_template = Handlebars.templates['container'];
				var html 	 = container_template();
				$('.rootContainer').html( html );
			}
		},
		render_home : function(url){
			app.showLoader();
			app.check_or_renderContainer();
			console.log("Rendering home");
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('home', data, '.view', url, 'home-menu');
		},
		render_user_list : function(url){
			var responsedata = [];
			app.check_or_renderContainer();
			console.log("Rendering user list");
			setTimeout(function(){
				app.showLoader();
			}, 1200);
				responsedata.users = apiRH.getUsuarios();
			// chatCore.fetchDialogList();
			var data = this.gatherEnvironment(responsedata, 'Usuarios');
			return this.switchView('user-list', data, '.view', url, 'list-usuarios');
		},
		render_chat : function(url){
			var responsedata = [];
			setTimeout(function(){
				app.showLoader();
			}, 800);
			app.check_or_renderContainer();
			console.log("Rendering chat list");			
			var data = this.gatherEnvironment(responsedata, 'Chat');
			return this.switchView('chat-contacts', data, '.view', url, 'has-chat-list', true);
		},
		render_finanzas : function(url){
			var responsedata = [];
			setTimeout(function(){
				app.showLoader();
			}, 800);			
			app.check_or_renderContainer();
			console.log("Rendering finanzas module");			
			var data = this.gatherEnvironment(responsedata, 'Finanzas');
			return this.switchView('finanzas', data, '.view', url, 'finanzas');
		},
		render_coach_dietas : function(url){
			var responsedata = [];
			setTimeout(function(){
				app.showLoader();
			}, 800);
			app.check_or_renderContainer();
			console.log("Rendering Coach dietas");
				responsedata = apiRH.getDiets();
			var data = this.gatherEnvironment(responsedata, 'Dietas');
			return this.switchView('diet-list', data, '.view', url, 'diet-list');
		},
		render_create_diet : function(url){
			var responsedata = [];
			setTimeout(function(){
				app.showLoader();
			}, 800);
			app.check_or_renderContainer();
			console.log("Rendering Create new diet");
				// responsedata = apiRH.getDiets();
			var data = this.gatherEnvironment(responsedata, 'Dietas');
			console.log(data);
			return this.switchView('create-diet', data, '.view', url, 'create-new-diet');
		},
		render_myProfile : function(url){
			var extra_data = [];
			setTimeout(function(){
				app.showLoader();
			}, 800);
			app.check_or_renderContainer();
			console.log("Rendering Coach Profile");
			var extra_data =  fetchCoachProfileInfo();	
			var data = this.gatherEnvironment(extra_data, 'Mi Perfil');
			console.log(data);
			return this.switchView('coach', data, '.view', url, 'coach-profile');
		},
		get_file_from_device: function(destination, source){
			apiRH.getFileFromDevice(destination, source);		
		},
		showLoader: function(){
			// console.log("Showing loader");
			$('#spinner').show();
		},
		hideLoader: function(){
			// console.log("Hiding loader");
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
		switchView: function(newTemplate, data, targetSelector, recordUrl, targetClass, keepLoader){
			/* Push to history if url is supplied */
			if(recordUrl) window.history.pushState(newTemplate, newTemplate, '/'+recordUrl);
			
			var template = Handlebars.templates[newTemplate];
			if(!template){
				console.log("Template doesn't exist");
				return false;
			}
			$(targetSelector).fadeOut('fast', function(){

				if(targetClass) $(targetSelector).attr('class','view').addClass(targetClass);
				$(targetSelector).html( template(data) ).css("opacity", 1)
												 .css("display", "block")
												 .css("margin-left", "20px")
												 .animate(	{
																'margin-left': "0",
																opacity: 1
															}, 240);
			});
			console.log("KeepLoader :: "+keepLoader);
			if(!keepLoader)
				return setTimeout(function(){
					if(window.firstTime)
						window.firstTime = false;				
					app.hideLoader();
					initializeEvents();
				}, 2000);
				
			return setTimeout(function(){
					if(window.firstTime)
						window.firstTime = false;				
					initializeEvents();
				}, 2000);
		},
		register_activity: function(type, magnitude, client_id, coach_id){

			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',
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

		window.number_format = function(amount, decimals) {

		    amount += ''; // por si pasan un numero en vez de un string
		    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

		    decimals = decimals || 0; // por si la variable no fue fue pasada

		    // si no es un numero o es igual a cero retorno el mismo cero
		    if (isNaN(amount) || amount === 0) 
		        return parseFloat(0).toFixed(decimals);

		    // si es mayor o menor que cero retorno el valor formateado como numero
		    amount = '' + amount.toFixed(decimals);

		    var amount_parts = amount.split('.'),
		        regexp = /(\d+)(\d{3})/;

		    while (regexp.test(amount_parts[0]))
		        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

		    return amount_parts.join('.');
		}
		/* 

			Create a new account the old fashioned way 

		*/

		
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
					app.toast("Ocurrió un error, por favor revisa tus datos.")
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

