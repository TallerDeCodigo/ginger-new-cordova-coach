/*END WINDOW ON LOAD*/

(function($){

	"use strict";

	$(function(){

		/*** TODO: Get this shit into a catalogue ***/
		var coach_type 				= [ 'Estricto', 'Innovador', 'Animador', 'Tradicional'];
		var restricciones 			= [ 'Huevo', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
		var objetivo 				= [ 'adelgazar','detox','bienestar','rendimiento' ];
		var sex 					= [ 'Hombre', 'Mujer'];
		var tipo_de_ingredientes 	= [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];

		
		
		////////////////////////////////////////////////////////////
		//
		//  PLATILLOS FUNCTIONS
		//
		////////////////////////////////////////////////////////////		

		if( $('body').hasClass('has-dishes') ){


			var platos_privados = apiRH.listDishes(0);
			console.log(platos_privados);
			var i = 0;
			$.each(platos_privados, function( key, value ) {

				$('.list-dish.private').append('<li class="platillo-item" data="'+ platos_privados[i]._id +'" descripcion="' +  platos_privados[i].descripcion + '" receta="' + platos_privados[i].receta + '" > <h2 class="hache" data="'+ platos_privados[i].descripcion +'">' + platos_privados[i].descripcion + '</h2><p class="description">' + platos_privados[i].receta + '</p></li>');	

				i++;	

			});

			var platos_publicos = apiRH.listDishes(1);
			console.log(platos_publicos);

			i = 0;
			$('.list-dish.public').html('');

			$.each(platos_publicos, function( key, value ) {
				$('.list-dish.public').append('<li class="platillo-item" data="'+ platos_publicos[i]._id +'"><h2 class="hache" data="'+ platos_publicos[i].descripcion +'" >' + platos_publicos[i].descripcion + '</h2><p class="description">' + platos_publicos[i].receta + '</p></li>');	

				i++;	

			});


			$('.add').click(function () {
				console.log('click');
				//app.keeper.setItem('dishSelected', '');

			});

			/* Este agrega el platillo  */
			$('.accept').click(function(){
				console.log("Accept");
				$(this);
			 	app.keeper.setItem('idDishSelected', $(this).attr('data') );
			 	app.keeper.setItem('desDishSelected', $(this).parent().parent().find('h5').html() );
			 	app.keeper.setItem('recetaDishSelected', $(this).parent().parent().find('p').html() );

			 	console.log( app.keeper.getItem('idDishSelected') );

				$('.alert_meal_description').hide();
				$('#blur').toggleClass('blurred');

				window.location.assign('dieta.html');

			});

			$('.cancel').click(function(){
				$('.alert_meal_description').hide();
				$('#blur').toggleClass('blurred');
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
				console.log(is_public);
				app.keeper.setItem('_public', is_public);
				app.keeper.setItem('recipe_name', $('textarea[name="descripcion"]').val() );
				app.keeper.setItem('recipe_recipe', $('textarea[name="receta"]').val() );
				app.keeper.setItem('recipe_comment', $('textarea[name="comentario"]').val() );

				window.location.assign('ingredientes.html');
			});//end click

			

			$('.add').click(function () {


				var arrIngredientes = app.keeper.getItem('aidi_ingrediente');

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
					"coach" : app.keeper.getItem('userId'),
					"autorizado" : 0,
					"publico" : is_public,
					"comentarios" : has_comentarios,
					"ingredientes" : sIngredientes
				};

				console.log('Id User ' + app.keeper.getItem('userId'));

				console.log(JSON.stringify(json));

				var response = apiRH.newDish(json);

				if(response){
					app.keeper.removeItem('d_nombre');
					app.keeper.removeItem('d_comentario');
					app.keeper.removeItem('ingredientes');
					
					window.location.assign('platillos.html');
				}
				else{
					alert('error new dish');
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
				app.keeper.setItem('ingredientes', arrAux);
				app.keeper.setItem('aidi_ingrediente', arrAux_id);
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


		$(document).on('click', '.platillo-item', function() {

		    	var data_name = $(this).find('.hache').html();
		    	var data_description = $(this).find('p').html();
		    	var _id = $(this).attr('data');


		    	app.keeper.setItem('dish_nombre', data_name);
		    	app.keeper.setItem('dish_aidi', _id);


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

	});

})(jQuery); //End function


