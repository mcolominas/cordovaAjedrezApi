function ajax(url, method, params, loading, respuesta){
    $.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;
    if(params != null)
        $.ajax({
            data:params,
            dataType: 'json',
            cors: true,
            timeout: 5000,
            url: url,
            type: method,
            beforeSend: loading,
            success: respuesta,
            error: function(data) { console.log(data); setError("Ha ocurrido un error con el ajax");}
        });
    else
        $.ajax({
            url: url,
            dataType: 'json',
            cors: true,
            timeout: 5000,
            type: method,
            beforeSend: loading,
            success: respuesta,
            error: function(data) { console.log(data); setError("Ha ocurrido un error con el ajax");}
        });
}
let $idError = null;
function setError(mensaje){
    $("#error span").text(mensaje);
    clearTimeout($idError);
    $idError = setTimeout(clearError, 3000);
}

function clearError(){
    $("#error span").text("");
}