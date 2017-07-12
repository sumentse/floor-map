// @ngInject
module.exports = function() {
    var digestValue = angular.element(document.querySelector("#__REQUESTDIGEST")).val();
    return {
        $get: /*@ngInject*/ function($http, $q) {
            return {
                getDigestValue: function(url, complete) {

                    if (digestValue != null) {
                        complete(digestValue);
                    } else {

                        $http({
                            url: url + "/_api/contextinfo",
                            async: true,
                            method: "POST",
                            headers: {
                                "accept": "application/json;odata=verbose",
                                "contentType": "text/xml"
                            }
                        }).then(function(response) {
                            digestValue = response.data.d.GetContextWebInformation.FormDigestValue;
                            complete(digestValue);
                        }, function(response) {
                            alert("Cannot get digestValue.");
                        });

                    }

                },
                getFolderItems: function(url, folderPath, query, complete, failure) {
                    //folderpath should start with /sites/domain/foldername
                    $http({
                        url: url + "/_api/web/getFolderByServerRelativeUrl('" + folderPath + "')/Files" + query,
                        method: "GET",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then(function(response) {
                        complete(response);
                    }, function(response) {
                        failure(response);
                    });
                },
                getFolders: function(url, folderPath, query, complete, failure) {
                    $http({
                        url: url + "/_api/web/getFolderByServerRelativeUrl('" + folderPath + "')/Folders" + query,
                        method: "GET",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then(function(response) {
                        complete(response);
                    }, function(response) {
                        failure(response);
                    });
                }
            };

        }
    }
};
