!function(){var a=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["diet-list-content"]=a({1:function(a,l,n,e,t,i,s){var d,c,o,r=null!=l?l:{},u=n.helperMissing,p="function",h=a.escapeExpression,m=a.lambda,_='			<li class="elemento-dieta" data="'+h((c=null!=(c=n._id||(null!=l?l._id:l))?c:u,typeof c===p?c.call(r,{name:"_id",hash:{},data:t}):c))+'">\n				<h2>'+h((c=null!=(c=n.nombre||(null!=l?l.nombre:l))?c:u,typeof c===p?c.call(r,{name:"nombre",hash:{},data:t}):c))+"</h2>\n				";return c=null!=(c=n.descripcion||(null!=l?l.descripcion:l))?c:u,o={name:"descripcion",hash:{},fn:a.program(2,t,0,i,s),inverse:a.noop,data:t},d=typeof c===p?c.call(r,o):c,n.descripcion||(d=n.blockHelperMissing.call(l,d,o)),null!=d&&(_+=d),_+'\n				<nav>\n					<a class="hook" data-resource="duplicate-diet" href="copiar-dieta.html">\n						<img class="btn_copy" data-id="'+h((c=null!=(c=n._id||(null!=l?l._id:l))?c:u,typeof c===p?c.call(r,{name:"_id",hash:{},data:t}):c))+'" src="'+h(m(null!=s[1]?s[1].cordova_full_path:s[1],l))+'images/copy.png">\n					</a>\n					<a href="dieta.html">\n						<img class="btn_edit" data-id="'+h((c=null!=(c=n._id||(null!=l?l._id:l))?c:u,typeof c===p?c.call(r,{name:"_id",hash:{},data:t}):c))+'" src="'+h(m(null!=s[1]?s[1].cordova_full_path:s[1],l))+'images/edit.png">\n					</a>\n					<a>\n						<img class="btn_delete" data-id="'+h((c=null!=(c=n._id||(null!=l?l._id:l))?c:u,typeof c===p?c.call(r,{name:"_id",hash:{},data:t}):c))+'" src="'+h(m(null!=s[1]?s[1].cordova_full_path:s[1],l))+'images/delete.png">\n					</a>\n				</nav>\n			</li>\n'},2:function(a,l,n,e,t){return"<p>"+a.escapeExpression(a.lambda(l,l))+"</p>"},compiler:[7,">= 4.0.0"],main:function(a,l,n,e,t,i,s){var d;return'	<ul class="list-diet">\n'+(null!=(d=n.each.call(null!=l?l:{},null!=(d=null!=l?l.data:l)?d.diets:d,{name:"each",hash:{},fn:a.program(1,t,0,i,s),inverse:a.noop,data:t}))?d:"")+"	</ul>"},useData:!0,useDepths:!0})}();