var api = new AjedrezURL();
var user = new User();
var tablero = new Tablero(user);
var destinationType;

var app = {
    // Application Constructor
    initialize: function() {
        $("#logout").hide();
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        destinationType=navigator.camera.DestinationType;
        this.receivedEvent();
    },

    // Update DOM on a Received Event
    receivedEvent: function() {
        $("#login form").submit(function(e){
            e.preventDefault();
            var email = $(this).find("input[name='email']").val();
            var psw = $(this).find("input[name='password']").val();

            user.login(email, psw, function(){
                clearError();
                $("#login").hide();
                $("#logout").show();
                listaUsuarios.crear();
                tablero.crear();
            }, function(error){
                setError(error);
            });
        });

        $("#logout form").submit(function(e){
            e.preventDefault();

            user.logout(function(){
                clearError();
                $("#login").show();
                $("#logout").hide();
                listaUsuarios.eliminar();
                tablero.eliminar();
            }, function(error){
                setError(error);
            });
        });
    }
};

app.initialize();