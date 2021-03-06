<template>
  <!-- If not loaded -->
  <v-container v-if="is_all_loaded === false">
    <v-row justify="start" class="text-h5 mb-3 white--text">Interests</v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="list-item-avatar, article, actions" dark />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="list-item-avatar-two-line, article, actions" dark />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="is_all_loaded==='error'" class="mt-10">
    <v-row justify="start" class="text-h5 mb-3 white--text">Interests</v-row>
    <v-row justify="center">
      <v-img :src="require('../../assets/notfound1.png')" height="300px" max-width="600px" />
    </v-row>
    <v-row justify="center" class="text-h3 mt-5">No content yet!!!</v-row>
  </v-container>
  <!-- If loaded -->
  <v-container v-else>
    <v-row justify="start" class="text-h5 mb-3 white--text">Interests</v-row>
    <!-- -------------------------------------------------
                ITERATE THE CARDS HERE
    --------------------------------------------------------->
    <v-card class="transparent" elevation="0">
      <v-row justify="center">
        <v-col v-for="(chamber,i) in suggested_chambers" :key="i" cols="12" sm="6">
          <v-hover v-slot:default="{ hover }">
            <v-card
              class="cardbg"
              max-width="500px"
              :class="{ 'on-hover': hover }"
              :elevation="hover ? 12 : 2"
            >
              <v-container class="pb-0 mb-0">
                <v-row justify="center" class="elevation-1 pa-0 ma-0">
                  <v-col cols="12" md="8" class="d-flex justify-center">id: {{chamber._id}}</v-col>
                  <v-col cols="12" md="4" class="green--text d-flex justify-center">
                    <v-chip small color="green">{{chamber.active_user_count}} online</v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- image -->
                  <v-col
                    cols="12"
                    md="3"
                    align-self="center"
                    class="fill-height d-flex flex-column align-center"
                  >
                    <v-img
                      v-if="chamber.photo_url"
                      :src="chamber.photo_url"
                      max-width="100%"
                      max-height="100%"
                      class="elevation-10"
                    />
                    <v-row v-if="user_id===chamber.created_by_userid" justify="center" class="mt-5">
                      <v-chip>Your chamber</v-chip>
                    </v-row>
                  </v-col>
                  <v-col class="pa-5">
                    <v-row class="ma-0 pa-0">
                      <v-col class="ma-0 pa-0">created date:</v-col>
                      <v-col
                        class="ma-0 pa-0"
                      >{{new Date(parseInt(chamber.created)).toLocaleDateString("en-US")}}</v-col>
                    </v-row>
                    <v-row class="ma-0 pa-0">
                      <v-col class="ma-0 pa-0">creator:</v-col>
                      <v-col class="ma-0 pa-0">{{chamber.created_by_name}}</v-col>
                    </v-row>
                    <v-row class="ma-0 pa-0">
                      <v-col class="ma-0 pa-0">name:</v-col>
                      <v-col class="ma-0 pa-0">{{chamber.chamber_name}}</v-col>
                    </v-row>
                    <v-row class="ma-0 pa-0">
                      <v-col class="ma-0 pa-0">description:</v-col>
                      <v-col class="ma-0 pa-0">{{chamber.chamber_description}}</v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-chip
                    class="ml-1 mr-1 mb-2 white--text"
                    color="#1D1D1D"
                    v-for="(chip,i) in chamber.hashtags.map(x=>`#${x}`)"
                    :key="i"
                  >{{chip}}</v-chip>
                </v-row>
                <v-row class="pb-0 mb-0">
                  <v-btn
                    block
                    color="#1D1D1D"
                    class="white--text"
                    @click="joinchamber(chamber._id)"
                  >Join chamber</v-btn>
                </v-row>
              </v-container>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-card>
    <!-- -------------------------------------------------
                        PAGINATION
    --------------------------------------------------------->
    <v-row justify="center" class="titlebg mt-10">
      <v-pagination v-model="page_number" :length="lengthofpageination" :total-visible="7"></v-pagination>
    </v-row>
    <!-- common dialog box -->
    <dialog-box />
  </v-container>
</template>
<script>
import Cookies from "universal-cookie";
import dialogbox from "../../components/miscellaneous/alert";
import mixin from "../../mixin/joinleave_mixin";
const cookies = new Cookies();
export default {
  name: "trending_chamberss",
  mixins: [mixin],
  components: {
    "dialog-box": dialogbox
  },
  data: () => ({
    // check for all loaded
    is_all_loaded: false,
    // checkfor all loaded
    suggested_chambers: [],
    page_number: 1,
    total_items: 0,
    items_per_page: 4
  }),
  methods: {},
  mounted() {
    this.$axios
      .post(
        "/findbyinterest",
        { items_per_page: this.items_per_page, page_number: this.page_number },
        {
          headers: { Authorization: `Bearer ${cookies.get("token")}` }
        }
      )
      .then(Response => {
        console.log(Response.data);
        if (Response.data.success) {
          if (Response.data.success.length > 0) {
            this.suggested_chambers = Response.data.success;
            this.total_items = Response.data.success.length;
            this.is_all_loaded = true;
          }
        } else if (Response.data.error) {
          this.is_all_loaded = "error";
        } else {
          this.is_all_loaded = "error";
        }
      });
    this.$emit("settab", { id: 2, name: "interest" });
  },
  computed: {
    user_id: function() {
      return this.$store.state.userid;
    },
    lengthofpageination: function() {
      return Math.ceil(this.total_items / this.items_per_page);
    }
  }
};
</script>
<style scoped>
.cardbg {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 0%,
    rgba(225, 181, 91, 1) 65%,
    rgba(255, 255, 255, 1) 100%
  );
}
</style>