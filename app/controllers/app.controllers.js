if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.controllers';
}

(function(window, angular, undefined) {
    // @ngInject
    angular.module("app.controllers", [])
        .controller("ui.controller", require("./ui.controller"))

})(window, window.angular);
