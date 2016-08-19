!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var ret,event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null!==options.pinchThreshold?pinchDistance>=options.pinchThreshold:!0}function validateSwipeTime(){var result;return result=options.maxTimeThreshold?!(duration>=options.maxTimeThreshold):!0}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&DOUBLE_TAP_THRESHOLD>distance}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){return maximumsMap[direction]?maximumsMap[direction].distance:void 0}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return 1>pinchZoom?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return 0>angle&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return 45>=angle&&angle>=0?LEFT:360>=angle&&angle>=315?LEFT:angle>=135&&225>=angle?RIGHT:angle>45&&135>angle?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.15",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(this,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(this,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});



$( function() {

	var anchot = document.documentElement.clientWidth;

var CREDENTIALS = {
	appId: 28287,
	authKey: 'XydaWcf8OO9xhGT',
	authSecret: 'JZfqTspCvELAmnW'
};

/*EDAD*/
	var minval_age = 15; 
	var maxval_age = 90;
	var rango_age = maxval_age-minval_age;
	if ($('.pagina').hasClass('aboutyou')) {
		var gridag = ((anchot*0.7)-30)/rango_age;
	} else {
		var gridag = ($('.age .drag-parent').width()-30)/rango_age;
	}
    $('#age').draggable({ containment:"parent",axis:"x",grid:[gridag,gridag],drag:function(){
    	var percent = $('.age .drag-parent').width()-30;
    	var donde = Math.round(((($('#age').position().left)*rango_age)/percent)+minval_age);
    	$("#age-filler").css("width",$('#age').position().left+20);
    	$('#age-dato').html(donde);
    	$('#edad_value').attr("value", donde);
      }
  	});


/*DPW*/
  	var minval_eje = 0; 
	var maxval_eje = 7;
	var rango_eje = maxval_eje-minval_eje;
	if ($('.pagina').hasClass('aboutyou')) {
		var gridej = ((anchot*0.7)-30)/rango_eje;
	} else {
		var gridej = ($('.exercise .drag-parent').width()-30)/rango_eje;
	}
    $('#ejercicio').draggable({ containment:"parent",axis:"x",grid:[gridej,gridej],drag:function(){
    	var percent = $('.exercise .drag-parent').width()-30;
    	var donde = Math.round(((($('#ejercicio').position().left)*rango_eje)/percent)+minval_eje);
    	$("#ejercicio-filler").css("width",$('#ejercicio').position().left+20);
    	$('#ejercicio-dato').html(donde);
    	$('#days_per_week').attr("value", donde);
      }
  	});


/*MEDIDAS*/
  	var minval_med = 0; 
	var maxval_med = 70;
	var rango_med = maxval_med-minval_med;
  	var gridme = ($('.medida .drag-parent').width()-30)/rango_med;
    $('#medida').draggable({ containment:"parent",axis:"x",grid:[gridme,gridme],drag:function(){
    	var percent = $('.medida .drag-parent').width()-30;
    	var donde = Math.round(((($('#medida').position().left)*rango_med)/percent)+minval_med);
    	$("#medida-filler").css("width",$('#medida').position().left+20);
    	$('#medida-dato-span').html(donde);
    	$('#medida-dato').attr('value',donde);
      }
  	});


/*
	localStorage MEDIDAS / MEASURED AREA
*/
  	$('#add_medidas').on('click', function(){
  		
  		localStorage.setItem( 'medidas', $('#medida-dato').val() );
  		localStorage.setItem('measured_area', $('#measured_area').val() )

  		var medidas = localStorage.getItem('medidas');
  		var area = localStorage.getItem('measured_area');
  		console.log(medidas+" "+ area);

  	});



/*HORAS MINUTOS*/
  	var minval_hora = 0; 
	var maxval_hora = 16;
	var rango_hora = maxval_hora-minval_hora;
  	var gridhr = ($('.horaeje .drag-parent').width()-30)/rango_hora;
    $('#horaeje').draggable({ containment:"parent",axis:"x",grid:[gridhr,gridhr],drag:function(){
    	var percent = $('.horaeje .drag-parent').width()-30;
    	var donde = Math.round(((($('#horaeje').position().left)*rango_hora)/percent)+minval_hora);
    	$("#horaeje-filler").css("width",$('#horaeje').position().left+20);
    	var hora = (donde/4);
    	hora = hora.toString().substr(0,1);
    	var minutos = (donde/4)*60;
    	if (minutos>179) {
    		minutos = minutos-180;
    	} else if (minutos>119) {
    		minutos = minutos-120;
    	} else if (minutos>59) {
    		minutos = minutos-60;
    	}
    	if (minutos==0 || minutos==60) {
    		minutos="00";
    	}
    	$('#horaeje-dato').html(hora+":"+minutos);
    	$('#duracion').attr("value", hora+":"+minutos);
      }
  	});

  	var minval_int = 0; 
	var maxval_int = 3;
	var rango_int = maxval_int-minval_int;
  	var gridin = ($('.inteje .drag-parent').width()-30)/rango_int;
    $('#inteje').draggable({ containment:"parent",axis:"x",grid:[gridin,gridin],drag:function(){
    	var percent = $('.inteje .drag-parent').width()-30;
    	var donde = Math.round(((($('#inteje').position().left)*rango_int)/percent)+minval_int);
    	$("#inteje-filler").css("width",$('#inteje').position().left+20);
    	var text_int;
    	switch (donde) {
    	    case 0:
    	        text_int = "baja";
    	        break;
    	    case 1:
    	        text_int = "moderada";
    	        break;
    	    case 2:
    	        text_int = "alta";
    	        break;
    	    case 3:
    	        text_int = "extrema";
    	        break;
    	}

    	$('#intensidad').attr('value',text_int);

    	switch ($('#intensidad').val() ) {
    	    case 'baja':
    	        $('#intensidad').attr('value','0');
    	        break;
    	    case 'moderada':
    	        $('#intensidad').attr('value','1');;
    	        break;
    	    case 'alta' :
    	        $('#intensidad').attr('value','2');
    	        break;
    	    case 'extrema' :
    	        $('#intensidad').attr('value','3');
    	        break;
    	}
    	$('#inteje-dato').html(text_int);
      }
  	});

  	$( ".accordion" ).accordion({collapsible:true,active:false,animate:300,heightStyle:"content"});

} );

