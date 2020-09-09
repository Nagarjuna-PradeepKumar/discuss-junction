<template>
  <!-- If not loaded -->
  <v-container v-if="is_all_loaded === false">
    <v-row>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="list-item-avatar, article, actions" dark />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="list-item-avatar-two-line, article, actions" dark />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="list-item-avatar-two-line, article, actions" dark />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="is_all_loaded==='error'" class="mt-10">
    <v-row justify="center">
      <v-img :src="require('../../assets/error.png')" height="300px" max-width="600px" />
    </v-row>
    <v-row justify="center" class="text-h1 mt-5">whOOPS!!!</v-row>
  </v-container>

  <!-- Outer container -->
  <v-container v-else>
    <!-- two columns holder -->
    <v-row>
      <!-- left container -->
      <v-col cols="12" md="6">
        <!-- profile details here -->
        <v-row justify="start" class="sandalbg elevation-10">
          <!-- <v-card> -->
          <div class="text-h6 mt-2 ml-5">Your details</div>
          <!-- idcard -->
          <v-container class="pl-10 pr-10">
            <v-row v-if="userdetails" justify="center">
              <!-- picture -->
              <v-col cols="12" md="4" class="d-flex justify-center">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    :elevation="hover ? 0 : 0"
                    min-height="150px"
                    min-width="150px"
                    max-height="150px"
                    max-width="150px"
                  >
                    <v-img
                      :src="userdetails.user_picture || require('../../assets/commonimage.png')"
                    >
                      <v-fade-transition>
                        <v-card-title
                          class="black--text pt-0 mt-0 transition-ease"
                          v-show="hover? true:false"
                        >
                          <v-row justify="end" class="pt-0 mt-0">
                            <v-btn color="transparent" fab @click="picture_uploader=true">
                              <v-icon :class="{ 'show-btns': hover }" color="black">mdi-pencil</v-icon>
                            </v-btn>
                          </v-row>
                        </v-card-title>
                      </v-fade-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-col>
              <!-- profile details -->
              <v-col cols="12" md="8">
                <v-hover v-slot:default="{ hover }">
                  <v-card :elevation="hover ? 10 : 0" class="pl-5 pr-5 pt-1" min-height="150px">
                    <v-btn
                      color="transparent"
                      absolute
                      fab
                      top
                      right
                      v-show="hover? true:false"
                      @click="changeuserdetails=true"
                    >
                      <v-icon color="black">mdi-pencil</v-icon>
                    </v-btn>
                    <v-container>
                      <v-row class="pa-0 ma-0">
                        <v-col cols="4" class="pa-0 ma-0">name :</v-col>
                        <v-col class="pa-0 ma-0">{{userdetails.user_name}}</v-col>
                      </v-row>
                      <v-row v-if="userdetails.user_birthday" class="pa-0 ma-0">
                        <v-col cols="4" class="pa-0 ma-0">age :</v-col>
                        <v-col
                          class="pa-0 ma-0"
                        >{{Math.trunc((Date.now()-userdetails.user_birthday)*3.171e-11)}}</v-col>
                      </v-row>
                      <v-row v-else class="pa-0 ma-0">
                        <v-col cols="4" class="pa-0 ma-0">age:</v-col>
                        <v-col class="pa-0 ma-0">-- not available --</v-col>
                      </v-row>
                      <v-row class="pa-0 ma-0" v-if="userdetails.user_gender">
                        <v-col cols="4" class="pa-0 ma-0">gender :</v-col>
                        <v-col class="pa-0 ma-0">{{userdetails.user_gender}}</v-col>
                      </v-row>
                      <v-row class="pa-0 ma-0" v-else>
                        <v-col cols="4" class="pa-0 ma-0">gender :</v-col>
                        <v-col class="pa-0 ma-0">-- not available --</v-col>
                      </v-row>

                      <v-row class="pa-0 ma-0" v-if="userdetails.interests.length>0">
                        <v-col class="pa-0 ma-0" cols="4">interest :</v-col>
                        <v-col class="pa-0 ma-0">{{userdetails.interests.join(', ')}}</v-col>
                      </v-row>

                      <v-row class="pa-0 ma-0" v-else>
                        <v-col class="pa-0 ma-0" cols="4">interest :</v-col>
                        <v-col class="pa-0 ma-0">-- not available --</v-col>
                      </v-row>

                      <v-row class="pa-0 ma-0" v-if="userdetails.about">
                        <v-col class="pa-0 ma-0" cols="4">about :</v-col>
                        <v-col class="pa-0 ma-0">{{userdetails.about}}</v-col>
                      </v-row>

                      <v-row class="pa-0 ma-0" v-else>
                        <v-col class="pa-0 ma-0" cols="4">about :</v-col>
                        <v-col class="pa-0 ma-0">-- not available --</v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
          <!-- </v-card> -->
        </v-row>
        <!-- left container for editing and deleting JOINED chambers-->
        <v-row justify="center" class="mt-5">
          <v-col class="sandalbg" cols="12" v-if="joined_chamber_details.length>0">
            <v-row justify="center" class="ma-0 pa-0">
              <my_joined_chambers
                v-for="detail in joined_chamber_details "
                :key="detail._id"
                v-bind:chamber="detail"
              />
            </v-row>
            <v-row justify="center" class="mt-0">
              <v-col class="ma-0 pa-0">
                <v-pagination
                  v-model="joined_details_pageno"
                  class="my-4"
                  :total-visible="7"
                  :length="joinedchambers_total_count<joined_details_items_per_page ?1:Math.ceil(joinedchambers_total_count/joined_details_items_per_page) "
                ></v-pagination>
              </v-col>
            </v-row>
          </v-col>
          <!-- If joined chambers not found -->
          <v-col v-else>
            <v-card class="pr-10 pl-10 sandalbg">
              <v-row class="text-h6 pt-5" justify="center">You haven't joined a discussion yet !</v-row>
              <v-row justify="center" class="pa-10 ma-5">
                <img src="../../assets/notfound1.png" alt="notfound1" />
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- right container for editing and deleting created chambers-->
      <v-col
        class="sandalbackground mt-3 mb-3"
        cols="12"
        md="6"
        v-if="created_chamber_details.length>0"
      >
        <v-row justify="center">
          <my_created_chambers
            v-for="(detail,i) in created_chamber_details "
            :key="detail._id"
            v-bind:chamber="detail"
            v-bind:index="i"
            v-on:change_create_chamber_details="change_create_chamber_details"
            v-on:change_chamber_photo="change_chamber_photo"
          />
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-pagination
              v-model="created_details_pageno"
              class="my-4"
              :total-visible="7"
              :length="createdchambers_total_count<created_details_items_per_page ?1:Math.ceil(createdchambers_total_count/created_details_items_per_page) "
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else cols="12" sm="6">
        <v-card class="pr-10 pl-10 sandalbg">
          <v-row class="text-h6 pt-5 mb-5" justify="center">You have no chambers created !</v-row>
          <v-row justify="center" class="pa-10 ma-5">
            <img src="../../assets/notfound2.png" alt="notfound1" />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- common dialog box -->
    <dialog-box />
    <!-- upload photo dialogbox -->
    <v-dialog v-model="picture_uploader" max-width="500px" attach>
      <uploadprofilephoto v-on:changepic="changepic" />
    </v-dialog>
    <!-- change user details -->
    <v-dialog v-model="changeuserdetails" max-width="500px" attach>
      <change_userdetails v-on:changedetail="changedetail" v-bind:predetails="userdetails" />
    </v-dialog>
  </v-container>
