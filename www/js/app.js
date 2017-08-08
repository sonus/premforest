// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services', 'ngCordova', 'facebook'])

    .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider, FacebookProvider) {


      // change here to your appName
      BackandProvider.setAppName('premforest');

      BackandProvider.setSignUpToken('33b856d5-5044-43d8-8a64-3ee0c8d594b9');

      // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access
      BackandProvider.setAnonymousToken('c372e8b5-0daa-492d-872e-3cb465789315');

      BackandProvider.runSocket(true);

      // if ionic web app to be shared in facebook feed
      FacebookProvider.init('YOUR_APP_ID');

      $stateProvider
      // setup an abstract state for the tabs directive
        .state('tab', {
          url: '/tabs',
          abstract: true,
          templateUrl: 'templates/tabs.html'
        })
        .state('tab.map', {
          url: '/map',
          views: {
            'tab-map': {
              templateUrl: 'templates/tab-map.html',
              controller: 'MapCtrl as vm'
            }
          }
        })
        .state('tab.dashboard', {
          url: '/dashboard',
          views: {
            'tab-dashboard': {
              templateUrl: 'templates/tab-dashboard.html',
              controller: 'DashboardCtrl as vm'
            }
          }
        })
        .state('tab.login', {
          url: '/login',
          views: {
            'tab-login': {
              templateUrl: 'templates/tab-login.html',
              controller: 'LoginCtrl as vm'
            }
          }
        })
        .state('tab.signup', {
              url: '/signup',
              views: {
                'tab-signup': {
                  templateUrl: 'templates/tab-signup.html',
                  controller: 'SignUpCtrl as vm'
                }
              }
            }
        );

      $urlRouterProvider.otherwise('/tabs/login');
      $httpProvider.interceptors.push('APIInterceptor');
    })

    .run(function ($ionicPlatform, $rootScope, $state, LoginService) {

      $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }

      });

      function unauthorized() {
        console.log("user is unauthorized, sending to login");
        $state.go('tab.login');
      }

      function signout() {
        LoginService.signout();
      }

    });