$(window).on("load resize",function(){ 

	var alto = document.documentElement.clientHeight;

	$('#scroller > ul > li').css("height",alto-245);
	$('.iosm #scroller > ul > li').css("height",alto-265);

	var cuantos = $('.co-option').length;
	cuantos = cuantos*105;
	$(".tipo_coach").css("width",cuantos);

	var cuantos1 = $('.pl-option').length;
	cuantos1 = cuantos1*105;
	$(".tipo_plan").css("width",cuantos1);

	var cuantos2 = $('.re-option').length;
	cuantos2 = cuantos2*105;
	$(".tipo_restric").css("width",cuantos2);

	var cuantos3 = $('.ej-option').length;
	cuantos3 = cuantos3*105.25;
	$(".tipo_ejer").css("width",cuantos3);

	var cuantos4 = $('.me-option').length;
	cuantos4 = cuantos4*105;
	$(".tipo_med").css("width",cuantos4);

	var ancho = document.documentElement.clientWidth;
	var tamano = $('.slide-coach').length;
	var csld = (tamano*ancho*0.8125)+(ancho*0.09375);
	$(".slide-coach").css("width",ancho*0.8125);
	$(".slide-coach:first-of-type").css("margin-left",ancho*0.09375);
	$(".cslider").css("width",csld);

/*

	ENVIA MENSAJE AL ADMIN PARA AUTORIZAR CAMBIO DE COACH

*/
	var msg;
	var msg_return
	$('#write_ch_coach').on('click', function(){
		msg = $('#msg_ch_coach').val();
		localStorage.setItem('msg_ch_coach', msg);
		msg_return = localStorage.getItem('msg_ch_coach');
		if(msg_return != "undefined" || msg_return != "" || msg_return != null){
			$('#espacio_comentario').html(msg_return);
		}
	});

	$('#send_ch_coach').on('click', function(){
		
		if(msg_return == ""){
			alert("Para poder cambiar de coach, es necesario que agregues tus comentarios");
		}else{
			console.log(msg_return);
		}
	});
/*
	ADD PROFILE DATA TO PROFILE VIEWS
*/


if($('body').hasClass('load_data') || $('body').hasClass('update_data')){

	var nombre 			= localStorage.getItem('user_name');
	var apellido 		= localStorage.getItem('user_last_name');
	var sexo 			= localStorage.getItem('genero');
	var edad 			= localStorage.getItem('edad');
	var cp 	 			= localStorage.getItem('zipcode');
	var estatura 		= localStorage.getItem('estatura');
	var peso 			= localStorage.getItem('peso');
	var ideal 			= localStorage.getItem('peso_ideal');
	var coach_type 		= localStorage.getItem('coach_type');
	var frecuencia 		= localStorage.getItem('dpw');
	var restricciones 	= localStorage.getItem('restricciones');
	var plan 			= localStorage.getItem('coach_type');
	var comentario 		= localStorage.getItem('comentarios');


	console.log("nombre > "	 		+nombre);
	console.log("sexo > "	 		+sexo);
	console.log("edad > "	 		+edad);
	console.log("cp > "		 		+cp);
	console.log("estatura > "		+estatura);
	console.log("peso > "	 		+peso);
	console.log("ideal > "	 		+ideal);
	console.log("coach_type > "		+coach_type);
	console.log("frecuencia > "		+frecuencia);
	console.log("restricciones > "	+restricciones);
	console.log("plan > "			+plan);
	console.log("comentario > "		+comentario);

	$('.cpur').html(nombre +" "+ apellido);
	$('.edit-profile span').html(nombre +" "+ apellido);

	if(sexo == 0){
		$('#sexo_perfil').html('Mujer');
	}else{
		$('#sexo_perfil').html('Hombre');
	}

	$('#anos_perfil').html(edad + " años");
	$('#age-dato').html(edad);

	$('#cp_perfil').html(cp);
	$('input[name="zipcode"]').attr("value",cp);


	$('#estatura_perfil').html(estatura + " m.");

	$('input[name="estatura"]').attr("value", estatura);


	$('#peso_perfil').html(peso + " kg.");
	$('input[name="peso"]').attr("value", peso);

	$('#ideal_perfil').html(ideal + " kg.");
	$('input[name="ideal"]').attr("value", ideal);

	var suma = parseInt(coach_type)+1;
	console.log('suma '+suma);
	console.log('coach type> '+ coach_type);

	//$('.tipo_coach .co-option:nth-of-type('+suma+')').addClass('active');

	switch(coach_type){
			case '0': 
				$('#coach_type_perfil').html("Estricto");
				$('.co-option.active img:not(.question)').attr("src",'images/coach/estricto2.png');
				break;
			case '1':
				$('#coach_type_perfil').html("Innovador");
				$('.co-option.active img:not(.question)').attr("src",'images/coach/innovador2.png');
				break;
			case '2':
				$('#coach_type_perfil').html("Animador");
				$('.co-option.active img:not(.question)').attr("src",'images/coach/animador2.png');
				break;
			case '3':
				$('#coach_type_perfil').html("Tradicional");
				$('.co-option.active img:not(.question)').attr("src",'images/coach/tradicional2.png');
				break;
		}
	$('#frecuencia_perfil').html(frecuencia +" días por semana");
	$('#ejercicio-dato').html(frecuencia);

	$('#comentario_perfil').html(comentario);
	$('.the-comment').html(comentario);


//$('.tipo_plan .pl-option:nth-of-type('+suma+')').addClass('active');
	console.log("plan> "+plan);
	var suma = parseInt(plan)+1;
	console.log('suma '+plan);


		switch(plan){
			case "1":
			$('#plan_perfil').html("Adelgazar");
			$('.pl-option.active img:not(.question)').attr("src",'images/plan/perderpeso2.png');
			//console.log('adelgazar');
			break;
			case "2":
			$('#plan_perfil').html("Detox");
			$('.pl-option.active img:not(.question)').attr("src",'images/plan/detox2.png');
			//console.log('detox');
			break;
			case "3":
			$('#plan_perfil').html("Sentirse mejor");
			$('.pl-option.active img:not(.question)').attr("src",'images/plan/sentirsemejor2.png');
			//console.log('bienestar');
			break;
			case "4":
			$('#plan_perfil').html("Rendimiento físico");
			$('.pl-option.active img:not(.question)').attr("src",'images/plan/rendimientofisico2.png');
			//console.log('rendimiento');
			break;
		}
		var parseado = JSON.parse(restricciones);
		restricciones = parseado.join(", ");
		$('#restricciones_perfil').html(restricciones);
}//end if has class


	/* SWIPE COACH */	

    var IMG_WIDTH = ancho*0.8125;
	var currentImg = 0;
	var maxImages = tamano;
	var speed = 500;

	var imgs;

	var swipeOptions = { triggerOnTouchEnd: true, swipeStatus: swipeStatus, allowPageScroll: "vertical", threshold: 75 };

	$(function createSwipe () {
	    imgs = $(".cslider");
	    imgs.swipe(swipeOptions);
	}); //end createSwipe

	function swipeStatus(event, phase, direction, distance) {
	    if (phase == "move" && (direction == "left" || direction == "right")) {
	        var duration = 0;

	        if (direction == "left") {
	            scrollImages((IMG_WIDTH * currentImg) + distance, duration);
	            
	        } else if (direction == "right") {
	            scrollImages((IMG_WIDTH * currentImg) - distance, duration);
	        }

	    } else if (phase == "cancel") {
	        scrollImages(IMG_WIDTH * currentImg, speed);
	    } else if (phase == "end") {
	        if (direction == "right") {
	            previousImage();
	        } else if (direction == "left") {
	            nextImage();
	        }
	    }
	} //end swipeStatus

	function previousImage() {
	    currentImg = Math.max(currentImg - 1, 0);
	    scrollImages(IMG_WIDTH * currentImg, speed);
	}//end previousImage

	function nextImage() {
	    currentImg = Math.min(currentImg + 1, maxImages - 1);
	    scrollImages(IMG_WIDTH * currentImg, speed);
	}//end nextImage

	function scrollImages(distance, duration) {
	    imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");
	    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
	    imgs.css("transform", "translate(" + value + "px,0)");
	}//end scrollImages
});// end Window on Load Resize

