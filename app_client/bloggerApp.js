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
        .when('/friends', {
            templateUrl: 'pages/friends.html',
            controller: 'friendsController',
            controllerAs: 'vm'
        })
        .when('/chat/:friendEmail',
        {
            templateUrl: 'pages/chat.html',
            controller: 'ChatController',
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
        password: "",
        friends: [],
        friendRequests: []
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

app.controller('friendsController', ['$http', '$routeParams', '$scope', '$location', 'authentication', '$interval', function friendsController($http, $routeParams, $scope, $location, authentication, $interval) {
    var vm = this;


    var loadFriendRequestsPeriodically = function() {
        var currentUserEmail = authentication.currentUser().email;
        $http.get('/api/friendRequests/' + currentUserEmail)
          .then(function (response) {
              vm.friendRequests = response.data;
              vm.message = "";
          })
          .catch(function (error) {
              vm.message = "Error loading friend requests";
              console.error("Error loading friend requests:", error);
          });
    };

    var friendRequestsPolling = $interval(loadFriendRequestsPeriodically, 3000);

    $scope.$on('$destroy', function() {
        if (angular.isDefined(friendRequestsPolling)) {
            $interval.cancel(friendRequestsPolling);
            friendRequestsPolling = undefined;
        }
    });


    $scope.openChat = function(friend) {
        
        var requestData = {
            messageContent: '', 
            friendEmail: friend.email,
            userEmail: currentUserEmail
        };

        $http.post('/api/chats/' + currentUserEmail + '/' + friend.email, requestData)
            .then(function(response) {
                console.log('Chat created:', response.data);
            })
            .catch(function(error) {
                console.error('Error creating chat:', error);
            });
        
            $http.get('/api/chats/' + currentUserEmail + '/' + friend.email)
            .then(function(response) {
                console.log('getting Messages:', response.data);
            })
            .catch(function(error) {
                console.error('Error getting Messages:', error);
            });
            
        $location.path('/chat/' + friend.email);
    };

    vm.acceptFriendRequest = function(friend) {
        var currentUserEmail = authentication.currentUser().email;
        
        $http.post('/api/friendRequests/' + currentUserEmail, { friendEmail: friend.email })
            .then(function(response) {
                console.log("Friend request accepted:", response.data);
                console.log("Friend email:", friend.email);

                $http.delete('/api/friendRequests/' + currentUserEmail, {
                    headers: { 'Content-Type': 'application/json' },
                    data: { friendEmail: friend.email }
                })
                .then(function(response) {
                    console.log("Friend request removed:", response.data);
                    loadFriends(currentUserEmail);
                    loadFriendRequests(currentUserEmail);
                })
                .catch(function(error) {
                    console.error("Error removing friend request:", error);
                });
            })
            .catch(function(error) {
                console.error("Error accepting friend request:", error);
            });
    };
    
    vm.denyFriendRequest = function(friend) {
        var currentUserEmail = authentication.currentUser().email;
        
        $http.delete('/api/friendRequests/' + currentUserEmail, {
            headers: { 'Content-Type': 'application/json' },
            data: { friendEmail: friend.email }
        })
            .then(function(response) {
                console.log("Friend request removed:", response.data);
                loadFriends(currentUserEmail);
                loadFriendRequests(currentUserEmail);
            })
            .catch(function(error) {
                console.error("Error removing friend request:", error);
            });

            };

        vm.sendRequest= function(friend) {
            console.log(friend);
            $http.post('/api/friends/' + currentUserEmail, { friendEmail: friend })
            .then(function(response) {
                console.log("Friend request removed:", response.data);
                loadFriends(currentUserEmail);
                loadFriendRequests(currentUserEmail);
            })
            .catch(function(error) {
                console.error("Error removing friend request:", error);
            });

            
        };
        vm.removeFriend = function(friend){
            console.log(friend);
            $http.delete('/api/friends/' + currentUserEmail, {
                headers: { 'Content-Type': 'application/json' },
                data: { friendEmail: friend.email }
            })
            .then(function(response){
                console.log(response);
                vm.friends = response.data;
                vm.message = "";
            })
            .catch(function(error) {
                vm.message = "Error";
                console.error("error:", error);
            });
            loadFriends(currentUserEmail);
        };
        var loadFriends = function(currentUserEmail) {
        $http.get('/api/friends/' + currentUserEmail)
          .then(function (response) {
              vm.friends = response.data;
              vm.message = "";
          })
          .catch(function (error) {
              vm.message = "Error loading friend list";
              console.error("Error loading friend list:", error);
          });
    };

    var loadFriendRequests = function(currentUserEmail) { 
        $http.get('/api/friendRequests/' + currentUserEmail) 
          .then(function (response) {
                console.log(response)
              vm.friendRequests = response.data;
              vm.message = "";
          })
          .catch(function (error) {
              vm.message = "Error loading blog list";
              console.error("Error loading blog list:", error);
          });
    };
    
    var currentUserEmail = authentication.currentUser().email;
    loadFriends(currentUserEmail);
    loadFriendRequests(currentUserEmail);

}]);


app.controller('ChatController', ['$http', '$routeParams', '$scope', '$location', 'authentication', '$interval', function ChatController($http, $routeParams, $scope, $location, authentication, $interval) {
    var vm = this;
    vm.friendEmail = $routeParams.friendEmail;
     vm.currentUserEmail = authentication.currentUser().email;

    vm.getMessages = function() {
        $http.get('/api/chats/' + vm.currentUserEmail + '/' + vm.friendEmail)
            .then(function(response) {
                vm.messages = response.data.messages; 
                console.log('Messages received:', vm.messages);
            })
            .catch(function(error) {
                console.error('Error retrieving messages:', error);
            });
    };

    vm.getMessages();

    var messagesUpdateInterval = $interval(vm.getMessages, 3000);

    vm.sendMessage = function(message) {
        var requestData = {
            sender: vm.currentUserEmail, 
            content: message
        };
    
        $http.post('/api/chatSend/' + vm.currentUserEmail + '/' + vm.friendEmail, requestData)
            .then(function(response) {
                console.log('Message sent:', response.data);
                vm.getMessages();
                vm.message = ''; 
            })
            .catch(function(error) {
                console.error('Error sending message:', error);
            });
    };

    $scope.$on('$destroy', function() {
        $interval.cancel(messagesUpdateInterval);
    });
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
                name: payload.name,
            };
        }
        else {
            return null;
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





