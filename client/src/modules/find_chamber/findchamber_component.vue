<template>
  <v-container>
    <!-- -----------------------------------------
                  title bar and tabbed panel
    ------------------------------------------->
    <v-row class="ma-0 pa-0">
      <!------- tabs or bread crumbs ---------->
      <v-tabs v-model="currenttab.id" class="ma-0 pa-0" color="titlebg">
        <v-tab @click="changetab('/profile/findchamber/',{id:0,name:'suggestions'})">suggestions</v-tab>
        <v-tab
          @click="changetab('/profile/findchamber/trending',{id:1,name:'trending_chamber'})"
        >trending</v-tab>
        <v-tab @click="changetab('/profile/findchamber/interest',{id:2,name:'interest'})">interests</v-tab>
        <v-spacer />
        <v-spacer />
        <v-text-field
          v-model="search_text"
          outlined
          dense
          class="ma-1 black--text"
          :placeholder="searchbyid?'search by id':'search by name'"
          @keypress.enter="submit_search"
          color="titlebg"
        />
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          left
          nudge-bottom
          nudge-left
          bottom
          offset-y
          z-index="1"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="white mt-1" v-bind="attrs" v-on="on">
              <v-icon color="black">mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-container>
              <v-card-title class="pa-0 ma-0">search options</v-card-title>
              <v-divider class="ma-0 pa-0" />
              <v-card-subtitle class="ma-0">Search by</v-card-subtitle>
              <v-switch v-model="searchbyid" label="search by id" dense class="pa-0 ma-0" />
              <v-divider class="ma-0 pa-0" />
              <v-card-subtitle class="ma-0">Show</v-card-subtitle>
              <v-switch
                v-model="showonlyactive"
                label="show only active"
                dense
                class="pa-0 ma-0"
                :disabled="searchbyid"
              />
              <v-divider class="ma-0 pa-0" />
              <v-card-subtitle class="ma-0">sort</v-card-subtitle>
              <v-radio-group v-model="sortby" class="ma-0 pa-0">
                <v-radio label="by relevance" value="relevance" class="ma-0 pa-0" />
                <v-radio label="by active users" value="activeusers" class="ma-0 pa-0" />
              </v-radio-group>
            </v-container>
          </v-card>
        </v-menu>
      </v-tabs>
    </v-row>
    <!-- -------------------------------------------
                  Main content
    ----------------------------------------------->
    <v-row class="mt-5">
      <v-container class="mt-0 pt-0">
        <router-view
          v-on:settab="settab"
          v-on:submit_search="submit_search"
          v-bind:search_result="search_result"
          v-if="!search_mode"
        />
      </v-container>
    </v-row>
    <!-- common dialog box -->
    <dialog-box />
  </v-container>
</template>
<script>
import Cookies from "universal-cookie";
import dialogbox from "../../components/miscellaneous/alert";
const cookies = new Cookies();
export default {
  name: "findchamber_component",
  components: {
    "dialog-box": dialogbox
  },
  data: () => ({
    datas: [],
    component_name: "suggestions",
    menu: false,
    search_mode: false,
    search_text: "",
    search_result: "",
    searchbyid: false,
    sortby: "relevance",
    showonlyactive: false,
    currenttab: { id: 0, name: "suggestions" }
  }),
  mounted() {
    this.$emit("settab", { id: 1, name: "findchamber" });
    this.search_mode = false;
  },
  methods: {
    changetab: function(route, tab) {
      this.currenttab = tab;
      this.search_mode = false;
      if (this.$route.path !== route) this.$router.push(route);
    },
    settab: function(tabs) {
      this.search_mode = false;
      this.currenttab = tabs;
    },
    submit_search: async function(data) {
      this.search_result = [];
      if (this.$route.path !== "/profile/findchamber/search")
        this.$router.push("/profile/findchamber/search");
      if (this.search_text != "") {
        if (this.searchbyid === false) {
          this.search_result = "loading";
          this.$axios
            .post(
              "/searchchamber",
              {
                showonlyactive: this.showonlyactive,
                search: this.search_text,
                sortby: this.sortby,
                page_number: data.pageno || 1,
                items_per_page: data.items_per_page || 4
              },
              {
                headers: {
                  Authorization: `Bearer ${await cookies.get("token")}`
                }
              }
            )
            .then(Response => {
              if (Response.data.success) {
                this.search_result = Response.data.success;
              }
              if (Response.data.error) {
                if (Response.data.error === "No data found") {
                  this.search_result = "nodata";
                } else {
                  this.$store.dispatch("alertdialog", {
                    show: true,
                    type: "warning darken-2",
                    title: "Sorry !",
                    message: Response.data.error,
                    buttontext: "ok"
                  });
                }
              }
            });
        } else {
          this.$axios
            .post(
              "/searchchamber",
              {
                showonlyactive: false,
                sortby: "chamberid",
                search: this.search_text
              },
              {
                headers: {
                  Authorization: `Bearer ${await cookies.get("token")}`
                }
              }
            )
            .then(Response => {
              if (Response.data.success) {
                console.log(Response.data.success);
                this.search_result = {
                  document: [Response.data.success],
                  count: { count: 1 }
                };
              }
              if (Response.data.error) {
                if (Response.data.error === "No data found") {
                  this.search_result = "nodata";
                } else {
                  this.$store.dispatch("alertdialog", {
                    show: true,
                    type: "warning darken-2",
                    title: "Sorry !",
                    message: Response.data.error,
                    buttontext: "ok"
                  });
                }
              }
            });
        }
      } else {
        this.$store.dispatch("alertdialog", {
          show: true,
          type: "yellow darken-2",
          title: "Warning !",
          message: "empty searches are not allowed",
          buttontext: "ok"
        });
      }
    }
  }
};
</script>