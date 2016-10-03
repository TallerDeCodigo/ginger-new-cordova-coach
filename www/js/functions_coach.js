/*END WINDOW ON LOAD*/

(function($){

	"use strict";

	$(function(){

		if($('body').hasClass('dieta') ){
			
			console.log("has class");
		  	$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});
		  	$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});

		  	var idDelete;
		  	var diaDelete;
		  	var mealDelete;

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

	  				var modify = JSON.parse(localStorage.getItem('dietaEdit'));
	  				if(localStorage.getItem('contador_platillos') ){
	  					var count_less = localStorage.getItem('contador_platillos');
	  					count_less--;
	  					localStorage.setItem('contador_platillos', count_less);
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

	  				// console.log("le toca a "+letoca);

	  				delete modify["estructura"][diaDelete][mealDelete][letoca];

	  				// console.log(JSON.stringify(modify));

	  				$('li.'+diaDelete+' .'+mealDelete+' .platillo[data='+idDelete+']').remove();

	  				localStorage.setItem('dietaEdit', JSON.stringify(modify));

	  				$('.overscreen5').hide();
	  				$('#blur').toggleClass('blurred');
	  			});

	  			$('#cancelar').click(function(){
	  				console.log('cancelado');
	  				$('.overscreen5').hide();
	  				$('#blur').toggleClass('blurred');
	  			});

	  			$('.back').click(function(){

	  				if (localStorage.getItem('proviene')=="lista") {
	  					localStorage.removeItem('dietaEdit');
	  					localStorage.removeItem('proviene');
		  				window.location.assign('lista-dietas.html');
	  				} else {
	  					localStorage.removeItem('dietaEdit');
	  					if(localStorage.getItem('contador_platillos') ){
		  					localStorage.removeItem('contador_platillos');
	  					}
		  				window.location.assign('dietas.html');
	  				}
	  			});

		} //End Has Class DIETA -> dieta.html


		$(window).on("load resize",function(){

			var ancho = document.documentElement.clientWidth;
			var alto = document.documentElement.clientHeight;
			$('.list-platos #scroller > ul > li').css("height",alto-148); 
			$('#toda_la_dieta > li').css("height",alto-100);
			$('.iosm #toda_la_dieta > li').css("height",alto-120);
		});// end window on load

