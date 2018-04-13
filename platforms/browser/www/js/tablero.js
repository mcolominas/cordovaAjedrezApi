var escaques, padre, hijo, moviendo, copia; 
var trebejos0 = ["♖","♘","♗","♕","♔","♗","♘","♖"];
var trebejos1 = "♙"; 

function tablero() {
    var nuevoDiv = document.createElement("div"); 
    nuevoDiv.setAttribute("id","fantasma"); 
    document.body.appendChild(nuevoDiv); 
    document.body.addEventListener('mousemove', function(event){ sigue(event); false}); 
    copia = document.getElementById("fantasma"); 

    escaques = document.getElementById("tablero"); 
    for(f=0; f<8; f++) {
        var fila = escaques.insertRow(); 
        for(c=0; c<8; c++){
            var celda = fila.insertCell(); 
            if(f==0) celda.innerHTML = "<span class=negras>"+trebejos0[c]+"</span>"; 
            else if(f==1) celda.innerHTML = "<span class=negras>"+trebejos1+"</span>"; 
            else if(f==6) celda.innerHTML = "<span class=blancas>"+trebejos1+"</span>"; 
            else if(f==7) celda.innerHTML = "<span class=blancas>"+trebejos0[c]+"</span>"; 
        }
    }
    var movible = document.querySelectorAll("td"); 
    for(m=0; m<movible.length; m++) {
        $(movible[m]).click(juega);
    }
}

function juega(T) {
    elementos = document.querySelectorAll("table, table span"); 
    if(moviendo == null && $(this).find("span")){
        padre = $(this); 
        hijo = $(this).html(); 
        for(i=0; elementos[i]; i++) 
            elementos[i].classList.add("mano"); 

        $(this).find("span").css("opacity", "0.4")

        copia.innerHTML = $(this).html(); 
        copia.style.display = "block";

        moviendo = this; 
    }else if(moviendo != null){
        if(this != moviendo){
            $(padre).html("");
        }

        $(this).html(hijo);
        for(i=0; elementos[i]; i++) 
                elementos[i].classList.remove("mano");
        copia.style.display = "none"; 
        moviendo = null; 
    }
}

function sigue(e) {
    var horiz= (e.x) ? e.x : e.clientX; 
    var vert= (e.y) ? e.y : e.clientY; 
    //document.title = (horiz - 16)+" "+(vert - 16); 

    copia.style.top = (vert - 16)+"px"; 
    copia.style.left = (horiz - 16)+"px"; 
}