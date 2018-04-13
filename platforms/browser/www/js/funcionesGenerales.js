function ajax(url, method, params, loading, respuesta){
    if(params != null)
        $.ajax({
            data:params,
            dataType: 'json',
            timeout: 5000,
            url: url,
            type: method,
            beforeSend: loading,
            success: respuesta,
            error: function(data) { alert("fail"); }
        });
    else
        $.ajax({
            url: url,
            dataType: 'json',
            timeout: 5000,
            type: method,
            beforeSend: loading,
            success: respuesta,
            error: function(data) { alert("fail"); }
        });
}

function setError(mensaje){
    $("#error span").text(mensaje);
}

function clearError(){
    $("#error span").text("");
}