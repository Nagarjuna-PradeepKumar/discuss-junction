<template>
  <v-container>
    <!-- logo of discuss junction -->
    <v-row id="logo">
      <v-col></v-col>
    </v-row>
    <!-- Card component for login -->
    <v-row>
      <v-col>
        <v-card elevation="24" class="pa-6" dark min-height="300px">
          <v-overlay :value="overlay" absolute color="primary">
            <v-progress-circular indeterminate size="50"></v-progress-circular>
          </v-overlay>
          <v-card-subtitle class="text-center orange--text">Resend activation link</v-card-subtitle>
          <!-- Error message display -->
          <v-row
            justify="center"
            v-if="errormessage!=''"
            class="red--text mt-3 mb-3 errormessagedisplay"
          >{{errormessage}} !</v-row>
          <!-- success message display -->
          <v-row
            justify="center"
            v-if="successmessage!=''"
            class="green--text mt-3 mb-3 errormessagedisplay"
          >{{successmessage}} !</v-row>
          <v-row justify="center">
            <v-form ref="loginform">
              <v-text-field
                dense
                label="email"
                type="text"
                v-model="send.user_email"
                prepend-icon="mdi-account-box"
                required
                :rules="[v => !!v || 'Username is required']"
                color="orange"
              />
              <v-btn block small class="primary mt-5" @click.prevent="resend">Resend</v-btn>
            </v-form>
          </v-row>
          <!-- Show signup here -->
          <v-row justify="center" class="white--text mt-10">
            <span>Not an existing user ?</span>
          </v-row>
          <v-row justify="center" class="white--text">
            <router-link to="/signup" class="signuptext">
              <p>signup</p>
            </router-link>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <dialog-box />
  </v-container>
</template>

<script>
import dialogbox from "../miscellaneous/alert.vue";
export default {
  components: {
    "dialog-box": dialogbox
  },
  data: () => ({
    overlay: false,
    errormessage: "",
    successmessage: "",
    send: {
      user_email: ""
    }
  }),
  methods: {
    resend: function() {
      this.errormessage = "";
      this.successmessage = "";
      this.overlay = true;
      this.$axios.post("/resendactivation", this.send).then(Response => {
        if (Response.data.success) {
          this.overlay = false;
          this.successmessage = Response.data.success;
        }
        if (Response.data.error) {
          this.errormessage = Response.data.error;
          this.overlay = false;
        }
      });
    }
  }
};
</script>
style <style scoped>
.signuptext {
  text-decoration: none;
  color: #f3bc33;
}
.errormessagedisplay {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.5s;

  /* When the animation is finished, start again */
  animation-iteration-count: 2s;
}
.successmessagedisplay {
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