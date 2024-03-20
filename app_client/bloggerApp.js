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


app.controller('BlogListController', function BlogListController($scope, $http) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    vm.message = "Loading blog list...";

    $http.get('/api/blogs')
        .then(function(response) {
            // Success callback
            vm.blogs = response.data;
            vm.message = ""; 
        })
        .catch(function(error) {
            // Error callback
            vm.message = "Error loading blog list"; // Display error message
            console.error("Error loading blog list:", error);
        });
});


app.controller('BlogAddController', function BlogListController($scope, $location) {
    var vm = this;
    vm.pageHeader = {
        title: "BlogAdd"
    };
    vm.message = "Add a Blog";

});

