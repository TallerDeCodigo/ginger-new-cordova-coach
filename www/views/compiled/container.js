!function(){var n=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["container"]=n({1:function(n,a,l,s,e){return"full_noscroll"},compiler:[7,">= 4.0.0"],main:function(n,a,l,s,e){var i;return'	\n	<section class="view '+(null!=(i=l.unless.call(null!=a?a:{},null!=(i=null!=a?a.data:a)?i.is_scrollable:i,{name:"unless",hash:{},fn:n.program(1,e,0),inverse:n.noop,data:e}))?i:"")+'">\n\n	</section>\n	<div class="loader_container" id="spinner">\n		<div class="loading"></div>\n	</div>\n	<div id="blur" class="blur"></div>\n	<div id="fake_bar" class="fake-bar"></div>'},useData:!0})}();