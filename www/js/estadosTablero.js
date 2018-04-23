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
		tablero.refrescar(estadoTablero.win, estadoTablero.lose);
		estadoTablero.idRefrescar = setTimeout(estadoTablero.refrescar, 3000);
	},
	parar: function(){
		clearTimeout(estadoTablero.idRefrescar);
	},
	eliminar: function(){
		clearTimeout(estadoTablero.idRefrescar);
		tablero.eliminar();
	},
	win: function(){
		estadoTablero.eliminar();
		tablero.win();
	},
	lose: function(){
		estadoTablero.eliminar();
		tablero.lose();
	}
}