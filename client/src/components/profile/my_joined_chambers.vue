<template>
  <v-container>
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 10 : 2" class="mb-0">
        <v-container class="cardbg">
          <v-row class="pl-8 pr-8 mb-0 pb-0">
            <v-col cols="12" md="3">
              <v-row justify="center">
                <v-img
                  :src="chamber.photo_url"
                  v-if="chamber.photo_url"
                  max-width="100px"
                  max-height="100px"
                  class="elevation-2"
                />
              </v-row>
            </v-col>
            <v-col class="white--text" cols="12" md="9">
              <v-row class="pa-0 ma-0">
                <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">Joined date:</v-col>
                <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">{{date}}</v-col>
              </v-row>
              <v-row class="pa-0 ma-0">
                <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">chamber name:</v-col>
                <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">{{chamber.chamber_name}}</v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">chamber description:</v-col>
                <v-col class="mt-0 pt-0 mb-0 pb-0" cols="6">{{chamber.chamber_description}}</v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="mb-2 white--text" justify="center">hashtags:</v-row>
          <v-row class="ml-5 mr-5" justify="center">
            <v-chip v-for="(chip,i) in chamber.hashtags" :key="i" class="mr-1 ml-1">{{chip}}</v-chip>
          </v-row>
        </v-container>
      </v-card>
    </v-hover>
    <!-- common dialog box -->
    <dialog-box />
  </v-container>
</template>
<script>
import dialogbox from "../../components/miscellaneous/alert";
export default {
  components: {
    "dialog-box": dialogbox
  },
  name: "joinchambercards",
  props: ["chamber", "index"],
  data: () => ({}),
  computed: {
    date: function() {
      return new Date(parseInt(this.chamber.joined_date)).toLocaleDateString(
        "en-US"
      );
    }
  }
};
</script>
<style scoped>
.cardbg {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 24%,
    rgba(252, 202, 100, 1) 100%
  );
}
</style>