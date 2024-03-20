var app = angular.module('blogApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/blogList', {
            templateUrl: 'pages/blogList.html', // Assuming you have a blog list page
            controller: 'BlogListController', // Assuming you have a corresponding controller
            controllerAs: 'vm'
        })
        .when('/blogAdd', {
            templateUrl: 'pages/blogAdd.html', // Assuming you have a blog add page
            controller: 'BlogAddController', // Assuming you have a corresponding controller
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/home' });
});

app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "My Blogs"
    };
    vm.message = "Welcome to my blog site!";
});

app.controller('BlogListController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "BlogList"
    };
    vm.message = "this is a blog list";

    var ele = document.getElementById("navbar");
    console.log(ele.className);
});