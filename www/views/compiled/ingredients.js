!function(){var a=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["ingredients"]=a({compiler:[7,">= 4.0.0"],main:function(a,l,n,e,s){var c,i=null!=l?l:{},t=n.helperMissing,d="function",r=a.escapeExpression;return'	<div class="subcontainer">\n		<header class="hwhite2">\n			<div class="toolbar">\n				<a class="back hook" data-resource="create-dish" href="crear-platillo.html">\n					<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/back.svg">\n				</a>\n				<h2 class="titulo">'+r((c=null!=(c=n.header_title||(null!=l?l.header_title:l))?c:t,typeof c===d?c.call(i,{name:"header_title",hash:{},data:s}):c))+'</h2>\n				<a class="add">Agregar</a>\n			</div>\n		</header>\n		<div class="accordion1">\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/__wheat1@3x.png">\n				<h5>Granos y cereales</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes granosycereales">\n					<!-- aqui se llena -->\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/verduras.png">\n				<h5>Verduras</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes verduras">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/aceites1@3x.png">\n				<h5>Grasas</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes grasas">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/_milk1@3x.png">\n				<h5>Lácteos</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes lacteos">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/_meat1@3x.png">\n				<h5>Proteína Animal</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes proteinaanimal">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/_carrot1@3x.png">\n				<h5>Leguminosas</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes leguminosas">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/nueces.png">\n				<h5>Nueces y semillas</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes nuecesysemillas">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/frutas.png">\n				<h5>Frutas</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes frutas">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/malteada.png">\n				<h5>Endulzantes</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes endulzantes">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/condimentos.png">\n				<h5>Aderezos y condimentos</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes aderezosycondimentos">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/superfoods.png">\n				<h5>Superfood</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes superfoods">\n				</ul>\n			</div>\n			<div class="acc1-selector">\n				<img src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/ingredientes/liquidos.png">\n				<h5>Líquidos</h5>\n			</div>\n			<div class="acc1-content">\n				<ul class="lista_ingredientes liquidos">\n				</ul>\n			</div>\n		</div>\n		<div class="overscreen2" style="display:none">\n			<div id="picker">\n				<div class="arrows-vertical">\n					<img id="picker-up" src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/leftarrow.png">\n					<img id="picker-dw" src="'+r((c=null!=(c=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?c:t,typeof c===d?c.call(i,{name:"cordova_full_path",hash:{},data:s}):c))+'images/rightarrow.png">\n				</div>\n				<div class="box-input-2">\n					<input type="text" name="picker" value="1" maxlength="2" onkeypress=\'return event.charCode >= 46 && event.charCode <= 57\'>\n				</div>\n				<div class="btn-gre establish" style="float:right;margin-right:10%;margin-top:13px;">AGREGAR</div>\n			</div>\n		</div>\n		\n		<a class="boton-under hook" data-resource="create-ingredient" href="crear-ingrediente.html">Crear Ingrediente</a>\n	</div>\n	<div class="overscreen5" style="display:none">\n		<div class="ov-filler2"></div>\n		<div class="dialog">\n			<h5>Ingrediente</h5>\n			<p>¿Estás seguro de querer agregar este ingrediente?</p>\n			<div class="di-options">\n				<a id="aceptar" class="accept">Aceptar</a>\n				<a id="cancelar" class="cancel">Cancelar</a>\n			</div>\n		</div>\n	</div>\n'},useData:!0})}();