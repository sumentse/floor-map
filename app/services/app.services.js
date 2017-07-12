if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.services';
}

(function(window, angular, undefined) {
    // @ngInject
    angular.module("app.services", [])
        .provider("spService", require("./spRest.service"))
        .provider("spFolder", require("./spFolder.service"))
        .factory("_", function(){
        	return require("lodash");
        })
})(window, window.angular);
