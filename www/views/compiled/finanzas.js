!function(){var a=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["finanzas"]=a({1:function(a,l,n,t,s){var e,o=null!=l?l:{},h=n.helperMissing,c="function",d=a.escapeExpression;return"			<tr>\n				<td>"+d((e=null!=(e=n.name||(null!=l?l.name:l))?e:h,typeof e===c?e.call(o,{name:"name",hash:{},data:s}):e))+"</td>\n				<td>"+d((e=null!=(e=n.days_since_subscription||(null!=l?l.days_since_subscription:l))?e:h,typeof e===c?e.call(o,{name:"days_since_subscription",hash:{},data:s}):e))+"</td>\n				<td>"+d((e=null!=(e=n.days_this_month||(null!=l?l.days_this_month:l))?e:h,typeof e===c?e.call(o,{name:"days_this_month",hash:{},data:s}):e))+"</td>\n				<td>$ "+d((e=null!=(e=n.amount_this_month||(null!=l?l.amount_this_month:l))?e:h,typeof e===c?e.call(o,{name:"amount_this_month",hash:{},data:s}):e))+"</td>\n			</tr>\n"},compiler:[7,">= 4.0.0"],main:function(a,l,n,t,s){var e,o,h=null!=l?l:{},c=n.helperMissing,d="function",u=a.escapeExpression,r=a.lambda;return'	<header class="hwhite">\n		<div class="toolbar">\n			<a class="back hook" data-resource="home" href="'+u((o=null!=(o=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?o:c,typeof o===d?o.call(h,{name:"cordova_full_path",hash:{},data:s}):o))+'home.html">\n				<img src="'+u((o=null!=(o=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?o:c,typeof o===d?o.call(h,{name:"cordova_full_path",hash:{},data:s}):o))+'images/back.svg">\n			</a>\n			<h2 class="titulo">'+u((o=null!=(o=n.header_title||(null!=l?l.header_title:l))?o:c,typeof o===d?o.call(h,{name:"header_title",hash:{},data:s}):o))+'</h2>\n		</div>\n	</header>\n	<a class="btn-gre">Recibo de honorarios</a>\n	<p class="acumulado">Saldo acumulado del <span class="inicio">1</span> al <span class="final">'+u(r(null!=(e=null!=l?l.data:l)?e.this_day:e,l))+" de "+u(r(null!=(e=null!=l?l.data:l)?e.this_month:e,l))+'</span></p>\n	<p class="cantidad">$ <span class="totalAcumulado">'+u(r(null!=(e=null!=l?l.data:l)?e.total_amount:e,l))+'</span> MXN</p>\n	<p class="status">PAGADO</p>\n	<p class="diasac">Total de días acumulados<br><span class="total">'+u(r(null!=(e=null!=l?l.data:l)?e.total_days:e,l))+'</span></p>\n	<div class="changer">\n		<a class="btn_left" href="#"><img src="'+u((o=null!=(o=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?o:c,typeof o===d?o.call(h,{name:"cordova_full_path",hash:{},data:s}):o))+'images/leftarrow.png"></a>\n		<span class="mes">'+u(r(null!=(e=null!=l?l.data:l)?e.this_month:e,l))+'</span>\n		<a class="btn_right" href="#"><img src="'+u((o=null!=(o=n.cordova_full_path||(null!=l?l.cordova_full_path:l))?o:c,typeof o===d?o.call(h,{name:"cordova_full_path",hash:{},data:s}):o))+'images/rightarrow.png"></a>\n	</div>\n	<table class="record">\n		<tr>\n			<th>Nombre</th>\n			<th>Inicio</th>\n			<th>Días</th>\n			<th>Saldo</th>\n		</tr>\n'+(null!=(e=n.each.call(h,null!=(e=null!=l?l.data:l)?e.clients:e,{name:"each",hash:{},fn:a.program(1,s,0),inverse:a.noop,data:s}))?e:"")+"		\n	</table>"},useData:!0})}();