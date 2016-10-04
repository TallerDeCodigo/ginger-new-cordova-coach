/*
 *	Search for localStorage support
 *
 */

if (localStorage) {
	//console.log("Local storage supported");
} else {
  //console.log("Local storage not supported");
}

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
	this.device_info = {
							sdk_version: this.version,
							build: this.app_build,
							model: this.device_model,
							platform: this.device_platform,
							version: this.device_platform_version
						};
	var context = this;
	window.sdk_app_context = null;

	/* 
		Production API URL 
							*/

	window.api_base_url = "https://gingerservice.azure-mobile.net/";  //servicios ginger
	/* Development local API URL */
	// window.api_base_url = "http://dedalo.dev/rest/v1/";
	// window.api_base_url = "http://localhost/~manuelon/dedalo/rest/v1/";
	
	this.ls = window.localStorage;
	/* Constructor */
	this.construct = function(app_context){
					//console.log('Initialized ginger api-sdk1.0');
					if(this.ls.getItem('request_token')) this.token = this.ls.getItem('request_token');
					sdk_app_context = app_context;
					/* For chaining purposes ::) */
					return this;
				};
				
		/*** Methods ***/
		/* 
		 * Manage pseudo Log in process to use protected API calls
		 * @param data_login JSON {user_login, user_password}
		 * @return status Bool true is successfully logged in; false if an error ocurred
		 */
		this.loginNative =  function(data_login){

		var email = data_login.mail;
		var pass = data_login.pass;
		var req = {
				method : 'post',
				url : api_base_url + 'api/login',
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': '',
					'Content-Type': 'application/json'
				},
				data : {
					"tipo" : "coach",
					"mail" : email,
					"password" : pass
				}
			}
			console.log(api_base_url);
			var response = this.makeRequest('api/login', req);

			console.log(JSON.stringify(response));
			if(response.Status == 'FAIL')
				return false;
			/*
				GUARDA LOS DATOS DEL USUARIO EN LOCAL STORAGE 
			*/

			localStorage.setItem('token', response.token);
			localStorage.setItem('mail', response.mail);
			localStorage.setItem('userId', response.userId);

			this.token = response.token;

			var userId 	= localStorage.getItem('userId');
			var mail 	= localStorage.getItem('mail');
			var token 	= localStorage.getItem('token');

			console.log(" ID > > "+userId + " MAIL > > " + mail + " TOKEN > > " + this.token);

			/*
				REGRESA LA RESPUESTA DEL SERVIDOR CON EL USER ID, MAIL Y TOKEN
			*/

			if(token){
				var req = {
					method : 'post',
					url : api_base_url + 'tables/cliente/',
					headers: {
						'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
						'X-ZUMO-AUTH': token,
						'Content-Type': 'application/json'
					},
					data : {
						"tipo" : "coach",
						"mail" : email,
						"password" : pass
					}
				}
				// var user = this.getRequest('tables/coaches/' + userId, req);

				// //console.log(JSON.stringify(user));
				// //console.log(user);

				// if(user){
				// 	localStorage.setItem('coach_type', user.perfil.personalidad);
				// 		console.log("plan> "+user.perfil.personalidad);
				// 	localStorage.setItem('user_name', user.nombre);
				// 		console.log("name> "+user.nombre);
				// 	localStorage.setItem('user_last_name', user.apellido);
				// 		console.log("apellido> "+user.apellido);
				// 	localStorage.setItem('genero', user.perfil.sexo);
				// 		console.log("sexo> "+user.perfil.sexo);
				// 	localStorage.setItem('edad', user.perfil.edad.real);
				// 		console.log("edad> "+user.perfil.edad.real);
				// 	localStorage.setItem('zipcode', user.cp);
				// 		console.log("zipcode> "+user.cp);
				// 	localStorage.setItem('estatura', user.perfil.estatura);
				// 		console.log("estatura> "+user.perfil.estatura);
				// 	localStorage.setItem('peso', user.perfil.peso);
				// 		console.log("peso> "+user.perfil.peso);
				// 	localStorage.setItem('peso_ideal', user.pesoDeseado);
				// 		console.log("peso_ideal> "+user.pesoDeseado);
				// 	localStorage.setItem('dpw', user.perfil.ejercicio);
				// 		console.log("dpw> "+user.perfil.ejercicio);
				// 	localStorage.setItem('restricciones', user.restricciones);
				// 		console.log("restricciones> "+user.restricciones);
				// 	localStorage.setItem('comentarios', user.comentarios);
				// 		console.log("comentarios> "+user.comentarios);
				// 	localStorage.setItem('customerId', user.customerId);
				// 		console.log("customerId> "+user.customerId);
				// 	localStorage.setItem('chatId', user.chatId);
				// 		console.log("chatId> "+user.jid);
				// 	localStorage.setItem('chatId', user.chatId);
				// 		console.log("chatId> "+user.chatId);
				// 	localStorage.setItem('dietaId', user.dieta._id);
				// 		console.log("dietaId> "+user.dieta._id);
				// 	localStorage.setItem('dietaName', user.dieta.nombre);
				// 		console.log("dietaName> "+user.dieta.nombre);
				// 	localStorage.setItem('nombre_coach', user.coach.nombre);
				// 		console.log("coach_name> " + user.coach.nombre);
				// 	localStorage.setItem('nombre_coach', user.coach.apellido);
				// 		console.log("coach_last> " + user.coach.apellido);		

				// 	return (userId) ? response : false;
				// }
				return true;
				
			}

			return false;
		};

		/**
		 * Función para obtener las dietas de un coach que este logeado
		 *
		 **/

		this.getDiets = function(){
			var req = {
				method : 'get',
				url : api_base_url + 'tables/dieta/?coach=',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}

			var response = this.getRequest('tables/dieta/?coach=' + localStorage.getItem('userId'), req);

			console.log("Request Data Diets");
			console.log(response);

			setTimeout(function(){
				sdk_app_context.hideLoader();
			}, 2000);
			return (response) ? response : false;

		};



		/**
		 *
		 * Update Diet
		 *
		 **/

		this.updateDiet = function (data){
			
			var req = {
				method : 'PATCH',
				url : api_base_url + 'tables/dieta/',
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}

			console.log(JSON.stringify(req));

			var response = this.makePatchRequest('tables/dieta/', data);

			console.log("Request Path Data Dieta");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		/**
		 * DELETE DIET
		 * */

		this.deleteDiet = function(diet){
			var req = {
				method : 'DELETE',
				url : api_base_url + 'tables/dieta/' + diet,
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}

			console.log(JSON.stringify(req));

			var response = this.makeDeleteRequest('tables/dieta/' + diet, req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};



				/*Holkan*/
		/**
		 * DELETE DISH
		 * */

		this.deleteDish = function(diet){
			var req = {
				method : 'DELETE',
				url : api_base_url + 'tables/dieta/' + diet,
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}

			console.log(JSON.stringify(req));

			var response = this.makeDeleteRequest('tables/dieta/' + diet, req);

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};


		/**
		 * COPY DIET
		 * */

		 this.copyDiet = function(data){
			var req = {
				method : 'POST',
				url : api_base_url + 'api/duplicate',
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data: data
			}

			console.log(JSON.stringify(req));

			var response = this.makeRequest('api/duplicate', req);

			console.log("Request Copy Data Dieta");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};



			/*holkan*/
		/**
		 * CREATE DIET
		 * */

		 this.createDiet = function(data){
			var req = {
				method : 'POST',
				url : api_base_url + 'api/create',   //ESTO NO ES CORRECTO
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data: data
			}

			console.log(JSON.stringify(req));

			var response = this.makeRequest('api/duplicate', req);

			console.log("Request Copy Data Dieta");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.makeDiet = function(data){
			var req = {
				method : 'POST',
				url : api_base_url + 'tables/dieta/',   //ESTO NO ES CORRECTO
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data: JSON.parse(data)
			}

			console.log(JSON.stringify(req));

			var response = this.makeRequest('tables/dieta/', req);

			console.log("Request Copy Data Dieta");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		this.saveDiet = function(data){

			var aux = JSON.parse(data);

			console.log(aux.__v);

			delete aux.__v;

			data = JSON.stringify(aux);

			//console.log(JSON.stringify(aux));

			var req = {
				method : 'PATCH',
				url : api_base_url + 'tables/dieta/'+ JSON.parse(data)._id,   //ESTO NO ES CORRECTO
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data: data
			}


			console.log(req.data);
			console.log(req);

			var response = this.makePatchRequest('tables/dieta/'+ JSON.parse(data)._id, req);

			console.log("Request PATCH Data Dieta");

			console.log('RESPUESTA DEL SERVIDOR: ' + JSON.stringify(response));  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		};

		/**
		 *
		 * Platillos
 		 *
		 **/

		this.listDishes = function(publico){
			var req = {
				method : 'get',
				url : api_base_url + 'tables/plato?coach=' + localStorage.getItem('userId') + '&publico=' + publico ,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}
			console.log(req);

			var response = this.getRequest('tables/plato?coach=' + localStorage.getItem('userId') + '&publico=' + publico , req);

			console.log("Request Data Dishes");

			console.log(response);  //llega aqui con la respuesta del servidor

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
					'X-ZUMO-AUTH': localStorage.getItem('token'),
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
		 * */

		 this.listIngredient = function(){
		 	var req = {
				method : 'get',
				url : api_base_url + 'tables/ingrediente/?epp=999',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}
			console.log(req);

			var response = this.getRequest('tables/ingrediente/?epp=999' , req);

			console.log("Request Data Ingredients");

			console.log(response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		 };

		/**
		 *
		 * SAVE INGREDIENTS
 		 *
		 **/


		 this.newIngredient = function(data){
		 	var req = {
				method : 'post',
				url : api_base_url + 'tables/ingrediente',	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}
			console.log(req);

			var response = this.makeRequest('tables/ingrediente', req);

			console.log("Request Data Ingredients");

			console.log('API RESPONSE: ' + response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;
		 };


		/**
		 * Función para obtener las usuarios de un coach que este logeado
		 *
		 **/
		this.getUsuarios = function(){
			
			var req = {
				method : 'get',
				url : api_base_url + 'api/client_status?coachid=' + localStorage.getItem('userId'),
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			};

			var response = null;
				response = this.getRequest('api/client_status?coachid=' + localStorage.getItem('userId'), req);

			if(response.length){
				console.log(QB);
				// Process chat unread messages stuff
				// response.forEach(function(item){
				// 	var request = {
				// 		method : 'get',
				// 		url : api_base_url + 'api/client_status?userid='+item._id,
				// 		headers: {
				// 			'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
				// 			'X-ZUMO-AUTH': localStorage.getItem('token'),
				// 			'Content-Type': 'application/json'
				// 		}
				// 	};
				// 	console.log(request);
				// 	var response2 = context.getRequest('api/client_status?userid=' + item._id, request);
				// 	console.log("Response 2 ::: ");
				// 	console.log(response2);
				// 	response.consumos = response2;
				// });
				console.log(response);
			}
			return (response) ? response : false;

		};


		/**\
		 **
		 ** Update Client Diet
		 **
		\**/
		this.updateClientDiet = function (client_id, data){
			
			var req = {
				method : 'PATCH',
				url : api_base_url + 'tables/cliente/'+client_id,
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}

			console.log(data);

			console.log(JSON.stringify(req));

			var response = this.makePatch2Request('tables/cliente/'+client_id, req);

			console.log("Request Path Data Dieta CLiente");

			console.log('Response: ' + JSON.stringify(response));  //llega aqui con la respuesta del servidor

			localStorage.setItem('user-selected', JSON.stringify(response));

			return (response) ? response : false;
		};

		this.getFinanzas = function(mes){
			var req = {
				method : 'get',
				url : api_base_url + 'api/history/?coach=' + localStorage.getItem('userId') + '&mes=' + mes,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}
			console.log(req);

			var response = this.getRequest('api/history/?coach=' + localStorage.getItem('userId') + '&mes=' + mes, req);

			return (response) ? response : false;

		};

		this.getInfoCoach = function(){
			var req = {
				method : 'get',
				url : api_base_url + 'tables/coach?_id=' + localStorage.getItem('userId'),	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}
			console.log(req);

			var response = this.getRequest('tables/coach?_id=' + localStorage.getItem('userId'), req);

			console.log("Request Data Coach");

			console.log(JSON.stringify(response) );  //llega aqui con la respuesta del servidor


			console.log("INFO COACH SAVE");
			this.save_user_data_clientside(JSON.stringify(response));


			return (response) ? true : false;

		};

		this.updatePerfil = function(data){
			var req = {
				method : 'PATCH',
				url : api_base_url + 'tables/cliente/' + localStorage.getItem('userId') ,
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : data
			}


			console.log(JSON.stringify(req));

			var response = this.makePatchRequest('tables/cliente/' + localStorage.getItem('userId'), req);

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
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				data : {
					'cliente' : localStorage.getItem('userId'),
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

			var users = JSON.parse(localStorage.getItem('user-selected'));

			var req = {
				method : 'get',
				url : api_base_url + 'tables/cliente?_id='  + users._id,	//definitr tabla
				headers: {
					'X-ZUMO-APPLICATION': 'ideIHnCMutWTPsKMBlWmGVtIPXROdc92',
					'X-ZUMO-AUTH': localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			}
			//console.log(req);

			var response = this.getRequest('tables/cliente?_id=' + users._id, req);

			console.log("Request Data Clientes");

			console.log('Response: ' + response);  //llega aqui con la respuesta del servidor

			return (response) ? response : false;

		};

		
		/* 
		 * Creates an internal user to make calls to the API
		 * @param username String
		 * @param email String
		 * @param attrs array()
		 * TO DO: Within the attributes sent to this method we can send the profile image url
		 * @param token String
		 * @return status Bool true is successfully created a new user
		 * @return userdata JSON Contains the user info to be stored client side
		 * @see save_user_data_clientside()
		 */
		this.create_internal_user = function(username, email, attrs, token){
											var data, response, exists = null, var_return;
											/* If user exists, it returns the username and id */
											exists  = this.getRequest('user/exists/', username);
											console.log(JSON.stringify(exists));
												/* Exit and get new valid token if user already exists */
												if(exists.success){
													console.log('User already exists, saving data');
													this.save_user_data_clientside(exists.data);
													/* Validate token */
													data = {
																user_id     : 'none',
																token       : apiRH.get_request_token(),
																validate_id   : (exists.data.user_id) ? exists.data.user_id : 'none'
															};
													response = this.makeRequest('user/validateToken/', data);
													return;
												}
											/* Create new user and validate it's token */
											console.log('Creating new user');
											data = {
														email       : email,
														username    : username,
														attrs    	: attrs
													};
											console.log(JSON.stringify(data));
											response = this.makeRequest('auth/user/', data);
											/* End handshake with server by validating token and getting 'me' data */
											context.endHandshake(username);

											/* Validate token */
											data = {
														user_id     : 'none',
														token       : apiRH.get_request_token(),
														validate_id   : (window.localStorage.getItem('user_id')) ? window.localStorage.getItem('user_id') : 'none'
													};
											response = this.makeRequest('user/validateToken/', data);
											app.toast("User registered,\n ¡Welcome!");
											var_return = (response.success) ? true : false;
											return var_return;
									};

		/* 
		 * Save user data client side to execute auth requests to the API
		 * @return null
		 * @see this.create_internal_user
		 */
		this.save_user_data_clientside = function(data){

			localStorage.setItem('user', data);
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
									this.ls.setItem('request_token', response_data.data.request_token);
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
		 * @see localStorage
		 */
		this.has_token = function(){
							return (typeof this.token != 'undefined' || this.token !== '') ? localStorage.getItem('token') : false;
						};
		/* 
		 * Check if the Request object has a valid token
		 * @return stored token, false if no token is stored
		 */
		this.has_valid_token = function(){
							if(this.token !== undefined || this.token !== ''){

								console.log("Looks like you already have a token, let's check if it is valid");
								var dedalo_log_info = (typeof this.ls.getItem('dedalo_log_info') != undefined) ? JSON.parse(this.ls.getItem('dedalo_log_info')) : null;
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
		this.makeRequest = function(endpoint, data){
			
			console.log(data.data); //llega a makerequest

			sdk_app_context.showLoader();
			var result = {};

			$.ajax({
			  type: 'POST',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			  async: false
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

		this.makePatchRequest = function(endpoint, data){
			
			console.log("----------------------------"); //llega a makerequest
			console.log(data.data); //llega a makerequest
			console.log("----------------------------"); //llega a makerequest
			sdk_app_context.showLoader();
			var result = {};

			//console.log('datos: ' + data.data);

			$.ajax({
			  type: 'PATCH',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: data.data,
			  dataType: 'json',
			  async: false
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

		this.makePatch2Request = function(endpoint, data){
			
			console.log("----------------------------"); //llega a makerequest

			console.log(data.data); //llega a makerequest

			console.log("----------------------------"); //llega a makerequest
			
			sdk_app_context.showLoader();
			
			var result = {};

			//console.log('datos: ' + data.data);

			$.ajax({
			  type: 'PATCH',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			  async: false
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

		this.makeDeleteRequest = function(endpoint, data){
			console.log(data.data); //llega a makerequest

			sdk_app_context.showLoader();
			var result = {};

			console.log('datos' + data.data);

			$.ajax({
			  type: 'DELETE',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				sdk_app_context.hideLoader(response);
			})
			 .fail(function(e){
				result = false;
				console.log(JSON.stringify(e));

				if(!$('.overscreen_err').is(':visible')){
					console.log('entra popup');
					$('.overscreen_err').show();
					setTimeout(function() {$('.overscreen_err').addClass('active');}, 200);
				} else {
					$('.overscreen_err').removeClass('active');
					setTimeout(function() {$('.overscreen_err').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');

				$('#aceptar_err').click(function(){
					$('.overscreen_err').hide();
					$('#blur').toggleClass('blurred');
				});

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
			  async: false
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
			var result = {};
		
			$.ajax({
			  type: 'GET',
			  headers: data.headers,
			  url: window.api_base_url+endpoint,
			  data: JSON.stringify(data.data),
			  dataType: 'json',
			  async: false
			})
			 .done(function(response){
				result = response;
				// sdk_app_context.hideLoader(response);
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
		this.patchRequest = function(endpoint, data){
							sdk_app_context.showLoader();
							var userInfo = {};

							var xhr = new XMLHttpRequest();
							xhr.open('POST', window.api_base_url+endpoint);
							xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
							xhr.onload = function() {
								console.log(xhr.status);
							    if (xhr.status === 200) {
							        var userInfo = JSON.parse(xhr.responseText);
							        console.log(userInfo);
							        sdk_app_context.hideLoader();
							    }
							};
							xhr.send(data);
							/* ContentType is important to parse the data server side since PUT doesn't handle multipart form data */
							 return userInfo;
						};
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
										var found = apiRH.create_internal_user(username, email, {gpId: response.id, avatar: response.avatar, name: response.firstname, last_name: response.lastname}, window.localStorage.getItem('request_token'));
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
										var found = apiRH.create_internal_user(username, email, {fbId: response.id, avatar: response.avatar, name: response.firstname, last_name: response.lastname}, window.localStorage.getItem('request_token'));
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
									// app.showLoader();
									// this.transfer_options = new FileUploadOptions();
									// this.transfer_options.fileUrl = fileURL;
									// this.transfer_options.fileKey = "file";
									// this.transfer_options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
									// this.transfer_options.mimeType = "image/jpeg";
									// console.log(this.transfer_options);
									// var params = {};
									// 	params.user_id = "370n3209823n23";
									// this.transfer_options.params = params;
									// this.upload_ready = true;
									// console.log("prepareReceiptTransfer");
									// app.hideLoader();
									
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
												user = (user) ? user : "not_logged";
												if(this.upload_ready){
													var ft = new FileTransfer();
													console.log(JSON.stringify(ft));
													this.transfer_options.params = params;
													ft.upload(  this.transfer_options.fileUrl, 
																encodeURI('https://gingerfiles.blob.core.windows.net/recibos/'), 
																context.receipt_transfer_win, 
																context.transfer_fail, 
																this.transfer_options
															);
													app.toast("Still processing...")
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
					mediaType: navigator.camera.MediaType.ALLMEDIA  });
			if(destination == 'receipt')
				navigator.camera.getPicture(context.receipt_fileselect_win, context.fileselect_fail, { quality: 100,
						destinationType: this.photoDestinationType.FILE_URI,
						sourceType: sourcetype,
						mediaType: navigator.camera.MediaType.ALLMEDIA  });
			return;
		};


		var app = {
		    // Application Constructor
		    initialize: function() {
		        this.bindEvents();
		    },
		    // Bind Event Listeners
		    //
		    // Bind any events that are required on startup. Common events are:
		    // 'load', 'deviceready', 'offline', and 'online'.
		    bindEvents: function() {
		        document.addEventListener('deviceready', this.onDeviceReady, false);
		    },
		    // deviceready Event Handler
		    //
		    // The scope of 'this' is the event. In order to call the 'receivedEvent'
		    // function, we must explicitly call 'app.receivedEvent(...);'
		    onDeviceReady: function() {
		        app.receivedEvent('deviceready');
		    },
		    // Update DOM on a Received Event
		    receivedEvent: function(id) {
		        var parentElement = document.getElementById(id);
		        var listeningElement = parentElement.querySelector('.listening');
		        var receivedElement = parentElement.querySelector('.received');

		        listeningElement.setAttribute('style', 'display:none;');
		        receivedElement.setAttribute('style', 'display:block;');

		        console.log('Received Event: ' + id);
		    }
		};

		app.initialize();



		
	}