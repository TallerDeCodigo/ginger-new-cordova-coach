/*END WINDOW ON LOAD*/

(function($){

	"use strict";

	$(function(){
	

$(window).on('load', function(){
	$(function() {

		/*** TODO: Get this shit into a catalogue ***/
		var coach_type 				= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
		var restricciones 			= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
		var objetivo 				= [ 'adelgazar','detox','bienestar','rendimiento' ];
		var sex 					= [ 'Hombre', 'Mujer'];
		var tipo_de_ingredientes 	= [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];

		if($('.view').hasClass('client-profile') ){

			var item 	= apiRH.getUserId();
			var user 	= item;
			var fecha 	= new Date();
			var fecha2 	= fecha.getFullYear();
			var fecha3 	= user.perfil.fechaNacimiento;
			var edad 	=	fecha2-fecha3.slice(0, 4);

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
			 	localStorage.setItem('idDishSelected', $(this).attr('data') );
			 	localStorage.setItem('desDishSelected', $(this).parent().parent().find('h5').html() );
			 	localStorage.setItem('recetaDishSelected', $(this).parent().parent().find('p').html() );

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
		
		

		$('.bt-review').click(function(){
			var user_selected = localStorage.getItem('user-selected');
			user_selected = JSON.parse(user_selected)._id;
			console.log(user_selected);

			window.location.assign('lista-dietas.html');

		});


		

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


