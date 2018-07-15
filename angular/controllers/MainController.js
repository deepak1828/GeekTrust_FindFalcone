myApp.controller("MainController", ["$http","findFalconeService","$scope","$location","$rootScope", function($http,findFalconeService,$scope,$location,$rootScope){
    
    $scope.showArmy = false;
    $scope.displayArmy = function(showDiv){
        if(showDiv === 'showArmy'){
            $scope.showArmy = true;
        }
    };

    $scope.token;

    $scope.planetInfo = '';
    $scope.selectedPlanets = [];
    $scope.planetToPost = [];
    
    $scope.vehiclesInfo = '';
    $scope.selectedVehicles = {};
    $scope.vehiclesList = {};

    $scope.timeTaken = 0;

    $scope.findFalconeFlag = 0;

    $scope.resetAll = function(){
        $scope.vehiclesList = {};
        $scope.timeTaken = 0;
        $scope.findFalconeFlag = 0;

        getPlanets();
        $scope.selectedPlanets = [];
        vehiclesData();
        $scope.selectedVehicles = {};
    }
    
    $scope.range = function () {
        return [1, 2, 3, 4];
    }

    function getToken(){
    	$http({
            method: 'POST',
            url: "https://ﬁndfalcone.herokuapp.com/token",
            headers: {
                "Accept": "application/json"
            }
        }).success(function (data, config, status, headers){
        	//console.log(data);
            $scope.token = data.token;
        })
    }

    getToken();

	function getPlanets(){
		findFalconeService.planetsApi()
			.then(function successCallback(response){
				$scope.planetsInfo = response.data;
				//console.log('Planets :',$scope.planetsInfo);
			}, function errorCallback(reason){
				alert("Error in get request");
			})
	};

	getPlanets();

	function vehiclesData(){
		findFalconeService.vehiclesApi()
			.then(function successCallback(response){
				$scope.vehiclesInfo = response.data;
				//console.log('Vehicles :',$scope.vehiclesInfo);
			}, function errorCallback(reason){
				alert("Error in get request");
			})
	};

	vehiclesData();	

	$scope.changePlanet = function(index, planetIndex,currentPlanet){
		//console.log(index, planetIndex, currentPlanet);
		$scope.planetsList = currentPlanet;
		$scope.selectedPlanets[planetIndex] = currentPlanet.name;
		//console.log($scope.selectedPlanets[planetIndex]);
		if($scope.selectedVehicles[index + 1] != undefined) {
			//console.log("If condition");
			//console.log($scope.vehiclesInfo[$scope.selectedVehicles[index + 1].selectedIndex].total_no);
			if ($scope.vehiclesInfo[$scope.selectedVehicles[index + 1].selectedIndex].total_no <= $scope.selectedVehicles[index + 1].max_value) {
                $scope.vehiclesInfo[$scope.selectedVehicles[index + 1].selectedIndex].total_no++;
                //console.log("Inner if condition");
            }
            $scope.selectedVehicles[index + 1].timeTaken = 0;
            $scope.vehiclesList[index + 1] = false;
            delete $scope.selectedVehicles[index + 1];
            $scope.findFalconeFlag--;
		}

        $scope.timeTaken = 0;
        for (var i in $scope.selectedVehicles) {
            $scope.timeTaken += $scope.selectedVehicles[i].timeTaken;
            //console.log('Updated time after planet change',$scope.timeTaken);
        }
    };

    $scope.changeVehicle = function(value, index, vehicleIndex){
    	//console.log("Checking", value, index, vehicleIndex);
    	if ($scope.selectedVehicles[vehicleIndex] == undefined) {
            $scope.selectedVehicles[vehicleIndex] = {
                "selectedIndex": index,
                "timeTaken": $scope.planetsList.distance / value.speed,
                "max_value": value.total_no
            };
            //console.log("Vehicle time", $scope.selectedVehicles[vehicleIndex]);
            $scope.vehiclesInfo[index].total_no -= 1;

            $scope.findFalconeFlag++;
            //console.log('Flag',$scope.findFalconeFlag);

        } else { 
            $scope.vehiclesInfo[$scope.selectedVehicles[vehicleIndex].selectedIndex].total_no += 1;
            $scope.timeTaken -= $scope.planetsList.distance / $scope.vehiclesInfo[$scope.selectedVehicles[vehicleIndex].selectedIndex].speed;
            $scope.vehiclesInfo[index].total_no -= 1;

            $scope.selectedVehicles[vehicleIndex].selectedIndex = index;
            $scope.selectedVehicles[vehicleIndex].timeTaken = $scope.planetsList.distance / value.speed;
        }	

        $scope.timeTaken = 0;
        for (var i in $scope.selectedVehicles) {
            $scope.timeTaken += $scope.selectedVehicles[i].timeTaken;
            //console.log('For loop time',$scope.timeTaken);
        }	    	
    };

    
	$scope.submitToFind =function(vehicleArray){
        $scope.planetToPost = [];
        $scope.vehiclesTopost = [];
		//console.log($scope.selectedPlanets,vehicleArray,$scope.token);
        if($scope.selectedPlanets != null){
            for (var i=1; i<$scope.selectedPlanets.length; i++){
                $scope.planetToPost.push($scope.selectedPlanets[i]);
                $scope.vehiclesTopost.push(vehicleArray[i].name);
            }
        }
        // console.log('Final posting Planets and Vehicles array',$scope.planetToPost,$scope.vehiclesTopost);
        $http({
            method: 'POST',
            url: "https://findfalcone.herokuapp.com/find",
            data: {
                "token": $scope.token,
                "planet_names":$scope.planetToPost,
                "vehicle_names":$scope.vehiclesTopost
            },
            headers: {
                "Accept": "application/json",
                "Content-Type" : "application/json"
            }
        }).success(function (data, config, status, headers){
            $rootScope.queenFound = data;
            $rootScope.finalTimeTaken = $scope.timeTaken;
            // console.log($rootScope.finalTimeTaken);
            // console.log(data);
            $location.path('/result');
        })
	};


}]);