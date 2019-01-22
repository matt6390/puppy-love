/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      users: [{user:{}}],
      message: "Welcome to Vue.js!"

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
    removeProfile: function(profile, direction) {
      var swipe = '';
      if (direction === "left") {
        swipe = "bounceOutLeft";
      } else if (direction === "right") {
        swipe = "bounceOutRight";
      }

      var card = document.getElementById(profile.id);

      card.classList.add(swipe);
      // removes the class when the animation is done
      setTimeout(function() {
        card.classList.remove(swipe);
      }.bind(this), 500);  
      // takes a second for the vue to change when I .shift() the array, so I'm starting it 350ms before the animation ends. Seems to work well enough until I have better solution
      setTimeout(function() {
        this.users.shift();
      }.bind(this), 150);
    },

    swipeLeft: function(profile) {
      var params = {swiped_id: profile.id, status: 0};
      axios.post("/likes", params).then(function(response) {
        this.removeProfile(profile, "left");

      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.errors);
      });
    },

    swipeRight: function(profile) {
      var params = {swiped_id: profile.id, status: 1};
      axios.post("/likes", params).then(function(response) {
        this.removeProfile(profile, "right");

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
                // router.push("/conversations");
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
    },

    profilePic: function() {
      var pictures = this.users[0].pictures;
      var url = pictures[0].url;
      pictures.forEach(function(pic) {
        if (pic.profile_status === true) {
          url = pic.url;
        }
      });
      return url;
    }
  },
  computed: {
  }
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

      var time = new Date().toLocaleString();

      db.add({
        body: this.outgoingMessage,
        conversation_id: this.convoId,
        user_id: this.myId,
        sent_at: time
      }).then(function(message) {
      });
      this.outgoingMessage = "",
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
        }.bind(this));
        x.push(newMessage);
        // this.messages = [];
        this.messages = x;
        this.scrollBottom();
      }.bind(this));
    },

    theirId: function(id) {
      // this is used for the messages to determine whether to give it your-class or their-class
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

var UserEditPage = {
  template: "#user-edit-page",
  data: function() {
    return {
      user: {id:{}, pictures:[], f_name:{}, l_name:{}, email:{}, age:{}, zip:{}, gender:{}, preference:{}},
      pictureId: "",
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      zip: "",
      gender: "",
      preference: "",
      password: "",
      passwordConfirmation: "",
      errors: [],
      updates: []
    };
  },
  created: function() {
    axios.get("/users/current_user").then(function(response) {
      this.user = response.data;
      this.firstName = response.data.f_name;
      this.lastName = response.data.l_name;
      this.email = response.data.email;
      this.age = response.data.age;
      this.zip = response.data.zip;
      this.gender = response.data.gender;
      this.preference = response.data.preference;
      this.pictureId = response.data.pictures.find(function(picture) {
        if (picture.profile_status === true) {
          return picture.id;
        }
      }) || response.data.pictures[0];
    }.bind(this)).catch(function(error) {
      console.log(error.response.data.errors);
    });
  },
  methods: {
    updateProfilePic: function(picture) {
      axios.patch("/pictures/" + picture.id).then(function(response) {
        // makes sure that you didnt ask to change your current profilePic to profilePic
        if (!response.data.message) {
          location.reload();
        } else {
          console.log(response.data.message);
        }
      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.error);
      });
    },

    removePicture: function() {
      axios.delete("/pictures/" + this.pictureId.id).then(function(response) {
        location.reload();
      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.error);
      });

    },

    addPicture: function() {
      var picture = document.getElementById("newPic").files[0];
      // set the preview img to selected image
      document.getElementById('previewPic').src = URL.createObjectURL(picture);

      var ref = firebase.storage().ref();
      var upload = ref.child(this.user.id + "/" + picture.name).put(picture);

      // Monitors the Upload Progress
      upload.on("state_changed", function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        // Upload unsuccessful
      }, function() {
        // completed upload
        upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          // now we will create a picture reference in the Backend so that we do not have to make a reference to firebase every single time, and can rather just make fast queries

          var params = {};
          if (this.pictureId) {
            console.log("has profileId");
            params = {
              user_id: this.user.id,
              url: downloadURL,
              profile_status: false
            };
          } else {
            console.log("doesnt have profileId");

            params = {
              user_id: this.user.id,
              url: downloadURL,
              profile_status: true
            };
          }
          axios.post("/pictures", params).then(function(response) {
            if (response.data.message) {
              console.log(response.data.message);
            } else {
              location.reload();
            }
          });

        }.bind(this));
      }.bind(this));

    },

    submit: function() {
      var params = {};
      if (this.password === this.passwordConfirmation && this.password !== "") {
        params = {
          f_name: this.firstName,
          l_name: this.lastName,
          email: this.email,
          age: this.age,
          gender: this.gender,
          preference: this.preference,
          password: this.password,
          password_confirmation: this.password_confirmation
        };

        axios.patch("/users/" + this.user.id, params).then(function(response) {
          this.user = response.data;
          this.firstName = response.data.f_name;
          this.lastName = response.data.l_name;
          this.email = response.data.email;
          this.age = response.data.age;
          this.gender = response.data.gender;
          this.preference = response.data.preference;
          this.updates = [];
          this.updates.push("updated");
        }.bind(this)).catch(function(errors) {
          console.log(errors.response.data.error);
        });
      } else {
        this.errors.pop();
        this.errors.push("Password and Password Convfirmation must match");
      }

    }
  },
  computed: {}
};

