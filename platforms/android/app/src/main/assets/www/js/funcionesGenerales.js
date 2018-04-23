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
let $idAlert = null;
function setError(mensaje){
    $("#error").show();
    $("#error span").text(mensaje);
    clearTimeout($idError);
    $idError = setTimeout(clearError, 5000);
}

function clearError(){
    $("#error").hide();
    $("#error span").text("");
}

function setAlert(mensaje){
    $("#alert").show();
    $("#alert span").text(mensaje);
    clearTimeout($idError);
    $idAlert = setTimeout(clearAlert, 5000);
}

function clearAlert(){
    $("#alert").hide();
    $("#alert span").text("");
}