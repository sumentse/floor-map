if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.directives';
}

(function(window, angular, undefined) {
    // @ngInject
    angular.module("app.directives", [
		require("angular-ui-router")
	])
})(window, window.angular);