$(window).load(function(){
	$(function() {

if($('body').hasClass('dieta') ){

var today = new Date();
var hoy = today.getDay();
var day_index;
var dieta = app.get_diet(localStorage.getItem('dieta'));

var arr_desayuno
var arr_snack1
var arr_comida
var arr_snack2
var arr_cena

var comm_id;
var platillo_id;
var comentarios = dieta.comentarios;
var comments;
var platillos = dieta.platillos;
var receta;
var nombre_receta;
var ingredientes;

//console.log('DIETA');
//console.log(JSON.stringify(dieta));

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

// console.log(losplatos);

// console.log('DIETA');
// console.log(JSON.stringify(dieta));

var dieta_array = [];

var dia_prueba=0;

var dias = [];

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
			var masadentro = dentrode+'div.platillo:nth-of-type('+i+')';
			i++;	
			$.each( value, function( key, value ) {
				// opciones (a,b)
				if ( key=="b" && localStorage.getItem("restricciones") ) {
					// b
					$.each( value, function( key, value ) {
						// id_platillo, id_comentario
						if (key=="platillo") {				
							for (var i = 0; i < losplatos.length; i++) {
								if (value==losplatos[i][0]) {
									// console.log(losplatos[i][1]+"<"+losplatos[i][2]+"<"+losplatos[i][4]);
									$(masadentro).attr("data", losplatos[i][0]);
									$(masadentro+' h5').html(losplatos[i][1]);
									if (losplatos[i][2]!="") {
										$(masadentro+' p.receta').html(losplatos[i][2]);
									} else {
										$(masadentro+' p.receta').hide();
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
				} else {
					// a
					$.each( value, function( key, value ) {
						// id_platillo, id_comentario
						if (key=="platillo") {
							for (var i = 0; i < losplatos.length; i++) {
								if (value==losplatos[i][0]) {
									// console.log(losplatos[i][1]+"<"+losplatos[i][2]+"<"+losplatos[i][4]);
									$(masadentro).attr("data", losplatos[i][0]);
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
				}

			});
		});
	});
});

$('.platillo').each(function() {
    if ($(this).attr('data') === undefined) {
      $(this).remove();
    }
});


	// var array = [];
	// array.push(dish);

	// console.log("array> "+array);

	// console.log('------------------------');

	
	// var arr = Object.keys(dieta.estructura.domingo.cena).map(function(k) { return dieta.estructura.domingo.cena[k] });	
	
	// console.log(arr);



	/** 	

		DIETA - CALENDAR 

	**/
	
	// OBTIENE EL NUMERO DE LA SEMANA EN LA QUE NOS ENCONTRAMOS 
	Date.prototype.getWeek = function() {
        var eneroUno = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - eneroUno) / 86400000) + eneroUno.getDay() + 1) / 7);
    }

    //OBTIENE LA FECHA DE HOY EN FULL FORMAT
    Date.prototype.hoy = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();

      return [this.getFullYear(), !mm[1] && '/' + '0', mm, !dd[1] && '/', dd].join('');
    };

    var fecha = new Date();
    var weekNumber = (new Date()).getWeek();
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	var dias = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

	//console.log(weekNumber);
  	var ano = fecha.getFullYear();
  	var mes = meses[fecha.getMonth()];
  	 console.log(fecha.hoy());

/*
	IMPRIME EL MES Y EL ANO EN EL HEADER DE LA PANTALLA
*/
    	$('#month').html(mes);
    	$('#year').html(ano);

    function getWeekDays(fromDate){
     var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay())),result = [new Date(sunday)];
     while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) {
      result.push(new Date(sunday));
     }
     return result;
    }

    var week = new Object();
    var algo = fecha.hoy().toString();
    console.log(typeof algo); 
    week = getWeekDays( new Date(algo) );

    //console.log(week);
    var days = $('.day_of_week');
    var dow = [];
    var str;
    var d = new Date();
    var date_string;
    for(var i=0; i<dias.length; i++){
    	var masuno = i+1;
    	date_string = week[i].toString();
    	$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
    }

    	var incremento = 168;
		var current_day;
    	var full_date;
	    current_day = new Date( + new Date().getTime() );
	    current_day = fecha.hoy().substring(8);
	    var left = fecha.hoy().substring(0,8);

	    current_day = parseInt(current_day) +7;
	    current_day = left + current_day; 
	    console.log(current_day);
	    week = getWeekDays( new Date( current_day ) );


		$(".nextweek").click(function(){
	    	full_date = new Date( + new Date( current_day ).getTime() + incremento * 60 * 60 * 1000);
	    	for(var i=0; i<dias.length; i++){
	    		var masuno = i+1;
	    		date_string = week[i].toString();
	    		$('tr td.day_of_week:nth-of-type('+masuno+') span').html(date_string.substring(8, 11));
	    	}
	    	if(full_date.getMonth() != current_day.getMonth()){
	    		$('#month').html(meses[full_date.getMonth()] );
	    	}

	    	if(full_date.getFullYear() != current_day.getFullYear()){
	    		$('#year').html(full_date.getFullYear() );
	    	}
	    	
	    	current_day = full_date;
	    	console.log("Full date > > "+full_date);
	    	var week2 = getWeekDays( new Date( "'" + full_date + "'" ) );
			for(var i=0; i<dias.length; i++){
		    	dow[i] = week2[i].toString().slice(8, 11);
		    	var masuno = i+1;
		    	//console.log(dow[i]);
		    	$('tr td.day_of_week:nth-of-type('+masuno+') span').html(dow[i]);
		    }


		});

		$(".lastweek").click(function(){
			//debe tomar el ultmo dia en el que se encuentra para retroceder a partir de ese punto en el tiempo
	    	
	    	full_date = new Date(new Date( "'" + current_day + "'" ).getTime() - incremento * 60 * 60 * 1000);

	    	if(full_date.getMonth() != current_day.getMonth()){
	    		$('#month').html(meses[full_date.getMonth()] );
	    	}

	    	if(full_date.getFullYear() != current_day.getFullYear()){
	    		$('#year').html(full_date.getFullYear() );
	    	}

	    	current_day = full_date;
	    	//console.log("Full date > > "+full_date);
	    	var week2 = getWeekDays( new Date( "'" + full_date + "'" ) );
			
			// if(){
				for(var i=0; i<dias.length; i++){
			    	dow[i] = week2[i].toString().slice(8, 11);
			    	var masuno = i+1;
			    	//console.log(dow);
			    	$('tr td.day_of_week:nth-of-type('+masuno+') span').html(dow[i]);
			    }
			// }
		});

}//end date ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var restricciones = new Array();

		$(".acc-selector").click(function(){
			if ($(this).hasClass('ui-state-active')) {
				if ($(this).hasClass('desayuno')) {$(this).parent().parent().animate({scrollTop:0}, 300);}
				if ($(this).hasClass('snack1')) {$(this).parent().parent().animate({scrollTop:54}, 300);}
				if ($(this).hasClass('comida')) {$(this).parent().parent().animate({scrollTop:120}, 300);}
				if ($(this).hasClass('snack2')) {$(this).parent().parent().animate({scrollTop:184}, 300);}
				if ($(this).hasClass('cena')) {$(this).parent().parent().animate({scrollTop:248}, 300);}
			}
		});

		$(".genre-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-1").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-1").hide();
        		$(".genre").show();
        		$(".genre").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".age-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-1").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-1").hide();
        		$(".age").show();
        		$(".age").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".zip-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-1").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-1").hide();
        		$(".zip").show();
        		$(".zip").animate({opacity:"1"}, 200);
        		$(".zip input").focus();
            }, 210);
		});

		$(".mido-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-2").hide();
        		$(".mido").show();
        		$(".mido").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".peso-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-2").hide();
        		$(".peso").show();
        		$(".peso").animate({opacity:"1"}, 200);
            }, 210);
		});

		$(".ideal-bt").click(function(){
			$(this).parent().find("a").removeClass('active');
			$(this).addClass('active');
			$(".sector-2").animate({opacity:"0"}, 200);
			setTimeout(function() {
        		$(".sector-2").hide();
        		$(".ideal").show();
        		$(".ideal").animate({opacity:"1"}, 200);
            }, 210);
		});

