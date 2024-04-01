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
        .when('/Login', {
            templateUrl: 'pages/Login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .when('/Register', {
            templateUrl: 'pages/Register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })


});

app.controller('NavbarController', ['$scope', 'authentication', function ($scope, authentication) {
    $scope.currentUser = authentication.currentUser();

    // Watch for changes in the currentUser object
    $scope.$watch(function () {
        return authentication.currentUser().email;
    }, function (newVal) {
        $scope.currentUserEmail = newVal;
    });


    $scope.logout = function () {
        authentication.logout();
        $scope.currentUser = null;
    };
}]);


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


app.controller('BlogAddController', ['$scope', '$location', '$http', 'authentication', function ($scope, $location, $http, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "BlogAdd"
    };
    vm.message = "Add a Blog";

    $scope.submit = function () {
        let today = new Date();
        var blogData = {
            author: $scope.author,
            blogTitle: $scope.bTitle,
            blogText: $scope.bText,
            date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
        };
        console.log(blogData);

        // Retrieve the user token from local storage
        var token = authentication.getToken();

        // Set up headers with the user token
        var config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        $http.post('/api/blogs', blogData, config)
            .then(function (response) {
                console.log("Blog added:", response.data);
                $location.path('/blogList');
            })
            .catch(function (error) {
                console.error("Error adding blog:", error);
            });
    };
}]);



app.controller('BlogEditController', function BlogEditController($http, $routeParams, $scope, $location) {
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

    $scope.editBlog = function () {
        $http.put('/api/blogs/' + vm.blogId, vm.blog)
            .then(function (response) {
                console.log("Blog updated:", response.data);
                $location.path('/blogList');
            })
            .catch(function (error) {
                console.error("Error updating blog:", error);
            });
    };
});

app.controller('BlogDeleteController', function ($http, $routeParams, $scope, $location) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog delete"
    };
    vm.message = "delete a blog";
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

    // Function to delete the blog
    $scope.deleteBlog = function () {
        $http.delete('/api/blogs/' + vm.blogId)
            .then(function (response) {
                console.log("Blog deleted:", response.data);
                // Redirect to blog list page after successful deletion
                $location.path('/blogList');
            })
            .catch(function (error) {
                console.error("Error deleting blog:", error);
                // Handle error, show user-friendly message if needed
            });
    };
});



app.controller('LoginController', ['$scope', '$location', 'authentication', function ($scope, $location, authentication) {
    var vm = this;

    vm.pageHeader = {
        title: 'Sign in to Blogger'
    };

    vm.credentials = {
        email: "",
        password: ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
        vm.formError = "";
        if (!vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
        } else {
            vm.doLogin();
        }
    };

    vm.doLogin = function () {
        vm.formError = "";
        authentication
            .login(vm.credentials)
            .catch(function (err) {
                vm.formError = err.message;
            })
            .then(function () {

                $location.search('page', null);
                $location.path(vm.returnPage);
            });
    };

    $scope.$watch(function () {
        return authentication.currentUser();
    }, function (newVal) {
        $scope.currentUser = newVal;
    });
}]);

app.controller('RegisterController', ['$http', '$location', 'authentication', function RegisterController($htttp, $location, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: 'Create a new Blooger account'
    };

    vm.credentials = {
        name: "",
        email: "",
        password: ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
        vm.formError = "";
        if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
        } else {
            vm.doRegister();
        }
    };

    vm.doRegister = function () {
        vm.formError = "";
        authentication
            .register(vm.credentials)
            .catch(function (err) {
                vm.formError = "Error registering. Try again with a different email address."
                //vm.formError = err;
            })
            .then(function () {
                $location.search('page', null);
                $location.path(vm.returnPage);
                vm.registrationSuccess = true;
            });
    };
}]);



app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication($window, $http) {
    var saveToken = function (token) {
        $window.localStorage['blog-token'] = token;
    };

    var getToken = function () {
        return $window.localStorage['blog-token'];
    };

    var saveUser = function (user) {
        $window.localStorage['blog-user'] = JSON.stringify(user);
    };
    var getUser = function () {
        return JSON.parse($window.localStorage['blog-user'] || '{}');
    };

    var register = function (user) {
        console.log('Registering user ' + user.email + ' ' + user.password);
        return $http.post('/api/register', user).then(function (data) {
            saveToken(data.token);
            saveUser(user);
        });
    };

    var login = function (user) {
        console.log('Attempting to login user ' + user.email + ' ' + user.password);
        return $http.post('/api/login', user).then(function (response) {
            saveToken(response.data.token); // Save the token from the response
            saveUser(user);
            return response.data; // Return the entire response data
        }).catch(function (error) {
            // Handle errors, log or display error messages
            console.error('Error logging in:', error);
            throw error; // Rethrow the error for the caller to handle
        });
    };

    var logout = function () {
        $window.localStorage.removeItem('blog-token');
    };

    var isLoggedIn = function () {
        var token = getToken();
        if (token) {
            try {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                // Check if the token expiration time (exp) is greater than the current time
                return payload.exp > (Date.now() / 1000);
            } catch (error) {
                console.error('Error decoding token payload:', error);
                return false; // Handle decoding error gracefully
            }
        } else {
            return false; // No token found
        }
    };



    var currentUser = function () {
        if (isLoggedIn()) {
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
                email: payload.email,
                name: payload.name
            };
        }
    };
    return {
        saveToken: saveToken,
        getToken: getToken,
        register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        saveUser: saveUser,
        getUser: getUser
    };
}





