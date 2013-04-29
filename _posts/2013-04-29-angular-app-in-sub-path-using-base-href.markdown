---
title: Angular App in Sub Path using base
layout: post
tags: [js, angular]
---

#### When integrating angular into a system that isn't new it's a bit of a struggle trying to get all routes to work and get the initial data in there.

At work we have recently started to integrate Angular with our current applications by serving them up from a sub path, such as: `http://myapp.com/admin/survey/123`

The problem I faced with this was that I didn't want to have to include `/admin/survey/123` in all my routes / links. There must be a better way.

## Meet the html base tag
It's not one of the most used html tags but it's great. By adding:

{% highlight html %}
<base href="/admin/survey/123/" />
{% endhighlight %}

to the top of your `<head>` all relative links now are relative to the specified base href.

So a link that would have looked like this `<a href="/admin/survey/{{"{{"}}survey.id{{"}}}}/field/{{"{{"}}field.id{{"}}}}"></a>` can now be shortened to `<a href="./field/{{"{{"}}field.id{{"}}}}"></a>`.

> Notice the period (.) before the `/` this is what makes it relative to the base tag and not the the domain.

And the same goes for all the routes. Something that would before look like this:

{% highlight js %}
var prefix = '/admin/survey/123/';

.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
 
	routeProvider
	.when(prefix, {
		templateUrl: prefix + 'partial.html',
		controller: 'PartialCtrl'
	})
	.when(prefix + 'index', {
		templateUrl: prefix + 'partial.html',
		controller: 'PartialCtrl'
	})
});
{% endhighlight %}

Could now be simplified as this.

{% highlight js %}
.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
 
	$routeProvider
	.when('/', {
		templateUrl: 'partial.html',
		controller: 'PartialCtrl'
	})
	.when('/index', {
		templateUrl: 'partial.html',
		controller: 'PartialCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
});
{% endhighlight %}

## Base href data
You may ask but how would I get hold of the survey.id or any other survey data.

By creating an Angular constant with the surveyId we can then inject where ever we want.

{% highlight js %}
<script>
	// The @survey variable is coming from play via @(survey: Survey)
	angular.module('app').constant('surveyId', '@survey.id');
</script>
{% endhighlight %}

We can then add a main app controller and survey service that loads the survey data as json from `/api/admin/survey/123` and injects it into the $rootScope

{% highlight html %}
<!doctype html>
<html ng-app="app" ng-controller="AppCtrl">
<head>
	<!-- again we are using play's variable, but it could be from any backend... -->
	<base href="/admin/survey/@survey.id/" />
	...
</head>
<body>
	...
<body>
</html>
{% endhighlight %}

And then the `AppCtrl` and `SurveyService`

{% highlight js %}
// in SurveyService.js
angular.module('app').factory('SurveyService', function ($resource) {
	return $resource('/api/admin/survey/:surveyId', {surveyId: '@id'});
});

// in AppCtrl.js
angular.module('app').controller('AppCtrl', function ($scope, $rootScope, SurveyService, surveyId) {
	// Notice how we injected the surveyId constant and SurveyService

	$rootScope.survey = SurveyService.get({surveyId: surveyId});
});
{% endhighlight %}


## Conclusion
By being able to have angular apps live under a sub path and not be bound to that specific path makes your life a lot simpler when you want to use that same app in another project.