// @ngInject
module.exports = function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/building");

    $stateProvider
        .state("buildings", {
            url: "/:buildingName",
            controller: "ui.controller",
            templateUrl: "views/building.html"
        });
};
