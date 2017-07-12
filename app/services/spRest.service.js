// @ngInject
module.exports = function(){
	var digestValue = angular.element(document.querySelector("#__REQUESTDIGEST")).val();
	return {
            $get: /*@ngInject*/ function ($http, $q) {
                return {
                    getDigestValue: function (url, complete) {

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
                            }).then(function (response) {
                                digestValue = response.data.d.GetContextWebInformation.FormDigestValue;
                                complete(digestValue);
                            }, function (response) {
                                alert("Cannot get digestValue.");
                            });

                        }

                    },
                    getFileBuffer: function (file) {
                        var deffered = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            deffered.resolve(e.target.result);
                        }
                        reader.onerror = function (e) {
                            deffered.reject(e.target.error);
                        }
                        reader.readAsArrayBuffer(file);
                        return deffered.promise;

                    },
                    addListFileAttachment: function (url, listname, id, fileName, file, complete, failure) {
                        getDigestValue = this.getDigestValue;

                        this.getFileBuffer(file).then(function (buffer) {

                            //cleans the string to correct name that is acceptable on sharepoint.
                            try {
	                            var cleanStrFileName = fileName.replace(/^\.+|([|\/&;$%:#~?^{}*'@"<>()+,])|\.+$/g, "");
	                            cleanStrFileName = cleanStrFileName.substr(-128);
                            } catch(e){
                            	throw Error("Filename was not supply");
                            }

                            getDigestValue(url, function (digestValue) {
                                //you can only add or delete the list item but it will be different in documents
                                $http({
                                    url: url + "/_api/web/lists/GetByTitle('" + listname + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + cleanStrFileName + "')",
                                    method: "POST",
                                    data: buffer,
                                    processData: false,
                                    transformRequest: function (data) {
                                        return data;
                                    },
                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                        "X-RequestDigest": digestValue,
                                        "Content-Length": buffer.byteLength
                                    }
                                }).then(function (response) {
                                    complete(response);
                                }, function (response) {
                                    failure(response);
                                });

                            });

                        });

                    },
                    deleteListFileAttachment: function (url, listname, id, fileName, complete, failure) {
                        getDigestValue = this.getDigestValue;

                        getDigestValue(url, function (digestValue) {
                            $http({
                                url: url + "/_api/web/lists/GetByTitle('" + listname + "')/items(" + id + ")/AttachmentFiles/getByFileName('" + fileName + "')",
                                method: "POST",
                                headers: {
                                    "Accept": "application/json;odata=verbose",
                                    "X-Http-Method": "DELETE",
                                    "X-RequestDigest": digestValue,
                                }
                            }).then(function (response) {
                                complete(response);
                            }, function (response) {
                                failure(response);
                            });
                        });
                    },
                    getListItemType: function (name) {
                        return ("SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem").replace(/\s/g, "_x0020_");
                    },
                    getListItem: function (url, listname, id, query, complete, failure) {

                        $http({
                            url: url + "/_api/web/lists/getbytitle('" + listname + "')/items('" + id + "')" + query,
                            method: "GET",
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).then(function (response) {
                            complete(response);
                        }, function (response) {
                            failure(response);
                        });


                    },
                    getListItems: function (url, listname, query, complete, failure) {
                        // Executing our items via an ajax request
                        $http({
                            url: url + "/_api/web/lists/getbytitle('" + listname + "')/items" + query,
                            method: "GET",
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).then(function (response) {
                            complete(response);
                        }, function (response) {
                            failure(response);
                        });

                    },
                    getCurrentUser: function (url, query, complete, failure) {
                        $http({
                            url: url + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties" + query,
                            method: "GET",
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).then(function (response) {
                            complete(response);
                        }, function (response) {
                            failure(response);
                        });
                    },
                    getPermissionLevels: function (url, query, complete, failure) {
                        $http({
                            url: url + "/_api/web/currentuser/groups" + query,
                            method: "GET",
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).then(function (response) {
                            complete(response);
                        }, function (response) {
                            failure(response);
                        });
                    },
                    addListItem: function (url, listname, metadata, complete, failure) {
                        // Prepping our update
                        var item = angular.extend({
                            "__metadata": {
                                "type": this.getListItemType(listname)
                            }
                        }, metadata);


                        this.getDigestValue(url, function (digestValue) {

                            $http({
                                url: url + "/_api/web/lists/getbytitle('" + listname + "')/items",
                                method: "POST",
                                data: JSON.stringify(item),
                                headers: {
                                    "Content-Type": "application/json;odata=verbose",
                                    "Accept": "application/json;odata=verbose",
                                    "X-RequestDigest": digestValue
                                }
                            }).then(function (response) {
                                complete(response);
                            }, function (response) {
                                failure(response);
                            });


                        });


                    },
                    updateListItem: function (url, listname, id, metadata, complete, failure) {

                        //this will update the list item on restful api on sharepoint
                        var item = angular.extend({
                            "__metadata": {
                                "type": this.getListItemType(listname)
                            }
                        }, metadata);

                        var getListItem = this.getListItem;

                        this.getDigestValue(url, function (digestValue) {

                            getListItem(url, listname, id, "", function (response) {

                                $http({
                                    url: response.data.d.__metadata.uri,
                                    method: "POST",
                                    data: JSON.stringify(item),
                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                        "Content-Type": "application/json;odata=verbose",
                                        "X-RequestDigest": digestValue,
                                        "X-HTTP-Method": "MERGE",
                                        "If-Match": response.data.d.__metadata.etag
                                    }
                                }).then(function (response) {
                                    complete(response);
                                }, function (response) {
                                    failure(response);
                                });

                            }, function (response) {
                                failure(response);

                            });

                        });

                    },
                    deleteListItem: function (url, listname, id, complete, failure) {
                        // getting our item to delete, then executing a delete once it's been returned

                        var getListItem = this.getListItem;

                        this.getDigestValue(url, function (digestValue) {

                            getListItem(url, listname, id, "", function (response) {

                                $http({
                                    url: response.data.d.__metadata.uri,
                                    method: "POST",
                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                        "X-Http-Method": "DELETE",
                                        "X-RequestDigest": digestValue,
                                        "If-Match": response.data.d.__metadata.etag
                                    }

                                }).then(function (response) {
                                    complete(response);
                                }, function (response) {
                                    failure(response);
                                });


                            }, function (response) {
                                failure(response)
                            });


                        });


                    }
                };

            }
        }
};