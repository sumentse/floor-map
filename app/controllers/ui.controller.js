// @ngInject
module.exports = function($scope, $document, $http, spService, _) {

    $scope.structure = [];

    var currentRoom = null;
    var currentFloor = null;
    var Canvas = null;
    var defaultViewPos = "39.99998474121094 -15.999992370605469 381.01551818847656 400.0000534057617";

    $scope.renderFloor = function(floor) {
        if (floor) {


            angular.extend($scope.navState, {
                level: _.find($scope.structure, function(level) {
                    return level.name === floor;
                })
            });

            if (currentFloor !== floor) {


                SVG.select("g.floors, g.rooms").hide();

                if (currentFloor) {
                    SVG.get(currentFloor).removeClass("fade-in-top").removeClass("fade-in-bottom");
                    var currentFloorNo = parseInt(currentFloor.replace("Floor_", ""), 10);
                }
                var floorNumber = parseInt(floor.replace("Floor_", ""), 10);

                if (!currentFloor) {
                    SVG.get(floor).show().addClass("fade-in-top");
                } else if (currentFloorNo > floorNumber) {
                    SVG.get(floor).show().addClass("fade-in-top");
                } else if (currentFloorNo < floorNumber) {
                    SVG.get(floor).show().addClass("fade-in-bottom");
                }

                if (currentRoom) {
                    SVG.get(currentRoom).children()[0].attr('font-size', '11px').stop();
                    currentRoom = "";
                }
            }

            if (SVG.get(floor + "_rooms")) {
                if (SVG.get(floor + "_rooms").children().length <= 5) {
                    SVG.select("g.rooms").show();
                }
            }

            currentFloor = floor;

        }
    };

    $scope.renderRoom = function(room) {

        if (room) {
            if (currentRoom !== room) {
                if (currentRoom) {
                    SVG.get(currentRoom).children()[0].attr('font-size', '11px').stop();
                }
                currentRoom = room;
            }
            SVG.select("g.rooms").hide();
            SVG.get(room).show();
            SVG.get(room).children()[0].animate({ 'ease': '-' }).attr({ 'font-size': '14px' }).loop(5, true);
        }

    };

    $scope.resetView = function() {
        Canvas.attr('viewBox', defaultViewPos);
    };


    $http.get("svgs/Floormap.svg")
        .then(function(response) {

            angular.element(document.querySelector("#svg-container")).html(response.data);

            if (SVG.supported) {
                var structure = [];

                Canvas = SVG.get("Building").each(function(i, children) {

                        if (this.node.id && this.type === "g") {

                            SVG.get(this).addClass("floors");

                            var floor = {
                                name: this.node.id,
                                intLevel: parseInt((this.node.id).replace("Floor_", ""), 10),
                                rooms: []
                            };

                            var rooms = this.node.id.concat("_rooms");

                            //check if rooms exist in that level
                            if (SVG.get(rooms)) {

                                //will use this to sort the room
                                var tempRoom = [];

                                SVG.get(rooms).each(function(i, children) {
                                    if (this.node.id && this.type === "g") {
                                        SVG.get(this).addClass("rooms");
                                        tempRoom.push(this.node.id);
                                    }

                                });

                                tempRoom.sort();

                                for (var i = 0; i < tempRoom.length; i++) {
                                    floor.rooms.push({
                                        name: tempRoom[i]
                                    });
                                }

                            }

                            structure.push(floor);

                        }

                    })
                    .size(800, 600)
                    .attr('viewBox', defaultViewPos)
                    .panZoom()
                    .zoom(1.5, {x:0,y:0});

                SVG.select("g.floors, g.rooms").hide();


                $scope.structure = _.orderBy(structure, ['intLevel'], ['desc']);

                $scope.navState = {
                    level: $scope.structure[$scope.structure.length - 1]
                }

                $scope.renderFloor($scope.navState.level.name);


            } else {
                alert("not supported");
            }

        });


};
