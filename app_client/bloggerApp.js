var app = angular.module('blogApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/blogList', {
            templateUrl: 'pages/blogList.html', 
            controller: 'BlogListController',
            controllerAs: 'vm'
        })
        .when('/blogAdd', {
            templateUrl: 'pages/blogAdd.html', 
            controller: 'BlogAddController', 
            controllerAs: 'vm'
        })
        .when('/blogEdit/:blogId', {
            templateUrl: 'pages/blogEdit.html',
            controller: 'BlogEditController', 
            controllerAs: 'vm'
        })
        .when('/blogDelete/:blogId', {
            templateUrl: 'pages/blogDelete.html', 
            controller: 'BlogDeleteController', 
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
        .otherwise({redirectTo: '/home'});


});

app.controller('NavbarController', ['$scope', '$location','authentication', function ($scope,  $location, authentication) {
  var updateCurrentUser = function () {
      $scope.currentUser = authentication.currentUser();
  };

  updateCurrentUser();

  $scope.toggleAuth = function () {
      if ($scope.currentUser) {
          authentication.logout();
          $scope.currentUser = null;
          $location.path('/Login');
      } else {
          
          $location.path('/Login');
      }
      
  };

  $scope.$watch(function () {
    return authentication.currentUser();
}, function () {
    updateCurrentUser();
}, true);
}]);


app.controller('HomeController', ['$scope', 'authentication', function HomeController($scope, authentication) {
  var vm = this;
  vm.currentUser = authentication.currentUser();
  $scope.currentUser = vm.currentUser;

  console.log($scope.currentUser);
  vm.pageHeader = {
      title: "My Blogs"
  };
  vm.message = "Welcome to my blog site!";

}]);


app.controller('BlogListController', function BlogListController($scope, $http, authentication) {
  var vm = this;
  vm.pageHeader = {
      title: "Blog List"
  };
  vm.message = "Loading blog list...";
  vm.currentUser = authentication.currentUser();

  $http.get('/api/blogs')
      .then(function (response) {
          vm.blogs = response.data;
          vm.message = "";
      })
      .catch(function (error) {
          vm.message = "Error loading blog list";
          console.error("Error loading blog list:", error);
      });

  $scope.canEdit = function (blog) {
      return blog.email === vm.currentUser.email;
  };
});

app.controller('BlogAddController', ['$scope', '$location', '$http', 'authentication', function ($scope, $location, $http, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "BlogAdd"
    };
    vm.message = "Add a Blog";
    vm.currentUser = authentication.currentUser();
    $scope.submit = function () {
        let today = new Date();
        var blogData = {
            email: vm.currentUser.email,
            author: vm.currentUser.name,
            blogTitle: $scope.bTitle,
            blogText: $scope.bText,
            date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
        };
        console.log(blogData);

        var token = authentication.getToken();

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



app.controller('BlogEditController', function BlogEditController($http, $routeParams, $scope, $location, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog Edit"
    };
    vm.message = "Edit a blog";
    vm.blogId = $routeParams.blogId;
        vm.currentUser = authentication.currentUser();

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

      var token = authentication.getToken();

        var config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        $http.put('/api/blogs/' + vm.blogId, vm.blog, config)
            .then(function (response) {
                console.log("Blog updated:", response.data);
                $location.path('/blogList');
            })
            .catch(function (error) {
                console.error("Error updating blog:", error);
            });
            
    };
});

app.controller('BlogDeleteController', function ($http, $routeParams, $scope, $location, authentication) {
  var vm = this;
  vm.pageHeader = {
      title: "Blog delete"
  };
  vm.message = "delete a blog";
  vm.blogId = $routeParams.blogId;
  vm.currentUser = authentication.currentUser(); 
  
  $http.get('/api/blogs/' + vm.blogId)
      .then(function (response) {
          vm.blog = response.data;
          vm.message = "";
      })
      .catch(function (error) {
          vm.message = "Error loading blog";
          console.error("Error loading blog:", error);
      });

  $scope.deleteBlog = function () {

    var token = authentication.getToken();

        var config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
      $http.delete('/api/blogs/' + vm.blogId,config)
          .then(function (response) {
              console.log("Blog deleted:", response.data);
            
              $location.path('/blogList');
          })
          .catch(function (error) {
              console.error("Error deleting blog:", error);
              
          });
         
  };

  $scope.canDelete = function () {
      if (!vm.blog || !vm.currentUser) return false; 
      return vm.blog.author === vm.currentUser.email; 
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
          .then(function () {
              $location.search('page', null);
              $location.path(vm.returnPage);
          })
          .catch(function (err) {
              vm.formError = "Invalid Username or Password, try again.";
        
              vm.credentials.email = "";
              vm.credentials.password = "";
          });
  };


  $scope.$watch(function () {
    return authentication.currentUser();
}, function () {
    updateCurrentUser();
}, true);
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
            .then(function () {
                $location.search('page', null);
                vm.registrationSuccess = true;
                $location.path('/Login');
            })
            .catch(function (err) {
                console.log("in error");
                vm.formError = "Error registering. Try again with a different email address."
                
            });


            
    };
}]);



app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication($window, $http) {
    var saveToken = function (token) {
        $window.sessionStorage['blog-token'] = token;
    };

    var getToken = function () {
        return $window.sessionStorage['blog-token'];
    };

    var saveUser = function (user) {
        $window.sessionStorage['blog-user'] = JSON.stringify(user);
    };
    var getUser = function () {
        return JSON.parse($window.sessionStorage['blog-user'] || '{}');
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
            saveToken(response.data.token); 
            saveUser(response.data.user); 

            return response.data; 
        }).catch(function (error) {
            
            console.error('Error logging in:', error);
            throw error;
        });
    };

    var logout = function () {
        $window.sessionStorage.removeItem('blog-token');

    };

    var isLoggedIn = function () {
        var token = getToken();
        if (token) {
            try {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > (Date.now() / 1000);
            } catch (error) {
                console.error('Error decoding token payload:', error);
                return false;
            }
        } else {
            return false; 
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





