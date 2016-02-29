angular.module('confusionApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

    // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('BlogController', ["$scope", "$stateParams","blogOverviewAddress","uploadAddress",
    "postEditorAddress",'$ionicPopover','$cordovaCamera','$ionicPlatform','$ionicModal','photosFactory','$cordovaFileTransfer','$cordovaToast','$ionicPopup',
    function($scope, $stateParams,blogOverviewAddress,uploadAddress
        ,postEditorAddress,$ionicPopover,$cordovaCamera,$ionicPlatform,$ionicModal,photosFactory,$cordovaFileTransfer,$cordovaToast, $ionicPopup) {
    $scope.selection=1;
    $scope.iframeSrc=blogOverviewAddress;
    $scope.setSelection=function(index){
             $scope.selection=index;
             switch(index){
                case 1: $scope.iframeSrc=blogOverviewAddress; 
                        document.getElementById('BlogContent').src = blogOverviewAddress;
                        break;
                case 2:  $scope.iframeSrc=uploadAddress;break;
                case 3: $scope.iframeSrc=postEditorAddress;break;
                default: break;
             }
       
    }

    $scope.isSelected=function(index){
        return index===$scope.selection;
    }



     $scope.showImages=function(index){
        console.log(index);
        $scope.src=$scope.allImages[index];

    }
 

     $ionicModal.fromTemplateUrl('templates/photosdisplay.html', {
                scope: $scope
              }).then(function(modal) {
                $scope.modal = modal;
              });

    $scope.getPhotos=function(){
       photosFactory.getPhotos()
        .query(
                            function(response){
                                 $scope.allImages = response;
                                 $scope.selection=2;
                                 console.log($scope.allImages);
                                
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );
        
        $scope.modal.show();
         $scope.popover.hide();
    }
     $scope.closePhotos = function() {
                $scope.modal.hide();
            };


     
 $scope.openPhotoLibrary = function() {
        console.log("openPhotoLibrary");
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
             $scope.popover.hide();
            //console.log(imageData);
            //console.log(options);   
            //var image = document.getElementById('tempImage');
            //image.src = imageData;  
                var myPopup = $ionicPopup.show({
   
                    title: 'You want to post the photo?(N/Y)',
                    subTitle: 'You can just upload the photo but not post(U)',
                    scope: $scope,
                    buttons: [
                      { text: 'N' },
                      {
                        text: '<b>Y</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                         
            var server = "http://192.168.1.9:8888/wordpress/wp-json/myplugin/v1/imgs3",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                //alert("success");
                //alert(JSON.stringify(result.response));
                $cordovaToast
                  .show('Photo uploaded! ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                  $scope.popover.hide();

            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                    $cordovaToast
                  .show('Uploading error ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });
                        }
                      },
                       {
                        text: '<b>U</b>',
                        type: 'button-energized',
                        onTap: function(e) {
                         
            var server = "http://192.168.1.9:8888/wordpress/wp-json/myplugin/v1/imgs2",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                //alert("success");
                //alert(JSON.stringify(result.response));
                $cordovaToast
                  .show('Photo uploaded! ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                  $scope.popover.hide();

            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                    $cordovaToast
                  .show('Uploading error ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });
                        }
                      }
                    ]
                  });



        }, function(err) {
            // error
            console.log(err);
        });
    }
    $scope.takePhoto = function() {
        console.log("takePhoto");
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.popover.hide();
            //console.log(imageData);
            //console.log(options);   
            //var image = document.getElementById('tempImage');
            //image.src = imageData;  

              var myPopup = $ionicPopup.show({
   
                    title: 'You want to post the photo?(N/Y)',
                    subTitle: 'You can just upload the photo but not post(U)',
                    scope: $scope,
                    buttons: [
                      { text: 'N' },
                      {
                        text: '<b>Y</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                         
            var server = "http://192.168.1.9:8888/wordpress/wp-json/myplugin/v1/imgs3",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                //alert("success");
                //alert(JSON.stringify(result.response));
                $cordovaToast
                  .show('Photo uploaded! ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                  $scope.popover.hide();

            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                    $cordovaToast
                  .show('Uploading error ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });
                        }
                      },
                       {
                        text: '<b>U</b>',
                        type: 'button-energized',
                        onTap: function(e) {
                         
            var server = "http://192.168.1.9:8888/wordpress/wp-json/myplugin/v1/imgs2",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                //alert("success");
                //alert(JSON.stringify(result.response));
                $cordovaToast
                  .show('Photo uploaded! ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                  $scope.popover.hide();

            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                    $cordovaToast
                  .show('Uploading error ', 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });

                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });
                        }
                      }
                    ]
                  });

            // $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
            //     console.log("SUCCESS: " + JSON.stringify(result.response));
            //     console.log('Result_' + result.response[0] + '_ending');
            //     alert("success");
            //     alert(JSON.stringify(result.response));

            // }, function(err) {
            //     console.log("ERROR: " + JSON.stringify(err));
            //     //alert(JSON.stringify(err));
            // }, function (progress) {
            //     // constant progress updates
            // });


        }, function(err) {
            // error
            console.log(err);
        });
    }
     
    $scope.getMedias=function(){

    }
    $ionicPopover.fromTemplateUrl('templates/blog-popover.html', {
                scope: $scope
              }).then(function(popover) {
                $scope.popover = popover;
              });

            $scope.openPopover = function($event) {
                console.log("popover");
                $scope.popover.show($event);
            };
    
}])
   .controller('wysiwygeditor', ['$scope','$resource','$sce',function($scope,$resource,$sce) {
            // $scope.orightml = '';
            // $scope.htmlcontent = $scope.orightml;
            // $scope.disabled = false;

            $scope.renderHTML=function(html_code){
                  return $sce.trustAsHtml(html_code);
            };
            $resource("http://192.168.1.9:8888/wordpress/wp-json/myplugin/v1/posts").query(
                    function(response){
                                 $scope.allPosts = response;
                            
                                
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            })
        }])


 .controller('MenuController', ['$scope', 'dishes','favorites','menuFactory','favoriteFactory', 'baseURL','$ionicListDelegate', '$cordovaToast', '$ionicPlatform','$cordovaLocalNotification',
    function($scope,dishes,favorites,menuFactory,favoriteFactory,baseURL,$ionicListDelegate, $cordovaToast,$ionicPlatform,$cordovaLocalNotification) {
            
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
             $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();

                $ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
                });
            }

            $scope.dishes=dishes;
            // menuFactory.getDishes().query(
            //     function(response) {
            //         $scope.dishes = response;
            //         $scope.showMenu = true;
            //     },
            //     function(response) {
            //         $scope.message = "Error: "+response.status + " " + response.statusText;
            //     });
            $scope.dishes
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', 'dish','$stateParams', 'menuFactory','baseURL', '$ionicPopover','favoriteFactory','$ionicModal',function($scope, dish,$stateParams, menuFactory,baseURL,$ionicPopover,favoriteFactory,$ionicModal) {
            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";

             $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $scope.popover.hide();
            }
            $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
              }).then(function(modal) {
                $scope.m_commentForm = modal;
              });

            $scope.addComment=function(){
                $scope.m_commentForm.show();
                 $scope.popover.hide();
            }
            $scope.closeCommentForm = function() {
                $scope.m_commentForm.hide();
            };
            $scope.comment={};
            $scope.doComment=function(){


                var comment=$scope.comment;

                console.log($scope.comment);
                comment.date=new Date();
                $scope.dish.comments.push(comment);
                 $scope.closeCommentForm();
            };

            $scope.dish = dish;
            // $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            // .$promise.then(
            //                 function(response){
            //                     $scope.dish = response;
            //                     $scope.showDish = true;
            //                 },
            //                 function(response) {
            //                     $scope.message = "Error: "+response.status + " " + response.statusText;
            //                 }
            // );

            $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                scope: $scope
              }).then(function(popover) {
                $scope.popover = popover;
              });

            $scope.openPopover = function($event) {
                console.log("popover");
                $scope.popover.show($event);
            };

            
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
        menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here

             .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', 'corporateFactory','promotionFactory',function($scope, menuFactory, corporateFactory, baseURL,corporateFactory,promotionFactory) {

                        $scope.baseURL = baseURL;
                        $scope.leader = corporateFactory.get({id:3});
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = menuFactory.get({id:0})
                        .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
                        );
                        $scope.promotion = promotionFactory.get({id:0});
      }])

        .controller('AboutController', ['$scope', 'corporateFactory','baseURL', function($scope, corporateFactory,baseURL) {
                    $scope.baseURL=baseURL;
                    $scope.leaders = corporateFactory.query();
                    console.log($scope.leaders);
            
                    }])
        .controller('FavoritesController', ['$scope', 'dishes','favorites','menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', 
            function ($scope, dishes,favorites,menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) 
        {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;
    // $ionicLoading.show({
    //     template: '<ion-spinner></ion-spinner> Loading...'
    // });
    $scope.favorites = favorites;
    $scope.dishes = dishes;
    // $scope.dishes = menuFactory.getDishes().query(
    //     function (response) {
    //         $scope.dishes = response;
    //            $timeout(function () {
    //             $ionicLoading.hide();
    //         }, 1000);
    //     },
    //     function (response) {
    //         $scope.message = "Error: " + response.status + " " + response.statusText;
    //          $timeout(function () {
    //             $ionicLoading.hide();
    //         }, 1000);
    //     });
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
        // var links =document.getElementsByClassName("self-checkable");
        // for( var i =0;i<links.length;i++){
        //     links[i].firstChild.onclick=_handler;
        //     console.log(links[i].firstChild);
        // }
        // var _handler =function (e) {
        //     alert(1);
        //     $scope.shouldShowDelete = !$scope.shouldShowDelete;
        //      e.target.removeEventListener(e.type, arguments.callee);
        //      alert("You'll only see this once!");
        // }
    }

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });
        
        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

    }


   }])

    .filter('favoriteFilter', function () {
        return function (dishes, favorites) {
            var out = [];
            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < dishes.length; j++) {
                    if (dishes[j].id === favorites[i].id)
                        out.push(dishes[j]);
                }
            }
        return out;

    }});

;
