/*END WINDOW ON LOAD*/

(function($){

	"use strict";

	$(function(){

		$(".acc-selector").click(function(){
			if ($(this).hasClass('ui-state-active')) {
				if ($(this).hasClass('desayuno')) {$(this).parent().parent().animate({scrollTop:0}, 300);}
				if ($(this).hasClass('snack1')) {$(this).parent().parent().animate({scrollTop:54}, 300);}
				if ($(this).hasClass('comida')) {$(this).parent().parent().animate({scrollTop:120}, 300);}
				if ($(this).hasClass('snack2')) {$(this).parent().parent().animate({scrollTop:184}, 300);}
				if ($(this).hasClass('cena')) {$(this).parent().parent().animate({scrollTop:248}, 300);}
			}
		});

		// Seguro desea cambiar la dieta?
		$('.di-options a').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});


	});

})(jQuery); //End function


