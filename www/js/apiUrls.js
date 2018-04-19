function AjedrezURL(){
	this.apiURL = "https://rocky-headland-63203.herokuapp.com/api/";
}

AjedrezURL.prototype.login = function() {
	return this.apiURL+"usuarios/login";
};

AjedrezURL.prototype.logout = function() {
	return this.apiURL+"usuarios/logout";
};

AjedrezURL.prototype.verConectados = function() {
	return this.apiURL+"usuarios/verConectados";
};

AjedrezURL.prototype.invitar = function() {
	return this.apiURL+"invitacion/invitar";
};

AjedrezURL.prototype.verInvitaciones = function() {
	return this.apiURL+"invitacion/ver";
};

AjedrezURL.prototype.responder = function() {
	return this.apiURL+"invitacion/responder";
};

AjedrezURL.prototype.verTablero = function() {
	return this.apiURL+"tablero/ver";
};

AjedrezURL.prototype.infoTablero = function() {
	return this.apiURL+"tablero/info";
};

AjedrezURL.prototype.contrincantes = function() {
	return this.apiURL+"tablero/contrincantes";
};

AjedrezURL.prototype.mover = function() {
	return this.apiURL+"tablero/mover";
};