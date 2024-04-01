var app = angular.module('bloggerApp');
console.log("here");
app.config(function ($routeProvider) {
  $routeProvider
      .when('/Login', {

          templateUrl: 'pages/Login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
      })
    });
//*** Authentication Service and Methods **
app.service('authentication', authentication);
    authentication.$inject = ['$window', '$http'];
    function authentication ($window, $http) {
    
        var saveToken = function (token) {
            $window.localStorage['blog-token'] = token;
        };
                                       
        var getToken = function () {
            return $window.localStorage['blog-token'];
        };
        var saveUser = function(user){
          $window.localStorage['blog-user'] = JSON.stringify(user);
        };
        
        var register = function(user) {
            console.log('Registering user ' + user.email + ' ' + user.password);
            return $http.post('/api/register', user).success(function(data){
                saveToken(data.token);
          });
        };
     
        var login = function(user) {
           console.log('Attempting to login user ' + user.email + ' ' + user.password);
           //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post('/api/login', user).success(function(data) {
              saveToken(data.token);
              saveUser(user);
           });
        };
        
        var logout = function() {
            $window.localStorage.removeItem('blog-token');
        };
        
        var isLoggedIn = function() {
          var token = getToken();

          if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
          } else {
            return false;
          }
        };

        var currentUser = function() {
          if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
              email : payload.email,
              name : payload.name
            };
          }
        };
          console.log(currentUser);
        return {
          saveToken : saveToken,
          getToken : getToken,
          register : register,
          login : login,
          logout : logout,
          isLoggedIn : isLoggedIn,
          currentUser : currentUser
        };
}

app.controller('LoginController', ['$http', '$location', 'authentication', function LoginController($htttp, $location, authentication) {
  var vm = this;

  vm.pageHeader = {
    title: 'Sign in to Blogger'
  };

  vm.credentials = {
    email : "",
    password : ""
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

  vm.doLogin = function() {
    vm.formError = "";
    authentication
      .login(vm.credentials)
      .error(function(err){
        var obj = err;
        vm.formError = obj.message;
      })
      .then(function(){
        $location.search('page', null); 
        $location.path(vm.returnPage);
        vm.user = authentication.currentUser();
      });
  };
}]);


app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($htttp, $location, authentication) {
    var vm = this;
    
    vm.pageHeader = {
      title: 'Create a new Blooger account'
    };
    
    vm.credentials = {
      name : "",
      email : "",
      password : ""
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

    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .error(function(err){
          vm.formError = "Error registering. Try again with a different email address."
          //vm.formError = err;
        })
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
        });
    };
}]); 


function YourController($scope, authentication) {
  // Now you can access the methods and properties of the authentication service
  // For example:
  $scope.token = authentication.getToken();
  $scope.currentUser = authentication.currentUser();
  
  // You can call other methods as well like login, register, logout, etc.
  
  // Example usage of isLoggedIn
  $scope.isLoggedIn = authentication.isLoggedIn();
  
  // Example usage of saveUser and getUser
  $scope.saveUser = function(user) {
      authentication.saveUser(user);
  };

  $scope.getUser = function() {
      return authentication.getUser();
  };
}