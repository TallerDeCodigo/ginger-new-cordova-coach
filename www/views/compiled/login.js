!function(){var a=Handlebars.template,n=Handlebars.templates=Handlebars.templates||{};n["login"]=a({compiler:[7,">= 4.0.0"],main:function(a,n,e,i,l){var s;return'	\n	<div>\n		<img class="logo" src="'+a.escapeExpression((s=null!=(s=e.cordova_full_path||(null!=n?n.cordova_full_path:n))?s:e.helperMissing,"function"==typeof s?s.call(null!=n?n:{},{name:"cordova_full_path",hash:{},data:l}):s))+'images/logo.svg">\n\n		<h4>INICIAR SESIÓN</h4>\n		<form id="login_form">\n			<input id="mail" 		 type="email" 	 name="mail" placeholder="Correo electrónico">\n			<input id="pass" 		 type="password" name="pass" placeholder="Contraseña">\n			<input id="enviar_login" onclick="app.showLoader();" type="submit" 	 value="">\n		</form>\n		\n	</div>\n\n	<div class="overscreen2" style="display:none">\n		<div class="ov-filler2"></div>\n		<div class="dialog">\n			<h5>Error al iniciar sesión</h5>\n			<p>No se ha podido inciar sesión. Nombre de usuario o<br>contraseña incorrectos.</p>\n			<div class="di-options">\n				<a class="cancel">Aceptar</a>\n			</div>\n		</div>\n	</div>'},useData:!0})}();