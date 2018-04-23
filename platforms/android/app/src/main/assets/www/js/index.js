var api = new AjedrezURL();
var user = new User();
var tablero = new Tablero(user);



    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value


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

        pictureSource=navigator.camera.PictureSourceType;
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

function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
  }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
  }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
  }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
  }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
  }

    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
  }