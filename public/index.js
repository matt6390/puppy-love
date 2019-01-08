/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      users: []
    };
  },
  created: function() {
    axios.get('/likes').then(function(response) {
      var params = response.data;
      axios.get("/users", params).then(function(users) {
        this.users = users.data;
      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.errors);
      });
    }.bind(this));

  },
  methods: {
    swipeLeft: function(profile) {
      var params = {swiped_id: profile.id, status: 0};
      axios.post("/likes", params).then(function(respose) {
        console.log(respose.data);

      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.errors);
      });
    },

    swipeRight: function(profile) {
      var params = {swiped_id: profile.id, status: 1};
      console.log(profile);
    },
    myLikes: function() {
      axios.get('/likes').then(function(response) {
        console.log(response.data);
      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.errors);
      });
    }
  },
  computed: {}
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      age: "",
      gender: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        gender: this.gender,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/login");
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});