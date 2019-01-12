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
      axios.post("/likes", params).then(function(response) {
        console.log(response.data);
        this.users.shift();

      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.errors);
      });
    },

    swipeRight: function(profile) {
      var params = {swiped_id: profile.id, status: 1};
      axios.post("/likes", params).then(function(response) {
        this.users.shift();


        var you = {user_id: response.data.swiped_id};
        var them = {user_id: response.data.swiper_id};

        // This will run if the users Match
        if (response.data.swiper_id === profile.id) {
          axios.post("/conversations").then(function(response) {
            you.conversation_id = response.data.id;
            them.conversation_id = response.data.id;
            // conversation_user for you
            axios.post("/conversations_users", you).then(function(response) {
              // conversation_user for them
              axios.post("/conversations_users", them).then(function(response) {
                router.push("/conversations");
              }).catch(function(errors) {
                console.log(errors.response.data.errors);
              });
            }).catch(function(errors) {
              console.log(errors.response.data.errors);
            });
          });
        }
      }.bind(this));
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

var ConversationsPage = {
  template: "#conversations-page",
  data: function() {
    return {
      myId: "",
      convoId: "",
      outgoingMessage: "",
      conversations: [],
      messages: []
    };
  },
  created: function() {
    axios.get("/conversations").then(function(response) {
      this.conversations = response.data;
      this.myId = response.data[0].you;
    }.bind(this)).catch(function(errors) {
      console.log(errors.response.data.errors);
    });
  },
  methods: {
    scrollBottom: function() {
      var messageBox = document.getElementById("msgBox");
      messageBox.scrollTop = messageBox.clientHeight;
      console.log(messageBox.scrollTop);
    },
    orderMessages: function() {
      this.messages = this.messages.sort();
    },
    sendMessage: function() {
      var db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
      db = db.collection('messages');

      db.add({
        body: this.outgoingMessage,
        conversation_id: this.convoId,
        user_id: this.myId,
        sent_at: new Date()
      }).then(function(message) {
        console.log(message.id);
      });
      this.orderMessages();
    },

    loadConversations: function(id) {
      this.convoId = id;
      this.messages = [];
      var conversation = [];
      var db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
      var convId = id.toString();
      var dbRef = db.collection('messages').where("conversation_id", "==", id);

      // gets messages from firebase for the chosen conversation
      dbRef.orderBy("sent_at").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(message) {
          this.messages.push(message.data());
        }.bind(this));
        // gets rid of the most recent message in the conversation, since the function below is going to recieve the most recent message, and then watch for any future messages
        this.messages.pop();
      }.bind(this));
      // This is what watches for new messages to be added/sent
      var x = this.messages;
      dbRef.orderBy("sent_at").onSnapshot(function(snapshot) {
        var newMessage = [];
        snapshot.forEach(function(message) {
          newMessage = message.data();
          console.log(message.data());
        }.bind(this));
        x.push(newMessage);
        // this.messages = [];
        this.messages = x;
        this.scrollBottom();
      }.bind(this));
    },

    theirId: function(id) {
      if (id === this.myId) {
        "a";
      } else if (id === 0) {
        return 'a';
      } else {
        return id;
      }
    }
  },
  computed: {
  }
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
      preference: "",
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
        preference: this.preference,
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
    { path: "/conversations", component: ConversationsPage },
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