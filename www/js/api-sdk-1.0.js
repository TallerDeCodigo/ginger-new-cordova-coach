/* 
 * Prototype: requestHandlerAPI 
 * @params token (optional if not executing auth requests) Locally saved user token
 *
 */
function requestHandlerAPI(){
	/*** Attributes ***/
	this.token = null;
	this.upload_ready = false;
	this.version = "1.3";
	this.app_build = "1.3.2";
	this.device_model = (typeof device != 'undefined') ? device.model : 'not set';
	this.device_platform = (typeof device != 'undefined') ? device.platform : 'not set';
	this.device_platform_version = (typeof device != 'undefined') ? device.version : 'not set';
	this.device_info =  {
							sdk_version: this.version,
							build: this.app_build,
							model: this.device_model,
							platform: this.device_platform,
							version: this.device_platform_version
						};

	this.keeper = window.localStorage;

	/*** Request headers ***/
	this.headers = 	{
						'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
						'X-ZUMO-AUTH'		: this.keeper.getItem('token'),
						'Content-Type'		: 'application/json'
					};

	var context = this;

	/*  Production API URL  */
	window.api_base_url = "https://gingerservice.azure-mobile.net/";
	// var app = window.app;

	window.sdk_app_context = null;

	/* Constructor */
	this.construct = function(app_context){
					//console.log('Initialized ginger api-sdk1.0');
					if(this.keeper.getItem('request_token')) this.token = this.keeper.getItem('request_token');
					sdk_app_context = app_context;
					/* For chaining purposes ::) */
					return this;
				};

	
/***********************/
/*** API sdk Methods ***/
/***********************/

		/* 
		 * Manage pseudo Log in process to use protected API calls
		 * @param data_login JSON {user_login, user_password}
		 * @return status Bool true is successfully logged in; false if an error ocurred
		 */
		this.loginNative =  function(data_login){

			var req = 	{
							data : {
									"tipo" 		: "coach",
									"mail" 		: data_login.mail,
									"password" 	: data_login.pass
								}
						};	
			var response = this.makeRequest('api/login', req, true, false);

			if(response.Status == 'FAIL')
				return false;

			/* Save userInfo in apiRH.keeper */
			apiRH.keeper.setItem('token', response.token);
			apiRH.keeper.setItem('mail', response.mail);
			apiRH.keeper.setItem('userId', response.userId);

			this.token = response.token;

			var userId 	= apiRH.keeper.getItem('userId');
			var mail 	= apiRH.keeper.getItem('mail');
			var token 	= apiRH.keeper.getItem('token');

			if(!token)
				return false;

			return this.token;
		};

		/**
		 * Función para obtener las dietas de un coach que este logeado
		 *
		 */
		this.getDiets = function(){

			var response = this.getRequest('tables/dieta?min=true&coach=' + apiRH.keeper.getItem('userId'), null);
			// TODO: Check this out
			setTimeout(function(){
				sdk_app_context.hideLoader();
			}, 2000);
			return (response) ? response : false;

		};



		/**
		 *
		 * Update Diet
		 *
		 */
		this.updateDiet = function (data){
			
			var response = this.patchRequest('tables/dieta/', data);
			console.log(response);
			return (response) ? response : false;
		};

		/**
		 * DELETE Diet handler
		 * @param diet_id
		 * @return Boolean _deleted
		 */
		this.deleteDiet = function(diet_id){
			
			var response = this.deleteRequest('tables/dieta/' + diet_id);
			return (response.success) ? true : false;
		};



		/**
		 * DELETE DISH
		 * */
		this.deleteDish = function(diet_id){

			var response = this.deleteRequest('tables/dieta/' + diet_id);
			console.log(response);
			return (response) ? response : false;
		};


		/**
		 * CLONE DIET
		 */
		 this.cloneDiet = function(data){
			var params = 	{
								data: data
							};

			var response = this.makeRequest('api/duplicate', params);
			return (response) ? response : false;
		};


		/**
		 * Create new diet from structure
		 * @param Object data
		 * @return Boolean
		 */
		this.createDiet = function(data){

			var response = this.makeRequest('api/duplicate', data);
			console.log(response);
			return (response) ? response : false;
		};

		this.makeDiet = function(data){

			var response = this.makeRequest('tables/dieta/', data);
			console.log(response);
			return (response) ? response : false;
		};

		/**
		 * Save updates to a diet via patch method
		 * @param Object data
		 * @return Boolean
		 */
		this.saveDiet = function(dietObj){
			console.log(dietObj);
			console.log(dietObj.__v);
			delete dietObj.__v;

			var response = this.patchRequest('tables/dieta/' + dietObj._id, dietObj, false);
			console.log('Response: ' + JSON.stringify(response));
			return (response) ? true : false;
		};

		/**
		 * Fetch Platillos
		 * @param Boolean is_public
		 * @return Object / false otherwise
		 */
		this.listDishes = function( is_public ){

			var response = this.getRequest('tables/plato?coach=' + app.keeper.getItem('userId') + '&publico=' + is_public , null);
			// console.log("Request Data Dishes"+ JSON.stringify(response));
			return (response) ? response : false;
		};


		/**
		 *
		 * new dish
		 *
		 **/
		this.newDish = function(data){
			var req = {
				method : 'post',
				url : api_base_url + 'tables/plato',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': apiRH.keeper.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}
			console.log(req);

			var response = this.makeRequest('tables/plato', req);

			console.log("Request Data Cliente");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		/**
		 * Ingredientes
		 */
		 this.listIngredient = function(){
			var response = this.getRequest('tables/ingrediente?epp=999' , null);
			console.log("Request Data Ingredients"+JSON.stringify(response));
			return (response) ? response : false;
		 };

		/**
		 *
		 * SAVE INGREDIENTS
		 *
		 */
		 this.newIngredient = function(data){
			var req = {
				method : 'post',
				url : api_base_url + 'tables/ingrediente',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': apiRH.keeper.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}
			var response = this.makeRequest('tables/ingrediente', req);
			console.log('RESPONSE INGREDIENTS :::: ' + response);  //llega aqui con la respuesta del servidor
			return (response) ? response : false;
		 };


		/** Fetch Coach clients **/
		this.getUsuarios = function(){
			var response = this.getRequest('api/client_status?coachid=' + apiRH.keeper.getItem('userId'), null);
			return (response) ? response : false;
		};


		/**
		 * Update Client Diet
		 * @param String client_id
		 * @param Object data
		 * @return JSON Object
		 */
		this.updateClientDiet = function (client_id, data){

			var response = this.patchRequest( 'tables/cliente/'+client_id, data);
			console.log('Response Update Client Diet: ' + JSON.stringify(response));
			return (response) ? true : false;
		};

		/**
		 * Fetch finances from api
		 * @param Integer month
		 * @return JSON Object
		 */
		this.getFinanzas = function(mes){
			
			var response = this.getRequest('api/history/?coach=' + apiRH.keeper.getItem('userId') + '&mes=' + mes, null);
			return (response) ? response : false;
		};

		/**
		 * Fetch coach information
		 * @return JSON Object
		 */
		this.getInfoCoach = function(){
			
			var response = this.getRequest('tables/coach?_id=' + apiRH.keeper.getItem('userId'), null);
			this.save_user_data_clientside(JSON.stringify(response));
			return (response) ? true : false;
		};

		this.updatePerfil = function(data){
			var req = {
				method : 'PATCH',
				url : api_base_url + 'tables/cliente/' + apiRH.keeper.getItem('userId') ,
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': apiRH.keeper.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}


			console.log(JSON.stringify(req));

			var response = this.patchRequest('tables/cliente/' + apiRH.keeper.getItem('userId'), req);

			console.log("Request Path Data Cliente");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};




	
		//Conekta
		this.makePayment = function(token)
		{
			var req = {
				method : 'POST',
				url : api_base_url + 'api/history/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': apiRH.keeper.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : {
					'cliente' : apiRH.keeper.getItem('userId'),
					'card_token' : token
				}
			}
			console.log(req);

			var response = this.makeRequest('api/history', req);

			console.log("Request Data Cliente");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response.statusText == "OK") ? true : false;

		};

		/*
		 * registerUpTake Registrer event from diet of user
		 * @param data {}
		 * @return response
		 */	
		this.registerUpTake = function(data){
			var req = {
				method : 'post',
				url : api_base_url + 'tables/medicion/',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': this.token,
					'Content-Type': 'application/json'
				},
				data : {
					
				}
			}

			var response = this.makeRequest('tables/consumos', req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.updateUserSetting = function(data){
			var req = {
				method : 'patch',
				url : api_base_url + 'tables/cliente/' + data._id,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': this.token,
					'Content-Type': 'application/json'
				},
				data : {
					
				}
			}

			var response = this.makeRequest('tables/cliente/' + data._id, req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};


		// GET PAYMENTS FOR USER
		
		this.getPaymentAccount = function(data){
			var req = {
				method : 'patch',
				url : api_base_url + 'api/history/' + data._id,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': this.token,
					'Content-Type': 'application/json'
				},
				data : {
					
				}
			}

			var response = this.makeRequest('api/history/' + data._id, req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.getUserId = function(){

			var users = JSON.parse(apiRH.keeper.getItem('user-selected'));
			var response = this.getRequest('tables/cliente?_id=' + users._id, req);
			console.log("Response Data Clientes ::: "+response);
			return (response) ? response : false;
		};

		/* 
		 * Save user data client side to execute auth requests to the API
		 * @return null
		 * @see this.create_internal_user
		 */
		this.save_user_data_clientside = function(data){

			apiRH.keeper.setItem('user', data);
		};
		/* 
		 * Request new passive token from the API 
		 * @return new generated token
		 */
		this.request_token = function(){
								var response_data = this.getRequest('api/', null);
								/* Verify we got a nice token */
								if( response_data.success !== false){
									this.token = response_data.data.request_token;
									this.keeper.setItem('request_token', response_data.data.request_token);
									return this;
								}
								return this;
							};

		/* 
		 * Set token user
		 * @return the token
		 */
		this.set_user_token = function(){
								
							};
		/* 
		 * Wrapper for the getRequest, makeRequest methods 
		 * @param type Request type (POST, GET, PUT, DELETE)
		 * @param endpoint String The API endpoint (See Documentation)
		 * @param data JSON Data to pass to the endpoint in a JSON format
		 * @return stored token, false if no token is stored
		 * TO DO: Manage put, delete methods
		 */
		this.execute = function(type, endpoint, data){
						if(type === 'POST') return this.makeRequest(endpoint, data);
						if(type === 'GET')  return this.getRequest(endpoint, data);
						if(type === 'PUT')  return this.putRequest(endpoint, data);
					};
		/* 
		 * Check if the Request object has a token
		 * @return stored token, false if no token is stored
		 * @see apiRH.keeper
		 */
		this.has_token = function(){
							return (typeof this.token != 'undefined' || this.token !== '') ? apiRH.keeper.getItem('token') : false;
						};
		/* 
		 * Check if the Request object has a valid token
		 * @return stored token, false if no token is stored
		 */
		this.has_valid_token = function(){
							if(this.token !== undefined || this.token !== ''){

								console.log("Looks like you already have a token, let's check if it is valid");
								var dedalo_log_info = (typeof this.keeper.getItem('dedalo_log_info') != undefined) ? JSON.parse(this.keeper.getItem('dedalo_log_info')) : null;
								if(!dedalo_log_info) return false;

									var user 		= dedalo_log_info.user_id;
									var data_object =   {
															user_id : user, 
															request_token : apiRH.get_request_token(),
															device_info: this.device_info
														};
									var response 	= this.makeRequest('auth/user/checkToken/', data_object);
									var var_return 	= (response.success) ? true : false;
							}
							return var_return;
						};
		/* 
		 * Request token getter
		 * @return stored token, null if no token is stored
		 */
		this.get_request_token = function(){
									return this.token;
								};
		/* 
		 * Executes a POST call
		 * @param endpoint API endpoint to make the call to
		 * @param data url encoded data
		 * @return JSON encoded response
		 */
		this.makeRequest = function(endpoint, data, noHeaders, stringify){
			
			var myData = ( typeof(stringify) == 'undefined' || stringify == true ) ? JSON.stringify(data.data) : data.data;
			setTimeout(function(){
				app.showLoader();
			}, 420);
			var result = {};

			var options = 	{
								type 		: 'POST',
								url			: window.api_base_url + endpoint,
								data 		: myData,
								dataType 	: 'json',
								async 		: false
							};
			console.log(options);
			var myHeaders = (!noHeaders || typeof(noHeaders) == 'undefined') ? apiRH.headers : {'X-ZUMO-APPLICATION': apiRH.headers['X-ZUMO-APPLICATION']};
			if(myHeaders)
				options.headers = myHeaders;

			$.ajax(options)
			 .always( function(response){
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			 })
			 .done( function(response){
			 	console.log(response);
				result = response;
			 })
			 .fail( function(e){
				console.log(e);
				return false;
			});
			return result;
		};

		/* 
		 * Executes a PATCH request
		 * @param endpoint API endpoint to make the call to
		 * @param data url encoded data
		 * @param stringify
		 * @return JSON encoded response
		 * @see CORS
		 */
		this.patchRequest = function(endpoint, data, stringify){
			
			var result = {};
			console.log("------------- PATCH  ------------");

			var options = 	{
								type 		: 'PATCH',
								headers		: apiRH.headers,
								url			: window.api_base_url + endpoint,
								data 		: JSON.stringify(data),
								dataType 	: 'json',
								async 		: false
							};
			console.log(options);

			$.ajax(options)
			 .always(function(){
				setTimeout(function(){
					app.hideLoader();
				}, 2000);
			})
			 .done(function(response){
				result = response;
				console.log(result);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});
			return result;
		};

		/* 
		 * Executes a DELETE request
		 * @param endpoint API endpoint to make the call to
		 * @param data url encoded data
		 * @param stringify
		 * @return JSON encoded response
		 * @see CORS
		 */
		this.deleteRequest = function(endpoint, data, stringify){
			
			setTimeout(function(){
				app.showLoader();
			}, 0);
			var myData = ( typeof(stringify) == 'undefined' || stringify == true ) ? JSON.stringify(data) : data;
			var result = {};

			var options = 	{
								type 		: 'DELETE',
								headers		: apiRH.headers,
								url			: window.api_base_url + endpoint,
								// data 		: myData,
								dataType 	: 'json',
								async 		: false
							};
			console.log(options);

			$.ajax(options)
			 .always(function(){
				setTimeout(function(){
					app.hideLoader();
				}, 0);
			})
			 .done(function(response){
				result = response;
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
				if(e.statusText == 'Conflict')
					return app.toast("Oops, parece que el elemento no existe");
				return app.toast("Error al eliminar");
			});
			return result;

		};

		
		this.makeCopyDietReques = function(endpoint, data){
			console.log(data.data); //llega a makerequest

			sdk_app_context.showLoader();
			var result = {};

			console.log('datos' + data.data);

			$.ajax({
			  type: 'POST',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			})
			 .done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});
			return result;
		};


		/* 
		 * Executes a GET call
		 * @param endpoint API endpoint to make the call to
		 * @param data JSON encoded data 
		 * *****(SEND data = NULL for closed endpoints)*****
		 * @return JSON encoded response
		 * @see API documentation about jsonp encoding
		 */
		this.getRequest = function(endpoint, data){

			sdk_app_context.showLoader();
			var myData = (!data) ? "" : JSON.stringify(data);
			var result = {};
		
			$.ajax({
				type: 'GET',
				headers: apiRH.headers,
				url: window.api_base_url + endpoint,
				data: myData,
				dataType: 'json',
				async: false
			})
			 .done(function(response){
				result = response;
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));
			});
			return result;
		};

		/* 
		 * Executes a PUT call
		 * @param endpoint API endpoint to make the call to
		 * @param data JSON encoded data 
		 * *****(SEND data = NULL for closed endpoints)*****
		 * @return JSON success
		 * @see API documentation
		 */
		this.putRequest = function(endpoint, data){
							
							sdk_app_context.showLoader();
							var result = {};
							/* ContentType is important to parse the data server side since PUT doesn't handle multipart form data */
							$.ajax({
								type: 	'PUT',
								data: 	$.param(data),
								contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
								url: 	window.api_base_url+endpoint,
							})
							 .done(function(response){
								result = response;
								sdk_app_context.hideLoader();
							 })
							 .fail(function(e){
								result = false;
								console.log(e);
							 });
							 return result;
						};

		/**
		 * Executes a PATCH update
		 * @param endpoint API endpoint to make the call to
		 * @param data JSON encoded data 
		 * *****(SEND data = NULL for closed endpoints)*****
		 * @return JSON success or JSON encoded data
		 * @see API documentation
		 * @todo Actually make the request via PATCH method
		 */
		// this.patchRequest = function(endpoint, data){
		// 					sdk_app_context.showLoader();
		// 					var userInfo = {};

		// 					var xhr = new XMLHttpRequest();
		// 					xhr.open('POST', window.api_base_url+endpoint);
		// 					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		// 					xhr.onload = function() {
		// 						console.log(xhr.status);
		// 						if (xhr.status === 200) {
		// 							var userInfo = JSON.parse(xhr.responseText);
		// 							console.log(userInfo);
		// 							sdk_app_context.hideLoader();
		// 						}
		// 					};
		// 					xhr.send(data);
		// 					/* ContentType is important to parse the data server side since PUT doesn't handle multipart form data */
		// 					 return userInfo;
		// 				};
		/* 
		 * Perform OAuth authentication 
		 * @param provider String Values: 'facebook', 'twitter', 'google_plus'
		 * @param callback function The callback function depending on the provider
		 * @return null
		 * @see loginCallbackTW, loginCallbackFB, loginCallbackGP
		 */
		this.loginOauth   =  function(provider, callback){
								sdk_app_context.showLoader();
								OAuth.popup(provider)
								 .done(callback)
								 .fail(function(error){
									console.log(error);
								 });
								return;
							};
		/* 
		 * Log in callback for Twitter provider
		 * @return Bool TRUE if authentication was successful
		 * @see loginOauth
		 * @see API Documentation
		 */
		this.loginCallbackGP = function(response){
									//Get profile info
									response.me()
									 .done(function(response) {
										console.log(response);
										var email = response.email;
										var username = response.lastname+"_"+response.id;
										var found = apiRH.create_internal_user(username, email, {gpId: response.id, avatar: response.avatar, name: response.firstname, last_name: response.lastname}, window.apiRH.keeper.getItem('request_token'));
										/* End handshake with server by validating token and getting 'me' data */
										context.endHandshake(username);

										window.location.assign('feed.html?filter_feed=all');
										return;
									})
									 .fail(function(error){
										console.log(error);
									});
								};
		/* 
		 * Log in callback for Facebook provider
		 * @return Bool TRUE if authentication was successful
		 * @see loginOauth
		 * @see API Documentation
		 */
		this.loginCallbackFB = function(response){
									response.me()
									 .done(function(response){
										console.log(response);
										var email = response.email;
										var username = response.lastname+"_"+response.id;
										var found = apiRH.create_internal_user(username, email, {fbId: response.id, avatar: response.avatar, name: response.firstname, last_name: response.lastname}, window.apiRH.keeper.getItem('request_token'));
										/* End handshake with server by validating token and getting 'me' data */
										context.endHandshake(username);

										window.location.assign('feed.html?filter_feed=all');
										return;
									})
									 .fail(function(error){
										console.log(error);
									});
								};

		/* 
		 * Add new image to stack upload
		 * @param File image
		 * @param Array stack
		 * @return void
		 */
		this.addImageToStack = 	function(image){
									console.log(JSON.stringify(image));
									$(".close_on_touch").trigger('click');
									var stackPiece = Handlebars.templates['stackImage'];
									var html = stackPiece(image);
									$(".insert_here").append(html);
								};

		this.endHandshake = function(user_login){
								var exists  = context.getRequest('user/exists/'+ user_login, null);
								if(exists.success){
									/* Validate token */
									data = {
												user_id     : 'none',
												token       : apiRH.get_request_token(),
												validate_id   : (exists.data.user_id) ? exists.data.user_id : 'none'
											};
									response = this.makeRequest('user/validateToken/', data);
									context.save_user_data_clientside(exists.data);
								}
							};

		this.transfer_win = function (r) {
									app.toast("Se ha publicado una imagen");
									window.location.reload(true);
								};
		this.profile_transfer_win = function (r) {
									// app.toast("Imagen de perfil modificada");
									// window.location.reload(true);
									return true;
								};
		/*
		 * Receipt success callback
		 * @param 
		 */
		this.receipt_transfer_win = function (r) {
										setTimeout(function() {
											app.toast("Tu recibo se ha subido correctamente.");
											setTimeout(function(){
												app.hideLoader();
											}, 2000);

											return true;
										}, 0);
									};
		/*
		 * Advanced search fail callback
		 * @param 
		 */
		this.transfer_fail = function (error) {
								setTimeout(function() {
									console.log(JSON.stringify(error));
									alert("An error has occurred: Code = " + error.code);
									console.log("upload error source " + error.source);
									console.log("upload error target " + error.target);
								}, 0);
							};
		
		/*
		 * Prepare params for Profile File transfer
		 * @param fileURL
		 */
		this.prepareProfileFileTransfer = function(fileURL){
									app.showLoader();
									this.transfer_options = new FileUploadOptions();
									this.transfer_options.fileUrl = fileURL;
									this.transfer_options.fileKey = "file";
									this.transfer_options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
									this.transfer_options.mimeType = "image/jpeg";
									console.log(this.transfer_options);
									var params = {};
										params.client = "app";
									this.transfer_options.params = params;
									this.upload_ready = true;
									console.log("prepareProfileTransfer");
									app.hideLoader();
								};
		
		/*
		 * Initialize Profile File transfer
		 * @param fileURL
		 * @see prepareProfileTransfer MUST be executed before
		 */
		this.initializeProfileFileTransfer = function(){
									if(this.upload_ready){
										var ft = new FileTransfer();
										ft.upload(  this.transfer_options.fileUrl, 
													encodeURI(api_base_url+"transfers/"+user+"/profile/"), 
													context.profile_transfer_win, 
													context.transfer_fail, 
													this.transfer_options
												);
									}
								};

		/**
		 * Prepare params for Search File transfer
		 * @param fileURL
		 * @param source
		 */
		this.prepareReceiptFileTransfer = function(fileURL, source){
									
									app.showLoader();
									console.log(fileURL);
									this.transfer_options = new FileUploadOptions();
									this.transfer_options.fileUrl 		= fileURL;
									this.transfer_options.fileLocal		= "file://"+fileURL;
									this.transfer_options.fileKey 		= "file";
									this.transfer_options.fileName 		= fileURL.substr(fileURL.lastIndexOf('/') + 1);
									this.transfer_options.httpMethod 	= "POST";
									this.transfer_options.mimeType 		= "image/jpeg";
									this.transfer_options.quality 		= 50;
									this.transfer_options.correctOrientation = true;
									this.transfer_options.chunkedMode 	= false;
									// this.transfer_options.headers 		= "{'Content-Type':'multipart/form-data'}";
									console.log(this.transfer_options);
									var params = {};
										params.client = "app";
									this.transfer_options.params = params;
									this.upload_ready = true;
									var image = {thumb: this.transfer_options.fileLocal};
									console.log(JSON.stringify(image));
									apiRH.initializeReceiptFileTransfer();
									console.log("prepareReceiptTransfer");
									app.hideLoader();
								};

		/*
		 * Initialize Search by image File transfer
		 * @param fileURL
		 * @see prepareProfileTransfer MUST be executed before
		 * Dedalo approved
		 */
		this.initializeReceiptFileTransfer = function(params){
												
												var user = (_coach) ? _coach : "not_logged";
												if(this.upload_ready){
													var ft = new FileTransfer();
													this.transfer_options.params = params;
													ft.upload(  this.transfer_options.fileUrl, 
																encodeURI('http://ginger-admin.cloudapp.net/rogue1.php'), 
																context.receipt_transfer_win, 
																context.transfer_fail, 
																this.transfer_options
															);
													app.showLoader();
													app.toast("Estamos procesando tu recibo...")
												}
											};
								


		this.fileselect_win = function (r) {
								if(!r && r == '')
									return;
								return context.prepareProfileFileTransfer(r);
							};

		this.receipt_fileselect_win = function (r) {
								setTimeout(function() {
									console.log("r ::: "+r);
									console.log("Receipt file sent");
									if(!r && r == '')
										return;
									return context.prepareReceiptFileTransfer(r);
								}, 0);
							};

		this.profileselect_win = function (r) {
								if(!r && r == '')
									
									return context.prepareProfileFileTransfer(r);
							};
		this.fileselect_fail = function (error) {
								app.toast("An error has occurred: " + error);
							};



							/*
								IMPLEMENTACION DE LA CAMARA 
							*/
		/**
		 * @param String destination Upload destination Options: "profile", "event"
		 * @param String source Source to get media file from Options: "camera", "gallery"
		 * @return void
		 */
		this.getFileFromDevice = function(destination, source){

			this.photoDestinationType = navigator.camera.DestinationType;
			var sourcetype =  navigator.camera.PictureSourceType.PHOTOLIBRARY;
			
			if(source == "camera") sourcetype =  navigator.camera.PictureSourceType.CAMERA;
			
			if(destination == 'profile')
				navigator.camera.getPicture(context.profileselect_win, context.fileselect_fail, { quality: 50,
					destinationType: this.photoDestinationType.FILE_URI,
					sourceType: sourcetype,
					mediaType: navigator.camera.MediaType.ALLMEDIA });

			if(destination == 'receipt')
				navigator.camera.getPicture(context.receipt_fileselect_win, context.fileselect_fail, { quality: 100,
						destinationType: this.photoDestinationType.FILE_URI,
						sourceType: sourcetype,
						mediaType: navigator.camera.MediaType.ALLMEDIA });
			return;
		};

		
	/**** More specific methods ****/


		this.fetchDiet = function(diet_id){

				var result = apiRH.getRequest('tables/dieta?_id='+diet_id);
				console.log(result);
				return result;
		};
		

		this.fetchCoachProfile = function(){

			var count 	= 5;
			var _object = { "stars": { "active": 0, "inactive": 0 }  };
			var myhtml 	= "";
			var star 	= Math.round(_coach.rating);
			var personalidadesConcat = "";

			for (var i = 0; i < star; i++){
				_object.stars.active ++;
				myhtml += "<img src='"+cordova_full_path+"images/starh.svg'>";
			}
			for (var x = 0; x < count - star; x++){
				_object.stars.inactive ++;
				myhtml += "<img src='"+cordova_full_path+"images/star.svg'>";
			}

			var separador = "";
			for(var p = 0; p < _coach.personalidad.length; p++){

				if(p == _coach.personalidad.length - 1){
					separador = "";

				}else{
					separador = ", ";
				}
				personalidadesConcat += catalogues.coach_type[p] + separador;
			}
			_object.stars.html = myhtml;
			_object.personalidad_concat = personalidadesConcat;
			return _object;
		};

		this.fetchClientProfile = function(clientId){

			var personalidadesConcat = "";
			var restrictionsConcat = "";
			var separator = "";
			var client_profile = apiRH.getRequest("tables/cliente?_id="+clientId);
			
			for(var i = 0; i < _coach.personalidad.length; i++){

				separator = (i == _coach.personalidad.length - 1) ? "": ", ";
				personalidadesConcat += catalogues.coach_type[i] + separator;
			}
			if(client_profile.perfil.restricciones)
				for(i = 0; i < client_profile.perfil.restricciones; i++){
					separator = (i ==client_profile.perfil.restricciones.length - 1) ? ", ": " ";
					restrictionsConcat += catalogues.restricciones[i] + separator;
				}
			var _profile = 	{
								name 				: client_profile.nombre,
								last 				: client_profile.apellido,
								objective 			: (personalidadesConcat != '') ? personalidadesConcat : null,
								diet_name			: client_profile.dieta.nombre,
								gender 				: catalogues.sex[client_profile.perfil.sexo],
								age 				: client_profile.perfil.edad.real,
								postal 				: client_profile.cp,
								comments 			: client_profile.comentarios,
								height 				: client_profile.perfil.estatura,
								weight 				: client_profile.perfil.peso,
								ideal_weight 		: client_profile.pesoDeseado,
								coach_type 			: personalidadesConcat,
								exercise_freq 		: client_profile.perfil.ejercicio,
								restrictions		: (restrictionsConcat != '') ? restrictionsConcat : null
							};
			return _profile;
		};

	
		this.postNotification = function(userId, title, subtitle, content){
			
			console.log("Posting a notification");
			window.plugins.OneSignal.getIds(function(ids) {
			  	var notificationObj = { contents: {en: "message body"},
			                          include_player_ids: [ids.userId]};
				window.plugins.OneSignal.postNotification(notificationObj,
				    function(successResponse) {
				      console.log("Notification Post Success:", successResponse);
				    },
				    function (failedResponse) {
				      console.log("Notification Post Failed: ", failedResponse);
				      alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
				    }
				);
			});
		};


	}