<template>
  <v-snackbar v-model="snackbar" timeout="-1">
    <div>No internet connectivity</div>
    <template v-slot:action="{ attrs }">
      <v-btn icon color="orange" text v-bind="attrs" @click="snackbar = false">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: false
  }),
  mounted() {
    this.$axios
      .post("checknetwork")
      .then(() => {
        this.snackbar = false;
      })
      .catch(() => {
        this.snackbar = true;
      });
    setTimeout(() => {
      this.$axios.post("checknetwork").catch(() => {
        this.snackbar = true;
      });
    }, 60000);
  }
};
</script>

<style>
</style>