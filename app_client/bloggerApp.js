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
        .when('/blogEdit/:blogId', {
            templateUrl: 'pages/blogEdit.html', // Assuming you have a blog add page
            controller: 'BlogEditController', // Assuming you have a corresponding controller
            controllerAs: 'vm'
        })
        .when('/blogDelete/:blogId', {
            templateUrl: 'pages/blogDelete.html', // Assuming you have a blog add page
            controller: 'BlogDeleteController', // Assuming you have a corresponding controller
            controllerAs: 'vm'
        })
        
        
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
        .then(function (response) {
            vm.blogs = response.data;
            vm.message = "";
        })
        .catch(function (error) {
            vm.message = "Error loading blog list";
            console.error("Error loading blog list:", error);
        });
});


app.controller('BlogAddController', function BlogListController($scope, $location, $http) {
    var vm = this;
    vm.pageHeader = {
        title: "BlogAdd"
    };
    vm.message = "Add a Blog";

    $scope.submit = function() {
        let today = new Date();
        var blogData = {
            author: $scope.Author,
            blogTitle: $scope.bTitle,
            blogText: $scope.bText, 
            date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
        };
        
        $http.post('/api/blogs', blogData)
            .then(function(response) {
                console.log("Blog added :", response.data);
                $location.path('/blogList');
            })
            .catch(function(error) {
                console.error("Error adding blog:", error);
            });
    };


});

app.controller('BlogEditController', function BlogEditController($http, $routeParams, $scope,$location) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog Edit"
    };
    vm.message = "Edit a blog";
    vm.blogId = $routeParams.blogId;

    $http.get('/api/blogs/' + vm.blogId)
        .then(function (response) {
            vm.blog = response.data;
            vm.message = "";
        })
        .catch(function (error) {
            vm.message = "Error loading blog";
            console.error("Error loading blog:", error);
        });
    
    $scope.editBlog = function() {
        $http.put('/api/blogs/' + vm.blogId, vm.blog) 
            .then(function(response) {
                console.log("Blog updated:", response.data);
                $location.path('/blogList');
            })
            .catch(function(error) {
                console.error("Error updating blog:", error);
                });
        };
});

app.controller('BlogDeleteController', function($http, $routeParams, $scope, $location) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog delete"
    };
    vm.message = "delete a blog";
    vm.blogId = $routeParams.blogId;

    $http.get('/api/blogs/' + vm.blogId)
        .then(function(response) {
            vm.blog = response.data;
            vm.message = "";
        })
        .catch(function(error) {
            vm.message = "Error loading blog";
            console.error("Error loading blog:", error);
        });

    // Function to delete the blog
    $scope.deleteBlog = function() {
        $http.delete('/api/blogs/' + vm.blogId)
            .then(function(response) {
                console.log("Blog deleted:", response.data);
                // Redirect to blog list page after successful deletion
                $location.path('/blogList');
            })
            .catch(function(error) {
                console.error("Error deleting blog:", error);
                // Handle error, show user-friendly message if needed
            });
    };
});



