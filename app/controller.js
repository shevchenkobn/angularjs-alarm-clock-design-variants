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
        time = new Date(time);
        if (typeof name !== 'string') {
          throw new TypeError('Name must be a string');
        }
        if (isTurnedOn && typeof isTurnedOn !== 'boolean') {
          throw new TypeError('isTurnedOn must be a boolean value');
        }
        var isArray = Object.prototype.toString.call(days) === '[object Array]';
        if (!(isArray || typeof days === 'object' &&
          (days.toString() === '[object Days]' ||
          days.getValues))) {
          throw new TypeError('Days must be a Days instance or an array');
        }
        var daysArray;
        if (isArray) {
          daysArray = days.slice();
          days = new Days(days);
        } else {
          daysArray = days.getSelected();
          days = new Days(daysArray);
        }
        function getTimeString(arg) {
          if (arg === undefined) {
            arg = time;
          }
          return AlarmClock.formatNumber(time.getHours()) + ':' +
            AlarmClock.formatNumber(time.getMinutes());
        }
        function getDaysArray(crop, length) {
          var arrayCopy = [];
          if (!daysArray.length) {
            arrayCopy.push('Next time');
          }
          if (crop) {
            for (var i = 0; i < daysArray.length; i++) {
              arrayCopy.push(AlarmClock.cropDay(daysArray[i], length));
            }
          } else {
            arrayCopy = daysArray.slice();
          }
          return arrayCopy;
        }
        return {
          name: name,
          isTurnedOn: isTurnedOn,
          getHours: time.getHours.bind(time),
          getMinutes: time.getMinutes.bind(time),
          timeString: getTimeString(),
          getDaysArray: getDaysArray,
          croppedDaysArray: getDaysArray(true, 3)
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
      AlarmClock.cropDay = function(day, length) {
        if (typeof length === 'undefined') {
          length = 3;
        }
        return day.slice(0, length).toUpperCase();
      };
      $scope.alarmName = '';
      $scope.isTurnedOn = true;
      $scope.days = new Days();
      $scope.daysArray = $scope.days.getSelected();
      $scope.cropDay = AlarmClock.cropDay;
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
        !isNaN(+$scope.hours) ? date.setHours($scope.hours) :
          date.setHours(0);
        !isNaN(+$scope.minutes) ? date.setMinutes($scope.minutes) :
          date.setMinutes(0);
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
      $scope.alarmList = [new AlarmClock(setTime(), ['Monday', 'Tuesday', 'Friday'],
        'Alarm name', $scope.isTurnedOn)];
      var editAlarm = {
        set: function(option) {
          this.index = option;
          $scope.hours = $scope.alarmList[option].getHours();
          $scope.minutes = $scope.alarmList[option].getMinutes();
          daysArrayChanged = false;// for resolving watchers' circular dependency
          $scope.daysArray = $scope.alarmList[option].getDaysArray();
          $scope.alarmName = $scope.alarmList[option].name;
          $scope.isTurnedOn = $scope.alarmList[option].isTurnedOn;
        },
        save: function() {
          $scope.alarmList[this.index] = new AlarmClock($scope.time, $scope.days,
            $scope.alarmName, $scope.isTurnedOn);
          delete this.index;
        },
        index: undefined
      };
      $scope.dialogAction = '';
      $scope.openDialog = function(event, action, index) {
        switch (action) {
          case 'new':
            $scope.dialogAction = 'Add new alarm';
            break;
          case 'edit':
            $scope.dialogAction = 'Edit alarm clock';
            editAlarm.set(index);
            break;
          case 'remove':
            var name = $scope.alarmList[index].name ? ' with name "' +
              $scope.alarmList[index].name + '"' : '';
            var confirm = $mdDialog.confirm()
              .targetEvent(event)
              .title('Alarm removing')
              .textContent('Are you sure you want to remove ' +
                'alarm #' + index + name + '?')
              .ok('Remove')
              .cancel('cancel');
            $mdDialog.show(confirm)
              .then(function() { $scope.alarmList.splice(index, 1); });
            return;
        }
        $mdDialog.show({
          contentElement: '#mainDialog',
          parent: angular.element(document.body),
          targetEvent: event,
          fullscreen: true
        });
      };
      $scope.closeDialog = function(event, action) {
        switch (action) {
          case 'save':
            if (typeof editAlarm.index === 'number') {
              editAlarm.save();
            } else {
              $scope.alarmList.push(new AlarmClock($scope.time, $scope.days,
                $scope.alarmName, $scope.isTurnedOn));
            }
            break;
          // default:
          //   if (typeof editAlarm.index === 'number') {
          //     $scope.alarmList[editAlarm.index];
          //   }
        }
        $mdDialog.hide();
      };
    };
  })();