var SheltersSearchPage = {
  template: "#shelters-search-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      corsUrl: "https://cors-anywhere.herokuapp.com/",
      puppyKey: "",
      puppyUrl: "http://api.petfinder.com/",
      zip: "",
      count: "",
      errors:[]

    };
  },
  mounted: function() {
    
  },
  created: function() {
    axios.get("/users/keys").then(function(response) {
      this.puppyKey = this.puppyKey + "&key=" + response.data.pet_key;
      this.zip = response.data.zip;
    }.bind(this)).catch(function(errors) {
      console.log(errors.response.data.error);
      router.push("/login");
    });
    // the little timer allows for the google script to load?
    // MAYBE, JUST A GUESS
    setTimeout(function() {
      var map;
      var center = {lat: 42.066477, lng: -87.762588};
      map = new google.maps.Map(document.getElementById('googleMaps'), {
        center: center,
        zoom: 11
      });
      var marker = new google.maps.Marker({position: center, map: map});
    }, 1000);

  },
  methods: {
    findPuppies: function() { 
      if (this.count !== "") {
        axios.get(this.corsUrl + this.puppyUrl + "shelter.find?format=json&location=" + this.zip + "&count=" + this.count + this.puppyKey).then(function(response) {
          // shelters is an [] of shelters
          var shelters = response.data["petfinder"]['shelters']['shelter'];
          // create the map
          var map;
          var zoom = 11;
          if (shelters.length > 15) {
            zoom = 10;
          } else if (shelters.length >= 25) {
            zoom = 9;
          }

          // set the center of the map
          var center = {lat: parseFloat(shelters[0]['latitude']['$t'], 10), lng: parseFloat(shelters[0]['longitude']['$t'], 10)};
          map = new google.maps.Map(document.getElementById('googleMaps'), {
            center: center,
            zoom: zoom
          });

          var infowindow = new google.maps.InfoWindow();
          // sets the variables so I can use them later
          var marker, i, button;
          var length = shelters.length;

          // create a marker and corresponding button-tag for each shelter that is returned
          for (i = 0; i < length; i++) {
            // coordinates
            var lat = parseFloat(shelters[i]['latitude']['$t']);
            var long = parseFloat(shelters[i]['longitude']['$t']);
            // creating the button
            button = document.createElement("A");
            button.appendChild(document.createTextNode(shelters[i]["name"]["$t"]));
            button.href = "#/shelters/" + shelters[i]['id']['$t'];
            document.body.appendChild(button);
            // Creates and sets the marker
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, long),
              label: i.toString(),
              map: map
            });

            // When a marker is clicked, it will display the name of the facility, which can be clicked to go to shelter show page
            google.maps.event.addListener(marker, 'mouseover', (function(marker, i, button) {
              return function() {
                infowindow.setContent(button);
                infowindow.open(map, marker);
              };
            })(marker, i, button));
          }
        }.bind(this));
      } else {
        this.errors = [];
        this.errors.push({error: "Please select a count"});
      }
    }
  },
  computed: {
  }
};

var ShelterShowPage = {
  template: "#shelter-show-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      corsUrl: "https://cors-anywhere.herokuapp.com/",
      puppyKey: "?format=json&output=full&id=" + this.$route.params.id,
      puppyUrl: "http://api.petfinder.com/",
      shelter: [],
      pets: []

    };
  },
  mounted: function() {
    
  },
  created: function() {
    axios.get("/users/keys").then(function(response) {
      this.puppyKey = this.puppyKey + "&key=" + response.data.pet_key;
      // get the pets available at that shelter
      axios.get(this.corsUrl + this.puppyUrl + "shelter.getPets" + this.puppyKey).then(function(response) {
        this.pets = response.data['petfinder']['pets']['pet'];
        // get Shelter information
        axios.get(this.corsUrl + this.puppyUrl + "shelter.get" + this.puppyKey).then(function(response) {
          this.shelter = response.data['petfinder']['shelter'];
          // errors for shelter.get
        }.bind(this)).catch(function(errors) {
          console.log(errors.response.data.error);
        });
        // errors for shelter.getPets
      }.bind(this)).catch(function(errors) {
        console.log(errors.response.data.error);
      });
      // errors for getting apiKeys
    }.bind(this)).catch(function(errors) {
      console.log(errors.response.data.error);
    });

  },
  methods: {
    petStatus: function(petStatus) {
      if (petStatus === "A") {
        return "Adoptable";
      } else if (petStatus === "H") {
        return "Holding";
      } else if (petStatus === "P") {
        return "Pending";
      } else if (petStatus === "X") {
        return "Already Adopted";
      }
    },
    picSize: function(pictures) {
      // returns the largest 
      var length = pictures.length;
      var mainPic = pictures[0]['$t'];

      for (var i = 0 ; i < length; i++) {
        if (pictures[i]['@size'] === "fpm") {
          mainPic = pictures[i]['$t'];
        } else if (pictures[i]['@size'] === "pn") {
          mainPic = pictures[i]['$t'];         
        } else if (pictures[i]['@size'] === "x") {
          mainPic = pictures[i]['$t'];         
        }
      }
      return mainPic;
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
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      zip: "",
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
        f_name: this.firstName,
        l_name: this.lastName,
        email: this.email,
        age: this.age,
        zip: this.zip,
        gender: this.gender,
        preference: this.preference,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      var auth = { auth:{ email: this.email, password: this.password}};
      axios
        .post("/users", params)
        .then(function(response) {
          axios
            .post("/user_token", auth)
            .then(function(response) {
              axios.defaults.headers.common["Authorization"] =
                "Bearer " + response.data.jwt;
              localStorage.setItem("jwt", response.data.jwt);
              router.push("/user-edit");
            })
            .catch(
              function(error) {
                router.push("/login");
              }.bind(this)
            );
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
    { path: "/user-edit", component: UserEditPage },
    { path: "/shelters", component: SheltersSearchPage },
    { path: "/shelters/:id", component: ShelterShowPage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});


var app = window.App = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});