var listaUsuarios = {
	listaUsuariosConectados: null,
	listaInvitaciones: null,
	arrayContrincantes: [],
	arrayInvitaciones: [],
	idListaUsuarios: null,
	idListaInvitaciones: null,
	idListaContrincantes: null,
	crear: function(){
		listaUsuarios.listaUsuariosConectados = $("<ul></ul>");
		listaUsuarios.listaInvitaciones = $("<ul></ul>");
		$("#listaUsuarios").append("<h3>Usuarios Conectados</h3>");
		$("#listaUsuarios").append(listaUsuarios.listaUsuariosConectados);
		$("#listaInvitaciones").append(listaUsuarios.listaInvitaciones);

		listaUsuarios.refrescarListaIncitaciones();
		listaUsuarios.refrescarListaContrincantes();
		listaUsuarios.refrescarListaUsuarios();
	},
	eliminar: function(){
		clearTimeout(listaUsuarios.idListaUsuarios);
		clearTimeout(listaUsuarios.idListaContrincantes);
		clearTimeout(listaUsuarios.idListaInvitaciones);
		$("#listaUsuarios").children().remove();
		$("#listaInvitaciones").children().remove();
	},
	refrescarListaUsuarios: function(){
		if(user instanceof User == false) return;
		ajax(api.verConectados(), "get", {"token": user.token}, function(){}, function(res){
			switch(res.status){
				case 0:
				setError(res.mensaje);
				break;

				case 1:
				var lista = res.usernames;
				listaUsuarios.listaUsuariosConectados.children().remove();
				for(var i = 0; i < lista.length; i++){
					var a = $("<a type='invitar' href='#'>Invitar</a>").click(function(e){
						e.preventDefault();
						listaUsuarios.invitar($(this), $(this).parent().attr("name"));
					});

					var li = $("<li name='"+ lista[i] +"'>" + lista[i] + " </li>");
					li.append(a);

					for(var e = 0; e < listaUsuarios.arrayInvitaciones.length; e++){
						if(listaUsuarios.arrayInvitaciones[e].name == lista[i]){
							li.find("a[type=invitar]").remove();
						}
					}

					for(var e = 0; e < listaUsuarios.arrayContrincantes.length; e++){
						if(listaUsuarios.arrayContrincantes[e].name == lista[i]){
							var jugar = $("<a type='jugar' href='#'>Jugar</a>").click({name: lista[i]}, function(e){
								e.preventDefault();
								if(tablero instanceof Tablero == false) return;
								estadoTablero.crear(e.data.name);
								clearError();
							});
							li.find("a[type=invitar]").remove();
							li.append(jugar);
						}
					}

					listaUsuarios.listaUsuariosConectados.append(li);
				}

				listaUsuarios.listaUsuariosConectados.append(li);
				break;
			}
		});
		listaUsuarios.idListaUsuarios = setTimeout(listaUsuarios.refrescarListaUsuarios, 3000);

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

		listaUsuarios.idListaInvitaciones = setTimeout(listaUsuarios.refrescarListaIncitaciones, 3000);
	},
	refrescarListaContrincantes: function(){
		if(user instanceof User == false) return;

		ajax(api.contrincantes(), "get", {"token": user.getToken()}, function(){}, function(res){
			switch(res.status){
				case 1:
				listaUsuarios.arrayContrincantes = res.mensaje;
				break;
				case 0:
				setError(res.mensaje);
				break;
			}
		});
		listaUsuarios.idListaContrincantes = setTimeout(listaUsuarios.refrescarListaContrincantes, 3000);
	},
	invitar: function(obj, name){
		if(user instanceof User == false) return;
		ajax(api.invitar(), "get", {"token": user.getToken(), "name": name}, function(){}, function(res){
			setError(res.mensaje);
			/*switch(res.status){
				case 1:
				obj.remove();
				break;
			}*/
		});
	},
	responder: function(obj, name, respuesta){
		respuesta = respuesta ? 1 : 0;
		ajax(api.responder(), "get", {"token": user.getToken(), "name": name, "respuesta": respuesta}, function(){}, function(res){
			setError(res.mensaje);
		});
	}
}