<template>
  <v-app id="app">
    <v-container class="fill-height">
      <v-row id="main" justify="center">
        <!-- information about the discuss junction -->
        <v-col id="information" cols="12" sm="6" align-self="center">
          <v-row justify="center">
            <img class="logopic" src="../assets/Discuss.png" alt="logo" />
          </v-row>
          <v-row
            justify="center"
            class="mt-10 text-overline white--text text-center"
          >What is better than talking to someone on topics that we love?</v-row>
          <v-row
            justify="center"
            class="mt-2 text-overline white--text text-center"
          >Create your own chamber and discuss.</v-row>
          <v-row
            justify="center"
            class="mt-2 text-overline white--text text-center"
          >Thank you for your time here to discuss with the community.</v-row>
          <v-row
            justify="center"
            class="mt-2 text-overline white--text text-center"
          >Lets join hands to make the world better.</v-row>
          <v-row justify="center" class="mt-5 text-button white--text text-center">
            <v-btn depressed text class="orange--text" @click="login">signin again ?</v-btn>
          </v-row>
        </v-col>
      </v-row>
      <!-- credits in bottom of page -->
      <v-row id="credits"></v-row>
    </v-container>
  </v-app>
</template>

<script>
import Cookies from "universal-cookie";
const cookies = new Cookies();
export default {
  methods: {
    login: function() {
      this.$router.push("/");
    }
  },
  mounted() {
    cookies.remove("token");
    cookies.remove("io");
  }
};
</script>

<style scoped>
#app {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    161deg,
    rgba(29, 29, 29, 1) 59%,
    rgba(43, 4, 255, 1) 100%
  );
}
.holder {
  min-height: 100vh;
}
.logopic {
  width: 60%;
  max-width: 250px;
}
</style>>