$(window).load(function(){
	$(function() {

		/*** TODO: Get this shit into a catalogue ***/
		var coach_type 				= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
		var restricciones 			= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
		var objetivo 				= [ 'adelgazar','detox','bienestar','rendimiento' ];
		var sex 					= [ 'Hombre', 'Mujer'];
		var tipo_de_ingredientes 	= [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];

		/**
		 *
		 * Lista de Usuarios de Coach
		 *
		 **/

		// if($('body').hasClass('has-usuarios') ){

		// 	var responsedata = apiRH.getUsuarios();
		// 	$.each(responsedata, function( key, value ) {
		// 		$('.list-users').append("<li class='usuario-item' data='" + JSON.stringify(responsedata[key]) + "'><h2>" + responsedata[key].nombre + " " + responsedata[key].apellido + "</h2><a class='bubble notificaciones' >0</a><a class='bubble mensajes'>0</a></li>");
		// 	});

		// }


		if($('body').hasClass('has-user') ){

			var item = apiRH.getUserId();
			var user = item;
			var fecha = new Date();
			var fecha2 = fecha.getFullYear();
			var fecha3 = user.perfil.fechaNacimiento;

			var edad=fecha2-fecha3.slice(0, 4);
			console.log( edad.toString());			

			$('.cpur').html(user.nombre + ' ' + user.apellido);	
			$('.user_dieta').html(user.dieta.nombre);
			$('.user_sexo').html(sex[user.perfil.sexo]);
			$('.user_edad').html(edad + " años");
			$('.user_cp').html(user.cp);
			$('.user_estatura').html(user.perfil.estatura + ' m');
			$('.user_peso').html(user.perfil.peso + ' kg.');
			$('.user_pesoideal').html(user.pesoDeseado + ' kg.');
			$('.user_coachtype').html(coach_type[user.perfil.personalidad]);
			$('.user_dpw').html(user.perfil.ejercicio + ' días por semana');

			var separador = '';
			
			if(user.perfil.restricciones){
				$('.user_restricciones').html('');
				for (var i = 0; i < user.perfil.restricciones.length; i++) {
				
					if(i == user.perfil.restricciones.length -1){
						separador = '';	
					}else{
						separador = ', ';
					}
					console.log(restricciones[user.perfil.restricciones[i]]);
					$('.user_restricciones').append(restricciones[user.perfil.restricciones[i]] + separador);
				};
			}
			
			
			$('.user_comentario').html(user.comentarios);

			for (var i = 0; i < user.perfil.objetivo.length; i++) {
				user.perfil.objetivo[i]
				if(i == user.perfil.objetivo.length -1){
					separador = '';	
				}else{
					separador = ', ';
				}
				$('.user_plan').append(objetivo[user.perfil.objetivo[i]] + separador);
			};

		}

		/**
		 *
		 * Lista de Dietas de Coach
		 *
		 **/

		if($('body').hasClass('has-dietas') ){
			
			setTimeout(function(){
				app.showLoader();
			}, 0);
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

				$('.list-diet').append('<li class="elemento-dieta" data="' + _id + '"><h2> ' + nombre + ' </h2><p>' + descripcion + '</p><nav><a href="copiar-dieta.html"><img class="btn_copy" data="' + _id + '" src="images/copy.png"></a><a href="dieta.html"><img class="btn_edit" data="' + _id + '" src="images/edit.png"></a><a><img class="btn_delete" data="' + _id + '" src="images/delete.png"></a></nav></li>');

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

		//has-create-diet
		if($('body').hasClass('has-create-diet')){

			$('.btn-gre').click(function () {
				
				console.log('CREAR DIETA');

				var d_nombre 		= $('input[name="nombre"]').val();
				var d_comentario 	= $('input[name="cometario"]').val();

				localStorage.setItem('d_nombre', d_nombre);
				localStorage.setItem('d_comentario', d_comentario);
				d_nombre 		= localStorage.getItem('d_nombre');
				d_comentario 	= localStorage.getItem('d_comentario'); 

				console.log(d_nombre);
				console.log(d_comentario);

				if(d_nombre.length < 4)
					return;
				if(d_comentario.length < 4)
					return;

				//REQUEST TO GET DIET
				window.location.assign('dieta.html?method=create');
				
			});

		}

		if($('body').hasClass('has-copy-diet')){
			$('.btn-gre').click(function () {
				console.log('COPY DIETA');
				var d_nombre 		= $('input[name="nombre"]').val();
				var d_comentario 	= $('input[name="comentario"]').val();

				localStorage.setItem('d_nombre', d_nombre);
				localStorage.setItem('d_comentario', d_comentario);

				if(d_nombre.length < 4)
					return;
				if(d_comentario.length < 4)
					return;

				var json = {
					"nombre" : 		localStorage.getItem('d_nombre'),
					"descripcion" : localStorage.getItem('d_comentario'),
					"id": 			localStorage.getItem("dOperator")
				};

				var response = apiRH.copyDiet(json);

				console.log(response);

				if(response){
					var c_diet = response;

					localStorage.removeItem('d_comentario');
					localStorage.removeItem('d_nombre');
					localStorage.setItem("dOperator", c_diet._id);

					window.location.assign('dieta.html');
				}
				else
					console.log('Error');
			});
		}


		if($('body').hasClass('dieta')){
				

			/*
				CREANDO DIETA CULEROS!!
			*/

			//{"nombre": "Hola","descripcion":"Hola", "estructura":{"domingo":{"desayuno":{"1":{"a":{"platillo":"54f3c3cf4b6614a8119e7061"}}},"snack1":{},"comida":{},"snack2":{},"cena":{}}},"perfil":{"sexo":0,"edad":0,"bmi":0,"objetivo":0}}
			var dietaNew = {};

			var jsonNew = '{"nombre": "' +localStorage.getItem('d_nombre') + '","descripcion":"' + localStorage.getItem('d_comentario') + '", "estructura":{"domingo":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"lunes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"martes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"miercoles":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"jueves":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"viernes":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}},"sabado":{"desayuno":{},"snack1":{},"comida":{},"snack2":{},"cena":{}}},"perfil":{"sexo":0,"edad":0,"bmi":0,"objetivo":0}}';
			
			if(window.location.href.search('editar') != -1){
				localStorage.setItem('contador_platillos', 1);
			}

			if(window.location.href.search('create') != -1 ){

				localStorage.setItem('contador_platillos', 0);

				console.log(jsonNew);
				
				console.log('PARSE: ' + JSON.parse(jsonNew));	

				dietaNew = JSON.parse(jsonNew);

				localStorage.setItem('dietaEdit', JSON.stringify(dietaNew));

				console.log('Todo: ' + dietaNew);


				$('.platillo').hide();

				//Si viene de platillos o de un refresh

			} else if (localStorage.getItem('idDishSelected') || localStorage.getItem('dietaEdit')) {
				
				localStorage.setItem('contador_platillos', 0);
				dietaNew = JSON.parse(localStorage.getItem('dietaEdit'));
				if (localStorage.getItem('idDishSelected')) {
					var i = 0;
					var guardar1 = [];
					var guardar2 = [];

					$.each(dietaNew["estructura"][localStorage.getItem('d_date')][localStorage.getItem('d_time')], function( key, value ) {
						guardar1[i] = key;
						guardar2[i] = value;
						i++;
					});
					// var masone = i+1;
					guardar1[i] = i;
					guardar2[i] = {"a":{"platillo":localStorage.getItem('idDishSelected'),"descripcion":localStorage.getItem('desDishSelected'),"receta":localStorage.getItem('recetaDishSelected')}};
					var rv = {};
					for (var j = 0; j < guardar1.length; ++j) {
						var agregar = j+1;
					    rv[agregar] = guardar2[j];
					}
					dietaNew["estructura"][localStorage.getItem('d_date')][localStorage.getItem('d_time')]= rv;
					localStorage.setItem('dietaEdit', JSON.stringify(dietaNew));

					localStorage.removeItem('idDishSelected');

					var contador_platillos = localStorage.getItem('contador_platillos');

					contador_platillos++;
					console.log(contador_platillos);
					localStorage.setItem('contador_platillos', contador_platillos);
					console.log("Aqui no pasa o si?");
					console.log(JSON.stringify(dietaNew));					
				}

				var vienede = false;

				if (dietaNew._id) {
					vienede = true;
					var comm_id;
					var platillo_id;
					var comentarios = dietaNew.comentarios;
					var comments;
					var platillos = dietaNew.platillos;
					var receta;
					var nombre_receta;
					var ingredientes;
					var losplatos = [];
					var i=0;

					localStorage.setItem('contador_platillos', platillos.length);

					$.each( dietaNew.platillos, function( key, value ) {
						losplatos[i]=[];
						$.each( value, function( key, value ) {
							// console.log(key+":::"+value);
							if (key=="_id") {
							 	losplatos[i][0]=value;
							}
							if (key=="descripcion") {
							 	losplatos[i][1]=value;
							}
							if (key=="receta") {
							 	losplatos[i][2]=value;
							}
							if (key=="ingredientes") {
							 	
							 	var ing = '';
							 	$.each(value, function(key, value){
							 		if(value._id != null){
							 			ing = ing + value._id.nombre;
							 			console.log(value._id.nombre);	
							 		}
							 	});

							 	losplatos[i][3]=ing;
							}
						});
						i++;
					});

					var loscomentarios = [];
					var i=0;
					var j=0;

					$.each( dietaNew.comentarios, function( key, value ) {
						loscomentarios[i]=[];
						j=0;
						$.each( value, function( key, value ) {
							loscomentarios[i][j]=value;
							j++;
						});
						i++;
					});

					// console.log(loscomentarios);


					for (var i=0; i<losplatos.length; i++) {
						losplatos[i][4]="";
						for (var j = 0; j < loscomentarios.length; j++) {
							if (losplatos[i][0]==loscomentarios[j][2]&&losplatos[i][4]=="") {
								losplatos[i][4]=loscomentarios[j][1];
							}
						}
					}
				}

				$.each( dietaNew.estructura, function( key, value ) {
					// los dias de la semana
					if(key=="domingo"){dia_prueba=1;} else if (key=="lunes") {dia_prueba=2;} else if (key=="martes") {dia_prueba=3;} else if (key=="miercoles") {dia_prueba=4;} else if (key=="jueves") {dia_prueba=5;} else if (key=="viernes") {dia_prueba=6;} else if (key=="sabado") {dia_prueba=7;}
					
					var estoyen = '#toda_la_dieta li:nth-of-type('+dia_prueba+') ';
					
					$.each( value, function( key, value ) {
						// desayuno, snack, comida,...
						var dentrode = estoyen+'.acc-content.'+key+' ';
						
						var i = 1;

						$.each( value, function( key, value ) {
							// tiempos (1,2,3..)
							// console.log(key + " :::: 0" +value);
							var masadentro = dentrode+'div.platillo:nth-of-type('+i+')';
							i++;	
							$.each( value, function( key, value ) {

								$.each( value, function( key, value ) {
									// id_platillo, id_comentario
									// console.log(key + " :::: " +value);
									if (key=="platillo") {
										$(masadentro).attr("data", value);
										$(masadentro + ' nav svg').attr("data", value);

										if(vienede){
											for (var i = 0; i < losplatos.length; i++) {
												if (value==losplatos[i][0]) {

													$(masadentro).attr("data", losplatos[i][0]);
													
													$(masadentro + ' nav svg').attr("data", losplatos[i][0]);

													$(masadentro+' h5').html(losplatos[i][1]);
													
													if (losplatos[i][2]!="") {
														$(masadentro+' p.receta').html(losplatos[i][2]);
													} else {
														$(masadentro+'p.receta').hide();
													}
													if (losplatos[i][4]!="") {
														$(masadentro+' p.comentario').html(losplatos[i][4]);
													} else {
														$(masadentro+' p.comentario').hide();
													}

													if(losplatos[i][3]!= ''){
														$(masadentro+' p.los_ing').html(losplatos[i][3]);
														console.log('plato '+i+' sus ing'+losplatos[i][3]);
													}else{
														;	
													}
													
												}
											}
										}	
									}

									if (key=="descripcion") {
										$(masadentro+' h5').html(value);
									}

									if (key=="receta") {
										$(masadentro+' p.receta').html(value);
										if (value=="") {
											$(masadentro+' p.receta').hide();
										}
									}

									if ($(masadentro+' p.comentario').html()=="") {
										$(masadentro+' p.comentario').hide();
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

			}else{
				console.log('Llegamos');
				var dieta = app.get_diet('?_id='+ localStorage.getItem('dOperator'));
				console.log('ID DIET: ' + dieta._id);

				console.log(JSON.stringify(dieta));
				localStorage.setItem('dietaEdit', JSON.stringify(dieta));

				if(dieta){
					var comm_id;
					var platillo_id;
					var comentarios = dieta.comentarios;
					var comments;
					var platillos = dieta.platillos;
					var receta;
					var nombre_receta;
					var ingredientes;
					var losplatos = [];
					var i=0;

					$.each( dieta.platillos, function( key, value ) {
						losplatos[i]=[];
						$.each( value, function( key, value ) {
							// console.log(key+":::"+value);
							if (key=="_id") {
							 	losplatos[i][0]=value;
							}
							if (key=="descripcion") {
							 	losplatos[i][1]=value;
							}
							if (key=="receta") {
							 	losplatos[i][2]=value;
							}
							if (key=="ingredientes") {
							 	
							 	var ing = ' ';
							 	$.each(value, function(key, value){
							 		if(value._id != null){
							 			ing = ing + value._id.nombre;
							 			console.log('fghfghfghfgh <<<<<<'+ value._id.nombre);	
							 		}	
							 	});

							 	losplatos[i][3] = ing;
							 	console.log(losplatos[i][3]);
							}
						});
						i++;
					});

					var loscomentarios = [];
					var i=0;
					var j=0;

					$.each( dieta.comentarios, function( key, value ) {
						loscomentarios[i]=[];
						j=0;
						$.each( value, function( key, value ) {
							loscomentarios[i][j]=value;
							j++;
						});
						i++;
					});

					// console.log(loscomentarios);


					for (var i=0; i<losplatos.length; i++) {
						losplatos[i][4]="";
						for (var j = 0; j < loscomentarios.length; j++) {
							if (losplatos[i][0]==loscomentarios[j][2]&&losplatos[i][4]=="") {
								losplatos[i][4]=loscomentarios[j][1];
							}
						}
					}

					var dieta_array = [];

					var dia_prueba=0;

					var dias = [];


					//delete dieta.estructura['martes'];

					console.log(dieta);

					var arrDieta = dieta;

					$.each( dieta.estructura, function( key, value ) {
						// los dias de la semana
						if(key=="domingo"){dia_prueba=1;} else if (key=="lunes") {dia_prueba=2;} else if (key=="martes") {dia_prueba=3;} else if (key=="miercoles") {dia_prueba=4;} else if (key=="jueves") {dia_prueba=5;} else if (key=="viernes") {dia_prueba=6;} else if (key=="sabado") {dia_prueba=7;}
						
						var estoyen = '#toda_la_dieta li:nth-of-type('+dia_prueba+') ';
						
						$.each( value, function( key, value ) {
							// desayuno, snack, comida,...
							var dentrode = estoyen+'.acc-content.'+key+' ';
							
							var i=1;

							$.each( value, function( key, value ) {
								// tiempos (1,2,3..)
								// console.log(key + " :::: 0" +value);
								var masadentro = dentrode+'div.platillo:nth-of-type('+i+')';
								i++;	
								$.each( value, function( key, value ) {

									$.each( value, function( key, value ) {
										// id_platillo, id_comentario
										// console.log(key + " :::: " +value);
										if (key=="platillo") {
											for (var i = 0; i < losplatos.length; i++) {
												if (value==losplatos[i][0]) {
													// console.log(losplatos[i][1]+"<"+losplatos[i][2]+"<"+losplatos[i][4]);

													$(masadentro).attr("data", losplatos[i][0]);
													
													$(masadentro + ' nav svg').attr("data", losplatos[i][0]);

													$(masadentro+' h5').html(losplatos[i][1]);
													
													if (losplatos[i][2]!="") {
														$(masadentro+' p.receta').html(losplatos[i][2]);
													} else {
														$(masadentro+'p.receta').hide();
													}
													if (losplatos[i][4]!="") {
														$(masadentro+' p.comentario').html(losplatos[i][4]);
													} else {
														$(masadentro+' p.comentario').hide();
													}
													if(losplatos[i][3]!= ''){
														$(masadentro+' p.los_ing').html(losplatos[i][3]);
														console.log('plato '+i+' sus ing'+losplatos[i][3]);
													}else{
														;	
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


		}

		$('.btn_add').click(function(){
			console.log('guardar dieta');

			var dieta_added = localStorage.getItem('idDishSelected');
			var contador_platillos = localStorage.getItem('contador_platillos');
			console.log(dieta_added);
			console.log("contador :: "+localStorage.getItem('contador_platillos'));
			if(localStorage.getItem('contador_platillos')>=3 ){

					var dieta = localStorage.getItem('dietaEdit');
					
					console.log('ID DIETA DEFINIDO: ' +JSON.parse(dieta)._id);
					
					if(JSON.parse(dieta)._id){

						var response = apiRH.saveDiet(dieta);
						console.log(response);
					}
					else{
						var response = apiRH.makeDiet(dieta);	
					}

					if(response){			
		  				if (localStorage.getItem('proviene')=="lista") {
		  					localStorage.removeItem('dietaEdit');
		  					localStorage.removeItem('proviene');
			 	 		window.location.assign('lista-dietas.html');
		        		} else {
		        			localStorage.removeItem('dietaEdit');
			     		window.location.assign('dietas.html');
		        	 	}
		        	}
			}else{

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
				//alert('La dieta está incompleta. Favor de verificar.');
			}
	});//end click btn-add


		$('.add_dish').click(function(){
			// if ($(this).parent().hasClass('desayuno')) {
			// 	console.log('desayuno');
			// }

			// console.log($(this).parent().attr("class"));
			// console.log($(this).parent().parent().parent().parent().attr("class"));

			localStorage.setItem('d_time', $(this).attr('data'));
			localStorage.setItem('d_date', $(this).attr('date'));

			console.log($(this).attr('data'));
			console.log($(this).attr('date'));


			window.location.assign('platillos.html');
		});


		}// end if has class
		
		////////////////////////////////////////////////////////////
		//
		//  PLATILLOS FUNCTIONS
		//
		////////////////////////////////////////////////////////////		


		if($('body').hasClass('has-dishes') ){

			//Request to dishes

			var responsedata = apiRH.listDishes(0);

			var dish = responsedata;

			console.log(responsedata);

			var i = 0;

			$.each(dish, function( key, value ) {

				$('.list-dish.private').append('<li class="platillo-item" data="'+ dish[i]._id +'" descripcion="' +  dish[i].descripcion + '" receta="' + dish[i].receta + '" > <h2 class="hache" data="'+ dish[i].descripcion +'">' + dish[i].descripcion + '</h2><p class="description">' + dish[i].receta + '</p></li>');	

				i++;	

			});

			var responsedata = apiRH.listDishes(1);

			var i = 0;

			$('.list-dish.public').html('');

			$.each(responsedata, function( key, value ) {
				$('.list-dish.public').append('<li class="platillo-item" data="'+ responsedata[i]._id +'"><h2 class="hache" data="'+ responsedata[i].descripcion +'" >' + responsedata[i].descripcion + '</h2><p class="description">' + responsedata[i].receta + '</p></li>');	

				i++;	

			});

			// $('.btn-platillo').click(function(){

			// 	var is_public = $(this).attr('data');

			// 	var responsedata = apiRH.listDishes(is_public);

			// 	var i = 0;
				
				

			// });

			$('.add').click(function () {
				console.log('click');
				//localStorage.setItem('dishSelected', '');

			});

			// $('.platillo-item').click(function(){
			// 	var data = $(this).find($('.hache').attr('data') );
			// 	var i=0;
			// 	data = data.selector;
			// 	console.log(data);

			// 	if(!$('.alert_meal_description').is(':visible')){
			// 		$('.alert_meal_description').show();
			// 		$('#meal_name').html(data)
			// 		setTimeout(function() {$('.alert_meal_description').addClass('active');}, 200);
			// 	} else {
			// 		$('.alert_meal_description').removeClass('active');
			// 		setTimeout(function() {$('.alert_meal_description').hide();}, 800);
			// 	}
			// 	$('#blur').toggleClass('blurred');
			// })

			/*
				Este agrega el platillo
			*/

			$('.accept').click(function(){
				console.log("Accept");
				$(this);
			 	localStorage.setItem('idDishSelected',$(this).attr('data') );
			 	localStorage.setItem('desDishSelected',$(this).parent().parent().find('h5').html() );
			 	localStorage.setItem('recetaDishSelected',$(this).parent().parent().find('p').html() );

			 	console.log( localStorage.getItem('idDishSelected') );

				$('.alert_meal_description').hide();
				$('#blur').toggleClass('blurred');

				window.location.assign('dieta.html');

			});

			$('.cancel').click(function(){
				$('.alert_meal_description').hide();
				$('#blur').toggleClass('blurred');
			});

		}



		/*
			HAS CREAR PLATILLO
		*/

		if($('body').hasClass('has-create-platillo')){

				var is_public;
				var has_name;
				var has_receta;
				var has_comentarios;
				var has_ingredients;

			var tiempo = localStorage.getItem('d_time');
			
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

			var ingredientes_list = localStorage.getItem('ingredientes');

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
				console.log(is_public);
				localStorage.setItem('_public', is_public);
				localStorage.setItem('recipe_name', $('textarea[name="descripcion"]').val() );
				localStorage.setItem('recipe_recipe', $('textarea[name="receta"]').val() );
				localStorage.setItem('recipe_comment', $('textarea[name="comentario"]').val() );

				window.location.assign('ingredientes.html');
			});//end click

			

			$('.add').click(function () {


				var arrIngredientes = localStorage.getItem('aidi_ingrediente');

				console.log(typeof arrIngredientes);
				console.log(" --- "+ JSON.parse(arrIngredientes) );

				is_public 			= $('input[type="checkbox"]').val();
				has_name 			= $('textarea[name="descripcion"]').val();
				has_receta 			= $('textarea[name="receta"]').val();
				has_comentarios 	= $('textarea[name="comentario"]').val();
				has_ingredients 	= JSON.parse(arrIngredientes);

				console.log(typeof has_ingredients);

				var sIngredientes = '[';
				for (var i = 0; i < has_ingredients.length; i++) {
					console.log(has_ingredients[i]);
					if(i < has_ingredients.length-1)
						sIngredientes = sIngredientes + '{"_id" :"' + has_ingredients[i] + '"},';
					else
						sIngredientes = sIngredientes + '{"_id" : "'  + has_ingredients[i] + '"}';

				}

				sIngredientes = eval(sIngredientes + ']');

				console.log('CADENA: ' + JSON.stringify(sIngredientes));

				console.log(is_public+" "+has_name+" "+ has_receta +" "+ has_comentarios +" "+ arrIngredientes);

				var json = {
					"descripcion" : has_name,
					"receta" : has_receta,
					"coach" : localStorage.getItem('userId'),
					"autorizado" : 0,
					"publico" : is_public,
					"comentarios" : has_comentarios,
					"ingredientes" : sIngredientes
				};

				console.log('Id User ' + localStorage.getItem('userId'));

				console.log(JSON.stringify(json));

				var response = apiRH.newDish(json);

				if(response){
					localStorage.removeItem('d_nombre');
					localStorage.removeItem('d_comentario');
					localStorage.removeItem('ingredientes');
					
					window.location.assign('platillos.html');
				}
				else{
					alert('error new dish');
				}
				


			});//end click

				var _public = localStorage.getItem('_public');
				var recipe_name = localStorage.getItem('recipe_name');
				var recipe_recipe = localStorage.getItem('recipe_recipe');
				var recipe_comment = localStorage.getItem('recipe_comment');
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


		}

		if($('body').hasClass('has-ingredients') ){

			var spinner = $( "#spinner" ).spinner();
			
			$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});

			var responsedata = apiRH.listIngredient();

			var ingrediente = responsedata;

			console.log(responsedata);


			var i = 0;
			var j = 0;

			var arrAux = [];
			var arrAux_id = [];
			var arrIng = [];
			var arrCantidad = [];

			$.each(ingrediente, function( key, value ) {

			   $('.' + tipo_de_ingredientes[value.categoria] + '').append('<li><span class="cantidad"></span><span class="ingred-name" >'+ value.nombre +'</span><input type="checkbox" name="pan" value="'+ value.nombre +'" data="'+value._id+'"></li>');	
				 
							
				console.log(tipo_de_ingredientes[value.categoria]);

				console.log(key + '::' + value.categoria);

				
				j++;	

			});

			var countChecked = function() {
			  var n = $( "input:checked" );
			  console.log(n);
			};


			var picker;

			$("#picker-up").bind('touchstart', function(){
				timeout = setInterval(function(){
					picker = Number($("#picker-up").parent().parent().find('input').val());
					if (picker<99) {
						picker=picker+1;
			        	$("#picker-up").parent().parent().find('input').val(picker.toFixed(0));
			        	$('input[name="picker"]').attr("value", picker);
					}
			    }, 100);
			    return false;
			});

			$("#picker-up").bind('touchend', function(){
			    clearInterval(timeout);
			    return false;
			});

			$("#picker-dw").bind('touchstart', function(){
				timeout = setInterval(function(){
					picker = Number($("#picker-dw").parent().parent().find('input').val());
					if (picker>1) {
						picker=picker-1;
						$("#picker-dw").parent().parent().find('input').val(picker.toFixed(0));
						$('input[name="picker"]').attr("value", picker);
					}
			    }, 100);
			    return false;
			});

			$("#picker-dw").bind('touchend', function(){
			    clearInterval(timeout);
			    return false;
			});

			var almacen;
			var temp;

			$('input[type="checkbox"]').change(function(){
				countChecked();
				var value 	= $(this).val();
				var aidi 	= $(this).attr("data");

				if(!$(this).is(':checked')){
					// arrAux_id.splice(aidi);
					// arrCantidad.splice(aidi);
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
				
				console.log(arrAux_id);
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
				// console.log(arrCantidad);
			});

			$('.add ').click(function(){

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
				arrAux = JSON.stringify(arrAux);
				arrAux_id = JSON.stringify(arrAux_id);
				console.log(arrAux+" "+arrAux_id );
				localStorage.setItem('ingredientes', arrAux);
				localStorage.setItem('aidi_ingrediente', arrAux_id);
				window.location.assign('crear-platillo.html');
			});

			$('#cancelar').click(function(){
				$('.overscreen5').hide();
				$('#blur').toggleClass('blurred');
			});
		}//END IF BODY HAS CLASS HAS INGREDIENTES

/*
	CREAR INGREDIENTES
*/
		if($('body').hasClass('has-create-ingredient') ){
			var i_nombre;
			var category = -1;
			var tipo = -1;	
			var medida = -1;
			
			$('.add').click(function(){

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
					console.log('add ingrediente');
					
					i_nombre 	= $('input[name="name_ingrediente"]').val();
					
					if(i_nombre.length < 2) 
						return;
					if(category == -1) 
						return;
					if(tipo == -1) 
						return;
					if(medida  == -1) 
						return;

					console.log('REQUEST');

					json = {	
						"nombre" : i_nombre,
						"categoria" : category,
						"tipo" 	 : tipo,
						"contable" : medida
					};

					var response = apiRH.newIngredient(json);

					if(response){
						window.location.assign('ingredientes.html');

					}
					else{
						alert('error');
					}
				});

				$('#cancelar').click(function(){
					$('.overscreen5').hide();
					$('#blur').toggleClass('blurred');
				});
				
			$('.ing-category').click(function(){
				category = $(this).attr('value');
				console.log(category);
			});

			$('.btn-state').click(function(){
				$('.btn-state').removeClass('active');
				$(this).addClass('active');
				tipo = $(this).attr('data');
				console.log(tipo);
			});

			$('.siono').click(function(){
				$('.siono').removeClass('active');
				$(this).addClass('active');

				medida = $(this).attr('data');
				console.log(medida);
			});

		}//end if has Class
		

		if($('body').hasClass('has-list-diets') )
		{

			//Request to Service

			var responsedata = apiRH.getDiets();

			//console.log(JSON.stringify(responsedata));

			var diet = responsedata;

			//Loop the feed

			var i = 0;

			$.each(diet, function( key, value ) {

				$('.list-diets').append('<li class="dieta-item"><h2>' +  diet[i].nombre + '</h2><p></p><div class="columna"><a href="#" class="btn-pur" data-id="' +  diet[i]._id + '">Cambiar Dieta</a></div></li>');	

				i++;	

			});

			
			$('.dieta-item h2').click(function () {
				
				var idDietax = $(this).parent().find('.btn-pur').attr('data-id');

				console.log('ID DIET: ' + idDietax);

				localStorage.setItem('dOperator', idDietax);

				localStorage.setItem('proviene', 'lista');

				window.location.assign('dieta.html');

			});

			$('.btn-pur').click(function(){
				var dietSelected = $(this).attr("data-id");

				if(!$('.overscreen5').is(':visible')){
					console.log('entra popup');
					$('.overscreen5').show();
					setTimeout(function() {$('.overscreen5').addClass('active');}, 200);
				} else {
					$('.overscreen5').removeClass('active');
					setTimeout(function() {$('.overscreen5').hide();}, 800);
				}
				$('#blur').toggleClass('blurred');

				$('#aceptar').click(function(){
					
					console.log( $(this).parent().html() );
					console.log('CLICK CHANGE: ' + dietSelected);

					var user = JSON.parse(localStorage.getItem('user-selected'));

					console.log(user._id);

					var data = {
							dieta : dietSelected,
							coach : localStorage.getItem('userId')
					};

					var response = apiRH.updateClientDiet(user._id, data);

					if(response){
						window.location.assign('usuario.html');
					}
				});

				$('#cancelar').click(function(){
					$('.overscreen5').hide();
					$('#blur').toggleClass('blurred');
				});

				

			});//end click

		}


		$(".acc-selector").click(function(){
			if ($(this).hasClass('ui-state-active')) {
				if ($(this).hasClass('desayuno')) {$(this).parent().parent().animate({scrollTop:0}, 300);}
				if ($(this).hasClass('snack1')) {$(this).parent().parent().animate({scrollTop:54}, 300);}
				if ($(this).hasClass('comida')) {$(this).parent().parent().animate({scrollTop:120}, 300);}
				if ($(this).hasClass('snack2')) {$(this).parent().parent().animate({scrollTop:184}, 300);}
				if ($(this).hasClass('cena')) {$(this).parent().parent().animate({scrollTop:248}, 300);}
			}
		});

		$('.di-options a').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});

		$('h6.ingred').click(function() {
			if ($(this).find('a').html()=="+") {
				$(this).find('a').html('-');
			} else {
				$(this).find('a').html('+');
			}		
		});

		$('li.platillo-item').click(function() {
			$('li.platillo-item').removeClass('active');
			$(this).addClass('active');
		});

		$('.ing-category').click(function() {
			$('.ing-category').removeClass('active');
			$(this).addClass('active');
		});
		

		$('.usuario-item').click(function(){

			console.log($(this).attr("data"));

			var json = $(this).attr("data");

			//var pJson = JSON.parse(json);

			localStorage.setItem('user-selected', json);

			window.location.assign('usuario.html');

		});

		$('.bt-review').click(function(){
			var user_selected = localStorage.getItem('user-selected');
			user_selected = JSON.parse(user_selected)._id;
			console.log(user_selected);

			window.location.assign('lista-dietas.html');

		});//end click


		

	});

});
		/**
		 * Validación de emails
		 */
		window.validateEmail = function (email) {
			var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regExp.test(email);
		};

		/**
		 * Regresa todos los valores de un formulario como un associative array 
		 */
		window.getFormData = function (selector) {
			var result = [],
				data   = $(selector).serializeArray();

			$.map(data, function (attr) {
				result[attr.name] = attr.value;
			});
			return result;
		}

	});


	$(document).on('click', '.platillo-item', function() {

	    	var data_name = $(this).find('.hache').html();
	    	var data_description = $(this).find('p').html();
	    	var _id = $(this).attr('data');


	    	localStorage.setItem('dish_nombre', data_name);
	    	localStorage.setItem('dish_aidi', _id);


	    	if(!$('.alert_meal_description').is(':visible')){
	    		$('.alert_meal_description').show();

	    		$(".accept").attr('data', _id);

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


})(jQuery); //End function


