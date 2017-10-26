
angular.module('alarmClock', ['ngMaterial', 'mdPickers'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('purple')
      .accentPalette('pink')
      .warnPalette('deep-orange')
      .backgroundPalette('grey');
  })
  .controller('alarmController', alarmController);
