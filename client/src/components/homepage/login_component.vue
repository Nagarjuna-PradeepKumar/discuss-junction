<template>
  <v-container>
    <!-- Card component for login -->
    <v-row justify="center">
      <v-col>
        <!-- If user is not logged in -->
        <v-card
          elevation="24"
          class="pa-6 ma-10 mt-16"
          v-if="isuserpresent===false"
          dark
          width="fit-content"
        >
          <v-container>
            <v-row class="text-h5 orange--text" justify="center">Login</v-row>
            <v-row
              justify="center"
              v-if="errormessage!=''"
              class="red--text mt-3 errormessagedisplay"
            >{{errormessage}} !</v-row>
            <v-row justify="center" class="mt-5">
              <v-form ref="loginform">
                <v-row>
                  <v-text-field
                    dense
                    outlined
                    label="email"
                    type="text"
                    v-model="send.user_email"
                    prepend-icon="mdi-account-box"
                    color="orange"
                    :rules="[ v => !!v || 'E-mail is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid',]"
                  />
                </v-row>
                <v-row>
                  <v-text-field
                    dense
                    outlined
                    label="password"
                    type="password"
                    v-model="send.user_password"
                    prepend-icon="mdi-lock"
                    required
                    @keydown.enter.prevent="login"
                    color="orange"
                    :rules="v => !!v || 'Name is required'"
                  />
                </v-row>
                <v-row justify="center">
                  <v-btn
                    small
                    class="primary"
                    @click.prevent="login"
                    :loading="loginload"
                    :disabled="loginload"
                  >Login</v-btn>
                </v-row>
                <v-row justify="center" class="mt-2">
                  <router-link to="/forgotpassword" class="signuptext">
                    <p>forgot password</p>
                  </router-link>
                </v-row>
              </v-form>
            </v-row>
          </v-container>
        </v-card>
        <!-- If user is already loggedin -->
        <v-card elevation="24" class="pa-6" v-if="isuserpresent===true" dark>
          <v-container>
            <v-row justify="center" class="imagewrapper">
              <v-img :src="signeduserimage" class="loggedinuser" v-if="signeduserimage"></v-img>
              <v-img
                v-else-if="signedusergender==='female'"
                :src="require('../../assets/female.jpg')"
                class="loggedinuser"
              ></v-img>
              <v-img
                v-else-if="signedusergender==='male'"
                :src="require('../../assets/male.jpeg')"
                class="loggedinuser"
              ></v-img>
              <v-img v-else :src="require('../../assets/commonimage.png')" class="loggedinuser"></v-img>
            </v-row>
            <v-row justify="center" class="mt-5">
              <v-form ref="loginform">
                <v-row>
                  <v-text-field
                    dense
                    label="email"
                    type="text"
                    v-model="signedusermail"
                    prepend-icon="mdi-account-box"
                    required
                  />
                </v-row>
                <v-row justify="center">
                  <v-btn small class="primary mb-5" @click="gotoprofile">Login</v-btn>
                </v-row>
                <v-btn
                  block
                  small
                  class="primary"
                  @click="isuserpresent=false"
                >Login as another user</v-btn>
              </v-form>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <!-- Show signup here -->
    <v-row justify="center" class="white--text">
      <span>Not an existing user ?</span>
    </v-row>
    <v-row justify="center">
      <router-link to="/signup" class="signuptext">
        <p>signup</p>
      </router-link>
    </v-row>
    <dialog-box />
  </v-container>
</template>

<script>
import Cookies from "universal-cookie";
import dialogbox from "../miscellaneous/alert.vue";
const cookies = new Cookies();
export default {
  components: {
    "dialog-box": dialogbox
  },
  data: () => ({
    isuserpresent: false,
    loginload: false,
    signedusermail: "",
    signeduserimage: "",
    signedusergender: "",
    errormessage: "",
    send: {
      user_email: "",
      user_password: ""
    }
  }),
  methods: {
    login: function() {
      this.errormessage = "";
      if (
        this.send.user_email === "" ||
        this.send.user_password === "" ||
        !this.$refs.loginform.validate()
      ) {
        return (this.errormessage = "Enter valid credentials");
      } else {
        this.loginload = true;
        this.errormessage = "";
        this.$axios.post("/login", this.send).then(Response => {
          if (Response.data.success) {
            cookies.set("token", Response.data.success, {
              expires: new Date(Date.now() + 2.592e8),
              secure: false,
              sameSite: true
            });
            this.$store.dispatch("setuserid", {
              user_id: Response.data.user_id,
              user_name: Response.data.user_name
            });
            this.$router.push("profile");
          }
          if (Response.data.error) {
            this.loginload = false;
            this.errormessage = Response.data.error;
          }
        });
      }
    },
    gotoprofile: function() {
      this.$router.push("profile");
    }
  },
  mounted() {
    if (cookies.get("token")) {
      this.loginload = true;
      this.$axios
        .post("/verify", {
          token: `${cookies.get("token")}`
        })
        .then(Response => {
          if (Response.data.success) {
            this.loginload = false;
            this.isuserpresent = true;
            this.signedusermail = Response.data.email;
            this.signeduserimage = Response.data.image;
            this.signedusergender = Response.data.user_gender;
            this.$store.dispatch("setuserid", {
              user_id: Response.data.user_id,
              user_name: Response.data.user_name
            });
          } else {
            this.loginload = false;
          }
        });
    }
  }
};
</script>
<style scoped>
.signuptext {
  text-decoration: none;
  color: #f3bc33;
}
.loggedinuser {
  max-width: 150px;
  max-height: 150px;
  clip-path: circle(50%);
}
.imagewrapper {
  filter: drop-shadow(0px 0px 250px #2907e6);
}

.errormessagedisplay {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.5s;

  /* When the animation is finished, start again */
  animation-iteration-count: 2s;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>