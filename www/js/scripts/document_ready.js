	/*      _                                       _                        _       
	 *   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
	 *  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
	 * | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
	 *  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
	 *                                                                         |___/ 
	 */
		
window.initializeEvents = function(){
	jQuery(document).ready(function($) {
		console.log("Initializing events");
		

		/* Hook soft links */
		$('.hook').on('click', function(e){

			if( $(this).data('resource') == "user-list" )
				return app.render_user_list();
			

			if( $(this).data('resource') == "radio" )
				return audioLibrary.playRadio();
			if( $(this).data('resource') == "podcast" )
				return app.render_archive("podcast");
			if( $(this).data('resource') == "columna" )
				return app.render_archive("columna");
			if( $(this).data('resource') == "home" )
				return app.render_home();
			if( $(this).data('resource') == "authors" )
				return app.render_authors();
			if( $(this).data('resource') == "author" )
				return app.render_taxonomy( $(this).data("id"), 'autor', '.view', 'archive' );

			// Single
			if( $(this).hasClass("single-column") )
				return app.render_column($(this).data('id'));
			if( $(this).hasClass("single-podcast") )
				return app.render_podcast($(this).data('id'));
		});

		//-----------------------------
		//
		// Keyboard events for iOS
		//
		//-----------------------------
		var initialViewHeight = document.documentElement.clientHeight;
		var calculate = null;

		/*** Fix keyboard defaults ***/
		if(typeof Keyboard != 'undefined'){
			console.log("Keyboard not undefined");
			Keyboard.disableScrollingInShrinkView(false);
			Keyboard.shrinkView(false);
		}

		if($('#container').hasClass("chat")){
			/*** Fix keyboard chat specifics ***/
			if(typeof Keyboard != 'undefined'){
				Keyboard.disableScrollingInShrinkView(true);
				Keyboard.shrinkView(true);
			}
		}

		var fixWithKeyboard = function(){
			$('body').addClass("openkeyboard");
			if($('#container').hasClass("chat")){

				calculate = (!calculate) ? document.documentElement.clientHeight : calculate;			
				$('#container').animate({ height: calculate+"px"}, 240, 'swing', function(){
					$('.escribir').slideToggle('fast');
				});
				return;
			}
			
		}

		window.openKeyboard = false;

		/* Keyboard shown event */
		window.addEventListener('keyboardDidShow', function () {
			
			$('.escribir').hide();
			window.openKeyboard = true;
			return fixWithKeyboard();
		});

		/* Keyboard hidden event */
		window.addEventListener('keyboardDidHide', function () {
			window.openKeyboard = false;
			$('body').removeClass("openkeyboard");
			$('body').scrollTop($('#messages-list').prop('scrollHeight'));
			$('.escribir').css('bottom', 0);
		});

	});

}
