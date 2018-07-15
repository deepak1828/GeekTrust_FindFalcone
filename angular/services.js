myApp.service("findFalconeService", function($http){

	var  main = this;

	this.planetsApi = function(){
		return $http.get("https://findfalcone.herokuapp.com/planets");
	}

	this.vehiclesApi = function(){
		return $http.get("https://findfalcone.herokuapp.com/vehicles");
	}

});