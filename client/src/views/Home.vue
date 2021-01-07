<template>
  <v-app id="app">
    <v-container class="fill-height">
      <v-row id="main">
        <!-- information about the discuss junction -->
        <v-col id="information" cols="12" sm="6" align-self="center">
          <v-row justify="center">
            <img class="logopic" src="../assets/Discuss.png" alt="logo" />
          </v-row>
          <v-row
            justify="center"
            class="mt-10 text-overline white--text text-center"
          >What is better than talking to someone on topics that we love ?</v-row>
          <v-row
            justify="center"
            class="mt-2 text-overline white--text text-center"
          >Create your own chamber and discuss.</v-row>
        </v-col>
        <!-- signin or login component -->
        <v-col id="signup-or-login-component" cols="12" sm="6" align-self="center">
          <router-view />
        </v-col>
      </v-row>
      <!-- credits in bottom of page -->
      <v-row id="credits"></v-row>
    </v-container>
    <internetchecker />
  </v-app>
</template>
<script>
import internetchecker from "../components/checknetwork/internetchecker";
export default {
  components: { internetchecker },
  data: () => ({})
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
  max-width: 350px;
}
</style>>
