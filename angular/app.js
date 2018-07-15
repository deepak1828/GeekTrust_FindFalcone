var myApp = angular.module("findFalcone",['ngRoute','ngAnimate','filters']);

angular.module('filters', [])
.filter('disablePlanetTest', function () {
    return function (inputPlanet, selectedPlanets, planetIndex) {
        if (selectedPlanets[planetIndex] == inputPlanet) {
            return false;
        } else {
            return selectedPlanets.indexOf(inputPlanet) > -1;
        }
    }
})
