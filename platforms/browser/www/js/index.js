var api = new AjedrezURL();
var user = new User();
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent();
    },

    // Update DOM on a Received Event
    receivedEvent: function() {
        tablero();

        $("#login form").submit(function(e){
            e.preventDefault();
            var email = $(this).find("input[name='email']").val();
            var psw = $(this).find("input[name='password']").val();

            user.login(email, psw, function(){
                clearError();
                listaUsuarios.crear();
            }, function(error){
                setError(error);
            });
        });
    }
};

app.initialize();