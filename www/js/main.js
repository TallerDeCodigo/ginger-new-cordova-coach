   /*     _                        _     _           _   
	*    / \   _ __  _ __     ___ | |__ (_) ___  ___| |_ 
	*   / _ \ | '_ \| '_ \   / _ \| '_ \| |/ _ \/ __| __|
	*  / ___ \| |_) | |_) | | (_) | |_) | |  __/ (__| |_ 
	* /_/   \_\ .__/| .__/   \___/|_.__// |\___|\___|\__|
	*         |_|   |_|               |__/               
	*/

	var app = {
		app_context: this,
		initialized: false,
			// Application Constructor
		initialize: function() {

			this.bindEvents();
			window.firstTime = true;
			app.initialized = true;
			/* Initialize API request handler */
			window.apiRH = new requestHandlerAPI().construct(app);
			this.registerHelpers();
			
			var is_login 	= apiRH.has_token();
			var is_home 	= (typeof(window.is_home) != 'undefined') ? window.is_home : true;
			var is_client 	= localStorage.getItem('customerId');
			var is_current 	= localStorage.getItem('valido');

			window.cordova_full_path = "";
			window.is_home 			 = false;

			/*** TODO: Get this shit into a catalogue ***/
			window.catalogues 						= [];
			window.catalogues.months 				= [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
			window.catalogues.coach_type 			= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
			window.catalogues.restricciones 		= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
			window.catalogues.objetivo 				= [ 'adelgazar','detox','bienestar','rendimiento' ];
			window.catalogues.sex 					= [ 'Hombre', 'Mujer'];
			window.catalogues.tipo_de_ingredientes 	= [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];

			window.loggedIn = false;
			this.keeper 	= window.localStorage;
	
			/* Check if has a valid token */
			if(is_login){
				
				console.log('You okay, now you can start making calls');
				loggedIn = true;
				var userinfo 	= JSON.parse(localStorage.getItem('user'));
					window._coach = (userinfo) ? userinfo : '';
				/* Take the user to it's timeline */
				if(is_home)
					return app.render_home();
				return;
			}else{
				return app.render_login();
			}

		},
		initPushNotifications: function() {
			console.log("Initilizing push notifications service");
			var notificationOpenedCallback = function(jsonData) {
				console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
			};

			window.plugins.OneSignal
									.startInit("d4e8ad62-1f9d-45f8-8905-3d152b7c1b7d")
									.handleNotificationOpened(notificationOpenedCallback)
									.endInit();
		},
		registerCompiledPartials: function() {
			console.log("Register pre compiled partials");
			/* Add files to be loaded here */
			var filenames = ['header', 'loader'];
			
			filenames.forEach(function (filename) {
				Handlebars.registerPartial(filename, Handlebars.templates[filename]);
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
			Handlebars.registerHelper('json', function(context) {
				return JSON.stringify(context);
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
									 ? cordova.file.applicationDirectory+"www/"
									 : '';

			/*   ___    _         _   _     
			*  / _ \  / \  _   _| |_| |__  
			* | | | |/ _ \| | | | __| '_ \ 
			* | |_| / ___ \ |_| | |_| | | |
			*  \___/_/   \_\__,_|\__|_| |_|
			*/                              

			try{
				OAuth.initialize('7-ipR3QS-__wrorRTpdedM8-_v8');
				console.log("Initialized Oauth");
			}
			catch(err){
				app.toast("Oauth error ocurred");
				console.log('OAuth initialize error: ' + err);
			}

			try{
				app.initPushNotifications();
				// apiRH.postNotification("", "Just kidding", "lol again", "Final long and winding lorem ipsum");
			}
			catch(err){
				app.toast("Push notifications error: "+JSON.stringify(err));
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
		// Method runs everytime sdk checks for a container loaded, basically every render of a view
		onSoftInit: function() {

			/*** Initializing chat api if not already did ***/
			if(!chatCore.isInitialized && loggedIn)
				setTimeout(function(){
					chatCore.init(_coach);
				}, 800);
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
			var meInfo 	= this.keeper.getItem('user');
			var parsed 	= {me: JSON.parse(meInfo)};
			
			if(optional_data){
				parsed['data'] = optional_data;
				//return parsed;
			}
			if(history_title)
				parsed['header_title'] = history_title;
			if( typeof(cordova_full_path) != 'undefined' && cordova_full_path != '' )
				parsed['cordova_full_path'] = cordova_full_path;
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
				var container_template = Handlebars.templates.container;
				var html = container_template();
				$('.rootContainer').html( html );
			}
			/*** Soft init method ***/
			this.onSoftInit();
		},
		render_template : function(templateName, targetSelector, otherdata, keepLoader, append, leNiceTransition){
			keepLoader = (typeof keepLoader == 'undefined' || !keepLoader) ? false : true;
			append = (typeof append == 'undefined' || !append) ? false : true;
			leNiceTransition = (typeof leNiceTransition == 'undefined') ? true : leNiceTransition;
			window.is_home = false;
			var template = Handlebars.templates[templateName];
			if(!template){
				console.log("Template doesn't exist");
				return false;
			}
			var data = this.gatherEnvironment(otherdata);
			data.is_scrollable = false;
			if(!append)
				$(targetSelector).html('');
			if(!leNiceTransition){

				$(targetSelector).append( template(data) ).css({ "opacity": 0, "display": "block"})
														 .animate(	{
															opacity: 1
														}, 640);
			}else{

				$(targetSelector).append( template(data) ).css("opacity", 1)
														 .css("display", "block")
														 .css("margin-left", "12px")
														 .animate(	{
																		'margin-left': "0",
																		opacity: 1
																	}, 320);
			}
			if(!keepLoader)
				setTimeout(function(){
					app.hideLoader();
				}, 420);
		},
		render_login : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('login', data, '.view', url, 'login');
		},
		render_home : function(url){

			window.is_home = true;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment();
			data.is_scrollable = false;
			return this.switchView('home', data, '.view', url, 'home-menu', false, false);
		},
		render_user_list : function(url){
			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Usuarios' );
			return this.switchView('user-list', data, '.view', url, 'list-usuarios', true);
		},
		render_chat_container : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data 	= this.gatherEnvironment([], 'Chat');
			return this.switchView('chat-container', data, '.view', url, 'chat-container', true);
		},
		render_chat_dialog : function(url, dialogId){

			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);			
			app.check_or_renderContainer();
			var data = this.gatherEnvironment([], 'Chat');
			window.dialogNow 	= (dialogId) ? dialogId : null;
			return this.switchView('chat-messages', data, '.view', url, 'chat-container dialog_detail chat-dialog-messages');
		},
		render_finances_view : function(url){

			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			var responsedata 	= [];
			var todayObj 		= new Date();
			var month 			= todayObj.getMonth();
			window.is_home 		= false;
			responsedata.total_amount 	= 0;
			responsedata.total_days 	= 0;
			responsedata.this_month 	= catalogues.months[month];
			responsedata.this_day 		= todayObj.getDate();
			
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( responsedata, "Finanzas");
			return this.switchView( 'finanzas', data, '.view', url, 'finanzas', true );
		},
		render_coach_dietas : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment([], 'Dietas');
			var change_of_plan = app.keeper.getItem('change_of_plan');
			data.controls = (change_of_plan && change_of_plan != '') ? false : true;
			return this.switchView('diet-list', data, '.view', url, 'diet-list', true);
		},
		render_create_diet : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Crear nueva dieta');
			return this.switchView('create-diet', data, '.view', url, 'create-new-diet');
		},
		render_duplicate_diet : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();

			var data = this.gatherEnvironment( [], 'Duplicar dieta');
			return this.switchView('copy-diet', data, '.view', url, 'copy-diet');
		},
		render_diet_workspace : function(url, operation){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var section_name = '';
			switch(operation){
				case 'create':
				section_name = 'Crear Dieta';
				break;
				case 'edit':
				section_name = 'Editar Dieta';
				break;
				case 'view-only':
				section_name = 'Ver Dieta';
				break;
				default:
				break;
			};
			var data = this.gatherEnvironment( [], section_name);
			data.view_only = (operation == 'view-only') ? true: false;
			return this.switchView('diet-edition', data, '.view', url, 'workspace-diet dieta '+operation);
		},
		render_dish_list : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Lista de Platillos');
			return this.switchView('dish-list', data, '.view', url, 'dish-list');
		},
		render_create_dish : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Crear Platillo');
			return this.switchView('create-dish', data, '.view', url, 'create-dish');
		},
		render_ingredients : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Ingredientes');
			return this.switchView('ingredients', data, '.view', url, 'ingredients');
		},
		render_create_ingredient : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Crear Ingrediente');
			return this.switchView('create-ingredient', data, '.view', url, 'create-ingredient');
		},
		render_myProfile : function(url){

			var extra_data = [];
			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var extra_data 	= apiRH.fetchCoachProfile();	
			var data 		= this.gatherEnvironment(extra_data, 'Mi Perfil');
			return this.switchView('coach', data, '.view', url, 'coach-profile');
		},
		render_clientProfile : function( url ){
			
			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 220);
			var user_sel =  app.keeper.getItem('carry-user') 
			if(	!user_sel || user_sel == '' ){
				app.toast("No user selected");
				return this.render_user_list('lista-usuarios.html');
			}
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Cargando perfil...' );
			return this.switchView( 'empty-card', data, '.view', url, 'client-profile', true );
		},
		render_about : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Acerca de' );
			return this.switchView( 'about', data, '.view', url, 'about' );
		},
		render_support : function(url){

			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( [], 'Soporte' );
			return this.switchView( 'support', data, '.view', url, 'support' );
		},
		render_comingSoon : function(url){

			var extra_data = [];
			window.is_home = false;
			if(!app.initialized) app.initialize();
			setTimeout(function(){
				app.showLoader();
			}, 420);
			app.check_or_renderContainer();
			var data = this.gatherEnvironment( extra_data, 'Próximamente' );
			return this.switchView( 'coming-soon', data, '.view', url, 'coming-soon' );
		},
		get_file_from_device: function(destination, source){
			apiRH.getFileFromDevice(destination, source);		
		},
		showLoader: function(){
			$('#spinner').show();
		},
		hideLoader: function(){
			$('#spinner').hide();
		},
		// Cache Slot methods
		push_cache_slot: function(slot_name, value){
			
			var local_tmp = app.keeper.getItem('temp-return');
			var new_push  = {};
				new_push[slot_name] =  {
											'name' 	: slot_name,
											'stamp' : new Date().getTime(),
											'data' 	: value
										};
				
			local_tmp = (local_tmp && local_tmp != '') 
									? $.extend( JSON.parse( local_tmp ), new_push )
									: new_push;

			app.keeper.setItem('temp-return', JSON.stringify(local_tmp));
			return;
		},
		pop_cache_slot: function(slot_name){

			var local_tmp = app.keeper.getItem('temp-return');
			local_tmp = (local_tmp && local_tmp != '') ? JSON.parse( local_tmp ) : null;
			if( local_tmp && typeof local_tmp[slot_name] !== 'undefined' )
				return local_tmp[slot_name];
			return false;
		},
		clean_cache_slot: function(slot_name){
			var local_tmp = app.keeper.getItem('temp-return');
			local_tmp = (local_tmp && local_tmp != '') ? JSON.parse( local_tmp ) : null;
				
			if(typeof local_tmp[slot_name])
				delete local_tmp[slot_name];
			return false;
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
				console.log('Toasting error: ' + JSON.stringify(err));
				alert(message);
			}
			return;
		},
		switchView: function(newTemplate, data, targetSelector, recordUrl, targetClass, keepLoader, leNiceTransition){
			/* Push to history if url is supplied */
			if(recordUrl) window.history.pushState(newTemplate, newTemplate, '/'+recordUrl);
			
			leNiceTransition = (typeof(leNiceTransition) != 'undefined') ? leNiceTransition : true;
			var template = Handlebars.templates[newTemplate];
			if(!template){
				console.log("Template doesn't exist");
				return false;
			}
			$(targetSelector).fadeOut(360, function(){

				if(targetClass) $(targetSelector).attr('class','view').addClass(targetClass);

				if(!leNiceTransition){

					$(targetSelector).html( template(data) ).css({ "opacity": 0, "display": "block"})
															 .animate(	{
																opacity: 1
															}, 640);
				}else{

					$(targetSelector).html( template(data) ).css("opacity", 1)
															 .css("display", "block")
															 .css("margin-left", "20px")
															 .animate(	{
																			'margin-left': "0",
																			opacity: 1
																		}, 640);
				}
				
			});

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
		register_activity: function( type, magnitude, client_id, coach_id ){

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
		restaFechas: function(f1,f2){
			var aFecha1 = f1.split('-'); 
			var aFecha2 = f2.split('/'); 
			var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
			var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]); 
			var dif = fFecha2 - fFecha1;
			var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
			return dias;
		},
		renderFinancesContent: function(month){
			console.log(month);
			setTimeout(function(){
				app.showLoader();
			}, 420);
			console.log("Rendering finances content");
			var responsedata = [];
			responsedata.total_amount 	= 0;
			responsedata.total_days 	= 0;
			window.is_home 	= false;
			// var todayObj 	= new Date();
			// var month 		= todayObj.getMonth();
			responsedata.clients 		= apiRH.getFinanzas( month );
			responsedata.this_month 	= window.catalogues.months[month];
			// responsedata.this_day 		= todayObj.getDate();
			responsedata.clients.forEach(function(client){
				responsedata.total_amount 	+= Math.round(client.amount_this_month * 100) / 100;
				responsedata.total_days 	+= client.days_this_month;
				client.amount_this_month 	 = Math.round(client.amount_this_month * 100) / 100;
			});
			responsedata.total_amount = Math.round(responsedata.total_amount * 100) / 100;
			console.log(responsedata);
			return this.render_template('finanzas-content', '.insert-content', responsedata);
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

		
// ----------------------------------------------------------------------


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