</template>
<script>
import Cookies from "universal-cookie";
import dialogbox from "../../components/miscellaneous/alert";
import uploadprofilephoto from "../../components/profile/change_photo";
import change_userdetails from "../../components/profile/change_userdetails";
import my_created_chambers from "../../components/profile/my_created_chambers";
import my_joined_chambers from "../../components/profile/my_joined_chambers";
const cookies = new Cookies();
export default {
  components: {
    "dialog-box": dialogbox,
    uploadprofilephoto,
    change_userdetails,
    my_created_chambers,
    my_joined_chambers
  },
  name: "me_component",
  data: () => ({
    // check for all loaded
    is_all_loaded: false,
    // checkfor all loaded
    createdchambers_total_count: 0,
    created_details_pageno: 1,
    created_details_items_per_page: 2,
    joinedchambers_total_count: 0,
    joined_details_pageno: 1,
    joined_details_items_per_page: 1,
    datas: [],
    userdetails: null,
    created_chamber_details: [],
    joined_chamber_details: [],
    picture_uploader: false,
    changeuserdetails: false
  }),
  methods: {
    changepic: function(base) {
      if (base) {
        this.userdetails.user_picture = base.image;
        this.picture_uploader = false;
      } else {
        this.picture_uploader = false;
      }
    },
    changedetail: function(details) {
      if (details) {
        this.changeuserdetails = false;
        this.userdetails.user_gender = details.user_gender;
        this.userdetails.about = details.about;
        this.userdetails.interests = details.interests;
        this.userdetails.user_birthday = details.user_birthday;
      } else {
        this.changeuserdetails = false;
      }
    },
    change_create_chamber_details: function(detail) {
      if (detail.mode === "edit") {
        this.created_chamber_details[detail.index]._id = detail._id;
        this.created_chamber_details[detail.index].chamber_name =
          detail.chamber_name;
        this.created_chamber_details[detail.index].chamber_description =
          detail.chamber_description;
        this.created_chamber_details[
          detail.index
        ].hashtags = detail.hashtags.splice(0);
        this.created_chamber_details[detail.index].scheduled_time =
          detail.scheduled_time;
      }
      if (detail.mode === "delete") {
        this.created_chamber_details.splice(detail.index, 1);
      }
    },
    change_chamber_photo: function(data) {
      this.created_chamber_details[data.index].photo_url = data.image;
    }
  },
  mounted() {
    this.$emit("settab", { id: 0, name: "myprofile" });
  },
  async created() {
    this.$axios
      .post(
        "/getuserdetails",
        {
          created_details_pageno: this.created_details_pageno,
          created_details_items_per_page: this.created_details_items_per_page,
          joined_details_pageno: this.joined_details_pageno,
          joined_details_items_per_page: this.joined_details_items_per_page
        },
        {
          headers: {
            Authorization: "Bearer " + (await cookies.get("token"))
          }
        }
      )
      .then(Response => {
        if (Response.data.success) {
          console.log(Response.data.success);
          this.userdetails = Response.data.success.userdetails;
          this.created_chamber_details = Response.data.success.created_chambers;
          this.joined_chamber_details = Response.data.success.joined_chambers;
          this.createdchambers_total_count =
            Response.data.success.created_chambers.length > 0
              ? Response.data.success.created_chambers[0].count
              : 0;
          this.joinedchambers_total_count =
            Response.data.success.joined_chambers.length > 0
              ? Response.data.success.joined_chambers[0].count
              : 0;

          this.is_all_loaded = true;
        }
        if (Response.data.error) {
          this.$store.dispatch("alertdialog", {
            show: true,
            type: "red darken-2",
            title: "error !",
            message: Response.data.error,
            buttontext: "ok"
          });
          this.is_all_loaded = "error";
        }
      });
  },
  computed: {
    my_chamber_limited_detail: function() {
      return this.created_chamber_details.slice(
        (this.created_details_pageno - 1) * this.created_details_items_per_page,
        this.created_details_pageno * this.created_details_items_per_page
      );
    },
    joined_chamber_limited_detail: function() {
      return this.joined_chamber_details.slice(
        (this.joined_details_pageno - 1) * this.joined_details_items_per_page,
        this.joined_details_pageno * this.joined_details_items_per_page
      );
    }
  },
  watch: {
    created_details_pageno: async function() {
      this.$axios
        .post(
          "/getcreatedchamber",
          {
            created_details_pageno: this.created_details_pageno,
            created_details_items_per_page: this.created_details_items_per_page
          },
          {
            headers: {
              Authorization: "Bearer " + (await cookies.get("token"))
            }
          }
        )
        .then(Response => {
          this.created_chamber_details = Response.data.success;
          this.createdchambers_total_count =
            Response.data.success.length > 0
              ? Response.data.success[0].count
              : 0;
        })
        .catch(err => {
          console.log(err);
        });
    },
    joined_details_pageno: async function() {
      this.$axios
        .post(
          "/getjoinedchamber",
          {
            joined_details_pageno: this.joined_details_pageno,
            joined_details_items_per_page: this.joined_details_items_per_page
          },
          {
            headers: {
              Authorization: "Bearer " + (await cookies.get("token"))
            }
          }
        )
        .then(Response => {
          console.log(Response.data);
          this.joined_chamber_details = Response.data.success;
          this.joinedchambers_total_count =
            Response.data.success.length > 0
              ? Response.data.success[0].count
              : 0;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.sandalbg {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 24%,
    rgba(252, 202, 100, 1) 100%
  );
}
.sandalbackground {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 77%,
    rgba(252, 202, 100, 1) 100%
  );
}
</style>