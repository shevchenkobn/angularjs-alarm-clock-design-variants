
angular.module('alarmClock', ['ngMaterial', 'mdPickers'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('purple')
      .accentPalette('pink')
      .warnPalette('light-green')
      .backgroundPalette('grey');
  })
  .controller('alarmController', alarmController);
