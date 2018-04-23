var estadoTablero = {
	idRefrescar: null,
	crear: function(nombre) {
		tablero.inicializar(nombre);
		estadoTablero.loadInfo();
	},
	loadInfo: function(){
		tablero.loadInfo(function(){
			estadoTablero.refrescar();
		}, function(error){
			setError(error);
		});
	},
	refrescar: function(){
		tablero.refrescar();
		estadoTablero.idRefrescar = setTimeout(estadoTablero.refrescar, 3000);
	},
	parar: function(){
		setTimeout(estadoTablero.idRefrescar);
	},
	eliminar: function(){
		setTimeout(estadoTablero.idRefrescar);
		tablero.eliminar();
	}
}