!function(){var l=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["coach"]=l({compiler:[7,">= 4.0.0"],main:function(l,a,n,e,s){var o,t,c=null!=a?a:{},r=n.helperMissing,i="function",d=l.escapeExpression,u=l.lambda;return'	<header class="hwhite2">\n		<div class="toolbar">\n			<a class="back hook" data-resource="home" href="'+d((t=null!=(t=n.cordova_full_path||(null!=a?a.cordova_full_path:a))?t:r,typeof t===i?t.call(c,{name:"cordova_full_path",hash:{},data:s}):t))+'home.html">\n				<img src="'+d((t=null!=(t=n.cordova_full_path||(null!=a?a.cordova_full_path:a))?t:r,typeof t===i?t.call(c,{name:"cordova_full_path",hash:{},data:s}):t))+'images/back.svg">\n			</a>\n			<h2 class="titulo">'+d((t=null!=(t=n.header_title||(null!=a?a.header_title:a))?t:r,typeof t===i?t.call(c,{name:"header_title",hash:{},data:s}):t))+'</h2>\n		</div>\n	</header>\n	<img class="la_img" src="https://gingerfiles.blob.core.windows.net/coaches/'+d(u(null!=(o=null!=a?a.me:a)?o._id:o,a))+'.png">\n	<h2 class="cpur">'+d(u(null!=(o=null!=a?a.me:a)?o.nombre:o,a))+" "+d(u(null!=(o=null!=a?a.me:a)?o.appellido:o,a))+'</h2>\n	<p class="bio-coach"><strong>'+d(u(null!=(o=null!=a?a.me:a)?o.frase:o,a))+'</strong></p>\n	<p class="bio-coach">'+d(u(null!=(o=null!=a?a.me:a)?o.bio:o,a))+'</p>\n	<div class="rate-stars">\n		'+(null!=(o=u(null!=(o=null!=(o=null!=a?a.data:a)?o.stars:o)?o.html:o,a))?o:"")+'\n	</div>\n	<div class="profile-menu">\n		<div class="info-coach">\n			<ul>\n				<li>\n					<span>Tipo de Coach: \n						<strong id="coach_type_perfil">'+d(u(null!=(o=null!=a?a.data:a)?o.personalidad_concat:o,a))+'</strong>\n					</span>\n				</li>\n			</ul>\n		</div>\n		<a id="blog" href="http://www.gingerapp.mx/blogposts/">\n			<img src="'+d((t=null!=(t=n.cordova_full_path||(null!=a?a.cordova_full_path:a))?t:r,typeof t===i?t.call(c,{name:"cordova_full_path",hash:{},data:s}):t))+'images/profile/blog.svg">\n			Blog\n		</a>\n		<a href="about.html">\n			<img src="'+d((t=null!=(t=n.cordova_full_path||(null!=a?a.cordova_full_path:a))?t:r,typeof t===i?t.call(c,{name:"cordova_full_path",hash:{},data:s}):t))+'images/profile/settings.svg">\n			Acerca de\n		</a>\n		<a id="logout" class="logout" href="#">\n			<img src="'+d((t=null!=(t=n.cordova_full_path||(null!=a?a.cordova_full_path:a))?t:r,typeof t===i?t.call(c,{name:"cordova_full_path",hash:{},data:s}):t))+'images/profile/logout.svg">\n			Cerrar Sesión\n		</a>\n	</div>\n\n	<div class="overscreen2" style="display:none">\n		<div class="ov-filler2"></div>\n		<div class="dialog">\n			<h5>Ginger</h5>\n			<p>¿Estás seguro que deseas<br>cerrar la sesión?</p>\n			<div class="di-options">\n				<a id="accept" class="accept logout">Cerrar sesión</a>\n				<a class="cancel">Cancelar</a>\n			</div>\n		</div>\n	</div>'},useData:!0})}();