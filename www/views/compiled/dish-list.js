!function(){var a=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["dish-list"]=a({compiler:[7,">= 4.0.0"],main:function(a,l,i,s,n){return'	<div id="container" class="list-platos">\n		<header class="hwhite2">\n			<div class="toolbar">\n				<a href="dieta.html" class="back"><img src="images/back.svg"></a>\n				<h2 class="titulo">Lista de Platillos</h2>\n			</div>\n		</header>\n		<div class="priv-public">\n			<a href="#" onclick="slider.uno();return false;" data="0" class="btn-platillo active">Privado</a>\n			<a href="#" onclick="slider.dos();return false;" data="1" class="btn-platillo">Público</a>\n		</div>\n		<div id="scroller" class="swipe">\n			<ul>\n				<li style="display:block">\n					<div class="platillos-wrapper">\n						<ul class="list-dish private">\n						</ul>\n					</div>\n				</li>\n				<li style="display:none">\n					<div class="platillos-wrapper">\n						<ul class="list-dish public">\n						</ul>\n					</div>\n				</li>\n			</ul>\n		</div>		\n		<a href="crear-platillo.html" class="boton-under">Crear Platillo</a>\n	</div>\n\n	<div class="alert_meal_description" style="display:none">\n		<div class="ov-filler2"></div>\n		<div class="dialog">\n			<h5 id="meal_name">Ginger</h5>\n			<p id="meal_description">Descripcción de la receta</p>\n			<div class="di-options">\n				<a id="accept_add_dish" class="accept" data="">Agregar</a>\n				<a id="cancel_add_dish" class="cancel">Cancelar</a>\n			</div>\n		</div>\n	</div>\n'},useData:!0})}();