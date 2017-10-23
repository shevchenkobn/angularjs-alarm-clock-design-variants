var alarmController = (function() {
    'use strict';
    return function($scope) {
      $scope.days = (function() {
        if (!Object.create) {
          Object.create = function inherit(proto) {
            function F() {}
            F.prototype = proto;
            var object = new F();
            return object;
          };
        }
        function Days() {
          this.Monday = false,
            this.Tuesday = false,
            this.Wednesday = false,
            this.Thursday = false,
            this.Friday = false,
            this.Saturday = false,
            this.Sunday = false;
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
          toggle: function(day) {
            this[day] = !this[day];
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
          }
        });
        return new Days();
      })();
      $scope.daysArray = $scope.days.getSelected();
      var changedByUser = false;
      $scope.setChangeByUser = function() {
        changedByUser = true;
      };
      $scope.toggleAllClick = function() {
        $scope.days.toggleAll();
        changedByUser = true;
      };
      $scope.$watch('daysArray', function(newValue, oldValue, scope) {
        if (changedByUser) {
          changedByUser = false;
        } else {
          return;
        }
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
        if (changedByUser) {
          changedByUser = false;
        } else {
          return;
        }
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
      $scope.formatNumber = function(num) {
        var str = num + '';
        return str.length > 1 ? str : '0' + str;
      };
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
    };
  })();
