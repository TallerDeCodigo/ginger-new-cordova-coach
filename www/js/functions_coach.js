/*END WINDOW ON LOAD*/

(function($){

	"use strict";

	$(function(){

		// Seguro desea cambiar la dieta?
		$('.di-options a').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});


	});

})(jQuery); //End function


