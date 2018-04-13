function User(){
	this.token = null;
}

User.prototype.login = function(email, psw, success, fail) {
    var self = this;
    ajax(api.login(), "get", {"email": email, "password": psw}, function(){}, function(res){
        switch(res.status){
            case 0:
                if (typeof fail === "function") fail(res.mensaje);
                break;

            case 1:
                self.token = res.token;
                if (typeof success === "function") success();
                break;
        }
    });
}

User.prototype.logout = function(success, fail) {
    ajax(api.logout(), "get", {"token": this.token}, function(){}, function(res){
        switch(res.status){
            case 0:
                if (typeof fail === "function") fail();
                break;

            case 1:
                if (typeof success === "function") success();
                break;
        }
    });
}

User.prototype.conectados = function(success, fail) {
    ajax(api.verConectados(), "get", {"token": this.token}, function(){}, function(res){
        switch(res.status){
            case 0:
                if (typeof fail === "function") fail(res.mensaje);
                break;

            case 1:
                if (typeof success === "function") success(res.usernames);
                break;
        }
    });
}

User.prototype.getToken = function() {
	return this.token;
}