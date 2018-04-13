var listaUsuarios = {
	listaUsuariosConectados: null,
	listaInvitaciones: null,
	arrayInvitaciones: [],
	crear: function(){
		listaUsuarios.listaUsuariosConectados = $("<ul></ul>");
		listaUsuarios.listaInvitaciones = $("<ul></ul>");
		$("#listaUsuarios").append("<h3>Usuarios Conectados</h3>");
		$("#listaUsuarios").append(listaUsuarios.listaUsuariosConectados);
		$("#listaInvitaciones").append(listaUsuarios.listaInvitaciones);

		listaUsuarios.refrescarListaUsuarios();
		listaUsuarios.refrescarListaIncitaciones();
	},
	refrescarListaUsuarios: function(){
		if(user instanceof User == false) return;
		user.conectados(function(lista){
			listaUsuarios.listaUsuariosConectados.children().remove();
			for(var i = 0; i < lista.length; i++){
				var a = $("<a href='#'>Invitar</a>").click(function(e){
					e.preventDefault();
					listaUsuarios.invitar(this, $(this).parent().attr("name"));
				});
				var li = $("<li name='"+ lista[i] +"'>" + lista[i] + " </li>");
				li.append(a);

				for(var e = 0; e < listaUsuarios.arrayInvitaciones.length; e++)
					if(listaUsuarios.arrayInvitaciones[e].name == lista[i])
						li.find("a").remove();

				listaUsuarios.listaUsuariosConectados.append(li);
			}
		}, function(error){
			setError(error);
		});
		setTimeout(listaUsuarios.refrescarListaUsuarios, 3000);
	},
	refrescarListaIncitaciones: function(){
		if(user instanceof User == false) return;
		ajax(api.verInvitaciones(), "get", {"token": user.getToken()}, function(){}, function(res){
			switch(res.status){
				case 0:
					setError(res.mensaje);
					break;
				case 1:
					listaUsuarios.listaInvitaciones.children().remove();
					var lista = res.mensaje;
					listaUsuarios.arrayInvitaciones = lista;
					for(var i = 0; i < lista.length; i++){
						var name = lista[i].name;
						if(i == 0){
							var h3 = $("<h3>Invitaciones pendientes</h3>");
							listaUsuarios.listaInvitaciones.append(h3);
						}
						var aceptar = $("<a href='#'>Aceptar</a>").click(function(e){
							e.preventDefault();
							listaUsuarios.responder(this, name, true);
						});
						var rechazar = $("<a href='#'>Rechazar</a>").click(function(e){
							e.preventDefault();
							listaUsuarios.responder(this, name, false);
						});


						var li = $("<li name='"+ name +"'>" + name + " </li>");
						li.append(aceptar);
						li.append(rechazar);
						listaUsuarios.listaInvitaciones.append(li);

						listaUsuarios.listaUsuariosConectados.find("[name="+name+"] a").remove();
					}

				break;
			}
		});

		setTimeout(listaUsuarios.refrescarListaIncitaciones, 3000);
	},
	invitar: function(obj, name){
		if(user instanceof User == false) return;
		ajax(api.invitar(), "get", {"token": user.getToken(), "name": name}, function(){}, function(res){
			setError(res.mensaje);
			switch(res.status){
				case 1:
					obj.remove();
				break;
			}
		});
	}, 
	responder: function(obj, name, respuesta){
		respuesta = respuesta ? 1 : 0;

		
	}
}