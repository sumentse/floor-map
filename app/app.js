'use strict';

// var $ = require("jquery");
var angular = require("angular");
require("svg.js");
require("./../node_modules/svg.panzoom.js/dist/svg.panzoom.min");

angular.module('app', [
	require("./controllers/app.controllers"),
	require("./services/app.services"),
	require("./directives/app.directives"),
	require("./filters/app.filters")
])
.constant("CONST", require("./const"))
.config(require("./config"))
.run(require("./run"));