!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["create-dish"]=a({compiler:[7,">= 4.0.0"],main:function(a,e,l,n,t){var s,i=null!=e?e:{},r=l.helperMissing,c="function",d=a.escapeExpression;return'	<header class="hwhite2">\n		<div class="toolbar">\n			<a href="platillos.html" class="back"><img src="'+d((s=null!=(s=l.cordova_full_path||(null!=e?e.cordova_full_path:e))?s:r,typeof s===c?s.call(i,{name:"cordova_full_path",hash:{},data:t}):s))+'images/back.svg"></a>\n			<h2 class="titulo">'+d((s=null!=(s=l.header_title||(null!=e?e.header_title:e))?s:r,typeof s===c?s.call(i,{name:"header_title",hash:{},data:t}):s))+'</h2>\n			<a class="add">Guardar</a>\n		</div>\n	</header>\n	<div class="meal-name snack1">\n		<h1>+ SNACK 1</h1>\n	</div>\n	<div class="platillo">\n		<nav class="set-public">\n			<input type="checkbox" name="public" value="1">\n			<span>Mostrar como<br>platillo público</span>\n		</nav>\n		<textarea class="name_platillo" name="descripcion" rows="2" placeholder="Nombre del platillo"></textarea>\n		<div class="receta">\n			<textarea rows="2" name="receta" placeholder="Receta del platillo"></textarea>\n		</div>\n		<div class="comentario" >\n			<textarea name="comentario" rows="2" placeholder="Comentario de la receta"></textarea>\n		</div>\n		<h6 class="ingred"><a href="ingredientes.html" class="snack1">+</a> Ingedientes</h6>\n		<div id="lista_de_ingredientes"></div>\n	</div>\n'},useData:!0})}();