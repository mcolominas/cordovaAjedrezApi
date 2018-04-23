var moviendo;

function Tablero(user){
    this.turno = null;
    this.miColor = null;
    this.user = user;
    this.load = false;
}

Tablero.prototype.inicializar = function(name) {
    this.name = name;
    this.crear();

}

Tablero.prototype.crear = function() {
    this.eliminar();
    let self = this;
    
    let tablero = $("#tablero");
    
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

            let tablero = $("#tablero");
            let div = $("<div id='infoTablero' class='text-center'>");
            div.append($("<h3 id='titulo_turno'>Turno: <span></span></h3>"));
            div.append($("<p id='miColor'>Tus fichas son las: <span></span></p>"));
            tablero.before(div);
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
    $("#infoTablero").remove();
    this.turno = null;
    this.load = false;
};

Tablero.prototype.refrescar = function(win, lose) {
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
            if(res.mensaje == "No se ha encontrado la partida."){
                if(self.load && self.isMiTurno()){
                    win();
                }else if(self.load){
                    lose();
                }
            }else setError(res.mensaje);
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

Tablero.prototype.win = function(){
    let self = this;
    let id = null;
    let div = $("<div class='alert alert-success'>Enorabuena, has ganado!!</div>");
    let btn = $("<button class='btn btn-success'>Hacerme una foto</button>").click(function(){
        capturePhoto();
        clearTimeout(id);
    });
    let img = $('<img class="centerBlock" style="display:none;width:120px;height:120px;" id="smallImage" src="" />');
    $("#tablero").before(div);
    $("#tablero").before(btn);
    $("#tablero").before(img);

    id=setTimeout(function(){
        removeMensaje();
        self.crear();
    }, 5000);

    function capturePhoto() {
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
            destinationType: destinationType.DATA_URL });
    }

    function onPhotoDataSuccess(imageData) {
        btn.remove();
        btn = $("<button class='btn btn-success'>Enviar</button>").click(function(){
            removeMensaje();
        });
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.src = "data:image/jpeg;base64," + imageData;

        $(smallImage).before(btn);
    }

    function onFail(message) {
        removeMensaje();
        setError(message);
    }

    function removeMensaje(){
        div.remove();
        btn.remove();
        img.remove();
        self.crear();
    }
}

Tablero.prototype.lose = function(){
    let self = this;
    let div = $("<div class='alert alert-danger'>Has perdido, otro dia ganaras!!</div>");
    $("#tablero").before(div);

    setTimeout(function(){
        div.remove();
        self.crear();
    }, 5000);
}


