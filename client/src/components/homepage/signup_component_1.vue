
<template>
  <v-stepper v-model="element" dark>
    <!-- stepper headers -->
    <v-stepper-header>
      <v-stepper-step :complete="element > 1" step="1" />
      <v-divider></v-divider>
      <v-stepper-step :complete="element > 2" step="2" />
      <v-divider></v-divider>
      <v-stepper-step :complete="element > 3" step="3" />
      <v-divider></v-divider>
      <v-stepper-step :complete="element > 4" step="4">4</v-stepper-step>
    </v-stepper-header>
    <!-- stepper items -->
    <v-stepper-items>
      <!-- stepper item1 -->
      <v-stepper-content step="1">
        <v-card class="pa-6" dark>
          <v-overlay :value="overlay" absolute color="primary">
            <v-progress-circular indeterminate size="50"></v-progress-circular>
          </v-overlay>
          <v-container>
            <v-row justify="center" class="text-h6 orange--text">Signup</v-row>
            <v-card-subtitle class="text-center">
              <b>Set credentials</b>
            </v-card-subtitle>
            <v-row>
              <v-col>
                <v-form ref="signupform1">
                  <v-row>
                    <v-text-field
                      class="pb-3"
                      persistent-hint
                      hint="username cannot be changed further"
                      dense
                      label="user name"
                      type="text"
                      v-model="send.user_name"
                      prepend-icon="mdi-account-box"
                      color="orange"
                      :rules="[v => !!v || 'user name is required']"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      class="pb-3"
                      dense
                      label="email"
                      type="text"
                      v-model="send.user_email"
                      prepend-icon="mdi-account-box"
                      color="orange"
                      :rules="[v => !!v || 'E-mail is required',v => /.+@.+\..+/.test(v) || 'E-mail must be valid',]"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      dense
                      label="password"
                      type="password"
                      v-model="send.user_password"
                      prepend-icon="mdi-lock"
                      color="orange"
                      @keypress.enter="sendforactivation"
                      :rules="[v => !!v || 'Password is required',v => (v && v.length >= 8) || 'Password must be greater than 7 characters']"
                    />
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
            <v-row justify="end" class="ma-0">
              <v-btn color="primary" @click="sendforactivation">next</v-btn>
            </v-row>
          </v-container>
        </v-card>
        <v-row justify="center" class="mt-3">
          <v-btn text @click="cancel_1" :disabled="overlay">Cancel</v-btn>
        </v-row>
        <v-row justify="center">
          <v-btn
            text
            @click="resendactivationlink"
            class="text-caption orange--text"
            :disabled="overlay"
          >did not receive activation link after submitting details ?</v-btn>
        </v-row>
      </v-stepper-content>
      <!-- stepper content2 -->
      <v-stepper-content step="2">
        <v-card class="pa-10">
          <v-row class="mailsentimage" justify="center">
            <img src="../../assets/mailsent.png" alt="mailsent" />
          </v-row>
          <p
            class="mt-8"
          >The account activation link has been sent to your email-id click on that link to activate your profile</p>
          <v-row justify="center">
            <v-btn
              text
              @click="resendactivationlink"
              class="orange--text text-caption"
            >Resend activation link</v-btn>
          </v-row>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
    <dialog-box />
  </v-stepper>
</template>


<script>
import dialogbox from "../miscellaneous/alert.vue";
export default {
  components: {
    "dialog-box": dialogbox
  },
  data() {
    return {
      element: 1,
      overlay: false,
      send: {
        user_email: "",
        user_password: "",
        user_name: ""
      }
    };
  },
  methods: {
    cancel_1: function() {
      this.$router.push("/");
    },
    sendforactivation: function() {
      if (this.$refs.signupform1.validate()) {
        this.overlay = true;
        this.$axios.post("/signup", this.send).then(Response => {
          console.log(Response.data);
          if (Response.data.success) {
            this.element = 2;
            this.overlay = false;
          }
          if (Response.data.error) {
            this.overlay = false;
            this.$store.dispatch("alertdialog", {
              show: true,
              type: "yellow darken-2",
              title: "Warning !",
              message: Response.data.error,
              buttontext: "ok"
            });
          }
        });
      }
    },
    resendactivationlink: function() {
      this.$router.push("resendactivation");
    }
  }
};
</script>
style <style scoped>
.mailsentimage img {
  max-width: 250px;
}
</style>