/*
	GENERO 	*
*/

		$("#hombre").click(function(){
			if ($(this).hasClass('edition')) {
				$('#mujer').attr("src","images/mujere.svg");
				$('#update_sexo').attr("value", '0');

			} else {
				$('#mujer').attr("src","images/mujer.svg");
				$('#mujer').attr("alt","");
			}
			$(this).attr({src: "images/hombreh.svg", alt: "1"});
			$('.type-def').attr("src","images/hombreh.svg");

			$('#update_sexo').attr("value", '1');
			

		});

 
		$("#mujer").click(function(){
			if ($(this).hasClass('edition')) {
				$('#hombre').attr("src","images/hombree.svg");
				$('#update_sexo').attr("value", '1');
			} else {
				$('#hombre').attr("src","images/hombre.svg");
				$('#hombre').attr("alt","");
			}

			$(this).attr({src: "images/mujerh.svg", alt: "1"});
			$('.type-def').attr("src","images/mujerh.svg");

			$('#update_sexo').attr("value", '0');

			
		}); //end click mujer



/*
	add_localStorage UPDATED PROFILE
*/

		$('#add_updated_profile').on('click', function(){

				var genero 		= localStorage.setItem('genero', 	  $('#update_sexo').val() );
				var edad 		= localStorage.setItem('edad', 		  $('#edad_value').val() );
				var zipcode 	= localStorage.setItem('zipcode', 	  $('input[name="zipocode"]').val() );
				var estatura 	= localStorage.setItem('estatura', 	  $('input[name="estatura"]').val() );
				var peso 		= localStorage.setItem('peso', 		  $('input[name="peso"]').val() );
				var peso_ideal 	= localStorage.setItem('peso_ideal',  $('input[name="ideal"]').val() );
				var coach_type 	= localStorage.setItem('coach_type',  $('#coach_type').val() );
				var dpw 		= localStorage.setItem('dpw', 		  $('#days_per_week').val() );
				var comentario 	= localStorage.setItem('comentarios', $('#comentar').val() );
				var plan 		= localStorage.setItem('coach_type',  $('#plan').val() );
				
				var json = {
				"sexo" : genero,
				"fechaNacimiento" : "1984-04-21",
				"perfil":{
					"fechaNacimiento" : "1984-04-21",
					"sexo" : genero,
					"peso" : peso,
					"estatura" : estatura,
					"ejercicio" : dpw,
					"objetivo" : plan,
					"restricciones" : JSON.parse(restricciones),
					"personalidad" : coach_type
				},
				"cp": zipcode,
				"pesoDeseado": peso_ideal,
				"comentario": comentario
			}

			var response = apiRH.updatePerfil(json);

			if(response) 
				window.location.assign('userdata.html');



		});	// end add uodated profile




		var timeout;
		var estatura;


		$("#estatura-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				estatura = Number($("#estatura-up").parent().parent().find('input').val());
		        estatura=estatura+0.01;
		        $("#estatura-up").parent().parent().find('input').val(estatura.toFixed(2));
		        $('input[name="estatura"]').attr("value", estatura);


		    }, 100);
		    return false;
		});

		$("#estatura-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#estatura-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				estatura = Number($("#estatura-dw").parent().parent().find('input').val());
		        estatura=estatura-0.01;
		        $("#estatura-dw").parent().parent().find('input').val(estatura.toFixed(2));
		        $('input[name="estatura"]').attr("value", estatura);
		    }, 100);
		    return false;
		});

		$("#estatura-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		var peso;

		$("#peso-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				peso = Number($("#peso-up").parent().parent().find('input').val());
				if (peso<99) {
					peso=peso+0.5;
		        	$("#peso-up").parent().parent().find('input').val(peso.toFixed(1));
		        	$('input[name="peso"]').attr("value", peso);
				} else {
					peso=peso+1;
		        	$("#peso-up").parent().parent().find('input').val(peso.toFixed(0));
				}
		    }, 100);
		    return false;
		});

		$("#peso-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#peso-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				peso = Number($("#peso-dw").parent().parent().find('input').val());
				if (peso<100.1) {
					peso=peso-0.5;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(1));
					$('input[name="peso"]').attr("value", peso);
				} else {
					peso=peso-1;
					$("#peso-dw").parent().parent().find('input').val(peso.toFixed(0));
				}
		    }, 100);
		    return false;
		});

		$("#peso-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		var ideal;

		$("#ideal-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				ideal = Number($("#ideal-up").parent().parent().find('input').val());
		        if (ideal<99) {
					ideal=ideal+0.5;
		        	$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(1));
		        	$('input[name="ideal"]').attr("value", ideal);
				} else {
					ideal=ideal+1;
		        	$("#ideal-up").parent().parent().find('input').val(ideal.toFixed(0));
				} 
		    }, 100);
		    return false;
		});

		$("#ideal-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#ideal-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				ideal = Number($("#ideal-dw").parent().parent().find('input').val());
		        if (ideal<100.1) {
					ideal=ideal-0.5;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(1));
					$('input[name="ideal"]').attr("value", ideal);
				} else {
					ideal=ideal-1;
					$("#ideal-dw").parent().parent().find('input').val(ideal.toFixed(0));
				}
		    }, 100);
		    return false;
		});

		$("#ideal-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		var agua;

		$("#agua-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				agua = Number($('.vaso p span').html());
				agua=agua+0.5;
	        	$('.vaso p span').html(agua.toFixed(1));
	        	$('input[name="litros"]').attr("value", agua);
		    }, 100);
		    return false;
		});

		$("#agua-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#agua-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				agua = Number($('.vaso p span').html());
				if (agua>0.4) {
					agua=agua-0.5;
		        	$('.vaso p span').html(agua.toFixed(1));
		        	$('input[name="litros"]').attr("value", agua);
				}
		    }, 100);
		    return false;
		});

		$("#agua-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});


/*
	localStorage AGUA
*/
		$('#add_agua').on('click', function(){
			localStorage.setItem('agua', $('input[name="litros"]').val() );

			var agua = localStorage.getItem('agua');

			console.log(0 + ' -+- ' + agua);

			var responsedata = apiRH.tracking(0, 1);

			console.log(responsedata);

			if(responsedata)
				window.location.assign('dieta.html');

		});

		var r_peso;

		$("#r_peso-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				r_peso = Number($('.r_peso p').html());
		        if (r_peso<99) {
					r_peso=r_peso+0.5;
		        	$('.r_peso p').html(r_peso.toFixed(1));
		        	$('input[name="track_peso"]').attr('value', r_peso);
				} else {
					r_peso=r_peso+1;
		        	$('.r_peso p').html(r_peso.toFixed(0));
		        	$('input[name="track_peso"]').attr('value', r_peso);
				}
		    }, 100);
		    return false;
		});

		$("#r_peso-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#r_peso-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				r_peso = Number($('.r_peso p').html());
				if (r_peso>0.4) {
					if (r_peso<100.1) {
						r_peso=r_peso-0.5;
						$('.r_peso p').html(r_peso.toFixed(1));
						$('input[name="track_peso"]').attr('value', r_peso);
					} else {
						r_peso=r_peso-1;
						$('.r_peso p').html(r_peso.toFixed(0));
						$('input[name="track_peso"]').attr('value', r_peso);
					}
				}
		    }, 100);
		    return false;
		});

		$("#r_peso-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});


/*
	localStorage PESO 	*
*/
		$('#add_peso').on('click', function(){
			localStorage.setItem('track_peso', $('input[name="track_peso"]').val() );

			var track_peso = localStorage.getItem('track_peso');
			console.log(track_peso);
		});



		var valor = 0;
		var animo = [ 'increible', 'feliz', 'bien', 'regular', 'triste', 'cansado', 'hambriento', 'frustrado', 'motivado' ];

		$("#animo-up").bind('touchstart', function(){
			timeout = setInterval(function(){
				if (valor < 8) {
					valor++;
				} else {
					valor = 0;
				}
		        $('.carita img').attr("src", "images/caras/"+animo[valor]+".svg");
		        if (animo[valor]=="increible") {
		        	$('.carita h4').html("increíble");
		        } else {
		        	$('.carita h4').html(animo[valor]);
		        }
		        

				$('#track_animo').attr("value", animo[valor]);

		        switch ($('#track_animo').val() ) {
		    	    case 'increible' :
		    	        $('#track_animo').attr("value", "0");
		    	        break;
		    	    case 'feliz' :
		    	        $('#track_animo').attr("value", "1");
		    	        break;
		    	    case 'bien' :
		    	        $('#track_animo').attr("value", "2");
		    	        break;
		    	    case 'regular' :
		    	        $('#track_animo').attr("value", "3");
		    	        break;
		    	    case 'triste' :
		    	        $('#track_animo').attr("value", "4");
		    	        break;    
		    	    case 'cansado' :
		    	        $('#track_animo').attr("value", "5");
		    	        break;   
		    	    case 'hambriento' :
		    	        $('#track_animo').attr("value", "6");
		    	        break;     
		    	    case 'frustrado' :
		    	        $('#track_animo').attr("value", "7");
		    	        break; 
		    	    case 'motivado' :
		    	        $('#track_animo').attr("value", "8");
		    	        break;
    	     	}

		        // 0 - 8 estados de animo

		    }, 150);
		    return false;
		});

		$("#animo-up").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});

		$("#animo-dw").bind('touchstart', function(){
			timeout = setInterval(function(){
				if (valor > 0) {
					valor--;
				} else {
					valor = 8;
				}
		        $('.carita img').attr("src", "images/caras/"+animo[valor]+".svg");
		        if (animo[valor]=="increible") {
		        	$('.carita h4').html("increíble");
		        } else {
		        	$('.carita h4').html(animo[valor]);
		        }

		        $('#track_animo').attr("value", animo[valor]);

		        switch ($('#track_animo').val() ) {
		    	    case 'increible' :
		    	        $('#track_animo').attr("value", "0");
		    	        break;
		    	    case 'feliz' :
		    	        $('#track_animo').attr("value", "1");
		    	        break;
		    	    case 'bien' :
		    	        $('#track_animo').attr("value", "2");
		    	        break;
		    	    case 'regular' :
		    	        $('#track_animo').attr("value", "3");
		    	        break;
		    	    case 'triste' :
		    	        $('#track_animo').attr("value", "4");
		    	        break;    
		    	    case 'cansado' :
		    	        $('#track_animo').attr("value", "5");
		    	        break;   
		    	    case 'hambriento' :
		    	        $('#track_animo').attr("value", "6");
		    	        break;     
		    	    case 'frustrado' :
		    	        $('#track_animo').attr("value", "7");
		    	        break; 
		    	    case 'motivado' :
		    	        $('#track_animo').attr("value", "8");
		    	        break;
    	     	}
		    }, 150);
		    return false;
		});

		$("#animo-dw").bind('touchend', function(){
		    clearInterval(timeout);
		    return false;
		});


