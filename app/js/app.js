'use strict';

/* App Module */

var researchApp = angular.module('researchApp', [
  'ngRoute',
  'researchControllers'
]);

researchApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'partials/overview.html',
        controller: 'OverviewListCtrl'
      }).
      when('/project/:projectId', {
        templateUrl: 'partials/project.html',
        controller: 'ProjectDetailCtrl'
      }).
      when('/project/:projectId/session/:sessionId', {
        templateUrl: 'partials/session.html',
        controller: 'SessionDetailCtrl'
      }).
      when('/project/:projectId/session/:sessionId/randomView', {
        templateUrl: 'partials/random.html',
        controller: 'RandomViewCtrl'
      }).
      otherwise({
        redirectTo: '/overview'
      });
  }]);
