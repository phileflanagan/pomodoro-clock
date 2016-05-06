var app = angular.module("app", []);

app.controller('ctrl', function($scope) {
	$scope.breakTime = 5;
	$scope.workTime = 25;
	$scope.minutes = 25; //minute holder
	$scope.seconds = 0; //second holder
	$scope.isRunning = false;
	$scope.isPaused = false;
	$scope.time = 0; //in seconds
	$scope.status = "work";
	$scope.endTimer; //for clearing interval
	$scope.minOut = twoDigit($scope.workTime); //times to output
	$scope.secOut = twoDigit("0"); //setting placeholder values

	//control settings
	$scope.breakTimeMinus = function() {
		if ($scope.breakTime === 1) {
			$scope.breakTime = 60;
		} else {
			$scope.breakTime--;
		}
	};
	$scope.breakTimePlus = function() {
		if ($scope.breakTime === 60) {
			$scope.breakTime = 1;
			$scope.$apply();
		} else {
			$scope.breakTime++;
			$scope.$apply();
		}
	};

	$scope.workTimeMinus = function() {
		if ($scope.workTime === 1) {
			$scope.workTime = 60;
			$scope.minOut = twoDigit($scope.workTime);
			$scope.secOut = twoDigit("0");
		} else {
			$scope.workTime--;
			$scope.minOut = twoDigit($scope.workTime);
			$scope.secOut = twoDigit("0");
		}
	};
	$scope.workTimePlus = function() {
		if ($scope.workTime === 60) {
			$scope.workTime = 1;
			$scope.minOut = twoDigit($scope.workTime);
			$scope.secOut = twoDigit("0");
		} else {
			$scope.workTime++;
			$scope.minOut = twoDigit($scope.workTime);
			$scope.secOut = twoDigit("0");
		}
	};

	//controls timer output
	$scope.updateTimer = function() {
		$scope.time -= 1;
		$scope.minutes = Math.floor($scope.time / 60);
		$scope.seconds = Math.floor($scope.time - ($scope.minutes * 60));
		$scope.minOut = twoDigit($scope.minutes);
		$scope.secOut = twoDigit($scope.seconds);
		$scope.$apply();
	};

	//function that is called at 1sec intervals
	$scope.update = function() {
		//if statement to run when counter reaches 0; change between work/break
		if ($scope.time <= 0) {
			if ($scope.status === "work") {
				audio.play();
				$scope.status = "break";
				makeRed();
				$scope.time = $scope.breakTime * 60;
				$scope.$apply();
			} else if ($scope.status === "break") {
				audio.play();
				$scope.status = "work";
				$scope.startFunction;
				makeGreen();
				$scope.time = $scope.workTime * 60;
				$scope.$apply();
			}
		}
		$scope.updateTimer()

	};

	//start button clicked
	$scope.startTimer = function() {
		beep.play();
		$scope.time = $scope.workTime * 60;
		makeGreen();
		$scope.run();
	};

	//pause button clicked
	$scope.pauseTimer = function() {
		makeYellow();
		$scope.isPaused = true;
		clearInterval($scope.endTimer);
		$scope.isRunning = false;
	};

	//reset button clicked
	$scope.resetTimer = function() {
		makeBlue();
		$scope.isPaused = false;
		clearInterval($scope.endTimer);
		$scope.isRunning = false;
		$scope.status = "work";
			$scope.minOut = twoDigit($scope.workTime);
			$scope.secOut = twoDigit("0");
	};

	//resume button clicked
	$scope.resume = function() {
		if ($scope.status === "work") makeGreen();
		if ($scope.status === "break") makeRed();
		$scope.run();
	};

	//function to activate timer
	$scope.run = function() {
		$scope.isRunning = true;
		$scope.isPaused = false;
		$scope.endTimer = setInterval(function() {
			$scope.update();
		}, 1000);
	};
});

//two digit format for single digit numbers
function twoDigit(n) {
	return n > 9 ? "" + n : "0" + n;
};

//page colors
function makeRed() {
	jQuery('body').css("background-color", "#f24040");
	jQuery('.buttonsRow').css("border-bottom", "2px solid #fa8d8d");
	jQuery('.header').css("border-bottom", "2px solid #fa8d8d");
	jQuery('.buttonsRow span').css("color", "#f24040");
};

function makeYellow() {
	jQuery('body').css("background-color", "#c9ff36");
	jQuery('.buttonsRow').css("border-bottom", "2px solid #daff75");
	jQuery('.header').css("border-bottom", "2px solid #daff75");
	jQuery('.buttonsRow span').css("color", "#c9ff36");
};

function makeGreen() {
	jQuery('body').css("background-color", "#06ee52");
	jQuery('.buttonsRow').css("border-bottom", "2px solid #3aff7b");
	jQuery('.header').css("border-bottom", "2px solid #3aff7b");
	jQuery('.buttonsRow span').css("color", "#06ee52");
};

function makeBlue() {
	jQuery('body').css("background-color", "#0694ee");
	jQuery('.buttonsRow').css("border-bottom", "2px solid #48b7fe");
	jQuery('.header').css("border-bottom", "2px solid #48b7fe");
	jQuery('.buttonsRow span').css("color", "#0694ee");
};

//sounds for starting timers and transitioning
var beep = new Audio('https://www.freesound.org/people/KeyKrusher/sounds/154953/download/154953__keykrusher__microwave-beep.wav');

var audio = new Audio('https://www.freesound.org/people/jppi_Stu/sounds/274682/download/274682__jppi-stu__sw-school-pa-alert.wav');