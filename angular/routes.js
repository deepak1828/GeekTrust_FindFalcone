// angular.module('myApp.routes',['ngRoute']);
	myApp.config(['$routeProvider', function($routeProvider){

		$routeProvider
			.when('/#',{
				templateUrl: 'views/main.html',
				controller: 'MainController',
    			controllerAs : 'mainCtrl'
			})
			.when('/findFalcone',{
				templateUrl: 'views/findFalcone.html',
				controller: 'MainController',
              	controllerAs : 'mainCtrl'
			})
			.when('/result',{
				templateUrl: 'views/result.html',
				controller: 'MainController',
    			controllerAs : 'mainCtrl'
			})
			.otherwise({
				redirectTo: '/#'
			})
	}])