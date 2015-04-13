'use strict';

/* Controllers */

var researchControllers = angular.module('researchControllers', ["firebase", "youtube-embed", "readableTime"]);

//list of projects

researchControllers.controller('OverviewListCtrl', ['$scope', '$routeParams', '$firebaseArray',
	function($scope, $routeParams, $firebaseArray) {

		var projects =  $firebaseArray(new Firebase("https://blistering-torch-4438.firebaseio.com/projects/"));
		$scope.projects = projects;

		$scope.addProject = function(project_title, project_summary, project_date) {
			var nextId = projectCount+1;
			console.log(projects.length+1);
			projects.$add({title: project_title, summary : project_summary, project_date : project_date, projectId : projects.length+1})
			
			//reset fields;
			
			$scope.project_title = "";
			$scope.project_summary = "";
			$scope.project_date = "";
		}
		
		
	}
  ]);
  

// Controller for list of sessions in project page
  
researchControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject',
  function($scope, $routeParams, $firebaseArray, $firebaseObject) {
	  	
	  var sessionCount=0;
		
		//get the active project information - the user may have not chosen this but deep linked
		var projRef = $firebaseObject(new Firebase("https://blistering-torch-4438.firebaseio.com/projects/"  + $routeParams.projectId));
		$scope.projDetails = projRef;
	 	//get the session information
		var ref =  $firebaseArray(new Firebase("https://blistering-torch-4438.firebaseio.com/sessions/"  + $routeParams.projectId));
		ref.$loaded().then(function() {
			sessionCount = ref.length;
			$scope.sessions = ref;
		});
		
		//can I write a function that just takes generic form submissions and maps it to the DB - save repeating.
		$scope.addSession = function(newSessionTitle, newSessionDate, newVideoId, newSessionSummary) {
			var nextSession = $routeParams.projectId + "-" + (sessionCount+1);
			ref.$add({date: newSessionDate, sessionID : nextSession, summary : $scope.newSessionSummary, videoId : newVideoId, title : $scope.newSessionTitle, userID : "a" });
			$scope.newSessionTitle = $scope.newVideoId = $scope.newSessionDate = $scope.newSessionSummary ="";
	  }
	}
]);
	
// Controller for Sessions section
	
researchControllers.controller('SessionDetailCtrl', ['$scope', '$routeParams','$firebaseArray', '$firebaseObject',
	function($scope, $routeParams, $firebaseArray, $firebaseObject) {
			
		$scope.projectId = $routeParams.projectId;
		
		var addObservationAt = 0;
		var commentMode = false;
		
			
		var sessionComments = $firebaseArray(new Firebase("https://blistering-torch-4438.firebaseio.com/comments/" + $routeParams.sessionId));
		sessionComments.$loaded().then(function() {
			$scope.comments = sessionComments;
		});


		var projectDetails = $firebaseObject(new Firebase("https://blistering-torch-4438.firebaseio.com/sessions/" + $routeParams.projectId + "/" +  $routeParams.sessionId));
		projectDetails.$loaded().then(function() {
			$scope.sessionInfo = projectDetails;
			$scope.researchVid = $scope.sessionInfo.videoId;
		});

		//video stuff
		
		// $scope.researchVid = $scope.sessionInfo.videoId;

		$scope.$on('youtube.player.ready', function () {
			$scope.researchVidPlayer.playVideo();
		});
			
			
		$scope.checkTime = function(){
			$scope.time = $scope.researchVidPlayer.getCurrentTime();
			$scope.$parent.$broadcast('checkTime', $scope.time); // going down!
		}

		$scope.$on('youtube.player.seek', function (event, data) {
			$scope.researchVidPlayer.seekTo((data));
			$scope.researchVidPlayer.playVideo();
		});

		$scope.timer = setInterval($scope.checkTime,1000);

		// message stuff

		$scope.time;


		$scope.addComment = function(text) {
			console.log(text);
			sessionComments.$add({text: text, time : addObservationAt});
			$scope.newMessageText = "";
			commentMode = false;
			$scope.commentMode = commentMode;
		}


		$scope.$on('checkTime', function (event, data) {
			$scope.time = data;
		  });

		$scope.seekTo = function(time){
			$scope.$parent.$broadcast('youtube.player.seek', time); // going down!
		}

		$scope.setSelected = function() {
			if ($scope.lastSelected) {
				$scope.lastSelected.selected = '';
			}
			this.selected = 'selected';
				$scope.lastSelected = this;
			}

		$scope.toggleEdit = function(_el){
			if(!this.edit){
				this.edit = true;
				this.editState = "Done";
			}
			else {
				this.edit= false;
				this.editState = "Edit";
			  }
			}
			
		$scope.removeComment = function(_el){
			sessionComments.$remove(_el);
		}
		
		$scope.setMarker = function(){
			$("#observation-input").focus();
			addObservationAt = $scope.time;
			$scope.addObservationAt = addObservationAt;
			commentMode = true;
			$scope.commentMode = commentMode;
			
		}
		
		$scope.cancelAddObservation = function(){
			commentMode = false;
			$scope.commentMode = commentMode;
		}

	}
]);