/*
	localStorage ANIMO
*/
		$('#add_animo').on('click', function(){
			localStorage.setItem('track_animo', $('#track_animo').val() );

			var track_animo = localStorage.getItem('track_animo');
			console.log(track_animo);
		});


		$('#finish1').click(function(){
			$('.aboutyou').animate({opacity:"0",left:"-40px"}, 200);
			$('.bpur').removeClass('active');
			$('.bgre').addClass('active');

			//console.log($('#hombre').attr('alt') );

			if($('#hombre').attr('alt') == '1' ){
				$('#genre_value').attr('value', 1);
			}else{
				$('#genre_value').attr('value', 0);
			}


/*

	localstorage PERFIL

*/
	
			//Zipocode
			localStorage.setItem('zipcode', $('input[name="zipcode"]').val() );

			//genero
			localStorage.setItem('genero', $('#genre_value').val() );//hacerlo una condicional

			//estatura
			localStorage.setItem('estatura', $('input[name="estatura"]').val() );
			
			//peso
			localStorage.setItem('peso', $('input[name="peso"]').val() );
			
			//edad
			localStorage.setItem('edad', $('#edad_value').val() );
			
			//peso ideal
			localStorage.setItem('peso_ideal', $('input[name="ideal"]').val() );

			setTimeout(function() {
        		$(".pagina").hide();
        		$(".objetive").show();
        		$(".objetive").css("left","40px");
        		$(".objetive").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
            $(".back").show();
		});

		$('#finish2').click(function(){
			$('.objetive').animate({opacity:"0",left:"-40px"}, 200);
			$('.bgre').removeClass('active');
			$('.bred').addClass('active');
/*
	localStorage PLAN / COACH_TYPE
*/
			//plan
			localStorage.setItem('plan', $('#plan').val() );
			//coach_type
			localStorage.setItem('coach_type', $('#coach_type').val() );
			var plan 		= localStorage.getItem('coach_type', $('#plan').val() );
			var coach_type = localStorage.getItem('coach_type', $('#coach_type').val() );

			console.log(" plan> "+ plan+" coachType> "+ coach_type);

			setTimeout(function() {
        		$(".pagina").hide();
        		$(".exercise").show();
        		$(".exercise").css("left","40px");
        		$(".exercise").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('#finish3').click(function(){
			$('.exercise').animate({opacity:"0",left:"-40px"}, 200);
			$('.bred').removeClass('active');
			$('.borg').addClass('active');

/*
	localStorage FRECUENCIA DE EJERCICIO
*/
			//frecuencia de ejercicio
			localStorage.setItem('dpw', $('#days_per_week').val() );

			// var dpw = localStorage.getItem('dpw');
			// console.log(" dias por semana> > > "+dpw);

			setTimeout(function() {
        		$(".pagina").hide();
        		$(".restric").show();
        		$(".restric").css("left","40px");
        		$(".restric").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('#finish4').click(function(){
			$('.restric').animate({opacity:"0",left:"-40px"}, 200);
			$('.borg').removeClass('active');
			$('.byel').addClass('active');

			//restriccion alimenticia
			//localStorage.setItem('restricciones', restricciones );


			var genero 		  = localStorage.getItem('genero');
			var peso 		  = localStorage.getItem('peso');
			var estatura 	  = localStorage.getItem('estatura');
			var edad 		  = localStorage.getItem('edad');
			var peso_ideal 	  = localStorage.getItem('peso_ideal');
			var zipcode 	  = localStorage.getItem('zipcode');
			var plan 		  = localStorage.getItem('plan', $('#plan').val() );
			var coach_type 	  = localStorage.getItem('coach_type', $('#coach_type').val() );
			var restricciones = localStorage.getItem('restricciones');
			var dpw 		  = localStorage.getItem('dpw');
			var comentario 	  = localStorage.getItem('comentario');

			console.log("genero> " + genero +" > "+ peso+" > "+estatura+" > "+edad+" > "+peso_ideal+" > "+zipcode+" > "+plan+" > "+coach_type+" > "+restricciones+" > "+dpw+" > "+comentario );

			/*
				JSON STRUCTURE 	*
			*/
			var json = {
				"sexo" : genero,
				"fechaNacimiento" : "1984-04-21",
				"perfil":{
					"fechaNacimiento" : "1984-04-21",
					"sexo" : genero,
					"peso" : peso,
					"estatura" : estatura,
					"ejercicio" : dpw,
					"objetivo" : plan,
					"restricciones" : JSON.parse(restricciones),
					"personalidad" : coach_type
				},
				"cp": zipcode,
				"pesoDeseado": peso_ideal,
				"comentario": comentario
			}

			//Request update data

			var responsedata = apiRH.updatePerfil(json);

			console.log(responsedata);

			var listCoach = {};
			
			if(responsedata){

				/* REQUEST COACHES */	
				
				listCoach = apiRH.getCoachList();

				console.log(listCoach);

				if(listCoach){

					var i = 1;
					var Name;
					var LastN;

					$.each( listCoach, function( key, value ) {
						var item = $('.initial').html();
						// $('.initial').remove();
						// $(".wrap-cslide").append('<div class="csilder">'+item+'</div>');
  						// console.log( key + ": " + value );
  						$.each( value, function( key, value ) {
  							// console.log( key + " :: " + value );
  							if (key=='id') {
  								localStorage.setItem("dieta_id",value);
  							}
							if(key == 'coach'){	
								$.each( value, function( key, value ) {
									
									console.log( key + " ::: " + value );
									if (key=='id') {
										//$(".wrap-cslide .cslider:nth-of-type("+i+") img.la_foto").attr("src","https://gingerfiles.blob.core.windows.net/coaches/"+value+".png");
										console.log(value);
									}
									if (key=='nombre') {
										Name = value;
									}
									if (key=='apellido') {
										LastN = value;
									}
									if (key=='frase') {
										//$(".wrap-cslide .cslider:nth-of-type("+i+") p.short-descrip b").html(value);
										console.log(value);
									}
									if (key=='bio') {
										//$(".wrap-cslide .cslider:nth-of-type("+i+") pre.short-descrip").html(value);
										console.log(value);
									}
								});
								//$(".wrap-cslide .cslider:nth-of-type("+i+") h5.name").html(Name+" "+LastN);
								console.log(Name+" "+LastN);
							}
  						});

  						i++;

					});

					setTimeout(function() {
		        		$(".pagina").hide();
		        		$(".pcoach1").show();
		        		$(".pcoach1").css("left","40px");
		        		$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
		            }, 250);
		            
				}
            }else{
            	alert('Error en la actualización de datos');
            }
		});

		$('.coach.img-frame').click(function(){
			$('.pcoach1').animate({opacity:"0",left:"-40px"}, 200);
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".bio").show();
        		$(".bio").css("left","40px");
        		$(".bio").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('#finish5').click(function(){
			$('.bio').animate({opacity:"0",left:"-40px"}, 200);
			$('.byel').removeClass('active');
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".discount").show();
        		$(".discount").css("left","40px");
        		$(".discount").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('.btn-pago').click(function(){
			$('.discount').animate({opacity:"0",left:"-40px"}, 200);
			setTimeout(function() {
        		$(".pagina").hide();
        		$(".conekta").show();
        		$(".conekta").css("left","40px");
        		$(".conekta").animate({opacity:"1",left:"0px"}, 200);
            }, 250);
		});

		$('.back').click(function(){
	            window.location.assign('crear.html');
			if($('.objetive').is(':visible')){
				$('.objetive').animate({opacity:"0",left:"40px"}, 200);
				$('.bgre').removeClass('active');
				$('.bpur').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".aboutyou").show();
	        		$(".aboutyou").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
	            //$(".back").hide();
			} else if($('.exercise').is(':visible')){
				$('.exercise').animate({opacity:"0",left:"40px"}, 200);
				$('.bred').removeClass('active');
				$('.bgre').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".objetive").show();
	        		$(".objetive").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.restric').is(':visible')){
				$('.restric').animate({opacity:"0",left:"40px"}, 200);
				$('.borg').removeClass('active');
				$('.bred').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".exercise").show();
	        		$(".exercise").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.pcoach1').is(':visible')){
				$('.pcoach1').animate({opacity:"0",left:"40px"}, 200);
				$('.byel').removeClass('active');
				$('.borg').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".restric").show();
	        		$(".restric").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.bio').is(':visible')){
				$('.bio').animate({opacity:"0",left:"40px"}, 200);
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".pcoach1").show();
	        		$(".pcoach1").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.discount').is(':visible')){
				$('.discount').animate({opacity:"0",left:"40px"}, 200);
				$('.byel').addClass('active');
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".bio").show();
	        		$(".bio").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			} else if($('.conekta').is(':visible')){
				$('.conekta').animate({opacity:"0",left:"40px"}, 200);
				setTimeout(function() {
	        		$(".pagina").hide();
	        		$(".discount").show();
	        		$(".discount").animate({opacity:"1",left:"0px"}, 200);
	            }, 250);
			}
		});

		var labelID;

		$('label').click(function() {
	       labelID = 'input[name="'+$(this).attr('for')+'"]';
	       $(labelID).focus();
		});

		$("input").focus(function() {
			labelID = 'label[for="'+$(this).attr('name')+'"]';
			$(labelID).addClass('focused');
		});

		$('.pl-option').click(function() {

			var valor = $(this).find('.type').attr('value');
			$('#plan').attr('value', valor);

			$('.pl-option').each(function() {
			    if ($(this).find('img').attr('src').substr(-5, 1)=="2") {
			      $(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
			      $(this).removeClass('active');
			      $(this).attr("value", "");
			    }
			});

			$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
			$(this).addClass('active');
			$(this).attr("value", valor);

			switch ( $('#plan').val() ) {
				case 'adelgazar' : 
					$('#plan').attr("value", "0");
					break;
				case 'detox':
					$('#plan').attr("value", "1");
					break;
				case 'rendimiento' :
					$('#plan').attr("value", "2");
					break;
				case 'bienestar' :
					$('#plan').attr("value", "3");
					break;
			}
 		});
		$('.co-option img:not(.question)').click(function() {
			var valor = $(this).parent().find('.type').attr('value');
			$('#coach_type').attr('value', valor);

			$('.co-option').each(function() {
			    if ($(this).find('img:not(.question)').attr('src').substr(-5, 1)=="2") {
			      $(this).find('img:not(.question)').attr("src",$(this).find('img:not(.question)').attr('src').slice(0, -5)+".png");
			      $(this).removeClass('active');
			      $(this).attr("value", "");
			    }
			}); 
			$(this).attr("src",$(this).attr('src').slice(0, -4)+"2.png");
			$(this).parent().addClass('active');
			$(this).parent().attr("value", valor);


			switch ( $('#coach_type').val() ) {
				case 'estricto' : 
					$('#coach_type').attr("value", "0");
					break;
				case 'innovador' :
					$('#coach_type').attr("value", "1");
					break;
				case 'animador' :
					$('#coach_type').attr("value", "2");
					break;
				case 'tradicional' :
					$('#coach_type').attr("value", "3");
					break;	
			}

		});

		
		
		$('.re-option').click(function() {
			var valor = $(this).find('.type').attr('value');

			if (!$(this).hasClass('active')) {

				$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
				$(this).addClass('active');
				$(this).attr("value", valor);
				
				$('.restricciones').attr('value', valor);
				
				restricciones.push(valor);
				
				localStorage.setItem('restricciones', JSON.stringify(restricciones));

			} else {

				console.log('Aca');

				$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
				$(this).removeClass('active');
				$(this).attr("value", "");
				$('.restricciones').attr('value',"");
				
				for(var i=0; i<restricciones.length; i++){

					
					if( restricciones[i] == valor ){

						var index = restricciones.indexOf(valor);

						restricciones.splice(i, 1);

						localStorage.setItem('restricciones', JSON.stringify(restricciones));

					}//end IF

				}//end FOR				
				
			}// end ELSE

			console.log(restricciones);

		});

		$('.me-option').click(function() {
			var valor = $(this).find('.type').attr('value');
			$('.me-option').each(function() {
			    if ($(this).find('img').attr('src').substr(-5, 1)=="2") {
			      $(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
			      $(this).removeClass('active');
			      $('#measured_area').attr('value', "");
			    }
			}); 
			$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
			$(this).addClass('active');
			$('#measured_area').attr('value', valor);

			switch($('#measured_area').val() ){
				case 'brazo' :
					$('#measured_area').attr("value", '2');
					break;
				case 'pierna' :
					$('#measured_area').attr("value", '3');
					break;
				case 'cintura' :
					$('#measured_area').attr("value", '4');
					break;
				case 'cadera' :
					$('#measured_area').attr("value", '5');
					break;
			}

		});

		$('.ej-option').click(function() {
			var valor = $(this).find('.type').attr('value');
			$('.ej-option').each(function() {
			    if ($(this).find('img').attr('src').substr(-5, 1)=="2") {
			      $(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -5)+".png");
			      $(this).removeClass('active');
			      $(this).attr('value', "");
			    }
			}); 
			$(this).find('img').attr("src",$(this).find('img').attr('src').slice(0, -4)+"2.png");
			$(this).addClass('active');
			$("#ejercicio_type").attr('value', valor);

//'caminar', 'correr', 'pesas', 'cross', 'bici', 'estacionaria', 'eliptica', 'cardio', 'yoga', 'pilates', 'tenis', 'otro'

			switch($("#ejercicio_type").val() ){
				case 'caminar' :
				$('#ejercicio_type').attr('value','10');
    	        break;
    	        case 'correr' :
				$('#ejercicio_type').attr('value','11');
    	        break;
    	        case 'pesas' :
				$('#ejercicio_type').attr('value','12');
    	        break;
    	        case 'cross' :
				$('#ejercicio_type').attr('value','13');
    	        break;
    	        case 'bici' :
				$('#ejercicio_type').attr('value','14');
    	        break;
    	        case 'estacionaria' :
				$('#ejercicio_type').attr('value','15');
    	        break;
    	        case 'eliptica' :
				$('#ejercicio_type').attr('value','16');
    	        break;
    	        case 'cardio' :
				$('#ejercicio_type').attr('value','17');
    	        break;
    	        case 'yoga' :
				$('#ejercicio_type').attr('value','18');
    	        break;
    	        case 'pilates' :
				$('#ejercicio_type').attr('value','19');
    	        break;
    	        case 'tenis' :
				$('#ejercicio_type').attr('value','20');
    	        break;
    	        case 'otro	' :
				$('#ejercicio_type').attr('value','21');
    	        break;
			}

		});

/*
	localStorage EJERCICIO / DURACION / INTENSIDAD
 */
		$('#add_ejercicio').on('click', function(){

			localStorage.setItem('track_ejercicio_type', 		$('#ejercicio_type').val() );
			localStorage.setItem('track_ejercicio_duration',	$('#duracion').val() );
			localStorage.setItem('track_ejercicio_intensidad', 	$('#intensidad').val() );

			var intensidad  = localStorage.getItem('track_ejercicio_intensidad');
			var type 		= localStorage.getItem('track_ejercicio_type');
			var duracion	= localStorage.getItem('track_ejercicio_duration');

			console.log(intensidad+" "+type+" "+duracion)
			//SEND JSON EJERCICIO
			//var json_ejercicio {}


		});

		$('.centro').click(function() {
			if(!$('.overscreen').is(':visible')){
				$('.overscreen').show();
				setTimeout(function() {$('.overscreen').addClass('active');}, 200);
			} else {
				$('.overscreen').removeClass('active');
				setTimeout(function() {$('.overscreen').hide();}, 800);
			}
			$('#container').toggleClass('blurred');
			$('a.centro img').toggleClass('onn');
		});

		$('.ov-filler').click(function() {
			$('.overscreen').removeClass('active');
			setTimeout(function() {$('.overscreen').hide();}, 800);
			$('#container').removeClass('blurred');
			$('a.centro img').removeClass('onn');
		});

		$('a.more').click(function() {
			$(this).parent().find('.extra-info').toggle();
			$(this).toggleClass('presionado');
		});

		$('svg.consume').click(function() {
			$(this).parent().parent().addClass('consumido');
			$(this).html('<use xlink:href="#consume2"></use>');
		});

		$('svg.noconsu').click(function() {
			$(this).parent().parent().addClass('cancelado');
			$(this).html('<use xlink:href="#noconsu2"></use>');
		});

		$('svg.commenn').click(function() {
			$('.overscreen3').show();
			setTimeout(function() {$('.overscreen3').addClass('active');}, 200);
			$('.overscreen3 textarea').focus();
		});

		var texto = 'Mostrar Completados';

		$('.toggle-complete').click(function() {
			if ($(this).html()=='Mostrar Completados') {
				$(this).html('Ocultar Completados');
				$('.platillo.consumido').show();
			} else {
				$(this).html('Mostrar Completados');
				$('.platillo.consumido').hide();
			}	
		});

		$('.di-options a').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});

		$('.ov-filler2').click(function() {
			$('.overscreen2').removeClass('active');
			setTimeout(function() {$('.overscreen2').hide();}, 500);
		});

		$('a.logout').click(function() {
			$('.overscreen2').show();
			setTimeout(function() {$('.overscreen2').addClass('active');}, 200);
		});

		$('img.question').click(function() {
			$('.overscreen2').show();
			$('.overscreen2 h5').html($(this).attr("title"));
			setTimeout(function() {$('.overscreen2').addClass('active');}, 200);
		});

		$('.com2send').click(function() {
			$('.overscreen3').show();
			setTimeout(function() {$('.overscreen3').addClass('active');}, 200);
			$('.overscreen3 textarea').focus();
		});

		$('.siono').click(function() {
			$('.siono').removeClass('active');
			$(this).addClass('active');
			if ($(this).hasClass('yes')) {
				$('.overscreen3').show();
				setTimeout(function() {$('.overscreen3').addClass('active');}, 200);
				$('#comentar').focus();
			} else {
				$('.the-comment').html("");
				$('.the-comment').hide();
				$('.little-comment').show();
			}

		});

		$('.send_cmt').click(function() {
			$('.overscreen3').removeClass('active');
			setTimeout(function() {$('.overscreen3').hide();}, 500);
			$('.the-comment').html($('#comentar').val());
			$('.the-comment').show();
			$('li.comentario').show();
			$('.little-comment').hide();
/*
	localStorage COMENTARIO
*/
			localStorage.setItem('comentario', $('#comentar').val())
		});

		$('.izquii').click(function() {
			$('.overscreen3').removeClass('active');
			setTimeout(function() {$('.overscreen3').hide();}, 500);
			$('.siono').removeClass('active');
			$('.siono.not').addClass('active');
		});

	});

/*

	WEB VIEW BLOG
	
*/
	$('#blog').on('click',function(){
		console.log("click");
		cordova.InAppBrowser.open('http://www.gingerapp.mx/blogposts/', '_blank', 'location=yes');
	})

	$('#terms_cond').on('click',function(){
			console.log("click");
			cordova.InAppBrowser.open('http://www.gingerapp.mx/terminosycondiciones/', '_blank', 'location=yes');
		})


	$('#pol_priv').on('click',function(){
			console.log("click");
			cordova.InAppBrowser.open('http://www.gingerapp.mx/avisodeprivacidad/', '_blank', 'location=yes');
		})



/*
	CAMARA
*/
	function setOptions(srcType) {
	    var options = {
	        // Some common settings are 20, 50, and 100
	        quality: 50,
	        destinationType: Camera.DestinationType.FILE_URI,
	        // In this app, dynamically set the picture source, Camera or photo gallery
	        sourceType: srcType,
	        encodingType: Camera.EncodingType.JPEG,
	        mediaType: Camera.MediaType.PICTURE,
	        allowEdit: true,
	        correctOrientation: true  //Corrects Android orientation quirks
	    }
	    return options;
	}

	function openCamera(selection) {

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);
    var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        //displayImage(imageUri);
        // You may choose to copy the picture, save it somewhere, or upload.
        func(imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}
function displayImage(imgUri) {

    var elem = document.getElementById('imageFile');
    elem.src = imgUri;
}
	
	$('#add_picture_profile').on('click', function(){
		console.log("camara");

		 setOptions();
		 openCamera();

	});
});// end winow onload
      

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

})(jQuery);