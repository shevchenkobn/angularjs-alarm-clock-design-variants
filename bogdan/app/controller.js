var alarmController = (function() {
    'use strict';
    return function($scope, $mdDialog) {
      if (!Object.create) {
        Object.create = function inherit(proto) {
          function F() {}
          F.prototype = proto;
          var object = new F();
          return object;
        };
      }
      function Days(array) {
        this.Monday = false,
          this.Tuesday = false,
          this.Wednesday = false,
          this.Thursday = false,
          this.Friday = false,
          this.Saturday = false,
          this.Sunday = false;
        if (Object.prototype.toString.call(array) === '[object Array]') {
          for (var i = 0; i < array.length; i++) {
            if (this.hasOwnProperty(array[i])) {
              this[array[i]] = true;
            }
          }
        }
      }
      Days.prototype = Object.create({
        toggleAll: function() {
          var newValue = !this.allSelected();
          for (var day in this) {
            if (this.hasOwnProperty(day) && typeof this[day] === 'boolean') {
              this[day] = newValue;
            }
          }
        },
        someSelected: function() {
          var selectedCount = 0;
          for (var day in this) {
            if (this.hasOwnProperty(day) && typeof this[day] === 'boolean' &&
              this[day]) {
              selectedCount++;
            }
          }
          return selectedCount > 0 && selectedCount < 7;
        },
        allSelected: function() {
          for (var day in this) {
            if (this.hasOwnProperty(day) && typeof this[day] === 'boolean' &&
              !this[day]) {
              return false;
            }
          }
          return true;
        },
        getValues: function() {
          var values = [];
          for (var day in this) {
            if (this.hasOwnProperty(day) && typeof this[day] === 'boolean') {
              values.push(day);
            }
          }
          return values;
        },
        getSelected: function() {
          var values = [];
          for (var day in this) {
            if (this.hasOwnProperty(day) && typeof this[day] === 'boolean' &&
              this[day]) {
              values.push(day);
            }
          }
          return values;
        },
        toString: function() {
          return '[object Days]';
        }
      });
      function AlarmClock(time, days, name, isTurnedOn) {
        if (Object.prototype.toString.call(time) !== '[object Date]') {
          throw new TypeError('Time must be a Date instance');
        }
        if (isNaN(time.valueOf())) {
          throw new TypeError('Time is invalid');
        }
        if (typeof name !== 'string') {
          throw new TypeError('Name must be a string');
        }
        if (isTurnedOn && typeof isTurnedOn !== 'boolean') {
          throw new TypeError('isTurnedOn must be a boolean value');
        }
        var isArray = Object.prototype.toString.call(days) !== '[object Array]';
        if (isArray || typeof days === 'object' &&
          !(days.toString() === '[object Days]' ||
          days.getValues)) {
          throw new TypeError('Days must be a Days instance');
        }
        var daysArray;
        if (isArray) {
          daysArray = days;
          days = new Days(days);
        } else {
          daysArray = days.getValues();
        }
        return {
          name: name,
          getTimeString: function() {
            return AlarmClock.formatNumber(time.getHours) + ':' +
              AlarmClock.formatNumber(time.getMinutes());
          },
          getDaysArray: function() {
            return daysArray.slice();
          },
          toggle: function() {
            return isTurnedOn = !isTurnedOn;
          },
          isTurnedOn: function() {
            return isTurnedOn;
          }
        };
      }
      AlarmClock.prototype = Object.create({
        toString: function() {
          return '[object AlarmClock]';
        }
      });
      AlarmClock.formatNumber = function(num) {
        var str = num + '';
        return str.length > 1 ? str : '0' + str;
      };
      $scope.days = new Days();
      $scope.daysArray = $scope.days.getSelected();
      var daysArrayChanged = false;
      var daysChanged = false;
      $scope.$watch('daysArray', function(newValue, oldValue, scope) {
        if (daysArrayChanged) {
          daysArrayChanged = false;
          return;
        }
        daysChanged = true;
        var smallerArr;
        var biggerArr;
        newValue.length > oldValue.length ?
          (smallerArr = oldValue, biggerArr = newValue) :
          (smallerArr = newValue, biggerArr = oldValue);
        for (var i = 0; i < biggerArr.length; i++) {
          if (smallerArr.indexOf(biggerArr[i]) < 0) {
            scope.days[biggerArr[i]] = smallerArr === oldValue;
          }
        }
      }, true);
      $scope.$watch('days', function(newValue, oldValue, scope) {
        if (daysChanged) {
          daysChanged = false;
          return;
        }
        daysArrayChanged = true;
        for (var day in oldValue) {
          if (oldValue.hasOwnProperty(day) &&
            typeof oldValue[day] === 'boolean' &&
            oldValue[day] !== newValue[day]) {
            var index = scope.daysArray.indexOf(day);
            if (index >= 0) {
              scope.daysArray.splice(index, 1);
            } else {
              scope.daysArray.push(day);
            }
          }
        }
      }, true);
      $scope.hours = 9;
      $scope.minutes = 0;
      $scope.time = setTime();
      function setTime() {
        var date = new Date();
        date.setHours($scope.hours);
        date.setMinutes($scope.minutes);
        return date;
      }
      function getNumberRange(min, max) {
        var range = [];
        for (var i = min; i <= max; i++) {
          range.push(i);
        }
        return range;
      }
      $scope.getHoursRange = function() {
        return getNumberRange(0, 23);
      };
      $scope.getMinutesRange = function() {
        return getNumberRange(0, 59);
      };
      $scope.formatNumber = AlarmClock.formatNumber;
      $scope.$watch('time.getHours()', function(newVal, oldVal, scope) {
        scope.hours = newVal;
      });
      $scope.$watch('time.getMinutes()', function(newVal, oldVal, scope) {
        scope.minutes = newVal;
      });
      $scope.$watch('hours', function(newVal, oldVal, scope) {
        scope.time = setTime();
      });
      $scope.$watch('minutes', function(newVal, oldVal, scope) {
        scope.time = setTime();
      });
      $scope.openDialog = function(event, action) {
        $mdDialog.show({
          contentElement: '#testDialog',
          parent: angular.element(document.body),
          targetEvent: event,
          fullscreen: true
        });
      };
      $scope.closeDialog = function(event, action) {
        $mdDialog.hide();
      };
    };
  })();
