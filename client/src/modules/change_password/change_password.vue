<template>
  <v-container class="fill-height">
    <!-- Card component for reset password -->
    <v-row justify="center">
      <v-card elevation="24" class="pa-10" dark min-height="300px">
        <v-overlay :value="overlay" absolute color="primary">
          <v-progress-circular indeterminate size="50"></v-progress-circular>
        </v-overlay>
        <v-card-subtitle class="text-center orange--text">change password</v-card-subtitle>
        <!-- Error message display -->
        <v-row
          justify="center"
          v-if="errormessage!=''"
          class="red--text mt-3 mb-8 errormessagedisplay"
        >{{errormessage}} !</v-row>
        <!-- success message display -->
        <v-row
          justify="center"
          v-if="successmessage!=''"
          class="green--text mt-3 mb-8 errormessagedisplay"
        >{{successmessage}} !</v-row>
        <v-row justify="center">
          <!-- Forgot password form -->
          <v-form ref="changepasswordform">
            <v-text-field
              dense
              label="current password"
              type="password"
              v-model="send.old_password"
              prepend-icon="mdi-lock"
              required
              :rules="[v => !!v || 'password is required']"
              color="orange"
            />
            <v-text-field
              dense
              label="new password"
              type="password"
              v-model="send.new_password"
              prepend-icon="mdi-lock-reset"
              required
              :rules="[v => !!v || 'retype password is required']"
              color="orange"
              @keypress.enter="submit"
            />

            <v-btn block small class="primary mt-5" @click.prevent="submit">submit</v-btn>
          </v-form>
        </v-row>
      </v-card>
    </v-row>
    <dialog-box />
  </v-container>
</template>

<script>
import dialogbox from "../../components/miscellaneous/alert.vue";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export default {
  components: {
    "dialog-box": dialogbox
  },
  data: () => ({
    overlay: false,
    errormessage: "",
    successmessage: "",
    send: {
      old_password: "",
      new_password: ""
    }
  }),
  methods: {
    submit: async function() {
      this.errormessage = "";
      this.successmessage = "";
      this.overlay = true;
      this.$axios
        .post("/changepassword", this.send, {
          headers: {
            Authorization: `Bearer ${await cookies.get("token")}`
          }
        })
        .then(Response => {
          if (Response.data.success) {
            this.successmessage = "Changed password successfully !";
            this.overlay = false;
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