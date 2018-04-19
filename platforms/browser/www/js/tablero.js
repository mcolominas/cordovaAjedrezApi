var moviendo;

function Tablero(user){
    this.turno = null;
    this.miColor = null;
    this.user = user;
    this.load = false;
}

Tablero.prototype.crear = function(name) {
    this.eliminar();
    let self = this;
    this.name = name;
    
    let tablero = $("#tablero");
    tablero.before($("<h3 id='titulo_turno'>Turno: <span></span></h3>"));
    tablero.before($("<p id='miColor'>Tus fichas son las: <span></span></p>"));
    
    $("body").append($("<div id='fantasma'></div>"));

    for(let f=0; f<8; f++) {
        let fila = $("<tr></tr>");
        for(let c=0; c<8; c++){
            let celda = $("<td></td>");
            fila.append(celda);
        }
        tablero.append(fila);
    }

    tablero.mousemove(sigue);
    tablero.find("td").click(juega);

    function sigue(e) {
        let fantasma = $("#fantasma");
        let horiz= e.pageX - (fantasma.height() / 2);
        let vert= e.pageY - (fantasma.width() / 2);

        fantasma.css("top", vert+"px");
        fantasma.css("left", horiz+"px");
    }

    function juega(e) {
        if(!self.isMiTurno()) return;
        let tablero = $("#tablero");
        let fantasma = $("#fantasma");
        let ficha = $(this).find("span");

        if(moviendo == null && ficha.length > 0){
            tablero.find("td, span").addClass("mano");
            ficha.css("opacity", "0.4")

            fantasma.append(ficha.clone());
            fantasma.css("display", "block");

            moviendo = this;

        }else if(moviendo){
            let target = this;
            tablero.find("td, span").removeClass("mano");

            let to = {
                fila: $(moviendo).parent().index() + 1,
                columna: $(moviendo).index() + 1
            }

            let from = {
                fila: $(this).parent().index() + 1,
                columna: $(this).index() + 1
            }

            self.mover(to, from, function(){
                //success
                if(target != moviendo)
                    $(moviendo).children().remove();

                $(target).children().remove();
                $(target).append(fantasma.children());
                $(target).find("span").css("opacity", "1");

                fantasma.css("display", "none");

                moviendo = null;

                self.cambiarTurno();
                self.refrescar();
            }, function(error){
                //error
                $(moviendo).find("span").css("opacity", "1");

                fantasma.children().remove();
                fantasma.css("display", "none");

                moviendo = null;

                setError(error);
            })
            
        }
    }
}

Tablero.prototype.loadInfo = function(success, fail) {
    let self = this;
    ajax(api.infoTablero(), "get", {"token": this.user.getToken(), "name": this.name}, function(){}, function(res){
        switch(res.status){
            case 0:
            fail(res.mensaje);
            case 1:
            self.miColor = res.partida.color;
            $("#miColor").find("span").text(self.miColor == "b" ? "Blancas" : "Negras");
            success();
        }
    });
};
Tablero.prototype.limpiar = function() {
    $("#tablero").find("span").remove();
    this.load = false;
};
Tablero.prototype.eliminar = function() {
    $("#tablero").children().remove();
    $("#fantasma").remove();
    this.turno = null;
    this.name = null;
    this.load = false;
};

Tablero.prototype.refrescar = function() {
    let self = this;
    const fichasIcono = {
        "torre": "♖",
        "caballo": "♘",
        "alfil": "♗",
        "rey": "♕",
        "reina": "♔",
        "peon": "♙"
    };
    ajax(api.verTablero(), "get", {"token": this.user.getToken(), "name": this.name}, function(){}, function(res){

        switch(res.status){
            case 0:
            setError(res.mensaje);
            break;
            case 1:
            if(self.load && self.isMiTurno()) return; //No recargar el tablero si no ha obtenido la informacion o es su turno y ya a sido cargado
            self.setTurno(res.tablero.turno);
            self.limpiar();
            
            let fichas = res.tablero.fichas;
            let tablero = $("#tablero");
            for(let i=0; i<fichas.length; i++){
                let color = fichas[i].color == "b" ? "blancas":"negras";
                let fila = fichas[i].fila - 1;
                let columna = fichas[i].columna - 1;
                let tipo = fichas[i].tipo;

                tablero.children("tr").eq(fila).children("td").eq(columna).append("<span class="+color+">"+fichasIcono[tipo]+"</span>");
            }
            self.load = true;
            break;
        }
    });
};

Tablero.prototype.mover = function(to, from, success, fail) {
    ajax(api.mover(), "get", {"token": this.user.getToken(), "name": this.name, "toFila": to.fila, "toColumna": to.columna, "fromFila":from.fila, "fromColumna":from.columna}, function(){}, function(res){
        switch(res.status){
            case 0:
            fail(res.mensaje);
            break;
            case 1:
            success();
            break;
        }
    });
};

Tablero.prototype.isMiTurno = function() {
    return this.turno == this.miColor;
};

Tablero.prototype.cambiarTurno = function() {
    if(this.turno == "b")
        this.setTurno("n");
    else
        this.setTurno("b");
};

Tablero.prototype.setTurno = function($color) {
    if(this.turno != null && $color == this.turno) return;
    this.turno = $color;

    $("#titulo_turno").find("span").text(this.turno == "b" ? "Blanco" : "Negro");
};


