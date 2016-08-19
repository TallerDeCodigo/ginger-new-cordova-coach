!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var ret,event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null!==options.pinchThreshold?pinchDistance>=options.pinchThreshold:!0}function validateSwipeTime(){var result;return result=options.maxTimeThreshold?!(duration>=options.maxTimeThreshold):!0}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&DOUBLE_TAP_THRESHOLD>distance}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){return maximumsMap[direction]?maximumsMap[direction].distance:void 0}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return 1>pinchZoom?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return 0>angle&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return 45>=angle&&angle>=0?LEFT:360>=angle&&angle>=315?LEFT:angle>=135&&225>=angle?RIGHT:angle>45&&135>angle?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.15",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(this,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(this,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});
$( function() {
	if($('body').hasClass('dieta') ){
		console.log("has class");
	  	$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});
	  	$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});
	}
});//end function 


$(window).on("load resize",function(){

	var ancho = document.documentElement.clientWidth;
	var alto = document.documentElement.clientHeight;
	$('.list-platos #scroller > ul > li').css("height",alto-148); 
	$('#toda_la_dieta > li').css("height",alto-100);
	$('.iosm #toda_la_dieta > li').css("height",alto-120);
});// end window on load

$(window).load(function(){
	$(function() {

		var coach_type 		= [ 'Estricto','Innovador', 'Animador', 'Tradicional'];
		var restricciones 	= [ 'Huevos', 'Pollo', 'Pescado', 'Mariscos', 'Lacteos', 'Carne' ];
		var objetivo 		= [ 'adelgazar','detox','bienestar','rendimiento' ];
		var sex 			= ['Hombre','Mujer'];
		var tipo_de_ingredientes = [ 'granosycereales', 'verduras', 'grasas', 'lacteos', 'proteinaanimal', 'leguminosas', 'nuecesysemillas', 'frutas', 'endulzantes', 'aderezosycondimentos', 'superfoods', 'liquidos'];


		if($('body').hasClass('has-home'))
		{

			var coach = JSON.parse(localStorage.getItem('user'));

			console.log('Hello ' +coach.nombre);

			$('.titulo').html(coach.nombre);
		}
		
		/**
		 *
		 * Lista de Usuarios de Coach
		 *
		 **/

		if($('body').hasClass('has-usuarios') ){

			//Request to Service Diets

			var responsedata = apiRH.getUsuarios();

			console.log(JSON.stringify(responsedata));

			var user = responsedata;

			//Loop the feed



			var i = 0;

			$.each(user, function( key, value ) {
				
				console.log(i + " - " + value);
				
				$('.list-users').append("<li class='usuario-item' data='" + JSON.stringify(user[i]) + "'><h2>" + user[i].nombre + " " + user[i].apellido + "</h2><a class='bubble notificaciones'>3</a><a class='bubble mensajes'>3</a></li>");

				i++;
			});

		}


		if($('body').hasClass('has-user') ){

			var item = localStorage.getItem('user-selected');
			//console.log(item);

			var user = JSON.parse(item);
			//console.log(user);

			var fecha = new Date();

			console.log(user.perfil.fechaNacimiento + '::::' + fecha.toString());

			var edad = app.restaFechas(user.perfil.fechaNacimiento, fecha.toString());

			

			console.log(edad);
			

			$('.cpur').html(user.nombre + ' ' + user.apellido);	
			
			$('.user_dieta').html(user.dieta.nombre);
			
			$('.user_sexo').html(sex[user.perfil.sexo]);
			$('.user_edad').html('');
			$('.user_cp').html(user.cp);
			$('.user_estatura').html(user.perfil.estatura + ' m');
			$('.user_peso').html(user.perfil.peso + ' kg.');
			$('.user_pesoideal').html(user.pesoDeseado + ' kg.');
			$('.user_coachtype').html(coach_type[user.perfil.personalidad]);
			$('.user_dpw').html(user.perfil.ejercicio + ' días por semana');

			var separador = '';

			for (var i = 0; i < user.perfil.restricciones.length; i++) {
				user.perfil.restricciones[i]
				if(i == user.perfil.restricciones.length -1){
					separador = '';	
				}else{
					separador = ', ';
				}

				$('.user_restricciones').html(restricciones[user.perfil.restricciones[i]] + separador);
			};
			
			
			$('.user_comentario').html(user.comentarios);

			for (var i = 0; i < user.perfil.objetivo.length; i++) {
				user.perfil.objetivo[i]
				if(i == user.perfil.objetivo.length -1){
					separador = '';	
				}else{
					separador = ', ';
				}

				$('.user_plan').html(objetivo[user.perfil.objetivo[i]] + separador);
			};

			

			console.log(JSON.parse(item));

			//Acceder a los elementos para poder x

			//$('').append('');

		}

		/**
		 *
		 * Lista de Dietas de Coach
		 *
		 **/

		if($('body').hasClass('has-dietas') ){

			//Request to Service

			var responsedata = apiRH.getDiets();

			//console.log(JSON.stringify(responsedata));

			var diet = responsedata;

			//Loop the feed

			var i = 0;

			$.each(diet, function( key, value ) {
				
				console.log(i + " - " + value);
				
				var nombre = 'no-name';
				var descripcion = '';
				var _id = ''

				$.each(value, function( key, value ) 
				{

					if(key == 'nombre'){
						console.log(value);
						nombre = value;
					}

					if(key == '_id'){
						console.log(value);
						_id  = value;
					}

					if(key == 'descripcion'){
						console.log(value);
						descripcion = value;
					}
					
				});

				$('.list-diet').append('<li class="elemento-dieta" data="' + _id + '"><h2> ' + nombre + ' </h2><p>' + descripcion + '</p><nav><a href="copiar-dieta.html"><img class="btn_copy" data="' + _id + '" src="images/copy.png"></a><a href="dieta.html"><img class="btn_edit" data="' + _id + '" src="images/edit.png"></a><a href="#"><img class="btn_delete" data="' + _id + '" src="images/delete.png"></a></nav></li>');

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

			$('.btn_delete').click(function () {
				console.log('delete');
				var idDelete = $(this).attr('data');
				var response = apiRH.deleteDiet(idDelete);

				alert(response);

				if(response){
					console.log('DELETE OK: ' + response);
				}

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

				if(d_nombre.length < 4)
					return;
				if(d_comentario.length < 4)
					return;

				//REQUEST TO GET DIET

				window.location.assign('dieta.html');
				
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

			var dieta = app.get_diet('?_id='+ localStorage.getItem('dOperator'));
			console.log('ID DIET: ' + dieta._id);

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
						 	losplatos[i][3]=value;
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
												
												$(masadentro + ' nav svg').attr("data", JSON.stringify(losplatos[i]));

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

				$('.delete').click(function (e) {
					var pdel = $(this).attr('data');
					console.log('here ' + $(this).attr('data') );
					//delete dieta.estructura[pdel];
					console.log(arrDieta);
				});

			}	
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

				$('.list-dish').append('<li class="platillo-item"><h2>' + dish[i].descripcion + '</h2><p>' + dish[i].receta + '</p></li>');	

				i++;	

			});

			$('.btn-platillo').click(function(){

				var is_public = $(this).attr('data');

				var responsedata = apiRH.listDishes(is_public);

				var i = 0;
				$('.list-dish').html('');
				$.each(responsedata, function( key, value ) {
					$('.list-dish').append('<li class="platillo-item" data="' + dish[i] + '"><h2>' + dish[i].descripcion + '</h2><p>' + dish[i].receta + '</p></li>');	

					i++;	

				});
			});

			$('.add').click(function () {
				
				localStorage.setItem('dishSelected', '');

			});

		}


		if($('body').hasClass('has-create-platillo')){

			var arrIngredientes;

			$('add').click(function () {
				
				var is_public 		= $('').attr('');
				var has_name 		= $('textarea#descripcion').val();
				var has_receta 		= $('textarea#receta').val();
				var has_comentarios 	= $('textarea#comentario').val();
				var has_ingredients 	= '';

				var json = {
					"descripcion" : has_name,
					"receta" : has_receta,
					"coach" : localStorage.getItem('userId'),
					"autorizado" : 0,
					"publico" : is_public,
					"comentarios" : has_comentarios,
					"ingredientes" : arrIngredientes 
				};

				var response = apiRH.newDish(json);

				if(response)
					alert(response);
				else
					alert('error new dish');

			});


		}


		if($('body').hasClass('has-ingredients') ){
			
			$( ".accordion1" ).accordion({collapsible:true,active:false,animate:200,heightStyle:"content"});

			var responsedata = apiRH.listIngredient();

			var ingrediente = responsedata;

			console.log(responsedata);


			var i = 0;
			var j = 0;

			var arrAux = [];


			$.each(ingrediente, function( key, value ) {


			   $('.' + tipo_de_ingredientes[value.categoria] + '').append('<li><span class="cantidad"></span><span class="ingred-name">'+ value.nombre +'</span><input type="checkbox" name="pan" value=""></li>');	
				 
							
				console.log(tipo_de_ingredientes[value.categoria]);

				console.log(key + '::' + value.categoria);

				
				j++;	

			});
		}

/*
	CREAR INGREDIENTES
*/
		if($('body').hasClass('has-create-ingredient') ){

			var i_nombre;
			var category = -1;
			var tipo = -1;	
			var medida = -1;
			
			$('.add').click(function(){
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
					alert(response);
					window.location.assign('ingredientes.html');

				}
				else
					alert('error');


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

				$('.list-diets').append('<li class="dieta-item"><h2>' +  diet[i].nombre + '</h2><p>' + diet[i].descripcion + '</p><div class="columna"><h3 class="cgre">100%</h3><a href="#" class="btn-pur" data-id="' +  diet[i]._id + '">Cambiar Dieta</a></div></li>');	

				i++;	

			});

			

		}

		if($('body').hasClass('coperfil'))
		{

			
			console.log(JSON.stringify(localStorage.getItem('user')));

			var pUser = JSON.parse(localStorage.getItem('user'));
			$('.la_img').attr('src','https://gingerfiles.blob.core.windows.net/coaches/' + pUser._id + '.png');
			$('.cpur').html(pUser.nombre + ' ' + pUser.apellido);
			$('.bio-coach').html(pUser.frase);

			//CALCULO DE LA ESTRELLAS DE MIERDA
			var star = Math.round(pUser.rating);

			console.log(Math.round(star));

			var count = 5;

			for (var i = 0; i < star; i++) {
				$('.rate-stars').append('<img src="images/starh.svg">');
				console.log(i);
				
			};
			
			for (var x = 0; x < count - star; x++) {
				console.log('-' + x);
				$('.rate-stars').append('<img src="images/star.svg">');
			};


			var coach_type = [ 'Estricto','Innovador', 'Animador', 'Tradicional'];
			var personalidades = pUser.personalidad;
			var separador = "";

			for(var p=0; p<personalidades.length; p++){

				console.log(personalidades.length);
				if(p == personalidades.length - 1){
					separador = "";

				}else{
					separador = ", ";
				}
				$('#coach_type_perfil').append(coach_type[p] + separador);
			}

			$('#blog').click(function(){
				cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
			});

			

		}

		if($('body').hasClass('has-finanzas'))
		{
			var hoy = new Date();

			console.log("MES: " + (hoy.getMonth() + 1));

			var month = hoy.getMonth();
			var dia = hoy.getDate();
			var pdia = 1;

			var totalAmount = 0;
			var totalDays 	= 0;
			
			console.log(dia);

			var responsedata = apiRH.getFinanzas(hoy.getMonth() + 1);
			var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
			$('.mes').html(meses[month]);

			$('.btn_right').click(function(){
				month++;

				
				if(month > 11){
					month = 0;
				}
				$('.mes').html(meses[month]);
				console.log(meses[month] );

				responsedata = apiRH.getFinanzas(month + 1);
			});

			$('.btn_left').click(function(){
				month--;
				if(month < 0){
					month = 11;
				}
				$('.mes').html(meses[month]);
				console.log(meses[month] );

				responsedata = apiRH.getFinanzas(month + 1);

			});

			var finanzas = responsedata;
			console.log(finanzas);

			var i = 0;

			$.each(finanzas, function( key, value ){

				$('.record').append('<tr><td>' + finanzas[i].name + '</td><td>' + finanzas[i].days_since_subscription + '</td><td>' + finanzas[i].days_since_subscription + '</td><td>$' + number_format(finanzas[i].amount_this_month, 2) + '</td></tr>');	

				totalAmount = totalAmount + finanzas[i].amount_this_month;

				totalDays= totalDays+finanzas[i].days_since_subscription;

				console.log( totalAmount + ' - ' +  totalDays);

				i++;

			});

			//TOTALES
			$('.totalAcumulado').html(number_format(totalAmount,2));
			$('.total').html(totalDays);

			//FECHAS DE INICIO
			$('.inicio').html(pdia);
			$('.final').html(dia + ' de ' + meses[month] );

		}//	END HAS CLASS FINANZAS


		function number_format(amount, decimals) {

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
			$(this).parent().find('.los_ing').toggle();
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


		if($('body').hasClass('has-chat-list') ){
				console.log(currentUser);
				var userLog = JSON.parse(localStorage.getItem('user'));


				var user = { login : userLog.mail, pass : userLog.chatPassword};
				
				connectToChat(user);

				$('.attach').click(function(){
					$('input[name="galeria"]').trigger('click');

				});

				$('.list-gorup-item').click(function(){
					$('#dialog-list').hide();$('.menu-bar').hide();$('.escribir').show();
				});

		}//end IF body has class
		

		$('.usuario-item').click(function(){

			console.log($(this).attr("data"));

			var json = $(this).attr("data");

			//var pJson = JSON.parse(json);

			localStorage.setItem('user-selected', json);

			window.location.assign('usuario.html');

		});

		$('.bt-review').click(function(){
			window.location.assign('lista-dietas.html');
		});

		// $('.bt-review').click(function(){
		// 	window.location.assign('dietas.html');
		// });	


		$('.btn-pur').click(function(){
			var dietSelected = $(this).attr("data-id");
			console.log('CLICK CHANGE: ' + dietSelected);

			//REQUEST TO CHANGE DIET


		});	
		

	});

});
/*END WINDOW ON LOAD*/

(function($){

	"use strict";

	$(function(){

		console.log('hello from functions.js');

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

})(jQuery); //End function


