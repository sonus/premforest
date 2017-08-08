angular.module('SimpleRESTIonic.controllers', [])
    .controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
      var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){

          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

          //Wait until the map is loaded
          google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

          });

        }, function(error){
          console.log("Could not get location");
        });
    })
    .controller('LoginCtrl', function ($state, $rootScope, LoginService, $cordovaFacebook, $cordovaGooglePlus, Facebook) {

      var vm = this;

      function signin() {
        LoginService.signin(vm.email, vm.password)
          .then(function () {
            onLogin();
          }, function (error) {
            console.log(error)
          })
      }

      function anonymousLogin() {
        LoginService.anonymousLogin();
        onLogin('Guest');
      }

      function onLogin(username) {
        $rootScope.$broadcast('authorized');
        $state.go('tab.dashboard');
        LoginService.getUsername()
          .then(function (response) {
            vm.username = username || response.data;
          })
      }

      function signout() {
        LoginService.signout()
          .then(function () {
            //$state.go('tab.login');
            $rootScope.$broadcast('logout');
            $state.reload();
            vm.username = '';
          })
      }

      function socialSignin(provider) {
        LoginService.socialSignin(provider)
          .then(onValidLogin, onErrorInLogin);

      }

      function socialSignup(provider) {
        LoginService.socialSignup(provider)
          .then(onValidLogin, onErrorInLogin);

      }

      var onValidLogin = function (response) {
        onLogin();
        vm.username = response.data || vm.username;
      };

      var onErrorInLogin = function (rejection) {
        vm.error = rejection.data;
        $rootScope.$broadcast('logout');

      };

      vm.inAppSocialSignin = function(provider) {
        switch(provider)
        {
          case 'facebook':
            $cordovaFacebook.login(["public_profile", "email", "user_friends"])
            .then(function(success) {
              console.log('connected to facebook');
              LoginService.socialSigninWithToken('facebook', res.authResponse.accessToken).then(
                function(resBackand){
                  console.log('social', resBackand);
                },
                function(errBackand) {
                  console.log('err', errBackand);
                }
              );
            }, function (error) {
              console.log('error');
              console.log(err);
            });
          break;

          case 'google':
            $cordovaGooglePlus.login({})
            .then(function(res) {
              console.log('connected to google');
              LoginService.socialSigninWithToken('google', res.accessToken).then(
                function(resBackand){
                  console.log('social', resBackand);
                },
                function(errBackand) {
                  console.log('err', errBackand);
                }
              );
            }, function(err) {
              console.log('error');
              console.log(err);
            });
          break;
        }

      }

      vm.socialWeb = function(provider) {
        switch(provider)
        {
          case 'facebook':
            Facebook.login(function(response) {
              LoginService.socialSigninWithToken('facebook', response.authResponse.accessToken).then(
                function(resBackand){
                  console.log('social', resBackand);
                },
                function(errBackand) {
                  console.log('err', errBackand);
                }
              );
            });
          break;
        }
      }


      vm.username = '';
      vm.error = '';
      vm.signin = signin;
      vm.signout = signout;
      vm.anonymousLogin = anonymousLogin;
      vm.socialSignup = socialSignup;
      vm.socialSignin = socialSignin;

      onLogin();

    })

    .controller('SignUpCtrl', function ($state, $rootScope, LoginService) {
      var vm = this;

      vm.signup = signUp;

      function signUp() {
        vm.errorMessage = '';

        LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
          .then(function (response) {
            // success
            onLogin();
          }, function (reason) {
            if (reason.data.error_description !== undefined) {
              vm.errorMessage = reason.data.error_description;
            }
            else {
              vm.errorMessage = reason.data;
            }
          });
      }


      function onLogin() {
        $rootScope.$broadcast('authorized');
        $state.go('tab.dashboard');
      }


      vm.email = '';
      vm.password = '';
      vm.again = '';
      vm.firstName = '';
      vm.lastName = '';
      vm.errorMessage = '';
    })

    .controller('DashboardCtrl', function (ItemsModel, $rootScope) {
      var vm = this;



      function goToBackand() {
        window.location = 'http://docs.backand.com';
      }

      function getAll() {
        ItemsModel.all()
          .then(function (result) {
            vm.data = result.data;
          });
      }

      function clearData() {
        vm.data = null;
      }

      function create(object) {
        ItemsModel.create(object)
          .then(function (result) {
            cancelCreate();
          });
      }

      function update(object) {
        ItemsModel.update(object.id, object)
          .then(function (result) {
            cancelEditing();
          });
      }

      function deleteObject(id) {
        ItemsModel.delete(id)
          .then(function (result) {
            cancelEditing();
          });
      }

      function initCreateForm() {
        vm.newObject = {name: '', description: ''};
      }

      function setEdited(object) {
        vm.edited = angular.copy(object);
        vm.isEditing = true;
      }

      function isCurrent(id) {
        return vm.edited !== null && vm.edited.id === id;
      }

      function cancelEditing() {
        vm.edited = null;
        vm.isEditing = false;
      }

      function cancelCreate() {
        initCreateForm();
        vm.isCreating = false;
      }

      vm.objects = [];
      vm.edited = null;
      vm.isEditing = false;
      vm.isCreating = false;
      vm.getAll = getAll;
      vm.create = create;
      vm.update = update;
      vm.delete = deleteObject;
      vm.setEdited = setEdited;
      vm.isCurrent = isCurrent;
      vm.cancelEditing = cancelEditing;
      vm.cancelCreate = cancelCreate;
      vm.goToBackand = goToBackand;
      vm.isAuthorized = false;

      $rootScope.$on('authorized', function () {
        vm.isAuthorized = true;
        getAll();
      });

      $rootScope.$on('items_updated', function () {
        vm.isAuthorized = true;
        getAll();
      });

      $rootScope.$on('logout', function () {
        clearData();
      });

      if (!vm.isAuthorized) {
        $rootScope.$broadcast('logout');
      }

      initCreateForm();
      getAll();

    });
